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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bfsIterative: {
    id: 'bfsIterative',
    title: '1. Level Order BFS (Queue)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(D)',
    theme: 'sky',
    code: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode curr = queue.poll();
                
                if (i == levelSize - 1) {
                    result.add(curr.val);
                }
                
                if (curr.left != null) queue.offer(curr.left);
                if (curr.right != null) queue.offer(curr.right);
            }
        }
        
        return result;
    }
}`,
    desc: "The most intuitive approach. We traverse the tree level by level using a Queue (BFS). By checking `queue.size()` at the start of each level, we know exactly how many nodes are on the current row. We loop through them, and when we are at the very last node of the current row (`i == levelSize - 1`), we add its value to our result list. This perfectly captures the 'rightmost' node of every single level."
  },
  dfsRecursive: {
    id: 'dfsRecursive',
    title: '2. Reverse Pre-order DFS',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'emerald',
    code: `class Solution {
    public List<Integer> rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        dfs(root, 0, result);
        return result;
    }
    
    private void dfs(TreeNode node, int depth, List<Integer> result) {
        if (node == null) return;
        
        if (depth == result.size()) {
            result.add(node.val);
        }
        
        dfs(node.right, depth + 1, result);
        dfs(node.left, depth + 1, result);
    }
}`,
    desc: "An elegant, often shorter recursive approach. We use DFS, but crucially we visit the `right` child BEFORE the `left` child. We pass the current `depth` down the recursion. If `depth == result.size()`, it means we are visiting a completely new depth level for the very first time. Because we always prioritize going rightwards, the first node we hit at any new depth is mathematically guaranteed to be the rightmost visible node on that level!"
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'sky', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|rightSideView|dfs|TreeNode|Solution|root|null|this|left|right|curr|val|Queue|LinkedList|offer|poll|isEmpty|size|List|ArrayList|result|add|levelSize|depth|i)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'null', 'this'].includes(part);
            const isObject = ['TreeNode', 'Solution', 'Queue', 'LinkedList', 'List', 'ArrayList', 'Integer'].includes(part);
            const isPointer = ['root', 'left', 'right', 'curr', 'val', 'queue', 'result', 'levelSize', 'depth', 'i', 'node'].includes(part);
            const isMapCall = ['rightSideView', 'dfs', 'offer', 'poll', 'isEmpty', 'size', 'add'].includes(part);
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

export default function RightSideViewVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bfsIterative');
  
  const [treeInput, setTreeInput] = useState('1, 2, 3, null, 5, null, 4');
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 2, 3, null, 5, null, 4]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
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

  const parseTreeInput = (inputStr: string, fallback: (number | null)[]) => {
      let rawTokens = inputStr.split(',');
      let parsedTree: (number | null)[] = [];
      for (let token of rawTokens) {
          let t = token.trim().toLowerCase();
          if (t === 'null' || t === 'n') parsedTree.push(null);
          else {
              let num = parseInt(t, 10);
              if (!isNaN(num)) parsedTree.push(num);
          }
      }
      if (parsedTree.length === 0) parsedTree = fallback;
      if (parsedTree.length > 127) parsedTree = parsedTree.slice(0, 127); // Limit depth performance
      while(parsedTree.length > 0 && parsedTree[parsedTree.length - 1] === null) parsedTree.pop();
      return parsedTree;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTreeArr(parseTreeInput(treeInput, [1, 2, 3, null, 5, null, 4]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [treeInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Tree Parsing and Geometry Generation
  const buildTreeGeometry = (arr: (number | null)[]) => {
      if (arr.length === 0) return { root: null, nodes: [], edges: [], maxDepth: 0 };

      let nodesObj: any[] = [];
      let root = { val: arr[0], id: 0, left: null, right: null, gridX: 0, gridY: 0 };
      nodesObj.push(root);
      
      let queue = [root];
      let i = 1;
      
      while (queue.length > 0 && i < arr.length) {
          let curr = queue.shift()!;
          
          if (i < arr.length && arr[i] !== null) {
              curr.left = { val: arr[i], id: i, left: null, right: null, gridX: 0, gridY: 0 };
              nodesObj.push(curr.left);
              queue.push(curr.left);
          }
          i++;
          
          if (i < arr.length && arr[i] !== null) {
              curr.right = { val: arr[i], id: i, left: null, right: null, gridX: 0, gridY: 0 };
              nodesObj.push(curr.right);
              queue.push(curr.right);
          }
          i++;
      }

      let xCounter = 0;
      let maxDepth = 0;
      
      // Strict In-Order traversal guarantees zero horizontal overlapping nodes
      const assignCoords = (node: any, depth: number) => {
          if (!node) return;
          if (depth > maxDepth) maxDepth = depth;
          assignCoords(node.left, depth + 1);
          node.gridX = xCounter++;
          node.gridY = depth;
          assignCoords(node.right, depth + 1);
      };
      assignCoords(root, 0);

      let renderNodes: any[] = [];
      let renderEdges: any[] = [];
      
      // Use absolute pixel mapping instead of percentages to avoid squishing
      nodesObj.forEach(n => {
          let px = n.gridX * 60; // 60px horizontal space per node column
          let py = n.gridY * 70 + 40; // 70px vertical drop per layer
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, originalNode: n });
          
          if (n.left) {
              let clx = n.left.gridX * 60;
              let cly = n.left.gridY * 70 + 40;
              renderEdges.push({ source: n.id, target: n.left.id, sx: px, sy: py, tx: clx, ty: cly });
          }
          if (n.right) {
              let crx = n.right.gridX * 60;
              let cry = n.right.gridY * 70 + 40;
              renderEdges.push({ source: n.id, target: n.right.id, sx: px, sy: py, tx: crx, ty: cry });
          }
      });

      // Center the tree mathematically around 0, so calc(50% + Xpx) works perfectly
      if (renderNodes.length > 0) {
          let minX = Math.min(...renderNodes.map(n => n.x));
          let maxX = Math.max(...renderNodes.map(n => n.x));
          let cx = (minX + maxX) / 2;
          renderNodes.forEach(n => n.x -= cx);
          renderEdges.forEach(e => { e.sx -= cx; e.tx -= cx; });
      }

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth };
  };

  const treeData = useMemo(() => buildTreeGeometry(baseTreeArr), [baseTreeArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root && baseTreeArr.length === 0) return [];

    let result: number[] = [];
    let callStack: string[] = [];

    const cloneQ = (q: any[]) => q.map(n => ({...n}));

    if (selectedOpId === 'bfsIterative') {
        let q: any[] = [];
        let levelSize = 0;
        let iterI = 0;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                result: [...result], qState: cloneQ(q), levelSize, iterI, ...st 
            } 
        });

        add("Function Call", `public List<Integer> rightSideView(TreeNode root)`, 2, {});
        
        add("Init Result", `List<Integer> result = new ArrayList<>();\nInitialize the empty result list.`, 3, { hlInitResult: true });
        
        add("Null Check", `if (root == null) return result;\nCheck if tree is empty.`, 4, { hlCheckNull: true });
        if (!treeData.root) {
            add("Return", `return result;\nTree is empty.`, 24, { isSuccess: true, finalAns: result });
            return steps;
        }

        add("Init Queue", `Queue<TreeNode> queue = new LinkedList<>();\nCreate a queue to perform Level Order Traversal (BFS).`, 6, { hlInitQueue: true });
        
        q.push(treeData.root);
        add("Enqueue Root", `queue.offer(root);\nPush the root node (${treeData.root.val}) into the queue.`, 7, { hlEnqueueRoot: true, hlPush: treeData.root.id });

        while (q.length > 0) {
            if (steps.length > 2500) break;

            add("While Loop", `while (!queue.isEmpty())\nThe queue is not empty. Entering the next level.`, 9, { hlWhile: true });
            
            levelSize = q.length;
            add("Level Size", `int levelSize = queue.size();\nThere are ${levelSize} nodes currently in the queue for this level.`, 10, { hlLevelSize: true });
            
            for (iterI = 0; iterI < levelSize; iterI++) {
                add("For Loop Iteration", `for (int i = 0; i < levelSize; i++)\nProcessing node ${iterI + 1} of ${levelSize} for the current level.`, 12, { hlForLoop: true });
                
                let curr = q.shift()!;
                add("Poll Node", `TreeNode curr = queue.poll();\nPop node ${curr.val} from the front of the queue.`, 13, { currNodeId: curr.id, hlPoll: true });

                let isLast = iterI === levelSize - 1;
                add("Check if Rightmost", `if (i == levelSize - 1)\nIs i (${iterI}) equal to levelSize - 1 (${levelSize - 1})? ${isLast ? 'YES!' : 'NO.'}`, 15, { currNodeId: curr.id, isLast, hlCheckLast: true });

                if (isLast) {
                    result.push(curr.val);
                    add("Add to Result", `result.add(curr.val);\nThis is the last node on this level. We can see it from the right side! Adding ${curr.val} to result.`, 16, { currNodeId: curr.id, isLast, hlAddResult: true, result: [...result] });
                }

                add("Check Left Child", `if (curr.left != null) queue.offer(curr.left);`, 19, { currNodeId: curr.id, hlCheckLeft: true });
                if (curr.left) {
                    q.push(curr.left);
                    add("Enqueue Left", `queue.offer(curr.left);\nPushing left child ${curr.left.val} to the queue.`, 19, { currNodeId: curr.id, hlEnqueueLeft: true, hlPush: curr.left.id, qState: cloneQ(q) });
                }

                add("Check Right Child", `if (curr.right != null) queue.offer(curr.right);`, 20, { currNodeId: curr.id, hlCheckRight: true });
                if (curr.right) {
                    q.push(curr.right);
                    add("Enqueue Right", `queue.offer(curr.right);\nPushing right child ${curr.right.val} to the queue.`, 20, { currNodeId: curr.id, hlEnqueueRight: true, hlPush: curr.right.id, qState: cloneQ(q) });
                }
            }
            iterI = 0; // Reset for visualization clarity after loop exits
        }

        add("Return Final Result", `return result;\nQueue is empty, BFS is complete. Returning the result array.`, 24, { isSuccess: true, finalAns: result });
    } 
    else if (selectedOpId === 'dfsRecursive') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                result: [...result], callStack: [...callStack], ...st 
            } 
        });

        const dfs = (node: any | null, depth: number, parentId: number | null = null, side: string | null = null) => {
            if (steps.length > 2500) return;

            let callStr = `dfs(${node ? node.val : 'null'}, depth=${depth})`;
            callStack.push(callStr);

            add("DFS Entry", `private void dfs(TreeNode node, int depth, List<Integer> result)\nEntering node ${node ? node.val : 'null'} at depth ${depth}.`, 8, { currNodeId: node ? node.id : null, currDepth: depth, parentId, side });

            add("Base Case Check", `if (node == null) return;\nIs node null? ${node == null ? 'YES' : 'NO'}.`, 9, { currNodeId: node ? node.id : null, currDepth: depth, hlCheckNull: true, parentId, side });
            
            if (node == null) {
                callStack.pop();
                return;
            }

            let isFirstAtDepth = depth === result.length;
            add("Check Depth vs Result Size", `if (depth == result.size())\nIs depth (${depth}) == result.size (${result.length})? ${isFirstAtDepth ? 'YES. This is the first node we hit at this level!' : 'NO. We already added a node for this level.'}`, 11, { currNodeId: node.id, currDepth: depth, isFirstAtDepth, hlCheckDepth: true, parentId, side });

            if (isFirstAtDepth) {
                result.push(node.val);
                add("Add to Result", `result.add(node.val);\nWe always explore right children first, so the first node we hit at any depth is mathematically guaranteed to be the rightmost! Adding ${node.val}.`, 12, { currNodeId: node.id, currDepth: depth, isFirstAtDepth, hlAddResult: true, result: [...result], parentId, side });
            }

            add("Recurse Right First", `dfs(node.right, depth + 1, result);\nCrucial step: Travese RIGHT side first. Passing depth ${depth + 1}.`, 15, { currNodeId: node.id, currDepth: depth, hlRecurseRight: true, parentId, side });
            dfs(node.right, depth + 1, node.id, 'right');

            add("Recurse Left Second", `dfs(node.left, depth + 1, result);\nTraversing LEFT side. Passing depth ${depth + 1}.`, 16, { currNodeId: node.id, currDepth: depth, hlRecurseLeft: true, parentId, side });
            dfs(node.left, depth + 1, node.id, 'left');

            callStack.pop();
        };

        if (baseTreeArr.length > 0 && treeData.root) {
            add("Function Call", `public List<Integer> rightSideView(TreeNode root)`, 2, {});
            add("Init Result", `List<Integer> result = new ArrayList<>();\nInitialize the empty result list.`, 3, { hlInitResult: true });
            add("Start DFS", `dfs(root, 0, result);\nLaunch reverse pre-order DFS starting at depth 0.`, 4, { hlStartDFS: true });
            
            dfs(treeData.root, 0, null, null);

            add("Return Final Result", `return result;\nDFS is complete. Returning the result array.`, 5, { isSuccess: true, finalAns: result });
        } else {
             add("Return", `return result;\nTree is empty.`, 5, { isSuccess: true, finalAns: [] });
        }
    }

    return steps;
  }, [baseTreeArr, treeData, selectedOpId]);

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

      let currNodeData = treeData.nodes.find((n: any) => n.id === st.currNodeId);
      let currVal = currNodeData ? currNodeData.val : null;

      if (selectedOpId === 'bfsIterative') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlAddResult ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active BFS Node Check</span>
                  
                  {st.currNodeId === null && st.hlCheckNull ? (
                      <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                           <div className="flex items-center gap-4 text-rose-600 font-mono font-black text-xl bg-rose-50 px-6 py-3 rounded-2xl border-2 border-rose-300 shadow-md">
                               <span>root == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-200">return result</span>
                           </div>
                      </div>
                  ) : st.currNodeId !== null && (st.hlPoll || st.hlCheckLast || st.hlAddResult || st.hlCheckLeft || st.hlCheckRight || st.hlEnqueueLeft || st.hlEnqueueRight) ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2">
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr node</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlPoll ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                  {currVal !== null ? currVal : '?'}
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className="text-slate-300"/>
                          
                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckLast ? 'text-sky-500' : 'text-slate-400'}`}>Is Last in Row?</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-500 ${st.hlCheckLast || st.hlAddResult ? (st.isLast ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md scale-110' : 'bg-slate-100 border-slate-300 text-slate-500') : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                  {st.isLast !== undefined ? `i(${st.iterI}) == ${st.levelSize - 1}? ${st.isLast ? 'YES' : 'NO'}` : '?'}
                              </div>
                          </div>
                          
                          {st.hlAddResult && (
                              <>
                                  <ArrowRight size={24} className="text-emerald-300"/>
                                  <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-600`}>Action</span>
                                      <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-emerald-500 border-emerald-600 text-white shadow-lg`}>
                                          result.add({currVal})
                                      </div>
                                  </div>
                              </>
                          )}
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Looping/Updating structures...</span>
                      </div>
                  )}
              </div>
          );
      } else {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlAddResult ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active DFS Node Check</span>
                  
                  {st.currNodeId === null && st.hlCheckNull ? (
                      <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                           <div className="flex items-center gap-4 text-sky-600 font-mono font-black text-xl bg-sky-50 px-6 py-3 rounded-2xl border-2 border-sky-300 shadow-md">
                               <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-200">return</span>
                           </div>
                      </div>
                  ) : st.currNodeId !== null && (st.hlCheckDepth || st.hlAddResult || st.hlRecurseLeft || st.hlRecurseRight) ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2">
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr node</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                                  {currVal !== null ? currVal : '?'}
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className="text-slate-300"/>
                          
                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckDepth ? 'text-emerald-500' : 'text-slate-400'}`}>Is First At Depth?</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-500 ${st.hlCheckDepth || st.hlAddResult ? (st.isFirstAtDepth ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md scale-110' : 'bg-slate-100 border-slate-300 text-slate-500') : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                  {st.isFirstAtDepth !== undefined ? `depth(${st.currDepth}) == size(${st.result?.length - (st.hlAddResult?1:0)})? ${st.isFirstAtDepth ? 'YES' : 'NO'}` : '?'}
                              </div>
                          </div>
                          
                          {st.hlAddResult && (
                              <>
                                  <ArrowRight size={24} className="text-emerald-300"/>
                                  <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-600`}>Action</span>
                                      <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-emerald-500 border-emerald-600 text-white shadow-lg`}>
                                          result.add({currVal})
                                      </div>
                                  </div>
                              </>
                          )}
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Traversing tree/Updating structures...</span>
                      </div>
                  )}
              </div>
          );
      }
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      // Container needs enough height to fit the whole tree without overlapping UI elements
      const treeContainerHeight = Math.max(350, (treeData.maxDepth + 1) * 70 + 80);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Path Condition Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Map State Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-center justify-center">
                  
                  {selectedOpId === 'bfsIterative' && (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-sky-200`}>
                          <div className="flex justify-between items-center mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> Queue State
                              </span>
                              <div className="flex gap-4">
                                  <span className="text-[10px] font-bold font-mono text-slate-400">levelSize: {st.levelSize}</span>
                                  <span className="text-[10px] font-bold font-mono text-slate-400">i: {st.iterI}</span>
                              </div>
                          </div>
                          <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                              <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                              {st.qState && st.qState.length > 0 ? st.qState.map((node: any, idx: number) => (
                                  <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                      <span className="font-black leading-none">{node.val}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                              <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                          </div>
                      </div>
                  )}

                  <div className={`flex-1 flex flex-col items-center justify-center bg-white px-8 py-4 rounded-3xl border-4 shadow-xl transition-all duration-500 ${st.hlAddResult ? 'border-emerald-400 ring-4 ring-emerald-100 scale-110' : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Eye size={14}/> Right Side View Result</span>
                      <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none max-w-full">
                          <span className="text-slate-300 font-mono text-2xl">[</span>
                          {st.result && st.result.length > 0 ? st.result.map((val: number, idx: number) => (
                              <div key={`res-${idx}`} className={`shrink-0 flex items-center justify-center w-10 h-10 border-2 rounded-xl font-mono text-lg font-black ${idx === st.result.length - 1 && st.hlAddResult ? 'bg-emerald-500 text-white border-emerald-600 animate-in zoom-in shadow-lg' : 'bg-emerald-50 border-emerald-300 text-emerald-800'}`}>
                                  {val}
                              </div>
                          )) : <span className="text-slate-400 italic text-sm font-mono px-2">Empty</span>}
                          <span className="text-slate-300 font-mono text-2xl">]</span>
                      </div>
                  </div>
              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {treeData.edges.map((edge: any, i: number) => {
                                      let isActive = false;

                                      if (selectedOpId === 'dfsRecursive') {
                                          if (st.currNodeId === edge.target) isActive = true;
                                          if (st.currNodeId === edge.source && ((st.hlRecurseLeft && st.side === 'left') || (st.hlRecurseRight && st.side === 'right'))) isActive = true;
                                      } else {
                                          if (st.currNodeId === edge.source && st.hlPush === edge.target) isActive = true;
                                      }
                                      
                                      let strokeColor = '#e2e8f0'; // slate-200
                                      let strokeWidth = 2;
                                      let opacity = 0.5;

                                      if (isActive) {
                                          strokeColor = themeColor === 'sky' ? '#38bdf8' : '#34d399'; // sky-400 / emerald-400
                                          strokeWidth = 5;
                                          opacity = 1;
                                      }

                                      return <line key={`edge-${i}`} x1={edge.sx} y1={edge.sy + 20} x2={edge.tx} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}

                                  {/* Draw Virtual Null Edge */}
                                  {selectedOpId === 'dfsRecursive' && st.currNodeId === null && st.hlCheckNull && (() => {
                                      const parentId = st.callStack && st.callStack.length > 1 ? st.callStack[st.callStack.length - 2].match(/dfs\((\d+)/)?.[1] : null;
                                      if (!parentId) return null;
                                      const parent = treeData.nodes.find((n: any) => n.id.toString() === parentId);
                                      if (!parent) return null;
                                      
                                      let isLeftChild = st.side === 'left';
                                      let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                                      let py = parent.y + 70;
                                      return <line x1={parent.x} y1={parent.y + 20} x2={px} y2={py - 20} stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" opacity={0.6} className="animate-pulse transition-all duration-500" />
                                  })()}
                              </g>
                          </svg>

                          {/* Line of Sight Visualizer (The "Right Side") */}
                          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none rounded-r-3xl opacity-50 border-r-4 border-emerald-500/20 border-dashed"></div>
                          <div className="absolute right-4 md:right-10 top-0 bottom-0 flex flex-col justify-around py-20 pointer-events-none">
                              {[...Array(treeData.maxDepth + 1)].map((_, i) => (
                                   <div key={`eye-${i}`} className="text-emerald-600/30 animate-pulse"><Eye size={32}/></div>
                              ))}
                          </div>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let inResult = st.result && st.result.includes(node.val);
                              let inQueue = selectedOpId === 'bfsIterative' && st.qState && st.qState.some((n: any) => n.id === node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isActive) {
                                  if (st.hlAddResult) {
                                      bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-2xl text-emerald-900 scale-125 z-40";
                                  } else {
                                      bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                                  }
                              } else if (inResult) {
                                  bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-lg z-20 opacity-100 ring-4 ring-emerald-200 scale-110";
                              } else if (inQueue) {
                                  bgClass = "bg-sky-50 border-sky-400 text-sky-800 shadow-md z-20 opacity-100";
                              }
                              
                              if (st.isSuccess && !inResult) {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 z-10 scale-95 blur-[1px]";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !inResult && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {inResult && !isActive && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-emerald-500 text-white px-1.5 rounded shadow-sm`}>
                                              viewed
                                          </span>
                                      )}
                                      {inQueue && !isActive && (
                                          <span className={`absolute -top-5 text-sky-400 font-black animate-pulse`}><ArrowDown size={14}/></span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{node.val}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for DFS Base Case */}
                          {selectedOpId === 'dfsRecursive' && st.currNodeId === null && st.hlCheckNull && (() => {
                              const parentId = st.callStack && st.callStack.length > 1 ? st.callStack[st.callStack.length - 2].match(/dfs\((\d+)/)?.[1] : null;
                              if (!parentId) return null;
                              const parent = treeData.nodes.find((n: any) => n.id.toString() === parentId);
                              if (!parent) return null;
                              
                              let isLeftChild = st.side === 'left';
                              let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                              let py = parent.y + 70;
                              return (
                                  <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                      left: `calc(50% + ${px}px)`, 
                                      top: `${py}px`, 
                                      transform: 'translate(-50%, -50%)' 
                                  }}>
                                      <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-emerald-400 bg-emerald-100 rounded-full shadow-lg ring-4 ring-emerald-200">
                                          <span className="font-mono font-black text-[10px] text-emerald-800">null</span>
                                      </div>
                                  </div>
                              )
                          })()}

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Binary Tree Right Side View</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 199</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Eye size={28}/> Line of Sight</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the <code>root</code> of a binary tree, imagine yourself standing on the <strong>right side</strong> of it.</p>
                        <p>Return the values of the nodes you can see ordered from top to bottom.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [1,2,3,null,5,null,4]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[1, 3, 4]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Looking from the right side, the nodes visible are <span className="text-emerald-400 font-bold">1</span> at level 0, <span className="text-emerald-400 font-bold">3</span> at level 1, and <span className="text-emerald-400 font-bold">4</span> at level 2. Node 2 and 5 are completely blocked from view by 3 and 4 respectively.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around text-emerald-400 opacity-50"><Eye size={20}/><Eye size={20}/><Eye size={20}/></div>
                            <svg width="160" height="150" viewBox="0 0 160 150">
                                <line x1="80" y1="20" x2="40" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="80" y1="20" x2="120" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="40" y1="70" x2="60" y2="120" stroke="#475569" strokeWidth="2" />
                                <line x1="120" y1="70" x2="140" y2="120" stroke="#475569" strokeWidth="2" />

                                <circle cx="80" cy="20" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="80" y="24" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="40" cy="70" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="40" y="74" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="120" cy="70" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="120" y="74" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="60" cy="120" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="124" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="140" cy="120" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="140" y="124" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [1,2,3,4]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[1, 3, 4]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Even though 4 is a left child, it is the ONLY node at level 2. Therefore, it is perfectly visible from the right side! You see <span className="text-emerald-400 font-bold">1</span>, then <span className="text-emerald-400 font-bold">3</span>, then <span className="text-emerald-400 font-bold">4</span>.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <div className="absolute right-4 top-0 bottom-0 flex flex-col justify-around text-emerald-400 opacity-50"><Eye size={20}/><Eye size={20}/><Eye size={20}/></div>
                            <svg width="140" height="150" viewBox="0 0 140 150">
                                <line x1="70" y1="20" x2="30" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="70" y1="20" x2="110" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="30" y1="70" x2="15" y2="120" stroke="#475569" strokeWidth="2" />

                                <circle cx="70" cy="20" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="70" y="24" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="30" cy="70" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="30" y="74" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="110" cy="70" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="110" y="74" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="15" cy="120" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="15" y="124" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [0, 100].</li>
                            <li>-100 &le; Node.val &le; 100</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">The "right side view" literally translates to: **Find the rightmost node at every single depth level.** If a level has a right child, you see it. If it only has left children, you see the leftmost one because nothing is blocking it from the right!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>BFS Level Order:</strong> Traverse the tree horizontally using a Queue. As you loop through the nodes of a specific level, just grab the very last node processed in that loop and add it to the result array.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>DFS Reverse Pre-Order:</strong> Traverse vertically, but force the code to search the <code>right</code> child before the <code>left</code> child. Keep track of the current depth. The very first time you reach a new depth, add that node to the result array. Because you went right-first, that first node is guaranteed to be the rightmost.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
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

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[2] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3, null, 5, null, 4" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> TRAVERSAL COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully generated right side view.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult ? 'text-emerald-400' : (st.hlCheckDepth || st.hlCheckLast ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Call Stack Widget */}
                   {selectedOpId === 'dfsRecursive' && !st.isSuccess && st.callStack && (
                       <div className="absolute bottom-4 left-4 z-30 pointer-events-auto animate-in fade-in zoom-in duration-300">
                           <div className={`bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl p-4 flex flex-col transition-all duration-300 w-48 max-h-[250px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400`}><LayersIcon size={12}/> Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                       let isTop = idx === 0;
                                       return (
                                           <div key={`frame-cs-${idx}`} className={`w-full py-1.5 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-emerald-950 border-emerald-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                               {frameStr}
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

                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-4" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Level Order vs Pre-Order techniques.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListOrdered size={24} className="text-sky-500"/> 1. The BFS Approach (Level by Level)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">BFS uses a Queue to process nodes horizontally. The "trick" for this problem is reading <code>int levelSize = queue.size()</code> at the start of the while loop. Because we only pop exactly <code>levelSize</code> times, we perfectly segment the queue into rows.</p>
                        <p className="text-slate-600 leading-relaxed">As we loop through a row, we just check if <code>i == levelSize - 1</code>. If it is, this is the very last node we are processing for the current row. By definition of left-to-right BFS, the last node processed in a row is the rightmost visible node!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitPullRequest size={24} className="text-emerald-500"/> 2. The DFS Approach (Reverse Pre-Order)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">DFS normally goes Root &rarr; Left &rarr; Right. If we reverse it to go <strong>Root &rarr; Right &rarr; Left</strong>, our traversal will dive down the rightmost side of the tree first.</p>
                        <p className="text-slate-600 leading-relaxed">We keep track of our current <code>depth</code>. Our <code>result</code> array holds the visible nodes. When <code>depth == result.size()</code>, it means the result array doesn't have an entry for this depth level yet. Because we always explore right children first, the absolute first node we ever encounter at a new depth is guaranteed to be the rightmost visible node. We add it, and for all subsequent nodes (left children) at that depth, <code>depth &lt; result.size()</code>, so they are naturally ignored.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> Both approaches visit every node exactly once. In the worst case (a perfectly balanced tree where the rightmost nodes don't cover the full depth, forcing us to explore left branches to find the visible nodes), we still just do O(1) work per node.</li>
                            <li><strong>Space Complexity (BFS): O(D).</strong> The queue holds up to $D$ nodes, where $D$ is the maximum width (diameter) of the tree. For a full binary tree, the bottom level holds $N/2$ nodes, so space is $O(N)$.</li>
                            <li><strong>Space Complexity (DFS): O(H).</strong> The call stack goes as deep as the tree height $H$. In a skewed tree, this is $O(N)$. In a balanced tree, it's $O(\log N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a highly popular interview question because it directly tests your ability to choose between BFS and DFS, and explicitly tests if you know how to track 'level' state in both paradigms."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Which approach is better, BFS or DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Both are $O(N)$ time, but their space complexity depends on the tree's shape.</p>
                            <p>BFS uses O(Width) space, while DFS uses O(Height) space. If the tree is extremely wide and perfectly balanced, DFS is technically more space-efficient ($O(\log N)$ stack vs $O(N/2)$ queue). If the tree is completely skewed (a straight line), BFS is more space-efficient ($O(1)$ queue vs $O(N)$ stack). However, DFS is usually preferred in interviews due to the elegance and brevity of the 5-line recursive solution."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if we wanted the LEFT side view instead?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The changes are trivial for both approaches.</p>
                            <p>For <strong>BFS</strong>: Instead of checking <code>i == levelSize - 1</code> to grab the last node, we simply check <code>i == 0</code> to grab the first node processed in the level loop.<br/>For <strong>DFS</strong>: Instead of recursing right-then-left (<code>dfs(right); dfs(left);</code>), we use standard pre-order recursion (<code>dfs(left); dfs(right);</code>). The first node encountered at a new depth will naturally be the leftmost one."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "In the DFS approach, why don't we need a HashSet or boolean array to track visited depths?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we are mapping the depth directly to the index/size of our resulting Array/List.</p>
                            <p>Since we start at depth 0 and add nodes level by level, the size of the <code>result</code> list implicitly acts as our depth tracker. If <code>result.size()</code> is 3, it means we have safely captured depths 0, 1, and 2. The next depth we need to capture is exactly 3. By checking <code>depth == result.size()</code>, we elegantly use the output structure itself to track our state without any auxiliary memory."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[480px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth" ref={codeContainerFullscreenRef}>
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlAddResult ? 'text-emerald-400' : (st.hlCheckDepth || st.hlCheckLast ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
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
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-emerald-950 border-emerald-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                              {frameStr}
                                          </div>
                                      )
                                  })}
                                  {st.callStack.length === 0 && (
                                      <span className="text-slate-500 font-mono italic text-sm text-center py-2">Empty</span>
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
                                        <LayersIcon size={14}/> Queue State
                                    </span>
                                    <div className="flex gap-4">
                                        <span className="text-xs font-bold font-mono text-slate-500">size: {st.levelSize}</span>
                                        <span className="text-xs font-bold font-mono text-slate-500">i: {st.iterI}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((node: any, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">{node.val}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 2, 3, null, 5..." />
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

                  <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10`}><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Right Side View Result</div>
                                    <div className="font-mono text-white text-4xl font-black leading-relaxed flex items-center justify-center gap-2 max-w-full overflow-hidden text-ellipsis whitespace-nowrap px-4">
                                        [{st.finalAns.join(', ')}]
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