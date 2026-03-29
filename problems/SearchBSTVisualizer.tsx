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
  iterativeSearch: {
    id: 'iterativeSearch',
    title: '1. Iterative BST Search',
    icon: <Search size={16} />,
    complexity: 'Time: O(H) | Space: O(1)',
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
    public TreeNode searchBST(TreeNode root, int val) {
        while (root != null && root.val != val) {
            if (val < root.val) {
                root = root.left;
            } else {
                root = root.right;
            }
        }
        return root;
    }
}`,
    desc: "The most efficient approach in terms of memory. Because a Binary Search Tree (BST) is strictly ordered (left children are smaller, right children are larger), we don't need to explore the entire tree. We treat it like a 'choose your own adventure' book. At each node, we compare our target value. If it's smaller, we move to the left child. If it's larger, we move to the right. We loop until we either find the value or hit a null node (meaning it doesn't exist). Space complexity is O(1) because we just update a pointer."
  },
  recursiveSearch: {
    id: 'recursiveSearch',
    title: '2. Recursive BST Search',
    icon: <GitPullRequest size={16} />,
    complexity: 'Time: O(H) | Space: O(H)',
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
    public TreeNode searchBST(TreeNode root, int val) {
        if (root == null || root.val == val) {
            return root;
        }
        if (val < root.val) {
            return searchBST(root.left, val);
        } else {
            return searchBST(root.right, val);
        }
    }
}`,
    desc: "The classic, elegant recursive approach. The logic is identical to the iterative version: check the base cases first (is the node null? or did we find the value?). If neither is true, recursively call the function on either the left or right subtree depending on whether the target value is strictly less than or greater than the current node's value. While code-golf friendly, this approach uses O(H) stack memory for the recursive calls."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|while|for|new|String|searchBST|TreeNode|Solution|root|null|this|left|right|val)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isPointer = ['root', 'left', 'right', 'val'].includes(part);
            const isMapCall = ['searchBST'].includes(part);
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

export default function SearchBSTVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('iterativeSearch');
  
  const [treeInput, setTreeInput] = useState('4, 2, 7, 1, 3');
  const [targetInput, setTargetInput] = useState('2');
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([4, 2, 7, 1, 3]);
  const [targetVal, setTargetVal] = useState<number>(2);

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
      setBaseTreeArr(parseTreeInput(treeInput, [4, 2, 7, 1, 3]));
      
      const parsedTarget = parseInt(targetInput.trim(), 10);
      setTargetVal(isNaN(parsedTarget) ? 2 : parsedTarget);

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

      // Helper to easily get all IDs of a subtree rooted at a specific ID
      const getSubtreeIds = (nodeId: number | null): number[] => {
          if (nodeId === null) return [];
          const ids: number[] = [];
          const dfsCollect = (currId: number | null) => {
              if (currId === null) return;
              ids.push(currId);
              const node = renderNodes.find(n => n.id === currId);
              if (node && node.originalNode.left) dfsCollect(node.originalNode.left.id);
              if (node && node.originalNode.right) dfsCollect(node.originalNode.right.id);
          };
          dfsCollect(nodeId);
          return ids;
      };

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth, getSubtreeIds };
  };

  const treeData = useMemo(() => buildTreeGeometry(baseTreeArr), [baseTreeArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root && baseTreeArr.length === 0) return [];

    let callStack: string[] = [];
    let activePath: number[] = [];

    if (selectedOpId === 'iterativeSearch') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                activePath: [...activePath], ...st 
            } 
        });

        add("Function Call", `public TreeNode searchBST(TreeNode root, int val)`, 12, {});
        
        let curr = treeData.root;
        let isMatched = false;

        while (true) {
            if (steps.length > 2500) break; // Infinite loop guard
            
            let isNull = curr === null;
            let currVal = isNull ? null : curr.val;
            isMatched = !isNull && currVal === targetVal;
            
            if (!isNull) activePath.push(curr.id);

            add("Evaluate Loop Condition", `while (root != null && root.val != val)\nIs root null? ${isNull ? 'YES' : 'NO'}.\nIs root.val (${currVal !== null ? currVal : '?'}) == val (${targetVal})? ${isMatched ? 'YES' : 'NO'}.`, 13, { currNodeId: isNull ? null : curr.id, isNull, isMatched, hlWhile: true });

            if (isNull || isMatched) {
                break;
            }

            let isLess = targetVal < curr.val;
            add("Value Comparison", `if (val < root.val)\nIs the target (${targetVal}) strictly less than current node (${curr.val})? ${isLess ? 'YES' : 'NO'}.`, 14, { currNodeId: curr.id, isLess, hlIfLess: true });

            if (isLess) {
                add("Move Left", `root = root.left;\nTarget is smaller. Moving strictly to the LEFT subtree.`, 15, { currNodeId: curr.id, hlMoveLeft: true, nextNodeId: curr.left ? curr.left.id : null });
                curr = curr.left ? treeData.nodes.find(n => n.id === curr.left.id).originalNode : null;
            } else {
                add("Move Right", `root = root.right;\nTarget is larger. Moving strictly to the RIGHT subtree.`, 17, { currNodeId: curr.id, hlMoveRight: true, nextNodeId: curr.right ? curr.right.id : null });
                curr = curr.right ? treeData.nodes.find(n => n.id === curr.right.id).originalNode : null;
            }
        }

        let subtreeIds = isMatched ? treeData.getSubtreeIds(curr.id) : [];
        add("Return Result", `return root;\nSearch finished. Returning ${isMatched ? `the subtree rooted at ${targetVal}` : 'null'}.`, 20, { isSuccess: true, finalAns: isMatched ? targetVal : null, currNodeId: curr ? curr.id : null, subtreeIds });

    } 
    else if (selectedOpId === 'recursiveSearch') {
        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { 
                callStack: [...callStack], activePath: [...activePath], ...st 
            } 
        });

        const searchBST = (node: any | null): any | null => {
            if (steps.length > 2500) return null; // Guard

            let callStr = `searchBST(${node ? node.val : 'null'}, ${targetVal})`;
            callStack.push(callStr);
            if (node) activePath.push(node.id);

            add("DFS Entry", `public TreeNode searchBST(TreeNode root, int val)\nEntering node ${node ? node.val : 'null'}.`, 12, { currNodeId: node ? node.id : null });

            let isNull = node === null;
            let isMatched = !isNull && node.val === targetVal;

            add("Base Case Check", `if (root == null || root.val == val)\nIs node null? ${isNull ? 'YES' : 'NO'}. Is value a match? ${isMatched ? 'YES' : 'NO'}.`, 13, { currNodeId: node ? node.id : null, isNull, isMatched, hlBaseCheck: true });
            
            if (isNull || isMatched) {
                let retStr = isNull ? 'null' : `Subtree rooted at ${node.val}`;
                add("Return Base Case", `return root;\nBase condition met. Returning ${retStr}.`, 14, { currNodeId: node ? node.id : null, hlReturnBase: true, isMatched });
                callStack.pop();
                return node;
            }

            let isLess = targetVal < node.val;
            add("Value Comparison", `if (val < root.val)\nIs target (${targetVal}) smaller than current node (${node.val})? ${isLess ? 'YES' : 'NO'}.`, 16, { currNodeId: node.id, isLess, hlIfLess: true });

            let resultNode = null;
            if (isLess) {
                add("Recurse Left", `return searchBST(root.left, val);\nTarget is smaller. Recursing down the LEFT subtree.`, 17, { currNodeId: node.id, hlRecurseLeft: true });
                let nextNode = node.left ? treeData.nodes.find((n: any) => n.id === node.left.id).originalNode : null;
                resultNode = searchBST(nextNode);
            } else {
                add("Recurse Right", `return searchBST(root.right, val);\nTarget is larger. Recursing down the RIGHT subtree.`, 19, { currNodeId: node.id, hlRecurseRight: true });
                let nextNode = node.right ? treeData.nodes.find((n: any) => n.id === node.right.id).originalNode : null;
                resultNode = searchBST(nextNode);
            }

            // In recursion, the bubbled up result passes back through the stack
            if (callStack.length > 1) {
                 add("Bubble Up", `return ...;\nBubbling the found result (${resultNode ? resultNode.val : 'null'}) up the call stack.`, isLess ? 17 : 19, { currNodeId: node.id, hlRecurseLeft: isLess, hlRecurseRight: !isLess });
            }

            callStack.pop();
            return resultNode;
        };

        if (baseTreeArr.length >= 0) {
            let finalAnsNode = searchBST(treeData.root);
            let isMatched = finalAnsNode !== null;
            let subtreeIds = isMatched ? treeData.getSubtreeIds(finalAnsNode.id) : [];
            
            add("Execution Complete", `Tree traversal finished. The result is ${isMatched ? `the subtree rooted at ${targetVal}` : 'null'}.`, 12, { isSuccess: true, finalAns: isMatched ? targetVal : null, subtreeIds });
        }
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
      let currVal = currNodeData ? currNodeData.val : null;

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isMatched ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : (st.isNull ? 'border-rose-400 ring-4 ring-rose-100 scale-105' : 'border-slate-200')}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Search size={14}/> Active Search State</span>
              
              {st.currNodeId === null && st.isNull ? (
                  <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                       <div className="flex items-center gap-4 text-rose-600 font-mono font-black text-xl bg-rose-50 px-6 py-3 rounded-2xl border-2 border-rose-300 shadow-md">
                           <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-200 text-rose-700 uppercase tracking-widest text-base">Value Not Found</span>
                       </div>
                  </div>
              ) : st.currNodeId !== null ? (
                  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                      
                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Target (val)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl bg-slate-50 border-slate-300 text-slate-700 shadow-inner`}>
                              {String(targetVal)}
                          </div>
                      </div>

                      <div className="flex flex-col items-center justify-center font-bold px-2 w-12">
                          <span className={`text-4xl transition-colors duration-300 ${st.hlIfLess || st.hlWhile ? (st.isLess ? 'text-sky-500' : (st.isMatched ? 'text-emerald-500' : 'text-amber-500')) : 'text-slate-300'}`}>
                              {st.isMatched ? '==' : (st.isLess ? '<' : '>')}
                          </span>
                      </div>

                      <div className="flex flex-col items-center min-w-[100px]">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>curr (root.val)</span>
                          <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.isMatched ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-lg scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                              {currVal !== null ? String(currVal) : '?'}
                          </div>
                      </div>
                      
                      {st.hlIfLess || st.hlMoveLeft || st.hlMoveRight || st.hlRecurseLeft || st.hlRecurseRight ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300"/>
                              <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.isLess ? 'text-sky-500' : 'text-amber-500'}`}>Action</span>
                                  <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl transition-all duration-500 shadow-md ${st.isLess ? 'bg-sky-100 border-sky-400 text-sky-800' : 'bg-amber-100 border-amber-400 text-amber-800'}`}>
                                      {st.isLess ? 'GO LEFT' : 'GO RIGHT'}
                                  </div>
                              </div>
                          </>
                      ) : st.isMatched ? (
                          <>
                              <ArrowRight size={24} className="text-slate-300"/>
                              <div className="flex flex-col items-center min-w-[120px] animate-in slide-in-from-right-4 duration-300">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Action</span>
                                  <div className={`border-2 text-xl font-black px-6 py-2 rounded-xl bg-emerald-500 border-emerald-600 text-white shadow-xl scale-110 uppercase tracking-widest`}>
                                      Match Found
                                  </div>
                              </div>
                          </>
                      ) : null}

                  </div>
              ) : (
                  <div className="flex items-center justify-center w-full min-h-[80px]">
                      <span className="text-slate-400 italic text-sm font-mono">Initializing Search...</span>
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
                                  {treeData.edges.map((edge: any, i: number) => {
                                      let isActivePath = false;
                                      let isSubtree = false;

                                      if (st.activePath) {
                                          for(let p = 0; p < st.activePath.length - 1; p++) {
                                              if (st.activePath[p] === edge.source && st.activePath[p+1] === edge.target) {
                                                  isActivePath = true;
                                              }
                                          }
                                      }

                                      if (st.isSuccess && st.subtreeIds && st.subtreeIds.includes(edge.source) && st.subtreeIds.includes(edge.target)) {
                                          isSubtree = true;
                                      }
                                      
                                      let strokeColor = '#e2e8f0'; // slate-200
                                      let strokeWidth = 2;
                                      let opacity = 0.5;

                                      if (isSubtree) {
                                          strokeColor = '#10b981'; // emerald-500
                                          strokeWidth = 5;
                                          opacity = 1;
                                      } else if (isActivePath) {
                                          strokeColor = themeColor === 'sky' ? '#38bdf8' : '#34d399'; // sky-400 / emerald-400
                                          strokeWidth = 4;
                                          opacity = 0.9;
                                      }
                                      
                                      if (st.isSuccess && !isSubtree) {
                                          opacity = 0.15;
                                      }

                                      return <line key={`edge-${i}`} x1={edge.sx} y1={edge.sy + 20} x2={edge.tx} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                                  })}

                                  {/* Render Virtual Null Missing Edge indicating a miss */}
                                  {st.isNull && st.activePath && st.activePath.length > 0 && (() => {
                                      const parentId = st.activePath[st.activePath.length - 1];
                                      const parent = treeData.nodes.find((n: any) => n.id === parentId);
                                      if (!parent) return null;
                                      
                                      // Determine side based on target value
                                      let isLeftChild = targetVal < parent.val;
                                      let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                                      let py = parent.y + 80;
                                      return <line x1={parent.x} y1={parent.y + 20} x2={px} y2={py - 20} stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" opacity={0.6} className="animate-pulse transition-all duration-500" />
                                  })()}
                              </g>
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isPath = st.activePath && st.activePath.includes(node.id);
                              let isSubtree = st.isSuccess && st.subtreeIds && st.subtreeIds.includes(node.id);
                              let isRootSubtree = isSubtree && node.val === targetVal;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isRootSubtree) {
                                  bgClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-40 ring-4 ring-emerald-200";
                              } else if (isSubtree) {
                                  bgClass = "bg-emerald-100 border-emerald-500 text-emerald-900 shadow-md z-30 scale-105";
                              } else if (isActive) {
                                  if (st.isMatched) {
                                      bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30";
                                  } else {
                                      bgClass = selectedOpId === 'dfsRecursive' ? "bg-emerald-50 border-emerald-400 ring-4 ring-emerald-100 shadow-lg text-emerald-800 scale-110 z-30" : "bg-sky-50 border-sky-400 ring-4 ring-sky-100 shadow-lg text-sky-800 scale-110 z-30";
                                  }
                              } else if (isPath) {
                                  bgClass = "bg-slate-100 border-slate-300 text-slate-600 opacity-90 z-20";
                              }
                              
                              if (st.isSuccess && !isSubtree) {
                                  bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 z-10 scale-90 blur-[1px]";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce ${selectedOpId === 'dfsRecursive' ? 'text-emerald-600 border border-emerald-200' : 'text-sky-600 border border-sky-200'}`}>
                                              curr
                                          </span>
                                      )}
                                      {isRootSubtree && (
                                          <span className={`text-[10px] font-black font-mono uppercase tracking-widest absolute -top-7 whitespace-nowrap bg-emerald-500 text-white px-2 py-0.5 rounded shadow-lg animate-bounce`}>
                                              Subtree Found
                                          </span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{String(node.val)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Misses */}
                          {st.isNull && st.activePath && st.activePath.length > 0 && (() => {
                              const parentId = st.activePath[st.activePath.length - 1];
                              const parent = treeData.nodes.find((n: any) => n.id === parentId);
                              if (!parent) return null;
                              
                              let isLeftChild = targetVal < parent.val;
                              let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                              let py = parent.y + 80;
                              return (
                                  <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                      left: `calc(50% + ${px}px)`, 
                                      top: `${py}px`, 
                                      transform: 'translate(-50%, -50%)' 
                                  }}>
                                      <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-rose-400 bg-rose-100 rounded-full shadow-lg ring-4 ring-rose-200">
                                          <span className="font-mono font-black text-[10px] text-rose-800">null</span>
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Search in a BST</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 700</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Search size={28}/> Navigating the BST</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given the <code>root</code> of a binary search tree (BST) and an integer <code>val</code>.</p>
                        <p className="font-bold mt-4">Find the node in the BST that the node's value equals <code>val</code> and return the subtree rooted with that node. If such a node does not exist, return <code>null</code>.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [4,2,7,1,3], val = 2</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[2,1,3]</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                We start at root 4. Since 2 &lt; 4, we search the left subtree.<br/>
                                We find node 2. We return this node, which includes its entire subtree <span className="text-emerald-400 font-bold">[2,1,3]</span>.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <line x1="110" y1="30" x2="60" y2="100" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#10b981" strokeWidth="4" opacity="0.6"/>
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#10b981" strokeWidth="4" opacity="0.6"/>

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="60" cy="100" r="16" fill="#064e3b" stroke="#10b981" strokeWidth="4" />
                                <text x="60" y="105" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="160" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="35" y="174" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>

                                <circle cx="85" cy="170" r="14" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                                <text x="85" y="174" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [4,2,7,1,3], val = 5</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">[] (null)</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                5 &gt; 4, so go right to node 7.<br/>
                                5 &lt; 7, so go left. Node 7 has no left child (null).<br/>
                                We return <span className="text-rose-400 font-bold">null</span> because the node does not exist.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center relative">
                            <svg width="220" height="200" viewBox="0 0 220 200">
                                <line x1="110" y1="30" x2="60" y2="100" stroke="#475569" strokeWidth="2" />
                                <line x1="110" y1="30" x2="160" y2="100" stroke="#f43f5e" strokeWidth="4" opacity="0.6"/>
                                <line x1="60" y1="100" x2="35" y2="170" stroke="#475569" strokeWidth="2" />
                                <line x1="60" y1="100" x2="85" y2="170" stroke="#475569" strokeWidth="2" />
                                <line x1="160" y1="100" x2="135" y2="170" stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" opacity="0.6"/>

                                <circle cx="110" cy="30" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="110" y="34" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">4</text>
                                
                                <circle cx="60" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="60" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">2</text>
                                
                                <circle cx="160" cy="100" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="160" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">7</text>
                                
                                <circle cx="35" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="35" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>

                                <circle cx="85" cy="170" r="14" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                                <text x="85" y="174" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">3</text>

                                <circle cx="135" cy="170" r="12" fill="#4c0519" stroke="#f43f5e" strokeWidth="2" />
                                <text x="135" y="173" fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold">null</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [1, 5000].</li>
                            <li>1 &le; Node.val &le; 10^7</li>
                            <li><code>root</code> is a binary search tree.</li>
                            <li>1 &le; val &le; 10^7</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">Unlike a standard Binary Tree where we must check every node (O(N) time), a <strong>Binary Search Tree</strong> is inherently sorted. For any node, all values in its left subtree are strictly smaller, and all values in its right subtree are strictly larger. This structural guarantee is the core of binary search.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>Iterative Search:</strong> Use a simple <code>while</code> loop. Update the <code>root</code> pointer to <code>root.left</code> if target is smaller, or <code>root.right</code> if target is larger. Returns immediately on a match or null hit. Memory is O(1).</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>Recursive Search:</strong> Create recursive calls pushing deeper into the tree based on the value comparison. Very elegant code, but uses O(H) call stack memory.</p>
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="4, 2, 7, 1, 3" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Target (val)</label>
                            <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold text-center`} placeholder="2" />
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
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> SEARCH COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found result: {st.finalAns !== null ? `Subtree [${st.finalAns}, ...]` : 'null'}</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlIfLess || st.hlMoveLeft || st.hlRecurseLeft ? 'text-sky-400' : (st.hlMoveRight || st.hlRecurseRight ? 'text-amber-400' : (st.isMatched ? 'text-emerald-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[500px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Call Stack Widget */}
                   {selectedOpId === 'recursiveSearch' && !st.isSuccess && st.callStack && (
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the power of Binary Search Trees.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Network size={24} className="text-sky-500"/> 1. The BST Property</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">A Binary Search Tree has a strict structural rule: For any given node, <strong>every node in its left subtree is strictly smaller</strong>, and <strong>every node in its right subtree is strictly larger</strong>.</p>
                        <p className="text-slate-600 leading-relaxed">Because of this rule, we never have to search the entire tree. If our target is <code>2</code> and we are at node <code>4</code>, we know with absolute mathematical certainty that <code>2</code> cannot possibly be in the right subtree. We can safely ignore half of the remaining tree at every step, making the search incredibly fast.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Repeat size={24} className="text-emerald-500"/> 2. Iterative vs. Recursive</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Both approaches follow the exact same logical path. They compare the target to the current node and move left or right.</p>
                        <p className="text-slate-600 leading-relaxed">The <strong>Iterative</strong> approach just uses a <code>while</code> loop to update a single pointer (<code>root = root.left</code>). This uses $O(1)$ memory. The <strong>Recursive</strong> approach calls the function again (<code>searchBST(root.left, val)</code>), which adds a new frame to the computer's call stack, using $O(H)$ memory. In production, iterative is almost always preferred for BST traversal to avoid stack overflow on massive, unbalanced trees.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(H).</strong> Where $H$ is the height of the tree. In the best-case scenario (a perfectly balanced tree), the height is $\log_2(N)$, so the search is $O(\log N)$. In the absolute worst-case scenario (a tree skewed entirely to one side, basically a linked list), the height is $N$, resulting in an $O(N)$ search.</li>
                            <li><strong>Space Complexity:</strong> 
                                <ul className="list-circle pl-6 mt-1">
                                    <li>Iterative: <strong>O(1)</strong>. We only use a single pointer variable.</li>
                                    <li>Recursive: <strong>O(H)</strong>. The call stack builds up to the height of the tree.</li>
                                </ul>
                            </li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is considered a fundamental 'warm-up' question. Interviewers use it to ensure you understand basic tree properties and can write clean, bug-free traversal code before moving to harder variations."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can a standard Binary Tree (not a BST) be searched in O(log N) time?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, it cannot.</p>
                            <p>A standard binary tree has no inherent ordering rules. If we are at the root and looking for the number 5, we have no way of knowing if 5 is in the left subtree, the right subtree, or neither. We are forced to do a full DFS or BFS traversal to check every single node, resulting in an $O(N)$ time complexity. The $O(\log N)$ speed is exclusively unlocked by the strict sorting property of the BST."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the iterative code, we use `root = root.left`. Are we destroying the original tree?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, we are not destroying or modifying the tree structure.</p>
                            <p>In Java, <code>root</code> is just a local reference (pointer) to a memory address passed into the function. When we do <code>root = root.left</code>, we are only changing where our local <code>root</code> variable points. We are essentially just moving our 'finger' down the tree. The actual <code>TreeNode</code> objects in heap memory and their <code>left/right</code> connections remain completely untouched."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "If this BST has 10 million nodes, but is completely unbalanced (like a straight line), what happens if you use the recursive approach?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "You will likely get a <code>StackOverflowError</code>.</p>
                            <p>If the tree is a straight line of 10 million nodes, the height $H$ is 10 million. The recursive approach will create 10 million nested function calls on the execution stack. The JVM's default stack size is usually around 1MB, which will fill up rapidly and crash the program. The iterative approach handles this perfectly because it only uses a single pointer, requiring $O(1)$ memory regardless of tree height."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlIfLess || st.hlMoveLeft || st.hlRecurseLeft ? 'text-sky-400' : (st.hlMoveRight || st.hlRecurseRight ? 'text-amber-400' : (st.isMatched ? 'text-emerald-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                  {selectedOpId === 'recursiveSearch' && !st.isSuccess && st.callStack && (
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
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[2] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>BST Input Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="4, 2, 7, 1, 3" />
                          </div>
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Target (val)</label>
                              <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold text-center`} placeholder="2" />
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
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">SEARCH COMPLETE</h2>
                                <p className={`text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Search Result</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center justify-center gap-4 max-w-full px-4">
                                        {st.finalAns !== null ? `Subtree [${String(st.finalAns)}, ...]` : 'null'}
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