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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  prefixSumDfs: {
    id: 'prefixSumDfs',
    title: '1. DFS + Prefix Sum Map',
    icon: <Database size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'violet',
    code: `class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        Map<Long, Integer> prefixMap = new HashMap<>();
        prefixMap.put(0L, 1);
        return dfs(root, 0L, targetSum, prefixMap);
    }
    
    private int dfs(TreeNode node, long currSum, int targetSum, Map<Long, Integer> prefixMap) {
        if (node == null) return 0;
        
        currSum += node.val;
        int count = prefixMap.getOrDefault(currSum - targetSum, 0);
        
        prefixMap.put(currSum, prefixMap.getOrDefault(currSum, 0) + 1);
        
        count += dfs(node.left, currSum, targetSum, prefixMap);
        count += dfs(node.right, currSum, targetSum, prefixMap);
        
        prefixMap.put(currSum, prefixMap.get(currSum) - 1);
        
        return count;
    }
}`,
    desc: "The Optimal Approach: DFS combined with a Prefix Sum HashMap. Instead of checking every single possible path from every node (which takes O(N^2) time), we maintain a running sum as we traverse down the tree. If the current running sum minus the target sum exists in our HashMap of previously seen prefix sums, it means there is a valid path that ends at our current node! We use backtracking to remove the current sum from the map as we retreat up the tree, ensuring parallel branches don't cross-contaminate."
  },
  doubleDfs: {
    id: 'doubleDfs',
    title: '2. Double DFS (Brute Force)',
    icon: <GitFork size={16} />,
    complexity: 'Time: O(N²) | Space: O(H)',
    theme: 'rose',
    code: `class Solution {
    public int pathSum(TreeNode root, int targetSum) {
        if (root == null) return 0;
        int pathsFromRoot = countPaths(root, targetSum);
        int pathsFromLeft = pathSum(root.left, targetSum);
        int pathsFromRight = pathSum(root.right, targetSum);
        return pathsFromRoot + pathsFromLeft + pathsFromRight;
    }
    
    private int countPaths(TreeNode node, long currentTarget) {
        if (node == null) return 0;
        int count = 0;
        if (node.val == currentTarget) {
            count++;
        }
        count += countPaths(node.left, currentTarget - node.val);
        count += countPaths(node.right, currentTarget - node.val);
        return count;
    }
}`,
    desc: "The Intuitive Brute-Force Approach: We write an outer DFS function (`pathSum`) that visits absolutely every node in the tree. For every node visited, we launch an inner DFS (`countPaths`) that searches strictly downwards to see if any path starting at that specific node adds up to the target sum. While highly readable and requiring no extra memory structures, launching a DFS from inside another DFS leads to quadratic time complexity in the worst case (skewed trees)."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|pathSum|countPaths|dfs|TreeNode|Solution|root|null|this|left|right|currSum|targetSum|currentTarget|prefixMap|count|Map|HashMap|put|getOrDefault|get|pathsFromRoot|pathsFromLeft|pathsFromRight)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'null', 'this'].includes(part);
            const isObject = ['TreeNode', 'Solution', 'Map', 'HashMap', 'Long', 'Integer'].includes(part);
            const isPointer = ['root', 'left', 'right', 'currSum', 'targetSum', 'currentTarget', 'prefixMap', 'count', 'node', 'val', 'pathsFromRoot', 'pathsFromLeft', 'pathsFromRight'].includes(part);
            const isMapCall = ['pathSum', 'countPaths', 'dfs', 'put', 'getOrDefault', 'get'].includes(part);
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

export default function PathSumIIIVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('prefixSumDfs');
  
  const [treeInput, setTreeInput] = useState('10, 5, -3, 3, 2, null, 11, 3, -2, null, 1');
  const [targetInput, setTargetInput] = useState('8');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]);
  const [baseTarget, setBaseTarget] = useState<number>(8);

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
      if (parsedTree.length > 63) parsedTree = parsedTree.slice(0, 63); // Limit size for UI performance
      while(parsedTree.length > 0 && parsedTree[parsedTree.length - 1] === null) parsedTree.pop();
      return parsedTree;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTreeArr(parseTreeInput(treeInput, [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]));
      let parsedTarget = parseInt(targetInput.trim(), 10);
      setBaseTarget(isNaN(parsedTarget) ? 8 : parsedTarget);
      
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [treeInput, targetInput, selectedOpId]);

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
      
      const paddingX = 10;
      const usableWidth = 100;
      const totalWidthUnits = Math.max(1, xCounter - 1);
      
      nodesObj.forEach(n => {
          let px = paddingX + (n.gridX / totalWidthUnits) * usableWidth;
          let py = n.gridY * 70 + 40; 
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, originalNode: n });
          
          if (n.left) {
              let clx = paddingX + (n.left.gridX / totalWidthUnits) * usableWidth;
              let cly = n.left.gridY * 70 + 40;
              renderEdges.push({ source: n.id, target: n.left.id, sx: px, sy: py, tx: clx, ty: cly });
          }
          if (n.right) {
              let crx = paddingX + (n.right.gridX / totalWidthUnits) * usableWidth;
              let cry = n.right.gridY * 70 + 40;
              renderEdges.push({ source: n.id, target: n.right.id, sx: px, sy: py, tx: crx, ty: cry });
          }
      });

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth };
  };

  const treeData = useMemo(() => buildTreeGeometry(baseTreeArr), [baseTreeArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root && baseTreeArr.length === 0) return [];

    let callStack: string[] = [];
    let totalPaths = 0;

    const cloneMap = (m: Record<number, number>) => ({...m});

    if (selectedOpId === 'prefixSumDfs') {
        let activePath: number[] = [];
        let mapState: Record<number, number> = { 0: 1 };

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                callStack: [...callStack], activePath: [...activePath], mapState: cloneMap(mapState), totalPaths, ...st 
            } 
        });

        const dfs = (node: any | null, currSum: number, side: string = "root", parentId: number | null = null): number => {
            if (steps.length > 2500) return 0; // Guard
            
            let callStr = `dfs(${node ? node.val : 'null'}, sum=${currSum})`;
            callStack.push(callStr);

            add("DFS Entry", `Entering node ${node ? node.val : 'null'} with running sum ${currSum}.`, 8, { currNodeId: node ? node.id : null, parentId, side, currSum });
            add("Null Check", `if (node == null) return 0;\nIs node null? (${node == null ? 'Yes' : 'No'})`, 9, { currNodeId: node ? node.id : null, parentId, side, hlCheckNull: true });

            if (node == null) {
                callStack.pop();
                return 0;
            }

            activePath.push(node.id);
            let newSum = currSum + node.val;
            
            add("Accumulate Prefix Sum", `currSum += node.val;\nAdding current node value: ${currSum} + ${node.val} = ${newSum}.`, 11, { currNodeId: node.id, parentId, side, currSum: newSum, hlAccumulate: true });

            let needed = newSum - baseTarget;
            let countAtNode = mapState[needed] || 0;
            
            add("Check Valid Path", `int count = prefixMap.getOrDefault(currSum - targetSum, 0);\nChecking map for (${newSum} - ${baseTarget}) = ${needed}.\nFound ${countAtNode} valid sub-paths ending here.`, 12, { currNodeId: node.id, parentId, side, currSum: newSum, needed, countAtNode, hlCheckMap: true });

            if (countAtNode > 0) {
                totalPaths += countAtNode;
                add("Valid Path Detected!", `Found valid path(s)! Accumulating total paths to ${totalPaths}.`, 12, { currNodeId: node.id, parentId, side, currSum: newSum, needed, countAtNode, hlFoundPath: true });
            }

            let prevCount = mapState[newSum] || 0;
            mapState[newSum] = prevCount + 1;
            
            add("Update Map", `prefixMap.put(currSum, prefixMap.getOrDefault(currSum, 0) + 1);\nStoring current prefix sum (${newSum}) into HashMap to enable deeper children to form paths.`, 14, { currNodeId: node.id, parentId, side, currSum: newSum, hlUpdateMap: true });

            add("Recurse Left", `count += dfs(node.left, currSum, ...);\nTraversing left child of ${node.val} passing running sum ${newSum}.`, 16, { currNodeId: node.id, currSum: newSum, hlRecurseLeft: true });
            let leftCount = dfs(node.left, newSum, "left", node.id);

            add("Recurse Right", `count += dfs(node.right, currSum, ...);\nTraversing right child of ${node.val} passing running sum ${newSum}.`, 17, { currNodeId: node.id, currSum: newSum, hlRecurseRight: true });
            let rightCount = dfs(node.right, newSum, "right", node.id);

            mapState[newSum] -= 1;
            if (mapState[newSum] === 0) delete mapState[newSum];
            activePath.pop();

            add("Backtrack Map State", `prefixMap.put(currSum, prefixMap.get(currSum) - 1);\nBacktracking from node ${node.val}. Removing sum ${newSum} from map so it doesn't cross-contaminate parallel branches.`, 19, { currNodeId: node.id, currSum: newSum, hlBacktrackMap: true });

            let totalSubCount = countAtNode + leftCount + rightCount;
            add("Return Count", `return count;\nReturning ${totalSubCount} paths found in this subtree.`, 21, { currNodeId: node.id, hlReturnCount: true });

            callStack.pop();
            return totalSubCount;
        };

        if (baseTreeArr.length > 0) {
            add("Function Call", `public int pathSum(TreeNode root, int targetSum=${baseTarget})`, 2, {});
            add("Initialize HashMap", `Map<Long, Integer> prefixMap = new HashMap<>();`, 3, { hlInitMap: true });
            add("Base Case Put", `prefixMap.put(0L, 1);\nInitializing Prefix Map. Critical step: adding {0: 1} ensures that paths starting directly from the root are counted!`, 4, { hlInitMap: true });
            
            add("Start DFS", `return dfs(root, 0L, targetSum, prefixMap);\nInitiating Depth-First Search from root.`, 5, { hlStartDFS: true });
            let finalCount = dfs(treeData.root, 0);
            
            add("Execution Complete", `Tree traversal finished. The total number of valid paths is ${finalCount}.`, 5, { isSuccess: true, finalAns: finalCount });
        }
    } 
    else if (selectedOpId === 'doubleDfs') {
        let outerNodeId: number | null = null;
        let innerNodeId: number | null = null;
        let innerPath: number[] = [];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                callStack: [...callStack], totalPaths, outerNodeId, innerNodeId, innerPath: [...innerPath], ...st 
            } 
        });

        const countPaths = (innerNode: any | null, currentTarget: number): number => {
            if (steps.length > 2500) return 0;
            let callStr = `countPaths(${innerNode ? innerNode.val : 'null'}, target=${currentTarget})`;
            callStack.push(callStr);
            
            innerNodeId = innerNode ? innerNode.id : null;
            if (innerNode) innerPath.push(innerNode.id);

            add("Inner DFS Entry", `private int countPaths(TreeNode node, long currentTarget)\nSearching for target ${currentTarget} starting at node ${innerNode ? innerNode.val : 'null'}.`, 10, { hlCountPathsEntry: true, currentTarget });
            add("Inner Null Check", `if (node == null) return 0;`, 11, { hlInnerNull: true, currentTarget });

            if (innerNode == null) {
                callStack.pop();
                return 0;
            }

            add("Init Path Count", `int count = 0;`, 12, { hlInnerInitCount: true, currentTarget });
            let count = 0;

            let isMatch = innerNode.val === currentTarget;
            add("Check Path Match", `if (node.val == currentTarget)\nDoes node value ${innerNode.val} == ${currentTarget}? (${isMatch ? 'YES' : 'NO'})`, 13, { hlInnerCheckMatch: true, isMatch, currentTarget });

            if (isMatch) {
                count++;
                totalPaths++;
                add("Path Found!", `count++;\nFound valid path! Adding to total.`, 14, { hlInnerMatchInc: true, isMatch, currentTarget });
            }

            let nextTarget = currentTarget - innerNode.val;
            
            add("Inner Recurse Left", `count += countPaths(node.left, currentTarget - node.val);\nContinuing path search left with new target: ${currentTarget} - ${innerNode.val} = ${nextTarget}`, 16, { hlInnerRecurseLeft: true, currentTarget });
            count += countPaths(innerNode.left, nextTarget);
            
            innerNodeId = innerNode.id; // Restore active inner node visually after returning

            add("Inner Recurse Right", `count += countPaths(node.right, currentTarget - node.val);\nContinuing path search right with new target: ${currentTarget} - ${innerNode.val} = ${nextTarget}`, 17, { hlInnerRecurseRight: true, currentTarget });
            count += countPaths(innerNode.right, nextTarget);

            innerNodeId = innerNode.id;
            innerPath.pop();

            add("Return Inner Count", `return count;\nReturning ${count} valid paths found stemming from this branch.`, 18, { hlInnerReturn: true, currentTarget });

            callStack.pop();
            return count;
        };

        const pathSumDFS = (outerNode: any | null): number => {
            if (steps.length > 2500) return 0;
            let callStr = `pathSum(${outerNode ? outerNode.val : 'null'})`;
            callStack.push(callStr);
            
            outerNodeId = outerNode ? outerNode.id : null;
            innerNodeId = null;
            innerPath = [];

            add("Outer DFS Entry", `public int pathSum(TreeNode root, int targetSum)\nVisiting outer node ${outerNode ? outerNode.val : 'null'} to launch path search.`, 2, { hlOuterEntry: true });
            add("Outer Null Check", `if (root == null) return 0;`, 3, { hlOuterNull: true });

            if (outerNode == null) {
                callStack.pop();
                return 0;
            }

            add("Launch Inner DFS", `int pathsFromRoot = countPaths(root, targetSum);\nLaunching downward search starting from node ${outerNode.val} looking for ${baseTarget}.`, 4, { hlLaunchInner: true });
            let pathsFromRoot = countPaths(outerNode, baseTarget);
            
            outerNodeId = outerNode.id;
            innerNodeId = null;
            innerPath = [];

            add("Outer Recurse Left", `int pathsFromLeft = pathSum(root.left, targetSum);\nMoving outer traversal to left child of ${outerNode.val}.`, 5, { hlOuterLeft: true });
            let pathsFromLeft = pathSumDFS(outerNode.left);

            outerNodeId = outerNode.id;
            innerNodeId = null;

            add("Outer Recurse Right", `int pathsFromRight = pathSum(root.right, targetSum);\nMoving outer traversal to right child of ${outerNode.val}.`, 6, { hlOuterRight: true });
            let pathsFromRight = pathSumDFS(outerNode.right);

            outerNodeId = outerNode.id;
            innerNodeId = null;

            add("Return Total Paths", `return pathsFromRoot + pathsFromLeft + pathsFromRight;\nReturning sum of all paths found in this subtree.`, 7, { hlOuterReturn: true });

            callStack.pop();
            return pathsFromRoot + pathsFromLeft + pathsFromRight;
        }

        if (baseTreeArr.length > 0) {
            let finalCount = pathSumDFS(treeData.root);
            outerNodeId = null;
            innerNodeId = null;
            innerPath = [];
            add("Execution Complete", `Tree traversal finished. The total number of valid paths is ${finalCount}.`, 7, { isSuccess: true, finalAns: finalCount });
        }
    }

    return steps;
  }, [baseTreeArr, baseTarget, treeData, selectedOpId]);

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

      if (selectedOpId === 'prefixSumDfs') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlFoundPath ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : (st.hlCheckMap ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-200')}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Calculator size={14}/> Active Path Calculation</span>
                  
                  {st.currNodeId === null && st.hlCheckNull ? (
                      <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                           <div className="flex items-center gap-4 text-sky-600 font-mono font-black text-xl bg-sky-50 px-6 py-3 rounded-2xl border-2 border-sky-300 shadow-md">
                               <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-200">return 0</span>
                           </div>
                      </div>
                  ) : st.currNodeId !== null && (st.hlAccumulate || st.hlCheckMap || st.hlFoundPath || st.hlUpdateMap || st.hlBacktrackMap || st.hlRecurseLeft || st.hlRecurseRight || st.hlReturnCount) ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2">
                          
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Running Sum (currSum)</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlAccumulate ? 'bg-violet-100 border-violet-400 text-violet-800 scale-110 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                  {st.currSum !== undefined ? st.currSum : '?'}
                              </div>
                          </div>
                          
                          <span className="text-2xl font-black text-slate-400">-</span>
                          
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>targetSum</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                                  {baseTarget}
                              </div>
                          </div>
                          
                          <span className="text-2xl font-black text-slate-400">=</span>
                          
                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckMap || st.hlFoundPath ? 'text-amber-600' : 'text-slate-400'}`}>Prefix Needed</span>
                              <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlCheckMap || st.hlFoundPath ? 'bg-amber-100 border-amber-400 text-amber-800 scale-110 shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                  {st.needed !== undefined ? st.needed : '?'}
                              </div>
                          </div>

                          <div className="flex flex-col items-center border-l-2 border-slate-200 pl-4 md:pl-6 ml-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlFoundPath ? 'text-emerald-600' : 'text-slate-400'}`}>Found in Map?</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.hlFoundPath ? 'bg-emerald-100 border-emerald-400 text-emerald-800 shadow-md scale-110 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                  {st.countAtNode > 0 ? `YES (${st.countAtNode})` : 'NO'}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Traversing tree/Updating structures...</span>
                      </div>
                  )}
              </div>
          );
      } else {
          // Double DFS Dashboard
          let innerNodeObj = treeData.nodes.find((n: any) => n.id === st.innerNodeId);
          let innerVal = innerNodeObj ? innerNodeObj.val : null;
          let outerNodeObj = treeData.nodes.find((n: any) => n.id === st.outerNodeId);
          let outerVal = outerNodeObj ? outerNodeObj.val : null;

          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlInnerMatchInc ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Double DFS Search State</span>
                  
                  <div className="flex w-full items-center justify-between px-10 gap-8 min-h-[80px] py-2">
                      <div className="flex flex-col items-center flex-1">
                          <span className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${st.outerNodeId !== null ? 'text-rose-500' : 'text-slate-400'}`}>Outer DFS Node</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.outerNodeId !== null ? 'bg-rose-50 border-rose-400 text-rose-800 shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {outerVal !== null ? outerVal : '?'}
                          </div>
                      </div>

                      <ArrowRight size={32} className="text-slate-300 shrink-0"/>

                      <div className="flex flex-col items-center flex-1">
                          <span className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${st.innerNodeId !== null ? 'text-amber-600' : 'text-slate-400'}`}>Inner DFS Node</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.innerNodeId !== null ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-lg scale-110' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                              {innerVal !== null ? innerVal : '?'}
                          </div>
                      </div>

                      <span className="text-3xl font-black text-slate-300 shrink-0">==</span>

                      <div className="flex flex-col items-center flex-1">
                          <span className={`text-[10px] font-bold uppercase mb-2 flex items-center gap-1 ${st.hlInnerMatchInc ? 'text-emerald-600' : 'text-slate-400'}`}>Remaining Target</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlInnerMatchInc ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-lg scale-110 animate-pulse' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.currentTarget !== undefined ? st.currentTarget : '?'}
                          </div>
                      </div>
                  </div>
              </div>
          );
      }
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      const treeContainerHeight = Math.max(350, (treeData.maxDepth + 1) * 70 + 80);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Path Condition Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Map State Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-center justify-center">
                  
                  {selectedOpId === 'prefixSumDfs' && (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlUpdateMap || st.hlBacktrackMap ? 'border-amber-300 shadow-lg ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${st.hlUpdateMap || st.hlBacktrackMap ? 'text-amber-600' : 'text-slate-500'} mb-2 flex items-center gap-2`}>
                              <Database size={14}/> Prefix Map Frequencies
                          </span>
                          <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                              {st.mapState && Object.keys(st.mapState).length > 0 ? Object.entries(st.mapState).map(([k, v]: [string, any], idx: number) => (
                                  <div key={`map-bar-${k}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-3 py-1.5 font-mono text-sm ${st.needed !== undefined && st.needed === parseInt(k) && (st.hlCheckMap || st.hlFoundPath) ? 'bg-amber-100 text-amber-800 border-amber-500 ring-2 ring-amber-200 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                      <span className="font-black text-lg leading-none">{k}</span>
                                      <span className="text-[9px] border-t border-slate-300 pt-0.5 mt-0.5 opacity-80 uppercase tracking-widest text-emerald-600">freq: {String(v)}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                          </div>
                      </div>
                  )}

                  <div className={`flex flex-col items-center justify-center bg-white px-8 py-4 rounded-3xl border-4 shadow-xl transition-all duration-500 ${st.hlFoundPath || st.hlInnerMatchInc ? 'border-emerald-400 ring-4 ring-emerald-100 scale-110' : 'border-slate-200'} ${selectedOpId === 'dfsRecursion' ? 'w-64' : 'w-48'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2"><Target size={14}/> Total Valid Paths</span>
                      <div className={`font-mono font-black text-5xl transition-colors duration-300 ${st.hlFoundPath || st.hlInnerMatchInc ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {st.totalPaths !== undefined ? st.totalPaths : 0}
                      </div>
                  </div>
              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {treeData.edges.map((edge: any, i: number) => {
                                  let isActive = false;
                                  let isPath = false;

                                  if (selectedOpId === 'prefixSumDfs') {
                                      if (st.activePath && st.activePath.includes(edge.target)) isPath = true;
                                      if (st.currNodeId === edge.target) isActive = true;
                                      if (st.currNodeId === edge.source && ((st.hlRecurseLeft && st.side === 'left') || (st.hlRecurseRight && st.side === 'right'))) isActive = true;
                                  } else {
                                      if (st.innerPath && st.innerPath.includes(edge.target)) isPath = true;
                                      if (st.innerNodeId === edge.target) isActive = true;
                                      if (st.innerNodeId === edge.source && ((st.hlInnerRecurseLeft) || (st.hlInnerRecurseRight))) isActive = true;
                                  }
                                  
                                  let strokeColor = '#e2e8f0'; // slate-200
                                  let strokeWidth = 2;
                                  let opacity = 0.5;

                                  if (isPath) {
                                      strokeColor = selectedOpId === 'prefixSumDfs' ? '#a78bfa' : '#fbcfe8'; // violet-400 / rose-200
                                      strokeWidth = 4;
                                      opacity = 0.9;
                                  }
                                  if (isActive) {
                                      strokeColor = selectedOpId === 'prefixSumDfs' ? '#8b5cf6' : '#f59e0b'; // violet-500 / amber-500
                                      strokeWidth = 5;
                                      opacity = 1;
                                  }

                                  return <line key={`edge-${i}`} x1={`${edge.sx}%`} y1={edge.sy + 16} x2={`${edge.tx}%`} y2={edge.ty - 16} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className={`transition-all duration-300 ${(st.hlFoundPath || st.hlInnerMatchInc) && isPath ? 'stroke-emerald-400 stroke-[6px]' : ''}`}/>
                              })}

                              {/* Draw Virtual Null Edge for Prefix Sum */}
                              {selectedOpId === 'prefixSumDfs' && st.currNodeId === null && st.activePath && st.activePath.length > 0 && (() => {
                                  const parentId = st.activePath[st.activePath.length - 1];
                                  const parent = treeData.nodes.find((n: any) => n.id === parentId);
                                  if (!parent) return null;
                                  let sx = parent.x;
                                  let sy = parent.y + 20;
                                  let tx = st.side === 'left' ? parent.x - 10 : parent.x + 10;
                                  let ty = parent.y + 70 - 20;
                                  return <line x1={`${sx}%`} y1={sy} x2={`${tx}%`} y2={ty} stroke="#a78bfa" strokeWidth="4" strokeDasharray="4 4" opacity={0.8} className="animate-pulse transition-all duration-500" />
                              })()}

                              {/* Draw Virtual Null Edge for Double DFS */}
                              {selectedOpId === 'doubleDfs' && st.innerNodeId === null && st.innerPath && st.innerPath.length > 0 && (() => {
                                  const parentId = st.innerPath[st.innerPath.length - 1];
                                  const parent = treeData.nodes.find((n: any) => n.id === parentId);
                                  if (!parent) return null;
                                  let sx = parent.x;
                                  let sy = parent.y + 20;
                                  let tx = parent.x; // Simplified straight down for visual cleanliness
                                  let ty = parent.y + 70 - 20;
                                  return <line x1={`${sx}%`} y1={sy} x2={`${tx}%`} y2={ty} stroke="#fbcfe8" strokeWidth="4" strokeDasharray="4 4" opacity={0.8} className="animate-pulse transition-all duration-500" />
                              })()}
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = false;
                              let isPath = false;
                              let isOuter = false;

                              if (selectedOpId === 'prefixSumDfs') {
                                  isActive = st.currNodeId === node.id;
                                  isPath = st.activePath && st.activePath.includes(node.id);
                              } else {
                                  isActive = st.innerNodeId === node.id;
                                  isPath = st.innerPath && st.innerPath.includes(node.id);
                                  isOuter = st.outerNodeId === node.id;
                              }
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isActive) {
                                  if (st.hlFoundPath || st.hlInnerMatchInc) {
                                      bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-2xl text-emerald-900 scale-125 z-40";
                                  } else {
                                      bgClass = selectedOpId === 'prefixSumDfs' ? "bg-violet-100 border-violet-500 ring-4 ring-violet-200 shadow-xl text-violet-900 scale-125 z-30" : "bg-amber-100 border-amber-500 ring-4 ring-amber-200 shadow-xl text-amber-900 scale-125 z-30";
                                  }
                              } else if (isOuter) {
                                  bgClass = "bg-rose-100 border-rose-500 ring-4 ring-rose-200 shadow-lg text-rose-900 scale-110 z-20";
                              } else if (isPath) {
                                  if (st.hlFoundPath || st.hlInnerMatchInc) {
                                      bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md z-20 opacity-100 scale-105";
                                  } else {
                                      bgClass = selectedOpId === 'prefixSumDfs' ? "bg-violet-50 border-violet-400 text-violet-800 shadow-md z-20 opacity-100" : "bg-rose-50 border-rose-300 text-rose-800 shadow-sm z-20 opacity-100";
                                  }
                              }
                              
                              if (st.isSuccess) {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-60 z-10 scale-95";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${st.hlFoundPath || st.hlInnerMatchInc ? 'text-emerald-600 border border-emerald-200' : (selectedOpId === 'prefixSumDfs' ? 'text-violet-600 border border-violet-200' : 'text-amber-600 border border-amber-200')}`}>
                                              {st.hlFoundPath || st.hlInnerMatchInc ? 'Valid Path!' : 'curr'}
                                          </span>
                                      )}
                                      {isOuter && !isActive && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm text-rose-600 border border-rose-200`}>
                                              outer
                                          </span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{node.val}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Visualizing Base Case */}
                          {selectedOpId === 'prefixSumDfs' && st.currNodeId === null && st.activePath && st.activePath.length > 0 && (
                              <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                  left: `${(treeData.nodes.find((n: any) => n.id === st.activePath[st.activePath.length-1])?.x || 50) + (st.side === 'left' ? -10 : 10)}%`, 
                                  top: `${(treeData.nodes.find((n: any) => n.id === st.activePath[st.activePath.length-1])?.y || 0) + 70}px`, 
                                  transform: 'translate(-50%, -50%)' 
                              }}>
                                  <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-violet-400 bg-violet-100 rounded-full shadow-lg ring-4 ring-violet-200">
                                      <span className="font-mono font-black text-[10px] text-violet-800">null</span>
                                  </div>
                              </div>
                          )}
                          {selectedOpId === 'doubleDfs' && st.innerNodeId === null && st.innerPath && st.innerPath.length > 0 && (
                              <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                  left: `${(treeData.nodes.find((n: any) => n.id === st.innerPath[st.innerPath.length-1])?.x || 50)}%`, 
                                  top: `${(treeData.nodes.find((n: any) => n.id === st.innerPath[st.innerPath.length-1])?.y || 0) + 70}px`, 
                                  transform: 'translate(-50%, -50%)' 
                              }}>
                                  <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-amber-400 bg-amber-100 rounded-full shadow-lg ring-4 ring-amber-200">
                                      <span className="font-mono font-black text-[10px] text-amber-800">null</span>
                                  </div>
                              </div>
                          )}

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Path Sum III</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 437</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Target Paths</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the <code>root</code> of a binary tree and an integer <code>targetSum</code>, return the number of paths where the sum of the values along the path equals <code>targetSum</code>.</p>
                        <p>The path does not need to start or end at the root or a leaf, but it must go downwards (i.e., traveling only from parent nodes to child nodes).</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The paths that sum to 8 are shown in <span className="text-emerald-400 font-bold">Green</span>.<br/><br/>
                                • Path 1: 5 &rarr; 3<br/>
                                • Path 2: 5 &rarr; 2 &rarr; 1<br/>
                                • Path 3: -3 &rarr; 11
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="100%" height="220" viewBox="0 0 200 220" className="max-w-[200px]">
                                <line x1="100" y1="30" x2="50" y2="80" stroke="#475569" strokeWidth="2" />
                                <line x1="100" y1="30" x2="150" y2="80" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="50" y1="80" x2="25" y2="130" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="50" y1="80" x2="75" y2="130" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="150" y1="80" x2="175" y2="130" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="25" y1="130" x2="10" y2="180" stroke="#475569" strokeWidth="2" />
                                <line x1="25" y1="130" x2="40" y2="180" stroke="#475569" strokeWidth="2" />
                                <line x1="75" y1="130" x2="90" y2="180" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                
                                <circle cx="100" cy="30" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="100" y="35" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">10</text>
                                
                                <circle cx="50" cy="80" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="50" y="85" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="150" cy="80" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="150" y="85" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">-3</text>
                                
                                <circle cx="25" cy="130" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="25" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="75" cy="130" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="75" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="175" cy="130" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="175" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">11</text>
                                
                                <circle cx="10" cy="180" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="10" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="40" cy="180" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="40" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">-2</text>
                                
                                <circle cx="90" cy="180" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="90" y="185" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The paths that sum to 22 are shown in <span className="text-emerald-400 font-bold">Green</span>.<br/><br/>
                                • Path 1: 5 &rarr; 4 &rarr; 11 &rarr; 2<br/>
                                • Path 2: 5 &rarr; 8 &rarr; 4 &rarr; 5<br/>
                                • Path 3: 4 &rarr; 11 &rarr; 7
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="100%" height="220" viewBox="0 0 300 220" className="max-w-[300px]">
                                <line x1="150" y1="30" x2="80" y2="80" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="150" y1="30" x2="220" y2="80" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                
                                <line x1="80" y1="80" x2="50" y2="130" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                
                                <line x1="220" y1="80" x2="190" y2="130" stroke="#475569" strokeWidth="2" />
                                <line x1="220" y1="80" x2="250" y2="130" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                
                                <line x1="50" y1="130" x2="20" y2="180" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="50" y1="130" x2="80" y2="180" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                
                                <line x1="250" y1="130" x2="220" y2="180" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="250" y1="130" x2="280" y2="180" stroke="#475569" strokeWidth="2" />

                                <circle cx="150" cy="30" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="150" y="35" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="80" cy="80" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="80" y="85" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="220" cy="80" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="220" y="85" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">8</text>
                                
                                <circle cx="50" cy="130" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="50" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">11</text>
                                
                                <circle cx="190" cy="130" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="190" y="135" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">13</text>
                                
                                <circle cx="250" cy="130" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="250" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="20" cy="180" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="20" y="185" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="80" cy="180" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="80" y="185" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="220" cy="180" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="220" y="185" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="280" cy="180" r="16" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="280" y="185" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [1, 2, null, 3], targetSum = 3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The paths do not need to start at the root or end at a leaf.<br/><br/>
                                • Path 1: 1 &rarr; 2<br/>
                                • Path 2: 3 (Just the single node!)
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="100" height="180" viewBox="0 0 100 180" className="max-w-[100px]">
                                <line x1="50" y1="30" x2="30" y2="90" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="30" y1="90" x2="50" y2="150" stroke="#475569" strokeWidth="2" />

                                <circle cx="50" cy="30" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="50" y="35" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="30" cy="90" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="30" y="95" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="50" cy="150" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="50" y="155" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [0, 1000].</li>
                            <li>-10^9 &le; Node.val &le; 10^9</li>
                            <li>-1000 &le; targetSum &le; 1000</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-violet-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">If we start a standard DFS from every single node in the tree to check all downward paths, the time complexity becomes O(N²), which is slow. We need to traverse the tree only once, keeping track of the running sums dynamically.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>DFS + Prefix Sum Map:</strong> As we traverse down, we maintain a <code>currSum</code>. If <code>currSum - targetSum</code> exists in a Map of previous prefix sums, removing that prefix yields the target! Fast O(N).</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Double DFS (Brute Force):</strong> A slow O(N²) approach where we launch a downwards search (`countPaths`) starting from literally every single node we visit in the outer traversal.</p>
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
                <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="10, 5, -3, 3, 2, null, 11..." />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target Sum</label>
                            <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="8" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found a total of {st.finalAns} matching paths.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFoundPath || st.hlInnerMatchInc ? 'text-emerald-400' : (st.hlCheckMap || st.hlOuterEntry || st.hlInnerEntry ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Map State Widget */}
                   {!st.isSuccess && st.mapState && (
                       <div className="absolute bottom-4 left-4 z-30 pointer-events-auto animate-in fade-in zoom-in duration-300">
                           <div className={`bg-white rounded-2xl border-2 ${st.hlUpdateMap || st.hlBacktrackMap ? 'border-amber-400 shadow-xl ring-4 ring-amber-100 scale-105' : 'border-slate-300 shadow-lg'} p-4 flex flex-col transition-all duration-300 w-48 max-h-[300px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${st.hlUpdateMap || st.hlBacktrackMap ? 'text-amber-600' : 'text-slate-500'}`}><Database size={12}/> Prefix Map</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {Object.entries(st.mapState).map(([k, v]: [string, any]) => (
                                       <div key={`map-${k}`} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700">
                                           <span className="text-violet-600 border-r border-slate-200 pr-2 w-10 text-right">{k}</span>
                                           <span className="text-emerald-600 pl-2 text-left flex-1"><span className="text-slate-400 font-normal mr-1">freq:</span>{String(v)}</span>
                                       </div>
                                   ))}
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Prefix Sums vs Nested DFS traversals.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Calculator size={24} className="text-violet-500"/> 1. The Prefix Sum Math</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Consider an array: <code>[1, 2, 3, 4]</code>. The prefix sums are <code>[1, 3, 6, 10]</code>.</p>
                        <p className="text-slate-600 leading-relaxed">If we want to find a subarray that sums to <code>5</code>, we can look at the running sum at the end (<code>10</code>). We check if we have seen the sum <code>10 - 5 = 5</code> earlier in the array. We haven't. What about at <code>6</code>? We need <code>6 - 5 = 1</code>. We HAVE seen <code>1</code> earlier! Therefore, the elements between the sum <code>1</code> and the sum <code>6</code> must add up to <code>5</code>. (Those elements are <code>[2, 3]</code>). This exact O(N) 1D array concept applies to trees, because a path from root to leaf is essentially just a 1D array!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-sky-500"/> 2. HashMap Frequency Tracking</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Why do we track frequencies in a map instead of a simple boolean <code>Set</code>?</p>
                        <p className="text-slate-600 leading-relaxed">Because paths can have nodes with <code>0</code> or negative values. If a path is <code>[..., 2, -2, 2, ...]</code>, the prefix sum could easily hit the same value multiple times along the same path. If we need to chop off a prefix sum of <code>X</code>, and we've seen <code>X</code> three times previously in this path, there are literally 3 distinct valid sub-paths that end at our current node!</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Prefix Sum (Optimal): O(N) Time.</strong> We visit every node in the tree exactly once via DFS. At each node, we perform O(1) HashMap lookups and insertions. Therefore, the total time is O(N). Space is O(N) for the map and call stack.</li>
                            <li><strong>Double DFS (Brute Force): O(N²) Time.</strong> We traverse to every node, and for every node, we start a new recursive traversal downwards. For a skewed tree (linked list), this is `N + (N-1) + (N-2) ...` = O(N²). Space is O(H) for the call stack.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a notoriously difficult medium/hard problem that combines two distinct concepts: DFS and Prefix Sum. Interviewers want to see you recognize the 1D prefix sum pattern hidden inside the tree."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q1: "Why do we execute <code>prefixMap.put(0L, 1)</code> before starting the DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "This handles the base case where a valid path starts exactly from the root node.</p>
                            <p>If our target is <code>8</code>, and the root node is <code>8</code>, the running sum is <code>8</code>. The formula checks <code>currSum - targetSum</code> &rarr; <code>8 - 8 = 0</code>. Without <code>{"{0: 1}"}</code> in the map, it would say we haven't seen a prefix sum of 0, and would miss this valid path entirely. Adding 0 guarantees that paths spanning directly from the absolute top of the tree are correctly counted."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><RotateCcw size={24}/></span>
                            <span>Q2: "Why is the backtracking step <code>prefixMap.put(currSum, prefixMap.get(currSum) - 1)</code> so crucial?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the HashMap is passed by reference across the entire tree, but valid paths can only go strictly <em>downwards</em>.</p>
                            <p>If we didn't remove sums as we returned, a prefix sum from the left branch of the tree would remain in the map when we process the right branch. The right branch might see that sum and erroneously think there is a valid path, combining nodes from parallel branches that are fundamentally disconnected. Backtracking mathematically isolated the map so it only ever contains sums from the direct ancestral path of the current node."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Could you solve this without extra space, using O(N^2) time?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, the brute-force approach requires no map.</p>
                            <p>You write a primary DFS that traverses the tree. For every single node it visits, it launches a <em>secondary</em> DFS that searches purely downwards for the target sum. Since a balanced tree has depth log(N), the secondary DFS takes O(log N) on average, leading to O(N log N) time. But for a skewed tree, the secondary DFS takes O(N), resulting in an O(N^2) worst-case runtime. The O(N) HashMap solution avoids this entirely."</p>
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
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFoundPath || st.hlInnerMatchInc ? 'text-emerald-400' : (st.hlCheckMap || st.hlOuterEntry || st.hlInnerEntry ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                  {!st.isSuccess && selectedOpId === 'prefixSumDfs' && st.mapState && (
                       <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in fade-in zoom-in duration-300">
                           <div className={`bg-white rounded-3xl border-2 ${st.hlUpdateMap || st.hlBacktrackMap ? 'border-amber-400 shadow-2xl ring-4 ring-amber-100 scale-105' : 'border-slate-300 shadow-xl'} p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-2 shrink-0">
                                   <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 ${st.hlUpdateMap || st.hlBacktrackMap ? 'text-amber-600' : 'text-slate-500'}`}><Database size={14}/> Prefix Map</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                   {Object.entries(st.mapState).map(([k, v]: [string, any]) => (
                                       <div key={`map-fs-${k}`} className="flex justify-between items-center bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-mono font-bold text-slate-700">
                                           <span className="text-violet-600 border-r border-slate-200 pr-3 w-12 text-right">{k}</span>
                                           <span className="text-emerald-600 pl-3 text-left flex-1"><span className="text-slate-400 font-normal mr-1">freq:</span>{String(v)}</span>
                                       </div>
                                   ))}
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
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="10, 5, -3..." />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target Sum</label>
                              <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="8" />
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
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom * 1.3})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(139,92,246,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-${themeColor}-500/10`}><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Valid Paths</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
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