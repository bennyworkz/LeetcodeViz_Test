import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ArrowDown, ChevronLeft, ChevronRight,
  Network, RotateCcw, ListOrdered, Goal, Layers, 
  ZoomIn, ZoomOut, Maximize, ShieldAlert, MonitorPlay,
  PartyPopper, Layers as LayersIcon, CheckSquare,
  Lightbulb, Workflow, Calculator, GitPullRequest, GitFork, Minimize
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dfsRecursion: {
    id: 'dfsRecursion',
    title: '1. Depth-First Search (Recursion)',
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
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) {
            return 0;
        }
        
        int leftDepth = maxDepth(root.left);
        int rightDepth = maxDepth(root.right);
        
        return Math.max(leftDepth, rightDepth) + 1;
    }
}`,
    desc: "The standard and most elegant approach. We traverse all the way down to the leaf nodes. When we hit a null child, it returns 0. As the recursion unwinds, each node receives the depths of its left and right children, takes the maximum, adds 1, and returns that value to its parent."
  },
  bfsIterative: {
    id: 'bfsIterative',
    title: '2. Breadth-First Search (Queue)',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(W)',
    theme: 'sky',
    code: `/**
 * Definition for a binary tree node.
 */
public class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int depth = 0;
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode curr = queue.poll();
                
                if (curr.left != null) queue.offer(curr.left);
                if (curr.right != null) queue.offer(curr.right);
            }
            depth++;
        }
        
        return depth;
    }
}`,
    desc: "Uses a Queue to traverse the tree level by level. We process all nodes at the current depth before moving deeper. The queue size at the start of the while loop tells us exactly how many nodes are on the current level. We increment the depth counter after finishing a full level."
  },
  dfsIterative: {
    id: 'dfsIterative',
    title: '3. Depth-First Search (Stack)',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'amber',
    code: `/**
 * Definition for a binary tree node.
 */
public class TreeNode {
    int val; TreeNode left; TreeNode right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public int maxDepth(TreeNode root) {
        if (root == null) return 0;
        
        Stack<TreeNode> nodeStack = new Stack<>();
        Stack<Integer> depthStack = new Stack<>();
        
        nodeStack.push(root);
        depthStack.push(1);
        int max = 0;
        
        while (!nodeStack.isEmpty()) {
            TreeNode curr = nodeStack.pop();
            int currDepth = depthStack.pop();
            
            max = Math.max(max, currDepth);
            
            if (curr.left != null) {
                nodeStack.push(curr.left);
                depthStack.push(currDepth + 1);
            }
            if (curr.right != null) {
                nodeStack.push(curr.right);
                depthStack.push(currDepth + 1);
            }
        }
        return max;
    }
}`,
    desc: "Avoids recursion (and potential StackOverflowErrors on deep trees) by manually managing the call stack using the JVM's Heap via a Stack data structure. We simultaneously push the node and its corresponding depth. We update the max depth tracker whenever we pop a node."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|maxDepth|TreeNode|Solution|root|null|this|left|right|leftDepth|rightDepth|Math|max|Queue|LinkedList|offer|poll|isEmpty|size|Stack|push|pop|nodeStack|depthStack)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
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
            const isObject = ['TreeNode', 'Math', 'Solution', 'Queue', 'LinkedList', 'Stack', 'Integer'].includes(part);
            const isPointer = ['root', 'left', 'right', 'leftDepth', 'rightDepth', 'curr', 'queue', 'nodeStack', 'depthStack'].includes(part);
            const isMapCall = ['maxDepth', 'max', 'offer', 'poll', 'isEmpty', 'size', 'push', 'pop'].includes(part);
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
  
  const [treeInput, setTreeInput] = useState('3, 9, 20, null, null, 15, 7');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([3, 9, 20, null, null, 15, 7]);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  useEffect(() => {
    const timer = setTimeout(() => {
      let rawTokens = treeInput.split(',');
      let parsedTree: (number | null)[] = [];
      
      for (let token of rawTokens) {
          let t = token.trim().toLowerCase();
          if (t === 'null' || t === 'n') {
              parsedTree.push(null);
          } else {
              let num = parseInt(t, 10);
              if (!isNaN(num)) {
                  parsedTree.push(num);
              }
          }
      }
      
      if (parsedTree.length === 0) parsedTree = [3, 9, 20, null, null, 15, 7];
      if (parsedTree.length > 31) parsedTree = parsedTree.slice(0, 31); // UI limits depth to ~5
      
      // Trim trailing nulls
      while(parsedTree.length > 0 && parsedTree[parsedTree.length - 1] === null) {
          parsedTree.pop();
      }

      setBaseTreeArr(parsedTree);
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
  const treeData = useMemo(() => {
      if (baseTreeArr.length === 0) return { root: null, nodes: [], edges: [], maxDepth: 0 };

      // Build real tree
      let nodesObj: any[] = [];
      let root = { val: baseTreeArr[0], id: 0, left: null, right: null, gridX: 0, gridY: 0 };
      nodesObj.push(root);
      
      let queue = [root];
      let i = 1;
      
      while (queue.length > 0 && i < baseTreeArr.length) {
          let curr = queue.shift()!;
          
          if (i < baseTreeArr.length && baseTreeArr[i] !== null) {
              curr.left = { val: baseTreeArr[i], id: i, left: null, right: null, gridX: 0, gridY: 0 };
              nodesObj.push(curr.left);
              queue.push(curr.left);
          }
          i++;
          
          if (i < baseTreeArr.length && baseTreeArr[i] !== null) {
              curr.right = { val: baseTreeArr[i], id: i, left: null, right: null, gridX: 0, gridY: 0 };
              nodesObj.push(curr.right);
              queue.push(curr.right);
          }
          i++;
      }

      // Assign coordinates using in-order traversal
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

      // Generate renderable nodes and edges
      let renderNodes: any[] = [];
      let renderEdges: any[] = [];
      
      const paddingX = 10;
      const usableWidth = 80;
      const totalWidthUnits = Math.max(1, xCounter - 1);
      
      nodesObj.forEach(n => {
          let px = paddingX + (n.gridX / totalWidthUnits) * usableWidth;
          let py = n.gridY * 80 + 40; // 80px per depth level, shifted down by 40px
          
          renderNodes.push({ id: n.id, val: n.val, x: px, y: py, originalNode: n });
          
          if (n.left) {
              let clx = paddingX + (n.left.gridX / totalWidthUnits) * usableWidth;
              let cly = n.left.gridY * 80 + 40;
              renderEdges.push({ source: n.id, target: n.left.id, sx: px, sy: py, tx: clx, ty: cly });
          }
          if (n.right) {
              let crx = paddingX + (n.right.gridX / totalWidthUnits) * usableWidth;
              let cry = n.right.gridY * 80 + 40;
              renderEdges.push({ source: n.id, target: n.right.id, sx: px, sy: py, tx: crx, ty: cry });
          }
      });

      return { root, nodes: renderNodes, edges: renderEdges, maxDepth };
  }, [baseTreeArr]);

  // Generate algorithm traces
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root && baseTreeArr.length === 0) return [];

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { ...st } 
    });

    if (selectedOpId === 'dfsRecursion') {
        let callStack: string[] = [];
        let nodeReturns: Record<string, number> = {};
        let nodeLeftDepths: Record<string, number> = {};
        let nodeRightDepths: Record<string, number> = {};

        const addDFS = (ph: string, ds: string, ln: number, st: any) => add(ph, ds, ln, {
            callStack: [...callStack], nodeReturns: { ...nodeReturns },
            nodeLeftDepths: { ...nodeLeftDepths }, nodeRightDepths: { ...nodeRightDepths },
            ...st
        });

        const dfs = (node: any | null, side: string = "root", parentId: number | null = null): number => {
            if (steps.length > 1000) return 0; // Guard
            
            let callStr = `maxDepth(${node ? node.val : 'null'})`;
            callStack.push(callStr);

            addDFS("Function Call", `Entering function. Current node is ${node ? node.val : 'null'}.`, 12, { currNodeId: node ? node.id : null, parentId, side });
            addDFS("Base Case Check", `if (root == null)\nIs the current node null? (${node == null ? 'Yes' : 'No'})`, 13, { currNodeId: node ? node.id : null, parentId, side, hlCheckNull: true });

            if (node == null) {
                addDFS("Return Base Case", `return 0;\nHit an empty leaf space. Returning 0.`, 14, { currNodeId: null, parentId, side, hlReturnNull: true });
                callStack.pop();
                return 0;
            }

            addDFS("Recurse Left", `int leftDepth = maxDepth(root.left);\nPausing current node (${node.val}) to traverse left subtree.`, 17, { currNodeId: node.id, hlRecurseLeft: true });
            let leftD = dfs(node.left, "left", node.id);
            nodeLeftDepths[node.id] = leftD;
            addDFS("Left Return", `Left subtree of ${node.val} finished. Returned depth of ${leftD}.`, 17, { currNodeId: node.id, leftD, hlRecurseLeftRes: true });

            addDFS("Recurse Right", `int rightDepth = maxDepth(root.right);\nPausing current node (${node.val}) to traverse right subtree.`, 18, { currNodeId: node.id, leftD, hlRecurseRight: true });
            let rightD = dfs(node.right, "right", node.id);
            nodeRightDepths[node.id] = rightD;
            addDFS("Right Return", `Right subtree of ${node.val} finished. Returned depth of ${rightD}.`, 18, { currNodeId: node.id, leftD, rightD, hlRecurseRightRes: true });

            let maxOfChildren = Math.max(leftD, rightD);
            let myDepth = maxOfChildren + 1;
            nodeReturns[node.id] = myDepth;

            addDFS("Calculate and Return", `Math.max(${leftD}, ${rightD}) + 1 = ${myDepth}.\nReturning ${myDepth} to parent.`, 20, { currNodeId: node.id, leftD, rightD, maxOfChildren, myDepth, hlReturnCalc: true });

            callStack.pop();
            return myDepth;
        };

        if (!treeData.root) {
             addDFS("Empty Tree", "Tree empty, return 0.", 13, { isSuccess: true, finalAns: 0 });
             return steps;
        }
        let finalDepth = dfs(treeData.root);
        addDFS("Execution Complete", `Traversal finished. Maximum depth is ${finalDepth}.`, 20, { isSuccess: true, finalAns: finalDepth, finalNodeReturns: { ...nodeReturns } });
    }
    else if (selectedOpId === 'bfsIterative') {
        if (!treeData.root) {
             add("Base Case", "root == null, returning 0", 11, { currNodeId: null });
             add("Return", "Tree is empty.", 11, { isSuccess: true, finalAns: 0 });
             return steps;
        }
        
        let q: any[] = [];
        let depth = 0;
        
        add("Init Check", "Checking if root is null. It's not.", 11, { currNodeId: treeData.root.id, qState: [] });
        
        q.push(treeData.root);
        add("Init Queue", "Queue<TreeNode> queue = new LinkedList<>();\nqueue.offer(root);\nPushing root to queue.", 14, { currNodeId: treeData.root.id, qState: [...q], hlPush: treeData.root.id });
        
        add("Init Depth", "int depth = 0;\nSetting initial depth counter to 0.", 15, { currNodeId: null, qState: [...q], depth });

        while (q.length > 0) {
            if (steps.length > 1000) break;
            add("While Loop", "while (!queue.isEmpty())\nQueue has nodes. Continuing traversal.", 17, { currNodeId: null, qState: [...q], depth });
            
            let levelSize = q.length;
            add("Level Size", `int levelSize = queue.size();\nCurrent level has ${levelSize} node(s).`, 18, { currNodeId: null, qState: [...q], depth, levelSize });
            
            for (let i = 0; i < levelSize; i++) {
                add("For Loop Iteration", `Processing node ${i + 1} of ${levelSize} on this level.`, 20, { currNodeId: null, qState: [...q], depth, levelSize, iter: i });
                
                let curr = q.shift();
                add("Poll Node", `TreeNode curr = queue.poll();\nPopping node ${curr.val} from queue.`, 21, { currNodeId: curr.id, qState: [...q], depth, levelSize });
                
                if (curr.left) {
                    q.push(curr.left);
                    add("Push Left", `if (curr.left != null) queue.offer(curr.left);\nPushing left child ${curr.left.val} to queue.`, 23, { currNodeId: curr.id, qState: [...q], depth, levelSize, hlPush: curr.left.id });
                }
                
                if (curr.right) {
                    q.push(curr.right);
                    add("Push Right", `if (curr.right != null) queue.offer(curr.right);\nPushing right child ${curr.right.val} to queue.`, 24, { currNodeId: curr.id, qState: [...q], depth, levelSize, hlPush: curr.right.id });
                }
            }
            depth++;
            add("Increment Depth", `depth++;\nFinished level. Incrementing depth to ${depth}.`, 26, { currNodeId: null, qState: [...q], depth });
        }
        
        add("Return Depth", `Queue is empty. returning depth.`, 29, { isSuccess: true, finalAns: depth, qState: [], depth });
    }
    else if (selectedOpId === 'dfsIterative') {
        if (!treeData.root) {
             add("Base Case", "root == null, returning 0", 11, { currNodeId: null });
             add("Return", "Tree is empty.", 11, { isSuccess: true, finalAns: 0 });
             return steps;
        }

        add("Init Check", "Checking if root is null. It's not.", 11, { currNodeId: treeData.root.id, stackState: [] });
        
        let stack: {node: any, depth: number}[] = [];
        let max = 0;

        add("Init Stacks", "Stack<TreeNode> nodeStack = new Stack<>();\nStack<Integer> depthStack = new Stack<>();\nInitializing stacks.", 13, { currNodeId: null, stackState: [...stack], max });
        
        stack.push({node: treeData.root, depth: 1});
        add("Push Root", "Pushing root and depth 1 to stacks.", 16, { currNodeId: treeData.root.id, stackState: [...stack], max, hlPush: treeData.root.id });
        
        add("Init Max", "int max = 0;\nSetting max tracker to 0.", 18, { currNodeId: null, stackState: [...stack], max });

        while(stack.length > 0) {
            if(steps.length > 1000) break;
            add("While Loop", "while (!nodeStack.isEmpty())\nStack has nodes. Continuing DFS.", 20, { currNodeId: null, stackState: [...stack], max });
            
            let popped = stack.pop()!;
            let curr = popped.node;
            let currDepth = popped.depth;
            
            add("Pop Node & Depth", `Popping node ${curr.val} (depth ${currDepth}) from stacks.`, 21, { currNodeId: curr.id, stackState: [...stack], max, currDepth });
            
            max = Math.max(max, currDepth);
            add("Update Max", `max = Math.max(max, currDepth);\nUpdating max depth from ${max === Math.max(max, currDepth) ? max : max - 1} to ${max}.`, 24, { currNodeId: curr.id, stackState: [...stack], max, currDepth, hlMaxUpdate: true });

            if (curr.left) {
                stack.push({node: curr.left, depth: currDepth + 1});
                add("Push Left", `if (curr.left != null) push left child (${curr.left.val}) with depth ${currDepth + 1}.`, 26, { currNodeId: curr.id, stackState: [...stack], max, hlPush: curr.left.id });
            }
            if (curr.right) {
                stack.push({node: curr.right, depth: currDepth + 1});
                add("Push Right", `if (curr.right != null) push right child (${curr.right.val}) with depth ${currDepth + 1}.`, 30, { currNodeId: curr.id, stackState: [...stack], max, hlPush: curr.right.id });
            }
        }
        add("Return Max", `Stack is empty. Returning max depth.`, 35, { isSuccess: true, finalAns: max, stackState: [], max });
    }

    return steps;
  }, [baseTreeArr, treeData, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

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

  const renderActiveDashboard = () => {
      if (st.isSuccess) return null;

      if (selectedOpId === 'dfsRecursion') {
          return (
            <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlReturnCalc ? 'border-emerald-300 ring-4 ring-emerald-100' : (st.hlCheckNull || st.hlReturnNull ? 'border-sky-300 ring-4 ring-sky-100' : 'border-slate-200')}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Calculator size={14}/> Recursion Dashboard</span>
                
                {st.currNodeId === null ? (
                    <div className="flex flex-col items-center justify-center w-full min-h-[100px] animate-in zoom-in duration-300 py-4">
                        <div className="flex items-center gap-4 text-sky-600 font-mono font-black text-xl bg-sky-50 px-6 py-4 rounded-2xl border-2 border-sky-300 shadow-md">
                            <span>root == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-sky-200">return 0</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 mt-4 uppercase tracking-widest">Base case reached. No children to process.</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[100px] py-4">
                        {/* Left Depth */}
                        <div className="flex flex-col items-center min-w-[80px]">
                            <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlRecurseLeft || st.hlRecurseLeftRes ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`}>leftDepth</span>
                            <div className={`border-2 text-3xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.leftD !== undefined ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                {st.leftD !== undefined ? st.leftD : '?'}
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center opacity-50">
                            <span className="text-xs font-black uppercase">Math.max</span>
                            <span className="text-2xl font-black">(</span>
                        </div>
                        
                        {/* Right Depth */}
                        <div className="flex flex-col items-center min-w-[80px]">
                            <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlRecurseRight || st.hlRecurseRightRes ? 'text-emerald-600 animate-pulse' : 'text-slate-400'}`}>rightDepth</span>
                            <div className={`border-2 text-3xl font-black px-4 py-2 rounded-xl transition-all duration-300 ${st.rightD !== undefined ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                {st.rightD !== undefined ? st.rightD : '?'}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center opacity-50">
                            <span className="text-2xl font-black">)</span>
                        </div>

                        <span className="text-3xl font-black text-slate-400">+ 1 =</span>

                        {/* Result */}
                        <div className="flex flex-col items-center min-w-[100px]">
                            <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlReturnCalc ? 'text-emerald-500' : 'text-slate-400'}`}>Return</span>
                            <div className={`border-2 text-4xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlReturnCalc ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                {st.myDepth !== undefined ? st.myDepth : '?'}
                            </div>
                        </div>
                    </div>
                )}
            </div>
          );
      } else if (selectedOpId === 'bfsIterative') {
          return (
             <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-200 shadow-xl w-full max-w-4xl flex flex-col items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><LayersIcon size={14}/> BFS Queue Dashboard</span>
                
                <div className="flex w-full gap-6">
                    {/* Variables Panel */}
                    <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 w-1/3 min-w-[150px]">
                        <div className="flex justify-between items-center border-b pb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Depth Counter</span>
                            <span className="text-3xl font-black text-sky-600 font-mono">{st.depth !== undefined ? st.depth : 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Level Size</span>
                            <span className="text-lg font-black text-slate-700 font-mono">{st.levelSize !== undefined ? st.levelSize : '-'}</span>
                        </div>
                    </div>

                    {/* Queue Visualization */}
                    <div className="flex-1 bg-sky-50 rounded-2xl border-2 border-sky-200 p-4 flex flex-col justify-center relative overflow-hidden">
                        <span className="absolute top-2 left-3 text-[9px] font-black uppercase tracking-widest text-sky-400">Queue (FIFO)</span>
                        <div className="flex gap-3 overflow-x-auto items-center min-h-[60px] pt-4 pl-2">
                            <span className="text-sky-300 font-black text-xl shrink-0">Head &rarr;</span>
                            {st.qState && st.qState.length > 0 ? st.qState.map((node: any, i: number) => (
                                <div key={i} className="w-12 h-12 shrink-0 bg-white border-2 border-sky-400 rounded-xl shadow-sm flex items-center justify-center font-mono font-black text-sky-800 text-lg animate-in zoom-in duration-200">
                                    {node.val}
                                </div>
                            )) : (
                                <span className="text-slate-400 italic text-sm font-mono">Empty</span>
                            )}
                            <span className="text-sky-300 font-black text-xl shrink-0 ml-auto pl-4">&larr; Tail</span>
                        </div>
                    </div>
                </div>
             </div>
          );
      } else if (selectedOpId === 'dfsIterative') {
          return (
             <div className="bg-white p-6 rounded-[2rem] border-4 border-slate-200 shadow-xl w-full max-w-4xl flex flex-col items-center gap-6">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1"><LayersIcon size={14}/> DFS Stack Dashboard</span>
                
                <div className="flex w-full gap-6">
                    {/* Variables Panel */}
                    <div className="flex flex-col gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 w-1/3 min-w-[150px]">
                        <div className={`flex justify-between items-center pb-2 transition-colors duration-300 ${st.hlMaxUpdate ? 'bg-amber-100 p-2 rounded-xl ring-2 ring-amber-300 scale-105' : 'border-b'}`}>
                            <span className={`text-xs font-bold uppercase tracking-wider font-mono ${st.hlMaxUpdate ? 'text-amber-700' : 'text-slate-400'}`}>Max Tracker</span>
                            <span className={`text-3xl font-black font-mono ${st.hlMaxUpdate ? 'text-amber-600' : 'text-amber-500'}`}>{st.max !== undefined ? st.max : 0}</span>
                        </div>
                        {st.currDepth !== undefined && (
                            <div className="flex justify-between items-center animate-in fade-in duration-300">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Popped Depth</span>
                                <span className="text-lg font-black text-slate-700 font-mono">{st.currDepth}</span>
                            </div>
                        )}
                    </div>

                    {/* Stack Visualization */}
                    <div className="flex-1 bg-amber-50 rounded-2xl border-2 border-amber-200 p-4 flex flex-col justify-center relative overflow-hidden">
                        <span className="absolute top-2 left-3 text-[9px] font-black uppercase tracking-widest text-amber-400">Stack (LIFO)</span>
                        <div className="flex gap-3 overflow-x-auto items-center min-h-[60px] pt-4 pl-2">
                            <span className="text-amber-300 font-black text-xl shrink-0">Bottom &rarr;</span>
                            {st.stackState && st.stackState.length > 0 ? st.stackState.map((item: any, i: number) => {
                                let isTop = i === st.stackState.length - 1;
                                return (
                                <div key={i} className={`shrink-0 flex flex-col items-center justify-center bg-white border-2 rounded-xl shadow-sm px-3 py-1 font-mono animate-in zoom-in duration-200 ${isTop ? 'border-amber-500 ring-2 ring-amber-200 scale-105 mx-1' : 'border-amber-300'}`}>
                                    <span className="text-[9px] text-amber-600 font-bold uppercase tracking-widest">Node</span>
                                    <span className="text-amber-900 font-black text-lg leading-none mb-1">{item.node.val}</span>
                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest border-t w-full text-center pt-0.5">d={item.depth}</span>
                                </div>
                            )}) : (
                                <span className="text-slate-400 italic text-sm font-mono">Empty</span>
                            )}
                            <span className="text-amber-400 font-black text-xl shrink-0 ml-auto pl-4">&larr; Top</span>
                        </div>
                    </div>
                </div>
             </div>
          );
      }
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && !st.isSuccess) return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      const treeContainerHeight = Math.max(400, (treeData.maxDepth + 1) * 80 + 120);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active Calculation Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 h-[160px] shrink-0 justify-center">
                  {renderActiveDashboard()}
              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center relative w-full mt-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-${themeColor}-50 text-${themeColor}-600 border-${themeColor}-200 flex items-center gap-2 pointer-events-auto`}><Network size={12}/> Binary Tree Structure</span>
                  
                  <div className="relative w-full max-w-5xl" style={{ minHeight: `${treeContainerHeight}px` }}>
                      <div className="absolute inset-0 w-full h-full">
                          
                          {/* Draw Edges */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {treeData.edges.map((edge: any, i: number) => {
                                  // Determine if edge is active based on algorithm
                                  let isActive = false;
                                  let highlightColor = '#10b981'; // default emerald for DFS
                                  
                                  if (selectedOpId === 'dfsRecursion') {
                                      if (st.currNodeId === edge.target) isActive = true;
                                      if (st.currNodeId === edge.source && ((st.hlRecurseLeft && st.side === 'left') || (st.hlRecurseRight && st.side === 'right'))) isActive = true;
                                  } else if (selectedOpId === 'bfsIterative') {
                                      if (st.hlPush === edge.target && st.currNodeId === edge.source) { isActive = true; highlightColor = '#0ea5e9'; } // sky
                                  } else if (selectedOpId === 'dfsIterative') {
                                      if (st.hlPush === edge.target && st.currNodeId === edge.source) { isActive = true; highlightColor = '#f59e0b'; } // amber
                                  }

                                  let strokeColor = isActive ? highlightColor : '#94a3b8'; // active : slate-400
                                  let strokeWidth = isActive ? 4 : 2;
                                  let opacity = isActive ? 1 : 0.6;

                                  return <line key={`edge-${i}`} x1={`${edge.sx}%`} y1={edge.sy + 20} x2={`${edge.tx}%`} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                              
                              {/* Draw Virtual Null Edge (DFS Recursion only) */}
                              {selectedOpId === 'dfsRecursion' && st.currNodeId === null && st.parentId !== null && (() => {
                                  const parent = treeData.nodes.find((n: any) => n.id === st.parentId);
                                  if (!parent) return null;
                                  let sx = parent.x;
                                  let sy = parent.y + 20;
                                  let tx = st.side === 'left' ? parent.x - 10 : parent.x + 10;
                                  let ty = parent.y + 80 - 20;
                                  return <line x1={`${sx}%`} y1={sy} x2={`${tx}%`} y2={ty} stroke="#10b981" strokeWidth="4" strokeDasharray="4 4" opacity={0.8} className="animate-pulse transition-all duration-500" />
                              })()}
                          </svg>

                          {/* Draw Nodes */}
                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-700";
                              let resolvedText = null;
                              let inContainerClass = "";

                              if (selectedOpId === 'dfsRecursion') {
                                  let returnedDepth = st.nodeReturns && st.nodeReturns[node.id];
                                  let isResolved = returnedDepth !== undefined;

                                  if (isActive) bgClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl text-emerald-900 scale-125 z-30";
                                  else if (isResolved) { bgClass = "bg-emerald-50 border-emerald-400 text-emerald-800 shadow-sm z-20"; resolvedText = `depth=${returnedDepth}`; }
                                  else bgClass = "bg-slate-50 border-slate-200 text-slate-500 opacity-80 z-10 scale-95";
                                  
                                  if (st.isSuccess) bgClass = "bg-emerald-100 border-emerald-400 text-emerald-800 shadow-sm z-20";
                              } 
                              else if (selectedOpId === 'bfsIterative') {
                                  let inQueue = st.qState && st.qState.some((q: any) => q.id === node.id);
                                  
                                  if (isActive) bgClass = "bg-sky-100 border-sky-500 ring-4 ring-sky-200 shadow-xl text-sky-900 scale-125 z-30";
                                  else if (inQueue) { bgClass = "bg-white border-sky-400 ring-4 ring-sky-100 text-sky-800 z-20 scale-110 shadow-md"; inContainerClass = "text-sky-500"; }
                                  else bgClass = "bg-slate-50 border-slate-200 text-slate-500 opacity-80 z-10 scale-95";
                                  
                                  if (st.isSuccess) bgClass = "bg-sky-100 border-sky-400 text-sky-800 shadow-sm z-20";
                              }
                              else if (selectedOpId === 'dfsIterative') {
                                  let stackNode = st.stackState && st.stackState.find((s: any) => s.node.id === node.id);
                                  let inStack = !!stackNode;

                                  if (isActive) bgClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 shadow-xl text-amber-900 scale-125 z-30";
                                  else if (inStack) { bgClass = "bg-white border-amber-400 ring-4 ring-amber-100 text-amber-800 z-20 scale-110 shadow-md"; resolvedText = `d=${stackNode.depth}`; }
                                  else bgClass = "bg-slate-50 border-slate-200 text-slate-500 opacity-80 z-10 scale-95";
                                  
                                  if (st.isSuccess) bgClass = "bg-amber-100 border-amber-400 text-amber-800 shadow-sm z-20";
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `${node.x}%`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* Floating label for the active node */}
                                      {isActive && (
                                          <span className={`text-[10px] font-black text-${themeColor}-600 font-mono uppercase tracking-widest absolute -top-8 whitespace-nowrap bg-white/90 px-2 py-0.5 rounded border border-${themeColor}-200 shadow-sm animate-bounce`}>
                                              current
                                          </span>
                                      )}
                                      
                                      {/* Indicator for nodes currently waiting in queue/stack */}
                                      {inContainerClass && (
                                          <span className={`absolute -top-6 ${inContainerClass} font-black animate-pulse`}><ArrowDown size={16}/></span>
                                      )}

                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg md:text-2xl`}>
                                              {node.val}
                                          </span>
                                      </div>

                                      {/* Annotate depths or states below node */}
                                      {resolvedText && (
                                          <div className={`absolute -bottom-6 bg-${themeColor}-500 text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap animate-in zoom-in duration-300 z-40`}>
                                              {resolvedText}
                                          </div>
                                      )}

                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Visualizing Base Case (DFS Recursion) */}
                          {selectedOpId === 'dfsRecursion' && st.currNodeId === null && st.parentId !== null && (
                              <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                  left: `${(treeData.nodes.find((n: any) => n.id === st.parentId)?.x || 50) + (st.side === 'left' ? -10 : 10)}%`, 
                                  top: `${(treeData.nodes.find((n: any) => n.id === st.parentId)?.y || 0) + 80}px`, 
                                  transform: 'translate(-50%, -50%)' 
                              }}>
                                  <div className="w-10 h-10 flex flex-col items-center justify-center border-2 border-emerald-400 bg-emerald-100 rounded-full shadow-lg ring-4 ring-emerald-200">
                                      <span className="font-mono font-black text-xs text-emerald-800">null</span>
                                  </div>
                                  <div className="absolute -bottom-6 bg-emerald-500 text-white text-[9px] font-mono font-black px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap animate-in zoom-in duration-300 z-40">
                                      returns 0
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Maximum Depth of Binary Tree</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      {selectedOp.title.split('.')[1].trim()}
                  </span>
                  <span>•</span>
                  <span>LeetCode 104</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Network size={28}/> Measure the Tree</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the <code>root</code> of a binary tree, return its maximum depth.</p>
                        <p>A binary tree's <strong>maximum depth</strong> is the number of nodes along the longest path from the root node down to the farthest leaf node.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                           <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                           <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [3,9,20,null,null,15,7]</span>
                           <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                           <span className="text-slate-300 block mb-4">3</span>
                           <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                           <span className="text-slate-400 text-xs whitespace-normal leading-relaxed">
                               The longest path is 3 &rarr; 20 &rarr; 15 (or 7), which has 3 nodes. You can trace this depth visibly in the diagram to the right.
                           </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="180" height="150" viewBox="0 0 200 160" className={`text-${themeColor}-400 drop-shadow-md`}>
                                {/* Edges */}
                                <line x1="100" y1="30" x2="50" y2="80" stroke="#475569" strokeWidth="3" />
                                <line x1="100" y1="30" x2="150" y2="80" stroke="#475569" strokeWidth="3" />
                                <line x1="150" y1="80" x2="115" y2="130" stroke="#475569" strokeWidth="3" />
                                <line x1="150" y1="80" x2="185" y2="130" stroke="#475569" strokeWidth="3" />
                                
                                {/* Nodes */}
                                <circle cx="100" cy="30" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="100" y="35" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">3</text>
                                
                                <circle cx="50" cy="80" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="50" y="85" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">9</text>
                                
                                <circle cx="150" cy="80" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="150" y="85" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">20</text>
                                
                                <circle cx="115" cy="130" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="115" y="135" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">15</text>
                                
                                <circle cx="185" cy="130" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="185" y="135" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">7</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                           <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                           <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [1,null,2]</span>
                           <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                           <span className="text-slate-300 block mb-4">2</span>
                           <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                           <span className="text-slate-400 text-xs whitespace-normal leading-relaxed">
                               The longest path is 1 &rarr; 2, which has 2 nodes.
                           </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="120" height="110" viewBox="0 0 120 110" className={`text-${themeColor}-400 drop-shadow-md`}>
                                {/* Edges */}
                                <line x1="45" y1="30" x2="85" y2="80" stroke="#475569" strokeWidth="3" />
                                
                                {/* Nodes */}
                                <circle cx="45" cy="30" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="45" y="35" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">1</text>
                                
                                <circle cx="85" cy="80" r="18" fill="#0f172a" stroke="currentColor" strokeWidth="3" />
                                <text x="85" y="85" textAnchor="middle" fill="#f8fafc" fontSize="14" fontFamily="monospace" fontWeight="bold">2</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [0, 10^4].</li>
                            <li>-100 &lt;= Node.val &lt;= 100</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-amber-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed text-slate-600">A binary tree's depth cannot be determined by just looking at the root; you must explore all the way down to every single leaf node to ensure you found the absolute longest path. We need an algorithm that touches every node exactly once.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>DFS (Recursion/Stack):</strong> Dive deep down a single path until a leaf is hit, evaluating `1 + max(left, right)`. Very memory efficient on balanced trees.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>BFS (Queue):</strong> Sweep across the tree level-by-level horizontally. Count how many sweeps it takes. Guaranteed to visit every level perfectly.</p>
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
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1">
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Input Array (Level Order)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="3, 9, 20, null, null, 15, 7" />
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
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono text-${themeColor}-400 flex items-center gap-3`}><PartyPopper size={24}/> TRAVERSAL COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Successfully computed max depth of {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlReturnNull || st.hlReturnCalc || st.hlMaxUpdate ? 'text-amber-400' : (st.hlCheckNull ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 h-[550px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   {/* Floating Call Stack Widget for DFS Recursion */}
                   {!st.isSuccess && selectedOpId === 'dfsRecursion' && st.callStack && (
                       <div className="absolute bottom-6 left-6 z-30 pointer-events-auto">
                           <div className={`bg-slate-800 rounded-2xl border-2 border-slate-700 shadow-xl p-4 flex flex-col transition-all duration-300 w-48 max-h-[250px] overflow-hidden`}>
                               <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-2 shrink-0">
                                   <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><LayersIcon size={12}/> Call Stack</span>
                               </div>
                               <div className="flex flex-col gap-2 overflow-y-auto scrollbar-none flex-1 pb-1">
                                   {st.callStack.slice().reverse().map((frameStr: string, idx: number) => {
                                       let isTop = idx === 0;
                                       return (
                                           <div key={`frame-${idx}`} className={`w-full py-2 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-white border-emerald-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Three distinct paradigms to solve the same problem.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-5xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><GitPullRequest size={24} className="text-emerald-500"/> 1. DFS Recursion (The Standard)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">This is essentially a Post-Order traversal. A node waits for both its left and right subtrees to completely finish computing before it can execute <code>Math.max(left, right) + 1</code>. The solution naturally "bubbles up" from the bottom.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Pros:</strong> Incredibly short, readable, and elegant. <br/><strong>Cons:</strong> On heavily skewed/degenerate trees (like a straight linked list), a deep tree of $10^5$ nodes will crash the program with a <code>StackOverflowError</code> because it exceeds the JVM call stack limit.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ListOrdered size={24} className="text-sky-500"/> 2. Breadth-First Search (Level Order)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">BFS avoids the call stack entirely. We utilize a <code>Queue (FIFO)</code> to sweep across the tree level by level horizontally. The crucial trick is reading <code>queue.size()</code> at the start of the while loop; this tells us exactly how many nodes exist on the current depth tier. We then loop exactly that many times, popping those nodes and pushing their children.</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Pros:</strong> Safe from Stack Overflow. <br/><strong>Cons:</strong> Uses $O(W)$ memory (where $W$ is max width). In perfectly balanced trees, the bottom level holds $N/2$ nodes, making memory overhead significant.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-amber-500"/> 3. DFS Iterative (Heap Stack)</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">This mimics the recursive DFS approach without risking a call stack crash by using a <code>Stack (LIFO)</code> object stored safely on the heap memory. Because we lose the automatic variable scoping of recursion, we must simultaneously store the <code>Node</code> and its associated <code>Depth</code> (either via two parallel stacks or a custom pair object).</p>
                        <p className="text-slate-600 leading-relaxed"><strong>Pros:</strong> Safe from Stack Overflow, memory efficient on sparse trees.<br/><strong>Cons:</strong> Much bulkier code than recursion.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is often a warm-up question or used as a sub-component in harder tree problems (like determining if a tree is balanced). Master the recursive one-liner perfectly."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Can this be written in a single line of code?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, using the ternary operator.</p>
                            <p>The entire function can be collapsed to: <code>return root == null ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right));</code>. While this is concise, writing it out on multiple lines during an interview can sometimes be clearer to discuss and trace."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "What is a StackOverflowError, and can it happen here?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "A StackOverflowError occurs when the program recurses too deeply, exceeding the fixed memory allocated for the call stack by the JVM or browser.</p>
                            <p>If the input tree is completely skewed (forming a straight line) and contains $10^5$ nodes, the $O(N)$ depth recursion will absolutely trigger a StackOverflowError. In production, an iterative BFS (Queue) or iterative DFS (Stack on the heap) is safer because heap memory is vastly larger than call stack memory."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><GitFork size={24}/></span>
                            <span>Q3: "If this wasn't a Binary Tree, but an N-ary Tree (each node has a List of children), how would the code change?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The logic remains identical, but the calculation changes.</p>
                            <p>Instead of explicitly doing <code>Math.max(left, right)</code>, we would initialize a <code>maxChildDepth = 0</code>, loop through all the children in the node's list, and update the max variable: <code>maxChildDepth = Math.max(maxChildDepth, maxDepth(child))</code>. Then, at the end, we still return <code>maxChildDepth + 1</code>."</p>
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
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex flex-col gap-4">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlReturnNull || st.hlReturnCalc || st.hlMaxUpdate ? 'text-amber-400' : (st.hlCheckNull ? 'text-sky-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 overflow-x-hidden shrink-0">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px] flex flex-col">
                  
                  {/* Floating Structure State Panel for Fullscreen */}
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
                                              <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-emerald-500 text-white border-emerald-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-sky-200 shadow-2xl p-5 flex flex-col w-full">
                                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2">Queue State</span>
                                      <span className="text-xs font-mono font-bold text-slate-500">Depth: {st.depth}</span>
                                  </div>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2">
                                      {st.qState && st.qState.length > 0 ? st.qState.map((node: any, i: number) => (
                                          <div key={i} className="w-10 h-10 shrink-0 bg-sky-50 border-2 border-sky-400 rounded-lg flex items-center justify-center font-mono font-black text-sky-800 text-sm">{node.val}</div>
                                      )) : <span className="text-slate-400 italic text-sm font-mono py-2">Queue is empty</span>}
                                  </div>
                              </div>
                          ) : selectedOpId === 'dfsIterative' ? (
                              <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-amber-200 shadow-2xl p-5 flex flex-col w-full">
                                  <div className="flex justify-between items-center border-b pb-2 mb-3">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2">Stack State</span>
                                      <span className="text-xs font-mono font-bold text-slate-500">Max: {st.max}</span>
                                  </div>
                                  <div className="flex gap-2 overflow-x-auto items-center pb-2">
                                      {st.stackState && st.stackState.length > 0 ? st.stackState.map((item: any, i: number) => (
                                          <div key={i} className={`shrink-0 flex flex-col items-center justify-center bg-amber-50 border-2 rounded-lg px-2 py-1 font-mono ${i === st.stackState.length - 1 ? 'border-amber-500 bg-white' : 'border-amber-300'}`}>
                                              <span className="text-amber-900 font-black">{item.node.val}</span>
                                              <span className="text-[8px] text-amber-600">d={item.depth}</span>
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array (Level Order)</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="3, 9, 20, null, null, 15, 7" />
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
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Maximum Tree Depth</div>
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