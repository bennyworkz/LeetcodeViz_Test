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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dfsRecursive: {
    id: 'dfsRecursive',
    title: '1. DFS (Recursive)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N + E) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        boolean[] visited = new boolean[rooms.size()];
        dfs(rooms, 0, visited);
        for (boolean v : visited) {
            if (!v) return false;
        }
        return true;
    }
    
    private void dfs(List<List<Integer>> rooms, int curr, boolean[] visited) {
        visited[curr] = true;
        for (int next : rooms.get(curr)) {
            if (!visited[next]) {
                dfs(rooms, next, visited);
            }
        }
    }
}`,
    desc: "A classic Depth-First Search. We treat the rooms and keys as a directed graph. We start at room 0, mark it as visited, and then iterate through all the keys we find in that room. For every key that opens a room we haven't visited yet, we recursively call our DFS function to dive as deep as possible into that path. Once the recursion unwinds, we simply check our 'visited' array: if any room is still false, we return false. Otherwise, true."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. BFS (Iterative Queue)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N + E) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        boolean[] visited = new boolean[rooms.size()];
        visited[0] = true;
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(0);
        
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            for (int next : rooms.get(curr)) {
                if (!visited[next]) {
                    visited[next] = true;
                    queue.offer(next);
                }
            }
        }
        
        for (boolean v : visited) {
            if (!v) return false;
        }
        return true;
    }
}`,
    desc: "A Breadth-First Search approach. Instead of diving deep immediately, we explore room by room in 'waves' using a Queue. We start by placing room 0 in the queue and marking it visited. While the queue isn't empty, we pop a room, look at all its keys, mark the newly discovered rooms as visited, and push them to the back of the queue. This is mathematically equivalent in time complexity to DFS, but uses a different memory profile."
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
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|canVisitAllRooms|dfs|List|Queue|LinkedList|offer|poll|isEmpty|size|get|visited|rooms|curr|next|v)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={idx} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'this'].includes(part);
            const isObject = ['List', 'Queue', 'LinkedList', 'Integer'].includes(part);
            const isPointer = ['visited', 'rooms', 'curr', 'next', 'v'].includes(part);
            const isMapCall = ['canVisitAllRooms', 'dfs', 'offer', 'poll', 'isEmpty', 'size', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
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

export default function KeysAndRoomsVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursive');
  
  const [graphInput, setGraphInput] = useState('[[1,3],[3,0,1],[2],[0]]');
  const [baseGraphArr, setBaseGraphArr] = useState<number[][]>([[1,3],[3,0,1],[2],[0]]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseGraphString = (inputStr: string, fallback: number[][]) => {
      try {
          let clean = inputStr.trim();
          if (!clean.startsWith('[')) clean = `[${clean}]`;
          
          // Remove outermost brackets manually to split inner arrays
          let inner = clean.substring(1, clean.length - 1).trim();
          if (inner.length === 0) return [];
          
          let rawRooms = inner.split(/\]\s*,\s*\[/);
          
          let parsed = rawRooms.map(r => {
              let cleanedR = r.replace(/\[|\]/g, '').trim();
              if (cleanedR === '') return [];
              return cleanedR.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
          });
          return parsed;
      } catch (e) {
          return fallback;
      }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseGraphArr(parseGraphString(graphInput, [[1,3],[3,0,1],[2],[0]]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [graphInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation for Circular Layout
  const buildGraphGeometry = (adjList: number[][]) => {
      const n = adjList.length;
      let renderNodes: any[] = [];
      let renderEdges: any[] = [];
      
      if (n === 0) return { nodes: [], edges: [], radius: 0 };

      // Base radius calculation, scales slightly with more nodes to prevent crowding
      const radius = Math.max(100, Math.min(220, n * 25)); 
      
      for (let i = 0; i < n; i++) {
          // Start at top (-PI/2) and go clockwise
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          renderNodes.push({
              id: i,
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
              keys: adjList[i] || []
          });
      }

      for (let u = 0; u < n; u++) {
          const keys = adjList[u] || [];
          for (let v of keys) {
              if (v >= 0 && v < n) {
                  renderEdges.push({
                      source: u,
                      target: v,
                      sx: renderNodes[u].x,
                      sy: renderNodes[u].y,
                      tx: renderNodes[v].x,
                      ty: renderNodes[v].y
                  });
              }
          }
      }

      return { nodes: renderNodes, edges: renderEdges, radius };
  };

  const graphData = useMemo(() => buildGraphGeometry(baseGraphArr), [baseGraphArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseGraphArr.length;
    if (n === 0) return [];

    let callStack: string[] = [];
    let visited = new Set<number>();
    
    if (selectedOpId === 'dfsRecursive') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visited: new Set(visited), callStack: [...callStack], ...st 
            } 
        });

        add("Function Call", `public boolean canVisitAllRooms(List<List<Integer>> rooms)`, 2, {});
        
        add("Init Visited Array", `boolean[] visited = new boolean[rooms.size()];\nCreated a boolean array of size ${n} to track which rooms we unlock. All default to false.`, 3, { hlInitVisited: true });
        
        add("Start DFS", `dfs(rooms, 0, visited);\nStarting the Depth-First Search from Room 0.`, 4, { hlStartDfs: true });

        const dfs = (curr: number) => {
            if (steps.length > 2500) return; // infinite recursion guard

            let callStr = `dfs(${curr})`;
            callStack.push(callStr);
            
            add("DFS Entry", `private void dfs(List<List<Integer>> rooms, int curr, boolean[] visited)\nEntering room ${curr}.`, 11, { currNodeId: curr });

            visited.add(curr);
            add("Mark Visited", `visited[curr] = true;\nMarking room ${curr} as visited (unlocked).`, 12, { currNodeId: curr, hlMarkVisited: true });

            const keys = baseGraphArr[curr] || [];
            
            for (let i = 0; i < keys.length; i++) {
                let next = keys[i];
                if (next < 0 || next >= n) continue; // Out of bounds safeguard

                add("Check Key", `for (int next : rooms.get(curr))\nFound key to room ${next} inside room ${curr}.`, 13, { currNodeId: curr, hlForKey: true, currentKeyIdx: i, currentKeyTarget: next });

                let isUnvisited = !visited.has(next);
                add("Evaluate Visit Status", `if (!visited[next])\nHave we visited room ${next} yet? ${!isUnvisited ? 'YES. Ignoring key.' : 'NO. We must explore it!'}`, 14, { currNodeId: curr, hlIfUnvisited: true, currentKeyIdx: i, currentKeyTarget: next, isUnvisited });

                if (isUnvisited) {
                    add("Recurse Deeper", `dfs(rooms, next, visited);\nUsing key to dive into room ${next}.`, 15, { currNodeId: curr, hlRecurseDfs: true, currentKeyIdx: i, currentKeyTarget: next });
                    dfs(next);
                    
                    // Bubble back up visually
                    add("Backtrack", `Finished exploring paths from room ${next}. Backtracking to room ${curr}.`, 13, { currNodeId: curr, hlForKey: true });
                }
            }
            callStack.pop();
        };

        dfs(0);

        add("DFS Complete", `DFS traversal finished. Returning to main function to verify results.`, 4, { hlStartDfs: true });

        let allVisited = true;
        let failedRoom = -1;
        for (let i = 0; i < n; i++) {
            add("Verify Connectivity Loop", `for (boolean v : visited)\nChecking if room ${i} was visited...`, 5, { hlCheckLoop: true, loopI: i });
            
            let isV = visited.has(i);
            add("Evaluate Status", `if (!v) return false;\nWas room ${i} visited? ${isV ? 'YES.' : 'NO.'}`, 6, { hlCheckStatus: true, loopI: i, isV });
            
            if (!isV) {
                allVisited = false;
                failedRoom = i;
                add("Return False", `return false;\nWe failed to reach room ${i}. Returning false.`, 6, { isSuccess: true, finalAns: false, failedRoom, loopI: i });
                break;
            }
        }

        if (allVisited) {
            add("Return True", `return true;\nAll ${n} rooms were successfully visited! Returning true.`, 8, { isSuccess: true, finalAns: true });
        }

    } 
    else if (selectedOpId === 'bfsIterative') {
        let q: number[] = [];

        const cloneQ = (arr: number[]) => [...arr];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visited: new Set(visited), qState: cloneQ(q), ...st 
            } 
        });

        add("Function Call", `public boolean canVisitAllRooms(List<List<Integer>> rooms)`, 2, {});
        
        add("Init Visited Array", `boolean[] visited = new boolean[rooms.size()];\nCreated a boolean array of size ${n} to track which rooms we unlock. All default to false.`, 3, { hlInitVisited: true });
        
        visited.add(0);
        add("Mark Start Visited", `visited[0] = true;\nMarking starting room 0 as visited (unlocked).`, 4, { hlMarkStart: true, currNodeId: 0 });

        add("Init Queue", `Queue<Integer> queue = new LinkedList<>();\nCreate a queue to perform BFS.`, 5, { hlInitQueue: true, currNodeId: 0 });
        
        q.push(0);
        add("Enqueue Start", `queue.offer(0);\nPush room 0 into the queue.`, 6, { hlEnqueueStart: true, currNodeId: 0 });

        while (q.length > 0) {
            if (steps.length > 2500) break; // Infinite loop guard

            add("While Loop", `while (!queue.isEmpty())\nQueue is not empty. Processing next wave.`, 8, { hlWhile: true });
            
            let curr = q.shift()!;
            add("Poll Queue", `int curr = queue.poll();\nPopping room ${curr} from the front of the queue to process its keys.`, 9, { currNodeId: curr, hlPoll: true });

            const keys = baseGraphArr[curr] || [];
            
            for (let i = 0; i < keys.length; i++) {
                let next = keys[i];
                if (next < 0 || next >= n) continue;

                add("Check Key", `for (int next : rooms.get(curr))\nFound key to room ${next} inside room ${curr}.`, 10, { currNodeId: curr, hlForKey: true, currentKeyIdx: i, currentKeyTarget: next });

                let isUnvisited = !visited.has(next);
                add("Evaluate Visit Status", `if (!visited[next])\nHave we visited room ${next} yet? ${!isUnvisited ? 'YES. Ignoring key.' : 'NO. We must process it!'}`, 11, { currNodeId: curr, hlIfUnvisited: true, currentKeyIdx: i, currentKeyTarget: next, isUnvisited });

                if (isUnvisited) {
                    visited.add(next);
                    add("Mark Next Visited", `visited[next] = true;\nMarking room ${next} as visited (unlocked).`, 12, { currNodeId: curr, hlMarkNextVisited: true, currentKeyIdx: i, currentKeyTarget: next });
                    
                    q.push(next);
                    add("Enqueue Next", `queue.offer(next);\nPushing room ${next} to the back of the queue so we can explore its keys later.`, 13, { currNodeId: curr, hlEnqueueNext: true, currentKeyIdx: i, currentKeyTarget: next });
                }
            }
        }

        add("Queue Empty", `while (!queue.isEmpty())\nQueue is empty. BFS traversal complete.`, 8, { hlWhile: true });

        let allVisited = true;
        let failedRoom = -1;
        for (let i = 0; i < n; i++) {
            add("Verify Connectivity Loop", `for (boolean v : visited)\nChecking if room ${i} was visited...`, 18, { hlCheckLoop: true, loopI: i });
            
            let isV = visited.has(i);
            add("Evaluate Status", `if (!v) return false;\nWas room ${i} visited? ${isV ? 'YES.' : 'NO.'}`, 19, { hlCheckStatus: true, loopI: i, isV });
            
            if (!isV) {
                allVisited = false;
                failedRoom = i;
                add("Return False", `return false;\nWe failed to reach room ${i}. Returning false.`, 19, { isSuccess: true, finalAns: false, failedRoom, loopI: i });
                break;
            }
        }

        if (allVisited) {
            add("Return True", `return true;\nAll ${n} rooms were successfully visited! Returning true.`, 21, { isSuccess: true, finalAns: true });
        }
    }

    return steps;
  }, [baseGraphArr, graphData, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
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

  const renderActiveDashboard = () => {
      if (st.isSuccess) return null;

      let isLoopPhase = st.hlCheckLoop || st.hlCheckStatus;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isLoopPhase ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (st.hlRecurseDfs || st.hlEnqueueNext ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Trace State</span>
              
              {isLoopPhase ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in zoom-in duration-300">
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Verifying Room</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl bg-slate-50 border-slate-300 text-slate-700 shadow-inner`}>
                              {st.loopI !== undefined ? String(st.loopI) : '?'}
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>

                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckStatus ? 'text-amber-500' : 'text-slate-400'}`}>Visited Array Status</span>
                          <div className={`border-2 text-xl font-black px-6 py-2.5 rounded-xl transition-all duration-300 ${st.hlCheckStatus ? (st.isV ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg scale-110' : 'bg-rose-100 border-rose-500 text-rose-800 shadow-lg scale-110') : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.isV !== undefined ? (st.isV ? 'TRUE (Visited)' : 'FALSE (Locked)') : '?'}
                          </div>
                      </div>
                  </div>
              ) : st.currNodeId !== undefined && st.currNodeId !== null ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlMarkVisited || st.hlPoll ? `text-${themeColor}-500` : 'text-slate-400'}`}>Current Room</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlMarkVisited || st.hlPoll ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {String(st.currNodeId)}
                          </div>
                      </div>

                      {st.currentKeyTarget !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 w-12 text-slate-400 animate-pulse">
                                  <Key size={32} />
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlIfUnvisited || st.hlMarkNextVisited ? `text-${themeColor}-500` : 'text-slate-400'}`}>Checking Key To</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlIfUnvisited || st.hlMarkNextVisited ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      {String(st.currentKeyTarget)}
                                  </div>
                              </div>
                              
                              {st.hlRecurseDfs || st.hlEnqueueNext ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Action</span>
                                          <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800`}>
                                              {st.hlRecurseDfs ? 'DFS DIVE' : 'ENQUEUE ROOM'}
                                          </div>
                                      </div>
                                  </>
                              ) : st.isUnvisited === false ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Action</span>
                                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-slate-100 border-slate-300 text-slate-500`}>
                                              ALREADY VISITED
                                          </div>
                                      </div>
                                  </>
                              ) : null}
                          </>
                      ) : (
                          <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                              Scanning room for keys...
                          </div>
                      )}

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Traversal Sequence...</span>
                  </div>
              )}
          </div>
      );
  }

  const renderVisuals = () => {
      if (graphData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Graph...</span>;

      // Container needs enough height to fit the whole circular layout
      const containerSize = Math.max(450, graphData.radius * 2 + 150);

      // SVG Arrows Definition
      const arrowMarker = (
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={themeColor === 'sky' ? '#0ea5e9' : '#10b981'} />
            </marker>
          </defs>
      );

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Map State Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-start justify-center">
                  
                  {/* Visited Array Status */}
                  <div className={`flex-2 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlInitVisited || st.hlMarkVisited || st.hlMarkNextVisited || st.hlMarkStart ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                              <Lock size={14}/> Visited Array (Rooms Unlocked)
                          </span>
                      </div>
                      <div className="flex flex-wrap gap-2 items-center">
                          {baseGraphArr.map((_, idx) => {
                              let isV = st.visited && st.visited.has(idx);
                              let isChecking = st.loopI === idx;
                              let isFailed = st.isSuccess && !st.finalAns && st.failedRoom === idx;

                              let cellClass = "bg-slate-100 border-slate-300 text-slate-500 opacity-60";
                              if (isFailed) cellClass = "bg-rose-500 border-rose-600 text-white shadow-lg animate-pulse";
                              else if (isChecking) cellClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110 ring-2 ring-amber-300";
                              else if (isV) cellClass = "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm opacity-100";

                              return (
                                  <div key={`v-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0`}>
                                      <div className={`flex items-center justify-center w-10 h-10 border-2 rounded-lg font-mono text-sm font-black ${cellClass}`}>
                                          {isV ? <Unlock size={16}/> : <Lock size={16}/>}
                                      </div>
                                      <span className="text-[9px] font-bold text-slate-500 font-mono text-center w-full">{idx}</span>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Queue / Stack Status */}
                  {selectedOpId === 'bfsIterative' ? (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlEnqueueNext || st.hlEnqueueStart || st.hlPoll ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> BFS Queue
                              </span>
                          </div>
                          <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none">
                              <span className="text-slate-300 text-[10px] font-black uppercase shrink-0">OUT</span>
                              {st.qState && st.qState.length > 0 ? st.qState.map((val: number, idx: number) => (
                                  <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-lg px-3 py-1 font-mono text-sm ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                      <span className="font-black leading-none">{val}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                              <span className="text-slate-300 text-[10px] font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                          </div>
                      </div>
                  ) : (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.callStack && st.callStack.length > 0 && !st.isSuccess ? 'border-emerald-300 ring-4 ring-emerald-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> DFS Call Stack
                              </span>
                          </div>
                          <div className="flex flex-col gap-1 max-h-[80px] overflow-y-auto scrollbar-none flex-1 pb-1">
                               {st.callStack && st.callStack.length > 0 ? st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`cs-${idx}`} className={`w-full py-1 px-3 rounded-md border font-mono text-[9px] font-black transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200 opacity-80'}`}>
                                           {String(frameStr)}
                                       </div>
                                   )
                               }) : <span className="text-slate-400 italic text-xs font-mono">Empty</span>}
                          </div>
                      </div>
                  )}

              </div>

              {/* Free-floating Interactive State Space Graph */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex items-center justify-center`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Directed Room Graph</span>
                      
                      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {arrowMarker}
                              <g style={{ transform: 'translate(50%, 50%)' }}>
                                  
                                  {/* Render Edges (Keys) */}
                                  {graphData.edges.map((edge: any, i: number) => {
                                      let isActiveEdge = false;

                                      if (st.currNodeId === edge.source && st.currentKeyTarget === edge.target) {
                                          isActiveEdge = true;
                                      }
                                      
                                      let strokeColor = '#cbd5e1'; // slate-300
                                      let strokeWidth = 2;
                                      let opacity = 0.4;
                                      let markerId = "url(#arrow)";

                                      if (isActiveEdge) {
                                          strokeColor = themeColor === 'sky' ? '#0ea5e9' : '#10b981'; 
                                          strokeWidth = 4;
                                          opacity = 1;
                                          markerId = "url(#arrow-active)";
                                      }

                                      // If edge is a self-loop (room contains its own key)
                                      if (edge.source === edge.target) {
                                          return (
                                              <path 
                                                  key={`edge-${i}`} 
                                                  d={`M ${edge.sx+10} ${edge.sy-10} A 20 20 0 1 1 ${edge.sx+20} ${edge.sy} `} 
                                                  fill="none" 
                                                  stroke={strokeColor} 
                                                  strokeWidth={strokeWidth} 
                                                  opacity={opacity} 
                                                  markerEnd={markerId}
                                                  className="transition-all duration-300"
                                              />
                                          );
                                      }

                                      return <line key={`edge-${i}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} markerEnd={markerId} className="transition-all duration-300"/>
                                  })}
                              </g>
                          </svg>

                          {/* Render Nodes (Rooms) */}
                          {graphData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isVisited = st.visited && st.visited.has(node.id);
                              let isTargetOfKey = st.currentKeyTarget === node.id;
                              
                              let bgClass = "bg-slate-50 border-slate-300 text-slate-500 opacity-60"; // Locked/Unvisited
                              let icon = <Lock size={16} className="opacity-50 mb-1"/>;
                              
                              if (isVisited) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-100";
                                  icon = <Unlock size={16} className="text-emerald-500 mb-1"/>;
                              }
                              
                              if (isActive) {
                                  bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                                  icon = <Activity size={18} className={`${selectedOpId === 'dfsRecursive' ? 'text-emerald-600' : 'text-sky-600'} mb-1 animate-pulse`}/>;
                              } else if (isTargetOfKey) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-100 shadow-lg text-amber-900 scale-110 z-20";
                              }
                              
                              if (st.isSuccess) {
                                  if (st.finalAns === false && st.failedRoom === node.id) {
                                      bgClass = "bg-rose-500 border-rose-600 text-white shadow-2xl scale-125 z-40 ring-4 ring-rose-200 animate-pulse";
                                      icon = <Lock size={18} className="text-white mb-1"/>;
                                  } else if (st.finalAns === true) {
                                      bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg opacity-100 z-20 scale-110";
                                      icon = <Unlock size={16} className="text-white mb-1"/>;
                                  } else if (st.finalAns === false && isVisited) {
                                      bgClass = "bg-emerald-50 border-emerald-200 text-emerald-400 opacity-50 z-10 scale-90";
                                  }
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {isTargetOfKey && !isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              key target
                                          </span>
                                      )}
                                      {st.isSuccess && st.finalAns === false && st.failedRoom === node.id && (
                                          <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-rose-600 text-white px-2 py-1 rounded shadow-lg`}>
                                              UNREACHABLE
                                          </span>
                                      )}

                                      <div className={`w-14 h-14 md:w-16 md:h-16 flex flex-col items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          {icon}
                                          <span className={`font-mono font-black text-sm md:text-base leading-none`}>{node.id}</span>
                                      </div>

                                      {/* Display keys physically inside the room if it's active or if we just want to show them */}
                                      <div className="absolute -bottom-6 flex gap-1 bg-white/80 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm backdrop-blur-sm">
                                          {node.keys.length > 0 ? node.keys.map((k: number, kidx: number) => (
                                              <span key={`k-${kidx}`} className={`text-[9px] font-mono font-bold ${isActive && st.currentKeyTarget === k ? 'text-amber-600 scale-125' : 'text-slate-500'}`}>{k}</span>
                                          )) : <span className="text-[8px] italic text-slate-400">no keys</span>}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                {selectedOp.icon && React.cloneElement(selectedOp.icon as React.ReactElement, { className: "text-white", size: 28 })}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Keys and Rooms</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 841</span>
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
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Key size={28}/> Connected Components</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> rooms labeled from <code>0</code> to <code>n - 1</code> and all the rooms are locked except for room <code>0</code>. Your goal is to visit all the rooms.</p>
                        <p>When you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.</p>
                        <p className="font-bold mt-4">Given an array <code>rooms</code> where <code>rooms[i]</code> is the set of keys that you can obtain if you visited room <code>i</code>, return <code>true</code> if you can visit all the rooms, or <code>false</code> otherwise.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1 (All Reachable):</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> rooms = [[1],[2],[3],[]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">true</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                We visit room 0 and pick up key 1.<br/>
                                We then visit room 1 and pick up key 2.<br/>
                                We then visit room 2 and pick up key 3.<br/>
                                We then visit room 3. Since we were able to visit every room, we return true.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="80" viewBox="0 0 220 80">
                                <defs>
                                    <marker id="arr" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                    </marker>
                                </defs>
                                <line x1="30" y1="40" x2="80" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr)"/>
                                <line x1="80" y1="40" x2="130" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr)"/>
                                <line x1="130" y1="40" x2="180" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr)"/>
                                
                                <circle cx="30" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="30" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="80" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="80" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="130" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="130" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="180" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="180" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2 (Disconnected):</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> rooms = [[1,3],[3,0,1],[2],[0]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">false</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                We can not enter room 2 since the only key that unlocks it is in that room itself. The graph has disconnected components.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="150" viewBox="0 0 220 150">
                                <defs>
                                    <marker id="arr2" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                    </marker>
                                </defs>
                                <line x1="60" y1="40" x2="160" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr2)"/>
                                <line x1="60" y1="40" x2="60" y2="100" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr2)"/>
                                <line x1="160" y1="40" x2="60" y2="100" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr2)"/>
                                <line x1="60" y1="100" x2="60" y2="40" stroke="#10b981" strokeWidth="3" markerEnd="url(#arr2)"/>
                                
                                {/* Self loop for 2 */}
                                <path d="M 160 110 A 15 15 0 1 1 170 100" fill="none" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arr2)"/>

                                <circle cx="60" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="60" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="160" cy="40" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="160" y="44" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                {/* Node 2 is locked */}
                                <circle cx="160" cy="100" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                                <text x="160" y="104" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="60" cy="100" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="60" y="104" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>n == rooms.length</li>
                            <li>2 &le; n &le; 1000</li>
                            <li>0 &le; rooms[i].length &le; 1000</li>
                            <li>1 &le; sum(rooms[i].length) &le; 3000</li>
                            <li>0 &le; rooms[i][j] &lt; n</li>
                            <li>All the values of <code>rooms[i]</code> are unique.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is a textbook <strong>Graph Traversal</strong> problem disguised as a real-world scenario. The rooms are <em>Nodes/Vertices</em>, and the keys are <em>Directed Edges</em> pointing to other nodes. The question simply asks: "If we start at node 0, are all other nodes reachable?" We need to find if the graph forms a single connected component from the source.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">To solve this, we can use either <strong>Depth-First Search (DFS)</strong> or <strong>Breadth-First Search (BFS)</strong>. Both are perfectly valid and run in $O(N + E)$ time.</p>
                        <p className="text-sm leading-relaxed text-slate-600">Both methods require a <code>boolean[] visited</code> array to prevent infinite loops (if room 1 has a key to 2, and 2 has a key to 1). We mark room 0 as visited, follow all keys recursively or via a queue, marking new rooms as visited. At the end, we iterate the boolean array to verify there are no <code>false</code> values.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Rooms Array Input (Adjacency List)</label>
                            <input type="text" value={graphInput} onChange={(e) => setGraphInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="[[1,3],[3,0,1],[2],[0]]" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns ? <PartyPopper size={24}/> : <ShieldAlert size={24}/>} 
                                VERIFICATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                {st.finalAns ? 'All rooms were successfully visited. Return true.' : `Failed to reach room ${st.failedRoom}. Return false.`}
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : (st.hlCheckStatus ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(50% + ${pan.y}px)) scale(${zoom})`, transformOrigin: 'center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Graph Connectivity via Traversal.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 1. Graph Representation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The input <code>rooms</code> is inherently an <strong>Adjacency List</strong>. An Adjacency List is the most common way to represent a graph in code. The index of the array represents the Node (Room), and the list at that index represents the Directed Edges (Keys) leading out from that Node.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Repeat size={24} className="text-emerald-500"/> 2. Preventing Infinite Loops</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Unlike trees which flow strictly downward, graphs can contain cycles (e.g., Room 1 has a key to Room 2, and Room 2 has a key to Room 1). If we don't track our state, a DFS or BFS would bounce between 1 and 2 forever, crashing the program.</p>
                        <p className="text-slate-600 leading-relaxed">This is why the <code>boolean[] visited</code> array is strictly required. Before we use a key to enter a room (or add it to our Queue/Stack), we check <code>if (!visited[next])</code>. If it's already true, we discard the key. This ensures every room is processed exactly once.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N + E).</strong> $N$ is the number of rooms, and $E$ is the total number of keys across all rooms. We instantiate the visited array taking $O(N)$ time. Then, our DFS/BFS visits every reachable room exactly once, and iterates through its keys exactly once. Thus, the work scales linearly with the graph size.</li>
                            <li><strong>Space Complexity: O(N).</strong> We allocate an array <code>visited</code> of size $N$. For DFS, the recursive call stack can go $N$ deep if the rooms form a straight line. For BFS, the queue can hold up to $N$ rooms at once. In all scenarios, auxiliary space is $O(N)$.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a fundamental graph problem. Interviewers use it to verify you know how to read Adjacency Lists and implement standard DFS/BFS without stumbling on cyclic infinite loops."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Which approach is better for this specific problem, BFS or DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Both are strictly $O(N + E)$ and highly optimal.</p>
                            <p>In competitive programming and interviews, recursive DFS is often preferred simply because it takes much fewer lines of code to write (no need to manually manage Queue instances). However, if the graph is extremely deep, a recursive DFS could theoretically hit a <code>StackOverflowError</code> in some languages, whereas the BFS Queue allocates on the heap and handles massive graphs safely."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Could we use an integer counter instead of a second loop to verify the result?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, and that's an excellent optimization!</p>
                            <p>Instead of looping through the <code>visited</code> array at the very end to check for <code>false</code> values, we can keep an <code>int seen = 0;</code> counter. Every time we mark a room <code>visited[x] = true</code>, we do <code>seen++</code>. At the end, we just return <code>seen == rooms.size()</code>. This saves us an $O(N)$ loop at the end, though the overall time complexity remains $O(N + E)$."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "What if there are duplicate keys in a room? Does this break the algorithm?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it does not break it.</p>
                            <p>The problem statement guarantees unique keys within a single room, but even if there were duplicates, our <code>if (!visited[next])</code> logic handles it flawlessly. The first time we see the key, we mark the room visited. If we pull an identical key from the same room (or another room later), the check fails and we simply discard the duplicate key in $O(1)$ time."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[480px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Fixed Explanation Box */}
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? (st.finalAns ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : (st.hlCheckStatus ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                      <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>

                  {/* Scrollable Code Box */}
                  <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-10 relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-700" ref={codeContainerFullscreenRef}>
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Context Panel for Fullscreen */}
                  {selectedOpId === 'dfsRecursive' && !st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                              </div>
                              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                  {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                      let isTop = idx === 0;
                                      return (
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? `bg-${themeColor}-500 text-white border-${themeColor}-400 scale-100` : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                              {String(frameStr)}
                                          </div>
                                      )
                                  })}
                                  {st.callStack.length === 0 && (
                                      <span className="text-slate-500 font-mono italic text-xs text-center py-2">Empty</span>
                                  )}
                              </div>
                          </div>
                      </div>
                  )}

                  {selectedOpId === 'bfsIterative' && !st.isSuccess && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm">
                           <div className={`flex flex-col bg-white p-5 rounded-3xl border-4 shadow-2xl transition-all duration-500 border-sky-200`}>
                                <div className="flex justify-between items-center mb-3 border-b pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                        <LayersIcon size={14}/> BFS Queue
                                    </span>
                                </div>
                                <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((val: number, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">{val}</span>
                                        </div>
                                    )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                                </div>
                            </div>
                      </div>
                  )}

                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Rooms Array Input (Adjacency List)</label>
                              <input type="text" value={graphInput} onChange={(e) => setGraphInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="[[1,3],[3,0,1]..." />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-all`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(50% + ${pan.y}px)) scale(${zoom})`, transformOrigin: 'center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 ${st.finalAns ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    {st.finalAns ? <Trophy size={48}/> : <ShieldAlert size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">VERIFICATION COMPLETE</h2>
                                <p className={`${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Can Visit All Rooms?</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        {st.finalAns ? 'TRUE' : 'FALSE'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-slate-700 hover:bg-slate-600'}`}>
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