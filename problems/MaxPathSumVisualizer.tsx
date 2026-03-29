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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag, ArrowDownRight, Waypoints, Scale, Ruler
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bottomUpOptimized: {
    id: 'bottomUpOptimized',
    title: '1. Bottom-Up DFS O(N)',
    icon: <IterationCcw size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'amber',
    code: `class Solution {
    int max = Integer.MIN_VALUE;
    
    public int maxPathSum(TreeNode root) {
        dfsSum(root);
        return max;
    }
    
    private int dfsSum(TreeNode node) {
        if (node == null) return 0;
        
        // Ignore paths with negative sums!
        int leftSum = Math.max(0, dfsSum(node.left));
        int rightSum = Math.max(0, dfsSum(node.right));
        
        // Update global max with the path spanning through this node
        max = Math.max(max, leftSum + rightSum + node.val);
        
        // Return the max branch sum extending downwards
        return Math.max(leftSum, rightSum) + node.val;
    }
}`,
    desc: "The optimal O(N) approach. A path in a tree must have a 'highest' node (the peak). For any node acting as this peak, the max path sum is `node.val + leftSum + rightSum`. Crucially, if a child branch returns a NEGATIVE sum, it will only hurt our total! So we take `Math.max(0, dfs(child))` to simply 'ignore' that branch. We use a post-order DFS to calculate the max branch sum of a node, check if its local inverted 'V' path beats the global `max`, and then return its best single branch upwards to its parent."
  },
  topDownUnoptimized: {
    id: 'topDownUnoptimized',
    title: '2. Top-Down DFS O(N²)',
    icon: <ArrowDownToLine size={16} />,
    complexity: 'Time: O(N²) | Space: O(H)',
    theme: 'rose',
    code: `class Solution {
    public int maxPathSum(TreeNode root) {
        if (root == null) return Integer.MIN_VALUE;
        
        int leftSum = Math.max(0, branchSum(root.left));
        int rightSum = Math.max(0, branchSum(root.right));
        int mySum = leftSum + rightSum + root.val;
        
        int leftMax = maxPathSum(root.left);
        int rightMax = maxPathSum(root.right);
        
        return Math.max(mySum, Math.max(leftMax, rightMax));
    }
    
    private int branchSum(TreeNode node) {
        if (node == null) return 0;
        int left = Math.max(0, branchSum(node.left));
        int right = Math.max(0, branchSum(node.right));
        return node.val + Math.max(left, right);
    }
}`,
    desc: "A highly unoptimized approach. We explicitly calculate the max branch sums of the left and right children to find the total path sum through the root. However, the overall maximum path might NOT pass through the root! So, we must recursively call `maxPathSum()` on the children to check their internal paths. The massive flaw is that `branchSum()` explores the entire subtree, and then `maxPathSum()` steps down and calls it ALL over again! This re-visits lower nodes exponentially, resulting in O(N²) worst-case time."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'amber', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|maxPathSum|dfsSum|branchSum|Solution|TreeNode|root|node|leftSum|rightSum|mySum|leftMax|rightMax|left|right|Math|abs|max|null|Integer|MIN_VALUE)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'null'].includes(part);
            const isObject = ['String', 'Solution', 'TreeNode', 'Math', 'Integer'].includes(part);
            const isPointer = ['root', 'node', 'leftSum', 'rightSum', 'mySum', 'leftMax', 'rightMax', 'left', 'right', 'max', 'MIN_VALUE'].includes(part);
            const isMapCall = ['maxPathSum', 'dfsSum', 'branchSum', 'abs', 'max'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
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

export default function MaxPathSumVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bottomUpOptimized');
  
  const [treeInput, setTreeInput] = useState('-10, 9, 20, null, null, 15, 7');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([-10, 9, 20, null, null, 15, 7]);

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
      if (arr.length === 0) arr = [-10, 9, 20, null, null, 15, 7];
      return arr.slice(0, 31); // Cap for visual sanity (up to depth 4 complete)
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTreeArr(parseTreeInput(treeInput));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [treeInput, selectedOpId]);

  // Build Tree Geometry
  const treeData = useMemo(() => {
      if (baseTreeArr.length === 0 || baseTreeArr[0] === null) return { root: null, nodes: [], edges: [], maxDepth: 0 };
      
      let nodes = [];
      let edges = [];
      
      // 1. Build logical tree objects to establish relationships
      let root = { val: baseTreeArr[0], id: 0, left: null as any, right: null as any };
      let queue = [root];
      let idx = 1;
      
      while (queue.length > 0 && idx < baseTreeArr.length) {
          let curr = queue.shift()!;
          
          if (idx < baseTreeArr.length) {
              if (baseTreeArr[idx] !== null && baseTreeArr[idx] !== undefined) {
                  curr.left = { val: baseTreeArr[idx], id: idx, left: null, right: null };
                  queue.push(curr.left);
              }
              idx++;
          }
          if (idx < baseTreeArr.length) {
              if (baseTreeArr[idx] !== null && baseTreeArr[idx] !== undefined) {
                  curr.right = { val: baseTreeArr[idx], id: idx, left: null, right: null };
                  queue.push(curr.right);
              }
              idx++;
          }
      }

      // 2. Assign Coordinates (Recursive)
      let maxD = 0;
      const assignCoords = (node: any, depth: number, minX: number, maxX: number) => {
          if (!node) return;
          if (depth > maxD) maxD = depth;
          
          node.x = (minX + maxX) / 2;
          node.y = depth * 80;
          nodes.push(node);

          // The radius of our visual nodes is ~28px (w-14 = 56px). 
          // Attaching edges perfectly to the bottom/top.
          if (node.left) {
              edges.push({ 
                  source: node.id, target: node.left.id, 
                  sx: node.x, sy: node.y + 28, 
                  tx: (minX + node.x)/2, ty: (depth+1)*80 - 28, 
                  isLeft: true 
              });
              assignCoords(node.left, depth + 1, minX, node.x);
          }
          if (node.right) {
              edges.push({ 
                  source: node.id, target: node.right.id, 
                  sx: node.x, sy: node.y + 28, 
                  tx: (node.x + maxX)/2, ty: (depth+1)*80 - 28, 
                  isLeft: false 
              });
              assignCoords(node.right, depth + 1, node.x, maxX);
          }
      };
      
      // Canvas width approx 600, range -300 to 300
      assignCoords(root, 0, -300, 300);

      return { root, nodes, edges, maxDepth: maxD };
  }, [baseTreeArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root) {
        // Special case for entirely empty tree input
        steps.push({ phase: 'init', description: `Tree is completely empty. Returning 0.`, line: 4, state: { maxSum: null } });
        return steps;
    }

    if (selectedOpId === 'bottomUpOptimized') {
        let callStack: number[] = [];
        let branchSums: {[key: number]: number} = {};
        let maxSum: number | null = null; // Represents Integer.MIN_VALUE safely
        
        const cloneStack = () => [...callStack];
        const cloneSums = () => ({...branchSums});

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { stack: cloneStack(), branchSums: cloneSums(), maxSum, ...st } 
        });

        add("Init Class Vars", `int max = Integer.MIN_VALUE;`, 2, { hlPhase: 'initGlobal' });
        add("Function Call", `public int maxPathSum(TreeNode root)`, 4, { hlPhase: 'init' });
        add("Start DFS", `dfsSum(root);`, 5, { hlPhase: 'init' });

        const dfsSum = (node: any): number => {
            if (steps.length > 2500) return 0;

            let nId = node ? node.id : -1;
            callStack.push(nId);
            
            let displayVal = node && node.val !== null && node.val !== undefined ? String(node.val) : 'null';
            add("DFS Entry", `private int dfsSum(TreeNode node)\nCalculating max branch sum for node ${displayVal}.`, 9, { hlPhase: 'enter', currNodeId: nId });

            add("Null Check", `if (node == null) return 0;\nIs node null? ${node ? 'NO.' : 'YES. Base case reached.'}`, 10, { hlPhase: 'check', currNodeId: nId });
            if (!node) {
                callStack.pop();
                return 0;
            }

            add("DFS Left", `int leftSum = Math.max(0, dfsSum(node.left));\nDiving left to find max branch sum...`, 13, { hlPhase: 'goLeft', currNodeId: nId, childId: node.left ? node.left.id : -1 });
            
            let rawLeft = dfsSum(node.left);
            let leftS = rawLeft > 0 ? rawLeft : 0;
            
            if (rawLeft < 0) {
                add("Clamp Left Sum", `int leftSum = Math.max(0, dfsSum(node.left));\nLeft subtree returned a negative sum (${rawLeft}). We clamp it to 0 (ignore the branch completely!).`, 13, { hlPhase: 'clampLeft', currNodeId: nId, rawLeft, leftS });
            }

            add("DFS Right", `int rightSum = Math.max(0, dfsSum(node.right));\nDiving right to find max branch sum...`, 14, { hlPhase: 'goRight', currNodeId: nId, childId: node.right ? node.right.id : -1, leftS });
            
            let rawRight = dfsSum(node.right);
            let rightS = rawRight > 0 ? rawRight : 0;

            if (rawRight < 0) {
                add("Clamp Right Sum", `int rightSum = Math.max(0, dfsSum(node.right));\nRight subtree returned a negative sum (${rawRight}). We clamp it to 0 (ignore the branch completely!).`, 14, { hlPhase: 'clampRight', currNodeId: nId, rawRight, rightS, leftS });
            }

            let nodeVal = typeof node.val === 'number' ? node.val : 0;
            let localMaxPath = leftS + rightS + nodeVal;
            let oldMax = maxSum;
            
            if (maxSum === null || localMaxPath > maxSum) {
                maxSum = localMaxPath;
            }

            let maxStr = maxSum === null ? 'MIN_VAL' : String(maxSum);
            let oldMaxStr = oldMax === null ? 'MIN_VAL' : String(oldMax);

            add("Evaluate Local Path", `max = Math.max(max, leftSum + rightSum + node.val);\nInverted 'V' path through ${nodeVal} is ${leftS} + ${rightS} + ${nodeVal} = ${localMaxPath}.\nGlobal Max updated from ${oldMaxStr} to ${maxStr}.`, 17, { hlPhase: 'eval', currNodeId: nId, leftS, rightS, localMaxPath, maxSum, oldMax, nodeVal });

            let branchReturned = (leftS > rightS ? leftS : rightS) + nodeVal;
            branchSums[nId] = branchReturned;
            
            add("Return Branch Sum", `return Math.max(leftSum, rightSum) + node.val;\nA parent can only choose ONE branch. Max(${leftS}, ${rightS}) + ${nodeVal} = ${branchReturned}.\nReturning ${branchReturned} upwards.`, 20, { hlPhase: 'returnSuccess', currNodeId: nId, branchReturned, leftS, rightS, nodeVal });
            
            callStack.pop();
            return branchReturned;
        };

        dfsSum(treeData.root);

        let finalMaxStr = maxSum === null ? 'MIN_VAL' : String(maxSum);
        add("Return Final Result", `return max;\nDFS complete. Returning global maximum path sum: ${finalMaxStr}.`, 6, { hlPhase: 'success', isSuccess: true, finalAns: maxSum });
    } 
    else if (selectedOpId === 'topDownUnoptimized') {
        let callStack: number[] = [];
        let visitCounts: {[key: number]: number} = {};
        
        const cloneStack = () => [...callStack];
        const cloneVisits = () => ({...visitCounts});

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { stack: cloneStack(), visitCounts: cloneVisits(), ...st } 
        });

        // Define helper for tracing
        const branchSum = (node: any): number => {
            if (steps.length > 2500) return 0;
            let nId = node ? node.id : -1;
            callStack.push(nId);
            
            if (nId !== -1) {
                visitCounts[nId] = (visitCounts[nId] || 0) + 1;
            }

            let displayVal = node && node.val !== null && node.val !== undefined ? String(node.val) : 'null';
            add("Branch Helper Entry", `private int branchSum(TreeNode node)\nCalculating max branch for node ${displayVal}.`, 14, { hlPhase: 'heightEnter', currNodeId: nId, isHelper: true });

            if (!node) {
                add("Branch Null", `if (node == null) return 0;`, 15, { hlPhase: 'heightCheck', currNodeId: nId, isHelper: true });
                callStack.pop();
                return 0;
            }

            add("Branch Recursion", `int left = Math.max(0, branchSum(node.left));\nRecursively finding left max branch...`, 16, { hlPhase: 'heightRecurse', currNodeId: nId, isHelper: true });
            let rawL = branchSum(node.left);
            let l = rawL > 0 ? rawL : 0;
            
            add("Branch Recursion", `int right = Math.max(0, branchSum(node.right));\nRecursively finding right max branch...`, 17, { hlPhase: 'heightRecurse', currNodeId: nId, isHelper: true });
            let rawR = branchSum(node.right);
            let r = rawR > 0 ? rawR : 0;
            
            let nodeVal = typeof node.val === 'number' ? node.val : 0;
            let myH = nodeVal + (l > r ? l : r);
            
            add("Branch Return", `return node.val + Math.max(left, right);\nReturning max branch ${myH} for node ${nodeVal}.`, 18, { hlPhase: 'heightReturn', currNodeId: nId, myH, isHelper: true });
            
            callStack.pop();
            return myH;
        };

        const maxPathSum = (node: any): number => {
            if (steps.length > 2500) return 0;
            let nId = node ? node.id : -1;
            callStack.push(nId);
            
            if (nId !== -1) {
                visitCounts[nId] = (visitCounts[nId] || 0) + 1;
            }

            let displayVal = node && node.val !== null && node.val !== undefined ? String(node.val) : 'null';
            add("MaxPathSum Entry", `public int maxPathSum(TreeNode root)\nChecking max path passing through node ${displayVal}.`, 2, { hlPhase: 'enter', currNodeId: nId });

            add("Null Check", `if (root == null) return Integer.MIN_VALUE;`, 3, { hlPhase: 'check', currNodeId: nId });
            if (!node) {
                callStack.pop();
                return -999999; // SAFE MIN VAL
            }

            add("Trigger Branch Left", `int leftSum = Math.max(0, branchSum(root.left));\nWarning: This traverses the ENTIRE left subtree just to find branch sum.`, 5, { hlPhase: 'triggerLeft', currNodeId: nId });
            let rawLSum = branchSum(node.left);
            let leftS = rawLSum > 0 ? rawLSum : 0;

            add("Trigger Branch Right", `int rightSum = Math.max(0, branchSum(root.right));\nWarning: This traverses the ENTIRE right subtree just to find branch sum.`, 6, { hlPhase: 'triggerRight', currNodeId: nId, leftS });
            let rawRSum = branchSum(node.right);
            let rightS = rawRSum > 0 ? rawRSum : 0;

            let nodeVal = typeof node.val === 'number' ? node.val : 0;
            let mySum = leftS + rightS + nodeVal;
            add("Local Path Sum", `int mySum = leftSum + rightSum + root.val;\nLocal path through ${nodeVal} is ${leftS} + ${rightS} + ${nodeVal} = ${mySum}.`, 7, { hlPhase: 'evalLocal', currNodeId: nId, leftS, rightS, mySum, nodeVal });
            
            add("Recurse Left Subtree", `int leftMax = maxPathSum(root.left);\nNow redundantly traversing the left subtree to see if IT has a strictly larger internal path!`, 9, { hlPhase: 'recurseLeft', currNodeId: nId, mySum });
            let leftMax = maxPathSum(node.left);

            add("Recurse Right Subtree", `int rightMax = maxPathSum(root.right);\nNow redundantly traversing the right subtree to see if IT has a strictly larger internal path!`, 10, { hlPhase: 'recurseRight', currNodeId: nId, mySum, leftMax });
            let rightMax = maxPathSum(node.right);

            let maxPath = mySum;
            if (leftMax !== -999999 && leftMax > maxPath) maxPath = leftMax;
            if (rightMax !== -999999 && rightMax > maxPath) maxPath = rightMax;

            add("Return Max", `return Math.max(mySum, Math.max(leftMax, rightMax));\nMax(Local:${mySum}, LeftTree:${leftMax === -999999 ? 'MIN' : leftMax}, RightTree:${rightMax === -999999 ? 'MIN' : rightMax}) = ${maxPath}.`, 12, { hlPhase: 'returnSuccess', currNodeId: nId, mySum, leftMax, rightMax, maxPath });
            
            callStack.pop();
            return maxPath;
        };

        add("Function Call", `public int maxPathSum(TreeNode root)`, 2, { hlPhase: 'init' });
        let finalAns = maxPathSum(treeData.root);

        add("Final Result", `Finished. Global Max Path Sum is ${finalAns === -999999 ? 'MIN_VAL' : finalAns}.`, 12, { hlPhase: 'success', isSuccess: true, finalAns });
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

      let cNode = null;
      if (st.currNodeId !== undefined && st.currNodeId !== null && st.currNodeId !== -1) {
          cNode = treeData.nodes.find((n:any) => n.id === st.currNodeId);
      }

      let isEval = st.hlPhase === 'eval' || st.hlPhase === 'returnSuccess' || st.hlPhase === 'evalLocal';

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${isEval ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100` : `border-slate-200`} scale-105`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><TrendingUp size={14}/> Max Path Evaluator</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Current Node */}
                  <div className="flex flex-col items-center min-w-[100px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'enter' || st.hlPhase === 'heightEnter' ? 'text-amber-500' : 'text-slate-400'}`}>Evaluating Node</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'enter' || st.hlPhase === 'heightEnter' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.nodeVal !== undefined ? String(st.nodeVal) : (cNode && cNode.val !== null ? String(cNode.val) : '?')}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-4"></div>

                  {/* Local Path Sum Calculation */}
                  {isEval ? (
                      <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Left Sum</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-700`}>
                                  {st.leftS !== undefined ? String(st.leftS) : '?'}
                              </div>
                          </div>
                          
                          <span className="text-xl font-bold text-slate-400 font-sans">+</span>

                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Node Val</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-100 border-slate-300 text-slate-700`}>
                                  {st.nodeVal !== undefined ? String(st.nodeVal) : (cNode && cNode.val !== null ? String(cNode.val) : '?')}
                              </div>
                          </div>

                          <span className="text-xl font-bold text-slate-400 font-sans">+</span>

                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Right Sum</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-700`}>
                                  {st.rightS !== undefined ? String(st.rightS) : '?'}
                              </div>
                          </div>

                          <ArrowRight size={24} className={`mx-2 text-amber-500`}/>
                          
                          <div className="flex flex-col items-center min-w-[100px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Local Path Sum</span>
                              <div className={`border-2 text-xl font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm bg-amber-100 border-amber-500 text-amber-900`}>
                                  <span>{st.localMaxPath !== undefined ? String(st.localMaxPath) : (st.mySum !== undefined ? String(st.mySum) : '?')}</span>
                              </div>
                          </div>
                      </div>
                  ) : (st.hlPhase === 'goLeft' || st.hlPhase === 'goRight' || st.hlPhase === 'triggerLeft' || st.hlPhase === 'triggerRight' || st.hlPhase === 'recurseLeft' || st.hlPhase === 'recurseRight') ? (
                      <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-purple-500`}>Action</span>
                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-purple-50 border-purple-400 text-purple-700 shadow-sm flex items-center gap-2`}>
                              <span>{(st.hlPhase === 'goLeft' || st.hlPhase === 'triggerLeft' || st.hlPhase === 'recurseLeft') ? 'RECURSE LEFT' : 'RECURSE RIGHT'}</span>
                          </div>
                      </div>
                  ) : (st.hlPhase === 'clampLeft' || st.hlPhase === 'clampRight') ? (
                       <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500`}>Negative Path Detected!</span>
                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-rose-50 border-rose-400 text-rose-700 shadow-sm flex items-center gap-2`}>
                              <span>{`max(0, ${st.rawLeft !== undefined ? String(st.rawLeft) : String(st.rawRight)}) = 0`}</span>
                          </div>
                      </div>
                  ) : (st.hlPhase === 'heightRecurse' || st.hlPhase === 'heightReturn') ? (
                       <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Helper Function</span>
                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-amber-50 border-amber-400 text-amber-700 shadow-sm flex items-center gap-2`}>
                              <span>{st.hlPhase === 'heightReturn' ? `Returning Sum=${st.myH}` : 'Calculating Branch Sum...'}</span>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-col items-center opacity-60">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>State</span>
                          <div className={`border-2 text-sm font-black px-4 py-3 rounded-xl bg-slate-50 border-slate-300 text-slate-500 shadow-sm flex items-center gap-2`}>
                              EVALUATING...
                          </div>
                      </div>
                  )}
              </div>

          </div>
      );
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && st.hlPhase !== 'init') return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      // Container height dynamic based on tree depth
      const containerSize = Math.max(350, treeData.maxDepth * 80 + 100);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Data Trackers (Global Max) */}
              {selectedOpId === 'bottomUpOptimized' && (
                  <div className="flex w-full max-w-6xl px-4 pointer-events-auto items-stretch justify-center">
                      <div className={`flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'eval' ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-1">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                                   <Trophy size={14}/> Global Max Path Sum (max)
                               </span>
                           </div>
                           <div className="flex items-center justify-center text-4xl font-mono font-black text-slate-700 min-w-[120px]">
                               {`${st.maxSum !== undefined && st.maxSum !== null ? String(st.maxSum) : 'MIN_VAL'}`}
                           </div>
                      </div>
                  </div>
              )}

              {/* Graphical Visualizer (Tree Map) */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Tree Memory Map</span>
                      
                      {/* Fixed unified origin container for perfect line and node alignment */}
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12">
                          <svg className="absolute top-0 left-0 overflow-visible" style={{ width: '1px', height: '1px' }}>
                              {/* Render Edges */}
                              {treeData.edges.map((edge: any, idx: number) => {
                                  // Determine which node is considered "active" for line highlighting
                                  let activeId = st.currNodeId !== null ? st.currNodeId : -1;
                                  
                                  let isActiveLeftEdge = (st.hlPhase === 'goLeft' || st.hlPhase === 'triggerLeft' || st.hlPhase === 'heightRecurse' || st.hlPhase === 'recurseLeft' || st.hlPhase === 'clampLeft') && activeId === edge.source && edge.isLeft;
                                  let isActiveRightEdge = (st.hlPhase === 'goRight' || st.hlPhase === 'triggerRight' || st.hlPhase === 'heightRecurse' || st.hlPhase === 'recurseRight' || st.hlPhase === 'clampRight') && activeId === edge.source && !edge.isLeft;
                                  let isActivelyTraversing = isActiveLeftEdge || isActiveRightEdge;

                                  let strokeColor = '#cbd5e1'; // default slate-300
                                  let strokeWidth = 2;
                                  let opacity = 0.6;

                                  if (isActivelyTraversing) {
                                      strokeColor = themeColor === 'sky' ? '#0ea5e9' : '#f59e0b'; // match theme or amber
                                      if (st.hlPhase === 'clampLeft' || st.hlPhase === 'clampRight') strokeColor = '#f43f5e'; // rose for pruned edges
                                      strokeWidth = 4;
                                      opacity = 1;
                                  }

                                  // Using absolute x,y coordinates since SVG 0,0 is now strictly aligned with div 0,0
                                  return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id && !st.isSuccess;
                              let isInStack = st.stack && st.stack.includes(node.id) && !isActive;
                              let branchSumVal = st.branchSums ? st.branchSums[node.id] : undefined;
                              let visitCount = st.visitCounts ? st.visitCounts[node.id] : 0;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; // Base Unvisited
                              let scaleClass = "scale-100";
                              
                              if (isActive) {
                                  bgClass = st.isHelper ? "bg-purple-100 border-purple-500 text-purple-900 shadow-xl ring-4 ring-purple-200 z-30" : "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                  scaleClass = "scale-125";
                              } else if (isInStack) {
                                  bgClass = `bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-700 shadow-md z-10`;
                              } else if (branchSumVal !== undefined) {
                                  bgClass = `bg-${themeColor}-50 border-${themeColor}-400 text-${themeColor}-800 shadow-sm`;
                              } else if (visitCount > 0) {
                                  // Top-Down Heatmap styling
                                  if (visitCount === 1) bgClass = "bg-orange-50 border-orange-300 text-orange-700";
                                  else if (visitCount === 2) bgClass = "bg-orange-100 border-orange-400 text-orange-800";
                                  else bgClass = "bg-orange-200 border-orange-500 text-orange-900";
                              }

                              if (st.isSuccess) {
                                  bgClass = `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-lg`;
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* Floating Badges */}
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap ${st.isHelper ? 'bg-purple-500' : 'bg-amber-500'} text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce z-50`}>
                                              {st.isHelper ? 'branchSum()' : 'curr'}
                                          </span>
                                      )}
                                      
                                      {/* Top-Down Visit Count Heatmap Badge */}
                                      {visitCount > 0 && selectedOpId === 'topDownUnoptimized' && !st.isSuccess && (
                                          <div className={`absolute -right-3 -top-3 bg-slate-800 text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md z-40 border border-white`}>
                                              {`${visitCount}x`}
                                          </div>
                                      )}

                                      {/* Bottom-Up Calculated Branch Sum Badge */}
                                      {branchSumVal !== undefined && !st.isSuccess && (
                                          <div className={`absolute -right-6 -bottom-3 bg-${themeColor}-500 text-white text-[9px] font-black font-mono px-1.5 py-0.5 rounded shadow-md z-40 border border-white animate-in zoom-in`}>
                                              {`s=${branchSumVal}`}
                                          </div>
                                      )}

                                      <div className={`w-14 h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-xl leading-none`}>{String(node.val)}</span>
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
                <TrendingUp className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Binary Tree Maximum Path Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Depth-First Search (Hard)
                  </span>
                  <span>•</span>
                  <span>LeetCode 124</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><TrendingUp size={28}/> Find the Best Route</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>A <strong>path</strong> in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence <strong>at most once</strong>. Note that the path does not need to pass through the root.</p>
                        <p>The <strong>path sum</strong> of a path is the sum of the node's values in the path.</p>
                        <p className="font-bold mt-4">Given the <code>root</code> of a binary tree, return the maximum <strong>path sum</strong> of any non-empty path.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-8`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1: Simple Tree</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [1,2,3]</p>
                                    <p><strong>Output:</strong> 6</p>
                                    <p><strong>Explanation:</strong> The optimal path is 2 -&gt; 1 -&gt; 3 with a path sum of 2 + 1 + 3 = 6.</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`  1
 / \\
2   3`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2: Negative Nodes</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [-10,9,20,null,null,15,7]</p>
                                    <p><strong>Output:</strong> 42</p>
                                    <p><strong>Explanation:</strong> The optimal path is 15 -&gt; 20 -&gt; 7 with a path sum of 15 + 20 + 7 = 42.</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`   -10
   /  \\
  9   20
     /  \\
    15   7`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range <code>[1, 3 * 10^4]</code>.</li>
                            <li><code>-1000 &le; Node.val &le; 1000</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className={`text-${themeColor}-500`}/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is exactly like finding the "Diameter of a Binary Tree", but with a critical twist: node values can be negative! A path must have a "peak" node. The best path through a peak is <code>node.val + leftBranch + rightBranch</code>. However, if a branch sum is negative, adding it will only hurt our total! Therefore, we must brutally prune negative subtrees by taking <code>Math.max(0, branchSum)</code>.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Bottom-Up DFS O(N):</strong> The optimal approach. We write a DFS function that returns the max <em>single branch</em> sum passing downwards. Right before it returns, it calculates the "inverted V" path `left + right + node` and updates a global <code>max</code> variable. We process everything in a single pass!</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Top-Down DFS O(N²):</strong> The naive approach. We explicitly calculate the "inverted V" sum at the root, then recursively call the function to check if the left or right subtrees contain a better path. This recalculates the branch sums for lower nodes repeatedly, causing $O(N^2)$ time.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Array (Level-Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="-10, 9, 20, null, null, 15, 7" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? `bg-${themeColor}-900 border-${themeColor}-800` : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                                <CheckCircle2 size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Max Path Sum is {String(st.finalAns === null ? 'MIN_VAL' : st.finalAns)}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'eval' || st.hlPhase === 'evalLocal' ? 'text-amber-400' : (st.hlPhase === 'returnSuccess' || st.hlPhase === 'heightReturn' ? `text-${themeColor}-400` : (st.hlPhase === 'enter' || st.hlPhase === 'heightEnter' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Negative Pruning and Postorder Efficiency.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-rose-500"/> 1. Pruning Negative Subpaths</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If a child returns a max path sum of <code>-5</code>, and the current node's value is <code>10</code>, adding the child's path creates a sum of <code>5</code>. If we simply <em>ignore</em> the child branch entirely, our sum is <code>10</code>. Because a path can stop anywhere, we should never include a subpath that contributes a net negative value.</p>
                        <p className="text-slate-600 leading-relaxed">We cleanly handle this by taking <code>Math.max(0, branchSum)</code>. If the branch is negative, it gets clamped to 0, mathematically simulating "chopping off" that branch from our path.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><IterationCcw size={24} className={`text-${themeColor}-500`}/> 2. The Bottom-Up Trick (O(N))</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Instead of doing separate passes for evaluating the inverted 'V' path and calculating single branch sums, we can do both simultaneously! We use a Postorder traversal (Left, Right, Root) so we only process a parent AFTER its children are fully processed.</p>
                        <p className="text-slate-600 leading-relaxed">The <code>dfsSum()</code> function computes the inverted 'V' path (<code>left + right + node.val</code>) and updates the global <code>max</code> variable. However, a parent node cannot use an inverted 'V' path (a path cannot fork in three directions). So, the function returns only the best <em>single continuous branch</em> downwards (`max(left, right) + node.val`).</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> The Bottom-Up DFS visits each node exactly once to calculate its branch sum and verify its local inverted 'V' path. Thus, the time complexity is strictly linear, $O(N)$.</li>
                            <li><strong>Space Complexity: O(H).</strong> Where $H$ is the Height of the tree. The maximum memory used is determined by the maximum depth of the Call Stack. In the worst case (a completely unbalanced, linked-list-like tree), $H = N$, so space is $O(N)$. In the best case (a perfectly balanced tree), $H = \log N$, so space is $O(\log N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a massive 'filter' question at FAANG. It tests your ability to decouple the internal logic of a recursive function (updating global state) from the return value of the function (propagating a single branch)."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In Java, what if I don't want to use a global variable for `max`? Can I avoid it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, pass a single-element array."</p>
                            <p>Global instance variables are considered bad practice in large applications because they are not thread-safe. Instead, we can initialize `int[] max = new int[](Integer.MIN_VALUE);` in the main method and pass `max` into the DFS helper. This allows the DFS function to safely mutate the array by reference across all recursive calls without relying on global state."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the tree only has negative numbers, e.g., [-10, -2, -3]? Will `Math.max(0, branch)` ruin the answer by returning 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it correctly finds the least negative node!"</p>
                            <p>If all nodes are negative, `leftSum` and `rightSum` will constantly be clamped to 0. So, `localMaxPath` becomes `0 + 0 + node.val = node.val`. Since we initialized the global max to `Integer.MIN_VALUE`, it will correctly compare all the individual negative node values and store the single largest (least negative) node value as the answer!"</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why does the DFS function only return ONE branch (left or right) to its parent, instead of the inverted 'V' sum?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because a valid path cannot branch in three directions."</p>
                            <p>An inverted 'V' path (Left Child &rarr; Node &rarr; Right Child) is a complete, closed path. If we returned that sum up to the parent, the parent would try to attach it to itself, creating a fork! A path must be a continuous line. Therefore, we can only pass up a single straight line (Node + Best Child) to keep the path valid."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'eval' || st.hlPhase === 'evalLocal' ? 'text-amber-400' : (st.hlPhase === 'returnSuccess' || st.hlPhase === 'heightReturn' ? `text-${themeColor}-400` : (st.hlPhase === 'enter' || st.hlPhase === 'heightEnter' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                           
                           {/* Call Stack */}
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'heightEnter') ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                        <LayersIcon size={14}/> Call Stack (Recursion)
                                    </span>
                                </div>
                                <div className="flex flex-col gap-1 h-full max-h-[250px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                                    {st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((nodeId: number, idx: number) => {
                                        let isTop = idx === 0;
                                        let nObj = treeData.nodes.find((n:any) => n.id === nodeId);
                                        let displayStr = `${st.isHelper ? 'branchSum' : 'dfsSum'}(${nObj && nObj.val !== null ? String(nObj.val) : 'null'})`;
                                        
                                        return (
                                            <div key={`fs-stk-${idx}-${nodeId}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-sky-500 border-sky-600 text-white shadow-md' : 'bg-sky-50 border-sky-200 text-sky-700 opacity-70'}`}>
                                                {displayStr}
                                            </div>
                                        );
                                    }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
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
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='-10, 9, 20...' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 ring-${themeColor}-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Max Path Sum</div>
                                    <div className={`font-mono text-${themeColor}-400 text-5xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center`}>
                                        {String(st.finalAns === null ? 'MIN_VAL' : st.finalAns)}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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