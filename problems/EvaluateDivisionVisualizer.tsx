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
    title: '1. DFS (Recursive Pathfinding)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(Q * (N+E)) | Space: O(N+E)',
    theme: 'emerald',
    code: `class Solution {
    public double[] calcEquation(List<List<String>> equations, double[] values, List<List<String>> queries) {
        Map<String, Map<String, Double>> graph = new HashMap<>();
        for (int i = 0; i < equations.size(); i++) {
            String u = equations.get(i).get(0), v = equations.get(i).get(1);
            double val = values[i];
            graph.putIfAbsent(u, new HashMap<>());
            graph.putIfAbsent(v, new HashMap<>());
            graph.get(u).put(v, val);
            graph.get(v).put(u, 1.0 / val);
        }
        double[] results = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            String src = queries.get(i).get(0), dst = queries.get(i).get(1);
            if (!graph.containsKey(src) || !graph.containsKey(dst)) {
                results[i] = -1.0;
            } else if (src.equals(dst)) {
                results[i] = 1.0;
            } else {
                Set<String> visited = new HashSet<>();
                results[i] = dfs(src, dst, 1.0, graph, visited);
            }
        }
        return results;
    }
    private double dfs(String curr, String dst, double acc, Map<String, Map<String, Double>> graph, Set<String> visited) {
        visited.add(curr);
        if (curr.equals(dst)) return acc;
        for (Map.Entry<String, Double> neighbor : graph.get(curr).entrySet()) {
            String next = neighbor.getKey();
            if (!visited.contains(next)) {
                double result = dfs(next, dst, acc * neighbor.getValue(), graph, visited);
                if (result != -1.0) return result;
            }
        }
        return -1.0;
    }
}`,
    desc: "A Depth-First Search approach. We translate the division equations into a directed, weighted graph. `A / B = 2.0` means an edge from A to B with weight 2.0, and an edge from B to A with weight 0.5 (the reciprocal). To evaluate a query `C / D`, we simply try to find a path from C to D. The answer is the product of all edge weights along that path. DFS explores deep into the network, keeping track of the accumulated product. If the destination is hit, the product bubbles up. If exhausted, it returns -1.0."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. BFS (Iterative Pathfinding)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(Q * (N+E)) | Space: O(N+E)',
    theme: 'sky',
    code: `class Solution {
    public double[] calcEquation(List<List<String>> eq, double[] vals, List<List<String>> queries) {
        Map<String, Map<String, Double>> graph = new HashMap<>();
        for (int i = 0; i < eq.size(); i++) {
            String u = eq.get(i).get(0), v = eq.get(i).get(1);
            graph.putIfAbsent(u, new HashMap<>());
            graph.putIfAbsent(v, new HashMap<>());
            graph.get(u).put(v, vals[i]);
            graph.get(v).put(u, 1.0 / vals[i]);
        }
        double[] res = new double[queries.size()];
        for (int i = 0; i < queries.size(); i++) {
            String src = queries.get(i).get(0), dst = queries.get(i).get(1);
            if (!graph.containsKey(src) || !graph.containsKey(dst)) {
                res[i] = -1.0;
            } else if (src.equals(dst)) {
                res[i] = 1.0;
            } else {
                Queue<Object[]> q = new LinkedList<>();
                Set<String> visited = new HashSet<>();
                q.offer(new Object[]{src, 1.0});
                visited.add(src);
                res[i] = -1.0;
                while (!q.isEmpty()) {
                    Object[] curr = q.poll();
                    String node = (String) curr[0]; double acc = (double) curr[1];
                    if (node.equals(dst)) { res[i] = acc; break; }
                    for (Map.Entry<String, Double> nbr : graph.get(node).entrySet()) {
                        if (!visited.contains(nbr.getKey())) {
                            visited.add(nbr.getKey());
                            q.offer(new Object[]{nbr.getKey(), acc * nbr.getValue()});
                        }
                    }
                }
            }
        }
        return res;
    }
}`,
    desc: "A Breadth-First Search approach. We build the exact same weighted Adjacency Map. For each query, we push the starting node into a Queue alongside an initial accumulated product of 1.0. We then process nodes level-by-level outward. As we enqueue neighbors, we multiply the current path's product by the edge weight. BFS guarantees that the first time we hit the destination node, we have found the shortest mathematical path, allowing us to immediately break out of the loop."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|calcEquation|dfs|Queue|LinkedList|offer|poll|isEmpty|length|size|get|put|putIfAbsent|containsKey|equals|entrySet|getKey|getValue|Map|HashMap|Set|HashSet|List|ArrayList|Object)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Queue', 'LinkedList', 'Solution', 'List', 'ArrayList', 'Map', 'HashMap', 'Set', 'HashSet', 'String', 'Double', 'Object'].includes(part);
            const isMapCall = ['calcEquation', 'dfs', 'offer', 'poll', 'isEmpty', 'length', 'size', 'get', 'put', 'putIfAbsent', 'containsKey', 'equals', 'entrySet', 'getKey', 'getValue'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-amber-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isNaN(parseInt(part)) && part.match(/^[a-zA-Z_]\w*$/) && !part.startsWith('"') ? `text-${theme}-300` : 
                  (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : 'text-emerald-400')
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

export default function EvaluateDivisionVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursive');
  
  const [equationsInput, setEquationsInput] = useState('[["a","b"],["b","c"]]');
  const [valuesInput, setValuesInput] = useState('[2.0, 3.0]');
  const [queriesInput, setQueriesInput] = useState('[["a","c"],["b","a"],["a","e"],["a","a"]]');
  
  const [baseEquations, setBaseEquations] = useState<string[][]>([["a","b"],["b","c"]]);
  const [baseValues, setBaseValues] = useState<number[]>([2.0, 3.0]);
  const [baseQueries, setBaseQueries] = useState<string[][]>([["a","c"],["b","a"],["a","e"],["a","a"]]);

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

  const parseInputs = (eqStr: string, valStr: string, qStr: string) => {
      let parsedEq: string[][] = [["a","b"],["b","c"]];
      let parsedVal: number[] = [2.0, 3.0];
      let parsedQ: string[][] = [["a","c"],["b","a"],["a","e"],["a","a"]];
      
      try { parsedEq = JSON.parse(eqStr); } catch (e) {}
      try { parsedVal = JSON.parse(valStr); } catch (e) {}
      try { parsedQ = JSON.parse(qStr); } catch (e) {}

      // Sanitization
      if (!Array.isArray(parsedEq) || !Array.isArray(parsedVal) || parsedEq.length !== parsedVal.length) {
          parsedEq = [["a","b"]]; parsedVal = [2.0];
      }
      if (!Array.isArray(parsedQ)) parsedQ = [["a","b"]];

      // Limit nodes to prevent overwhelming canvas
      let nodesSet = new Set<string>();
      let limitedEq = [];
      let limitedVal = [];
      for(let i=0; i<parsedEq.length; i++) {
          if(Array.isArray(parsedEq[i]) && parsedEq[i].length === 2 && typeof parsedVal[i] === 'number') {
              nodesSet.add(parsedEq[i][0]);
              nodesSet.add(parsedEq[i][1]);
              if (nodesSet.size <= 15) {
                  limitedEq.push([String(parsedEq[i][0]), String(parsedEq[i][1])]);
                  limitedVal.push(parsedVal[i]);
              }
          }
      }
      
      let limitedQ = parsedQ.filter(q => Array.isArray(q) && q.length === 2).map(q => [String(q[0]), String(q[1])]).slice(0, 10);

      return { eq: limitedEq, val: limitedVal, queries: limitedQ };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const { eq, val, queries } = parseInputs(equationsInput, valuesInput, queriesInput);
      setBaseEquations(eq);
      setBaseValues(val);
      setBaseQueries(queries);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [equationsInput, valuesInput, queriesInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Geometry Generation (Circular Layout for String Nodes)
  const buildGraphGeometry = (equations: string[][]) => {
      let uniqueNodes = new Set<string>();
      equations.forEach(eq => { uniqueNodes.add(eq[0]); uniqueNodes.add(eq[1]); });
      
      let nodesArr = Array.from(uniqueNodes);
      let n = nodesArr.length;
      
      let renderNodes: any[] = [];
      let radius = Math.max(120, Math.min(300, n * 35));
      
      nodesArr.forEach((nodeStr, i) => {
          const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
          renderNodes.push({
              id: nodeStr,
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle)
          });
      });

      return { nodes: renderNodes, radius };
  };

  const graphData = useMemo(() => buildGraphGeometry(baseEquations), [baseEquations]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (baseEquations.length === 0 || baseQueries.length === 0) return [];

    let callStack: string[] = [];
    let graph: Record<string, Record<string, number>> = {};
    let results: number[] = new Array(baseQueries.length).fill(0);
    let visited = new Set<string>();

    const cloneGraph = () => {
        let copy: Record<string, Record<string, number>> = {};
        for(let k in graph) { copy[k] = {...graph[k]}; }
        return copy;
    };

    if (selectedOpId === 'dfsRecursive') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                graphState: cloneGraph(), results: [...results], visited: new Set(visited), callStack: [...callStack], ...st 
            } 
        });

        add("Function Call", `public double[] calcEquation(...)`, 2, { hlPhase: 'init' });
        
        add("Init Graph Map", `Map<String, Map<String, Double>> graph = new HashMap<>();`, 3, { hlPhase: 'build' });
        
        for (let i = 0; i < baseEquations.length; i++) {
            let u = baseEquations[i][0];
            let v = baseEquations[i][1];
            let val = baseValues[i];
            
            add("Loop Equations", `for (int i = 0; i < equations.size(); i++)\nProcessing equation ${i}: ${u} / ${v} = ${val}`, 4, { hlPhase: 'build', b_i: i });
            
            if (!graph[u]) graph[u] = {};
            if (!graph[v]) graph[v] = {};
            
            graph[u][v] = val;
            graph[v][u] = 1.0 / val;
            
            add("Add Edges", `graph.get(u).put(v, val);\ngraph.get(v).put(u, 1.0 / val);\nAdded edge ${u}->${v} (${val}) and reverse ${v}->${u} (${(1.0/val).toFixed(2)})`, 9, { hlPhase: 'build', b_i: i, activeU: u, activeV: v, activeW1: val, activeW2: 1.0/val });
        }

        add("Init Results Array", `double[] results = new double[queries.size()];`, 12, { hlPhase: 'query' });

        const dfs = (curr: string, dst: string, acc: number) => {
            if (steps.length > 2500) return -1.0;

            callStack.push(`dfs("${curr}", ${acc.toFixed(2)})`);
            
            add("DFS Entry", `private double dfs(..., String curr, String dst, double acc...)\nEntering node '${curr}'. Current product: ${acc.toFixed(2)}. Target: '${dst}'`, 26, { hlPhase: 'traverse', currNodeId: curr, accVal: acc, targetId: dst });

            visited.add(curr);
            add("Mark Visited", `visited.add(curr);\nMarking '${curr}' to prevent cycles.`, 27, { hlPhase: 'traverse', currNodeId: curr, accVal: acc, targetId: dst });

            let isDst = curr === dst;
            add("Check Destination", `if (curr.equals(dst)) return acc;\nAre we at destination '${dst}'? ${isDst ? 'YES!' : 'NO.'}`, 28, { hlPhase: 'traverse', currNodeId: curr, accVal: acc, targetId: dst, isDst });

            if (isDst) {
                add("Return Value", `return acc;\nFound path! Bubbling up accumulated product ${acc.toFixed(2)}.`, 28, { hlPhase: 'traverse', currNodeId: curr, accVal: acc, targetId: dst });
                callStack.pop();
                return acc;
            }

            for (let next in graph[curr]) {
                let edgeVal = graph[curr][next];
                add("Check Neighbor", `for (Map.Entry<String, Double> neighbor : graph.get(curr).entrySet())\nChecking connection from '${curr}' to '${next}' (weight ${edgeVal.toFixed(2)}).`, 29, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc });

                let isUnv = !visited.has(next);
                add("Check Unvisited", `if (!visited.contains(next))\nIs '${next}' unvisited? ${isUnv ? 'YES. Will traverse.' : 'NO. Cycle detected, skipping.'}`, 31, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc });

                if (isUnv) {
                    add("Recurse DFS", `double result = dfs(next, dst, acc * neighbor.getValue(), ...);\nMultiplying ${acc.toFixed(2)} * ${edgeVal.toFixed(2)} = ${(acc * edgeVal).toFixed(2)}. Diving deeper.`, 32, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc, newAcc: acc * edgeVal });
                    
                    let res = dfs(next, dst, acc * edgeVal);
                    
                    add("Evaluate Bubble Return", `if (result != -1.0) return result;\nDFS returned ${res.toFixed(2)}. Was a valid path found? ${res !== -1.0 ? 'YES!' : 'NO. Try next neighbor.'}`, 33, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst });
                    if (res !== -1.0) {
                        callStack.pop();
                        return res;
                    }
                }
            }
            
            add("Exhausted Neighbors", `return -1.0;\nAll paths from '${curr}' exhausted without finding '${dst}'. Returning -1.0.`, 36, { hlPhase: 'traverse', currNodeId: curr, targetId: dst });
            callStack.pop();
            return -1.0;
        };

        for (let i = 0; i < baseQueries.length; i++) {
            let src = baseQueries[i][0];
            let dst = baseQueries[i][1];
            
            add("Loop Queries", `for (int i = 0; i < queries.size(); i++)\nProcessing query ${i}: Evaluate ${src} / ${dst}`, 13, { hlPhase: 'query', q_i: i, src, dst });

            let srcMissing = !graph[src];
            let dstMissing = !graph[dst];

            add("Validate Nodes", `if (!graph.containsKey(src) || !graph.containsKey(dst))\nAre nodes missing? src missing: ${srcMissing}. dst missing: ${dstMissing}.`, 15, { hlPhase: 'query', q_i: i, src, dst });

            if (srcMissing || dstMissing) {
                results[i] = -1.0;
                add("Record Failure", `results[i] = -1.0;\nOne or both nodes completely unknown. Path impossible.`, 16, { hlPhase: 'query', q_i: i, src, dst });
            } else if (src === dst) {
                add("Check Same Node", `} else if (src.equals(dst))\nNodes are identical.`, 17, { hlPhase: 'query', q_i: i, src, dst });
                results[i] = 1.0;
                add("Record Trivial", `results[i] = 1.0;\n${src} / ${src} is mathematically 1.0.`, 18, { hlPhase: 'query', q_i: i, src, dst });
            } else {
                add("Prepare DFS", `} else {\nBoth nodes exist. Launching traversal to find path from ${src} to ${dst}.`, 19, { hlPhase: 'query', q_i: i, src, dst });
                visited.clear();
                
                let pathRes = dfs(src, dst, 1.0);
                results[i] = pathRes;
                add("Record DFS Result", `results[i] = dfs(...);\nTraversal completed for query ${i}. Assigned result ${pathRes.toFixed(2)} to array.`, 21, { hlPhase: 'query', q_i: i, src, dst });
            }
        }

        add("Return Complete", `return results;\nAll queries processed.`, 24, { hlPhase: 'done', isSuccess: true });
    } 
    else if (selectedOpId === 'bfsIterative') {
        let q: {node: string, acc: number}[] = [];
        
        const cloneQ = (arr: any[]) => arr.map(e => ({...e}));

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                graphState: cloneGraph(), results: [...results], visited: new Set(visited), qState: cloneQ(q), ...st 
            } 
        });

        add("Function Call", `public double[] calcEquation(...)`, 2, { hlPhase: 'init' });
        
        add("Init Graph Map", `Map<String, Map<String, Double>> graph = new HashMap<>();`, 3, { hlPhase: 'build' });
        
        for (let i = 0; i < baseEquations.length; i++) {
            let u = baseEquations[i][0];
            let v = baseEquations[i][1];
            let val = baseValues[i];
            
            add("Loop Equations", `for (int i = 0; i < eq.size(); i++)\nProcessing equation ${i}: ${u} / ${v} = ${val}`, 4, { hlPhase: 'build', b_i: i });
            
            if (!graph[u]) graph[u] = {};
            if (!graph[v]) graph[v] = {};
            
            graph[u][v] = val;
            graph[v][u] = 1.0 / val;
            
            add("Add Edges", `graph.get(u).put(v, vals[i]);\ngraph.get(v).put(u, 1.0 / vals[i]);\nAdded edge ${u}->${v} (${val}) and reverse ${v}->${u} (${(1.0/val).toFixed(2)})`, 8, { hlPhase: 'build', b_i: i, activeU: u, activeV: v, activeW1: val, activeW2: 1.0/val });
        }

        add("Init Results Array", `double[] res = new double[queries.size()];`, 11, { hlPhase: 'query' });

        for (let i = 0; i < baseQueries.length; i++) {
            let src = baseQueries[i][0];
            let dst = baseQueries[i][1];
            
            add("Loop Queries", `for (int i = 0; i < queries.size(); i++)\nProcessing query ${i}: Evaluate ${src} / ${dst}`, 12, { hlPhase: 'query', q_i: i, src, dst });

            let srcMissing = !graph[src];
            let dstMissing = !graph[dst];

            add("Validate Nodes", `if (!graph.containsKey(src) || !graph.containsKey(dst))\nAre nodes missing? src missing: ${srcMissing}. dst missing: ${dstMissing}.`, 14, { hlPhase: 'query', q_i: i, src, dst });

            if (srcMissing || dstMissing) {
                results[i] = -1.0;
                add("Record Failure", `res[i] = -1.0; continue;\nOne or both nodes unknown. Path impossible.`, 15, { hlPhase: 'query', q_i: i, src, dst });
                continue;
            } else if (src === dst) {
                add("Check Same Node", `} else if (src.equals(dst))\nNodes are identical.`, 16, { hlPhase: 'query', q_i: i, src, dst });
                results[i] = 1.0;
                add("Record Trivial", `res[i] = 1.0;\n${src} / ${src} is mathematically 1.0.`, 17, { hlPhase: 'query', q_i: i, src, dst });
            } else {
                add("Prepare BFS", `Queue<Object[]> q = new LinkedList<>();\nSet<String> visited = new HashSet<>();\nBoth nodes exist. Launching BFS to find shortest path.`, 19, { hlPhase: 'traverse', q_i: i, src, dst });
                
                q = [];
                visited.clear();
                let ans = -1.0;

                q.push({node: src, acc: 1.0});
                visited.add(src);
                add("Enqueue Start", `q.offer(new Object[]{src, 1.0});\nvisited.add(src);\nEnqueuing start node '${src}' with base product 1.0.`, 21, { hlPhase: 'traverse', currNodeId: src, targetId: dst });

                while (q.length > 0) {
                    if (steps.length > 2500) break;
                    add("While Loop", `while (!q.isEmpty())\nQueue is not empty. Processing next frontier.`, 24, { hlPhase: 'traverse', targetId: dst });

                    let currObj = q.shift()!;
                    let curr = currObj.node;
                    let acc = currObj.acc;

                    add("Poll Queue", `Object[] curr = q.poll();\nString node = ...; double acc = ...;\nDequeued node '${curr}' with current product ${acc.toFixed(2)}.`, 25, { hlPhase: 'traverse', currNodeId: curr, targetId: dst, accVal: acc });

                    let isDst = curr === dst;
                    add("Check Target", `if (node.equals(dst))\nIs '${curr}' our destination '${dst}'? ${isDst ? 'YES!' : 'NO.'}`, 27, { hlPhase: 'traverse', currNodeId: curr, targetId: dst, accVal: acc });

                    if (isDst) {
                        ans = acc;
                        add("Break Success", `{ res[i] = acc; break; }\nFound shortest path to destination! Setting result and breaking loop.`, 27, { hlPhase: 'traverse', currNodeId: curr, targetId: dst, accVal: acc });
                        break;
                    }

                    for (let next in graph[curr]) {
                        let edgeVal = graph[curr][next];
                        add("Check Neighbor", `for (Map.Entry<String, Double> nbr : graph.get(node).entrySet())\nChecking connection '${curr}' -> '${next}' (weight ${edgeVal.toFixed(2)}).`, 28, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc });

                        let isUnv = !visited.has(next);
                        add("Check Visited", `if (!visited.contains(nbr.getKey()))\nHas '${next}' been visited? ${!isUnv ? 'YES. Ignoring.' : 'NO. Enqueueing it.'}`, 29, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc });

                        if (isUnv) {
                            visited.add(next);
                            let newAcc = acc * edgeVal;
                            q.push({node: next, acc: newAcc});
                            add("Enqueue Neighbor", `visited.add(nbr.getKey());\nq.offer(new Object[]{nbr.getKey(), acc * nbr.getValue()});\nMultiplying ${acc.toFixed(2)} * ${edgeVal.toFixed(2)} = ${newAcc.toFixed(2)}. Added to queue.`, 30, { hlPhase: 'traverse', currNodeId: curr, nextNodeId: next, targetId: dst, accVal: acc, newAcc });
                        }
                    }
                }
                
                results[i] = ans;
                add("Record BFS Result", `res[i] = ans;\nBFS complete. Assigned result ${ans.toFixed(2)} to array.`, 36, { hlPhase: 'query', q_i: i, src, dst });
            }
        }

        add("Return Complete", `return res;\nAll queries processed.`, 37, { hlPhase: 'done', isSuccess: true });
    }

    return steps;
  }, [baseEquations, baseValues, baseQueries, graphData, selectedOpId]);

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

      if (st.hlPhase === 'build') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-amber-400 ring-4 ring-amber-100 scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Database size={14}/> Graph Construction Phase</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400">Equation</span>
                          <div className="border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700">
                              {st.activeU} / {st.activeV} = {st.activeW1 !== undefined ? String(st.activeW1) : '?'}
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500">Directed Edge</span>
                          <div className="border-2 text-base font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-emerald-100 border-emerald-400 text-emerald-800">
                              {st.activeU} &rarr; {st.activeV} : {st.activeW1 !== undefined ? String(st.activeW1) : '?'}
                          </div>
                      </div>

                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-sky-500">Reciprocal Edge</span>
                          <div className="border-2 text-base font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-sky-100 border-sky-400 text-sky-800">
                              {st.activeV} &rarr; {st.activeU} : {st.activeW2 !== undefined ? String(st.activeW2.toFixed(4)) : '?'}
                          </div>
                      </div>

                  </div>
              </div>
          );
      } else if (st.hlPhase === 'query') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-violet-400 ring-4 ring-violet-100 scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Query Evaluation Phase</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400">Processing</span>
                          <div className="border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700">
                              {st.src !== undefined ? String(st.src) : '?'} / {st.dst !== undefined ? String(st.dst) : '?'}
                          </div>
                      </div>

                      <ArrowRight size={24} className="text-slate-300"/>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className="text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-violet-500">Status</span>
                          <div className="border-2 text-base font-black px-4 py-2.5 rounded-xl transition-all duration-500 shadow-md bg-violet-100 border-violet-400 text-violet-800 uppercase tracking-widest">
                              {curStepData.phase}
                          </div>
                      </div>

                  </div>
              </div>
          );
      } else if (st.hlPhase === 'traverse') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Graph Traversal</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Curr Node</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-lg scale-110`}>
                              {st.currNodeId !== undefined ? String(st.currNodeId) : '?'}
                          </div>
                      </div>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Acc Product</span>
                          <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 bg-slate-50 border-slate-300 text-slate-700`}>
                              {st.accVal !== undefined ? String(st.accVal.toFixed(2)) : '1.0'}
                          </div>
                      </div>

                      {st.nextNodeId !== undefined ? (
                          <>
                              <div className="flex flex-col items-center justify-center font-bold px-2 text-slate-400">
                                  <ArrowRight size={24} className="text-amber-500 animate-pulse"/>
                              </div>

                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Neighbor</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110`}>
                                      {String(st.nextNodeId)}
                                  </div>
                              </div>
                              
                              {st.newAcc !== undefined ? (
                                  <>
                                      <ArrowRight size={24} className="text-slate-300"/>
                                      <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>New Product</span>
                                          <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md bg-${themeColor}-100 border-${themeColor}-400 text-${themeColor}-800`}>
                                              {String(st.newAcc.toFixed(2))}
                                          </div>
                                      </div>
                                  </>
                              ) : null}
                          </>
                      ) : (
                          <div className="flex items-center justify-center min-h-[80px] px-8 text-slate-400 italic text-sm font-mono">
                              Target: {st.targetId !== undefined ? String(st.targetId) : '?'}
                          </div>
                      )}

                  </div>
              </div>
          );
      }
      return (
          <div className="flex items-center justify-center w-full min-h-[80px]">
              <span className="text-slate-400 italic text-sm font-mono">Initializing System...</span>
          </div>
      );
  }

  const renderVisuals = () => {
      if (graphData.nodes.length === 0 && !st.isSuccess && st.hlPhase !== 'init') return <span className="text-slate-400 italic mt-10">Processing Graph...</span>;

      // Container height
      const containerSize = Math.max(350, graphData.radius * 2 + 100);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Data Trackers */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  {/* Adjacency List Tracker */}
                  <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'build' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                               <Database size={14}/> Graph Map
                           </span>
                       </div>
                       <div className="flex gap-2 min-h-[80px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-start">
                           {st.graphState && Object.keys(st.graphState).length > 0 ? Object.keys(st.graphState).map(nodeStr => {
                               return (
                               <div key={`adj-${nodeStr}`} className="flex flex-col gap-1 shrink-0 border border-slate-200 rounded-xl p-1.5 bg-slate-50 min-w-[80px]">
                                   <span className="text-[10px] font-black text-center border-b border-slate-200 pb-1 text-slate-700">{nodeStr}</span>
                                   <div className="flex flex-col gap-1">
                                       {Object.keys(st.graphState[nodeStr]).length > 0 ? Object.keys(st.graphState[nodeStr]).map((neighbor, eIdx) => {
                                           let val = st.graphState[nodeStr][neighbor];
                                           let isHl = (st.currNodeId === nodeStr && st.nextNodeId === neighbor) ||
                                                      (st.hlBuildEdges && st.buildEdgeU === nodeStr && st.buildEdgeV === neighbor) ||
                                                      (st.hlBuildEdges && st.buildEdgeV === nodeStr && st.buildEdgeU === neighbor);
                                           return (
                                               <div key={`adj-e-${eIdx}`} className={`text-[10px] font-mono px-1.5 py-1 rounded flex justify-between items-center transition-colors gap-2 ${isHl ? 'bg-amber-200 text-amber-900 font-bold shadow-sm' : 'bg-white border border-slate-200 text-slate-600'}`}>
                                                   <span>&rarr;{neighbor}</span>
                                                   <span className="text-emerald-600 font-black">{String(val.toFixed(2))}</span>
                                               </div>
                                           );
                                       }) : <span className="text-[9px] italic text-slate-400 text-center py-1">empty</span>}
                                   </div>
                               </div>
                           )}) : <span className="text-slate-400 italic text-xs font-mono px-2">Initializing Graph Map...</span>}
                       </div>
                  </div>

                  {/* Results Array */}
                  <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-slate-200`}>
                      <div className="flex justify-between items-center mb-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest text-slate-600 flex items-center gap-2`}>
                              <ListOrdered size={14}/> Results Array
                          </span>
                      </div>
                      <div className="flex flex-col gap-1 font-mono items-start h-full max-h-[120px] overflow-y-auto scrollbar-none">
                          {baseQueries.map((qArr, qIdx) => {
                              let resultVal = st.results && st.results[qIdx] !== undefined ? st.results[qIdx] : 0.0;
                              let isChecking = st.q_i === qIdx;
                              let displayVal = resultVal !== 0.0 ? String(resultVal.toFixed(2)) : '0.00';
                              
                              let cellClass = "bg-slate-50 border-slate-200 text-slate-400";
                              if (isChecking) cellClass = "bg-violet-100 border-violet-400 text-violet-900 shadow-md scale-105 z-10 font-bold";
                              else if (resultVal !== 0.0) cellClass = resultVal === -1.0 ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-emerald-50 border-emerald-200 text-emerald-700";

                              return (
                                  <div key={`res-${qIdx}`} className={`flex items-center w-full justify-between gap-4 border rounded-md px-2 py-1 transition-all duration-300 text-xs ${cellClass}`}>
                                      <span className="opacity-70">{qArr[0]}/{qArr[1]}</span>
                                      <span className="font-black">{displayVal}</span>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Queue / Stack Status */}
                  {selectedOpId === 'bfsIterative' ? (
                      <div className={`w-48 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlEnqueueNext || st.hlEnqueueStart || st.hlPoll ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> BFS Queue
                              </span>
                          </div>
                          <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto scrollbar-none flex-1 pb-1">
                              {st.qState && st.qState.length > 0 ? st.qState.map((obj: any, idx: number) => (
                                  <div key={`q-${idx}`} className={`w-full flex justify-between items-center border-2 rounded-lg px-2 py-1 font-mono text-[9px] ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 shadow-sm' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                      <span className="font-black">{String(obj.node)}</span>
                                      <span>{String(obj.acc.toFixed(2))}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                          </div>
                      </div>
                  ) : (
                      <div className={`w-48 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.callStack && st.callStack.length > 0 && !st.isSuccess ? 'border-emerald-300 ring-4 ring-emerald-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> DFS Call Stack
                              </span>
                          </div>
                          <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto scrollbar-none flex-1 pb-1">
                               {st.callStack && st.callStack.length > 0 ? st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`cs-${idx}`} className={`w-full py-1 px-2 rounded-md border font-mono text-[8px] font-black transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' : 'bg-slate-100 text-slate-500 border-slate-200 opacity-80'}`}>
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
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute top-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Directed Map</span>
                      
                      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                              <defs>
                                <marker id="arrow-default" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                                </marker>
                                <marker id="arrow-active" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                                </marker>
                              </defs>
                              
                              {/* Render Edges as Quadratic Curves */}
                              {st.graphState && Object.keys(st.graphState).map(u => {
                                  return Object.keys(st.graphState[u]).map(v => {
                                      const uNode = graphData.nodes.find((n:any) => n.id === u);
                                      const vNode = graphData.nodes.find((n:any) => n.id === v);
                                      if (!uNode || !vNode) return null;

                                      let val = st.graphState[u][v];
                                      
                                      let isBuildingThisEdge = st.hlBuildEdges && st.buildEdgeU === u && st.buildEdgeV === v;
                                      let isBuildingReverse = st.hlBuildEdges && st.buildEdgeU === v && st.buildEdgeV === u;
                                      let isActivelyChecking = st.currNodeId === u && st.nextNodeId === v;
                                      let isPathTrace = st.hlPhase === 'traverse' && st.currNodeId === v && st.callStack && st.callStack.some((c:any) => c.includes(`"${u}"`)); // Approximate path
                                      
                                      let sx = uNode.x, sy = uNode.y;
                                      let tx = vNode.x, ty = vNode.y;
                                      
                                      // Curve math
                                      let dx = tx - sx;
                                      let dy = ty - sy;
                                      let dist = Math.sqrt(dx*dx + dy*dy);
                                      let nx = -dy / dist;
                                      let ny = dx / dist;
                                      let offset = 25; // Curve distance
                                      
                                      let cx = (sx + tx) / 2 + nx * offset;
                                      let cy = (sy + ty) / 2 + ny * offset;

                                      let textX = cx + nx * 8;
                                      let textY = cy + ny * 8;
                                      
                                      let strokeColor = '#cbd5e1'; 
                                      let strokeWidth = 2;
                                      let opacity = 0.3;
                                      let markerId = "url(#arrow-default)";
                                      let textColor = "#94a3b8";

                                      if (isBuildingThisEdge) {
                                          strokeColor = '#10b981'; // emerald
                                          strokeWidth = 4;
                                          opacity = 1;
                                          textColor = "#059669";
                                      } else if (isBuildingReverse) {
                                          strokeColor = '#38bdf8'; // sky
                                          strokeWidth = 4;
                                          opacity = 1;
                                          textColor = "#0284c7";
                                      } else if (st.hlPhase === 'build') {
                                          opacity = 0.8;
                                      } else if (isActivelyChecking) {
                                          strokeColor = '#f59e0b'; // amber
                                          strokeWidth = 4;
                                          opacity = 1;
                                          markerId = "url(#arrow-active)";
                                          textColor = "#d97706";
                                      } else if (isPathTrace) {
                                          strokeColor = themeColor === 'sky' ? '#38bdf8' : '#34d399';
                                          strokeWidth = 3;
                                          opacity = 0.8;
                                      }

                                      return (
                                          <g key={`edge-${u}-${v}`} style={{ transform: `translate(calc(50% + ${sx}px), calc(50% + ${sy}px))` }}>
                                              {/* Shift to local coords relative to sx, sy */}
                                              <path 
                                                  d={`M 0 0 Q ${cx-sx} ${cy-sy} ${tx-sx} ${ty-sy}`} 
                                                  fill="none" 
                                                  stroke={strokeColor} 
                                                  strokeWidth={strokeWidth} 
                                                  opacity={opacity} 
                                                  markerEnd={markerId}
                                                  className="transition-all duration-300"
                                              />
                                              <text x={textX-sx} y={textY-sy} fill={textColor} fontSize="10" textAnchor="middle" fontWeight="bold" opacity={Math.max(opacity, 0.5)} className="transition-all duration-300">
                                                  {String(val.toFixed(2))}
                                              </text>
                                          </g>
                                      );
                                  });
                              })}
                          </svg>

                          {/* Render Nodes (Strings) */}
                          <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {graphData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isVisited = st.visited && st.visited.has(node.id);
                              let isNeighbor = st.nextNodeId === node.id;
                              let isTarget = st.targetId === node.id;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 opacity-80"; // Unvisited
                              
                              if (isVisited) {
                                  bgClass = "bg-slate-200 border-slate-400 text-slate-700 opacity-100 shadow-sm";
                              }
                              
                              if (st.hlPhase === 'build' && (st.buildEdgeU === node.id || st.buildEdgeV === node.id)) {
                                  bgClass = "bg-emerald-100 border-emerald-400 ring-4 ring-emerald-100 shadow-lg text-emerald-900 scale-110 z-20";
                              } else if (isActive) {
                                  bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                              } else if (isTarget && st.hlPhase === 'traverse') {
                                  bgClass = "bg-violet-100 border-violet-400 ring-4 ring-violet-100 shadow-lg text-violet-900 scale-110 z-20";
                              } else if (isNeighbor) {
                                  bgClass = "bg-amber-100 border-amber-400 ring-4 ring-amber-100 shadow-lg text-amber-900 scale-110 z-20";
                              }
                              
                              if (st.isSuccess) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-100 shadow-sm scale-100";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: 'translate(-50%, -50%)' }}>
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
                                      {isTarget && !isActive && !isNeighbor && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-violet-500 text-white px-1.5 rounded shadow-lg`}>
                                              TARGET
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Evaluate Division</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Weighted Graph Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 399</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Calculator size={28}/> Graph-Based Math</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an array of variable pairs <code>equations</code> and an array of real numbers <code>values</code>, where <code>equations[i] = [A_i, B_i]</code> and <code>values[i]</code> represent the equation <code>A_i / B_i = values[i]</code>.</p>
                        <p>You are also given some <code>queries</code>, where <code>queries[j] = [C_j, D_j]</code> represents the <code>jth</code> query where you must find the answer for <code>C_j / D_j</code>.</p>
                        <p className="font-bold mt-4">Return the answers to all queries. If a single answer cannot be determined, return <code>-1.0</code>.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Equations:</strong> [["a","b"],["b","c"]]<br/><strong>Values:</strong> [2.0, 3.0]<br/><strong>Queries:</strong> [["a","c"],["b","a"],["a","e"]]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[6.00000, 0.50000, -1.00000]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                a / c = (a / b) * (b / c) = 2.0 * 3.0 = <span className="text-emerald-400 font-bold">6.0</span><br/>
                                b / a = 1 / (a / b) = 1 / 2.0 = <span className="text-emerald-400 font-bold">0.5</span><br/>
                                a / e = <span className="text-rose-400 font-bold">-1.0</span> (e is completely unknown to the system)
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <defs>
                                    <marker id="arr-ex" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                                    </marker>
                                </defs>
                                {/* a -> b */}
                                <path d="M 40 100 Q 90 70 140 100" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-ex)"/>
                                <text x="90" y="70" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">2.0</text>
                                {/* b -> a */}
                                <path d="M 140 100 Q 90 130 40 100" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arr-ex)"/>
                                <text x="90" y="140" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">0.5</text>
                                
                                {/* b -> c */}
                                <path d="M 140 100 Q 170 70 200 100" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arr-ex)"/>
                                <text x="170" y="70" fill="#10b981" fontSize="10" textAnchor="middle" fontWeight="bold">3.0</text>

                                <circle cx="40" cy="100" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="40" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">a</text>
                                
                                <circle cx="140" cy="100" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="140" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">b</text>

                                <circle cx="200" cy="100" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="200" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">c</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>1 &le; equations.length &le; 20</li>
                            <li>equations[i].length == 2</li>
                            <li>1 &le; queries.length &le; 20</li>
                            <li>Variables are strings of length 1-5.</li>
                            <li>0.0 &lt; values[i] &le; 20.0</li>
                            <li>No contradictions exist in the input.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Math divisions follow the transitive property: if $A / B = 2$ and $B / C = 3$, then $A / C = (A / B) \times (B / C) = 2 \times 3 = 6$.</p>
                        <p className="text-sm leading-relaxed mt-2">This maps perfectly to a <strong>Directed Weighted Graph</strong>. Variables are Nodes. The division ratio is the Edge Weight. Finding the answer to a query $X / Y$ is identical to finding a valid path from Node X to Node Y, multiplying all the edge weights together as we walk the path.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">Step 1 is always building the Adjacency Map. If $A \to B$ has weight $V$, we must also insert a reciprocal edge $B \to A$ with weight $1 / V$.</p>
                        <p className="text-sm leading-relaxed text-slate-600">Step 2 is querying. We can use <strong>DFS</strong> or <strong>BFS</strong> to explore the graph from the source node to the destination node. As we pass from node to node, we multiply our running total. We must use a <code>visited</code> set to avoid infinite loops between A and B.</p>
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
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Equations Input</label>
                            <input type="text" value={equationsInput} onChange={(e) => setEquationsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder='[["a","b"],["b","c"]]' />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Values Input</label>
                            <input type="text" value={valuesInput} onChange={(e) => setValuesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="[2.0, 3.0]" />
                        </div>
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Queries Input</label>
                            <input type="text" value={queriesInput} onChange={(e) => setQueriesInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder='[["a","c"],["b","a"]]' />
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
                                <PartyPopper size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Successfully evaluated all division queries.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'build' ? 'text-amber-400' : (st.hlPhase === 'query' ? 'text-violet-400' : `text-${themeColor}-400`)}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Graph Pathfinding with Edge Weights.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Database size={24} className="text-sky-500"/> 1. Graph Construction</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The input arrays are disconnected pieces of information. To evaluate an arbitrary division like <code>x / z</code>, we need to trace a path through intermediate variables like <code>x / y</code> and <code>y / z</code>.</p>
                        <p className="text-slate-600 leading-relaxed">We represent this as a <strong>Directed Weighted Graph</strong>. For every equation <code>A / B = V</code>, we add an edge <code>A &rarr; B</code> with weight <code>V</code>. Crucially, we must also add the reverse edge <code>B &rarr; A</code> with weight <code>1.0 / V</code>, because mathematically, if $A/B = 2$, then $B/A = 0.5$.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 2. DFS Pathfinding</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once the graph is built, evaluating a query <code>C / D</code> is just a matter of finding a valid path from node <code>C</code> to node <code>D</code>.</p>
                        <p className="text-slate-600 leading-relaxed">We start at <code>C</code> with an accumulated product of <code>1.0</code>. We recursively explore neighbors. Every time we cross an edge, we multiply our accumulator by the edge's weight. To prevent infinite loops (e.g., bouncing back and forth between A and B), we maintain a <code>visited</code> HashSet. If we hit the destination <code>D</code>, we bubble the final product back up the call stack.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Sigma size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(Q * (N + E)).</strong> Building the graph takes $O(E)$ time, where $E$ is the number of equations. Then, for each of the $Q$ queries, we run a full graph traversal (DFS/BFS) which takes $O(N + E)$ in the worst case (exploring the entire component without finding the target). Thus, total time is bounded by $Q \times (N + E)$.</li>
                            <li><strong>Space Complexity: O(N + E).</strong> The Adjacency Map stores all $N$ distinct variables and $2E$ total edges. The recursion stack for DFS (or Queue for BFS) and the <code>visited</code> Set can grow to $O(N)$. Therefore, auxiliary memory scales linearly with the size of the equations.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a Google-favorite interview question. It brilliantly tests your ability to take a seemingly purely mathematical problem and recognize it as a classic Graph Pathfinding scenario."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we use Union-Find (Disjoint Set) to solve this?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, and it's a highly optimal alternative.</p>
                            <p>You can use a weighted Union-Find data structure. Each node points to its parent, and the 'weight' represents the ratio between the node and its parent. When evaluating a query <code>X / Y</code>, you find their absolute root nodes. If their roots are different, they aren't connected (return -1). If they share a root, the answer is just <code>weight(X) / weight(Y)</code>. It's theoretically faster for massive query sets but significantly trickier to implement bug-free in a 40-minute interview compared to DFS."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What happens if there is a cycle in the equations? Like A/B=2, B/C=3, C/A=0.1?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The problem guarantees no mathematical contradictions exist in the input.</p>
                            <p>Because there are no contradictions, the path you take doesn't matter. ANY valid path from source to destination will mathematically yield the exact same accumulated product. Therefore, as soon as our DFS or BFS finds the target, we immediately return the result and stop searching. We don't need to worry about cycle weights."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why do we check <code>!graph.containsKey(src) || !graph.containsKey(dst)</code> BEFORE checking <code>src.equals(dst)</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To handle queries for completely unknown variables.</p>
                            <p>If the user queries <code>x / x</code>, but <code>x</code> was never defined in the input equations, the answer is NOT <code>1.0</code>, it is <code>-1.0</code>. We only return <code>1.0</code> for identical nodes if we have actually seen those nodes before in the graph network. Checking containment first prevents this edge-case bug."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'build' ? 'text-amber-400' : (st.hlPhase === 'query' ? 'text-violet-400' : `text-${themeColor}-400`)}`}>{String(curStepData.phase || "")}</div>
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
                                    <span className="text-slate-300 text-[10px] font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((obj: any, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-lg px-3 py-1 font-mono text-sm ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">{String(obj.node)}</span>
                                        </div>
                                    )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                                    <span className="text-slate-300 text-[10px] font-black uppercase shrink-0 ml-auto pl-2">IN</span>
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Results Array</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4 text-center">
                                        [{st.results.map((r:number) => r.toFixed(2)).join(', ')}]
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