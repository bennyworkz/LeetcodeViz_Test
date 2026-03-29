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
    title: '1. DFS (Recursive Arrays)',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(N1 + N2) | Space: O(N1 + N2)',
    theme: 'teal',
    code: `class Solution {
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        List<Integer> leaves1 = new ArrayList<>();
        List<Integer> leaves2 = new ArrayList<>();
        dfs(root1, leaves1);
        dfs(root2, leaves2);
        return leaves1.equals(leaves2);
    }
    
    private void dfs(TreeNode node, List<Integer> leafValues) {
        if (node == null) return;
        if (node.left == null && node.right == null) {
            leafValues.add(node.val);
        }
        dfs(node.left, leafValues);
        dfs(node.right, leafValues);
    }
}`,
    desc: "The standard approach extracts the complete leaf value sequences from both trees recursively and compares them. We write a helper DFS method. If a node has no left child and no right child, it's a leaf! We add its value to our list. We execute this for Tree 1, then Tree 2, and use Java's built-in list equality."
  },
  dfsIterative: {
    id: 'dfsIterative',
    title: '2. DFS (Iterative Generator)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N1 + N2) | Space: O(H1 + H2)',
    theme: 'amber',
    code: `class Solution {
    public boolean leafSimilar(TreeNode root1, TreeNode root2) {
        Stack<TreeNode> s1 = new Stack<>(), s2 = new Stack<>();
        if (root1 != null) s1.push(root1);
        if (root2 != null) s2.push(root2);
        while (!s1.isEmpty() && !s2.isEmpty()) {
            if (getNextLeaf(s1) != getNextLeaf(s2)) {
                return false;
            }
        }
        return s1.isEmpty() && s2.isEmpty();
    }
    
    private int getNextLeaf(Stack<TreeNode> s) {
        while (true) {
            TreeNode node = s.pop();
            if (node.right != null) s.push(node.right);
            if (node.left != null) s.push(node.left);
            if (node.left == null && node.right == null) {
                return node.val;
            }
        }
    }
}`,
    desc: "The optimized approach. Instead of building two massive lists, we simulate recursion manually using Stacks. We write a 'Generator' function that pauses its traversal the exact moment it hits a single leaf. We compare leaves one by one. If we spot a mismatch early, we instantly return false—saving enormous memory and time!"
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
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'teal' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|leafSimilar|dfs|TreeNode|Solution|root1|root2|null|this|left|right|leaves1|leaves2|ArrayList|List|Integer|add|equals|node|val|leafValues|Stack|isEmpty|push|pop|getNextLeaf|s1|s2|s)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'new', 'null', 'this', 'while', 'true', 'false'].includes(part);
            const isObject = ['TreeNode', 'Solution', 'List', 'ArrayList', 'Integer', 'Stack'].includes(part);
            const isPointer = ['root1', 'root2', 'left', 'right', 'leaves1', 'leaves2', 'node', 'leafValues', 'val', 's1', 's2', 's'].includes(part);
            const isMapCall = ['leafSimilar', 'dfs', 'add', 'equals', 'isEmpty', 'push', 'pop', 'getNextLeaf'].includes(part);
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

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dfsRecursion');
  
  const [tree1Input, setTree1Input] = useState('3, 5, 1, 6, 2, 9, 8, null, null, 7, 4');
  const [tree2Input, setTree2Input] = useState('3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8');
  
  const [baseTree1Arr, setBaseTree1Arr] = useState<(number | null)[]>([3, 5, 1, 6, 2, 9, 8, null, null, 7, 4]);
  const [baseTree2Arr, setBaseTree2Arr] = useState<(number | null)[]>([3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
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
      setBaseTree1Arr(parseTreeInput(tree1Input, [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4]));
      setBaseTree2Arr(parseTreeInput(tree2Input, [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8]));
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [tree1Input, tree2Input, selectedOpId]);

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
      let root = { val: arr[0], id: 0, left: null, right: null, gridX: 0, gridY: 0, isLeaf: false };
      nodesObj.push(root);
      
      let queue = [root];
      let i = 1;
      
      while (queue.length > 0 && i < arr.length) {
          let curr = queue.shift()!;
          
          if (i < arr.length && arr[i] !== null) {
              curr.left = { val: arr[i], id: i, left: null, right: null, gridX: 0, gridY: 0, isLeaf: false };
              nodesObj.push(curr.left);
              queue.push(curr.left);
          }
          i++;
          
          if (i < arr.length && arr[i] !== null) {
              curr.right = { val: arr[i], id: i, left: null, right: null, gridX: 0, gridY: 0, isLeaf: false };
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
          node.isLeaf = (node.left == null && node.right == null);
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
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, isLeaf: n.isLeaf, originalNode: n });
          
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

  const tree1Data = useMemo(() => buildTreeGeometry(baseTree1Arr), [baseTree1Arr]);
  const tree2Data = useMemo(() => buildTreeGeometry(baseTree2Arr), [baseTree2Arr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];

    let callStack: string[] = [];
    let leaves1: number[] = [];
    let leaves2: number[] = [];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            callStack: [...callStack],
            leaves1: [...leaves1],
            leaves2: [...leaves2],
            ...st 
        } 
    });

    if (selectedOpId === 'dfsRecursion') {
        const dfs = (node: any | null, treeIdx: number, targetList: number[]) => {
            if (steps.length > 2000) return;
            
            let callStr = `dfs(${node ? node.val : 'null'}, leaves${treeIdx})`;
            callStack.push(callStr);

            add(`DFS Tree ${treeIdx}`, `Entering node ${node ? node.val : 'null'}.`, 10, { activeTree: treeIdx, currNodeId: node ? node.id : null, isLeaf: node?.isLeaf });

            add("Null Check", `if (node == null) return;\nIs node null? (${node == null ? 'Yes' : 'No'})`, 11, { activeTree: treeIdx, currNodeId: node ? node.id : null, hlCheckNull: true, isLeaf: node?.isLeaf });

            if (node == null) {
                callStack.pop();
                return;
            }

            let isLeaf = node.left == null && node.right == null;
            add("Leaf Check", `if (node.left == null && node.right == null)\nDoes node ${node.val} have 0 children? (${isLeaf ? 'Yes, LEAF!' : 'No'})`, 12, { activeTree: treeIdx, currNodeId: node.id, hlCheckLeaf: true, isLeaf });

            if (isLeaf) {
                targetList.push(node.val);
                add("Collect Leaf", `leafValues.add(node.val);\nNode ${node.val} is a leaf. Adding to leaves${treeIdx} list.`, 13, { activeTree: treeIdx, currNodeId: node.id, hlAddLeaf: true, isLeaf });
            }

            add("Recurse Left", `dfs(node.left, leafValues);\nTraversing left child of ${node.val}.`, 15, { activeTree: treeIdx, currNodeId: node.id, hlRecurseLeft: true });
            dfs(node.left, treeIdx, targetList);

            add("Recurse Right", `dfs(node.right, leafValues);\nTraversing right child of ${node.val}.`, 16, { activeTree: treeIdx, currNodeId: node.id, hlRecurseRight: true });
            dfs(node.right, treeIdx, targetList);

            callStack.pop();
        };

        add("Function Call", `public boolean leafSimilar(TreeNode root1, TreeNode root2)`, 2, { activeTree: 0 });
        
        add("Init List 1", `List<Integer> leaves1 = new ArrayList<>();\nCreated list for Tree 1.`, 3, { activeTree: 0, hlInit: true });
        add("Init List 2", `List<Integer> leaves2 = new ArrayList<>();\nCreated list for Tree 2.`, 4, { activeTree: 0, hlInit: true });

        add("Process Tree 1", `dfs(root1, leaves1);\nInitiating Depth-First Search on the first tree.`, 5, { activeTree: 1, hlCallDfs1: true });
        dfs(tree1Data.root, 1, leaves1);

        add("Process Tree 2", `dfs(root2, leaves2);\nInitiating Depth-First Search on the second tree.`, 6, { activeTree: 2, hlCallDfs2: true });
        dfs(tree2Data.root, 2, leaves2);

        let l1Str = leaves1.join(',');
        let l2Str = leaves2.join(',');
        let isSimilar = l1Str === l2Str;

        add("Compare Lists", `return leaves1.equals(leaves2);\nComparing the final leaf sequences.\nleaves1: [${l1Str}]\nleaves2: [${l2Str}]\nMatch? ${isSimilar ? 'TRUE' : 'FALSE'}`, 7, { activeTree: 0, hlCompare: true, isSimilar });
        
        add("Execution Complete", `Algorithm finished. The trees are ${isSimilar ? '' : 'NOT '}leaf-similar.`, 8, { activeTree: 0, isSuccess: true, isSimilar, finalAns: isSimilar });

    } else if (selectedOpId === 'dfsIterative') {
        let stack1: any[] = [];
        let stack2: any[] = [];
        
        add("Function Call", `public boolean leafSimilar(TreeNode root1, TreeNode root2)`, 2, { activeTree: 0 });
        
        add("Init Stacks", `Stack<TreeNode> s1 = new Stack<>(), s2 = new Stack<>();\nCreated execution stacks on heap.`, 3, { activeTree: 0, s1: [...stack1], s2: [...stack2] });

        if (tree1Data.root) stack1.push(tree1Data.root);
        add("Push Root 1", `if (root1 != null) s1.push(root1);`, 4, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: tree1Data.root?.id, hlPush1: true });

        if (tree2Data.root) stack2.push(tree2Data.root);
        add("Push Root 2", `if (root2 != null) s2.push(root2);`, 5, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: tree2Data.root?.id, hlPush2: true });

        let match = true;
        while (stack1.length > 0 && stack2.length > 0) {
            if (steps.length > 2000) break;
            
            add("Loop Condition", `while (!s1.isEmpty() && !s2.isEmpty())\nBoth stacks have nodes, proceeding...`, 6, { activeTree: 0, s1: [...stack1], s2: [...stack2] });
            
            // --- Simulate getNextLeaf(s1) ---
            add("Call getNextLeaf(s1)", `if (getNextLeaf(s1) != getNextLeaf(s2))\nExecuting generator for Tree 1.`, 7, { activeTree: 1, s1: [...stack1], s2: [...stack2] });
            
            let leaf1 = null;
            while(true) {
                if (stack1.length === 0) break; // Should not happen in standard valid flow
                let node = stack1.pop();
                add("Pop s1", `TreeNode node = s.pop();\nPopping node ${node.val}`, 16, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: node.id });
                
                if (node.right) {
                    stack1.push(node.right);
                    add("Push Right", `if (node.right != null) s.push(node.right);\nPushed ${node.right.val}`, 17, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: node.id, hlPush1: true, pushId: node.right.id });
                }
                
                if (node.left) {
                    stack1.push(node.left);
                    add("Push Left", `if (node.left != null) s.push(node.left);\nPushed ${node.left.val}`, 18, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: node.id, hlPush1: true, pushId: node.left.id });
                }
                
                let isLeaf = node.left == null && node.right == null;
                add("Leaf Check", `if (node.left == null && node.right == null)\nIs node ${node.val} a leaf? ${isLeaf ? 'YES!' : 'NO'}`, 19, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: node.id, hlCheckLeaf: true, isLeaf });
                
                if (isLeaf) {
                    leaf1 = node.val;
                    leaves1.push(leaf1);
                    add("Yield Leaf 1", `return node.val;\nReturning leaf value ${node.val} to caller.`, 20, { activeTree: 1, s1: [...stack1], s2: [...stack2], currNode1: node.id, hlAddLeaf: true, leaf1 });
                    break;
                }
            }

            // --- Simulate getNextLeaf(s2) ---
            add("Call getNextLeaf(s2)", `if (getNextLeaf(s1) != getNextLeaf(s2))\nExecuting generator for Tree 2.`, 7, { activeTree: 2, s1: [...stack1], s2: [...stack2], leaf1 });
            
            let leaf2 = null;
            while(true) {
                if (stack2.length === 0) break;
                let node = stack2.pop();
                add("Pop s2", `TreeNode node = s.pop();\nPopping node ${node.val}`, 16, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: node.id, leaf1 });
                
                if (node.right) {
                    stack2.push(node.right);
                    add("Push Right", `if (node.right != null) s.push(node.right);\nPushed ${node.right.val}`, 17, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: node.id, hlPush2: true, pushId: node.right.id, leaf1 });
                }
                
                if (node.left) {
                    stack2.push(node.left);
                    add("Push Left", `if (node.left != null) s.push(node.left);\nPushed ${node.left.val}`, 18, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: node.id, hlPush2: true, pushId: node.left.id, leaf1 });
                }
                
                let isLeaf = node.left == null && node.right == null;
                add("Leaf Check", `if (node.left == null && node.right == null)\nIs node ${node.val} a leaf? ${isLeaf ? 'YES!' : 'NO'}`, 19, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: node.id, hlCheckLeaf: true, isLeaf, leaf1 });
                
                if (isLeaf) {
                    leaf2 = node.val;
                    leaves2.push(leaf2);
                    add("Yield Leaf 2", `return node.val;\nReturning leaf value ${node.val} to caller.`, 20, { activeTree: 2, s1: [...stack1], s2: [...stack2], currNode2: node.id, hlAddLeaf: true, leaf1, leaf2 });
                    break;
                }
            }

            // --- Compare Yielded Leaves ---
            add("Compare Iterative", `if (getNextLeaf(s1) != getNextLeaf(s2))\nDoes ${leaf1} == ${leaf2}?`, 7, { activeTree: 0, s1: [...stack1], s2: [...stack2], leaf1, leaf2, hlCompare: true, isSimilar: leaf1 === leaf2 });

            if (leaf1 !== leaf2) {
                add("Mismatch Return", `return false;\nImmediate Mismatch! Halting algorithm to save memory/time.`, 8, { activeTree: 0, s1: [...stack1], s2: [...stack2], isSimilar: false, isSuccess: true });
                match = false;
                break;
            }
        }
        
        if (match) {
            let finalMatch = stack1.length === 0 && stack2.length === 0;
            add("Final Check", `return s1.isEmpty() && s2.isEmpty();\nDid both trees run out of leaves simultaneously?`, 11, { activeTree: 0, s1: [...stack1], s2: [...stack2], isSimilar: finalMatch, hlCompare: true });
            add("Execution Complete", `Result: ${finalMatch ? 'TRUE' : 'FALSE'}`, 12, { activeTree: 0, s1: [...stack1], s2: [...stack2], isSuccess: true, isSimilar: finalMatch });
        }
    }

    return steps;
  }, [baseTree1Arr, baseTree2Arr, tree1Data, tree2Data, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    if (!codeContainerRef.current) return;
    const activeLineEl = document.getElementById(`code-line-${curStepData.line}`);
    if (activeLineEl) {
        const container = codeContainerRef.current;
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
    document.execCommand('copy');
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

  const renderVisuals = () => {
      if (tree1Data.nodes.length === 0 && tree2Data.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Trees...</span>;

      const maxDepth = Math.max(tree1Data.maxDepth, tree2Data.maxDepth);
      const treeContainerHeight = Math.max(250, (maxDepth + 1) * 60 + 80);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlCompare ? (st.isSimilar ? 'border-emerald-400 ring-4 ring-emerald-100' : 'border-rose-400 ring-4 ring-rose-100') : (st.hlAddLeaf ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100` : (st.hlCheckLeaf ? 'border-sky-300 ring-4 ring-sky-100' : 'border-slate-200'))}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Calculation Dashboard</span>
                      
                      {st.hlCompare ? (
                          <div className="flex flex-col w-full items-center gap-6 py-4 animate-in zoom-in duration-300">
                              <div className="flex justify-between items-center w-full gap-4 px-8 font-mono">
                                  <div className="flex-1 flex justify-end">
                                      <div className={`text-xl font-black bg-slate-50 border-2 border-slate-200 px-6 py-3 rounded-2xl ${st.isSimilar ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-slate-700'}`}>
                                          {selectedOpId === 'dfsRecursion' ? `[${st.leaves1.join(', ')}]` : (st.leaf1 !== undefined ? st.leaf1 : 'null')}
                                      </div>
                                  </div>
                                  <div className={`text-2xl font-black ${st.isSimilar ? 'text-emerald-500' : 'text-rose-500'}`}>
                                      {st.isSimilar ? '==' : '!='}
                                  </div>
                                  <div className="flex-1 flex justify-start">
                                      <div className={`text-xl font-black bg-slate-50 border-2 border-slate-200 px-6 py-3 rounded-2xl ${st.isSimilar ? 'text-emerald-700 border-emerald-300 bg-emerald-50' : 'text-slate-700'}`}>
                                          {selectedOpId === 'dfsRecursion' ? `[${st.leaves2.join(', ')}]` : (st.leaf2 !== undefined ? st.leaf2 : 'null')}
                                      </div>
                                  </div>
                              </div>
                              <span className={`text-xl font-black uppercase tracking-widest px-6 py-2 rounded-xl text-white shadow-md ${st.isSimilar ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                  {st.isSimilar ? 'Matches!' : 'Mismatch Found'}
                              </span>
                          </div>
                      ) : st.currNodeId === null && st.hlCheckNull ? (
                          <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                               <div className="flex items-center gap-4 text-sky-600 font-mono font-black text-xl bg-sky-50 px-6 py-3 rounded-2xl border-2 border-sky-300 shadow-md">
                                   <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-200">return</span>
                               </div>
                          </div>
                      ) : (st.currNode1 !== null || st.currNode2 !== null) && (st.hlCheckLeaf || st.hlAddLeaf) ? (
                          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2">
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>node.left</span>
                                  <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      null
                                  </div>
                              </div>
                              <span className="text-xl font-black text-slate-300">&&</span>
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>node.right</span>
                                  <div className={`border-2 text-2xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-200 text-slate-500`}>
                                      null
                                  </div>
                              </div>
                              <span className="text-xl font-black text-slate-300">&rarr;</span>
                              <div className="flex flex-col items-center min-w-[100px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlAddLeaf ? `text-${themeColor}-500` : 'text-slate-400'}`}>Is Leaf?</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlAddLeaf ? `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-800 scale-110 shadow-lg` : (st.isLeaf ? 'bg-emerald-100 border-emerald-400 text-emerald-800' : 'bg-rose-100 border-rose-400 text-rose-800')}`}>
                                      {st.isLeaf ? 'YES' : 'NO'}
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center w-full min-h-[80px]">
                              <span className="text-slate-400 italic text-sm font-mono">Traversing/Processing...</span>
                          </div>
                      )}

                  </div>
              </div>

              {/* Middle: Leaf Arrays / Stacks */}
              <div className="flex w-full max-w-6xl gap-6 px-4">
                  <div className={`flex-1 flex flex-col bg-white p-4 rounded-2xl border-2 shadow-sm transition-all duration-500 ${st.activeTree === 1 ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200 opacity-60'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                          {selectedOpId === 'dfsIterative' ? 's1 (Tree 1 Stack)' : 'leaves1 (Tree 1 List)'}
                      </span>
                      <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none">
                          {selectedOpId === 'dfsIterative' ? (
                              <>
                                  <span className="text-slate-300 text-xs font-black uppercase">BOT</span>
                                  {st.s1 && st.s1.map((node: any, idx: number) => (
                                      <div key={`s1-${idx}`} className={`shrink-0 w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-lg ${idx === st.s1.length - 1 ? 'bg-amber-100 text-amber-800 border-amber-500 ring-2 ring-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{node.val}</div>
                                  ))}
                                  {st.s1 && st.s1.length === 0 && <span className="text-slate-300 italic text-xs ml-2">Empty</span>}
                                  <span className="text-slate-300 text-xs font-black uppercase ml-auto">TOP</span>
                              </>
                          ) : (
                              <>
                                  {st.leaves1 && st.leaves1.map((val: number, idx: number) => (
                                      <div key={`l1-${idx}`} className={`shrink-0 w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-lg ${idx === st.leaves1.length - 1 && st.hlAddLeaf && st.activeTree === 1 ? 'bg-teal-500 text-white border-teal-600 scale-110 shadow-md animate-in zoom-in' : 'bg-teal-50 border-teal-200 text-teal-800'}`}>{val}</div>
                                  ))}
                                  {st.leaves1 && st.leaves1.length === 0 && <span className="text-slate-300 italic text-xs">Empty</span>}
                              </>
                          )}
                      </div>
                  </div>
                  
                  <div className={`flex-1 flex flex-col bg-white p-4 rounded-2xl border-2 shadow-sm transition-all duration-500 ${st.activeTree === 2 ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200 opacity-60'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">
                          {selectedOpId === 'dfsIterative' ? 's2 (Tree 2 Stack)' : 'leaves2 (Tree 2 List)'}
                      </span>
                      <div className="flex gap-2 min-h-[40px] items-center overflow-x-auto scrollbar-none">
                          {selectedOpId === 'dfsIterative' ? (
                              <>
                                  <span className="text-slate-300 text-xs font-black uppercase">BOT</span>
                                  {st.s2 && st.s2.map((node: any, idx: number) => (
                                      <div key={`s2-${idx}`} className={`shrink-0 w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-lg ${idx === st.s2.length - 1 ? 'bg-amber-100 text-amber-800 border-amber-500 ring-2 ring-amber-200' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>{node.val}</div>
                                  ))}
                                  {st.s2 && st.s2.length === 0 && <span className="text-slate-300 italic text-xs ml-2">Empty</span>}
                                  <span className="text-slate-300 text-xs font-black uppercase ml-auto">TOP</span>
                              </>
                          ) : (
                              <>
                                  {st.leaves2 && st.leaves2.map((val: number, idx: number) => (
                                      <div key={`l2-${idx}`} className={`shrink-0 w-10 h-10 flex items-center justify-center border-2 rounded-lg font-mono font-black text-lg ${idx === st.leaves2.length - 1 && st.hlAddLeaf && st.activeTree === 2 ? 'bg-teal-500 text-white border-teal-600 scale-110 shadow-md animate-in zoom-in' : 'bg-teal-50 border-teal-200 text-teal-800'}`}>{val}</div>
                                  ))}
                                  {st.leaves2 && st.leaves2.length === 0 && <span className="text-slate-300 italic text-xs">Empty</span>}
                              </>
                          )}
                      </div>
                  </div>
              </div>

              {/* Free-floating Interactive State Space Trees */}
              <div className="flex flex-col lg:flex-row items-center justify-center gap-8 relative w-full mt-4 max-w-6xl">
                  
                  {/* Tree 1 */}
                  <div className={`relative flex-1 w-full transition-all duration-700 ${st.activeTree === 1 || st.activeTree === 0 ? 'opacity-100' : 'opacity-30 scale-95 blur-[1px]'}`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap`}><Network size={12} className="inline mr-1"/> Tree 1 (root1)</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {tree1Data.edges.map((edge: any, i: number) => {
                                  let isActive = false;
                                  if (st.activeTree === 1) {
                                      if (selectedOpId === 'dfsRecursion') {
                                          if (st.currNodeId === edge.target) isActive = true;
                                          if (st.currNodeId === edge.source && ((st.hlRecurseLeft) || (st.hlRecurseRight))) isActive = true;
                                      } else {
                                          if (st.currNode1 === edge.source && st.hlPush1 && st.pushId === edge.target) isActive = true;
                                      }
                                  }
                                  let strokeColor = isActive ? (themeColor === 'teal' ? '#14b8a6' : '#f59e0b') : '#cbd5e1'; 
                                  let strokeWidth = isActive ? 4 : 2;
                                  let opacity = isActive ? 1 : 0.6;
                                  return <line key={`edge1-${i}`} x1={`${edge.sx}%`} y1={edge.sy + 16} x2={`${edge.tx}%`} y2={edge.ty - 16} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {tree1Data.nodes.map((node: any) => {
                              let isActive = st.activeTree === 1 && (selectedOpId === 'dfsRecursion' ? st.currNodeId === node.id : st.currNode1 === node.id);
                              let isLeaf = node.isLeaf;
                              let inStack = selectedOpId === 'dfsIterative' && st.s1?.some((n: any) => n.id === node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-600";
                              if (isActive) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 ring-4 ring-${themeColor}-200 shadow-xl text-${themeColor}-900 scale-125 z-30`;
                              } else if (inStack) {
                                  bgClass = "bg-amber-50 border-amber-400 text-amber-800 shadow-md ring-2 ring-amber-200 z-20 scale-110";
                              } else if (isLeaf) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm z-20 border-dashed";
                              } else {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-80 z-10 scale-95";
                              }
                              
                              return (
                                  <div key={`node1-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black text-${themeColor}-600 font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded border border-${themeColor}-200 shadow-sm animate-bounce`}>
                                              curr
                                          </span>
                                      )}
                                      <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-sm md:text-lg`}>{node.val}</span>
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>

                  {/* Divider line for wide screens */}
                  <div className="hidden lg:block w-px bg-slate-200 absolute left-1/2 top-0 bottom-0 -translate-x-1/2 opacity-50"></div>

                  {/* Tree 2 */}
                  <div className={`relative flex-1 w-full transition-all duration-700 ${st.activeTree === 2 || st.activeTree === 0 ? 'opacity-100' : 'opacity-30 scale-95 blur-[1px]'}`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap`}><Network size={12} className="inline mr-1"/> Tree 2 (root2)</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {tree2Data.edges.map((edge: any, i: number) => {
                                  let isActive = false;
                                  if (st.activeTree === 2) {
                                      if (selectedOpId === 'dfsRecursion') {
                                          if (st.currNodeId === edge.target) isActive = true;
                                          if (st.currNodeId === edge.source && ((st.hlRecurseLeft) || (st.hlRecurseRight))) isActive = true;
                                      } else {
                                          if (st.currNode2 === edge.source && st.hlPush2 && st.pushId === edge.target) isActive = true;
                                      }
                                  }
                                  let strokeColor = isActive ? (themeColor === 'teal' ? '#14b8a6' : '#f59e0b') : '#cbd5e1'; 
                                  let strokeWidth = isActive ? 4 : 2;
                                  let opacity = isActive ? 1 : 0.6;
                                  return <line key={`edge2-${i}`} x1={`${edge.sx}%`} y1={edge.sy + 16} x2={`${edge.tx}%`} y2={edge.ty - 16} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {tree2Data.nodes.map((node: any) => {
                              let isActive = st.activeTree === 2 && (selectedOpId === 'dfsRecursion' ? st.currNodeId === node.id : st.currNode2 === node.id);
                              let isLeaf = node.isLeaf;
                              let inStack = selectedOpId === 'dfsIterative' && st.s2?.some((n: any) => n.id === node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-600";
                              if (isActive) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 ring-4 ring-${themeColor}-200 shadow-xl text-${themeColor}-900 scale-125 z-30`;
                              } else if (inStack) {
                                  bgClass = "bg-amber-50 border-amber-400 text-amber-800 shadow-md ring-2 ring-amber-200 z-20 scale-110";
                              } else if (isLeaf) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm z-20 border-dashed";
                              } else {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-400 opacity-80 z-10 scale-95";
                              }
                              
                              return (
                                  <div key={`node2-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black text-${themeColor}-600 font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded border border-${themeColor}-200 shadow-sm animate-bounce`}>
                                              curr
                                          </span>
                                      )}
                                      <div className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-sm md:text-lg`}>{node.val}</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Leaf-Similar Trees</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 872</span>
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
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Leaf size={28}/> Sequence of Leaves</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Consider all the leaves of a binary tree, from left to right order. The values of those leaves form a <strong>leaf value sequence</strong>.</p>
                        <p>Two binary trees are considered <em>leaf-similar</em> if their leaf value sequences are the exact same.</p>
                        <p className="font-bold mt-4">Return <code>true</code> if and only if the two given trees with head nodes <code>root1</code> and <code>root2</code> are leaf-similar.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-6`}>
                        <div className="w-full">
                           <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                           <span className="text-slate-300 block mb-2"><strong>Input:</strong> root1 = [3,5,1,6,2,9,8,null,null,7,4], root2 = [3,5,1,6,7,4,2,null,null,null,null,null,null,9,8]</span>
                           <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                           <span className="text-slate-300 block mb-4">true</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 w-full overflow-x-auto">
                            {/* Tree 1 SVG */}
                            <div className="flex flex-col items-center shrink-0">
                                <span className="text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">Tree 1</span>
                                <svg width="200" height="160" viewBox="0 0 200 160">
                                    <line x1="100" y1="20" x2="50" y2="60" stroke="#475569" strokeWidth="2" />
                                    <line x1="100" y1="20" x2="150" y2="60" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="60" x2="25" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="60" x2="75" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="150" y1="60" x2="125" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="150" y1="60" x2="175" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="75" y1="100" x2="55" y2="140" stroke="#475569" strokeWidth="2" />
                                    <line x1="75" y1="100" x2="95" y2="140" stroke="#475569" strokeWidth="2" />
                                    
                                    <circle cx="100" cy="20" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="100" y="24" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                    <circle cx="50" cy="60" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="50" y="64" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                    <circle cx="150" cy="60" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="150" y="64" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                    <circle cx="75" cy="100" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="75" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                    {/* Leaves */}
                                    <circle cx="25" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="25" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                    <circle cx="55" cy="140" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="55" y="144" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                    <circle cx="95" cy="140" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="95" y="144" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                    <circle cx="125" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="125" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">9</text>
                                    <circle cx="175" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="175" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">8</text>
                                </svg>
                            </div>
                            
                            <div className="text-2xl font-black text-slate-500">==</div>
                            
                            {/* Tree 2 SVG */}
                            <div className="flex flex-col items-center shrink-0">
                                <span className="text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">Tree 2</span>
                                <svg width="200" height="160" viewBox="0 0 200 160">
                                    <line x1="100" y1="20" x2="50" y2="60" stroke="#475569" strokeWidth="2" />
                                    <line x1="100" y1="20" x2="150" y2="60" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="60" x2="25" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="60" x2="75" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="150" y1="60" x2="125" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="150" y1="60" x2="175" y2="100" stroke="#475569" strokeWidth="2" />
                                    <line x1="175" y1="100" x2="155" y2="140" stroke="#475569" strokeWidth="2" />
                                    <line x1="175" y1="100" x2="195" y2="140" stroke="#475569" strokeWidth="2" />
                                    
                                    <circle cx="100" cy="20" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="100" y="24" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                    <circle cx="50" cy="60" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="50" y="64" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                    <circle cx="150" cy="60" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="150" y="64" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                    <circle cx="175" cy="100" r="14" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="175" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                    {/* Leaves */}
                                    <circle cx="25" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="25" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                    <circle cx="75" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="75" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                    <circle cx="125" cy="100" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="125" y="104" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                    <circle cx="155" cy="140" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="155" y="144" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">9</text>
                                    <circle cx="195" cy="140" r="14" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="195" y="144" fill="#14b8a6" fontSize="12" textAnchor="middle" fontWeight="bold">8</text>
                                </svg>
                            </div>
                        </div>
                        <div>
                           <span className="text-sky-400 block mt-2 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                           <span className="text-slate-400 text-xs whitespace-normal leading-relaxed">
                               The leaf nodes (highlighted in <span className={`text-${themeColor}-400 font-bold`}>teal</span>) of both trees share the exact same sequence from left to right: [6, 7, 4, 9, 8].
                           </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-6`}>
                        <div className="w-full">
                           <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                           <span className="text-slate-300 block mb-2"><strong>Input:</strong> root1 = [1,2,3], root2 = [1,3,2]</span>
                           <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                           <span className="text-slate-300 block mb-4">false</span>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700/50 w-full overflow-x-auto">
                            {/* Tree 1 SVG */}
                            <div className="flex flex-col items-center shrink-0">
                                <span className="text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">Tree 1</span>
                                <svg width="100" height="90" viewBox="0 0 100 90">
                                    <line x1="50" y1="20" x2="25" y2="70" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="20" x2="75" y2="70" stroke="#475569" strokeWidth="2" />
                                    
                                    <circle cx="50" cy="20" r="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="50" y="24" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">1</text>
                                    
                                    {/* Leaves */}
                                    <circle cx="25" cy="70" r="12" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="25" y="74" fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">2</text>
                                    
                                    <circle cx="75" cy="70" r="12" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="75" y="74" fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">3</text>
                                </svg>
                            </div>
                            
                            <div className="text-2xl font-black text-rose-500">!=</div>
                            
                            {/* Tree 2 SVG */}
                            <div className="flex flex-col items-center shrink-0">
                                <span className="text-xs text-slate-400 mb-2 font-bold tracking-widest uppercase">Tree 2</span>
                                <svg width="100" height="90" viewBox="0 0 100 90">
                                    <line x1="50" y1="20" x2="25" y2="70" stroke="#475569" strokeWidth="2" />
                                    <line x1="50" y1="20" x2="75" y2="70" stroke="#475569" strokeWidth="2" />
                                    
                                    <circle cx="50" cy="20" r="12" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                                    <text x="50" y="24" fill="#94a3b8" fontSize="11" textAnchor="middle" fontWeight="bold">1</text>
                                    
                                    {/* Leaves */}
                                    <circle cx="25" cy="70" r="12" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="25" y="74" fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">3</text>
                                    
                                    <circle cx="75" cy="70" r="12" fill="#042f2e" stroke="#14b8a6" strokeWidth="2" />
                                    <text x="75" y="74" fill="#14b8a6" fontSize="11" textAnchor="middle" fontWeight="bold">2</text>
                                </svg>
                            </div>
                        </div>
                        <div>
                           <span className="text-sky-400 block mt-2 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                           <span className="text-slate-400 text-xs whitespace-normal leading-relaxed">
                               The leaf sequence of Tree 1 is [2, 3], while the leaf sequence of Tree 2 is [3, 2]. They do not match.
                           </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in each tree will be in the range [1, 200].</li>
                            <li>Both of the given trees will have values in the range [0, 200].</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed text-slate-600">The physical structure of the trees might be completely different. One could be heavily skewed left, the other skewed right. We cannot compare the trees structurally. We must extract the specific data points (leaves) in a guaranteed left-to-right order.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>DFS (Recursive):</strong> Extremely short code to write. Walks through the tree left-to-right, dumping leaves into two lists, then returns <code>list1.equals(list2)</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>DFS (Iterative):</strong> Uses stacks to implement a "generator" pattern. Safes space and time by halting the instant a mismatch is found without finishing the tree traversals.</p>
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
                  <div ref={codeContainerRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-8 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree 1 Input</label>
                            <input type="text" value={tree1Input} onChange={(e) => setTree1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 5, 1..." />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree 2 Input</label>
                            <input type="text" value={tree2Input} onChange={(e) => setTree2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 5, 1..." />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> COMPARISON COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">The trees are {st.isSimilar ? '' : 'NOT '}leaf-similar.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCompare ? 'text-amber-400' : (st.hlAddLeaf ? `text-${themeColor}-400` : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                                           <div key={`frame-${idx}`} className={`w-full py-2 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-teal-500 text-white border-teal-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding tree traversal order and memory constraints.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Leaf size={24} className="text-teal-500"/> 1. Left-to-Right Traversal Guarantee</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The problem strictly asks for the leaf sequence <strong>from left to right</strong>. This means we cannot use Breadth-First Search (BFS / Level Order), because BFS reads leaves based on their vertical depth, not their horizontal position.</p>
                        <p className="text-slate-600 leading-relaxed">Depth-First Search (DFS) inherently respects horizontal positioning. As long as our code says <code>dfs(node.left)</code> before <code>dfs(node.right)</code>, we are mathematically guaranteed to hit the leftmost remaining leaf before any leaves to its right, constructing the exact correct sequence.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><LayersIcon size={24} className="text-amber-500"/> 2. The Iterator Optimization</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Our basic recursive approach collects all leaves into two full lists taking $O(N_1 + N_2)$ space. Can we do better?</p>
                        <p className="text-slate-600 leading-relaxed">Yes! Instead of building full arrays, we can write an <strong>Iterator</strong> (or a Generator) that pauses its traversal the moment it finds a single leaf, yields it, and waits. We step both iterators simultaneously. If they ever yield different values, we return false immediately. This prevents traversing massive trees if the very first leaf is already a mismatch, optimizing average-case time and space to $O(H)$ instead of $O(N)$.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N1 + N2).</strong> In the worst case (the trees are entirely identical), we must visit every single node in both trees.</li>
                            <li><strong>Space Complexity (Iterative): O(H1 + H2).</strong> The recursive list method takes $O(N)$ space to store the arrays. But the optimized Iterative method only stores the call stack pointers in heap memory, taking space strictly bounded by the maximum height of the trees!</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a foundational tree traversal problem. While building two lists is acceptable, top-tier interviewers will heavily push you to discuss the iterative/generator approach to save space."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-teal-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-teal-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Does it matter if we use Pre-order, In-order, or Post-order traversal for this problem?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it doesn't matter for the leaf sequence!</p>
                            <p>The only thing that defines left-to-right order is ensuring that we recurse into the <code>left</code> child before the <code>right</code> child. Pre/In/Post order refers to when we evaluate the <em>current</em> node relative to its children. Since we only evaluate (add to list) nodes that have <em>no</em> children, the structural 'order' of the parent node evaluation is entirely irrelevant. The leaves will always be collected in the exact same sequence."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Instead of building two entire lists, how would you write this using String builders and comparing strings?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "You could pass a <code>StringBuilder</code> to the DFS and append the leaf values with a delimiter (like <code>sb.append(node.val).append("-")</code>). Then at the end, just return <code>sb1.toString().equals(sb2.toString())</code>.</p>
                            <p>However, I would warn against this. Strings take up significantly more memory per element than an integer in an ArrayList, and string comparison on massive strings can be slightly less efficient. The delimiter is also strictly necessary to prevent bugs (e.g., distinguishing leaf <code>12</code> from leaves <code>1</code> and <code>2</code>). Lists are much cleaner."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If the trees have a million nodes, but the very first leaf on the left is different, does your first algorithm still traverse the whole tree?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, and that's the primary weakness of the basic recursive approach.</p>
                            <p>Because we use standard recursion to fully populate both lists before comparing them, we will do a massive amount of unnecessary work. To fix this, I would implement an explicit <code>Stack&lt;TreeNode&gt;</code> to simulate the DFS iteratively. I would write a <code>getNextLeaf()</code> function that advances the stack until it pops a leaf. Then the main function would just loop: <code>while(true) if (getNextLeaf(s1) != getNextLeaf(s2)) return false;</code>, terminating instantly on a mismatch."</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              <GitPullRequest size={20}/>
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
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlCompare ? 'text-amber-400' : (st.hlCheckNull ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div ref={codeContainerRef} className="bg-black/20 rounded-2xl border border-white/5 p-4 overflow-x-hidden scroll-smooth max-h-[400px] overflow-y-auto">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Call Stack Panel for Fullscreen */}
                  {!st.isSuccess && selectedOpId === 'dfsRecursion' && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                              </div>
                              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                  {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                      let isTop = idx === 0;
                                      return (
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-teal-500 text-white border-teal-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree 1</label>
                              <input type="text" value={tree1Input} onChange={(e) => setTree1Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 5, 1..." />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree 2</label>
                              <input type="text" value={tree2Input} onChange={(e) => setTree2Input(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 5, 1..." />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSimilar ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(244,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSimilar ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg ring-4 ${st.isSimilar ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10 animate-bounce' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSimilar ? <Trophy size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPARISON COMPLETE</h2>
                                <p className={`${st.isSimilar ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.isSimilar ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Are they Leaf-Similar?</div>
                                    <div className={`font-mono text-5xl font-black leading-relaxed flex items-center gap-2 ${st.isSimilar ? 'text-white' : 'text-rose-400'}`}>{st.isSimilar ? 'TRUE' : 'FALSE'}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg hover:bg-slate-700 shadow-black/20 ${st.isSimilar ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-700'}`}>
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