import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  alienDictionary: {
    id: 'alienDictionary',
    title: 'Alien Dictionary (Topo Sort)',
    icon: <SpellCheck size={16} />,
    complexity: 'Time: O(N*L + K + E) | Space: O(K + E)',
    theme: 'violet',
    code: `class Solution {
    private List<Integer> topoSort(int V, List<List<Integer>> adj) {
        int indegree[] = new int[V];
        for (int i = 0; i < V; i++) {
            for (int it : adj.get(i)) {
                indegree[it]++;
            }
        }
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < V; i++) {
            if (indegree[i] == 0) q.add(i);
        }
        List<Integer> topo = new ArrayList<>();
        while (!q.isEmpty()) {
            int node = q.peek();
            q.remove();
            topo.add(node);
            for (int it : adj.get(node)) {
                indegree[it]--;
                if (indegree[it] == 0) q.add(it);
            }
        }
        return topo;
    }

    public String findOrder(String [] dict, int N, int K) {
        List<List<Integer>> adj = new ArrayList<>();
        for(int i = 0; i<K; i++) {
            adj.add(new ArrayList<>());
        }
        
        for(int i = 0; i<N-1; i++) {
            String s1 = dict[i];
            String s2 = dict[i+1];
            int len = Math.min(s1.length(), s2.length());
            for(int ptr = 0; ptr < len; ptr++) {
                if(s1.charAt(ptr) != s2.charAt(ptr)) {
                    adj.get(s1.charAt(ptr) - 'a').add(s2.charAt(ptr) - 'a');
                    break;
                }
            }
        }
        
        List<Integer> topo = topoSort(K, adj);
        String ans = "";
        for(int it : topo) {
            ans = ans + (char)(it + (int)('a'));
        }
        
        return ans;
    }
}`,
    desc: "Given a sorted dictionary of an alien language having N words and K starting alphabets, find the exact order of characters in the alien language. We deduce character precedence by comparing adjacent words. The first differing character between word1 and word2 dictates a directed edge (char1 -> char2). We build a directed graph of these rules and run Kahn's Algorithm (Topological Sort) to find the valid alphabet sequence!"
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|findOrder|topoSort|node|it|adj|indegree|N|K|dict|s1|s2|len|ptr|charAt|ans|Math|min|topo|q|add|isEmpty|peek|remove|length|get|LinkedList|Queue|ArrayList|List|Integer|String)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`code-line-${num}`} className={`flex relative z-10 min-h-[22px] transition-colors duration-200 ${active ? `active-code-line ${activeStyles.bg}` : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-10 select-none text-right pr-2 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[3px] flex items-center justify-between ${active ? `${activeStyles.text} font-black` : 'text-slate-600'}`}>
        <span className="w-3 flex justify-center">{active ? <ArrowRight size={10} className="animate-pulse" /> : ''}</span>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List'].includes(part);
            const isPointer = ['adj', 'indegree', 'node', 'it', 'N', 'K', 'i', 'q', 'dict', 's1', 's2', 'len', 'ptr', 'ans', 'topo'].includes(part);
            const isMapCall = ['findOrder', 'topoSort', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length', 'min', 'charAt'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"');
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isCharLiteral ? 'text-amber-300' :
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

// --- Main Application ---

export default function AlienDictionaryVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('alienDictionary');
  
  // Default: Input dictionary
  const [dictInput, setDictInput] = useState('baa, abcd, abca, cab, cad');
  const [kInput, setKInput] = useState('4');

  const [baseDict, setBaseDict] = useState<string[]>(['baa', 'abcd', 'abca', 'cab', 'cad']);
  const [baseK, setBaseK] = useState(4);
  const [baseN, setBaseN] = useState(5);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let words = dictInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        if (words.length === 0) words = ['baa', 'abcd', 'abca', 'cab', 'cad'];
        
        let k = parseInt(kInput.trim(), 10);
        if (isNaN(k) || k <= 0 || k > 26) k = 4; // Bound K

        setBaseDict(words);
        setBaseN(words.length);
        setBaseK(k);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [dictInput, kInput]);

  // Auto-scroll effect specifically targeting exact active line
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeLineElements = document.querySelectorAll('.active-code-line');
      activeLineElements.forEach(el => {
         if ((el as HTMLElement).offsetParent !== null) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
         }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, isFullscreen, activeTab]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone1D = (arr: any[]) => [...arr];

  // --- Graph Layout Mathematics ---
  // Using K as number of nodes
  const graphRadius = Math.max(160, baseK * 30);
  const svgSize = graphRadius * 2 + 120; // Padding on all sides

  const nodePositions = useMemo(() => {
    const pos: {x: number, y: number}[] = new Array(baseK).fill({x: 0, y: 0});
    if (baseK === 0) return pos;
    if (baseK === 1) return [{x: 0, y: 0}];

    for (let i = 0; i < baseK; i++) {
        const angle = (i / baseK) * 2 * Math.PI - Math.PI / 2;
        pos[i] = {
            x: graphRadius * Math.cos(angle),
            y: graphRadius * Math.sin(angle)
        };
    }
    return pos;
  }, [baseK, graphRadius]);

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const dict = baseDict;
    const N = baseN;
    const K = baseK;
    
    if (N === 0 || K === 0) return steps;

    // Local State Tracking
    let adj: number[][] = [];
    let indegree: number[] = Array(K).fill(0);
    let topo: number[] = [];
    let q: number[] = [];
    let ansStr = "";

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { adj: clone1D(adj.map(a => [...a])), N, K, dict, q: [...q], indegree: clone1D(indegree), topo: [...topo], ansStr, ...stateObj } 
    });

    add("Function Call", `public String findOrder(String [] dict, int N=${N}, int K=${K})\nInitiating Alien Dictionary analysis.`, 26, { phase: 'init' });
    
    // --- GRAPH FORMATION ---
    add("Init Graph", `List<List<Integer>> adj = new ArrayList<>();\nAllocating graph to map relative character priorities.`, 27, { phase: 'init_graph' });
    
    for (let i = 0; i < K; i++) {
        add("Create Adj Rows", `for(int i = 0; i<K; i++)\nCreating empty lists for all ${K} alien characters ('a' to '${String.fromCharCode(97 + K - 1)}').`, 28, { phase: 'init_adj_row', scanI: i });
        adj.push([]);
        add("Add Empty List", `adj.add(new ArrayList<>());\nRow ${String.fromCharCode(97 + i)} allocated successfully.`, 29, { phase: 'add_adj_row', scanI: i });
    }

    add("Dictionary Loop", `for(int i = 0; i<N-1; i++)\nComparing adjacent words in the sorted dictionary to infer character rules.`, 32, { phase: 'dict_loop' });

    for (let i = 0; i < N - 1; i++) {
        const s1 = dict[i];
        const s2 = dict[i+1];
        
        add("Extract Words", `String s1 = dict[i];\nString s2 = dict[i+1];\nExtracted "${s1}" and "${s2}".`, 34, { phase: 'extract_words', scanI: i, s1, s2 });
        
        let len = Math.min(s1.length, s2.length);
        add("Calculate Length", `int len = Math.min(s1.length(), s2.length());\nWe only compare up to the shortest length (${len}).`, 35, { phase: 'calc_len', scanI: i, s1, s2, len });

        add("Pointer Loop", `for(int ptr = 0; ptr < len; ptr++)\nIterating character by character to find the first mismatch.`, 36, { phase: 'ptr_loop', scanI: i, s1, s2, len });
        
        for (let ptr = 0; ptr < len; ptr++) {
            let c1 = s1.charAt(ptr);
            let c2 = s2.charAt(ptr);
            
            add("Compare Chars", `if(s1.charAt(ptr) != s2.charAt(ptr))\nComparing '${c1}' and '${c2}' at index ${ptr}.`, 37, { phase: 'compare_chars', scanI: i, s1, s2, len, ptr });

            if (c1 !== c2) {
                let u = c1.charCodeAt(0) - 97;
                let v = c2.charCodeAt(0) - 97;
                
                // Add Edge logic
                if (u >= 0 && u < K && v >= 0 && v < K) {
                    adj[u].push(v);
                    add("Inject Directed Edge", `adj.get(s1.charAt(ptr) - 'a').add(s2.charAt(ptr) - 'a');\nMismatch found! '${c1}' mathematically MUST come before '${c2}'. Adding edge ${c1} -> ${c2}.`, 38, { phase: 'inject_edge', scanI: i, s1, s2, len, ptr, activeNode: u, checkNode: v });
                }
                
                add("Break Loop", `break;\nRule established. We don't check further characters in this word pair.`, 39, { phase: 'break_loop', scanI: i, s1, s2 });
                break;
            }
        }
    }

    // --- KAHN'S BFS (Inside topoSort method call logically embedded) ---
    add("Call TopoSort", `List<Integer> topo = topoSort(K, adj);\nGraph fully built. Now executing Kahn's BFS Algorithm on the adjacency list.`, 44, { phase: 'call_topo' });
    
    // Simulating topoSort execution
    add("Init Indegree", `int indegree[] = new int[V];\nAllocated indegree array inside topoSort.`, 3, { phase: 'init_indegree' });
    
    for(let i = 0; i < K; i++) {
        for(let it of adj[i]) {
            indegree[it]++;
            add("Calc Indegree", `indegree[it]++;\nCharacter '${String.fromCharCode(i+97)}' points to '${String.fromCharCode(it+97)}'. '${String.fromCharCode(it+97)}' indegree increases.`, 6, { phase: 'calc_indegree', activeNode: i, checkNode: it });
        }
    }

    add("Init Queue", `Queue<Integer> q = new LinkedList<>();\nCreating BFS queue.`, 9, { phase: 'init_queue' });
    for(let i = 0; i < K; i++) {
        if(indegree[i] === 0) {
            q.push(i);
            add("Enqueue Source", `q.add(i);\n'${String.fromCharCode(i+97)}' has 0 prerequisites. It comes first! Enqueueing.`, 11, { phase: 'enqueue_zero', scanI: i });
        }
    }

    add("Init Topo List", `List<Integer> topo = new ArrayList<>();`, 13, { phase: 'init_topo_list' });

    while(q.length > 0) {
        let node = q[0];
        add("Peek Queue", `int node = q.peek();\nProcessing '${String.fromCharCode(node+97)}'.`, 15, { phase: 'q_peek', activeNode: node });
        
        q.shift();
        add("Dequeue", `q.remove();`, 16, { phase: 'q_remove', activeNode: node });
        
        topo.push(node);
        add("Add to Topo", `topo.add(node);\n'${String.fromCharCode(node+97)}' resolved! Added to sorted list.`, 17, { phase: 'topo_add', activeNode: node });

        for(let it of adj[node]) {
            indegree[it]--;
            add("Decrement Neighbor", `indegree[it]--;\n'${String.fromCharCode(node+97)}' is resolved. Decrementing dependent '${String.fromCharCode(it+97)}'.`, 19, { phase: 'dec_indegree', activeNode: node, checkNode: it });
            
            if(indegree[it] === 0) {
                q.push(it);
                add("Enqueue Newly Resolved", `q.add(it);\n'${String.fromCharCode(it+97)}' has no remaining dependencies. Enqueueing!`, 20, { phase: 'enqueue_new', activeNode: node, checkNode: it });
            }
        }
    }

    add("Return Topo", `return topo;\nTopological sort complete. Returning to findOrder function.`, 23, { phase: 'return_topo' });

    // --- STRING FORMATION ---
    add("Init Answer String", `String ans = "";\nInitializing output string.`, 45, { phase: 'init_ans' });

    for (let it of topo) {
        let charVal = String.fromCharCode(it + 97);
        ansStr += charVal;
        add("Append Character", `ans = ans + (char)(it + (int)('a'));\nConverting integer ${it} back to character '${charVal}'. Appending to answer.`, 47, { phase: 'append_char', activeNode: it, ansStr });
    }

    add("Final Return", `return ans;\nAlgorithm fully completed. Alien dictionary mapped!`, 50, { phase: 'done', isDone: true, isSuccess: true, ansStr });

    return steps;
  }, [baseDict, baseN, baseK]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
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

  // Keyboard Shortcuts
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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // --- Segregated Render Blocks for Clean Layout ---

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? 'bg-violet-900 border-violet-800' : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><SpellCheck size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-violet-400`}>
                    <CheckCircle2 size={24}/> ALIEN DICTIONARY SOLVED
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Final Character Hierarchy: <span className="text-white bg-violet-600 px-3 py-1 rounded-md ml-2 tracking-[0.3em] font-black">"{st.ansStr}"</span>
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('enqueue') || String(st.phase || '').includes('topo_add') || String(st.phase || '') === 'append_char' ? 'text-emerald-400' : (String(st.phase || '').includes('compare') || String(st.phase || '').includes('inject') ? 'text-amber-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('scan') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-center justify-center gap-4 xl:gap-12 w-full p-6 overflow-x-auto">
          
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><ArrowDownToLine size={12}/> indegree[] Array</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[240px] min-h-[70px]">
                  {st.indegree === undefined ? <span className="text-slate-300 font-mono italic text-xs py-4">Awaiting Topo Sort...</span> : (st.indegree || []).map((val: number, idx: number) => {
                      let isIncremented = (st.phase === 'calc_indegree') && (st.checkNode === idx);
                      let isDecremented = (st.phase === 'dec_indegree') && (st.checkNode === idx);
                      let isCheckingZero = (st.phase === 'enqueue_zero' || st.phase === 'enqueue_new') && (st.checkNode === idx || st.scanI === idx);
                      
                      let boxBg = val === 0 ? "bg-emerald-500 text-white border-emerald-600 shadow-sm" : "bg-slate-50 text-slate-400 border-slate-200";
                      if (isIncremented) boxBg = "bg-rose-500 text-white border-rose-600 scale-110 shadow-lg ring-2 ring-rose-200 animate-in zoom-in";
                      if (isDecremented) boxBg = "bg-amber-400 text-white border-amber-500 scale-110 shadow-lg ring-2 ring-amber-200 animate-in zoom-in";
                      if (isCheckingZero) boxBg += " ring-4 ring-sky-400 ring-offset-2 border-transparent scale-110 z-10 relative";

                      return (
                          <div key={`in-${idx}`} className="flex flex-col items-center">
                              <span className="text-[8px] font-mono font-bold mb-0.5 text-slate-400">{String.fromCharCode(idx + 97)}</span>
                              <div className={`w-6 h-6 flex items-center justify-center font-mono font-bold text-xs rounded border-2 transition-all duration-300 ${boxBg}`}>
                                  {val}
                              </div>
                          </div>
                      )
                  })}
              </div>
          </div>

          <div className="w-px h-16 bg-slate-200 shrink-0"></div>

          {/* Final String Output Builder */}
          <div className="flex flex-col items-center shrink-0 w-[280px]">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-200 mb-2 shadow-sm flex items-center gap-2"><Type size={12}/> String ans Output</span>
              <div className={`flex flex-col w-full bg-white border shadow-md rounded-2xl p-4 transition-all duration-500 ${st.isDone ? 'border-violet-400 ring-2 ring-violet-100 bg-violet-50' : 'border-slate-200'}`}>
                  
                  <div className="w-full h-12 bg-slate-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-start px-4 gap-1">
                      <span className="text-slate-300 font-mono text-xl select-none mr-1">"</span>
                      {st.ansStr === undefined ? '' : st.ansStr.split('').map((char: string, idx: number) => {
                          let isJustAdded = st.phase === 'append_char' && idx === st.ansStr.length - 1;
                          return (
                              <div key={`ans-c-${idx}`} className={`w-6 h-8 flex items-center justify-center text-lg font-black font-mono transition-all duration-300 rounded ${isJustAdded ? 'bg-violet-500 text-white shadow-md animate-in slide-in-from-right-4' : 'bg-white text-violet-700 shadow-sm border border-slate-200'}`}>
                                  {char}
                              </div>
                          );
                      })}
                      {(!st.ansStr || st.ansStr.length < st.K) && <div className="w-2 h-6 bg-slate-300 animate-pulse ml-1 rounded-full"></div>}
                      <span className="text-slate-300 font-mono text-xl select-none ml-auto">"</span>
                  </div>
                  
                  <div className="flex justify-between mt-3 items-center">
                      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Progress</span>
                      <span className="text-xs font-bold font-mono text-slate-400">{st.ansStr ? st.ansStr.length : 0} / {st.K || 0}</span>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          {/* Adjacency List Component - Alphabet Mapped */}
          <div className="flex flex-col w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Adjacency List (adj)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-1 relative min-h-[150px] overflow-y-auto scrollbar-thin">
                  {st.adj === undefined ? <span className="text-slate-300 font-mono italic text-xs">Awaiting memory allocation...</span> : (st.adj || []).map((neighbors: number[], nodeIdx: number) => {
                      let isActiveRow = st.activeNode === nodeIdx;
                      let isScanRow = st.scanI === nodeIdx && (String(st.phase || '').includes('indegree') || String(st.phase || '') === 'add_adj_row' || String(st.phase || '') === 'init_adj_row');
                      let isInjectingRow = st.activeNode === nodeIdx && st.phase === 'inject_edge';
                      let highlightRow = isActiveRow || isScanRow || isInjectingRow;

                      return (
                          <div key={`adj-${nodeIdx}`} className={`flex items-center gap-2 p-1.5 rounded-xl transition-all duration-300 ${isInjectingRow ? 'bg-amber-50 border border-amber-200 shadow-md scale-[1.02]' : (highlightRow ? 'bg-violet-50 border border-violet-200 shadow-sm' : 'bg-transparent border border-transparent')}`}>
                              <div className={`w-6 h-6 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isInjectingRow ? 'bg-amber-500 text-white' : (highlightRow ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-500')}`}>
                                  {String.fromCharCode(nodeIdx + 97)}
                              </div>
                              <ArrowRight size={14} className={isInjectingRow ? 'text-amber-400' : (highlightRow ? 'text-violet-400' : 'text-slate-300')} />
                              <div className="flex flex-wrap gap-1 items-center">
                                  <span className="text-slate-400 font-mono text-sm">{'{'}</span>
                                  {neighbors.map((neighbor: number, nIdx: number) => {
                                      let isChecking = (isActiveRow || isScanRow) && st.checkNode === neighbor;
                                      let isJustInjected = isInjectingRow && st.checkNode === neighbor && nIdx === neighbors.length - 1;

                                      let neighborBg = 'transparent';
                                      let neighborText = highlightRow ? 'text-violet-700' : 'text-slate-500';

                                      if (isChecking) {
                                          neighborBg = 'bg-sky-400 text-white shadow-sm scale-110';
                                          neighborText = 'text-white';
                                      } else if (isJustInjected) {
                                          neighborBg = 'bg-amber-500 text-white shadow-md scale-110 animate-in zoom-in';
                                          neighborText = 'text-white font-black';
                                      }

                                      return (
                                          <React.Fragment key={`adj-n-${nodeIdx}-${nIdx}`}>
                                              <span className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded-md transition-all ${neighborBg} ${neighborText}`}>
                                                  {String.fromCharCode(neighbor + 97)}
                                              </span>
                                              {nIdx < neighbors.length - 1 && <span className="text-slate-300 font-mono text-xs">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 font-mono text-sm">{'}'}</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          {/* Kahn's Queue Component */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Queue&lt;Integer&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (OUT)</span>
                      <span>BACK (IN)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 transition-all duration-500">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Topo Sort...</span> : (st.q || []).map((val: number, i: number) => {
                          let isEntering = String(st.phase || '').includes('enqueue') && i === st.q.length - 1;
                          let isTop = i === 0;
                          
                          return (
                              <div key={`qf-${i}-${val}`} className={`px-4 py-2 flex flex-col items-center justify-center font-mono font-black text-white rounded-lg border-2 shadow-sm transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 animate-in slide-in-from-right-8' : (isTop ? 'bg-sky-500 border-sky-600' : 'bg-slate-700 border-slate-800')}`}>
                                  <span className="text-sm">{String.fromCharCode(val + 97)}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue is empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">N (Words):</span>
                          <span className="font-bold text-slate-700">{st.N !== undefined ? st.N : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">K (Chars):</span>
                          <span className="font-bold text-slate-700">{st.K !== undefined ? st.K : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">ptr:</span>
                          <span className="font-bold text-slate-700">{st.ptr !== undefined ? st.ptr : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">i:</span>
                          <span className="font-bold text-slate-700">{st.scanI !== undefined ? st.scanI : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">node (Popped):</span>
                          <span className="font-bold text-fuchsia-700">{st.activeNode !== undefined ? String.fromCharCode(st.activeNode + 97) : '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-rose-500">it (Target):</span>
                          <span className="font-bold text-rose-700">{st.checkNode !== undefined ? String.fromCharCode(st.checkNode + 97) : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderMainGraphCanvas = () => {
      if (st.adj === undefined) return null;
      const renderedEdges = new Set<string>();

      return (
          <div className="absolute inset-0 w-full h-full transition-transform duration-300 flex flex-col justify-center items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
              
              {/* String Comparison HUD */}
              {st.s1 && st.s2 && (
                  <div className="absolute top-10 flex flex-col items-center bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] border border-slate-200 shadow-2xl z-50 animate-in slide-in-from-top-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Search size={14} className="text-violet-500"/> Finding Mismatch</span>
                      
                      <div className="flex flex-col gap-3 font-mono text-2xl font-black">
                          {/* S1 */}
                          <div className="flex gap-2">
                              {st.s1.split('').map((char: string, idx: number) => {
                                  let isPtr = st.ptr === idx;
                                  let isMismatch = st.phase === 'compare_chars' && st.ptr === idx && st.s1[idx] !== st.s2[idx];
                                  return (
                                      <div key={`s1-${idx}`} className={`w-12 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${isMismatch ? 'bg-amber-100 border-amber-400 text-amber-700 scale-110 shadow-lg' : (isPtr ? 'bg-sky-50 border-sky-400 text-sky-700 scale-105 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600')}`}>
                                          {char}
                                      </div>
                                  )
                              })}
                          </div>
                          {/* S2 */}
                          <div className="flex gap-2">
                              {st.s2.split('').map((char: string, idx: number) => {
                                  let isPtr = st.ptr === idx;
                                  let isMismatch = st.phase === 'compare_chars' && st.ptr === idx && st.s1[idx] !== st.s2[idx];
                                  return (
                                      <div key={`s2-${idx}`} className={`w-12 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${isMismatch ? 'bg-amber-100 border-amber-400 text-amber-700 scale-110 shadow-lg' : (isPtr ? 'bg-sky-50 border-sky-400 text-sky-700 scale-105 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600')}`}>
                                          {char}
                                      </div>
                                  )
                              })}
                          </div>
                      </div>
                      
                      {st.phase === 'inject_edge' && (
                          <div className="mt-6 flex items-center gap-3 bg-amber-50 text-amber-700 px-6 py-2 rounded-full border border-amber-200 shadow-sm animate-in zoom-in">
                              <span className="font-bold text-sm uppercase tracking-widest">Rule Established:</span>
                              <span className="font-black font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-amber-100">{st.s1[st.ptr]}</span>
                              <ArrowRight size={16} />
                              <span className="font-black font-mono bg-white px-2 py-0.5 rounded shadow-sm border border-amber-100">{st.s2[st.ptr]}</span>
                          </div>
                      )}
                  </div>
              )}

              <div style={{ width: svgSize, height: svgSize }} className="relative origin-center">
                  
                  {/* Edges Layer */}
                  <svg viewBox={`-${svgSize/2} -${svgSize/2} ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return st.adj.map((neighbors: number[], u: number) => (
                              neighbors.map((v: number) => {
                                  const edgeKey = `${u}-${v}`;
                                  if (renderedEdges.has(edgeKey)) return null;
                                  renderedEdges.add(edgeKey);
  
                                  const p1 = nodePositions[u];
                                  const p2 = nodePositions[v];
                                  if (!p1 || !p2) return null;

                                  const dx = p2.x - p1.x;
                                  const dy = p2.y - p1.y;
                                  const angle = Math.atan2(dy, dx);
                                  
                                  const rOffset = 26; // Node radius (w-12 -> 48px -> radius 24) + small padding
                                  const startX = p1.x + rOffset * Math.cos(angle);
                                  const startY = p1.y + rOffset * Math.sin(angle);
                                  const targetX = p2.x - rOffset * Math.cos(angle);
                                  const targetY = p2.y - rOffset * Math.sin(angle);
  
                                  let isActiveChecking = st.activeNode === u && st.checkNode === v;
                                  let isScanChecking = st.scanI === u && st.checkNode === v;
                                  let isJustInjected = st.phase === 'inject_edge' && st.activeNode === u && st.checkNode === v;
  
                                  let strokeColor = "#cbd5e1"; // slate-300
                                  let strokeWidth = "3";
                                  let animClass = "";
  
                                  if (isActiveChecking) {
                                      strokeColor = "#f43f5e"; // rose-500 (decrementing)
                                      strokeWidth = "5";
                                      animClass = "animate-pulse";
                                  } else if (isScanChecking) {
                                      strokeColor = "#0ea5e9"; // sky-500 (incrementing initially)
                                      strokeWidth = "4";
                                  } else if (isJustInjected) {
                                      strokeColor = "#f59e0b"; // amber-500 injected
                                      strokeWidth = "6";
                                      animClass = "animate-in fade-in zoom-in";
                                  }

                                  // Explicit arrow head drawing
                                  const arrowSize = isJustInjected ? 16 : 14;
                                  const arrowAngle = Math.PI / 6; // 30 degrees
                                  const arrowP1 = `${targetX},${targetY}`;
                                  const arrowP2 = `${targetX - arrowSize * Math.cos(angle - arrowAngle)},${targetY - arrowSize * Math.sin(angle - arrowAngle)}`;
                                  const arrowP3 = `${targetX - arrowSize * Math.cos(angle + arrowAngle)},${targetY - arrowSize * Math.sin(angle + arrowAngle)}`;
  
                                  return (
                                      <g key={edgeKey} className={`transition-all duration-300 ${animClass}`}>
                                          <line 
                                              x1={startX} y1={startY} x2={targetX} y2={targetY}
                                              stroke={strokeColor}
                                              strokeWidth={strokeWidth}
                                          />
                                          <polygon 
                                              points={`${arrowP1} ${arrowP2} ${arrowP3}`} 
                                              fill={strokeColor} 
                                          />
                                      </g>
                                  );
                              })
                          ));
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {nodePositions.map((pos, idx) => {
                        let isActive = st.activeNode === idx;
                        let isChecking = st.checkNode === idx;
                        let isQueued = (st.q || []).includes(idx);
                        let isResolved = (st.topo || []).includes(idx);
                        
                        let bgClass = 'bg-white text-slate-500 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActive) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl';
                        } else if (isResolved) {
                            bgClass = 'bg-violet-600 text-white border-violet-700 shadow-md opacity-80';
                        } else if (isQueued) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-lg';
                        } else if (isChecking && st.phase === 'inject_edge') {
                            bgClass = 'bg-amber-400 text-white border-amber-500 shadow-lg scale-110';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isActive) {
                            ringClass = 'ring-4 ring-fuchsia-500 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isChecking) {
                            ringClass = 'ring-4 ring-rose-400 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        } else if (isQueued) {
                            ringClass = 'ring-2 ring-sky-300 border-transparent';
                        }

                        return (
                            <div 
                                key={`node-${idx}`}
                                className={`absolute w-[48px] h-[48px] flex items-center justify-center font-mono font-black text-xl rounded-full transition-colors duration-300 border-2 select-none ${bgClass} ${ringClass} ${zIndex}`}
                                style={{ 
                                    left: `${pos.x}px`, 
                                    top: `${pos.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {String.fromCharCode(idx + 97)}
                                {isResolved && !isActive && <span className="absolute -top-6 text-[9px] text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded font-black border border-violet-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Resolved</span>}
                                {isQueued && !isActive && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black border border-sky-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Queued</span>}
                            </div>
                        );
                    })}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Algorithm
                  </span>
                  <span>•</span>
                  <span>String Comparison & Kahn's Topological Sort</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><SpellCheck size={28}/> Deciphering the Alien Alphabet</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a sorted dictionary of an alien language containing <code>N</code> words and <code>K</code> starting alphabets, we need to find the exact lexicographical order of characters in this strange language.</p>
                        <p>Because the dictionary is already sorted according to the alien rules, we can deduce character precedence by comparing adjacent words. The <em>first</em> differing character between word1 and word2 reveals an undeniable rule: char1 mathematically <strong>must</strong> come before char2. We turn these rules into directed edges in a Graph and run Kahn's Topological Sort!</p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: Standard</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>dict:</strong> ["baa", "abcd", "abca", "cab", "cad"]<br/><strong>K:</strong> 4</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black">"bdac"</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                'baa' vs 'abcd' &rarr; 'b' before 'a'.<br/>
                                'abcd' vs 'abca' &rarr; 'd' before 'a'.<br/>
                                'abca' vs 'cab' &rarr; 'a' before 'c'.<br/>
                                'cab' vs 'cad' &rarr; 'b' before 'd'.<br/>
                                Topo sort resolves dependencies: b, d, a, c.
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-sky-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-sky-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Linear Prefix</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>dict:</strong> ["caa", "aaa", "aab"]<br/><strong>K:</strong> 3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black">"cab"</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                'caa' vs 'aaa' &rarr; 'c' before 'a'.<br/>
                                'aaa' vs 'aab' &rarr; 'a' before 'b'.<br/>
                                Graph is a simple straight line: c &rarr; a &rarr; b.
                            </span>
                        </div>

                        {/* Test Case 3 */}
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col`}>
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3: Disconnected DAG</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>dict:</strong> ["abc", "bat", "ade"]<br/><strong>K:</strong> 5 (a,b,c,d,e)</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Valid Outputs:</span>
                            <span className="text-slate-300 block mb-4 font-black">"abcde" or "abdec"</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Multiple valid topological sorts exist because the graph components aren't fully connected. Any order that satisfies 'a' before 'b' is valid.
                            </span>
                        </div>
                    </div>
                </section>
                
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[300px] max-h-[500px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Alien Dictionary Array (Use comma separator)</label>
                            <input type="text" value={dictInput} onChange={(e) => setDictInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="baa, abcd, abca, cab, cad" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>K (Alphabets)</label>
                            <input type="number" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="4" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                {/* Unified Sub-layout for Normal Mode ensuring no overlapping */}
                <div className="flex flex-col xl:flex-row gap-4 h-[700px]">
                    
                    {/* Main Canvas + Bottom Arrays Container */}
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Network size={14} className={`text-${themeColor}-500`}/> Alien Dictionary Visualizer</span>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="flex bg-white/90 p-1.5 rounded-xl shadow-md border border-slate-200 backdrop-blur gap-1">
                                <button onClick={zoomIn} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={16}/></button>
                                <button onClick={zoomOut} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={16}/></button>
                            </div>
                        </div>

                        {/* Unbounded Graph Area */}
                        <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            {renderMainGraphCanvas()}
                        </div>

                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
                    <div className="w-full xl:w-[320px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
                    </div>
                </div>

            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how to translate implicit lexical rules into explicit Graph Edges.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-amber-500"/> Phase 1: Rule Extraction (The Mismatch)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In a sorted dictionary (like English), if "apple" comes before "ape", the first differing character implies the sorting rule. Here, the 'l' vs 'e' tells us that in this alphabet, 'l' comes before 'e'. We iterate over adjacent pairs in the alien dictionary, find the FIRST differing character, and record it as a directed edge: <code>char1 &rarr; char2</code>.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-violet-500"/> Phase 2: Topological Sort (Kahn's BFS)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once we have mapped all these precedence rules into an Adjacency List graph, it becomes a classic Course Schedule problem! We use Kahn's algorithm: Find all characters with 0 incoming dependencies, add them to our alphabet, and cross off their outgoing rules to unlock the next letters in the sequence.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N * L + K + E)</strong><br/>Where N is number of words, L is max string length, K is number of alphabets, and E is number of edges. We spend O(N * L) extracting edges. Topological sort takes O(K + E). Overall time is linear to the total input size!</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(K + E)</strong><br/>The adjacency list graph takes O(K + E) space. The Indegree array takes O(K). The Queue takes O(K). Space is purely a function of the alphabet size and rules generated.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Alien Dictionary is notoriously difficult because it combines String Manipulation with Graph Theory. You must master both phases independently to succeed."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What happens if word1 is 'abcd' and word2 is 'abc'?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This is an invalid dictionary state."</p>
                            <p>In standard lexicographical sorting, a shorter prefix (like 'abc') MUST come before a longer string (like 'abcd'). If 'abcd' appears first, the dictionary is logically broken. An interviewer will expect you to detect this edge case during the string comparison loop and immediately return an empty string!"</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if there are multiple valid alphabets?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Topological Sort handles this naturally."</p>
                            <p>If there is ambiguity (e.g., we know 'a' comes before 'b', and 'c' before 'd', but don't know how 'b' relates to 'c'), Kahn's algorithm will simply enqueue multiple 0-indegree characters simultaneously. Whichever it pops first defines one valid answer out of many. The problem usually accepts ANY valid ordering."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* FIXED LEFT SIDEBAR: Trace Top, Code Bottom */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Pinned Trace Box */}
                  {renderTraceOperationsBox()}

                  {/* Auto-scrolling Source Code */}
                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* CENTER CANVAS AREA - No Overlaps! */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  
                  {/* Top Bar inside Center */}
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-2xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>Alien Dict:</label>
                          <input type="text" value={dictInput} onChange={(e) => setDictInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="baa, abcd, abca, cab, cad" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>K:</label>
                          <input type="number" value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="4" />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  {/* Pure Infinite Graph Space */}
                  <div className="flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      {renderMainGraphCanvas()}
                      
                      {!st.isDone && (
                          <div className="absolute bottom-8 right-8 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 pointer-events-none">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 bg-white/80 px-3 py-1 rounded shadow-sm border border-slate-200">Shortcuts: &larr; &rarr;</span>
                              <div className="pointer-events-auto flex gap-3">
                                  <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-4 bg-white text-slate-700 rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2"><ChevronLeft size={20}/> PREV</button>
                                  <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-4 bg-${themeColor}-500 text-white rounded-2xl shadow-xl border border-${themeColor}-400 hover:bg-${themeColor}-600 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-30`}>NEXT <ChevronRight size={20}/></button>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Safely Docked State Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR - Adjacency, Stack & Variables safely separated */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}