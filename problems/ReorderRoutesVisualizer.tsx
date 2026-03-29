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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dfsRecursive: {
    id: 'dfsRecursive',
    title: '1. DFS (Recursive)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    int changes = 0;
    public int minReorder(int n, int[][] connections) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] c : connections) {
            adj.get(c[0]).add(new int[]{c[1], 1});
            adj.get(c[1]).add(new int[]{c[0], 0});
        }
        dfs(0, -1, adj);
        return changes;
    }
    private void dfs(int curr, int parent, List<List<int[]>> adj) {
        for (int[] edge : adj.get(curr)) {
            int next = edge[0];
            int cost = edge[1];
            if (next != parent) {
                changes += cost;
                dfs(next, curr, adj);
            }
        }
    }
}`,
    desc: "A Depth-First Search approach. We build an adjacency list where we treat the graph as completely undirected. However, to know which edges need flipping, we assign a 'cost' of 1 to original edges (pointing away from 0) and a cost of 0 to the artificial reverse edges. We then start a DFS from City 0. Because it's a tree structure, we only need to pass the 'parent' node to prevent going backwards. Whenever we traverse an edge with cost 1, we increment our changes counter."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. BFS (Iterative Queue)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public int minReorder(int n, int[][] connections) {
        List<List<int[]>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
        for (int[] c : connections) {
            adj.get(c[0]).add(new int[]{c[1], 1});
            adj.get(c[1]).add(new int[]{c[0], 0});
        }
        Queue<Integer> q = new LinkedList<>();
        boolean[] visited = new boolean[n];
        q.offer(0);
        visited[0] = true;
        int changes = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            for (int[] edge : adj.get(curr)) {
                int next = edge[0];
                int cost = edge[1];
                if (!visited[next]) {
                    visited[next] = true;
                    changes += cost;
                    q.offer(next);
                }
            }
        }
        return changes;
    }
}`,
    desc: "A Breadth-First Search approach. We build the exact same dual-adjacency list (cost 1 for original, 0 for reverse). We start at City 0 using a Queue and a boolean 'visited' array. As we process nodes level by level expanding outwards from 0, we simply add the edge 'cost' to our total changes. If an edge naturally points away from 0, its cost is 1, so we flip it and count it. If it points towards 0, its cost is 0, so the total doesn't increase."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|minReorder|dfs|Queue|LinkedList|offer|poll|isEmpty|length|visited|connections|changes|adj|curr|next|cost|parent|edge|n|i|c)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['Queue', 'LinkedList', 'Solution', 'List', 'ArrayList'].includes(part);
            const isPointer = ['visited', 'connections', 'changes', 'curr', 'next', 'cost', 'parent', 'edge', 'n', 'i', 'c', 'adj'].includes(part);
            const isMapCall = ['minReorder', 'dfs', 'offer', 'poll', 'isEmpty', 'length', 'add', 'get'].includes(part);
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

export default function MinReorderVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursive');
  
  const [nInput, setNInput] = useState('6');
  const [edgesInput, setEdgesInput] = useState('[[0,1],[1,3],[2,3],[4,0],[4,5]]');
  
  const [baseN, setBaseN] = useState<number>(6);
  const [baseEdgesArr, setBaseEdgesArr] = useState<number[][]>([[0,1],[1,3],[2,3],[4,0],[4,5]]);

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

  const parseInput = (nStr: string, edgesStr: string) => {
      let n = parseInt(nStr, 10);
      if (isNaN(n) || n < 2) n = 6;
      
      let parsedEdges: number[][] = [];
      try {
          let clean = edgesStr.trim();
          if (!clean.startsWith('[')) clean = `[${clean}]`;
          let inner = clean.substring(1, clean.length - 1).trim();
          if (inner.length > 0) {
              let rawRows = inner.split(/\]\s*,\s*\[/);
              parsedEdges = rawRows.map(r => {
                  let cleanedR = r.replace(/\[|\]/g, '').trim();
                  if (cleanedR === '') return [];
                  let nums = cleanedR.split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));
                  return nums.length >= 2 ? [nums[0], nums[1]] : [];
              }).filter(arr => arr.length === 2);
          }
      } catch (e) {
          parsedEdges = [[0,1],[1,3],[2,3],[4,0],[4,5]];
      }
      
      if (parsedEdges.length === 0) parsedEdges = [[0,1]];
      return { n, parsedEdges };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { n, parsedEdges } = parseInput(nInput, edgesInput);
      setBaseN(n);
      setBaseEdgesArr(parsedEdges);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [nInput, edgesInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation for Hierarchical Tree Layout (BFS from 0)
  const buildGraphGeometry = (n: number, edges: number[][]) => {
      let renderNodes: any[] = [];
      
      // Build pure undirected adj list to find depths
      let adj: Record<number, number[]> = {};
      for (let i=0; i<n; i++) adj[i] = [];
      for (let [u, v] of edges) {
          if (u < n && v < n) {
              adj[u].push(v);
              adj[v].push(u);
          }
      }

      // BFS to assign levels
      let levels: number[][] = [];
      let visited = new Set<number>([0]);
      let q = [0];
      
      while (q.length > 0) {
          let sz = q.length;
          let currentLevel: number[] = [];
          for (let i = 0; i < sz; i++) {
              let curr = q.shift()!;
              currentLevel.push(curr);
              for (let neighbor of adj[curr]) {
                  if (!visited.has(neighbor)) {
                      visited.add(neighbor);
                      q.push(neighbor);
                  }
              }
          }
          levels.push(currentLevel);
      }

      // Unconnected nodes handled gracefully
      for (let i = 0; i < n; i++) {
          if (!visited.has(i)) {
              if (levels.length === 0) levels.push([]);
              levels[0].push(i);
          }
      }

      // Assign coordinates
      levels.forEach((lvl, yIdx) => {
          lvl.forEach((nodeId, xIdx) => {
              renderNodes.push({
                  id: nodeId,
                  x: (xIdx - (lvl.length - 1) / 2) * 90,
                  y: yIdx * 90 + 60
              });
          });
      });

      return { nodes: renderNodes, originalEdges: edges, maxDepth: levels.length };
  };

  const graphData = useMemo(() => buildGraphGeometry(baseN, baseEdgesArr), [baseN, baseEdgesArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    if (n === 0) return [];

    let callStack: string[] = [];
    let adj: Record<number, {to: number, cost: number}[]> = {};
    for (let i=0; i<n; i++) adj[i] = [];
    
    let flippedEdges = new Set<string>();

    const cloneAdj = (adjMap: Record<number, {to: number, cost: number}[]>) => {
        let copy: Record<number, {to: number, cost: number}[]> = {};
        for(let k in adjMap) copy[k] = [...adjMap[k]];
        return copy;
    };
    
    if (selectedOpId === 'dfsRecursive') {
        let changes = 0;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                flippedEdges: new Set(flippedEdges), callStack: [...callStack], changes, adjState: cloneAdj(adj), ...st 
            } 
        });

        add("Function Call", `public int minReorder(int n, int[][] connections)`, 3, {});
        
        add("Init Adjacency List", `List<List<int[]>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());`, 5, { hlInitAdj: true });
        
        for (let i = 0; i < baseEdgesArr.length; i++) {
            let c = baseEdgesArr[i];
            if (c[0] >= n || c[1] >= n) continue;
            adj[c[0]].push({to: c[1], cost: 1});
            adj[c[1]].push({to: c[0], cost: 0});
            add("Build Graph Paths", `for (int[] c : connections) {\n    adj.get(c[0]).add(new int[]{c[1], 1});\n    adj.get(c[1]).add(new int[]{c[0], 0});\n}\nProcessing edge [${c[0]}, ${c[1]}]. Original direction (cost=1), reverse direction (cost=0).`, 7, { hlBuildEdges: true, buildEdgeU: c[0], buildEdgeV: c[1] });
        }
        
        const dfs = (curr: number, parent: number) => {
            if (steps.length > 2500) return; // guard

            let callStr = `dfs(${curr}, ${parent})`;
            callStack.push(callStr);
            
            add("DFS Entry", `private void dfs(int curr, int parent, List<List<int[]>> adj)\nEntering city ${curr}.`, 13, { currNodeId: curr });

            const neighbors = adj[curr] || [];
            
            for (let i = 0; i < neighbors.length; i++) {
                let next = neighbors[i].to;
                let cost = neighbors[i].cost;
                
                add("Check Connection", `for (int[] edge : adj.get(curr))\nChecking connection from ${curr} to ${next}. Cost to traverse this way is ${cost}.`, 14, { currNodeId: curr, hlForEdge: true, nextNodeId: next, cost });

                let isNotParent = next !== parent;
                add("Evaluate Parent", `if (next != parent)\nIs ${next} the parent (${parent})? ${!isNotParent ? 'YES. Ignoring to prevent infinite loop.' : 'NO. Valid path to explore.'}`, 17, { currNodeId: curr, hlIfParent: true, nextNodeId: next, cost, isNotParent });

                if (isNotParent) {
                    if (cost === 1) {
                        changes++;
                        flippedEdges.add(`${curr}-${next}`);
                    }
                    add("Accumulate Changes", `changes += cost;\nAdding cost ${cost} to total changes. Total is now ${changes}.${cost === 1 ? ' This edge points OUTWARD, so we must flip it!' : ' Edge naturally points INWARD toward 0.'}`, 18, { currNodeId: curr, hlAddChanges: true, nextNodeId: next, cost, changes });
                    
                    add("Recurse Deeper", `dfs(next, curr, adj);\nDiving into city ${next}.`, 19, { currNodeId: curr, hlRecurseDfs: true, nextNodeId: next });
                    dfs(next, curr);
                    
                    add("Backtrack", `Finished exploring city ${next}. Backtracking to city ${curr}.`, 14, { currNodeId: curr, hlForEdge: true });
                }
            }
            callStack.pop();
        };

        add("Start DFS", `dfs(0, -1, adj);\nStarting DFS from the capital (City 0).`, 10, { hlStartDfs: true, currNodeId: 0 });
        dfs(0, -1);

        add("Return Result", `return changes;\nTraversal complete. Total roads flipped: ${changes}.`, 11, { isSuccess: true, finalAns: changes });

    } 
    else if (selectedOpId === 'bfsIterative') {
        let q: number[] = [];
        let visited = new Set<number>();
        let changes = 0;

        const cloneQ = (arr: number[]) => [...arr];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                visited: new Set(visited), qState: cloneQ(q), flippedEdges: new Set(flippedEdges), changes, adjState: cloneAdj(adj), ...st 
            } 
        });

        add("Function Call", `public int minReorder(int n, int[][] connections)`, 2, {});
        
        add("Init Adjacency List", `List<List<int[]>> adj = new ArrayList<>();\nfor (int i = 0; i < n; i++) adj.add(new ArrayList<>());`, 4, { hlInitAdj: true });
        
        for (let i = 0; i < baseEdgesArr.length; i++) {
            let c = baseEdgesArr[i];
            if (c[0] >= n || c[1] >= n) continue;
            adj[c[0]].push({to: c[1], cost: 1});
            adj[c[1]].push({to: c[0], cost: 0});
            add("Build Graph Paths", `for (int[] c : connections) {\n    adj.get(c[0]).add(new int[]{c[1], 1});\n    adj.get(c[1]).add(new int[]{c[0], 0});\n}\nProcessing connection [${c[0]}, ${c[1]}]. Original direction (cost=1), reverse direction (cost=0).`, 6, { hlBuildEdges: true, buildEdgeU: c[0], buildEdgeV: c[1] });
        }

        add("Init BFS State", `Queue<Integer> q = new LinkedList<>();\nboolean[] visited = new boolean[n];\nint changes = 0;`, 9, { hlInitState: true });
        
        q.push(0);
        add("Enqueue Start", `q.offer(0);\nPush capital City 0 into the queue.`, 11, { hlEnqueueStart: true, currNodeId: 0 });
        
        visited.add(0);
        add("Mark Start Visited", `visited[0] = true;\nMarking City 0 as visited.`, 12, { hlMarkStartVisited: true, currNodeId: 0 });

        while (q.length > 0) {
            if (steps.length > 2500) break; // guard

            add("While Loop", `while (!q.isEmpty())\nQueue has nodes. Processing next level outward from City 0.`, 14, { hlWhile: true });
            
            let curr = q.shift()!;
            add("Poll Queue", `int curr = q.poll();\nDequeued city ${curr} to process its connections.`, 15, { currNodeId: curr, hlPoll: true });

            const neighbors = adj[curr] || [];
            
            for (let i = 0; i < neighbors.length; i++) {
                let next = neighbors[i].to;
                let cost = neighbors[i].cost;

                add("Check Connection", `for (int[] edge : adj.get(curr))\nChecking connection from ${curr} to ${next}. Cost to traverse this way is ${cost}.`, 16, { currNodeId: curr, hlForEdge: true, nextNodeId: next, cost });

                let isUnvisited = !visited.has(next);
                add("Evaluate Visited Status", `if (!visited[next])\nHave we visited city ${next} yet? ${!isUnvisited ? 'YES. Ignoring.' : 'NO. Proceeding outward.'}`, 19, { currNodeId: curr, hlIfUnvisited: true, nextNodeId: next, cost, isUnvisited });

                if (isUnvisited) {
                    visited.add(next);
                    add("Mark Visited", `visited[next] = true;\nMarking city ${next} as visited.`, 20, { currNodeId: curr, hlMarkVisited: true, nextNodeId: next, cost });
                    
                    if (cost === 1) {
                        changes++;
                        flippedEdges.add(`${curr}-${next}`);
                    }
                    add("Accumulate Changes", `changes += cost;\nAdding cost ${cost} to total changes. Total is now ${changes}.${cost === 1 ? ' This edge points OUTWARD, so we must flip it!' : ' Edge naturally points INWARD toward 0.'}`, 21, { currNodeId: curr, hlAddChanges: true, nextNodeId: next, cost, changes });
                    
                    q.push(next);
                    add("Enqueue Next", `q.offer(next);\nEnqueuing city ${next} for later exploration.`, 22, { currNodeId: curr, hlEnqueueNext: true, nextNodeId: next });
                }
            }
        }

        add("Queue Empty", `while (!q.isEmpty())\nQueue empty. BFS traversal from City 0 complete.`, 14, { hlWhile: true });
        add("Return Result", `return changes;\nAll reachable cities processed. Total roads flipped: ${changes}.`, 26, { isSuccess: true, finalAns: changes });
    }

    return steps;
  }, [baseN, baseEdgesArr, graphData, selectedOpId]);

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

      if (st.hlBuildEdges) {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-amber-400 ring-4 ring-amber-100 scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><LayersIcon size={14}/> Building Adjacency List</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400">Connection</span>
                          <div className="border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700">
                              [{String(st.buildEdgeU)}, {String(st.buildEdgeV)}]
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500">Original (Cost 1)</span>
                          <div className="border-2 text-base font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-rose-100 border-rose-400 text-rose-800">
                              adj[{String(st.buildEdgeU)}].add([{String(st.buildEdgeV)}, 1])
                          </div>
                      </div>

                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500">Reverse (Cost 0)</span>
                          <div className="border-2 text-base font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-emerald-100 border-emerald-400 text-emerald-800">
                              adj[{String(st.buildEdgeV)}].add([{String(st.buildEdgeU)}, 0])
                          </div>
                      </div>

                  </div>
              </div>
          );
      } else if (st.currNodeId !== undefined && st.currNodeId !== null) {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlAddChanges ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : (st.hlRecurseDfs || st.hlEnqueueNext ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200')}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Trace State</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPoll || st.hlStartDfs ? `text-${themeColor}-500` : 'text-slate-400'}`}>Curr City</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPoll || st.hlStartDfs ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {String(st.currNodeId)}
                          </div>
                      </div>

                      {st.nextNodeId !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400">
                                  <ArrowRight size={24} className={st.hlForEdge ? "text-amber-500 animate-pulse" : "text-slate-300"}/>
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlForEdge || st.hlIfUnvisited || st.hlIfParent ? `text-${themeColor}-500` : 'text-slate-400'}`}>Neighbor</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlForEdge || st.hlIfUnvisited || st.hlIfParent ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110` : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      {String(st.nextNodeId)}
                                  </div>
                              </div>
                              
                              {st.hlAddChanges ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.cost === 1 ? 'text-rose-500' : 'text-emerald-500'}`}>Edge Cost</span>
                                          <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md ${st.cost === 1 ? 'bg-rose-100 border-rose-400 text-rose-800' : 'bg-emerald-100 border-emerald-400 text-emerald-800'}`}>
                                              +{st.cost} {st.cost === 1 ? '(FLIP!)' : '(OK)'}
                                          </div>
                                      </div>
                                  </>
                              ) : st.isNotParent === false || st.isUnvisited === false ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Action</span>
                                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-slate-100 border-slate-300 text-slate-500`}>
                                              IGNORE / SKIP
                                          </div>
                                      </div>
                                  </>
                              ) : null}
                          </>
                      ) : (
                          <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                              Scanning connected routes...
                          </div>
                      )}

                  </div>
              </div>
          );
      } else {
          return (
              <div className="flex items-center justify-center w-full min-h-[80px]">
                  <span className="text-slate-400 italic text-sm font-mono">Initializing Graph Structures...</span>
              </div>
          );
      }
  }

  const renderVisuals = () => {
      if (graphData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Graph...</span>;

      // Container needs enough height to fit the whole radial tree layout
      const containerSize = Math.max(350, graphData.maxDepth * 90 + 150);

      // SVG Arrows Definition
      const arrowMarker = (
          <defs>
            <marker id="arrow-default" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0ea5e9" />
            </marker>
            <marker id="arrow-fixed" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
            <marker id="arrow-error" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
            </marker>
          </defs>
      );

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Data Trackers */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  <div className="flex flex-col gap-4 w-full md:w-1/3 shrink-0">
                      <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlAddChanges || st.isSuccess ? 'border-rose-300 ring-4 ring-rose-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-center items-center mb-1">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-rose-600 flex items-center gap-1`}>
                                  <RefreshCw size={14}/> Routes Flipped
                              </span>
                          </div>
                          <div className="text-4xl font-black font-mono text-center text-slate-700">{st.changes !== undefined ? String(st.changes) : '0'}</div>
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
                                          <span className="font-black leading-none">{String(val)}</span>
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

                  {/* Adjacency List Tracker */}
                  <div className={`w-full md:w-2/3 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlBuildEdges || st.hlForEdge ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                               <Database size={14}/> Adjacency List (adj)
                           </span>
                       </div>
                       <div className="flex gap-2 min-h-[80px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-start">
                           {st.adjState && Object.keys(st.adjState).length > 0 ? Object.keys(st.adjState).map(nodeIdStr => {
                               const nodeId = parseInt(nodeIdStr);
                               return (
                               <div key={`adj-${nodeId}`} className="flex flex-col gap-1 shrink-0 border border-slate-200 rounded-xl p-1.5 bg-slate-50 w-20">
                                   <span className="text-[10px] font-black text-center border-b border-slate-200 pb-1 text-slate-700">City {nodeId}</span>
                                   <div className="flex flex-col gap-1">
                                       {st.adjState[nodeId].length > 0 ? st.adjState[nodeId].map((edge: any, eIdx: number) => {
                                           let isHl = (st.currNodeId === nodeId && st.nextNodeId === edge.to) ||
                                                      (st.buildEdgeU === nodeId && st.buildEdgeV === edge.to && edge.cost === 1) ||
                                                      (st.buildEdgeV === nodeId && st.buildEdgeU === edge.to && edge.cost === 0);
                                           return (
                                               <div key={`adj-e-${eIdx}`} className={`text-[10px] font-mono px-1.5 py-1 rounded flex justify-between items-center transition-colors ${isHl ? 'bg-amber-200 text-amber-900 font-bold shadow-sm' : 'bg-white border border-slate-200 text-slate-600'}`}>
                                                   <span>&rarr;{edge.to}</span>
                                                   <span className={edge.cost === 1 ? 'text-rose-500 font-black' : 'text-emerald-500 font-black'}>{edge.cost}</span>
                                               </div>
                                           );
                                       }) : <span className="text-[9px] italic text-slate-400 text-center py-1">empty</span>}
                                   </div>
                               </div>
                           )}) : <span className="text-slate-400 italic text-xs font-mono px-2">Initializing...</span>}
                       </div>
                  </div>

              </div>

              {/* Free-floating Interactive State Space Graph */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex items-center justify-center`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Directed Map</span>
                      
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                              {arrowMarker}
                              {/* Render Directed Edges */}
                              {graphData.originalEdges.map((edgeArr: number[], idx: number) => {
                                  let u = edgeArr[0];
                                  let v = edgeArr[1];
                                  const uNode = graphData.nodes.find((n:any) => n.id === u);
                                  const vNode = graphData.nodes.find((n:any) => n.id === v);
                                  if (!uNode || !vNode) return null;

                                  let isBuildingThisEdge = st.hlBuildEdges && st.buildEdgeU === u && st.buildEdgeV === v;
                                  let isFlipped = st.flippedEdges && st.flippedEdges.has(`${u}-${v}`);
                                  let isActivelyChecking = st.currNodeId === u && st.nextNodeId === v && !isFlipped;
                                  
                                  // Render Logic
                                  // Default: u -> v (Outward)
                                  let sx = uNode.x, sy = uNode.y;
                                  let tx = vNode.x, ty = vNode.y;
                                  
                                  let strokeColor = '#cbd5e1'; // default slate
                                  let strokeWidth = 2;
                                  let opacity = 0.5;
                                  let markerId = "url(#arrow-default)";

                                  if (isBuildingThisEdge) {
                                      strokeColor = '#f59e0b'; // amber
                                      strokeWidth = 4;
                                      opacity = 1;
                                  } else if (st.hlBuildEdges) {
                                      opacity = 0.1; // dim out others during build phase
                                  } else if (isFlipped) {
                                      // It was flipped! So now it points v -> u (Inward toward 0)
                                      sx = vNode.x; sy = vNode.y;
                                      tx = uNode.x; ty = uNode.y;
                                      strokeColor = '#10b981'; // emerald fixed
                                      strokeWidth = 4;
                                      opacity = 1;
                                      markerId = "url(#arrow-fixed)";
                                  } else if (isActivelyChecking) {
                                      // Being evaluated, pointing the wrong way
                                      strokeColor = '#f43f5e'; // rose error
                                      strokeWidth = 4;
                                      opacity = 1;
                                      markerId = "url(#arrow-error)";
                                  }

                                  if (st.isSuccess && !isFlipped) {
                                      // Edges that naturally pointed towards 0
                                      strokeColor = '#10b981';
                                      strokeWidth = 3;
                                      opacity = 0.8;
                                      markerId = "url(#arrow-fixed)";
                                  }

                                  return <line key={`edge-${idx}`} x1={`calc(50% + ${sx}px)`} y1={sy} x2={`calc(50% + ${tx}px)`} y2={ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} markerEnd={markerId} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes (Cities) */}
                          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {graphData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isVisited = (selectedOpId === 'bfsIterative' && st.visited && st.visited.has(node.id)) || (selectedOpId === 'dfsRecursive' && st.callStack && st.callStack.some((c:any) => c.includes(`(${node.id},`)));
                              let isNeighbor = st.nextNodeId === node.id;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 opacity-80"; // Unvisited
                              
                              if (node.id === 0) {
                                  bgClass = "bg-slate-800 border-slate-900 text-white shadow-lg ring-4 ring-slate-200 z-10"; // Capital
                              } else if (isVisited && !isActive) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-100 shadow-sm";
                              }
                              
                              if (st.hlBuildEdges && (st.buildEdgeU === node.id || st.buildEdgeV === node.id)) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-100 shadow-lg text-amber-900 scale-110 z-20";
                              } else if (isActive) {
                                  bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                              } else if (isNeighbor) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-100 shadow-lg text-amber-900 scale-110 z-20";
                              }
                              
                              if (st.isSuccess && node.id !== 0) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-100 shadow-sm scale-100";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {isNeighbor && !isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 rounded shadow-lg animate-pulse`}>
                                              neighbor
                                          </span>
                                      )}

                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-sm md:text-xl leading-none`}>{String(node.id)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          </div>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Reorder Routes to City Zero</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Traversal (DFS/BFS)
                  </span>
                  <span>•</span>
                  <span>LeetCode 1466</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Directed Network Reversal</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>There are <code>n</code> cities numbered from <code>0</code> to <code>n - 1</code> and <code>n - 1</code> roads such that there is only one way to travel between two different cities (this network form a tree). The roads are represented by <code>connections</code> where <code>connections[i] = [a, b]</code> represents a directed road from city <code>a</code> to city <code>b</code>.</p>
                        <p className="font-bold mt-4">Your task is to reorder some roads such that everyone can travel to the capital (city 0). Return the minimum number of edges changed.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> n = 6, connections = [[0,1],[1,3],[2,3],[4,0],[4,5]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Roads <span className="text-rose-400 font-bold">0-&gt;1</span>, <span className="text-rose-400 font-bold">1-&gt;3</span>, and <span className="text-rose-400 font-bold">4-&gt;5</span> point AWAY from 0.<br/>
                                They must be flipped to point TOWARDS 0. Total flips = 3.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <defs>
                                    <marker id="arr-bad" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                                    </marker>
                                    <marker id="arr-good" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                    </marker>
                                </defs>
                                {/* 0 -> 1 (Bad) */}
                                <line x1="110" y1="30" x2="60" y2="90" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-bad)"/>
                                {/* 4 -> 0 (Good) */}
                                <line x1="160" y1="90" x2="110" y2="30" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-good)"/>
                                {/* 1 -> 3 (Bad) */}
                                <line x1="60" y1="90" x2="60" y2="150" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-bad)"/>
                                {/* 2 -> 3 (Good for 3, ultimately good for 0 if 1->3 flipped) */}
                                <line x1="20" y1="90" x2="60" y2="150" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-good)"/>
                                {/* 4 -> 5 (Bad) */}
                                <line x1="160" y1="90" x2="160" y2="150" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arr-bad)"/>

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="60" cy="90" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="94" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="160" cy="90" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="94" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="20" cy="90" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="20" y="94" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                <circle cx="60" cy="150" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="154" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>

                                <circle cx="160" cy="150" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="154" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>2 &le; n &le; 5 * 10^4</li>
                            <li>connections.length == n - 1</li>
                            <li>connections[i].length == 2</li>
                            <li>0 &le; a_i, b_i &lt; n</li>
                            <li>a_i != b_i</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">If we think of City 0 as the root of a tree, all edges must flow upwards towards the root. However, we only have directed paths. If we try to traverse from City 0 using the given edges, we can only walk along paths that point <strong>away</strong> from City 0. But those are exactly the paths that need to be reversed!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">We build a completely undirected adjacency list so we can freely traverse the entire tree starting from 0. To differentiate the original directions, we assign weights:</p>
                        <p className="text-sm leading-relaxed text-slate-600">Original edge <code>a -&gt; b</code> gets cost <code>1</code> (because traversing it away from 0 means it's wrong and needs flipping). Artificial reverse edge <code>b -&gt; a</code> gets cost <code>0</code> (because traversing it away from 0 means the real edge points towards 0, which is perfectly correct). Run DFS/BFS from 0 and sum the costs.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Number of Cities (N)</label>
                            <input type="number" value={nInput} onChange={(e) => setNInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="6" />
                        </div>
                        <div className="flex-[3] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Directed Connections [u, v]</label>
                            <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="[[0,1],[1,3],[2,3],[4,0],[4,5]]" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-emerald-400`}>
                                <PartyPopper size={24}/> TRAVERSAL COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully analyzed all network routes. Total flips required: {String(st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddChanges || st.cost === 1 ? 'text-rose-400' : (st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(${pan.y}px)) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the mathematical bounds of structural tree mutation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 1. Dual Adjacency Lists</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we only map the edges exactly as given, we can't reach the whole graph from City 0 (because some point the wrong way). The trick is to map the graph completely <strong>bidirectionally</strong>, but tag each edge with a cost.</p>
                        <p className="text-slate-600 leading-relaxed">Original edges <code>a -&gt; b</code> are tagged with cost 1. Artificial reverse edges <code>b -&gt; a</code> are tagged with cost 0. This way, we can walk everywhere from City 0, but only accumulate "flips" when we walk along an original edge pointing away from the capital.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Repeat size={24} className="text-emerald-500"/> 2. Preventing Infinite Loops</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Because we made the graph bidirectional, we risk infinite loops. In <strong>BFS</strong>, we use a standard <code>boolean[] visited</code> array. In <strong>DFS</strong>, because the graph is inherently a Tree structure (N cities, N-1 edges), we only need to pass the <code>parent</code> node parameter. If the <code>next</code> node equals our <code>parent</code>, we just ignore it.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We build the adjacency list in $O(N)$ time (since there are exactly $N-1$ edges). Then, our DFS/BFS visits every city exactly once, checking its neighbors. The total work perfectly scales with the number of cities.</li>
                            <li><strong>Space Complexity: O(N).</strong> The dual adjacency list stores exactly $2 \times (N-1)$ edges, which is $O(N)$. For DFS, the recursive call stack goes up to $O(N)$ deep. For BFS, the queue holds up to $O(N)$ cities. Total auxiliary space is strictly bounded by $O(N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential graph traversal problem that heavily tests 'state augmentation'. You must realize that simply following the given graph isn't enough—you have to modify how the graph is represented before searching it."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we start from the leaf cities and traverse backwards to City 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it is vastly more complicated.</p>
                            <p>If you start from the leaves, you need to identify all the leaf nodes first (by finding nodes with only 1 connection). Then, you would launch multiple BFS/DFS traversals inwards, having to manage merging paths and preventing duplicate edge counting. Starting at the destination (City 0) and radiating outward is mathematically identical but requires only a single traversal."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the DFS approach, why don't we need a <code>visited</code> array like we do in BFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we are guaranteed that the graph is a Tree (N nodes, N-1 edges, fully connected).</p>
                            <p>A Tree has no cycles. The only way to visit a node twice in a tree traversal is by immediately walking backwards across the edge you just came from. By passing the <code>parent</code> parameter down the recursion, we simply block that one backward step. This completely eliminates the need for an $O(N)$ visited array, saving a tiny bit of memory."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How does storing <code>new int[]&#123;neighbor, cost&#125;</code> affect cache performance compared to a purely flat array representation?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It does create object overhead in Java.</p>
                            <p>Every <code>new int[]</code> creates an object on the heap, which causes memory fragmentation and cache misses. For absolute peak performance in competitive programming, we would flatten this into two parallel arrays, or bitwise encode the neighbor ID and cost into a single 32-bit integer (e.g. <code>(neighbor &lt;&lt; 1) | cost</code>). However, for standard interviews, the <code>int[]</code> approach is perfectly acceptable and highly readable."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddChanges || st.cost === 1 ? 'text-rose-400' : (st.hlRecurseDfs || st.hlEnqueueNext ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                            <span className="font-black leading-none">{String(val)}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Directed Connections [u, v]</label>
                              <input type="text" value={edgesInput} onChange={(e) => setEdgesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="[[0,1],[1,3]..." />
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(${pan.y}px)) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Routes Flipped</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        {String(st.finalAns)}
                                    </div>
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