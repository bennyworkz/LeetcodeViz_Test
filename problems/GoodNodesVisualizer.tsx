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
  dfsRecursion: {
    id: 'dfsRecursion',
    title: '1. DFS (Recursive)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'sky',
    code: `class Solution {
    public int goodNodes(TreeNode root) {
        return dfs(root, root.val);
    }
    
    private int dfs(TreeNode node, int maxSoFar) {
        if (node == null) return 0;
        
        int res = 0;
        if (node.val >= maxSoFar) {
            res = 1;
        }
        
        int newMax = Math.max(maxSoFar, node.val);
        res += dfs(node.left, newMax);
        res += dfs(node.right, newMax);
        
        return res;
    }
}`,
    desc: "The optimal approach is a Pre-order Depth-First Search (DFS). We pass the 'maximum value seen so far' down the recursive call stack. At each node, we check if its value is >= the max value. If so, it's 'Good' (res = 1). We then update the max value and recursively check children."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. BFS (Queue Iterative)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(W)',
    theme: 'teal',
    code: `class Solution {
    public int goodNodes(TreeNode root) {
        if (root == null) return 0;
        int goodCount = 0;
        Queue<Pair<TreeNode, Integer>> q = new LinkedList<>();
        q.offer(new Pair<>(root, root.val));
        while (!q.isEmpty()) {
            Pair<TreeNode, Integer> p = q.poll();
            TreeNode node = p.getKey();
            int maxSoFar = p.getValue();
            if (node.val >= maxSoFar) {
                goodCount++;
            }
            int newMax = Math.max(maxSoFar, node.val);
            if (node.left != null) q.offer(new Pair<>(node.left, newMax));
            if (node.right != null) q.offer(new Pair<>(node.right, newMax));
        }
        return goodCount;
    }
}`,
    desc: "Breadth-First Search sweeps the tree level by level. Because state must follow specific paths, we cannot just push nodes. We must push a Pair containing the node AND the max value seen on its specific path into the Queue."
  },
  dfsIterative: {
    id: 'dfsIterative',
    title: '3. DFS (Stack Iterative)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'amber',
    code: `class Solution {
    public int goodNodes(TreeNode root) {
        if (root == null) return 0;
        int goodCount = 0;
        Stack<Pair<TreeNode, Integer>> stack = new Stack<>();
        stack.push(new Pair<>(root, root.val));
        while (!stack.isEmpty()) {
            Pair<TreeNode, Integer> p = stack.pop();
            TreeNode node = p.getKey();
            int maxSoFar = p.getValue();
            if (node.val >= maxSoFar) {
                goodCount++;
            }
            int newMax = Math.max(maxSoFar, node.val);
            if (node.right != null) stack.push(new Pair<>(node.right, newMax));
            if (node.left != null) stack.push(new Pair<>(node.left, newMax));
        }
        return goodCount;
    }
}`,
    desc: "Iterative DFS uses a Stack on the heap to avoid call stack limits. We push Pairs of (Node, maxSoFar) to preserve path history. Notice we push the right child first so the left child pops first, mimicking standard pre-order recursion."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|goodNodes|dfs|TreeNode|Solution|root|null|this|left|right|maxSoFar|res|newMax|Math|max|goodCount|Queue|LinkedList|offer|poll|getKey|getValue|Stack|push|pop|Pair|Integer|isEmpty)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'null', 'this', 'while'].includes(part);
            const isObject = ['TreeNode', 'Solution', 'Math', 'Queue', 'LinkedList', 'Stack', 'Pair', 'Integer'].includes(part);
            const isPointer = ['root', 'left', 'right', 'maxSoFar', 'res', 'newMax', 'node', 'val', 'q', 'p', 'stack'].includes(part);
            const isMapCall = ['goodNodes', 'dfs', 'max', 'offer', 'poll', 'getKey', 'getValue', 'push', 'pop', 'isEmpty'].includes(part);
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

export default function GoodNodesVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursion');
  
  const [treeInput, setTreeInput] = useState('3, 1, 4, 3, null, 1, 5');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([3, 1, 4, 3, null, 1, 5]);

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
      if (parsedTree.length > 31) parsedTree = parsedTree.slice(0, 31);
      while(parsedTree.length > 0 && parsedTree[parsedTree.length - 1] === null) parsedTree.pop();
      return parsedTree;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setBaseTreeArr(parseTreeInput(treeInput, [3, 1, 4, 3, null, 1, 5]));
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
      
      const paddingX = 5;
      const usableWidth = 90;
      const totalWidthUnits = Math.max(1, xCounter - 1);
      
      nodesObj.forEach(n => {
          let px = paddingX + (n.gridX / totalWidthUnits) * usableWidth;
          let py = n.gridY * 60 + 30; // Tighter vertical spacing
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, originalNode: n });
          
          if (n.left) {
              let clx = paddingX + (n.left.gridX / totalWidthUnits) * usableWidth;
              let cly = n.left.gridY * 60 + 30;
              renderEdges.push({ source: n.id, target: n.left.id, sx: px, sy: py, tx: clx, ty: cly });
          }
          if (n.right) {
              let crx = paddingX + (n.right.gridX / totalWidthUnits) * usableWidth;
              let cry = n.right.gridY * 60 + 30;
              renderEdges.push({ source: n.id, target: n.right.id, sx: px, sy: py, tx: crx, ty: cry });
          }
      });

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth };
  };

  const treeData = useMemo(() => buildTreeGeometry(baseTreeArr), [baseTreeArr]);

  // Generate algorithm traces with strictly exact line numbers
  const trace = useMemo(() => {
    const steps: any[] = [];

    let goodNodes = new Set<number>();
    let badNodes = new Set<number>();
    
    // Universal state properties added to every step
    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            goodNodes: new Set(goodNodes),
            badNodes: new Set(badNodes),
            ...st 
        } 
    });

    if (selectedOpId === 'dfsRecursion') {
        let callStack: string[] = [];
        let goodCount = 0;

        const dfs = (node: any | null, maxSoFar: number, path: number[]) => {
            if (steps.length > 2000) return 0; // Guard
            
            let callStr = `dfs(${node ? node.val : 'null'}, ${maxSoFar})`;
            callStack.push(callStr);

            add("DFS Entry", `Entering node ${node ? node.val : 'null'} with maxSoFar = ${maxSoFar}.`, 6, { currNodeId: node ? node.id : null, maxSoFar, path: [...path], callStack: [...callStack], goodCount });

            add("Null Check", `if (node == null) return 0;\nIs node null? (${node == null ? 'Yes' : 'No'})`, 7, { currNodeId: node ? node.id : null, maxSoFar, hlCheckNull: true, path: [...path], callStack: [...callStack], goodCount });

            if (node == null) {
                callStack.pop();
                return 0;
            }

            add("Init Result", `int res = 0;\nInitialize good node counter for this subtree.`, 9, { currNodeId: node.id, maxSoFar, path: [...path], callStack: [...callStack], goodCount });

            let isGood = node.val >= maxSoFar;
            add("Check Good Node", `if (node.val >= maxSoFar)\nIs ${node.val} >= ${maxSoFar}? (${isGood ? 'Yes, it is Good!' : 'No, it is Bad.'})`, 10, { currNodeId: node.id, maxSoFar, isGood, path: [...path], callStack: [...callStack], goodCount });

            let res = 0;
            if (isGood) {
                res = 1;
                goodNodes.add(node.id);
                goodCount++;
                add("Mark as Good", `res = 1;\nNode ${node.val} meets the condition. Setting res to 1.`, 11, { currNodeId: node.id, maxSoFar, isGood, hlIsGood: true, path: [...path], callStack: [...callStack], goodCount });
            } else {
                badNodes.add(node.id);
            }

            let newMax = Math.max(maxSoFar, node.val);
            add("Update Max So Far", `int newMax = Math.max(maxSoFar, node.val);\nUpdating the max path value: max(${maxSoFar}, ${node.val}) = ${newMax}.`, 14, { currNodeId: node.id, maxSoFar, newMax, hlNewMax: true, path: [...path], callStack: [...callStack], goodCount });

            let nextPath = [...path, node.id];

            add("Recurse Left", `res += dfs(node.left, newMax);\nTraversing left child passing down newMax = ${newMax}.`, 15, { currNodeId: node.id, maxSoFar, newMax, hlRecurseLeft: true, path: [...path], callStack: [...callStack], goodCount });
            res += dfs(node.left, newMax, nextPath);

            add("Recurse Right", `res += dfs(node.right, newMax);\nTraversing right child passing down newMax = ${newMax}.`, 16, { currNodeId: node.id, maxSoFar, newMax, hlRecurseRight: true, path: [...path], callStack: [...callStack], goodCount });
            res += dfs(node.right, newMax, nextPath);

            add("Return Subtree Result", `return res;\nFinished subtree for node ${node.val}. Returning ${res} good nodes upwards.`, 18, { currNodeId: node.id, maxSoFar, newMax, res, path: [...path], callStack: [...callStack], goodCount });

            callStack.pop();
            return res;
        };

        if (baseTreeArr.length > 0 && treeData.root) {
            add("Function Call", `public int goodNodes(TreeNode root)`, 2, { callStack: [], goodCount: 0 });
            add("Initial DFS Call", `return dfs(root, root.val);\nStarting search with root value ${treeData.root.val} as initial maxSoFar.`, 3, { callStack: [], goodCount: 0 });
            
            let finalAns = dfs(treeData.root, treeData.root.val, []);
            
            add("Execution Complete", `Algorithm finished. Total good nodes found: ${finalAns}.`, 3, { isSuccess: true, finalAns, path: [], callStack: [], goodCount });
        }
    } 
    else if (selectedOpId === 'bfsIterative') {
        if (baseTreeArr.length > 0 && treeData.root) {
            let goodCount = 0;
            let q: any[] = [];
            
            add("Function Call", `public int goodNodes(TreeNode root)`, 2, { qState: [...q], goodCount });
            add("Null Check", `if (root == null) return 0;`, 3, { hlCheckNull: true, qState: [...q], goodCount });
            
            add("Init Count", `int goodCount = 0;`, 4, { qState: [...q], goodCount });
            
            add("Init Queue", `Queue<Pair<TreeNode, Integer>> q = new LinkedList<>();`, 5, { qState: [...q], goodCount });
            
            q.push({ node: treeData.root, maxSoFar: treeData.root.val });
            add("Enqueue Root", `q.offer(new Pair<>(root, root.val));\nPushing root ${treeData.root.val} with max ${treeData.root.val}.`, 6, { hlPush: treeData.root.id, qState: [...q], goodCount });

            while (q.length > 0) {
                if (steps.length > 2000) break;
                add("Loop Condition", `while (!q.isEmpty())\nQueue has nodes, proceeding...`, 7, { qState: [...q], goodCount });
                
                let p = q.shift()!;
                let node = p.node;
                let maxSoFar = p.maxSoFar;
                
                add("Dequeue Pair", `Pair<TreeNode, Integer> p = q.poll();\nPopping pair from queue.`, 8, { qState: [...q], goodCount, currNodeId: node.id });
                add("Extract Node", `TreeNode node = p.getKey();\nCurrent node is ${node.val}.`, 9, { qState: [...q], goodCount, currNodeId: node.id });
                add("Extract Max", `int maxSoFar = p.getValue();\nMax path value for this node is ${maxSoFar}.`, 10, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar });

                let isGood = node.val >= maxSoFar;
                add("Check Good", `if (node.val >= maxSoFar)\nIs ${node.val} >= ${maxSoFar}? (${isGood ? 'YES' : 'NO'})`, 11, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar, isGood });
                
                if (isGood) {
                    goodCount++;
                    goodNodes.add(node.id);
                    add("Increment Count", `goodCount++;\nFound a good node! Incrementing count to ${goodCount}.`, 12, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar, isGood, hlIsGood: true });
                } else {
                    badNodes.add(node.id);
                }

                let newMax = Math.max(maxSoFar, node.val);
                add("Update Max", `int newMax = Math.max(maxSoFar, node.val);\nNew max path value = ${newMax}.`, 14, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar, newMax, hlNewMax: true });

                if (node.left) {
                    q.push({ node: node.left, maxSoFar: newMax });
                    add("Enqueue Left", `if (node.left != null) q.offer(new Pair<>(node.left, newMax));\nEnqueuing left child ${node.left.val} with newMax ${newMax}.`, 15, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar, newMax, hlPush: node.left.id });
                }
                
                if (node.right) {
                    q.push({ node: node.right, maxSoFar: newMax });
                    add("Enqueue Right", `if (node.right != null) q.offer(new Pair<>(node.right, newMax));\nEnqueuing right child ${node.right.val} with newMax ${newMax}.`, 16, { qState: [...q], goodCount, currNodeId: node.id, maxSoFar, newMax, hlPush: node.right.id });
                }
            }
            
            add("Return Result", `return goodCount;\nQueue is empty. Returning final count.`, 18, { qState: [], goodCount, isSuccess: true, finalAns: goodCount });
        }
    }
    else if (selectedOpId === 'dfsIterative') {
        if (baseTreeArr.length > 0 && treeData.root) {
            let goodCount = 0;
            let stack: any[] = [];
            
            add("Function Call", `public int goodNodes(TreeNode root)`, 2, { stackState: [...stack], goodCount });
            add("Null Check", `if (root == null) return 0;`, 3, { hlCheckNull: true, stackState: [...stack], goodCount });
            
            add("Init Count", `int goodCount = 0;`, 4, { stackState: [...stack], goodCount });
            
            add("Init Stack", `Stack<Pair<TreeNode, Integer>> stack = new Stack<>();`, 5, { stackState: [...stack], goodCount });
            
            stack.push({ node: treeData.root, maxSoFar: treeData.root.val });
            add("Push Root", `stack.push(new Pair<>(root, root.val));\nPushing root ${treeData.root.val} with max ${treeData.root.val}.`, 6, { hlPush: treeData.root.id, stackState: [...stack], goodCount });

            while (stack.length > 0) {
                if (steps.length > 2000) break;
                add("Loop Condition", `while (!stack.isEmpty())\nStack has nodes, proceeding...`, 7, { stackState: [...stack], goodCount });
                
                let p = stack.pop()!;
                let node = p.node;
                let maxSoFar = p.maxSoFar;
                
                add("Pop Pair", `Pair<TreeNode, Integer> p = stack.pop();\nPopping pair from stack.`, 8, { stackState: [...stack], goodCount, currNodeId: node.id });
                add("Extract Node", `TreeNode node = p.getKey();\nCurrent node is ${node.val}.`, 9, { stackState: [...stack], goodCount, currNodeId: node.id });
                add("Extract Max", `int maxSoFar = p.getValue();\nMax path value for this node is ${maxSoFar}.`, 10, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar });

                let isGood = node.val >= maxSoFar;
                add("Check Good", `if (node.val >= maxSoFar)\nIs ${node.val} >= ${maxSoFar}? (${isGood ? 'YES' : 'NO'})`, 11, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar, isGood });
                
                if (isGood) {
                    goodCount++;
                    goodNodes.add(node.id);
                    add("Increment Count", `goodCount++;\nFound a good node! Incrementing count to ${goodCount}.`, 12, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar, isGood, hlIsGood: true });
                } else {
                    badNodes.add(node.id);
                }

                let newMax = Math.max(maxSoFar, node.val);
                add("Update Max", `int newMax = Math.max(maxSoFar, node.val);\nNew max path value = ${newMax}.`, 14, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar, newMax, hlNewMax: true });

                if (node.right) {
                    stack.push({ node: node.right, maxSoFar: newMax });
                    add("Push Right", `if (node.right != null) stack.push(new Pair<>(node.right, newMax));\nPushing right child ${node.right.val} first (so it processes after left).`, 15, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar, newMax, hlPush: node.right.id });
                }
                
                if (node.left) {
                    stack.push({ node: node.left, maxSoFar: newMax });
                    add("Push Left", `if (node.left != null) stack.push(new Pair<>(node.left, newMax));\nPushing left child ${node.left.val} (so it processes next).`, 16, { stackState: [...stack], goodCount, currNodeId: node.id, maxSoFar, newMax, hlPush: node.left.id });
                }
            }
            
            add("Return Result", `return goodCount;\nStack is empty. Returning final count.`, 18, { stackState: [], goodCount, isSuccess: true, finalAns: goodCount });
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

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCheckGood ? (st.isGood ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100') : (st.hlNewMax ? 'border-amber-400 ring-4 ring-amber-100' : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Path Evaluation</span>
              
              {st.currNodeId === null && st.hlCheckNull ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                       <div className="flex items-center gap-4 text-sky-600 font-mono font-black text-xl bg-sky-50 px-6 py-3 rounded-2xl border-2 border-sky-300 shadow-md">
                           <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-200">return 0</span>
                       </div>
                  </div>
              ) : st.currNodeId !== null && st.maxSoFar !== undefined ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2">
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>node.val</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-800`}>
                              {currVal !== null ? currVal : '?'}
                          </div>
                      </div>
                      
                      <span className="text-2xl font-black text-slate-400">&ge;</span>
                      
                      <div className="flex flex-col items-center">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>maxSoFar</span>
                          <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                              {st.maxSoFar !== undefined ? st.maxSoFar : '?'}
                          </div>
                      </div>
                      
                      <ArrowRight size={24} className="text-slate-300"/>
                      
                      <div className="flex flex-col items-center min-w-[120px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlCheckGood ? 'text-sky-500' : 'text-slate-400'}`}>Status</span>
                          <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${(st.hlCheckGood || st.hlIsGood) && st.isGood !== undefined ? (st.isGood ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg' : 'bg-rose-100 border-rose-400 text-rose-800 scale-110 shadow-lg') : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                              {st.isGood === undefined ? '?' : (st.isGood ? 'GOOD' : 'BAD')}
                          </div>
                      </div>

                      {st.hlNewMax && (
                          <div className="flex flex-col items-center border-l-2 border-slate-200 pl-4 md:pl-8 ml-2 animate-in slide-in-from-right-8 duration-300">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-600`}>Update next max</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-amber-50 border-amber-400 text-amber-800 shadow-md`}>
                                  Math.max({st.maxSoFar}, {currVal}) = {st.newMax}
                              </div>
                          </div>
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

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      const treeContainerHeight = Math.max(350, (treeData.maxDepth + 1) * 60 + 80);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Path Condition Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Middle: Dynamic Structure Container & Counters */}
              <div className="flex w-full max-w-6xl gap-6 px-4 pointer-events-auto items-center justify-center">
                  {/* Left side: Queue or Stack display if iterative */}
                  {selectedOpId !== 'dfsRecursion' && (
                      <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 border-${themeColor}-200`}>
                          <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 mb-2 flex items-center gap-2`}>
                              <LayersIcon size={14}/> {selectedOpId === 'bfsIterative' ? 'Queue State' : 'Stack State'}
                          </span>
                          <div className="flex gap-2 min-h-[50px] items-center overflow-x-auto scrollbar-none">
                              {selectedOpId === 'bfsIterative' ? (
                                  <>
                                      <span className="text-slate-300 text-xs font-black uppercase shrink-0">OUT</span>
                                      {st.qState && st.qState.length > 0 ? st.qState.map((pair: any, idx: number) => (
                                          <div key={`q-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-2 py-1 font-mono text-sm ${idx === 0 ? 'bg-teal-100 text-teal-800 border-teal-500 ring-2 ring-teal-200' : 'bg-teal-50 border-teal-200 text-teal-700'}`}>
                                              <span className="font-black text-lg leading-none">{pair.node.val}</span>
                                              <span className="text-[8px] border-t border-teal-300 pt-0.5 mt-0.5 opacity-80 uppercase tracking-widest">m={pair.maxSoFar}</span>
                                          </div>
                                      )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                                      <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">IN</span>
                                  </>
                              ) : (
                                  <>
                                      <span className="text-slate-300 text-xs font-black uppercase shrink-0">BOT</span>
                                      {st.stackState && st.stackState.length > 0 ? st.stackState.map((pair: any, idx: number) => (
                                          <div key={`s-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-2 py-1 font-mono text-sm ${idx === st.stackState.length - 1 ? 'bg-amber-100 text-amber-800 border-amber-500 ring-2 ring-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                              <span className="font-black text-lg leading-none">{pair.node.val}</span>
                                              <span className="text-[8px] border-t border-amber-300 pt-0.5 mt-0.5 opacity-80 uppercase tracking-widest">m={pair.maxSoFar}</span>
                                          </div>
                                      )) : <span className="text-slate-400 italic text-sm font-mono ml-2">Empty</span>}
                                      <span className="text-slate-300 text-xs font-black uppercase shrink-0 ml-auto pl-2">TOP</span>
                                  </>
                              )}
                          </div>
                      </div>
                  )}

                  {/* Right side: Count Display */}
                  <div className={`flex flex-col items-center justify-center bg-white px-8 py-4 rounded-3xl border-4 shadow-xl transition-all duration-500 ${st.hlIsGood ? 'border-emerald-400 ring-4 ring-emerald-100 scale-110' : 'border-slate-200'} ${selectedOpId === 'dfsRecursion' ? 'w-64' : 'w-48'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-2"><Target size={14}/> Total Good Nodes</span>
                      <div className={`font-mono font-black text-5xl transition-colors duration-300 ${st.hlIsGood ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {st.goodCount !== undefined ? st.goodCount : 0}
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

                                  if (selectedOpId === 'dfsRecursion') {
                                      if (st.path && st.path.includes(edge.target)) isPath = true;
                                      if (st.currNodeId === edge.target) isActive = true;
                                      if (st.currNodeId === edge.source && ((st.hlRecurseLeft) || (st.hlRecurseRight))) isActive = true;
                                  } else {
                                      if (st.hlPush === edge.target && st.currNodeId === edge.source) isActive = true;
                                  }
                                  
                                  let strokeColor = '#e2e8f0'; // slate-200
                                  let strokeWidth = 2;
                                  let opacity = 0.5;

                                  if (isPath) {
                                      strokeColor = '#0ea5e9'; // sky-500
                                      strokeWidth = 4;
                                      opacity = 0.9;
                                  }
                                  if (isActive) {
                                      strokeColor = themeColor === 'teal' ? '#14b8a6' : (themeColor === 'amber' ? '#f59e0b' : '#38bdf8');
                                      strokeWidth = 5;
                                      opacity = 1;
                                  }

                                  return <line key={`edge-${i}`} x1={`${edge.sx}%`} y1={edge.sy + 16} x2={`${edge.tx}%`} y2={edge.ty - 16} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}

                              {/* Draw Virtual Null Edge */}
                              {selectedOpId === 'dfsRecursion' && st.currNodeId === null && st.path && st.path.length > 0 && (() => {
                                  const parentId = st.path[st.path.length - 1];
                                  const parent = treeData.nodes.find((n: any) => n.id === parentId);
                                  if (!parent) return null;
                                  let sx = parent.x;
                                  let sy = parent.y + 20;
                                  let tx = st.hlRecurseLeft ? parent.x - 10 : parent.x + 10;
                                  let ty = parent.y + 60 - 20;
                                  return <line x1={`${sx}%`} y1={sy} x2={`${tx}%`} y2={ty} stroke="#38bdf8" strokeWidth="4" strokeDasharray="4 4" opacity={0.8} className="animate-pulse transition-all duration-500" />
                              })()}
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isPath = selectedOpId === 'dfsRecursion' && st.path && st.path.includes(node.id);
                              let isGood = st.goodNodes && st.goodNodes.has(node.id);
                              let isBad = st.badNodes && st.badNodes.has(node.id);
                              let inContainer = false;

                              if (selectedOpId === 'bfsIterative') inContainer = st.qState && st.qState.some((p: any) => p.node.id === node.id);
                              else if (selectedOpId === 'dfsIterative') inContainer = st.stackState && st.stackState.some((p: any) => p.node.id === node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isActive) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 ring-4 ring-${themeColor}-200 shadow-xl text-${themeColor}-900 scale-125 z-30`;
                              } else if (inContainer) {
                                  bgClass = `bg-white border-${themeColor}-400 ring-4 ring-${themeColor}-100 text-${themeColor}-800 z-20 scale-110 shadow-md`;
                              } else if (isGood) {
                                  bgClass = "bg-emerald-100 border-emerald-500 text-emerald-800 shadow-md z-20 opacity-100";
                              } else if (isBad) {
                                  bgClass = "bg-rose-50 border-rose-300 text-rose-700 shadow-sm z-20 opacity-80 border-dashed";
                              } else if (isPath) {
                                  bgClass = "bg-sky-50 border-sky-400 text-sky-800 shadow-md z-20 opacity-100";
                              }
                              
                              if (st.isSuccess) {
                                  if (isGood) bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-xl scale-110 z-30 ring-4 ring-emerald-200";
                                  else bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 z-10 scale-95";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black text-${themeColor}-600 font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded border border-${themeColor}-200 shadow-sm animate-bounce`}>
                                              curr
                                          </span>
                                      )}
                                      {inContainer && !isActive && (
                                          <span className={`absolute -top-5 text-${themeColor}-500 font-black animate-pulse`}><ArrowDown size={14}/></span>
                                      )}
                                      <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{node.val}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Visualizing Base Case */}
                          {selectedOpId === 'dfsRecursion' && st.currNodeId === null && st.path && st.path.length > 0 && (
                              <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                  left: `${(treeData.nodes.find((n: any) => n.id === st.path[st.path.length-1])?.x || 50) + (st.hlRecurseLeft ? -10 : 10)}%`, 
                                  top: `${(treeData.nodes.find((n: any) => n.id === st.path[st.path.length-1])?.y || 0) + 60}px`, 
                                  transform: 'translate(-50%, -50%)' 
                              }}>
                                  <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-sky-400 bg-sky-100 rounded-full shadow-lg ring-4 ring-sky-200">
                                      <span className="font-mono font-black text-[10px] text-sky-800">null</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Count Good Nodes</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 1448</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Path Maximums</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a binary tree <code>root</code>, a node <em>X</em> in the tree is named <strong>good</strong> if in the path from root to <em>X</em> there are no nodes with a value greater than <em>X</em>.</p>
                        <p className="font-bold mt-4">Return the number of good nodes in the binary tree.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [3,1,4,3,null,1,5]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">4</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                <span className="text-emerald-400 font-bold">Green nodes</span> are good. <span className="text-rose-400 font-bold">Red nodes</span> are bad.<br/><br/>
                                • Root Node (3) is always a good node.<br/>
                                • Node 4 -&gt; (3,4) is the maximum value in the path.<br/>
                                • Node 5 -&gt; (3,4,5) is the maximum value in the path.<br/>
                                • Node 3 -&gt; (3,1,3) is the maximum value in the path.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="150" height="140" viewBox="0 0 150 140">
                                <line x1="75" y1="20" x2="35" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="75" y1="20" x2="115" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="35" y1="70" x2="15" y2="120" stroke="#475569" strokeWidth="2" />
                                <line x1="115" y1="70" x2="95" y2="120" stroke="#475569" strokeWidth="2" />
                                <line x1="115" y1="70" x2="135" y2="120" stroke="#475569" strokeWidth="2" />
                                
                                <circle cx="75" cy="20" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="75" y="24" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="35" cy="70" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                                <text x="35" y="74" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="115" cy="70" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="115" y="74" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="15" cy="120" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="15" y="124" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="95" cy="120" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                                <text x="95" y="124" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>

                                <circle cx="135" cy="120" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="135" y="124" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [3,3,null,4,2]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Node 2 -&gt; (3, 3, 2) is not good, because "3" is higher than it.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="110" height="140" viewBox="0 0 110 140">
                                <line x1="55" y1="20" x2="35" y2="70" stroke="#475569" strokeWidth="2" />
                                <line x1="35" y1="70" x2="15" y2="120" stroke="#475569" strokeWidth="2" />
                                <line x1="35" y1="70" x2="75" y2="120" stroke="#475569" strokeWidth="2" />
                                
                                <circle cx="55" cy="20" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="55" y="24" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="35" cy="70" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="35" y="74" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="15" cy="120" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="15" y="124" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="75" cy="120" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                                <text x="75" y="124" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">1</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Root is considered to be good.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="50" height="40" viewBox="0 0 50 40">
                                <circle cx="25" cy="20" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="25" y="24" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the binary tree is in the range [1, 10^5].</li>
                            <li>Each node's value is between [-10^4, 10^4].</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">To determine if a node is "good", we must know the absolute maximum value that exists strictly along the path from the root down to that specific node. We need an efficient way to check this condition without re-calculating the path for every single node.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>DFS Recursive:</strong> As we traverse the tree, simply pass down a <code>maxSoFar</code> integer to the children recursive calls. Increment our count if <code>node.val &gt;= maxSoFar</code>, then update and pass <code>max(maxSoFar, node.val)</code> downwards.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>BFS / Stack Iterative:</strong> Instead of the call stack holding the <code>maxSoFar</code> state, we explicitly pair every <code>TreeNode</code> with its <code>maxSoFar</code> and store them together inside a Queue or Stack.</p>
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
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 1, 4, 3, null, 1, 5" />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found a total of {st.finalAns} good nodes.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCheckGood ? (st.isGood ? 'text-emerald-400' : 'text-rose-400') : (st.hlNewMax ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Call Stack Widget */}
                   {!st.isSuccess && selectedOpId === 'dfsRecursion' && st.callStack && (
                       <div className="absolute bottom-4 left-4 z-30 pointer-events-auto">
                           <div className={`bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl p-4 flex flex-col transition-all duration-300 w-48 max-h-[200px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={12}/> Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                       let isTop = idx === 0;
                                       return (
                                           <div key={`frame-${idx}`} className={`w-full py-2 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? `bg-${themeColor}-500 text-white border-${themeColor}-400 scale-100` : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding top-down state propagation in tree traversal.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitPullRequest size={24} className={`text-${themeColor}-500`}/> 1. Pre-Order Traversal State Passing</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In many tree problems, nodes only care about returning data upwards (like finding max depth). In this problem, nodes rely heavily on data coming <strong>downwards</strong> from the root.</p>
                        <p className="text-slate-600 leading-relaxed">We use a Pre-order traversal concept: we evaluate the current node first using the state (<code>maxSoFar</code>) passed down by its parent. If it passes the condition, we count it. Then, we calculate the new state (<code>newMax = Math.max(maxSoFar, node.val)</code>) and explicitly pass this updated state down to the left and right children. This ensures every node has perfect knowledge of its entire ancestral path in O(1) time.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-emerald-500"/> 2. Avoiding Global Variables</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">It's tempting to use a global/class-level variable <code>int maxSoFar</code> to track the maximum. Why is this a bad idea?</p>
                        <p className="text-slate-600 leading-relaxed">Because DFS naturally backtracks! If you traverse deep down the left subtree and update a global <code>maxSoFar</code> to 100, when the recursion unwinds and goes down the right subtree, it will incorrectly use 100 as the max, even though the right subtree is on a completely different path! By passing <code>maxSoFar</code> as a method parameter or binding it inside a Queue pair, we naturally leverage scoping to keep the maximum value local to its specific path.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We visit every single node in the tree exactly once. The work done at each node (checking max, updating max, adding to sum) is O(1). Thus, total time is strictly linear.</li>
                            <li><strong>Space Complexity (DFS Recursion/Stack): O(H).</strong> Space is dictated by the depth of the call stack. In the worst case (a skewed tree), the recursion goes $N$ levels deep, taking $O(N)$ space. In a balanced tree, it takes $O(\log N)$ space. We denote this as $O(H)$ where $H$ is the tree height.</li>
                            <li><strong>Space Complexity (BFS Queue): O(W).</strong> Space is dictated by the maximum width of the tree, which bounds to $O(N/2)$ or $O(N)$ for a perfectly balanced tree leaf row.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This problem tests your understanding of scoping and state propagation in traversals. Be prepared to explain why global variables fail here."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this iteratively without recursion?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we can simulate the DFS using an explicit Stack, or use BFS with a Queue.</p>
                            <p>Instead of just pushing the <code>TreeNode</code> onto the stack/queue, we would push a custom object or a Pair containing both the <code>TreeNode</code> and the <code>maxSoFar</code> for that specific node's path: <code>stack.push(new Pair(node, maxSoFar))</code>. This ensures that when we pop a node later, we also retrieve the correct historical maximum associated with its exact path."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "What if the tree contains negative numbers?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The algorithm handles negative numbers flawlessly because we initialize the very first <code>maxSoFar</code> as the <code>root.val</code>.</p>
                            <p>A common mistake is initializing the starting max as <code>0</code> or <code>Integer.MIN_VALUE</code>. By passing <code>root.val</code> into the initial DFS call, the root is always considered 'good', and subsequent negative numbers are evaluated mathematically correctly against whatever the maximum negative/positive value was."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If you only want the Count and you use recursion, why pass 'res' upwards? Can't we just have a global count?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "You absolutely can use a global <code>count</code> variable for the final result.</p>
                            <p>Unlike <code>maxSoFar</code>, which is path-dependent and must backtrack cleanly, the total <code>count</code> is a global accumulation. Writing <code>globalCount++</code> inside the DFS is perfectly valid and arguably simpler to read than accumulating <code>res += dfs(...)</code>. However, pure functional programming prefers returning the sum upwards to avoid side effects and state mutations, which is why returning the integer is slightly more elegant."</p>
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
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCheckGood ? (st.isGood ? 'text-emerald-400' : 'text-rose-400') : (st.hlNewMax ? 'text-amber-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div ref={codeContainerFullscreenRef} className="bg-black/20 rounded-2xl border border-white/5 p-4 overflow-x-hidden scroll-smooth max-h-[400px] overflow-y-auto">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Context Panel for Fullscreen */}
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 max-w-sm w-full">
                          {selectedOpId === 'dfsRecursion' && st.callStack ? (
                              <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-full max-h-[350px] overflow-hidden`}>
                                  <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                      <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                                  </div>
                                  <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                      {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                          let isTop = idx === 0;
                                          return (
                                              <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? `bg-${themeColor}-500 text-white border-${themeColor}-400 scale-100` : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
                                                  {frameStr}
                                              </div>
                                          )
                                      })}
                                      {st.callStack.length === 0 && (
                                          <span className="text-slate-500 font-mono italic text-sm text-center py-2">Empty</span>
                                      )}
                                  </div>
                              </div>
                          ) : selectedOpId === 'bfsIterative' ? (
                              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-teal-200 shadow-2xl p-5 flex flex-col w-full">
                                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 flex items-center gap-2">Queue (FIFO)</span>
                                  </div>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2">
                                      {st.qState && st.qState.length > 0 ? st.qState.map((pair: any, idx: number) => (
                                          <div key={`qfs-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-3 py-1 font-mono text-sm ${idx === 0 ? 'bg-teal-100 text-teal-800 border-teal-500 ring-2 ring-teal-200' : 'bg-teal-50 border-teal-200 text-teal-700'}`}>
                                              <span className="font-black text-xl leading-none">{pair.node.val}</span>
                                              <span className="text-[9px] border-t border-teal-300 pt-0.5 mt-0.5 opacity-80 uppercase tracking-widest">max={pair.maxSoFar}</span>
                                          </div>
                                      )) : <span className="text-slate-400 italic text-sm font-mono py-2">Queue is empty</span>}
                                  </div>
                              </div>
                          ) : selectedOpId === 'dfsIterative' ? (
                              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-amber-200 shadow-2xl p-5 flex flex-col w-full">
                                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">Stack (LIFO)</span>
                                  </div>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2">
                                      {st.stackState && st.stackState.length > 0 ? st.stackState.map((pair: any, idx: number) => (
                                          <div key={`sfs-${idx}`} className={`shrink-0 flex flex-col items-center justify-center border-2 rounded-xl px-3 py-1 font-mono text-sm ${idx === st.stackState.length - 1 ? 'bg-amber-100 text-amber-800 border-amber-500 ring-2 ring-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                              <span className="font-black text-xl leading-none">{pair.node.val}</span>
                                              <span className="text-[9px] border-t border-amber-300 pt-0.5 mt-0.5 opacity-80 uppercase tracking-widest">max={pair.maxSoFar}</span>
                                          </div>
                                      )) : <span className="text-slate-400 italic text-sm font-mono py-2">Stack is empty</span>}
                                  </div>
                              </div>
                          ) : null}
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 1, 4, 3, null, 1, 5" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-${themeColor}-500/10`}><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Total Good Nodes Found</div>
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