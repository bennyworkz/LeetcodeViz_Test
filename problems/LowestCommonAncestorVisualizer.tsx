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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursiveDfs: {
    id: 'recursiveDfs',
    title: '1. Recursive DFS (Optimal)',
    icon: <GitMerge size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'amber',
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
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || root.val == p.val || root.val == q.val) {
            return root;
        }
        
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        
        if (left != null && right != null) {
            return root;
        }
        
        return left != null ? left : right;
    }
}`,
    desc: "The standard and most elegant approach. We traverse the tree using Depth-First Search. If we find node 'p' or 'q', we immediately return it upwards. A node checks what its left and right children returned. If both children returned a non-null value, it means 'p' is in one branch and 'q' is in the other—making the current node their Lowest Common Ancestor! We return the current node. If only one child returns a value, we bubble that value up. This brilliantly finds the LCA in a single O(N) pass."
  },
  iterativeParent: {
    id: 'iterativeParent',
    title: '2. Iterative Parent Map',
    icon: <MapIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'indigo',
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
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        parent.put(root, null);
        stack.push(root);
        
        while (!parent.containsKey(p) || !parent.containsKey(q)) {
            TreeNode node = stack.pop();
            if (node.left != null) {
                parent.put(node.left, node);
                stack.push(node.left);
            }
            if (node.right != null) {
                parent.put(node.right, node);
                stack.push(node.right);
            }
        }
        
        Set<TreeNode> ancestors = new HashSet<>();
        while (p != null) {
            ancestors.add(p);
            p = parent.get(p);
        }
        
        while (!ancestors.contains(q)) {
            q = parent.get(q);
        }
        return q;
    }
}`,
    desc: "An iterative approach that maps the parent of every node. We traverse the tree (using a Stack) until we have found both 'p' and 'q', tracking each child's parent. Once found, we start from 'p' and use the map to travel upwards to the root, adding all of p's ancestors to a HashSet. Finally, we start from 'q' and travel upwards. The first ancestor of 'q' that is already present in our HashSet is mathematically guaranteed to be the Lowest Common Ancestor."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|new|String|lowestCommonAncestor|TreeNode|Solution|root|null|this|left|right|p|q|node|val|Map|HashMap|Set|HashSet|Deque|ArrayDeque|push|pop|put|get|containsKey|contains|add|parent|stack|ancestors)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'double', 'boolean', 'class', 'return', 'if', 'else', 'while', 'new', 'null', 'this'].includes(part);
            const isObject = ['TreeNode', 'Solution', 'Map', 'HashMap', 'Set', 'HashSet', 'Deque', 'ArrayDeque'].includes(part);
            const isPointer = ['root', 'left', 'right', 'p', 'q', 'node', 'val', 'x', 'parent', 'stack', 'ancestors'].includes(part);
            const isMapCall = ['lowestCommonAncestor', 'push', 'pop', 'put', 'get', 'containsKey', 'contains', 'add'].includes(part);
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

export default function LowestCommonAncestorVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('recursiveDfs');
  
  const [treeInput, setTreeInput] = useState('3, 5, 1, 6, 2, 0, 8, null, null, 7, 4');
  const [pInput, setPInput] = useState('5');
  const [qInput, setQInput] = useState('1');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  const [baseP, setBaseP] = useState<number>(5);
  const [baseQ, setBaseQ] = useState<number>(1);

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
      setBaseTreeArr(parseTreeInput(treeInput, [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]));
      let parsedP = parseInt(pInput.trim(), 10);
      let parsedQ = parseInt(qInput.trim(), 10);
      setBaseP(isNaN(parsedP) ? 5 : parsedP);
      setBaseQ(isNaN(parsedQ) ? 1 : parsedQ);
      
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(0.85);
    }, 400);
    return () => clearTimeout(timer);
  }, [treeInput, pInput, qInput, selectedOpId]);

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

    let pVal = baseP;
    let qVal = baseQ;

    // Search for P and Q in the actual tree to get their IDs
    let pNodeObj = treeData.nodes.find((n:any) => n.val === pVal);
    let qNodeObj = treeData.nodes.find((n:any) => n.val === qVal);

    if (selectedOpId === 'recursiveDfs') {
        let callStack: string[] = [];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                callStack: [...callStack],
                pVal, qVal,
                ...st 
            } 
        });

        const dfs = (node: any | null, parentId: number | null = null): number | null => {
            if (steps.length > 3000) return null; // Guard
            
            let callStr = `lca(${node ? node.val : 'null'}, ${pVal}, ${qVal})`;
            callStack.push(callStr);

            add("DFS Entry", `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)\nEntering node ${node ? node.val : 'null'}.`, 12, { currNodeId: node ? node.id : null, parentId });

            let isMatchP = node && node.val === pVal;
            let isMatchQ = node && node.val === qVal;
            let isNull = node == null;
            
            add("Base Case Check", `if (root == null || root.val == p.val || root.val == q.val)\nIs node null? (${isNull}). Is node p (${pVal})? (${isMatchP}). Is node q (${qVal})? (${isMatchQ}).`, 13, { currNodeId: node ? node.id : null, parentId, hlBaseCheck: true });

            if (isNull || isMatchP || isMatchQ) {
                let retStr = isNull ? 'null' : node.val;
                add("Return Base Case", `return root;\nBase condition met. Returning ${retStr} upwards.`, 14, { currNodeId: node ? node.id : null, parentId, hlReturnBase: true, returnedVal: node ? node.val : null });
                callStack.pop();
                return node ? node.val : null;
            }

            add("Recurse Left", `TreeNode left = lowestCommonAncestor(root.left, p, q);\nTraversing left child of ${node.val}.`, 17, { currNodeId: node.id, hlRecurseLeft: true });
            let leftVal = dfs(node.left, node.id);

            add("Recurse Right", `TreeNode right = lowestCommonAncestor(root.right, p, q);\nTraversing right child of ${node.val}.`, 18, { currNodeId: node.id, leftVal, hlRecurseRight: true });
            let rightVal = dfs(node.right, node.id);

            let bothFound = leftVal !== null && rightVal !== null;
            add("Check Child Returns", `if (left != null && right != null)\nLeft returned: ${leftVal}. Right returned: ${rightVal}. Are both non-null? (${bothFound ? 'Yes' : 'No'})`, 20, { currNodeId: node.id, leftVal, rightVal, hlCheckBoth: true });

            if (bothFound) {
                add("LCA Found!", `return root;\nBoth children returned targets! This node (${node.val}) is the Lowest Common Ancestor. Returning it upwards.`, 21, { currNodeId: node.id, leftVal, rightVal, hlReturnRoot: true, returnedVal: node.val, isLca: true });
                callStack.pop();
                return node.val;
            }

            let returnVal = leftVal !== null ? leftVal : rightVal;
            add("Return Non-Null Child", `return left != null ? left : right;\nOnly one (or zero) children returned a target. Bubbling up ${returnVal}.`, 24, { currNodeId: node.id, leftVal, rightVal, hlReturnChild: true, returnedVal: returnVal });

            callStack.pop();
            return returnVal;
        };

        if (baseTreeArr.length === 0) {
            add("Empty Tree", "Tree is empty, returning null.", 13, { isSuccess: true, finalAns: null });
            return steps;
        }

        add("Function Call", `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q)`, 12, {});
        
        let finalAns = dfs(treeData.root, null);
        
        add("Execution Complete", `Traversal finished. The Lowest Common Ancestor is ${finalAns}.`, 24, { isSuccess: true, finalAns: finalAns });
    }
    else if (selectedOpId === 'iterativeParent') {
        let parentMap: Record<number, number | null> = {};
        let stack: number[] = [];
        let ancestors = new Set<number>();
        let pFound = false;
        let qFound = false;

        const addIter = (ph: string, ds: string, ln: number, st: any) => steps.push({
            phase: ph, description: ds, line: ln, state: {
                parentMap: {...parentMap}, stackState: [...stack], ancestors: new Set(ancestors), pVal, qVal, ...st
            }
        });

        addIter("Init Structures", "Map<TreeNode, TreeNode> parent = new HashMap<>();\nDeque<TreeNode> stack = new ArrayDeque<>();\nInitialize map for parent pointers and stack for traversal.", 13, { hlInit: true });
        
        if (!treeData.root) {
            addIter("Empty Tree", "Tree is empty", 13, { isSuccess: true, finalAns: null });
            return steps;
        }
        if (!pNodeObj || !qNodeObj) {
            addIter("Error", "Nodes P or Q not found in the tree array. Please adjust inputs.", 13, { isSuccess: true, finalAns: null });
            return steps;
        }

        let pId = pNodeObj.id;
        let qId = qNodeObj.id;

        parentMap[treeData.root.id] = null;
        addIter("Map Root", `parent.put(root, null);\nRoot node ${treeData.root.val} has no parent.`, 15, { hlMapPush: treeData.root.id });
        
        stack.push(treeData.root.id);
        addIter("Push Root", `stack.push(root);\nPushing root to start traversal.`, 16, { hlStackPush: treeData.root.id });

        while (stack.length > 0) {
            if (steps.length > 3000) break;
            
            pFound = Object.keys(parentMap).includes(pId.toString());
            qFound = Object.keys(parentMap).includes(qId.toString());

            addIter("Check Search Condition", `while (!parent.containsKey(p) || !parent.containsKey(q))\nFound P (${pVal})? ${pFound}. Found Q (${qVal})? ${qFound}.`, 18, { pFound, qFound });

            if (pFound && qFound) {
                addIter("Both Nodes Mapped", `while (!parent.containsKey(p) || !parent.containsKey(q))\nBoth P and Q exist in parent map! We can stop searching.`, 18, { pFound, qFound });
                break;
            }

            let currNodeId = stack.pop()!;
            let currNode = treeData.nodes.find((n:any) => n.id === currNodeId);
            
            addIter("Pop Node", `TreeNode node = stack.pop();\nProcessing node ${currNode.val}.`, 19, { currNodeId });

            if (currNode.originalNode.left) {
                addIter("Check Left Child", `if (node.left != null)\nLeft child is ${currNode.originalNode.left.val}.`, 20, { currNodeId, hlCheckLeft: true });
                parentMap[currNode.originalNode.left.id] = currNodeId;
                addIter("Map Left Child", `parent.put(node.left, node);\nMap ${currNode.originalNode.left.val} -> ${currNode.val}.`, 21, { currNodeId, hlMapPush: currNode.originalNode.left.id });
                stack.push(currNode.originalNode.left.id);
                addIter("Push Left Child", `stack.push(node.left);`, 22, { currNodeId, hlStackPush: currNode.originalNode.left.id });
            } else {
                addIter("Check Left Child", `if (node.left != null)\nLeft child is null.`, 20, { currNodeId, hlCheckLeft: true });
            }

            if (currNode.originalNode.right) {
                addIter("Check Right Child", `if (node.right != null)\nRight child is ${currNode.originalNode.right.val}.`, 24, { currNodeId, hlCheckRight: true });
                parentMap[currNode.originalNode.right.id] = currNodeId;
                addIter("Map Right Child", `parent.put(node.right, node);\nMap ${currNode.originalNode.right.val} -> ${currNode.val}.`, 25, { currNodeId, hlMapPush: currNode.originalNode.right.id });
                stack.push(currNode.originalNode.right.id);
                addIter("Push Right Child", `stack.push(node.right);`, 26, { currNodeId, hlStackPush: currNode.originalNode.right.id });
            } else {
                addIter("Check Right Child", `if (node.right != null)\nRight child is null.`, 24, { currNodeId, hlCheckRight: true });
            }
        }

        // Phase 2: Ancestors
        addIter("Init Ancestors", `Set<TreeNode> ancestors = new HashSet<>();\nCreate a set to store all ancestors of p.`, 30, { hlInitAncestors: true });

        let trackingP: number | null = pId;
        while (trackingP !== null) {
            addIter("Trace P Ancestor Loop", `while (p != null)\nCurrent p is ${treeData.nodes.find((n:any)=>n.id===trackingP)?.val}.`, 31, { currP: trackingP });
            ancestors.add(trackingP);
            addIter("Add P to Ancestors", `ancestors.add(p);\nAdded node ${treeData.nodes.find((n:any)=>n.id===trackingP)?.val} to ancestors set.`, 32, { currP: trackingP, hlAddAncestor: trackingP });
            trackingP = parentMap[trackingP];
            addIter("Move P to Parent", `p = parent.get(p);\nMoving p upwards to its parent.`, 33, { currP: trackingP });
        }

        addIter("Trace P Complete", `while (p != null)\np is null (reached above root). Trace complete.`, 31, { currP: null });

        // Phase 3: Trace Q
        let trackingQ: number = qId;
        while (true) {
            if (steps.length > 3000) break;
            
            let isContained = ancestors.has(trackingQ);
            addIter("Trace Q Ancestor Loop", `while (!ancestors.contains(q))\nIs ${treeData.nodes.find((n:any)=>n.id===trackingQ)?.val} in ancestors? (${isContained ? 'YES' : 'NO'})`, 36, { currQ: trackingQ, hlCheckAncestor: trackingQ, isContained });
            
            if (isContained) {
                break;
            }

            trackingQ = parentMap[trackingQ] as number;
            addIter("Move Q to Parent", `q = parent.get(q);\nMoving q upwards to its parent.`, 37, { currQ: trackingQ });
        }
        
        addIter("Intersection Found", `while (!ancestors.contains(q))\nFound the lowest common ancestor!`, 36, { currQ: trackingQ, isLca: true });
        
        let finalLcaVal = treeData.nodes.find((n:any)=>n.id===trackingQ)?.val;
        addIter("Return LCA", `return q;\nThe Lowest Common Ancestor is ${finalLcaVal}.`, 39, { currQ: trackingQ, isSuccess: true, finalAns: finalLcaVal });
    }

    return steps;
  }, [baseTreeArr, baseP, baseQ, treeData, selectedOpId]);

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

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      // Container needs enough height to fit the whole tree without overlapping UI elements
      const treeContainerHeight = Math.max(450, (treeData.maxDepth + 1) * 70 + 160);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Path Condition Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {selectedOpId === 'recursiveDfs' ? (
                      <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isLca ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> Active Node Evaluation</span>
                          
                          {st.currNodeId === null && st.hlBaseCheck ? (
                              <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                                   <div className="flex items-center gap-4 text-rose-600 font-mono font-black text-xl bg-rose-50 px-6 py-3 rounded-2xl border-2 border-rose-300 shadow-md">
                                       <span>root == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-200">return null</span>
                                   </div>
                                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">Hit empty leaf boundary.</span>
                              </div>
                          ) : st.currNodeId !== null && (st.hlBaseCheck || st.hlCheckBoth || st.hlReturnChild || st.hlReturnRoot || st.hlReturnBase) ? (
                              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 font-mono min-h-[80px] py-2 w-full">
                                  
                                  {/* Left Return */}
                                  {(st.leftVal !== undefined || st.hlRecurseLeft) && (
                                      <div className="flex flex-col items-center w-[120px]">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>left returned</span>
                                          <div className={`border-2 text-2xl font-black px-6 py-2 w-full text-center rounded-xl transition-all duration-300 ${st.leftVal !== null && st.leftVal !== undefined ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-slate-50 border-slate-300 text-slate-400'}`}>
                                              {st.leftVal === undefined ? '?' : (st.leftVal === null ? 'null' : st.leftVal)}
                                          </div>
                                      </div>
                                  )}
                                  
                                  {(st.leftVal !== undefined || st.hlRecurseLeft) && <div className="w-px h-12 bg-slate-200 hidden md:block"></div>}
                                  
                                  {/* Current Node */}
                                  <div className="flex flex-col items-center w-[120px]">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr node</span>
                                      <div className={`border-2 text-3xl font-black px-6 py-2 w-full text-center rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                                          {treeData.nodes.find((n:any) => n.id === st.currNodeId)?.val}
                                      </div>
                                  </div>

                                  {(st.rightVal !== undefined || st.hlRecurseRight) && <div className="w-px h-12 bg-slate-200 hidden md:block"></div>}
                                  
                                  {/* Right Return */}
                                  {(st.rightVal !== undefined || st.hlRecurseRight) && (
                                      <div className="flex flex-col items-center w-[120px]">
                                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>right returned</span>
                                          <div className={`border-2 text-2xl font-black px-6 py-2 w-full text-center rounded-xl transition-all duration-300 ${st.rightVal !== null && st.rightVal !== undefined ? 'bg-sky-50 border-sky-300 text-sky-800' : 'bg-slate-50 border-slate-300 text-slate-400'}`}>
                                              {st.rightVal === undefined ? '?' : (st.rightVal === null ? 'null' : st.rightVal)}
                                          </div>
                                      </div>
                                  )}

                                  {/* Final Action */}
                                  {st.returnedVal !== undefined && (
                                      <>
                                          <ArrowRight size={24} className="text-slate-300"/>
                                          <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.isLca ? 'text-amber-600' : 'text-emerald-600'}`}>{st.isLca ? 'LCA FOUND!' : 'Bubbling up'}</span>
                                              <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.isLca ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-emerald-100 border-emerald-400 text-emerald-800 scale-105 shadow-md'}`}>
                                                  {st.returnedVal === null ? 'null' : st.returnedVal}
                                              </div>
                                          </div>
                                      </>
                                  )}
                              </div>
                          ) : (
                              <div className="flex items-center justify-center w-full min-h-[80px]">
                                  <span className="text-slate-400 italic text-sm font-mono">Traversing tree...</span>
                              </div>
                          )}
                      </div>
                  ) : (
                      <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isLca ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><LayersIcon size={14}/> Iterative Data Structures</span>
                          <div className="flex w-full gap-4 min-h-[100px] items-stretch">
                              {/* Parent Map */}
                              <div className="flex-1 border-2 border-indigo-200 bg-indigo-50 rounded-xl p-3 flex flex-col overflow-hidden">
                                  <span className="text-[9px] font-bold uppercase text-indigo-500 mb-2">parent Map</span>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2 flex-1 scrollbar-thin">
                                      {st.parentMap && Object.keys(st.parentMap).length > 0 ? Object.entries(st.parentMap).map(([k, v]: [string, any], idx) => {
                                          let childNode = treeData.nodes.find((n:any)=>n.id===parseInt(k));
                                          let parentNode = treeData.nodes.find((n:any)=>n.id===v);
                                          let isHighlight = st.hlMapPush === parseInt(k);
                                          return (
                                              <div key={`map-${idx}`} className={`shrink-0 flex items-center bg-white border border-indigo-300 px-2 py-1 rounded text-xs font-mono font-bold text-indigo-900 ${isHighlight ? 'ring-2 ring-indigo-400 scale-110 shadow-md' : ''}`}>
                                                  {childNode?.val} &rarr; {parentNode ? parentNode.val : 'null'}
                                              </div>
                                          );
                                      }) : <span className="text-slate-400 italic text-[10px] font-mono">Empty</span>}
                                  </div>
                              </div>
                              {/* Ancestors Set */}
                              <div className="flex-1 border-2 border-emerald-200 bg-emerald-50 rounded-xl p-3 flex flex-col overflow-hidden">
                                  <span className="text-[9px] font-bold uppercase text-emerald-500 mb-2">ancestors Set</span>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2 flex-1 scrollbar-thin">
                                      {st.ancestors && st.ancestors.size > 0 ? Array.from(st.ancestors).map((id: any, idx) => {
                                          let nNode = treeData.nodes.find((n:any)=>n.id===id);
                                          let isHighlight = st.hlAddAncestor === id || st.hlCheckAncestor === id;
                                          return (
                                              <div key={`set-${idx}`} className={`shrink-0 flex items-center bg-white border border-emerald-300 px-3 py-1 rounded text-sm font-mono font-black text-emerald-900 ${isHighlight ? 'ring-2 ring-emerald-400 scale-110 shadow-md animate-pulse' : ''}`}>
                                                  {nNode?.val}
                                              </div>
                                          );
                                      }) : <span className="text-slate-400 italic text-[10px] font-mono">Empty</span>}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {treeData.edges.map((edge: any, i: number) => {
                                      let isActive = false;

                                      // Current recursive branch highlighting
                                      if (selectedOpId === 'recursiveDfs') {
                                          if (st.currNodeId === edge.source) {
                                              if (st.hlRecurseLeft && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                              if (st.hlRecurseRight && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.right?.id) isActive = true;
                                          }
                                      } else {
                                          // Iterative highlighting (edge traversed in map phase)
                                          if (st.currNodeId === edge.source) {
                                              if (st.hlCheckLeft && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                              if (st.hlCheckRight && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.right?.id) isActive = true;
                                          }
                                          // Path highlighting for P ancestors
                                          if (st.currP === edge.source && st.parentMap && st.parentMap[edge.source] === edge.target) isActive = true;
                                          if (st.currP === edge.target && st.parentMap && st.parentMap[edge.target] === edge.source) isActive = true;
                                          // Path highlighting for Q ancestors
                                          if (st.currQ === edge.source && st.parentMap && st.parentMap[edge.source] === edge.target) isActive = true;
                                          if (st.currQ === edge.target && st.parentMap && st.parentMap[edge.target] === edge.source) isActive = true;
                                      }

                                      let strokeColor = '#e2e8f0'; // slate-200
                                      let strokeWidth = 2;
                                      let opacity = 0.4;

                                      if (isActive) {
                                          strokeColor = selectedOpId === 'recursiveDfs' ? '#f59e0b' : '#6366f1'; // amber-500 or indigo-500
                                          strokeWidth = 4;
                                          opacity = 0.9;
                                      }
                                      
                                      if (st.isSuccess) {
                                          opacity = 0.2; 
                                      }

                                      return <line key={`edge-${i}`} x1={edge.sx} y1={edge.sy + 20} x2={edge.tx} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}
                              </g>
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isP = node.val === st.pVal;
                              let isQ = node.val === st.qVal;
                              let isLca = st.isSuccess && node.val === st.finalAns;
                              let isIterP = selectedOpId === 'iterativeParent' && st.currP === node.id;
                              let isIterQ = selectedOpId === 'iterativeParent' && st.currQ === node.id;
                              let isIterAncestor = selectedOpId === 'iterativeParent' && st.ancestors?.has(node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isLca) {
                                  bgClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-2xl scale-125 z-40 ring-4 ring-amber-200";
                              } else if (isIterP) {
                                  bgClass = "bg-blue-100 border-blue-500 text-blue-900 shadow-xl scale-125 z-30 ring-4 ring-blue-200";
                              } else if (isIterQ) {
                                  bgClass = "bg-purple-100 border-purple-500 text-purple-900 shadow-xl scale-125 z-30 ring-4 ring-purple-200";
                              } else if (isActive) {
                                  bgClass = selectedOpId === 'recursiveDfs' ? "bg-amber-100 border-amber-500 ring-4 ring-amber-200 shadow-xl text-amber-900 scale-125 z-30" : "bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200 shadow-xl text-indigo-900 scale-125 z-30";
                              } else if (isP) {
                                  bgClass = "bg-blue-50 border-blue-400 text-blue-800 shadow-md z-20 opacity-100 ring-4 ring-blue-100";
                              } else if (isQ) {
                                  bgClass = "bg-purple-50 border-purple-400 text-purple-800 shadow-md z-20 opacity-100 ring-4 ring-purple-100";
                              } else if (isIterAncestor) {
                                  bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-md z-20 opacity-100 ring-4 ring-emerald-100";
                              }
                              
                              if (st.isSuccess && !isLca && !isP && !isQ) {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 z-10 scale-90";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !isP && !isQ && !isIterP && !isIterQ && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'recursiveDfs' ? 'text-amber-600 border border-amber-200' : 'text-indigo-600 border border-indigo-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {isIterP && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-blue-600 border border-blue-200`}>
                                              curr p
                                          </span>
                                      )}
                                      {isIterQ && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-purple-600 border border-purple-200`}>
                                              curr q
                                          </span>
                                      )}
                                      {isP && !isIterP && (
                                          <span className={`text-[11px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-blue-500 text-white px-2 py-0.5 rounded shadow-sm ${isLca ? 'hidden' : ''}`}>
                                              p
                                          </span>
                                      )}
                                      {isQ && !isIterQ && (
                                          <span className={`text-[11px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-purple-500 text-white px-2 py-0.5 rounded shadow-sm ${isLca ? 'hidden' : ''}`}>
                                              q
                                          </span>
                                      )}
                                      {isIterAncestor && !isIterP && !isLca && !isP && !isQ && (
                                          <span className={`text-[8px] font-black font-mono uppercase tracking-widest absolute -top-5 whitespace-nowrap text-emerald-600`}>
                                              ancestor
                                          </span>
                                      )}
                                      {isLca && (
                                          <span className={`text-[12px] font-black font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-amber-500 text-white px-3 py-1 rounded shadow-lg z-50 animate-bounce ring-4 ring-amber-200`}>
                                              LCA
                                          </span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{node.val}</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Lowest Common Ancestor</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Binary Tree
                  </span>
                  <span>•</span>
                  <span>LeetCode 236</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Finding the Intersection</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.</p>
                        <p>According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes <code>p</code> and <code>q</code> as the lowest node in <code>T</code> that has both <code>p</code> and <code>q</code> as descendants (where we allow a node to be a descendant of itself)."</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The LCA of node <span className="text-blue-400 font-bold">5</span> and node <span className="text-purple-400 font-bold">1</span> is <span className="text-amber-400 font-bold">3</span>.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="240" height="200" viewBox="0 0 240 200">
                                <line x1="120" y1="30" x2="60" y2="80" stroke="#475569" strokeWidth="2" />
                                <line x1="120" y1="30" x2="180" y2="80" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="60" y1="80" x2="30" y2="130" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="80" x2="90" y2="130" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="180" y1="80" x2="150" y2="130" stroke="#475569" strokeWidth="2" />
                                <line x1="180" y1="80" x2="210" y2="130" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="90" y1="130" x2="75" y2="180" stroke="#475569" strokeWidth="2" />
                                <line x1="90" y1="130" x2="105" y2="180" stroke="#475569" strokeWidth="2" />

                                <circle cx="120" cy="30" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                                <text x="120" y="34" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="60" cy="80" r="14" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="3" />
                                <text x="60" y="84" fill="#60a5fa" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="180" cy="80" r="14" fill="#4c1d95" stroke="#c084fc" strokeWidth="3" />
                                <text x="180" y="84" fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="30" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="30" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                
                                <circle cx="90" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="90" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="150" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="150" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="210" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="210" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">8</text>
                                
                                <circle cx="75" cy="180" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="75" y="184" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="105" cy="180" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="105" y="184" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">5</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The LCA of node <span className="text-blue-400 font-bold">5</span> and node <span className="text-purple-400 font-bold">4</span> is <span className="text-amber-400 font-bold">5</span>, since a node can be a descendant of itself according to the LCA definition.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="240" height="200" viewBox="0 0 240 200">
                                <line x1="120" y1="30" x2="60" y2="80" stroke="#475569" strokeWidth="2" />
                                <line x1="120" y1="30" x2="180" y2="80" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="60" y1="80" x2="30" y2="130" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="80" x2="90" y2="130" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="180" y1="80" x2="150" y2="130" stroke="#475569" strokeWidth="2" />
                                <line x1="180" y1="80" x2="210" y2="130" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="90" y1="130" x2="75" y2="180" stroke="#475569" strokeWidth="2" />
                                <line x1="90" y1="130" x2="105" y2="180" stroke="#475569" strokeWidth="2" />

                                <circle cx="120" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="120" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                {/* Node 5 acts as both P and LCA */}
                                <circle cx="60" cy="80" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                                <text x="60" y="84" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="180" cy="80" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="180" y="84" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="30" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="30" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                
                                <circle cx="90" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="90" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="150" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="150" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">0</text>
                                
                                <circle cx="210" cy="130" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="210" y="134" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">8</text>
                                
                                <circle cx="75" cy="180" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="75" y="184" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="105" cy="180" r="14" fill="#4c1d95" stroke="#c084fc" strokeWidth="3" />
                                <text x="105" y="184" fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [1,2], p = 1, q = 2</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">1</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                The LCA of node <span className="text-blue-400 font-bold">1</span> and node <span className="text-purple-400 font-bold">2</span> is <span className="text-amber-400 font-bold">1</span>.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="120" height="100" viewBox="0 0 120 100">
                                <line x1="60" y1="30" x2="30" y2="70" stroke="#475569" strokeWidth="2" />
                                
                                <circle cx="60" cy="30" r="14" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
                                <text x="60" y="34" fill="#fbbf24" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="30" cy="70" r="14" fill="#4c1d95" stroke="#c084fc" strokeWidth="3" />
                                <text x="30" y="74" fill="#c084fc" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [2, 10^5].</li>
                            <li>-10^9 &le; Node.val &le; 10^9</li>
                            <li>All Node.val are unique.</li>
                            <li>p != q</li>
                            <li>p and q will exist in the tree.</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">We could map all parent pointers in a hashmap, but this takes O(N) extra space for the map. We want an optimal solution that finds the intersection point dynamically while traversing the tree only once using standard DFS.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Recursive Bubble-Up</strong>. At each node, we recursively check left and right subtrees. If a node is `p` or `q`, it returns itself. If a node receives a non-null value from BOTH left and right children, it means it is the intersection (the LCA) and returns itself. Otherwise, it simply passes (bubbles up) whatever non-null value it received.</p>
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 5, 1, 6, 2, 0, 8..." />
                        </div>
                        <div className="flex-[1] flex gap-2 w-full">
                            <div className="flex-1 space-y-1.5">
                                <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-blue-600 pl-1`}>Node P</label>
                                <input type="number" value={pInput} onChange={(e) => setPInput(e.target.value)} className={`w-full bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner font-bold text-center text-blue-800`} placeholder="5" />
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-purple-600 pl-1`}>Node Q</label>
                                <input type="number" value={qInput} onChange={(e) => setQInput(e.target.value)} className={`w-full bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner font-bold text-center text-purple-800`} placeholder="1" />
                            </div>
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found Lowest Common Ancestor: {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlReturnRoot || st.hlReturnBase ? 'text-amber-400' : (st.hlCheckBoth ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {selectedOpId === 'recursiveDfs' && !st.isSuccess && st.callStack && (
                       <div className="absolute bottom-4 left-4 z-30 pointer-events-auto animate-in fade-in zoom-in duration-300">
                           <div className={`bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl p-4 flex flex-col transition-all duration-300 w-48 max-h-[250px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400`}><LayersIcon size={12}/> Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                       let isTop = idx === 0;
                                       return (
                                           <div key={`frame-cs-${idx}`} className={`w-full py-1.5 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-amber-500 text-amber-950 border-amber-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-amber-100 text-amber-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the recursive bubble-up mechanism.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitMerge size={24} className="text-amber-500"/> 1. The Post-Order Traversal Strategy</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To find the lowest common ancestor, a node needs to know if <code>p</code> and <code>q</code> exist in its subtrees. We use Post-Order traversal because a parent node must wait for both its left and right children to finish searching before it can make a decision.</p>
                        <p className="text-slate-600 leading-relaxed">When a leaf (or any node) finds <code>p</code> or <code>q</code>, it immediately stops and returns that node upwards. As the recursion unwinds, every parent looks at what its two children returned. If both children returned a non-null value, it means one child found <code>p</code> and the other found <code>q</code>. The current parent is the junction point—the LCA!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowUp size={24} className="text-sky-500"/> 2. The Bubble-Up Mechanism</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">What happens if a node is NOT the LCA?</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li>If both children return <code>null</code>, the current node also returns <code>null</code>.</li>
                            <li>If one child returns a node (e.g., <code>left</code> found <code>p</code>, but <code>right</code> found nothing), the current node simply returns <code>left</code>. It acts as a messenger, bubbling the found node up the tree.</li>
                            <li>Eventually, the bubbled-up <code>p</code> will meet a bubbled-up <code>q</code> at their shared ancestor, triggering the <code>left != null && right != null</code> condition.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> In the worst case, we might need to visit every single node in the binary tree to find <code>p</code> and <code>q</code>. Thus, the time scales linearly with the number of nodes.</li>
                            <li><strong>Space Complexity: O(H).</strong> We don't allocate any extra data structures, but the recursive function calls stack up in memory. In the worst case (a completely skewed tree), the recursion goes $N$ levels deep, taking $O(N)$ space. For a balanced tree, it takes $O(\log N)$ space. Thus, space is bounded by the height of the tree, $O(H)$.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-amber-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is one of the most frequently asked tree problems in FAANG interviews. Mastering the 5-line recursive solution is essential."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "What if node <code>p</code> is a direct ancestor of node <code>q</code>?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The code handles this edge case perfectly.</p>
                            <p>If <code>p</code> is an ancestor of <code>q</code>, the DFS will hit <code>p</code> first. The base case <code>if (root == p) return root;</code> will immediately trigger, returning <code>p</code> without ever exploring <code>p</code>'s subtrees to find <code>q</code>. This is mathematically correct because if <code>q</code> is a descendant of <code>p</code>, the lowest common ancestor is inherently <code>p</code>. The returned <code>p</code> will bubble all the way to the top."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Does this code work if <code>p</code> or <code>q</code> are NOT guaranteed to be in the tree?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it contains a subtle bug in that scenario.</p>
                            <p>Because the search stops and returns as soon as it finds one of the target nodes (e.g., <code>p</code>), it never verifies if <code>q</code> actually exists further down in the tree. If <code>p</code> is in the tree but <code>q</code> is entirely missing, the function will falsely return <code>p</code> as the LCA. To fix this, you would need to either traverse the whole tree first to ensure both exist, or use boolean flags during the recursion to confirm both were physically encountered."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><MapIcon size={24}/></span>
                            <span>Q3: "If this were a Binary Search Tree (BST), how could we optimize this?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "We could completely avoid visiting unrelated branches, reducing the time complexity to $O(H)$ instead of $O(N)$.</p>
                            <p>In a BST, the left subtree contains smaller values and the right subtree contains larger values. We would simply check: if both <code>p</code> and <code>q</code> are smaller than the <code>root</code>, the LCA must be in the left subtree. If both are larger, it's in the right subtree. The moment we find a node where <code>p</code> and <code>q</code> split (one is smaller, one is larger), that node is guaranteed to be the LCA."</p>
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
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? 'bg-amber-900/40 border-amber-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlReturnRoot || st.hlReturnBase ? 'text-amber-400' : (st.hlCheckBoth ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
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
                  {selectedOpId === 'recursiveDfs' && !st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                              </div>
                              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                  {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                      let isTop = idx === 0;
                                      return (
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-amber-500 text-amber-950 border-amber-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 5, 1..." />
                          </div>
                          <div className="flex-[1] flex gap-2 w-full">
                              <div className="flex-1 space-y-1">
                                  <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-blue-600`}>Node P</label>
                                  <input type="number" value={pInput} onChange={(e) => setPInput(e.target.value)} className={`w-full bg-blue-50 border border-blue-200 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-blue-500 font-bold text-center text-blue-800`} placeholder="5" />
                              </div>
                              <div className="flex-1 space-y-1">
                                  <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-purple-600`}>Node Q</label>
                                  <input type="number" value={qInput} onChange={(e) => setQInput(e.target.value)} className={`w-full bg-purple-50 border border-purple-200 rounded-lg px-2 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-purple-500 font-bold text-center text-purple-800`} placeholder="1" />
                              </div>
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
                                <p className="text-amber-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Lowest Common Ancestor</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
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