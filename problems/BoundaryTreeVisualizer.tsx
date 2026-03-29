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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag, ArrowDownRight, Waypoints, Scale, Ruler, GitCompare, Compass,
  ArrowRightLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  modular: {
    id: 'modular',
    title: '1. Modular Traversal O(N)',
    icon: <Compass size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'violet',
    code: `class Solution {
    List<Integer> res = new ArrayList<>();
    
    public List<Integer> boundaryOfBinaryTree(TreeNode root) {
        if (root == null) return res;
        if (!isLeaf(root)) res.add(root.val);
        
        addLeftBoundary(root.left);
        addLeaves(root);
        addRightBoundary(root.right);
        
        return res;
    }
    
    private boolean isLeaf(TreeNode node) {
        return node != null && node.left == null && node.right == null;
    }
    
    private void addLeftBoundary(TreeNode node) {
        while (node != null) {
            if (!isLeaf(node)) res.add(node.val);
            if (node.left != null) node = node.left;
            else node = node.right;
        }
    }
    
    private void addLeaves(TreeNode node) {
        if (node == null) return;
        if (isLeaf(node)) {
            res.add(node.val);
            return;
        }
        addLeaves(node.left);
        addLeaves(node.right);
    }
    
    private void addRightBoundary(TreeNode node) {
        Stack<Integer> stack = new Stack<>();
        while (node != null) {
            if (!isLeaf(node)) stack.push(node.val);
            if (node.right != null) node = node.right;
            else node = node.left;
        }
        while (!stack.isEmpty()) {
            res.add(stack.pop());
        }
    }
}`,
    desc: "The most readable and universally accepted approach. We break the problem into 4 distinct phases: Root, Left Boundary, Leaves, and Right Boundary. We use a helper `isLeaf()` to ensure we never add duplicates (boundary paths skip leaves, leaving them for the `addLeaves` phase). The Left boundary goes down the left (falling back to right if left is null). The Leaves phase is a simple Preorder DFS. The Right boundary goes down the right, but pushes to a Stack to reverse the sequence so it reads bottom-up!"
  },
  singlePassDFS: {
    id: 'singlePassDFS',
    title: '2. Single-Pass DFS O(N)',
    icon: <Waypoints size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'amber',
    code: `class Solution {
    List<Integer> res = new ArrayList<>();
    
    public List<Integer> boundaryOfBinaryTree(TreeNode root) {
        if (root == null) return res;
        res.add(root.val);
        dfs(root.left, true, false);
        dfs(root.right, false, true);
        return res;
    }
    
    private void dfs(TreeNode node, boolean isLeft, boolean isRight) {
        if (node == null) return;
        
        boolean isLeaf = node.left == null && node.right == null;
        
        // Add left boundary or leaves (Pre-Order)
        if (isLeft || isLeaf) res.add(node.val);
        
        // Pass boundary flags strictly downwards
        dfs(node.left, isLeft, isRight && node.right == null);
        dfs(node.right, isLeft && node.left == null, isRight);
        
        // Add right boundary (Post-Order reverses it automatically!)
        if (isRight && !isLeft && !isLeaf) {
            res.add(node.val);
        }
    }
}`,
    desc: "A highly elegant but tricky single-pass DFS approach. Instead of running 4 separate traversal passes, we traverse the tree exactly once while passing down `isLeft` and `isRight` boolean flags. Left boundary nodes and leaves are added during the Pre-Order step (before visiting children). Right boundary nodes are added during the Post-Order step (after visiting children). Because Post-Order evaluates bottom-up, it magically reverses the right boundary sequence without needing an explicit Stack data structure!"
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|boundaryOfBinaryTree|isLeaf|addLeftBoundary|addLeaves|addRightBoundary|dfs|Solution|TreeNode|root|node|isLeft|isRight|res|ArrayList|List|Stack|stack|push|pop|isEmpty|val|left|right|add|null)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['String', 'Solution', 'TreeNode', 'ArrayList', 'List', 'Stack'].includes(part);
            const isPointer = ['root', 'node', 'val', 'left', 'right', 'res', 'stack', 'isLeft', 'isRight'].includes(part);
            const isMapCall = ['boundaryOfBinaryTree', 'isLeaf', 'addLeftBoundary', 'addLeaves', 'addRightBoundary', 'dfs', 'add', 'push', 'pop', 'isEmpty'].includes(part);
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

export default function BoundaryTreeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('modular');
  
  const [treeInput, setTreeInput] = useState('1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10]);

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
      if (arr.length === 0) arr = [1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10];
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
      if (baseTreeArr.length === 0 || baseTreeArr[0] === null || baseTreeArr[0] === undefined) return { root: null, nodes: [], edges: [], maxDepth: 0 };
      
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
          
          // Determine if leaf for visualization logic later
          node.isLeaf = node.left == null && node.right == null;
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
        steps.push({ phase: 'init', description: `Tree is empty. Returning empty list.`, line: 5, state: { res: [], nodeTypes: {} } });
        return steps;
    }

    // Helpers
    const isLeaf = (node: any) => node && !node.left && !node.right;

    if (selectedOpId === 'modular') {
        let res: { val: number, type: string, id: number }[] = [];
        let nodeTypes: {[key: number]: string} = {};
        let stack: { val: number, id: number }[] = [];
        
        const cloneRes = () => [...res];
        const cloneTypes = () => ({...nodeTypes});
        const cloneStack = () => [...stack];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { res: cloneRes(), nodeTypes: cloneTypes(), stack: cloneStack(), ...st } 
        });

        add("Init Result List", `List<Integer> res = new ArrayList<>();`, 2, { hlPhase: 'init' });
        add("Function Call", `public List<Integer> boundaryOfBinaryTree(TreeNode root)`, 4, { hlPhase: 'init' });

        add("Null Check", `if (root == null) return res;`, 5, { hlPhase: 'checkRoot', currNodeId: treeData.root.id });

        add("Root Leaf Check", `if (!isLeaf(root)) res.add(root.val);`, 6, { hlPhase: 'rootPhase', currNodeId: treeData.root.id });
        if (!isLeaf(treeData.root)) {
            res.push({ val: treeData.root.val, type: 'root', id: treeData.root.id });
            nodeTypes[treeData.root.id] = 'root';
            add("Add Root", `Root is not a leaf. Added ${treeData.root.val} to result.`, 6, { hlPhase: 'addRes', currNodeId: treeData.root.id, actionStr: 'ADD ROOT' });
        } else {
            add("Root is Leaf", `Root is a leaf! We'll let the 'Leaves' phase add it.`, 6, { hlPhase: 'skipRoot', currNodeId: treeData.root.id });
        }

        // Left Boundary
        add("Start Left Boundary", `addLeftBoundary(root.left);`, 8, { hlPhase: 'phaseTrans' });
        let curr = treeData.root.left;
        
        while (curr) {
            if (steps.length > 2500) break;
            
            add("Left Boundary Loop", `while (node != null)\nCurrent node: ${curr.val}`, 20, { hlPhase: 'leftLoop', currNodeId: curr.id });
            
            add("Check if Leaf", `if (!isLeaf(node)) res.add(node.val);`, 21, { hlPhase: 'checkLeaf', currNodeId: curr.id });
            if (!isLeaf(curr)) {
                res.push({ val: curr.val, type: 'left', id: curr.id });
                nodeTypes[curr.id] = 'left';
                add("Add Left Boundary", `Node ${curr.val} is NOT a leaf. Added to result.`, 21, { hlPhase: 'addRes', currNodeId: curr.id, actionStr: 'ADD LEFT' });
            } else {
                add("Skip Leaf", `Node ${curr.val} is a leaf! Skipping (Leaves phase will get it).`, 21, { hlPhase: 'skipRes', currNodeId: curr.id });
            }

            add("Traverse Down", `if (node.left != null) node = node.left;\nelse node = node.right;`, 22, { hlPhase: 'traverse', currNodeId: curr.id });
            if (curr.left) {
                curr = curr.left;
                add("Go Left", `Went left to ${curr.val}.`, 22, { hlPhase: 'goLeft', currNodeId: curr.id });
            } else {
                curr = curr.right;
                if (curr) add("Go Right", `No left child. Falling back to right child: ${curr.val}.`, 23, { hlPhase: 'goRight', currNodeId: curr.id });
            }
        }
        add("Left Boundary Done", `while (node != null) // Node is null. Finished left boundary.`, 20, { hlPhase: 'leftDone' });

        // Leaves Phase
        add("Start Leaves Phase", `addLeaves(root);`, 9, { hlPhase: 'phaseTrans' });

        const addLeaves = (node: any) => {
            if (!node) {
                add("Leaves Null", `if (node == null) return;`, 28, { hlPhase: 'leavesNull' });
                return;
            }
            
            add("Leaves Enter", `private void addLeaves(TreeNode node)\nChecking node ${node.val}.`, 27, { hlPhase: 'leavesEnter', currNodeId: node.id });
            
            add("Check isLeaf", `if (isLeaf(node))`, 29, { hlPhase: 'checkLeaf', currNodeId: node.id });
            if (isLeaf(node)) {
                res.push({ val: node.val, type: 'leaf', id: node.id });
                nodeTypes[node.id] = 'leaf';
                add("Add Leaf", `res.add(node.val);\nNode ${node.val} is a leaf! Added to result.`, 30, { hlPhase: 'addRes', currNodeId: node.id, actionStr: 'ADD LEAF' });
                add("Return", `return;`, 31, { hlPhase: 'return' });
                return;
            }

            add("Recurse Left", `addLeaves(node.left);`, 33, { hlPhase: 'leavesLeft', currNodeId: node.id, childId: node.left ? node.left.id : null });
            addLeaves(node.left);

            add("Recurse Right", `addLeaves(node.right);`, 34, { hlPhase: 'leavesRight', currNodeId: node.id, childId: node.right ? node.right.id : null });
            addLeaves(node.right);
        }
        addLeaves(treeData.root);
        add("Leaves Phase Done", `Leaves completely collected.`, 9, { hlPhase: 'leavesDone' });

        // Right Boundary
        add("Start Right Boundary", `addRightBoundary(root.right);`, 10, { hlPhase: 'phaseTrans' });
        
        add("Init Stack", `Stack<Integer> stack = new Stack<>();`, 38, { hlPhase: 'initStack' });
        curr = treeData.root.right;
        
        while (curr) {
            if (steps.length > 2500) break;
            
            add("Right Boundary Loop", `while (node != null)\nCurrent node: ${curr.val}`, 39, { hlPhase: 'rightLoop', currNodeId: curr.id });
            
            add("Check if Leaf", `if (!isLeaf(node)) stack.push(node.val);`, 40, { hlPhase: 'checkLeaf', currNodeId: curr.id });
            if (!isLeaf(curr)) {
                stack.push({ val: curr.val, id: curr.id });
                nodeTypes[curr.id] = 'right';
                add("Push to Stack", `Node ${curr.val} is NOT a leaf. Pushed to stack (to reverse order).`, 40, { hlPhase: 'pushStack', currNodeId: curr.id, actionStr: 'PUSH STACK' });
            } else {
                add("Skip Leaf", `Node ${curr.val} is a leaf! Skipping.`, 40, { hlPhase: 'skipRes', currNodeId: curr.id });
            }

            add("Traverse Down", `if (node.right != null) node = node.right;\nelse node = node.left;`, 41, { hlPhase: 'traverse', currNodeId: curr.id });
            if (curr.right) {
                curr = curr.right;
                add("Go Right", `Went right to ${curr.val}.`, 41, { hlPhase: 'goRight', currNodeId: curr.id });
            } else {
                curr = curr.left;
                if (curr) add("Go Left", `No right child. Falling back to left child: ${curr.val}.`, 42, { hlPhase: 'goLeft', currNodeId: curr.id });
            }
        }

        add("Unwind Stack", `while (!stack.isEmpty())`, 44, { hlPhase: 'unwindLoop' });
        while (stack.length > 0) {
            let popped = stack.pop()!;
            res.push({ val: popped.val, type: 'right', id: popped.id });
            add("Pop to Result", `res.add(stack.pop());\nPopped ${popped.val} from stack and added to result.`, 45, { hlPhase: 'popRes', currNodeId: popped.id, actionStr: 'POP & ADD' });
        }

        add("Return Result", `return res;\nBoundary Traversal Complete!`, 12, { hlPhase: 'success', isSuccess: true, finalRes: res });
    }
    else if (selectedOpId === 'singlePassDFS') {
        let res: { val: number, type: string, id: number }[] = [];
        let nodeTypes: {[key: number]: string} = {};
        let callStack: { val: number, id: number }[] = [];
        
        const cloneRes = () => [...res];
        const cloneTypes = () => ({...nodeTypes});
        const cloneStack = () => [...callStack];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { res: cloneRes(), nodeTypes: cloneTypes(), stack: cloneStack(), ...st } 
        });

        add("Init Result", `List<Integer> res = new ArrayList<>();`, 2, { hlPhase: 'init' });
        add("Function Call", `public List<Integer> boundaryOfBinaryTree(TreeNode root)`, 4, { hlPhase: 'init' });
        
        add("Null Check", `if (root == null) return res;`, 5, { hlPhase: 'checkRoot', currNodeId: treeData.root.id });
        
        res.push({ val: treeData.root.val, type: 'root', id: treeData.root.id });
        nodeTypes[treeData.root.id] = 'root';
        add("Add Root", `res.add(root.val);\nAdded root to boundary.`, 6, { hlPhase: 'addRes', currNodeId: treeData.root.id, actionStr: 'ADD ROOT' });

        const dfs = (node: any, isLeft: boolean, isRight: boolean) => {
            if (steps.length > 2500) return;
            
            if (!node) {
                add("DFS Null", `if (node == null) return;`, 13, { hlPhase: 'dfsNull' });
                return;
            }

            callStack.push({ val: node.val, id: node.id });
            add("DFS Entry", `private void dfs(TreeNode node, boolean isLeft, boolean isRight)\nEntering ${node.val}.`, 12, { hlPhase: 'enter', currNodeId: node.id, isLeft, isRight });

            let nodeIsLeaf = isLeaf(node);
            add("Check Leaf", `boolean isLeaf = node.left == null && node.right == null;`, 15, { hlPhase: 'checkLeaf', currNodeId: node.id, isLeft, isRight, isLeaf: nodeIsLeaf });

            add("Preorder Check", `if (isLeft || isLeaf) res.add(node.val);`, 18, { hlPhase: 'preCheck', currNodeId: node.id, isLeft, isRight, isLeaf: nodeIsLeaf });
            if (isLeft || nodeIsLeaf) {
                let nType = isLeft ? 'left' : 'leaf';
                res.push({ val: node.val, type: nType, id: node.id });
                nodeTypes[node.id] = nType;
                add("Add Preorder", `Node is ${nType}! Adding ${node.val} to result.`, 18, { hlPhase: 'addRes', currNodeId: node.id, actionStr: `ADD ${nType.toUpperCase()}`, isLeft, isRight });
            }

            add("DFS Left", `dfs(node.left, isLeft, isRight && node.right == null);`, 21, { hlPhase: 'goLeft', currNodeId: node.id, childId: node.left ? node.left.id : null, isLeft, isRight });
            dfs(node.left, isLeft, isRight && node.right == null);

            add("DFS Right", `dfs(node.right, isLeft && node.left == null, isRight);`, 22, { hlPhase: 'goRight', currNodeId: node.id, childId: node.right ? node.right.id : null, isLeft, isRight });
            dfs(node.right, isLeft && node.left == null, isRight);

            add("Postorder Check", `if (isRight && !isLeft && !isLeaf)`, 25, { hlPhase: 'postCheck', currNodeId: node.id, isLeft, isRight, isLeaf: nodeIsLeaf });
            if (isRight && !isLeft && !nodeIsLeaf) {
                res.push({ val: node.val, type: 'right', id: node.id });
                nodeTypes[node.id] = 'right';
                add("Add Right (Postorder)", `res.add(node.val);\nNode is right boundary! Postorder guarantees bottom-up addition.`, 26, { hlPhase: 'addRes', currNodeId: node.id, actionStr: 'ADD RIGHT', isLeft, isRight });
            }

            callStack.pop();
            add("Exit Node", `Finished processing node ${node.val}.`, 28, { hlPhase: 'exit', currNodeId: node.id, isLeft, isRight });
        };

        add("Start DFS Left", `dfs(root.left, true, false);`, 7, { hlPhase: 'startLeft' });
        dfs(treeData.root.left, true, false);

        add("Start DFS Right", `dfs(root.right, false, true);`, 8, { hlPhase: 'startRight' });
        dfs(treeData.root.right, false, true);

        add("Return Result", `return res;\nBoundary Traversal Complete!`, 9, { hlPhase: 'success', isSuccess: true, finalRes: res });
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

      // Determine Active Phase (Root, Left, Leaves, Right) or DFS state
      let activePhaseStr = "INITIALIZING";
      let phaseColor = "slate";
      
      if (selectedOpId === 'modular') {
          if (st.hlPhase === 'rootPhase' || st.hlPhase === 'checkRoot') { activePhaseStr = "PHASE 1: ROOT"; phaseColor = "amber"; }
          if (st.hlPhase === 'phaseTrans' && curStepData.line === 8) { activePhaseStr = "PHASE 2: LEFT BDRY"; phaseColor = "sky"; }
          if (st.hlPhase === 'leftLoop' || (st.nodeTypes && st.nodeTypes[st.currNodeId] === 'left')) { activePhaseStr = "PHASE 2: LEFT BDRY"; phaseColor = "sky"; }
          
          if (st.hlPhase === 'phaseTrans' && curStepData.line === 9) { activePhaseStr = "PHASE 3: LEAVES"; phaseColor = "emerald"; }
          if (st.hlPhase === 'leavesEnter' || st.hlPhase === 'leavesLeft' || st.hlPhase === 'leavesRight' || st.hlPhase === 'leavesDone' || (st.hlPhase === 'checkLeaf' && curStepData.line === 29)) { activePhaseStr = "PHASE 3: LEAVES"; phaseColor = "emerald"; }
          
          if (st.hlPhase === 'phaseTrans' && curStepData.line === 10) { activePhaseStr = "PHASE 4: RIGHT BDRY"; phaseColor = "rose"; }
          if (st.hlPhase === 'rightLoop' || st.hlPhase === 'initStack' || st.hlPhase === 'unwindLoop' || st.hlPhase === 'popRes' || (st.hlPhase === 'checkLeaf' && curStepData.line === 40)) { activePhaseStr = "PHASE 4: RIGHT BDRY"; phaseColor = "rose"; }
      } else {
          activePhaseStr = "DFS TRAVERSAL";
          phaseColor = "amber";
      }

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 border-${phaseColor}-200 scale-105 z-40`}>
              <span className={`text-[10px] font-black uppercase tracking-widest text-${phaseColor}-500 mb-4 flex items-center gap-1`}><Compass size={14}/> Boundary Phase Monitor</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Phase Indicator */}
                  <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-left-4">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${phaseColor}-500`}>Active Phase</span>
                      <div className={`border-2 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 font-black transition-all duration-300 bg-${phaseColor}-100 border-${phaseColor}-500 text-${phaseColor}-900 shadow-md scale-110`}>
                          {activePhaseStr}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>

                  {/* Flags for Single Pass DFS */}
                  {selectedOpId === 'singlePassDFS' && st.isLeft !== undefined && (
                      <>
                          <div className="flex flex-col items-center min-w-[80px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Flags</span>
                              <div className={`border-2 text-[10px] font-black px-3 py-1.5 rounded-xl bg-slate-50 border-slate-300 text-slate-700 flex flex-col items-start gap-0.5`}>
                                  <span className={st.isLeft ? 'text-sky-600' : 'opacity-40'}>isLeft: {st.isLeft ? 'T' : 'F'}</span>
                                  <span className={st.isRight ? 'text-rose-600' : 'opacity-40'}>isRight: {st.isRight ? 'T' : 'F'}</span>
                              </div>
                          </div>
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                      </>
                  )}

                  {/* Current Node */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.currNodeId ? `text-amber-500` : 'text-slate-400'}`}>Current Node</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.currNodeId ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {cNode ? String(cNode.val) : '?'}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>

                  {/* Action Evaluation */}
                  <div className="flex items-center gap-4 min-w-[150px]">
                      {(st.hlPhase === 'addRes' || st.hlPhase === 'pushStack' || st.hlPhase === 'popRes') ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${phaseColor}-600`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-${phaseColor}-100 border-${phaseColor}-500 text-${phaseColor}-800 shadow-md flex items-center gap-2 scale-110`}>
                                  <span>{st.actionStr}</span>
                                  <ArrowRight size={16}/>
                                  <span className={`text-${phaseColor}-600 bg-white px-2 py-0.5 rounded-md border border-${phaseColor}-300`}>{cNode ? cNode.val : ''}</span>
                              </div>
                          </div>
                      ) : (st.hlPhase === 'checkLeaf' || st.hlPhase === 'skipRes' || st.hlPhase === 'skipRoot' || (selectedOpId === 'singlePassDFS' && st.hlPhase === 'preCheck' && !st.isLeft && !st.isLeaf)) ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-rose-100 border-rose-500 text-rose-800 shadow-sm flex items-center gap-2`}>
                                  <span>{selectedOpId === 'modular' ? 'IS LEAF: SKIPPED' : 'NOT BOUNDARY: SKIPPED'}</span>
                                  <XCircle size={18}/>
                              </div>
                          </div>
                      ) : (st.hlPhase === 'goLeft' || st.hlPhase === 'goRight' || st.hlPhase === 'startLeft' || st.hlPhase === 'startRight') ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-slate-100 border-slate-400 text-slate-700 shadow-sm flex items-center gap-2`}>
                                  <span>{(st.hlPhase === 'goLeft' || st.hlPhase === 'startLeft') ? 'TRAVERSE LEFT' : 'TRAVERSE RIGHT'}</span>
                              </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center opacity-60">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Action</span>
                              <div className={`border-2 text-sm font-black px-4 py-3 rounded-xl bg-slate-50 border-slate-300 text-slate-500 shadow-sm flex items-center gap-2`}>
                                  EVALUATING...
                              </div>
                          </div>
                      )}
                  </div>

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

              {/* Data Trackers (Res Array & Right Stack / Call Stack) */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  {/* Results Array */}
                  <div className={`flex-[3] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addRes' || st.hlPhase === 'popRes' ? `border-violet-300 ring-4 ring-violet-100 scale-[1.02]` : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-violet-600 flex items-center gap-2`}>
                               <ListOrdered size={14}/> Result Array (Boundary)
                           </span>
                       </div>
                       
                       <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-start px-2">
                           {st.res && st.res.length > 0 ? st.res.map((item: any, idx: number) => {
                               let isNew = idx === st.res.length - 1 && (st.hlPhase === 'addRes' || st.hlPhase === 'popRes');
                               let bgC = 'bg-slate-50 border-slate-200 text-slate-700'; // fallback
                               let textC = 'text-slate-400';
                               
                               if (item.type === 'root') { bgC = 'bg-amber-100 border-amber-400 text-amber-900'; textC = 'text-amber-600'; }
                               if (item.type === 'left') { bgC = 'bg-sky-100 border-sky-400 text-sky-900'; textC = 'text-sky-600'; }
                               if (item.type === 'leaf') { bgC = 'bg-emerald-100 border-emerald-400 text-emerald-900'; textC = 'text-emerald-600'; }
                               if (item.type === 'right') { bgC = 'bg-rose-100 border-rose-400 text-rose-900'; textC = 'text-rose-600'; }

                               if (isNew) { bgC += ' shadow-md scale-110'; }

                               return (
                                   <div key={`res-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl px-4 py-2 ${bgC}`}>
                                       <span className="font-mono text-xl font-black">{item.val}</span>
                                       <span className={`text-[8px] font-bold font-mono opacity-90 border-t pt-1 uppercase ${textC}`}>{item.type}</span>
                                   </div>
                               );
                           }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty List</span>}
                       </div>
                  </div>

                  {/* Temporary Stack for Right Boundary / Call Stack for Single Pass */}
                  <div className={`flex-[1] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'pushStack' || st.hlPhase === 'initStack' || st.hlPhase === 'popRes' || st.hlPhase === 'enter' || st.hlPhase === 'exit') ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2 border-b pb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                               <LayersIcon size={14}/> {selectedOpId === 'modular' ? 'Right B. Stack' : 'DFS Call Stack'}
                           </span>
                       </div>
                       {/* Render Stack vertically (Top element first) */}
                       <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                           {st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                               let isTop = idx === 0;
                               return (
                                   <div key={`stk-${idx}-${item.id}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-amber-500 border-amber-600 text-white shadow-md' : 'bg-amber-50 border-amber-200 text-amber-700 opacity-70'}`}>
                                       {selectedOpId === 'modular' ? item.val : `dfs(${item.val})`}
                                   </div>
                               );
                           }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                       </div>
                  </div>

              </div>

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
                                  
                                  let isActiveLeftEdge = (st.hlPhase === 'goLeft' || st.hlPhase === 'traverse' || st.hlPhase === 'leavesLeft' || st.hlPhase === 'startLeft') && activeId === edge.source && edge.isLeft;
                                  let isActiveRightEdge = (st.hlPhase === 'goRight' || st.hlPhase === 'traverse' || st.hlPhase === 'leavesRight' || st.hlPhase === 'startRight') && activeId === edge.source && !edge.isLeft;
                                  let isActivelyTraversing = isActiveLeftEdge || isActiveRightEdge;

                                  let strokeColor = '#cbd5e1'; // default slate-300
                                  let strokeWidth = 2;
                                  let opacity = 0.6;

                                  // Color edges based on boundary logic
                                  let sourceNodeType = st.nodeTypes ? st.nodeTypes[edge.source] : null;
                                  let targetNodeType = st.nodeTypes ? st.nodeTypes[edge.target] : null;

                                  if (isActivelyTraversing) {
                                      strokeColor = '#a855f7'; // purple
                                      strokeWidth = 4;
                                      opacity = 1;
                                  } else if (sourceNodeType === 'left' && targetNodeType === 'left') {
                                      strokeColor = '#38bdf8'; strokeWidth = 3; opacity = 0.8;
                                  } else if (sourceNodeType === 'right' && targetNodeType === 'right') {
                                      strokeColor = '#fb7185'; strokeWidth = 3; opacity = 0.8;
                                  }

                                  // Using absolute x,y coordinates since SVG 0,0 is now strictly aligned with div 0,0
                                  return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id && !st.isSuccess;
                              let nType = st.nodeTypes ? st.nodeTypes[node.id] : null;
                              let isInStack = st.stack && st.stack.some((s:any) => s.id === node.id) && !isActive;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; // Base Unvisited
                              let scaleClass = "scale-100";
                              
                              if (isActive) {
                                  bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                  scaleClass = "scale-125";
                              } else if (nType === 'root') {
                                  bgClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-md z-10";
                              } else if (nType === 'left') {
                                  bgClass = "bg-sky-400 border-sky-600 text-sky-950 shadow-md z-10";
                              } else if (nType === 'leaf') {
                                  bgClass = "bg-emerald-400 border-emerald-600 text-emerald-950 shadow-md z-10";
                              } else if (nType === 'right') {
                                  bgClass = "bg-rose-400 border-rose-600 text-rose-950 shadow-md z-10";
                              } else if (isInStack && selectedOpId === 'modular') {
                                  bgClass = "bg-rose-100 border-rose-400 text-rose-800 border-dashed shadow-sm z-10"; // Temporary stack state
                              } else if (isInStack && selectedOpId === 'singlePassDFS') {
                                  bgClass = "bg-amber-50 border-amber-300 text-amber-700 shadow-sm z-10"; // Temporary stack state
                              } else if (node.isLeaf) {
                                  bgClass = "bg-slate-100 border-slate-400 text-slate-600 border-dashed shadow-sm opacity-80"; // Hint it's a leaf
                              }

                              if (st.isSuccess) {
                                  if (!nType) bgClass = "bg-slate-100 border-slate-300 text-slate-400 opacity-30"; // Fade out non-boundary
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* Floating Badges */}
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce`}>
                                              curr
                                          </span>
                                      )}
                                      
                                      {nType && !isActive && !st.isSuccess && (
                                          <div className={`absolute -right-3 -bottom-2 ${nType === 'root' ? 'bg-amber-500' : (nType === 'left' ? 'bg-sky-500' : (nType === 'leaf' ? 'bg-emerald-500' : 'bg-rose-500'))} text-white rounded-md px-1 py-0.5 shadow-sm z-40 border border-white text-[8px] font-black uppercase tracking-widest`}>
                                              {nType}
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
                <Compass className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Boundary of Binary Tree</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Modular Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 545</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Compass size={28}/> Walk the Perimeter</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>The <strong>boundary</strong> of a binary tree is the concatenation of the <strong>root</strong>, the <strong>left boundary</strong>, the <strong>leaves</strong> ordered from left-to-right, and the <strong>reverse order</strong> of the <strong>right boundary</strong>.</p>
                        <p>The <em>left boundary</em> is defined as the path from the root to the left-most node. The <em>right boundary</em> is defined as the path from the root to the right-most node. If the root doesn't have a left child, the left boundary is empty (and same for right). Leaves are NOT included in the left or right boundaries to prevent duplicates.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-8`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1: Full Tree</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [1,2,3,4,5,6,null,null,null,7,8,9,10]</p>
                                    <p><strong>Output:</strong> [1,2,4,7,8,9,10,6,3]</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`        1
      /   \\
     2     3
    / \\   /
   4   5 6
      / \\ / \\
     7  8 9 10`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2: Skewed Tree</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [1,null,2,3,4]</p>
                                    <p><strong>Output:</strong> [1,3,4,2]</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`  1
   \\
    2
   / \\
  3   4`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range <code>[1, 10^4]</code>.</li>
                            <li><code>-1000 &le; Node.val &le; 1000</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This problem is a classic multi-phase traversal. Trying to do it all in a single DFS pass requires incredibly complex flag passing. Instead, we can break it down strictly into four independent logical parts: The Root, The Left Edge, All The Leaves, and finally The Right Edge (in reverse).</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Modular Approach (4 Phases):</strong> We write helper functions. `isLeaf(node)` ensures boundary logic never adds leaves. `addLeftBoundary` traverses left (falling back to right). `addLeaves` is a simple Preorder DFS. `addRightBoundary` traverses right, pushing to a Stack, and then popping to reverse the sequence perfectly.</p>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>2. Single-Pass DFS with Flags:</strong> A trickier approach that passes `isLeft` and `isRight` boolean flags down the call stack. It uses Pre-Order traversal for the left side/leaves and Post-Order traversal for the right side (to implicitly reverse it).</p>
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10" />
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
                                <PartyPopper size={24}/> EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Boundary successfully extracted.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' || st.hlPhase === 'popRes' ? 'text-emerald-400' : (st.hlPhase === 'pushStack' ? 'text-rose-400' : (st.hlPhase === 'checkLeaf' || st.hlPhase === 'skipRes' ? 'text-amber-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding Modular Tree Parsing.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-sky-500"/> 1. The Anti-Duplication Rule</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The hardest edge case in this problem is avoiding duplicates. The bottom-most left boundary node is technically ALSO a leaf node. The bottom-most right boundary node is ALSO a leaf node. If the root has no children, it's the root AND a leaf!</p>
                        <p className="text-slate-600 leading-relaxed">To solve this cleanly without complex boolean flag arrays, we establish a strict contract: <strong>Boundary traversals NEVER add leaf nodes</strong>. They only add internal nodes. Then, we let a dedicated <code>addLeaves()</code> function sweep the entire tree left-to-right to collect ALL leaves. This completely eliminates overlap bugs.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRightLeft size={24} className="text-rose-500"/> 2. The Right Boundary Reversal</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The boundary is defined as Counter-Clockwise. This means the right boundary must be read from the bottom-up. However, standard tree traversal only goes top-down.</p>
                        <p className="text-slate-600 leading-relaxed">We solve this elegantly using a Stack. As we traverse down the right edge, we push nodes into the Stack. Once we hit a leaf (and stop), we simply <code>while(!stack.isEmpty()) res.add(stack.pop())</code>. LIFO perfectly reverses the right edge into the correct sequence!</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className={`text-emerald-500`}/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We trace down the left edge $O(H)$, we do a full Preorder DFS for the leaves $O(N)$, and we trace down the right edge $O(H)$. The total time is bounded by the full DFS, making it $O(N)$.</li>
                            <li><strong>Space Complexity: O(N).</strong> The result array stores the boundary $O(N)$. The recursion stack for the Leaves phase goes $O(H)$ deep. The temporary stack for the right boundary takes $O(H)$. The worst-case total space required is $O(N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a premium Medium-Hard question (LeetCode Premium 545). Amazon and Meta ask this frequently because candidates who try to solve it in a single DFS pass usually end up writing disastrously unreadable spaghetti code."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "If the left child of a left boundary node is null, do we stop collecting the left boundary?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, we fall back to the right child."</p>
                            <p>The problem defines the boundary as the left-most path. If the left child is missing, the right child BECOMES the left-most path. This is why our while loop specifically states: <code>if (node.left != null) node = node.left; else node = node.right;</code>."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Could we do this in a single Preorder Traversal by passing flags?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, but it's highly prone to bugs."</p>
                            <p>You can write a single `dfs(node, isLeft, isRight)` where you pass booleans down. However, the logic for updating those flags based on null children becomes incredibly error-prone. The modular 4-phase approach is vastly superior in an interview setting because it proves you can break complex problems into isolated, testable components."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Why did you add a special `if (!isLeaf(root))` check right at the beginning before adding the root?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To handle the single-node tree edge case."</p>
                            <p>If the tree only has ONE node, that node is the root. But it is ALSO a leaf. If we blindly add the root, and then call `addLeaves(root)`, we will add the root twice! We explicitly only add the root if it is an internal node, guaranteeing the leaf phase handles it cleanly."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' || st.hlPhase === 'popRes' ? 'text-emerald-400' : (st.hlPhase === 'pushStack' ? 'text-rose-400' : (st.hlPhase === 'checkLeaf' || st.hlPhase === 'skipRes' ? 'text-amber-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                               <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'pushStack' || st.hlPhase === 'initStack' || st.hlPhase === 'popRes' || st.hlPhase === 'enter' || st.hlPhase === 'exit') ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                            <LayersIcon size={14}/> {selectedOpId === 'modular' ? 'Right B. Stack' : 'DFS Call Stack'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1 h-full max-h-[120px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                                        {st.stack?.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                            let isTop = idx === 0;
                                            return (
                                                <div key={`fs-stk-${idx}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                    {selectedOpId === 'modular' ? item.val : `dfs(${item.val})`}
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                                    </div>
                               </div>

                               <div className={`flex-[2] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addRes' || st.hlPhase === 'popRes' ? `border-violet-300 ring-4 ring-violet-100 scale-[1.02]` : 'border-slate-200'}`}>
                                    <div className="flex justify-between items-center mb-2 border-b pb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-violet-600 flex items-center gap-2`}>
                                            <ListOrdered size={14}/> Result Array
                                        </span>
                                    </div>
                                    <div className="flex gap-2 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-center justify-start px-2 mt-2">
                                        {st.res && st.res.length > 0 ? st.res.map((item: any, idx: number) => {
                                            let isNew = idx === st.res.length - 1 && (st.hlPhase === 'addRes' || st.hlPhase === 'popRes');
                                            let bgC = 'bg-slate-50 border-slate-200 text-slate-700'; // fallback
                                            let textC = 'text-slate-400';
                                            
                                            if (item.type === 'root') { bgC = 'bg-amber-100 border-amber-400 text-amber-900'; textC = 'text-amber-600'; }
                                            if (item.type === 'left') { bgC = 'bg-sky-100 border-sky-400 text-sky-900'; textC = 'text-sky-600'; }
                                            if (item.type === 'leaf') { bgC = 'bg-emerald-100 border-emerald-400 text-emerald-900'; textC = 'text-emerald-600'; }
                                            if (item.type === 'right') { bgC = 'bg-rose-100 border-rose-400 text-rose-900'; textC = 'text-rose-600'; }

                                            if (isNew) { bgC += ' shadow-md scale-110'; }

                                            return (
                                                <div key={`fs-res-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl px-3 py-1 ${bgC}`}>
                                                    <span className="font-mono text-base font-black">{item.val}</span>
                                                    <span className={`text-[7px] font-bold font-mono opacity-90 border-t pt-0.5 uppercase ${textC}`}>{item.type}</span>
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
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
                          <div className="flex flex-col space-y-1 w-64">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 3, 4, 5, 6...' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(139,92,246,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 ring-${themeColor}-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Boundary Result Array</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center">
                                        [ {st.finalRes && st.finalRes.map((r:any) => r.val).join(', ')} ]
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