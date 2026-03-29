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
  recursiveDelete: {
    id: 'recursiveDelete',
    title: 'Recursive BST Deletion',
    icon: <Scissors size={16} />,
    complexity: 'Time: O(H) | Space: O(H)',
    theme: 'rose',
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
    public TreeNode deleteNode(TreeNode root, int key) {
        if (root == null) return null;
        if (key < root.val) {
            root.left = deleteNode(root.left, key);
        } else if (key > root.val) {
            root.right = deleteNode(root.right, key);
        } else {
            if (root.left == null) return root.right;
            if (root.right == null) return root.left;
            
            TreeNode minNode = findMin(root.right);
            root.val = minNode.val;
            root.right = deleteNode(root.right, root.val);
        }
        return root;
    }
    
    private TreeNode findMin(TreeNode node) {
        while (node.left != null) {
            node = node.left;
        }
        return node;
    }
}`,
    desc: "Deleting a node in a BST is a 3-step process. First, we recursively search for the node. Second, once found, we determine its case: Case 1 (Leaf) - simply return null to disconnect it. Case 2 (One Child) - return the non-null child to bypass the deleted node. Case 3 (Two Children) - this is the trickiest! We cannot simply delete the node, so we find its 'in-order successor' (the smallest value in the right subtree), copy that successor's value into our current node, and then recursively delete the original successor node from the right subtree."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'rose', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|deleteNode|findMin|TreeNode|Solution|root|null|this|left|right|key|val|node|minNode)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['TreeNode', 'Solution'].includes(part);
            const isPointer = ['root', 'left', 'right', 'key', 'val', 'node', 'minNode'].includes(part);
            const isMapCall = ['deleteNode', 'findMin'].includes(part);
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

export default function DeleteNodeBSTVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('recursiveDelete');
  
  const [treeInput, setTreeInput] = useState('5, 3, 6, 2, 4, null, 7');
  const [targetInput, setTargetInput] = useState('3');
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([5, 3, 6, 2, 4, null, 7]);
  const [targetVal, setTargetVal] = useState<number>(3);

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
      setBaseTreeArr(parseTreeInput(treeInput, [5, 3, 6, 2, 4, null, 7]));
      
      const parsedTarget = parseInt(targetInput.trim(), 10);
      setTargetVal(isNaN(parsedTarget) ? 3 : parsedTarget);

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
      
      // Use absolute pixel mapping
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

      // Center the tree mathematically around 0
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
    
    // Virtual Mutation State
    let nodeValues: Record<number, number> = {};
    let hiddenNodes = new Set<number>();
    let hiddenEdges = new Set<string>();
    let newEdges: Array<{s: number, t: number}> = [];
    let minFinderCurr: number | null = null;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            callStack: [...callStack], 
            nodeValues: {...nodeValues},
            hiddenNodes: new Set(hiddenNodes),
            hiddenEdges: new Set(hiddenEdges),
            newEdges: [...newEdges],
            minFinderCurr,
            ...st 
        } 
    });

    const findMin = (node: any) => {
        let curr = node;
        callStack.push(`findMin(${curr.val})`);
        add("Find Min Subroutine", `private TreeNode findMin(TreeNode node)\nEntering helper function to find the smallest value in the right subtree.`, 29, { hlFindMinEntry: true, currNodeId: curr.id });

        while (curr && curr.originalNode && curr.originalNode.left != null) {
            minFinderCurr = curr.id;
            add("Check Min Loop", `while (node.left != null)\nNode ${nodeValues[curr.id] ?? curr.val} has a left child. We must keep going left to find the minimum.`, 30, { currNodeId: curr.id, hlMinLoopCheck: true });
            
            let nextLeft = treeData.nodes.find(n => n.id === curr.originalNode.left.id);
            if (!nextLeft) break; // Safeguard

            curr = nextLeft;
            minFinderCurr = curr.id;
            add("Traverse Left", `node = node.left;\nMoved to left child.`, 31, { currNodeId: curr.id, hlMinMove: true });
        }

        minFinderCurr = curr ? curr.id : null;
        if (curr) {
            add("Check Min Loop", `while (node.left != null)\nNode ${nodeValues[curr.id] ?? curr.val} has no left child! This is the minimum value in the subtree.`, 30, { currNodeId: curr.id, hlMinLoopCheck: true });
            add("Return Min", `return node;\nReturning node with value ${nodeValues[curr.id] ?? curr.val} as the in-order successor.`, 33, { currNodeId: curr.id, hlMinReturn: true });
        }

        callStack.pop();
        minFinderCurr = null;
        return curr;
    };

    const dfs = (node: any | null, currentSearchKey: number): any | null => {
        if (steps.length > 2500) return null; // Guard

        let currentVal = node ? (nodeValues[node.id] !== undefined ? nodeValues[node.id] : node.val) : 'null';
        let callStr = `deleteNode(${currentVal}, ${currentSearchKey})`;
        callStack.push(callStr);

        add("DFS Entry", `public TreeNode deleteNode(TreeNode root, int key)\nEntering node ${currentVal} looking for key ${currentSearchKey}.`, 12, { currNodeId: node ? node.id : null, currentSearchKey });

        if (!node || !node.originalNode) {
            add("Null Check", `if (root == null) return null;\nNode is null. Target not found in this branch. Returning null.`, 13, { currNodeId: null, hlCheckNull: true });
            callStack.pop();
            return null;
        }

        add("Null Check", `if (root == null) return null;\nNode is not null.`, 13, { currNodeId: node.id, hlCheckNull: true });

        let isLess = currentSearchKey < currentVal;
        let isGreater = currentSearchKey > currentVal;

        add("Compare Left", `if (key < root.val)\nIs ${currentSearchKey} < ${currentVal}? ${isLess ? 'YES' : 'NO'}.`, 14, { currNodeId: node.id, hlCompareLeft: true, isLess, currentSearchKey });

        if (isLess) {
            add("Recurse Left", `root.left = deleteNode(root.left, key);\nTarget is smaller. Recursing down the LEFT subtree.`, 15, { currNodeId: node.id, hlRecurseLeft: true });
            let originalLeft = node.originalNode.left ? treeData.nodes.find(n => n.id === node.originalNode.left.id) : null;
            let resultNode = dfs(originalLeft, currentSearchKey);
            
            if (resultNode !== originalLeft) {
                // Visual Bypass
                if (originalLeft) {
                    hiddenNodes.add(originalLeft.id);
                    hiddenEdges.add(`${node.id}-${originalLeft.id}`);
                    if (resultNode) {
                        hiddenEdges.add(`${originalLeft.id}-${resultNode.id}`);
                        newEdges.push({s: node.id, t: resultNode.id});
                    }
                }
            }
            add("Return Propagate", `return root;\nReturning modified subtree upwards.`, 26, { currNodeId: node.id, hlReturn: true });
            callStack.pop();
            return node;
        }

        add("Compare Right", `} else if (key > root.val)\nIs ${currentSearchKey} > ${currentVal}? ${isGreater ? 'YES' : 'NO'}.`, 16, { currNodeId: node.id, hlCompareRight: true, isGreater, currentSearchKey });

        if (isGreater) {
            add("Recurse Right", `root.right = deleteNode(root.right, key);\nTarget is larger. Recursing down the RIGHT subtree.`, 17, { currNodeId: node.id, hlRecurseRight: true });
            let originalRight = node.originalNode.right ? treeData.nodes.find(n => n.id === node.originalNode.right.id) : null;
            let resultNode = dfs(originalRight, currentSearchKey);

            if (resultNode !== originalRight) {
                // Visual Bypass
                if (originalRight) {
                    hiddenNodes.add(originalRight.id);
                    hiddenEdges.add(`${node.id}-${originalRight.id}`);
                    if (resultNode) {
                        hiddenEdges.add(`${originalRight.id}-${resultNode.id}`);
                        newEdges.push({s: node.id, t: resultNode.id});
                    }
                }
            }
            add("Return Propagate", `return root;\nReturning modified subtree upwards.`, 26, { currNodeId: node.id, hlReturn: true });
            callStack.pop();
            return node;
        }

        // --- MATCH FOUND ---
        add("Match Found", `} else {\nWe found the node to delete! Val: ${currentVal}. Now evaluating cases.`, 18, { currNodeId: node.id, hlMatch: true, isMatched: true });

        let originalLeft = node.originalNode.left ? treeData.nodes.find(n => n.id === node.originalNode.left.id) : null;
        let originalRight = node.originalNode.right ? treeData.nodes.find(n => n.id === node.originalNode.right.id) : null;

        // Check Case 1 & 2
        add("Check Left Child Null", `if (root.left == null)\nDoes this node lack a left child? ${!originalLeft ? 'YES' : 'NO'}.`, 19, { currNodeId: node.id, hlCheckLeftNull: true, isMatched: true });
        if (!originalLeft) {
            add("Bypass Node", `return root.right;\nNode has no left child. We safely delete it by returning its right child (${originalRight ? (nodeValues[originalRight.id] ?? originalRight.val) : 'null'}) to bypass it.`, 19, { currNodeId: node.id, hlReturnRightBypass: true, isMatched: true });
            callStack.pop();
            return originalRight;
        }

        add("Check Right Child Null", `if (root.right == null)\nDoes this node lack a right child? ${!originalRight ? 'YES' : 'NO'}.`, 20, { currNodeId: node.id, hlCheckRightNull: true, isMatched: true });
        if (!originalRight) {
            add("Bypass Node", `return root.left;\nNode has no right child. We safely delete it by returning its left child (${originalLeft ? (nodeValues[originalLeft.id] ?? originalLeft.val) : 'null'}) to bypass it.`, 20, { currNodeId: node.id, hlReturnLeftBypass: true, isMatched: true });
            callStack.pop();
            return originalLeft;
        }

        // Case 3: Two Children
        add("Two Children Case", `TreeNode minNode = findMin(root.right);\nNode has TWO children. We must find its In-Order Successor to safely replace it. Searching right subtree...`, 22, { currNodeId: node.id, hlCallFindMin: true, isMatched: true });
        
        let successor = findMin(originalRight);
        
        add("Successor Found", `root.val = minNode.val;\nSuccessor found: ${successor.val}. We overwrite the current node's value with the successor's value.`, 23, { currNodeId: node.id, hlSwapVal: true, isMatched: true, successorId: successor.id });
        
        // Mutate visually
        nodeValues[node.id] = successor.val;

        add("Delete Successor Recurse", `root.right = deleteNode(root.right, root.val);\nNow we must recursively delete the original successor node from the right subtree.`, 24, { currNodeId: node.id, hlDeleteSuccessor: true, currentSearchKey: successor.val });
        
        let newRight = dfs(originalRight, successor.val);
        if (newRight !== originalRight) {
            if (originalRight) {
                hiddenNodes.add(originalRight.id);
                hiddenEdges.add(`${node.id}-${originalRight.id}`);
                if (newRight) {
                    hiddenEdges.add(`${originalRight.id}-${newRight.id}`);
                    newEdges.push({s: node.id, t: newRight.id});
                }
            }
        }

        add("Return Modified Node", `return root;\nSuccessor deleted. Returning the now-modified current node upwards.`, 26, { currNodeId: node.id, hlReturn: true });
        
        callStack.pop();
        return node;
    };

    if (baseTreeArr.length > 0 && treeData.root) {
        add("Function Call", `public TreeNode deleteNode(TreeNode root, int key)`, 12, {});
        
        let renderRoot = treeData.nodes.find(n => n.id === treeData.root.id);
        let finalRoot = dfs(renderRoot, targetVal);
        
        // Handle root replacement visually if the absolute root was bypassed
        if (finalRoot !== renderRoot && renderRoot) {
            hiddenNodes.add(renderRoot.id);
            if (finalRoot) {
                hiddenEdges.add(`${renderRoot.id}-${finalRoot.id}`);
            }
        }

        add("Execution Complete", `Tree modification finished. Returning the new root of the BST.`, 12, { isSuccess: true });
    }

    return steps;
  }, [baseTreeArr, treeData, selectedOpId, targetVal]);

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
      let currVal = currNodeData ? (st.nodeValues && st.nodeValues[currNodeData.id] !== undefined ? st.nodeValues[currNodeData.id] : currNodeData.val) : null;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isMatched ? 'border-rose-400 ring-4 ring-rose-100 scale-105' : (st.hlSwapVal || st.hlCallFindMin ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Scissors size={14}/> Active Delete State</span>
              
              {st.hlFindMinEntry || st.hlMinLoopCheck || st.hlMinMove || st.hlMinReturn ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in zoom-in duration-300">
                       <div className="flex items-center gap-4 text-amber-600 font-mono font-black text-xl bg-amber-50 px-6 py-3 rounded-2xl border-2 border-amber-300 shadow-md">
                           <Search size={24} /> <span className="uppercase tracking-widest text-base">Finding Successor (Min Left)</span>
                       </div>
                  </div>
              ) : st.currNodeId === null && st.hlCheckNull ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                       <div className="flex items-center gap-4 text-slate-600 font-mono font-black text-xl bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-300 shadow-md">
                           <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-slate-700 uppercase tracking-widest text-base">Target Not Found</span>
                       </div>
                  </div>
              ) : st.currNodeId !== null ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.isMatched ? 'text-rose-500' : 'text-slate-400'}`}>Search Key</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl bg-slate-50 border-slate-300 text-slate-700 shadow-inner`}>
                              {st.currentSearchKey !== undefined ? String(st.currentSearchKey) : String(targetVal)}
                          </div>
                      </div>

                      <div className="flex flex-col items-center justify-center font-bold px-2 w-12">
                          <span className={`text-4xl transition-colors duration-300 ${st.hlCompareLeft || st.hlCompareRight ? (st.isLess ? 'text-sky-500' : 'text-sky-500') : (st.isMatched ? 'text-rose-500' : 'text-slate-300')}`}>
                              {st.isMatched ? '==' : (st.isLess ? '<' : (st.isGreater ? '>' : '?'))}
                          </span>
                      </div>

                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.isMatched ? 'text-rose-500' : 'text-slate-400'}`}>curr (root.val)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.isMatched ? 'bg-rose-100 border-rose-500 text-rose-900 shadow-lg scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {currVal !== null ? String(currVal) : '?'}
                          </div>
                      </div>
                      
                      {st.hlRecurseLeft || st.hlRecurseRight ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300"/>
                              <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-sky-500`}>Action</span>
                                  <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md bg-sky-100 border-sky-400 text-sky-800`}>
                                      {st.hlRecurseLeft ? 'SEARCH LEFT' : 'SEARCH RIGHT'}
                                  </div>
                              </div>
                          </>
                      ) : st.isMatched ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300"/>
                              <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlSwapVal || st.hlDeleteSuccessor ? 'text-amber-500' : 'text-rose-500'}`}>Delete Action</span>
                                  <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl text-white shadow-xl scale-110 tracking-wider ${st.hlSwapVal || st.hlDeleteSuccessor ? 'bg-amber-500 border-amber-600' : 'bg-rose-500 border-rose-600'}`}>
                                      {st.hlReturnRightBypass ? 'BYPASS (Use Right)' : (st.hlReturnLeftBypass ? 'BYPASS (Use Left)' : (st.hlSwapVal ? 'SWAP VALUE' : (st.hlDeleteSuccessor ? 'RECURSE DELETE' : 'MATCH FOUND')))}
                                  </div>
                              </div>
                          </>
                      ) : null}

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Delete Sequence...</span>
                  </div>
              )}
          </div>
      );
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

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto`}><Network size={12} className="inline mr-1"/> Binary Search Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              <g style={{ transform: 'translateX(50%)' }}>
                                  {/* Standard Edges */}
                                  {treeData.edges.map((edge: any, i: number) => {
                                      let isHidden = st.hiddenEdges && st.hiddenEdges.has(`${edge.source}-${edge.target}`);
                                      if (isHidden) return null; // Literally erase bypassed edges

                                      let isActive = false;
                                      if (st.currNodeId === edge.source) {
                                          if (st.hlRecurseLeft && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                          if (st.hlRecurseRight && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.right?.id) isActive = true;
                                          if (st.hlMinMove && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                      }
                                      
                                      let strokeColor = '#e2e8f0'; // slate-200
                                      let strokeWidth = 2;
                                      let opacity = 0.5;

                                      if (isActive) {
                                          strokeColor = st.hlMinMove ? '#f59e0b' : '#38bdf8'; // amber or sky
                                          strokeWidth = 4;
                                          opacity = 0.9;
                                      }

                                      return <line key={`edge-${i}`} x1={edge.sx} y1={edge.sy + 20} x2={edge.tx} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}

                                  {/* Newly Formed Bypassed Edges */}
                                  {st.newEdges && st.newEdges.map((edge: any, i: number) => {
                                      const sNode = treeData.nodes.find((n:any) => n.id === edge.s);
                                      const tNode = treeData.nodes.find((n:any) => n.id === edge.t);
                                      if (!sNode || !tNode) return null;
                                      return <line key={`newedge-${i}`} x1={sNode.x} y1={sNode.y + 20} x2={tNode.x} y2={tNode.y - 20} stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" className="animate-pulse transition-all duration-500" />
                                  })}

                                  {/* Render Virtual Null Missing Edge indicating a miss */}
                                  {st.currNodeId === null && st.hlCheckNull && (() => {
                                      const parentId = st.callStack && st.callStack.length > 1 ? st.callStack[st.callStack.length - 2].match(/deleteNode\((\d+|null)/)?.[1] : null;
                                      if (!parentId || parentId === 'null') return null;
                                      const parent = treeData.nodes.find((n: any) => n.id.toString() === parentId);
                                      if (!parent) return null;
                                      
                                      let isLeftChild = st.currentSearchKey < (st.nodeValues?.[parent.id] ?? parent.val);
                                      let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                                      let py = parent.y + 80;
                                      return <line x1={parent.x} y1={parent.y + 20} x2={px} y2={py - 20} stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" opacity={0.6} className="animate-pulse transition-all duration-500" />
                                  })()}
                              </g>
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              if (st.hiddenNodes && st.hiddenNodes.has(node.id)) return null; // Physically hide deleted nodes

                              let isActive = st.currNodeId === node.id;
                              let isMinFinder = st.minFinderCurr === node.id;
                              let isMatched = st.isMatched && isActive;
                              let isSuccessorTarget = st.successorId === node.id;
                              
                              let displayVal = st.nodeValues && st.nodeValues[node.id] !== undefined ? st.nodeValues[node.id] : node.val;
                              let valChanged = displayVal !== node.val;

                              let bgClass = "bg-white border-slate-300 text-slate-500 opacity-80"; // Unvisited
                              
                              if (valChanged) {
                                  bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xl ring-4 ring-emerald-200 scale-110 z-30";
                              } else if (isMatched) {
                                  bgClass = "bg-rose-100 border-rose-500 ring-4 ring-rose-200 shadow-xl text-rose-900 scale-125 z-40";
                              } else if (isSuccessorTarget) {
                                  bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 shadow-xl text-amber-900 scale-125 z-40";
                              } else if (isMinFinder) {
                                  bgClass = "bg-amber-50 border-amber-400 shadow-md text-amber-800 scale-110 z-30";
                              } else if (isActive) {
                                  bgClass = "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                              }
                              
                              if (st.isSuccess) {
                                  if (valChanged) {
                                      bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 ring-4 ring-emerald-200";
                                  } else {
                                      bgClass = "bg-white border-slate-300 text-slate-700 shadow-md opacity-100 z-20 scale-100";
                                  }
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !isMatched && !isSuccessorTarget && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-sky-600 border border-sky-200`}>
                                              curr
                                          </span>
                                      )}
                                      {isMinFinder && !isSuccessorTarget && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-amber-600 border border-amber-200`}>
                                              min
                                          </span>
                                      )}
                                      {isMatched && !st.isSuccess && (
                                          <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-rose-500 text-white px-2 py-0.5 rounded shadow-lg animate-bounce`}>
                                              TARGET
                                          </span>
                                      )}
                                      {isSuccessorTarget && !st.isSuccess && (
                                          <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-amber-500 text-white px-2 py-0.5 rounded shadow-lg animate-bounce`}>
                                              SUCCESSOR
                                          </span>
                                      )}
                                      {valChanged && st.isSuccess && (
                                          <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-emerald-500 text-white px-2 py-0.5 rounded shadow-lg`}>
                                              REPLACED
                                          </span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{String(displayVal)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Misses */}
                          {st.currNodeId === null && st.hlCheckNull && (() => {
                              const parentId = st.callStack && st.callStack.length > 1 ? st.callStack[st.callStack.length - 2].match(/deleteNode\((\d+|null)/)?.[1] : null;
                              if (!parentId || parentId === 'null') return null;
                              const parent = treeData.nodes.find((n: any) => n.id.toString() === parentId);
                              if (!parent) return null;
                              
                              let isLeftChild = st.currentSearchKey < (st.nodeValues?.[parent.id] ?? parent.val);
                              let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                              let py = parent.y + 80;
                              return (
                                  <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                      left: `calc(50% + ${px}px)`, 
                                      top: `${py}px`, 
                                      transform: 'translate(-50%, -50%)' 
                                  }}>
                                      <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-slate-400 bg-slate-100 rounded-full shadow-lg ring-4 ring-slate-200">
                                          <span className="font-mono font-black text-[10px] text-slate-600">null</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Delete Node in a BST</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title}
                  </span>
                  <span>•</span>
                  <span>LeetCode 450</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Scissors size={28}/> The 3 Deletion Cases</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.</p>
                        <p>Basically, the deletion can be divided into two stages:</p>
                        <ol className="list-decimal pl-6 space-y-1 font-bold">
                            <li>Search for a node to remove.</li>
                            <li>If the node is found, delete the node.</li>
                        </ol>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Case 1: Delete a Leaf Node (0 Children)</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [5,3,6,2,4,null,7], key = 7</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[5,3,6,2,4]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Node <span className="text-rose-400 font-bold">7</span> has no children. We simply disconnect it from its parent (Node 6) by returning <code>null</code> to the recursive call.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <line x1="110" y1="30" x2="60" y2="100" stroke="#475569" strokeWidth="2"/>
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#475569" strokeWidth="2" />
                                {/* Deleted Edge */}
                                <line x1="160" y1="100" x2="185" y2="170" stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" opacity="0.5"/>

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="60" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="160" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="35" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                <circle cx="85" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="85" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>

                                {/* Deleted Node */}
                                <circle cx="185" cy="170" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="3" opacity="0.5"/>
                                <text x="185" y="174" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.5">7</text>
                                <line x1="175" y1="160" x2="195" y2="180" stroke="#f43f5e" strokeWidth="3" opacity="0.8"/>
                                <line x1="195" y1="160" x2="175" y2="180" stroke="#f43f5e" strokeWidth="3" opacity="0.8"/>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Case 2: Delete Node with 1 Child</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [5,3,6,2,4,null,7], key = 6</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[5,3,7,2,4]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Node <span className="text-rose-400 font-bold">6</span> has exactly one child (Node 7). We bypass Node 6 entirely by linking its parent (Node 5) directly to its child (Node 7).
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <line x1="110" y1="30" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
                                {/* Bypassed Edge */}
                                <line x1="110" y1="30" x2="185" y2="170" stroke="#10b981" strokeWidth="4" opacity="0.8"/>
                                
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#475569" strokeWidth="2" />

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                <circle cx="60" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="35" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                <circle cx="85" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="85" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>

                                {/* Bypassed Child */}
                                <circle cx="185" cy="170" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="3" />
                                <text x="185" y="174" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>

                                {/* Deleted Node & Old Edges*/}
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
                                <line x1="160" y1="100" x2="185" y2="170" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.3"/>
                                <circle cx="160" cy="100" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="3" opacity="0.5"/>
                                <text x="160" y="104" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.5">6</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Case 3: Delete Node with 2 Children</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [5,3,6,2,4,null,7], key = 3</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[5,4,6,2,null,null,7]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Node <span className="text-rose-400 font-bold">3</span> has two children (2 and 4). We cannot bypass it without losing a child. Instead, we find its "in-order successor" (the smallest value in its right subtree, which is <span className="text-amber-400 font-bold">4</span>). We copy 4 into the current node's spot, and then physically delete the old leaf node 4.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <line x1="110" y1="30" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#475569" strokeWidth="2" />
                                
                                {/* Deleted Edge to old 4 */}
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" opacity="0.4"/>
                                <line x1="160" y1="100" x2="185" y2="170" stroke="#475569" strokeWidth="2" />

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">5</text>
                                
                                {/* Replaced Node */}
                                <circle cx="60" cy="100" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
                                <text x="60" y="105" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">4</text>
                                <text x="40" y="90" fill="#f43f5e" fontSize="10" textAnchor="middle" fontWeight="bold" opacity="0.6">was 3</text>
                                
                                <circle cx="160" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">6</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="35" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>

                                {/* Old Successor Leaf */}
                                <circle cx="85" cy="170" r="14" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" opacity="0.4"/>
                                <text x="85" y="174" fill="#f43f5e" fontSize="12" textAnchor="middle" fontWeight="bold" opacity="0.4">4</text>
                                <line x1="75" y1="160" x2="95" y2="180" stroke="#f43f5e" strokeWidth="2" opacity="0.6"/>
                                <line x1="95" y1="160" x2="75" y2="180" stroke="#f43f5e" strokeWidth="2" opacity="0.6"/>

                                <circle cx="185" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="185" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [0, 10^4].</li>
                            <li>-10^5 &le; Node.val &le; 10^5</li>
                            <li>Each node has a <strong>unique</strong> value.</li>
                            <li><code>root</code> is a valid binary search tree.</li>
                            <li>-10^5 &le; key &le; 10^5</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-rose-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">Unlike searching or inserting, deleting a node in a BST is a complex structural operation. We must mathematically preserve the BST property: left children are strictly smaller, right children are strictly larger. If we delete a node with two children, we cannot just promote one child without breaking the tree.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2">To solve the 2-children problem, we must find a replacement value that is <strong>larger than everything in the left subtree</strong> and <strong>smaller than everything else in the right subtree</strong>.</p>
                        <p className="text-sm leading-relaxed text-slate-600">The only value that perfectly satisfies this is the <strong>In-Order Successor</strong>: the smallest possible value inside the right subtree. By swapping the target's value with the successor's value, the tree remains perfectly ordered. We then recursively delete that successor leaf node.</p>
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>BST Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="5, 3, 6, 2, 4, null, 7" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Key to Delete</label>
                            <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="3" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> DELETION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully returned updated root.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFindMinEntry || st.hlMinLoopCheck || st.hlMinMove || st.hlMinReturn ? 'text-amber-400' : (st.hlCompareLeft || st.hlRecurseLeft ? 'text-sky-400' : (st.hlCompareRight || st.hlRecurseRight ? 'text-violet-400' : (st.isMatched ? 'text-rose-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Call Stack Widget */}
                   {!st.isSuccess && st.callStack && (
                       <div className="absolute bottom-4 left-4 z-30 pointer-events-auto animate-in fade-in zoom-in duration-300">
                           <div className={`bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl p-4 flex flex-col transition-all duration-300 w-48 max-h-[250px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-400`}><LayersIcon size={12}/> Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                       let isTop = idx === 0;
                                       return (
                                           <div key={`frame-cs-${idx}`} className={`w-full py-1.5 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? (frameStr.startsWith('findMin') ? 'bg-amber-500 text-amber-950 border-amber-400 scale-100' : 'bg-rose-500 text-white border-rose-400 scale-100') : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the mathematical bounds of structural tree mutation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 1. Locating the Target</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The algorithm begins exactly like a standard BST Search. Because a Binary Search Tree is strictly sorted, we can find the node to delete in $O(H)$ time by ignoring half of the tree at every step. If the target is smaller than the current node, we recurse left; if larger, we recurse right. If we hit <code>null</code>, the target doesn't exist and we return the unmodified tree.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Scissors size={24} className="text-rose-500"/> 2. The 3 Deletion Cases</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once the node is found, we evaluate its children to determine how to delete it without breaking the BST property:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Case 1 (Leaf Node):</strong> If both children are null, we simply return <code>null</code>. The parent node will receive this <code>null</code> and effectively sever the connection.</li>
                            <li><strong>Case 2 (One Child):</strong> If the node lacks a left child, we return its <code>right</code> child. If it lacks a right child, we return its <code>left</code> child. This seamlessly "bypasses" the deleted node, linking its parent directly to its grandchild.</li>
                            <li><strong>Case 3 (Two Children):</strong> The hardest case. We must find a replacement value that maintains order. We find the <strong>In-Order Successor</strong> (the minimum value in the right subtree). We copy this value into our current node, overwriting the target. Then, we recursively call `deleteNode` on the right subtree to eliminate the original successor leaf node!</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(H).</strong> Finding the node takes $O(H)$ time where $H$ is the height of the tree. Finding the successor (if needed) takes an additional $O(H)$ time, and deleting it takes $O(H)$. Because all these operations are sequentially bounded by the height, the total time is strictly $O(H)$. In a balanced tree, this is $O(\log N)$.</li>
                            <li><strong>Space Complexity: O(H).</strong> The space complexity is dictated by the maximum depth of the recursive call stack. In the worst-case scenario (a skewed tree), the recursion will go $N$ levels deep, taking $O(N)$ space. In a balanced tree, the stack only reaches $O(\log N)$ depth.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a classic 'Hard-Medium' question. Interviewers use it to ensure you deeply understand tree structures, pointers, and the mathematical properties of Binary Search Trees."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "In Case 3 (two children), why do we use the minimum of the right subtree? Could we use something else?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, we could use the maximum of the left subtree instead.</p>
                            <p>To safely replace a node without violating the BST property, the replacement value must be strictly larger than everything in the left subtree, and strictly smaller than everything in the right subtree. There are only two nodes that satisfy this: the <strong>In-Order Successor</strong> (minimum of right subtree) or the <strong>In-Order Predecessor</strong> (maximum of left subtree). You can pick either one and the algorithm remains mathematically correct."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the line <code>root.right = deleteNode(root.right, root.val)</code>, aren't we causing an infinite loop by deleting the value we just set?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, because we are passing <code>root.right</code> as the new subtree to search!</p>
                            <p>By the time we hit that line, we have already copied the successor's value into <code>root.val</code>. So yes, we are now calling <code>deleteNode</code> looking for that successor value. However, we explicitly tell it to only search inside <code>root.right</code>. Therefore, it will traverse down, find the original duplicate successor node (which is guaranteed to be a leaf or have only 1 child), and delete it, cleanly terminating the recursion."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "How does the tree actually disconnect the deleted node? We just return values."</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It disconnects via pointer reassignment during the recursive unwind.</p>
                            <p>Because we call <code>root.left = deleteNode(...)</code>, the parent node is actively listening for the returned value to assign to its <code>left</code> pointer. If the child deletes itself, it returns <code>null</code>. The parent receives that <code>null</code> and essentially executes <code>root.left = null</code>, cleanly severing the connection. This is why recursive tree mutation is so powerful—we don't need to manually track parent pointers."</p>
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
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? `bg-emerald-900/40 border-emerald-800` : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlFindMinEntry || st.hlMinLoopCheck || st.hlMinMove || st.hlMinReturn ? 'text-amber-400' : (st.hlCompareLeft || st.hlRecurseLeft ? 'text-sky-400' : (st.hlCompareRight || st.hlRecurseRight ? 'text-violet-400' : (st.isMatched ? 'text-rose-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
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
                  {!st.isSuccess && st.callStack && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10">
                          <div className={`bg-slate-800 rounded-3xl border-2 border-slate-700 shadow-2xl p-5 flex flex-col transition-all duration-300 w-64 max-h-[350px] overflow-hidden`}>
                              <div className="flex justify-between items-center border-b border-slate-700 pb-3 mb-3 shrink-0">
                                  <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={14}/> Call Stack</span>
                              </div>
                              <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-2">
                                  {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                      let isTop = idx === 0;
                                      return (
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? (frameStr.startsWith('findMin') ? 'bg-amber-500 text-amber-950 border-amber-400 scale-100' : 'bg-rose-500 text-white border-rose-400 scale-100') : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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

                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>BST Input Array (Level Order)</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="5, 3, 6, 2, 4..." />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Key</label>
                              <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="3" />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10`}><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">DELETION COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Successfully updated Tree Root</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        SUCCESS
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