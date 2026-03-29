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
  bfsIterative: {
    id: 'bfsIterative',
    title: '1. Level Order BFS (Queue)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(D)',
    theme: 'sky',
    code: `/**
 * Definition for a binary tree node.
 */
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int maxLevelSum(TreeNode root) {
        int maxSum = Integer.MIN_VALUE;
        int ansLevel = 0, currLevel = 1;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        
        while (!q.isEmpty()) {
            int levelSize = q.size();
            int currentSum = 0;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = q.poll();
                currentSum += node.val;
                
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            
            if (currentSum > maxSum) {
                maxSum = currentSum;
                ansLevel = currLevel;
            }
            currLevel++;
        }
        return ansLevel;
    }
}`,
    desc: "The most intuitive approach. We traverse the tree level by level using a Queue (BFS). By checking `queue.size()` at the start of each level loop, we know exactly how many nodes belong to the current depth. We loop through all of them, accumulating their values into `currentSum`. After processing the entire level, we check if `currentSum > maxSum`. If it is, we update our best level tracker. Finally, we increment the level counter and move to the next depth."
  },
  dfsRecursive: {
    id: 'dfsRecursive',
    title: '2. DFS Pre-order (Array Track)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'emerald',
    code: `/**
 * Definition for a binary tree node.
 */
public class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

class Solution {
    public int maxLevelSum(TreeNode root) {
        List<Integer> levelSums = new ArrayList<>();
        dfs(root, 0, levelSums);
        
        int maxSum = Integer.MIN_VALUE;
        int ansLevel = 0;
        
        for (int i = 0; i < levelSums.size(); i++) {
            if (levelSums.get(i) > maxSum) {
                maxSum = levelSums.get(i);
                ansLevel = i + 1;
            }
        }
        return ansLevel;
    }
    
    private void dfs(TreeNode node, int level, List<Integer> levelSums) {
        if (node == null) return;
        
        if (level == levelSums.size()) {
            levelSums.add(node.val);
        } else {
            levelSums.set(level, levelSums.get(level) + node.val);
        }
        
        dfs(node.left, level + 1, levelSums);
        dfs(node.right, level + 1, levelSums);
    }
}`,
    desc: "An alternative approach using DFS. We pass down a `level` index (0-based) and an ArrayList to track the total sum for each level. If we reach a level for the first time (`level == levelSums.size()`), we append the node's value. Otherwise, we add the node's value to the existing sum at that index. After traversing the entire tree, we simply iterate through the `levelSums` list to find the maximum sum and return its corresponding 1-based level index."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|maxLevelSum|dfs|TreeNode|Solution|root|null|this|left|right|curr|val|Queue|LinkedList|offer|poll|isEmpty|size|List|ArrayList|levelSums|add|set|get|levelSize|level|currentSum|maxSum|ansLevel|currLevel|i|node|Integer|MIN_VALUE)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isPointer = ['root', 'left', 'right', 'curr', 'val', 'queue', 'levelSums', 'levelSize', 'level', 'currentSum', 'maxSum', 'ansLevel', 'currLevel', 'i', 'node', 'MIN_VALUE'].includes(part);
            const isMapCall = ['maxLevelSum', 'dfs', 'offer', 'poll', 'isEmpty', 'size', 'add', 'set', 'get'].includes(part);
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

export default function MaxLevelSumVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bfsIterative');
  
  const [treeInput, setTreeInput] = useState('1, 7, 0, 7, -8, null, null');
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 7, 0, 7, -8, null, null]);

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
      setBaseTreeArr(parseTreeInput(treeInput, [1, 7, 0, 7, -8, null, null]));
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
          let py = n.gridY * 80 + 50; // 80px vertical drop per layer
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, depth: n.gridY, originalNode: n });
          
          if (n.left) {
              let clx = n.left.gridX * 60;
              let cly = n.left.gridY * 80 + 50;
              renderEdges.push({ source: n.id, target: n.left.id, sx: px, sy: py, tx: clx, ty: cly });
          }
          if (n.right) {
              let crx = n.right.gridX * 60;
              let cry = n.right.gridY * 80 + 50;
              renderEdges.push({ source: n.id, target: n.right.id, sx: px, sy: py, tx: crx, ty: cry });
          }
      });

      // Center the tree mathematically around 0, so calc(50% + Xpx) works perfectly
      if (renderNodes.length > 0) {
          let rootNode = renderNodes.find(n => n.id === root.id);
          let cx = rootNode ? rootNode.x : 0;
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

    let callStack: string[] = [];

    const cloneQ = (q: any[]) => q.map(n => ({...n}));

    if (selectedOpId === 'bfsIterative') {
        let q: any[] = [];
        let maxSum = Number.MIN_SAFE_INTEGER;
        let ansLevel = 0;
        let currLevel = 1;
        let levelSize = 0;
        let iterI = 0;
        let currentSum = 0;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                qState: cloneQ(q), levelSize, iterI, currentSum, maxSum, ansLevel, currLevel, ...st 
            } 
        });

        add("Function Call", `public int maxLevelSum(TreeNode root)`, 12, {});
        
        add("Init Tracking Vars", `int maxSum = Integer.MIN_VALUE;\nint ansLevel = 0, currLevel = 1;\nInitialize trackers for the maximum sum and its corresponding level.`, 13, { hlInitVars: true });
        
        add("Init Queue", `Queue<TreeNode> q = new LinkedList<>();\nCreate a queue to perform Level Order Traversal (BFS).`, 15, { hlInitQueue: true });
        
        if (treeData.root) {
            q.push(treeData.root);
            add("Enqueue Root", `q.offer(root);\nPush the root node (${treeData.root.val}) into the queue.`, 16, { hlEnqueueRoot: true, hlPush: treeData.root.id });
        }

        while (q.length > 0) {
            if (steps.length > 2500) break;

            add("While Loop", `while (!q.isEmpty())\nThe queue is not empty. Entering depth level ${currLevel}.`, 18, { hlWhile: true });
            
            levelSize = q.length;
            add("Level Size", `int levelSize = q.size();\nThere are ${levelSize} nodes currently in the queue for this level.`, 19, { hlLevelSize: true });
            
            currentSum = 0;
            add("Init Level Sum", `int currentSum = 0;\nReset the sum accumulator for level ${currLevel}.`, 20, { hlInitSum: true });
            
            for (iterI = 0; iterI < levelSize; iterI++) {
                add("For Loop Iteration", `for (int i = 0; i < levelSize; i++)\nProcessing node ${iterI + 1} of ${levelSize} for level ${currLevel}.`, 22, { hlForLoop: true });
                
                let curr = q.shift();
                if (!curr) break; // Guard

                add("Poll Node", `TreeNode node = q.poll();\nPop node ${curr.val} from the front of the queue.`, 23, { currNodeId: curr.id, hlPoll: true });

                let oldSum = currentSum;
                let safeVal = typeof curr.val === 'number' ? curr.val : 0; // Safeguard primitive
                currentSum += safeVal;
                add("Accumulate Sum", `currentSum += node.val;\nAdding ${safeVal} to currentSum. New sum: ${oldSum} + ${safeVal} = ${currentSum}.`, 24, { currNodeId: curr.id, hlAddSum: true });

                add("Check Left Child", `if (node.left != null) q.offer(node.left);`, 26, { currNodeId: curr.id, hlCheckLeft: true });
                if (curr.left) {
                    q.push(curr.left);
                    add("Enqueue Left", `q.offer(node.left);\nPushing left child ${curr.left.val} to the queue.`, 26, { currNodeId: curr.id, hlEnqueueLeft: true, hlPush: curr.left.id, qState: cloneQ(q) });
                }

                add("Check Right Child", `if (node.right != null) q.offer(node.right);`, 27, { currNodeId: curr.id, hlCheckRight: true });
                if (curr.right) {
                    q.push(curr.right);
                    add("Enqueue Right", `q.offer(node.right);\nPushing right child ${curr.right.val} to the queue.`, 27, { currNodeId: curr.id, hlEnqueueRight: true, hlPush: curr.right.id, qState: cloneQ(q) });
                }
            }
            iterI = 0; // Reset for visual clarity
            
            let isNewMax = currentSum > maxSum;
            add("Evaluate Level Sum", `if (currentSum > maxSum)\nLevel ${currLevel} processing complete. Total sum is ${currentSum}. Is it strictly greater than maxSum (${maxSum === Number.MIN_SAFE_INTEGER ? '-INF' : maxSum})? ${isNewMax ? 'YES' : 'NO'}.`, 30, { hlCheckMax: true, isNewMax });
            
            if (isNewMax) {
                maxSum = currentSum;
                ansLevel = currLevel;
                add("Update Max Trackers", `maxSum = currentSum;\nansLevel = currLevel;\nUpdated! New maxSum is ${maxSum} at level ${ansLevel}.`, 31, { hlUpdateMax: true });
            }

            currLevel++;
            add("Increment Level", `currLevel++;\nAdvancing to level ${currLevel} for the next loop iteration.`, 34, { hlIncLevel: true });
        }

        add("Return Final Result", `return ansLevel;\nQueue is empty, BFS is complete. Returning level ${ansLevel} (which had max sum ${maxSum === Number.MIN_SAFE_INTEGER ? '0' : maxSum}).`, 36, { isSuccess: true, finalAns: ansLevel, finalSum: maxSum });
    } 
    else if (selectedOpId === 'dfsRecursive') {
        let levelSums: number[] = [];
        let maxSum = Number.MIN_SAFE_INTEGER;
        let ansLevel = 0;

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                levelSums: [...levelSums], callStack: [...callStack], maxSum, ansLevel, ...st 
            } 
        });

        const dfs = (node: any | null, depth: number, parentId: number | null = null, side: string | null = null) => {
            if (steps.length > 2500) return;

            let callStr = `dfs(${node ? node.val : 'null'}, lvl=${depth})`;
            callStack.push(callStr);

            add("DFS Entry", `private void dfs(TreeNode node, int level, List<Integer> levelSums)\nEntering node ${node ? node.val : 'null'} at depth level ${depth}.`, 28, { currNodeId: node ? node.id : null, currDepth: depth, parentId, side });

            add("Base Case Check", `if (node == null) return;\nIs node null? ${node == null ? 'YES' : 'NO'}.`, 29, { currNodeId: node ? node.id : null, currDepth: depth, hlCheckNull: true, parentId, side });
            
            if (node == null) {
                callStack.pop();
                return;
            }

            let isFirstAtDepth = depth === levelSums.length;
            add("Check Depth vs List Size", `if (level == levelSums.size())\nIs level (${depth}) == list.size (${levelSums.length})? ${isFirstAtDepth ? 'YES. First node at this level.' : 'NO. Level array already exists.'}`, 31, { currNodeId: node.id, currDepth: depth, isFirstAtDepth, hlCheckDepth: true, parentId, side });

            let safeVal = typeof node.val === 'number' ? node.val : 0;

            if (isFirstAtDepth) {
                levelSums.push(safeVal);
                add("Add New Level Sum", `levelSums.add(node.val);\nAppending ${safeVal} as the initial sum for level ${depth}.`, 32, { currNodeId: node.id, currDepth: depth, isFirstAtDepth, hlAddResult: true, levelSums: [...levelSums], parentId, side });
            } else {
                let oldSum = typeof levelSums[depth] === 'number' ? levelSums[depth] : 0;
                levelSums[depth] = oldSum + safeVal;
                add("Update Existing Level Sum", `levelSums.set(level, levelSums.get(level) + node.val);\nUpdating level ${depth} sum: ${oldSum} + ${safeVal} = ${levelSums[depth]}.`, 34, { currNodeId: node.id, currDepth: depth, isFirstAtDepth, hlSetResult: true, levelSums: [...levelSums], parentId, side });
            }

            add("Recurse Left", `dfs(node.left, level + 1, levelSums);\nTraversing LEFT child. Passing depth ${depth + 1}.`, 37, { currNodeId: node.id, currDepth: depth, hlRecurseLeft: true, parentId, side });
            dfs(node.left, depth + 1, node.id, 'left');

            add("Recurse Right", `dfs(node.right, level + 1, levelSums);\nTraverse RIGHT child. Passing depth ${depth + 1}.`, 38, { currNodeId: node.id, currDepth: depth, hlRecurseRight: true, parentId, side });
            dfs(node.right, depth + 1, node.id, 'right');

            callStack.pop();
        };

        if (baseTreeArr.length > 0 && treeData.root) {
            add("Function Call", `public int maxLevelSum(TreeNode root)`, 12, {});
            add("Init List", `List<Integer> levelSums = new ArrayList<>();\nInitialize the empty list to hold sum per depth level.`, 13, { hlInitResult: true });
            add("Start DFS", `dfs(root, 0, levelSums);\nLaunch pre-order DFS starting at level 0.`, 14, { hlStartDFS: true });
            
            dfs(treeData.root, 0, null, null);

            add("DFS Complete. Init Trackers", `int maxSum = Integer.MIN_VALUE;\nint ansLevel = 0;\nTree traversal done. Preparing to loop through calculated levelSums to find the maximum.`, 16, { hlInitFindMax: true });

            for (let i = 0; i < levelSums.length; i++) {
                add("Iterate levelSums", `for (int i = 0; i < levelSums.size(); i++)\nChecking level index ${i} (1-based level ${i+1}). Current sum is ${levelSums[i]}.`, 19, { hlFindLoop: true, loopI: i });
                
                let isNewMax = levelSums[i] > maxSum;
                add("Check Max", `if (levelSums.get(i) > maxSum)\nIs ${levelSums[i]} > ${maxSum === Number.MIN_SAFE_INTEGER ? '-INF' : maxSum}? ${isNewMax ? 'YES' : 'NO'}`, 20, { hlFindCheck: true, loopI: i, isNewMax });

                if (isNewMax) {
                    maxSum = levelSums[i];
                    ansLevel = i + 1;
                    add("Update Max", `maxSum = levelSums.get(i);\nansLevel = i + 1;\nNew max found! Value: ${maxSum} at level ${ansLevel}.`, 21, { hlFindUpdate: true, loopI: i, maxSum, ansLevel });
                }
            }

            add("Return Final Result", `return ansLevel;\nAll levels evaluated. Returning ${ansLevel}.`, 25, { isSuccess: true, finalAns: ansLevel, finalSum: maxSum });
        } else {
             add("Return", `return ansLevel;\nTree is empty.`, 25, { isSuccess: true, finalAns: 0, finalSum: 0 });
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
        // Find the relative offset of the active line to the container to ensure precise scrolling
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
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckMax || st.hlUpdateMax ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active BFS State</span>
                  
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                      
                      <div className="flex flex-col items-center min-w-[80px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr level</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                              {st.currLevel !== undefined ? String(st.currLevel) : '?'}
                          </div>
                      </div>

                      <div className="w-px h-12 bg-slate-200 hidden md:block"></div>

                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlAddSum ? 'text-sky-500' : 'text-slate-400'}`}>Current Sum</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlAddSum ? 'bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-md' : 'bg-sky-50 border-sky-200 text-sky-800'}`}>
                              {st.currentSum !== undefined ? String(st.currentSum) : '0'}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className="text-slate-300"/>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlUpdateMax ? 'text-emerald-500' : 'text-slate-400'}`}>Max Sum (Lvl {st.ansLevel !== undefined ? String(st.ansLevel) : '?'})</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlUpdateMax ? 'bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {st.maxSum === Number.MIN_SAFE_INTEGER || st.maxSum === undefined ? '-INF' : String(st.maxSum)}
                          </div>
                      </div>
                      
                  </div>
              </div>
          );
      } else {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlFindUpdate ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active DFS / Search State</span>
                  
                  {st.currNodeId === null && st.hlCheckNull ? (
                      <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                           <div className="flex items-center gap-4 text-emerald-600 font-mono font-black text-xl bg-emerald-50 px-6 py-3 rounded-2xl border-2 border-emerald-300 shadow-md">
                               <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200">return</span>
                           </div>
                      </div>
                  ) : st.loopI !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Lvl index (i)</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl bg-slate-50 border-slate-300 text-slate-700`}>
                                  {String(st.loopI)}
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className="text-slate-300"/>

                          <div className="flex flex-col items-center min-w-[100px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlFindCheck ? 'text-emerald-500' : 'text-slate-400'}`}>levelSums[{String(st.loopI)}]</span>
                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl bg-emerald-50 border-emerald-300 text-emerald-800`}>
                                  {st.levelSums && st.levelSums[st.loopI] !== undefined ? String(st.levelSums[st.loopI]) : '?'}
                              </div>
                          </div>

                          <div className="flex flex-col items-center justify-center opacity-50 px-2">
                              <span className="text-2xl font-black">{'>'}</span>
                          </div>

                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlFindUpdate ? 'text-amber-500' : 'text-slate-400'}`}>maxSum (Lvl {st.ansLevel !== undefined ? String(st.ansLevel) : '?'})</span>
                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlFindUpdate ? 'bg-amber-100 border-amber-500 text-amber-800 shadow-md scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                  {st.maxSum === Number.MIN_SAFE_INTEGER || st.maxSum === undefined ? '-INF' : String(st.maxSum)}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex flex-col items-center">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr node</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                                  {currVal !== null ? String(currVal) : '?'}
                              </div>
                          </div>
                          
                          <ArrowRight size={24} className="text-slate-300"/>
                          
                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Target Level</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-500 bg-slate-50 border-slate-200 text-slate-600`}>
                                  {st.currDepth !== undefined ? `depth: ${String(st.currDepth)}` : '?'}
                              </div>
                          </div>
                          
                          {(st.hlAddResult || st.hlSetResult) && (
                              <>
                                  <ArrowRight size={24} className="text-emerald-300"/>
                                  <div className="flex flex-col items-center animate-in slide-in-from-right-4">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-600`}>Action</span>
                                      <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-emerald-50 border-emerald-600 text-white shadow-lg`}>
                                          {st.hlAddResult ? `add(${String(currVal)})` : `sum += ${String(currVal)}`}
                                      </div>
                                  </div>
                              </>
                          )}
                      </div>
                  )}
              </div>
          );
      }
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      // Container needs enough height to fit the whole tree
      const treeContainerHeight = Math.max(350, (treeData.maxDepth + 1) * 80 + 80);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Map State Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-center justify-center">
                  
                  {selectedOpId === 'bfsIterative' ? (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-sky-200`}>
                          <div className="flex justify-between items-center mb-2">
                              <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                  <LayersIcon size={14}/> Queue State
                              </span>
                              <div className="flex gap-4">
                                  <span className="text-[10px] font-bold font-mono text-slate-400">levelSize: {st.levelSize !== undefined ? String(st.levelSize) : '?'}</span>
                                  <span className="text-[10px] font-bold font-mono text-slate-400">i: {st.iterI !== undefined ? String(st.iterI) : '?'}</span>
                              </div>
                          </div>
                          <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                              <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                              {st.qState && st.qState.length > 0 ? st.qState.map((node: any, idx: number) => (
                                  <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                      <span className="font-black leading-none">{String(node.val)}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                              <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                          </div>
                      </div>
                  ) : (
                      <div className={`flex-1 flex flex-col items-center justify-center bg-white px-8 py-4 rounded-3xl border-4 shadow-xl transition-all duration-500 ${(st.hlAddResult || st.hlSetResult) ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Sigma size={14}/> Level Sums Array</span>
                          <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none max-w-full pb-2">
                              <span className="text-slate-300 font-mono text-2xl">[</span>
                              {st.levelSums && st.levelSums.length > 0 ? st.levelSums.map((val: number, idx: number) => (
                                  <div key={`res-${idx}`} className="flex flex-col items-center gap-1 shrink-0">
                                      <div className={`flex items-center justify-center w-12 h-10 border-2 rounded-xl font-mono text-base font-black ${idx === st.currDepth && (st.hlAddResult || st.hlSetResult) ? 'bg-emerald-500 text-white border-emerald-600 animate-in zoom-in shadow-lg' : (idx === st.loopI && (st.hlFindCheck || st.hlFindUpdate) ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300 shadow-md' : 'bg-emerald-50 border-emerald-300 text-emerald-800')}`}>
                                          {String(val)}
                                      </div>
                                      <span className="text-[8px] font-bold text-slate-400 uppercase font-mono">lvl {String(idx+1)}</span>
                                  </div>
                              )) : <span className="text-slate-400 italic text-sm font-mono px-2">Empty</span>}
                              <span className="text-slate-300 font-mono text-2xl">]</span>
                          </div>
                      </div>
                  )}

              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <g style={{ transform: 'translateX(50%)' }}>
                                  
                                  {/* Render Level Bands to visually group levels */}
                                  {[...Array(treeData.maxDepth + 1)].map((_, i) => {
                                      let isActiveLvl = (selectedOpId === 'bfsIterative' && st.currLevel === i + 1) || (selectedOpId === 'dfsRecursive' && (st.currDepth === i || st.loopI === i));
                                      let isAnsLvl = st.isSuccess && st.finalAns === i + 1;
                                      
                                      let bandColor = 'transparent';
                                      if (isAnsLvl) bandColor = 'rgba(245, 158, 11, 0.15)'; // amber
                                      else if (isActiveLvl) bandColor = selectedOpId === 'bfsIterative' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(16, 185, 129, 0.08)';

                                      return (
                                          <rect key={`band-${i}`} x="-2000" y={i * 80 + 20} width="4000" height="60" fill={bandColor} className="transition-colors duration-500" rx="10"/>
                                      )
                                  })}

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
                                      if (st.parentId === null || st.parentId === undefined) return null;
                                      const parent = treeData.nodes.find((n: any) => n.id === st.parentId);
                                      if (!parent) return null;
                                      
                                      let isLeftChild = st.side === 'left';
                                      let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                                      let py = parent.y + 80;
                                      return <line x1={parent.x} y1={parent.y + 20} x2={px} y2={py - 20} stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" opacity={0.6} className="animate-pulse transition-all duration-500" />
                                  })()}
                              </g>
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let inQueue = selectedOpId === 'bfsIterative' && st.qState && st.qState.some((n: any) => n.id === node.id);
                              let isLvlWinner = st.isSuccess && (node.depth + 1 === st.finalAns);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isActive) {
                                  bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30" : "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                              } else if (inQueue) {
                                  bgClass = "bg-sky-50 border-sky-400 text-sky-800 shadow-md z-20 opacity-100";
                              } else if (selectedOpId === 'dfsRecursive' && st.levelSums && st.levelSums.length > node.depth) {
                                  // Node has been visited in DFS
                                  bgClass = "bg-slate-100 border-slate-300 text-slate-600 opacity-90 z-20";
                              }
                              
                              if (st.isSuccess) {
                                  if (isLvlWinner) {
                                      bgClass = "bg-amber-400 border-amber-500 text-amber-950 shadow-lg z-40 scale-110 ring-4 ring-amber-200";
                                  } else {
                                      bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 z-10 scale-95 blur-[1px]";
                                  }
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {inQueue && !isActive && (
                                          <span className={`absolute -top-5 text-sky-400 font-black animate-pulse`}><ArrowDown size={14}/></span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{String(node.val)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for DFS Base Case */}
                          {selectedOpId === 'dfsRecursive' && st.currNodeId === null && st.hlCheckNull && (() => {
                              if (st.parentId === null || st.parentId === undefined) return null;
                              const parent = treeData.nodes.find((n: any) => n.id === st.parentId);
                              if (!parent) return null;
                              
                              let isLeftChild = st.side === 'left';
                              let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                              let py = parent.y + 80;
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Max Level Sum</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 1161</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Sigma size={28}/> Row Totals</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the <code>root</code> of a binary tree, the level of its root is 1, the level of its children is 2, and so on.</p>
                        <p className="font-bold mt-4">Return the smallest level <code>x</code> such that the sum of all the values of nodes at level <code>x</code> is maximal.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [1,7,0,7,-8,null,null]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Level 1 sum = 1.<br/>
                                Level 2 sum = 7 + 0 = 7.<br/>
                                Level 3 sum = 7 + -8 = -1.<br/>
                                The maximum sum is 7, which occurs at level 2.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                {/* Level Bands */}
                                <rect x="0" y="10" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="5"/>
                                <text x="10" y="35" fill="#64748b" fontSize="10" fontWeight="bold">L1</text>
                                
                                <rect x="0" y="80" width="220" height="40" fill="rgba(251,191,36,0.2)" rx="5"/>
                                <text x="10" y="105" fill="#fbbf24" fontSize="10" fontWeight="bold">L2</text>

                                <rect x="0" y="150" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="5"/>
                                <text x="10" y="175" fill="#64748b" fontSize="10" fontWeight="bold">L3</text>

                                <line x1="110" y1="30" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#475569" strokeWidth="2" />

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="60" cy="100" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                                <text x="60" y="104" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="160" cy="100" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                                <text x="160" y="104" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="35" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>

                                <circle cx="85" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="85" y="174" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">-8</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [989,null,10250,98693,-89388,null,null,null,-32127]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">2</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Level 1: 989<br/>
                                Level 2: 10250<br/>
                                Level 3: 98693 + -89388 = 9305<br/>
                                Level 4: -32127<br/>
                                Max sum is 10250 at level 2.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="260" viewBox="0 0 220 260">
                                {/* Level Bands */}
                                <rect x="0" y="10" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="5"/>
                                <rect x="0" y="70" width="220" height="40" fill="rgba(251,191,36,0.2)" rx="5"/>
                                <rect x="0" y="130" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="5"/>
                                <rect x="0" y="190" width="220" height="40" fill="rgba(255,255,255,0.05)" rx="5"/>

                                <line x1="70" y1="30" x2="150" y2="90" stroke="#475569" strokeWidth="2" />
                                <line x1="150" y1="90" x2="110" y2="150" stroke="#475569" strokeWidth="2" />
                                <line x1="150" y1="90" x2="190" y2="150" stroke="#475569" strokeWidth="2" />
                                <line x1="190" y1="150" x2="210" y2="210" stroke="#475569" strokeWidth="2" />

                                <rect x="50" y="20" width="40" height="20" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4"/>
                                <text x="70" y="34" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">989</text>
                                
                                <rect x="130" y="80" width="40" height="20" fill="#78350f" stroke="#fbbf24" strokeWidth="2" rx="4"/>
                                <text x="150" y="94" fill="#fbbf24" fontSize="10" textAnchor="middle" fontWeight="bold">10250</text>
                                
                                <rect x="90" y="140" width="40" height="20" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4"/>
                                <text x="110" y="154" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">98693</text>
                                
                                <rect x="170" y="140" width="40" height="20" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4"/>
                                <text x="190" y="154" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">-89388</text>

                                <rect x="190" y="200" width="40" height="20" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4"/>
                                <text x="210" y="214" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">-32127</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [1, 10^4].</li>
                            <li>-10^5 &le; Node.val &le; 10^5</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">We need to aggregate data based strictly on the <strong>depth level</strong> of each node. The problem specifically asks for the "level sum". Because levels correspond directly to horizontal slices of the tree, this naturally points to a Level Order Traversal.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>BFS (Iterative Queue):</strong> Highly intuitive. Traverse row by row. At the start of each row, read the queue size. Loop exactly that many times to pop all nodes on the current level, sum their values, and push their children. Keep track of the maximum sum seen.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>DFS (Recursive Array):</strong> Pass a 0-indexed <code>level</code> parameter down the recursion. Keep a global <code>ArrayList</code> of sums. Whenever you visit a node, simply add its value to <code>array[level]</code>. After exploring the whole tree, find the max in the array.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 7, 0, 7, -8, null, null" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-amber-400 flex items-center gap-3"><PartyPopper size={24}/> TRAVERSAL COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully found the max level sum.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdateMax || st.hlFindUpdate ? 'text-amber-400' : (st.hlAddSum || st.hlSetResult || st.hlAddResult ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-sky-500"/> 1. The BFS Approach (Level by Level)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">BFS uses a Queue to process nodes horizontally. The "trick" for this problem is reading <code>int levelSize = queue.size()</code> at the start of the while loop. Because we only pop exactly <code>levelSize</code> times, we perfectly segment the queue into rows.</p>
                        <p className="text-slate-600 leading-relaxed">Inside the loop, we simply add every polled node's value to a <code>currentSum</code>. When the loop finishes, we've completely accumulated the row! We check if it beats <code>maxSum</code>, update if so, increment <code>currLevel</code>, and seamlessly move to the next depth.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitPullRequest size={24} className="text-emerald-500"/> 2. The DFS Approach (Array Accumulator)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">DFS jumps vertically through the tree. We can't sum a level all at once. Instead, we carry a 0-indexed <code>level</code> parameter and a shared <code>ArrayList</code>.</p>
                        <p className="text-slate-600 leading-relaxed">If <code>level == levelSums.size()</code>, it means this is the first node we've *ever* seen at this depth. We <code>add()</code> its value to the list. For all subsequent nodes at this depth, we use <code>set(level, get(level) + node.val)</code> to incrementally update the running total. Once the entire DFS finishes, the array holds the completed level sums!</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> Both approaches visit every node exactly once. The operations per node (addition, queue poll, array indexing) are all O(1). Finding the max in the DFS array at the end takes O(H), but since H &le; N, the total time remains O(N).</li>
                            <li><strong>Space Complexity (BFS): O(D).</strong> The queue holds up to $D$ nodes, where $D$ is the maximum width of the tree. In the worst case (perfect tree), the bottom level holds $N/2$ nodes, resulting in $O(N)$ space.</li>
                            <li><strong>Space Complexity (DFS): O(H).</strong> The recursion stack uses $O(H)$ space, and the `levelSums` array also uses exactly $O(H)$ space. In a skewed tree, this is $O(N)$. In a balanced tree, it is $O(\log N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a fundamental tree aggregation problem. Interviewers expect you to quickly write the BFS solution bug-free, and may ask for the DFS approach as a follow-up to test your array tracking skills."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Which approach is better, BFS or DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Both are $O(N)$ time, but their space complexity depends heavily on the tree's shape.</p>
                            <p>BFS uses O(Width) space, while DFS uses O(Height) space. If the tree is extremely wide and perfectly balanced, DFS is technically more space-efficient ($O(\log N)$ stack vs $O(N/2)$ queue). If the tree is completely skewed (a straight line), BFS is more space-efficient ($O(1)$ queue vs $O(N)$ stack). However, for 'Level Sum' problems, BFS is the industry standard because it evaluates levels sequentially and logically."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why do we initialize <code>maxSum = Integer.MIN_VALUE</code> instead of 0?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To safely handle trees filled entirely with negative numbers.</p>
                            <p>If the tree's levels sum to `-100`, `-50`, and `-10`, the maximum sum is `-10`. If we had initialized `maxSum = 0`, our logic `if (currentSum &gt; maxSum)` would fail for every level, and we'd return a mathematically incorrect result. `Integer.MIN_VALUE` ensures that the very first level evaluated will absolutely overwrite the tracker."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If there are multiple levels with the SAME maximum sum, which one should we return?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The problem requires returning the <em>smallest</em> level <code>x</code>.</p>
                            <p>In our BFS approach, we process levels from smallest (root=1) to largest. By using the strictly greater than operator <code>if (currentSum &gt; maxSum)</code>, we guarantee that if a deeper level has a tie (e.g., <code>currentSum == maxSum</code>), it will NOT overwrite the <code>ansLevel</code>. The variable naturally preserves the topmost (smallest) level index that achieved that sum."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlUpdateMax || st.hlFindUpdate ? 'text-amber-400' : (st.hlAddSum || st.hlSetResult || st.hlAddResult ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-emerald-950 border-emerald-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                              {String(frameStr)}
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
                                        <span className="text-xs font-bold font-mono text-slate-500">levelSize: {st.levelSize !== undefined ? String(st.levelSize) : '?'}</span>
                                        <span className="text-xs font-bold font-mono text-slate-500">i: {st.iterI !== undefined ? String(st.iterI) : '?'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                                    <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                    {st.qState && st.qState.length > 0 ? st.qState.map((node: any, idx: number) => (
                                        <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-4 py-2 font-mono text-base ${idx === 0 ? 'bg-sky-100 text-sky-800 border-sky-500 ring-2 ring-sky-200' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                            <span className="font-black leading-none">{String(node.val)}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array (Level Order)</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, 7, 0..." />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-amber-500 shadow-[0_0_150px_rgba(245,158,11,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-amber-500`}></div>
                                
                                <div className={`w-24 h-24 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-amber-500/10`}><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-amber-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Max Level Found</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        Level {st.finalAns !== undefined ? String(st.finalAns) : '0'} <span className="text-2xl text-slate-400">(sum: {st.finalSum !== undefined && !isNaN(st.finalSum) ? String(st.finalSum) : '0'})</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-amber-600 hover:bg-amber-700 shadow-amber-900/20`}>
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