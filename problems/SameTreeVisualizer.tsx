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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag, ArrowDownRight, Waypoints, Scale, Ruler, GitCompare
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursive: {
    id: 'recursive',
    title: '1. Recursive DFS O(N)',
    icon: <GitCompare size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'emerald',
    code: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Both nodes are null, structurally identical at this branch
        if (p == null && q == null) return true;
        
        // One node is null while the other isn't, structural mismatch
        if (p == null || q == null) return false;
        
        // Values mismatch
        if (p.val != q.val) return false;
        
        // Recursively check left and right subtrees
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
    desc: "The most intuitive O(N) approach using Depth-First Search. We compare the roots of both trees. If both are null, they match. If only one is null, they differ structurally. If both exist but values differ, they mismatch. If they match locally, we recursively call the function to ensure BOTH their left subtrees and right subtrees are also identical."
  },
  iterative: {
    id: 'iterative',
    title: '2. Iterative BFS O(N)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(p);
        queue.offer(q);
        
        while (!queue.isEmpty()) {
            TreeNode nodeP = queue.poll();
            TreeNode nodeQ = queue.poll();
            
            if (nodeP == null && nodeQ == null) continue;
            if (nodeP == null || nodeQ == null) return false;
            if (nodeP.val != nodeQ.val) return false;
            
            queue.offer(nodeP.left);
            queue.offer(nodeQ.left);
            queue.offer(nodeP.right);
            queue.offer(nodeQ.right);
        }
        return true;
    }
}`,
    desc: "An iterative Breadth-First Search approach using a Queue. We push pairs of corresponding nodes into the queue. During each loop iteration, we pull out two nodes and compare them. If they are both null, we just continue. If they mismatch structurally or by value, we instantly return false. If they match, we push their left children as a pair, and their right children as a pair to be checked later."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|isSameTree|Solution|TreeNode|p|q|val|left|right|nodeP|nodeQ|Queue|LinkedList|queue|offer|poll|isEmpty|continue|null)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'null', 'continue'].includes(part);
            const isObject = ['String', 'Solution', 'TreeNode', 'Queue', 'LinkedList'].includes(part);
            const isPointer = ['p', 'q', 'nodeP', 'nodeQ', 'val', 'left', 'right', 'queue'].includes(part);
            const isMapCall = ['isSameTree', 'offer', 'poll', 'isEmpty'].includes(part);
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
                  isNaN(parseInt(part)) && part.match(/^[a-zA-Z_]\w*$/) && !part.startsWith('"') && !part.startsWith("'") ? `text-${theme}-300` : 
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

export default function SameTreeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('recursive');
  
  const [pInput, setPInput] = useState('1, 2, 3');
  const [qInput, setQInput] = useState('1, 2, 3');
  
  const [baseTreeP, setBaseTreeP] = useState<(number | null)[]>([1, 2, 3]);
  const [baseTreeQ, setBaseTreeQ] = useState<(number | null)[]>([1, 2, 3]);

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

  const parseTreeInput = (str: string) => {
      let arr = str.split(',').map(s => {
          let trimmed = s.trim().toLowerCase();
          if (trimmed === 'null' || trimmed === 'n' || trimmed === '') return null;
          let n = parseInt(trimmed, 10);
          return isNaN(n) ? null : n;
      });
      // Remove trailing nulls for clean array representation
      while (arr.length > 0 && arr[arr.length - 1] === null) arr.pop();
      if (arr.length === 0) return [];
      return arr.slice(0, 31); // Cap for visual sanity (up to depth 4 complete)
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTreeP(parseTreeInput(pInput));
      setBaseTreeQ(parseTreeInput(qInput));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [pInput, qInput, selectedOpId]);

  // Generic Tree Builder
  const buildTreeData = (baseArr: (number|null)[], prefix: string) => {
      if (baseArr.length === 0 || baseArr[0] === null) return { root: null, nodes: [], edges: [], maxDepth: 0 };
      
      let nodes = [];
      let edges = [];
      
      let root = { val: baseArr[0], id: `${prefix}-0`, left: null as any, right: null as any };
      let queue = [root];
      let idx = 1;
      
      while (queue.length > 0 && idx < baseArr.length) {
          let curr = queue.shift()!;
          
          if (idx < baseArr.length) {
              if (baseArr[idx] !== null && baseArr[idx] !== undefined) {
                  curr.left = { val: baseArr[idx], id: `${prefix}-${idx}`, left: null, right: null };
                  queue.push(curr.left);
              }
              idx++;
          }
          if (idx < baseArr.length) {
              if (baseArr[idx] !== null && baseArr[idx] !== undefined) {
                  curr.right = { val: baseArr[idx], id: `${prefix}-${idx}`, left: null, right: null };
                  queue.push(curr.right);
              }
              idx++;
          }
      }

      let maxD = 0;
      const assignCoords = (node: any, depth: number, minX: number, maxX: number) => {
          if (!node) return;
          if (depth > maxD) maxD = depth;
          
          node.x = (minX + maxX) / 2;
          node.y = depth * 80;
          nodes.push(node);

          if (node.left) {
              edges.push({ 
                  source: node.id, target: node.left.id, 
                  sx: node.x, sy: node.y + 20, 
                  tx: (minX + node.x)/2, ty: (depth+1)*80 - 20, 
                  isLeft: true 
              });
              assignCoords(node.left, depth + 1, minX, node.x);
          }
          if (node.right) {
              edges.push({ 
                  source: node.id, target: node.right.id, 
                  sx: node.x, sy: node.y + 20, 
                  tx: (node.x + maxX)/2, ty: (depth+1)*80 - 20, 
                  isLeft: false 
              });
              assignCoords(node.right, depth + 1, node.x, maxX);
          }
      };
      
      // Local canvas width roughly 200, range -100 to 100 for each half
      assignCoords(root, 0, -120, 120);

      return { root, nodes, edges, maxDepth: maxD };
  };

  const treeDataP = useMemo(() => buildTreeData(baseTreeP, 'p'), [baseTreeP]);
  const treeDataQ = useMemo(() => buildTreeData(baseTreeQ, 'q'), [baseTreeQ]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];

    if (selectedOpId === 'recursive') {
        let callStackP: string[] = [];
        let callStackQ: string[] = [];
        
        const cloneStackP = () => [...callStackP];
        const cloneStackQ = () => [...callStackQ];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { stackP: cloneStackP(), stackQ: cloneStackQ(), ...st } 
        });

        add("Function Call", `public boolean isSameTree(TreeNode p, TreeNode q)`, 2, { hlPhase: 'init' });

        const isSameTree = (nodeP: any, nodeQ: any): boolean => {
            if (steps.length > 2500) return false;

            let pId = nodeP ? nodeP.id : 'null';
            let qId = nodeQ ? nodeQ.id : 'null';
            
            callStackP.push(pId);
            callStackQ.push(qId);
            
            let pVal = nodeP ? String(nodeP.val) : 'null';
            let qVal = nodeQ ? String(nodeQ.val) : 'null';
            
            add("DFS Entry", `Comparing Node P (${pVal}) and Node Q (${qVal}).`, 2, { hlPhase: 'enter', pId, qId, pVal, qVal });

            add("Both Null Check", `if (p == null && q == null) return true;`, 4, { hlPhase: 'checkBothNull', pId, qId, pVal, qVal });
            if (!nodeP && !nodeQ) {
                add("Return True", `Both are null. Structurally identical here. Returning true.`, 4, { hlPhase: 'returnTrue', pId, qId });
                callStackP.pop();
                callStackQ.pop();
                return true;
            }

            add("One Null Check", `if (p == null || q == null) return false;`, 7, { hlPhase: 'checkOneNull', pId, qId, pVal, qVal });
            if (!nodeP || !nodeQ) {
                add("Return False", `One is null while the other is not. Mismatch! Returning false.`, 7, { hlPhase: 'returnFalse', pId, qId });
                callStackP.pop();
                callStackQ.pop();
                return false;
            }

            add("Value Check", `if (p.val != q.val) return false;`, 10, { hlPhase: 'checkVal', pId, qId, pVal, qVal });
            if (nodeP.val !== nodeQ.val) {
                add("Return False", `Values differ (${pVal} != ${qVal}). Mismatch! Returning false.`, 10, { hlPhase: 'returnFalse', pId, qId });
                callStackP.pop();
                callStackQ.pop();
                return false;
            }

            add("Recurse Subtrees", `return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\nNodes match! Recursing down both LEFT and RIGHT subtrees...`, 13, { hlPhase: 'recurse', pId, qId });
            
            let leftMatch = isSameTree(nodeP.left, nodeQ.left);
            if (!leftMatch) {
                add("Left Mismatch", `Left subtree mismatched. Short-circuiting and returning false.`, 13, { hlPhase: 'returnFalse', pId, qId });
                callStackP.pop();
                callStackQ.pop();
                return false;
            }
            
            let rightMatch = isSameTree(nodeP.right, nodeQ.right);
            
            add("Return Result", `Both subtrees evaluated. Returning ${leftMatch && rightMatch}.`, 13, { hlPhase: 'returnRes', pId, qId, res: leftMatch && rightMatch });
            callStackP.pop();
            callStackQ.pop();
            return leftMatch && rightMatch;
        };

        let finalAns = isSameTree(treeDataP.root, treeDataQ.root);

        add("Final Result", `DFS complete. The trees are ${finalAns ? 'identical' : 'different'}.`, 2, { hlPhase: 'success', isSuccess: true, finalAns });
    } 
    else if (selectedOpId === 'iterative') {
        let queueP: string[] = [];
        let queueQ: string[] = [];
        
        const cloneQueueP = () => [...queueP];
        const cloneQueueQ = () => [...queueQ];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { queueP: cloneQueueP(), queueQ: cloneQueueQ(), ...st } 
        });

        add("Function Call", `public boolean isSameTree(TreeNode p, TreeNode q)`, 2, { hlPhase: 'init' });
        
        add("Init Queue", `Queue<TreeNode> queue = new LinkedList<>();`, 3, { hlPhase: 'initQueue' });
        
        // Push initial
        let rootPId = treeDataP.root ? treeDataP.root.id : 'null';
        let rootQId = treeDataQ.root ? treeDataQ.root.id : 'null';
        queueP.push(rootPId);
        queueQ.push(rootQId);
        
        add("Offer Roots", `queue.offer(p);\nqueue.offer(q);\nEnqueuing both roots.`, 4, { hlPhase: 'offer', pId: rootPId, qId: rootQId });

        // Build logical structure map for polling
        const getPNode = (id: string) => treeDataP.nodes.find(n => n.id === id) || null;
        const getQNode = (id: string) => treeDataQ.nodes.find(n => n.id === id) || null;

        let finalAns = true;

        while (queueP.length > 0 && queueQ.length > 0) {
            if (steps.length > 2500) break;

            add("While Loop", `while (!queue.isEmpty())\nQueue is not empty, continuing BFS.`, 7, { hlPhase: 'loop' });

            let currPId = queueP.shift()!;
            let currQId = queueQ.shift()!;
            
            let nodeP = getPNode(currPId);
            let nodeQ = getQNode(currQId);

            let pVal = nodeP ? String(nodeP.val) : 'null';
            let qVal = nodeQ ? String(nodeQ.val) : 'null';

            add("Poll Nodes", `TreeNode nodeP = queue.poll();\nTreeNode nodeQ = queue.poll();\nPolling pair of nodes to compare.`, 8, { hlPhase: 'poll', pId: currPId, qId: currQId, pVal, qVal });

            add("Both Null Check", `if (nodeP == null && nodeQ == null) continue;`, 11, { hlPhase: 'checkBothNull', pId: currPId, qId: currQId, pVal, qVal });
            if (!nodeP && !nodeQ) {
                add("Continue", `Both are null. Structurally identical here. Continuing...`, 11, { hlPhase: 'continue', pId: currPId, qId: currQId });
                continue;
            }

            add("One Null Check", `if (nodeP == null || nodeQ == null) return false;`, 12, { hlPhase: 'checkOneNull', pId: currPId, qId: currQId, pVal, qVal });
            if (!nodeP || !nodeQ) {
                add("Return False", `One is null while the other is not. Mismatch!`, 12, { hlPhase: 'returnFalse', pId: currPId, qId: currQId });
                finalAns = false;
                break;
            }

            add("Value Check", `if (nodeP.val != nodeQ.val) return false;`, 13, { hlPhase: 'checkVal', pId: currPId, qId: currQId, pVal, qVal });
            if (nodeP.val !== nodeQ.val) {
                add("Return False", `Values differ (${pVal} != ${qVal}). Mismatch!`, 13, { hlPhase: 'returnFalse', pId: currPId, qId: currQId });
                finalAns = false;
                break;
            }

            // Enqueue Left children
            let pLeftId = nodeP.left ? nodeP.left.id : 'null';
            let qLeftId = nodeQ.left ? nodeQ.left.id : 'null';
            queueP.push(pLeftId);
            queueQ.push(qLeftId);
            add("Offer Left Children", `queue.offer(nodeP.left);\nqueue.offer(nodeQ.left);\nNodes match. Enqueuing their LEFT children.`, 15, { hlPhase: 'offerLeft', pId: currPId, qId: currQId });

            // Enqueue Right children
            let pRightId = nodeP.right ? nodeP.right.id : 'null';
            let qRightId = nodeQ.right ? nodeQ.right.id : 'null';
            queueP.push(pRightId);
            queueQ.push(qRightId);
            add("Offer Right Children", `queue.offer(nodeP.right);\nqueue.offer(nodeQ.right);\nNodes match. Enqueuing their RIGHT children.`, 17, { hlPhase: 'offerRight', pId: currPId, qId: currQId });
        }

        if (finalAns) {
            add("Return True", `return true;\nQueue is empty, no mismatches found. Trees are identical!`, 20, { hlPhase: 'success', isSuccess: true, finalAns: true });
        } else {
            add("Final Result", `Finished. Mismatch was found.`, 13, { hlPhase: 'success', isSuccess: true, finalAns: false });
        }
    }

    return steps;
  }, [baseTreeP, baseTreeQ, treeDataP, treeDataQ, selectedOpId]);

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
    const code = OPERATIONS[selectedOpId as keyof typeof OPERATIONS].code;
    navigator.clipboard.writeText(code);
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

      let isEval = st.hlPhase === 'checkBothNull' || st.hlPhase === 'checkOneNull' || st.hlPhase === 'checkVal';
      let isMismatch = st.hlPhase === 'returnFalse';
      let isMatch = st.hlPhase === 'returnTrue' || st.hlPhase === 'continue';

      let borderCol = isMismatch ? 'border-rose-400 ring-4 ring-rose-100' : (isMatch ? 'border-emerald-400 ring-4 ring-emerald-100' : `border-slate-200`);

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${borderCol} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><GitCompare size={14}/> Node Evaluation Monitor</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Node P */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isEval || isMismatch || isMatch ? 'text-amber-500' : 'text-slate-400'}`}>Node P</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isEval || isMismatch || isMatch ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.pVal !== undefined ? st.pVal : '?'}
                      </div>
                  </div>

                  {/* Comparator */}
                  {isEval || isMatch || isMismatch ? (
                      <div className="flex flex-col items-center mx-2 animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Comparator</span>
                          <div className={`text-2xl font-black ${isMismatch ? 'text-rose-500' : (isMatch ? 'text-emerald-500' : 'text-slate-400')} transition-colors`}>
                              {isMismatch ? '!=' : '=='}
                          </div>
                      </div>
                  ) : (
                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-4"></div>
                  )}

                  {/* Node Q */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isEval || isMismatch || isMatch ? 'text-amber-500' : 'text-slate-400'}`}>Node Q</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isEval || isMismatch || isMatch ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.qVal !== undefined ? st.qVal : '?'}
                      </div>
                  </div>

                  {/* Result/Action Arrow */}
                  {(isMismatch || isMatch || st.hlPhase === 'recurse' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight') && (
                      <ArrowRight size={24} className={`mx-2 ${isMismatch ? 'text-rose-500' : (isMatch ? 'text-emerald-500' : 'text-purple-500')} animate-in slide-in-from-left-2`}/>
                  )}
                  
                  {/* Action */}
                  {(isMismatch || isMatch) && (
                      <div className="flex flex-col items-center min-w-[100px] animate-in slide-in-from-right-4">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isMismatch ? 'text-rose-500' : 'text-emerald-500'}`}>Result</span>
                          <div className={`border-2 text-xl font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm ${isMismatch ? 'bg-rose-100 border-rose-500 text-rose-900' : 'bg-emerald-100 border-emerald-500 text-emerald-900'}`}>
                              <span>{isMismatch ? 'FALSE' : 'TRUE'}</span>
                          </div>
                      </div>
                  )}

                  {(st.hlPhase === 'recurse' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight') && (
                      <div className="flex flex-col items-center min-w-[100px] animate-in slide-in-from-right-4">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-purple-500`}>Action</span>
                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm bg-purple-50 border-purple-400 text-purple-800`}>
                              <span>CONTINUE DEEPER</span>
                          </div>
                      </div>
                  )}

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      // Container height dynamic based on max tree depth
      const maxD = Math.max(treeDataP.maxDepth, treeDataQ.maxDepth);
      const containerSize = Math.max(350, maxD * 80 + 100);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Data Trackers (Stacks / Queues) */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 px-4 pointer-events-auto items-stretch justify-center mt-4">
                  {/* P State */}
                  <div className={`flex-1 flex flex-col bg-white p-3 rounded-2xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'offer' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight' ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'}`}>
                       <span className={`text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-1`}>
                           {selectedOpId === 'recursive' ? 'Tree P Call Stack' : 'Tree P Queue'}
                       </span>
                       <div className={`flex ${selectedOpId === 'recursive' ? 'flex-col' : 'flex-row'} gap-1 max-h-[100px] overflow-auto scrollbar-none items-center ${selectedOpId === 'recursive' ? 'justify-start' : 'justify-center min-h-[40px]'}`}>
                           {(selectedOpId === 'recursive' ? st.stackP : st.queueP)?.length > 0 ? (
                               (selectedOpId === 'recursive' ? [...st.stackP].reverse() : st.queueP).map((id: string, idx: number) => {
                                   let nObj = treeDataP.nodes.find((n:any) => n.id === id);
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`p-stk-${idx}`} className={`flex justify-center shrink-0 border-2 rounded px-2 py-1 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                           {nObj ? nObj.val : 'null'}
                                       </div>
                                   );
                               })
                           ) : <span className="text-slate-300 text-xs italic">Empty</span>}
                       </div>
                  </div>

                  {/* Q State */}
                  <div className={`flex-1 flex flex-col bg-white p-3 rounded-2xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'offer' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight' ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'}`}>
                       <span className={`text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-1`}>
                           {selectedOpId === 'recursive' ? 'Tree Q Call Stack' : 'Tree Q Queue'}
                       </span>
                       <div className={`flex ${selectedOpId === 'recursive' ? 'flex-col' : 'flex-row'} gap-1 max-h-[100px] overflow-auto scrollbar-none items-center ${selectedOpId === 'recursive' ? 'justify-start' : 'justify-center min-h-[40px]'}`}>
                           {(selectedOpId === 'recursive' ? st.stackQ : st.queueQ)?.length > 0 ? (
                               (selectedOpId === 'recursive' ? [...st.stackQ].reverse() : st.queueQ).map((id: string, idx: number) => {
                                   let nObj = treeDataQ.nodes.find((n:any) => n.id === id);
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`q-stk-${idx}`} className={`flex justify-center shrink-0 border-2 rounded px-2 py-1 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                           {nObj ? nObj.val : 'null'}
                                       </div>
                                   );
                               })
                           ) : <span className="text-slate-300 text-xs italic">Empty</span>}
                       </div>
                  </div>
              </div>

              {/* Graphical Visualizer (Dual Tree Maps) */}
              <div className="flex w-full mt-4 max-w-6xl pointer-events-none gap-4">
                  
                  {/* TREE P */}
                  <div className={`relative flex-1 transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-white text-slate-700 border-slate-300 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}>Tree P</span>
                      
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12">
                          <svg className="absolute top-0 left-0 overflow-visible" style={{ width: '1px', height: '1px' }}>
                              {treeDataP.edges.map((edge: any, idx: number) => {
                                  let isActive = st.pId === edge.target;
                                  let strokeColor = isActive ? '#f59e0b' : '#cbd5e1'; 
                                  let strokeWidth = isActive ? 4 : 2;
                                  let opacity = isActive ? 1 : 0.6;
                                  return <line key={`edge-p-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {treeDataP.nodes.map((node: any) => {
                              let isActive = st.pId === node.id && !st.isSuccess;
                              let bgClass = isActive ? "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30" : "bg-white border-slate-300 text-slate-500 shadow-sm";
                              let scaleClass = isActive ? "scale-110" : "scale-100";

                              if (st.isSuccess) {
                                  bgClass = st.finalAns ? `bg-emerald-500 border-emerald-600 text-white shadow-lg` : `bg-rose-500 border-rose-600 text-white shadow-lg`;
                              }

                              return (
                                  <div key={`node-p-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      <div className={`w-12 h-12 sm:w-14 sm:h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{String(node.val)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          </div>
                      </div>
                  </div>

                  {/* TREE Q */}
                  <div className={`relative flex-1 transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[2rem] border border-slate-200 shadow-inner`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-white text-slate-700 border-slate-300 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}>Tree Q</span>
                      
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12">
                          <svg className="absolute top-0 left-0 overflow-visible" style={{ width: '1px', height: '1px' }}>
                              {treeDataQ.edges.map((edge: any, idx: number) => {
                                  let isActive = st.qId === edge.target;
                                  let strokeColor = isActive ? '#f59e0b' : '#cbd5e1'; 
                                  let strokeWidth = isActive ? 4 : 2;
                                  let opacity = isActive ? 1 : 0.6;
                                  return <line key={`edge-q-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {treeDataQ.nodes.map((node: any) => {
                              let isActive = st.qId === node.id && !st.isSuccess;
                              let bgClass = isActive ? "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30" : "bg-white border-slate-300 text-slate-500 shadow-sm";
                              let scaleClass = isActive ? "scale-110" : "scale-100";

                              if (st.isSuccess) {
                                  bgClass = st.finalAns ? `bg-emerald-500 border-emerald-600 text-white shadow-lg` : `bg-rose-500 border-rose-600 text-white shadow-lg`;
                              }

                              return (
                                  <div key={`node-q-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      <div className={`w-12 h-12 sm:w-14 sm:h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{String(node.val)}</span>
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
                <GitCompare className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Same Tree</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dual-Tree Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 100</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><GitCompare size={28}/> Compare the Trees</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.</p>
                        <p>Two binary trees are considered the same if they are <strong>structurally identical</strong>, and the nodes have the <strong>same value</strong>.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-emerald-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-8`}>
                        <div className="w-full space-y-2">
                            <span className={`text-emerald-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1: Identical</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> p = [1,2,3], q = [1,2,3]</p>
                                    <p><strong>Output:</strong> true</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree P</span>
                                        <pre className={`text-emerald-400 font-bold`}>{`  1\n / \\\n2   3`}</pre>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Q</span>
                                        <pre className={`text-emerald-400 font-bold`}>{`  1\n / \\\n2   3`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-rose-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2: Structural Mismatch</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> p = [1,2], q = [1,null,2]</p>
                                    <p><strong>Output:</strong> false</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree P</span>
                                        <pre className={`text-rose-400 font-bold`}>{`  1\n /\n2`}</pre>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Q</span>
                                        <pre className={`text-rose-400 font-bold`}>{`  1\n   \\\n    2`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-rose-400 block uppercase text-[10px] font-black tracking-widest`}>Example 3: Value Mismatch</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> p = [1,2,1], q = [1,1,2]</p>
                                    <p><strong>Output:</strong> false</p>
                                </div>
                                <div className="flex gap-8">
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree P</span>
                                        <pre className={`text-rose-400 font-bold`}>{`  1\n / \\\n2   1`}</pre>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit text-center">
                                        <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Q</span>
                                        <pre className={`text-rose-400 font-bold`}>{`  1\n / \\\n1   2`}</pre>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in both trees is in the range <code>[0, 100]</code>.</li>
                            <li><code>-10^4 &le; Node.val &le; 10^4</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className={`text-${themeColor}-500`}/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">To verify if two trees are identical, we must traverse both of them simultaneously. At any given position, there are three failure conditions: exactly one node is null (structural mismatch), or both nodes exist but their values don't match. If they pass these checks, we just recursively ask the same question of their children!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Recursive DFS O(N):</strong> The most elegant approach. We write a single function that checks the current nodes, then returns <code>isSame(p.left, q.left) && isSame(p.right, q.right)</code>. It implicitly uses the call stack to traverse both trees.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Iterative BFS O(N):</strong> We use a Queue to simulate the traversal. We push pairs of nodes `(p, q)` into the queue. During each loop iteration, we poll two nodes, compare them, and if they match, we push their left children and right children as new pairs.</p>
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
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className={`text-${themeColor}-400`} /> : <Copy size={14} />}</button>
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
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree P (Level-Order)</label>
                            <input type="text" value={pInput} onChange={(e) => setPInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Q (Level-Order)</label>
                            <input type="text" value={qInput} onChange={(e) => setQInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3" />
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
                                {st.finalAns ? <CheckCircle2 size={24}/> : <XCircle size={24}/>} 
                                EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Trees are {st.finalAns ? 'Identical' : 'Different'}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'returnFalse' || st.hlPhase === 'checkOneNull' || st.hlPhase === 'checkVal' ? 'text-rose-400' : (st.hlPhase === 'returnTrue' || st.hlPhase === 'continue' || st.hlPhase === 'checkBothNull' ? 'text-emerald-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Simultaneous Traversal Strategies.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitCompare size={24} className="text-emerald-500"/> 1. The Three Failure States</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">When traversing two trees simultaneously to check if they are identical, there are exactly three conditions we must evaluate at every single node pair.</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Both are null:</strong> The branches end identically here. This is a local match (return true).</li>
                            <li><strong>Only one is null:</strong> One tree has a branch where the other doesn't. Structural mismatch! (return false).</li>
                            <li><strong>Values differ:</strong> Both nodes exist, but hold different data. Value mismatch! (return false).</li>
                        </ul>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Waypoints size={24} className={`text-sky-500`}/> 2. DFS vs BFS</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Recursive DFS</strong> is naturally elegant because passing <code>p.left</code> and <code>q.left</code> in the same function call guarantees they stay perfectly synced as we plunge down the tree.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Iterative BFS</strong> requires us to push <em>pairs</em> of nodes onto a Queue. By guaranteeing we always push and pop in pairs <code>(p, q)</code>, we can effectively simulate looking at the exact same position in both trees, level by level.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> In the worst case (where the trees are perfectly identical), we must visit every node once to verify the match. Thus, $O(N)$ where N is the number of nodes.</li>
                            <li><strong>Space Complexity: O(H) or O(N).</strong> For Recursive DFS, the Call Stack goes as deep as the height of the tree $O(H)$, which is $O(N)$ for a skewed tree and $O(\log N)$ for a balanced tree. For Iterative BFS, the Queue holds at most the widest level of the tree, which is $O(N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'warm-up' question at FAANG. It tests your fundamental ability to traverse trees without getting lost in null-pointer exceptions."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we just serialize both trees into arrays (e.g., Level Order strings) and compare the strings?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's inefficient."</p>
                            <p>If you serialize the trees, you must traverse both trees ENTIRELY, allocating massive $O(N)$ strings, before comparing them. With the simultaneous DFS/BFS approach, the moment we find a mismatch at the very root or first level, we instantly short-circuit and return false in $O(1)$ time, saving huge amounts of computation.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the iterative BFS approach, why is it safe to push 'null' into the Queue?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we explicitly handle nulls when polling."</p>
                            <p>Java's <code>LinkedList</code> implementation of Queue allows <code>null</code> elements. By pushing the null children, we preserve the exact structural positioning of the tree in the queue. When we poll the pair later, our <code>if (nodeP == null &amp;&amp; nodeQ == null)</code> check catches them gracefully without throwing a NullPointerException.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If this was a question about finding if Tree Q is a SUBTREE of Tree P, how would you reuse this code?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It becomes LeetCode 572 (Subtree of Another Tree)."</p>
                            <p>You keep the exact `isSameTree(p, q)` function. Then, you write a new DFS that traverses Tree P. At every single node in Tree P, you call `isSameTree(currentNode, q)`. If it returns true, you found the subtree! If not, you continue recursing down Tree P.</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'returnFalse' || st.hlPhase === 'checkOneNull' || st.hlPhase === 'checkVal' ? 'text-rose-400' : (st.hlPhase === 'returnTrue' || st.hlPhase === 'continue' || st.hlPhase === 'checkBothNull' ? 'text-emerald-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                  {st.isSuccess === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm flex flex-col gap-4">
                           
                           {/* Call Stacks / Queues */}
                           <div className="flex gap-4">
                               <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'offer' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight') ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                            <LayersIcon size={14}/> Tree P
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 h-full max-h-[120px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                                        {(selectedOpId === 'recursive' ? st.stackP : st.queueP)?.length > 0 ? (selectedOpId === 'recursive' ? [...st.stackP].reverse() : st.queueP).map((id: string, idx: number) => {
                                            let isTop = idx === 0;
                                            let nObj = treeDataP.nodes.find((n:any) => n.id === id);
                                            return (
                                                <div key={`fs-pstk-${idx}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                    {nObj ? nObj.val : 'null'}
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                                    </div>
                               </div>

                               <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'offer' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offerRight') ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                            <LayersIcon size={14}/> Tree Q
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 h-full max-h-[120px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                                        {(selectedOpId === 'recursive' ? st.stackQ : st.queueQ)?.length > 0 ? (selectedOpId === 'recursive' ? [...st.stackQ].reverse() : st.queueQ).map((id: string, idx: number) => {
                                            let isTop = idx === 0;
                                            let nObj = treeDataQ.nodes.find((n:any) => n.id === id);
                                            return (
                                                <div key={`fs-qstk-${idx}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                    {nObj ? nObj.val : 'null'}
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                                    </div>
                               </div>
                           </div>

                      </div>
                  )}

                  <div className="absolute top-8 left-8 z-50 flex flex-col gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md w-fit">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md w-fit">
                          <div className="flex flex-col space-y-1 w-40">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree P Array</label>
                              <input type="text" value={pInput} onChange={(e) => setPInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 3' />
                          </div>
                          <div className="flex flex-col space-y-1 w-40">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Q Array</label>
                              <input type="text" value={qInput} onChange={(e) => setQInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 3' />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {st.isSuccess === undefined && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess !== undefined} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess !== undefined && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(243,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 ${st.finalAns ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    {st.finalAns ? <CheckCircle2 size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Final Result</div>
                                    <div className={`font-mono ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} text-5xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center`}>
                                        {st.finalAns ? 'Identical Trees' : 'Different Trees'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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