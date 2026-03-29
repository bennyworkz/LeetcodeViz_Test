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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  topDownDfs: {
    id: 'topDownDfs',
    title: '1. Top-Down State-Passing DFS',
    icon: <Route size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'violet',
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
    int maxStep = 0;
    
    public int longestZigZag(TreeNode root) {
        dfs(root, true, 0);
        dfs(root, false, 0);
        return maxStep;
    }
    
    private void dfs(TreeNode node, boolean goLeft, int step) {
        if (node == null) return;
        
        maxStep = Math.max(maxStep, step);
        
        if (goLeft) {
            dfs(node.left, false, step + 1);
            dfs(node.right, true, 1);
        } else {
            dfs(node.right, true, step + 1);
            dfs(node.left, false, 1);
        }
    }
}`,
    desc: "The optimal O(N) approach uses a Top-Down DFS. At every node, we must pass down two critical pieces of state: the current length of the zigzag (step), and the direction we MUST go next to keep the zigzag alive (goLeft). If we successfully move in the required direction, we increment our step. If we are forced to break the zigzag and move in the opposite direction, we don't stop searching—we simply restart a brand new zigzag path from that child with a step of 1. By tracking a global 'maxStep', we capture the longest streak found anywhere in the tree."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|class|return|if|else|new|String|longestZigZag|dfs|TreeNode|Solution|root|null|this|left|right|goLeft|step|maxStep|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['TreeNode', 'Solution', 'Math'].includes(part);
            const isPointer = ['root', 'left', 'right', 'goLeft', 'step', 'maxStep', 'node', 'val', 'x'].includes(part);
            const isMapCall = ['longestZigZag', 'dfs', 'max'].includes(part);
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

export default function LongestZigZagVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('topDownDfs');
  
  const [treeInput, setTreeInput] = useState('1, null, 1, 1, 1, null, null, 1, 1, null, 1, null, null, null, 1');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, null, 1, 1, 1, null, null, 1, 1, null, 1, null, null, null, 1]);

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
      setBaseTreeArr(parseTreeInput(treeInput, [1, null, 1, 1, 1, null, null, 1, 1, null, 1, null, null, null, 1]));
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

    let callStack: string[] = [];
    let activePath: number[] = [];
    let bestPath: number[] = [];
    let globalMaxStep = 0;

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            callStack: [...callStack],
            activePath: [...activePath],
            bestPath: [...bestPath],
            globalMaxStep,
            ...st 
        } 
    });

    const dfs = (node: any | null, goLeft: boolean, step: number, parentId: number | null = null, currentPath: number[]) => {
        if (steps.length > 3000) return; // Guard
        
        let callStr = `dfs(${node ? node.val : 'null'}, ${goLeft ? 'L' : 'R'}, ${step})`;
        callStack.push(callStr);
        activePath = [...currentPath];

        add("DFS Entry", `private void dfs(TreeNode node, boolean goLeft, int step)\nEntering node. Expected direction: ${goLeft ? 'Left' : 'Right'}. Current Step: ${step}.`, 20, { currNodeId: node ? node.id : null, parentId, goLeft, step });

        add("Base Case Check", `if (node == null) return;\nIs node null? (${node == null ? 'Yes' : 'No'})`, 21, { currNodeId: node ? node.id : null, parentId, goLeft, step, hlCheckNull: true });

        if (node == null) {
            callStack.pop();
            return;
        }

        let isNewMax = step > globalMaxStep;
        globalMaxStep = Math.max(globalMaxStep, step);
        if (isNewMax) {
            bestPath = [...activePath];
        }

        add("Update Global Max", `maxStep = Math.max(maxStep, step);\nGlobal maxStep updated to ${globalMaxStep}.`, 23, { currNodeId: node.id, parentId, goLeft, step, hlUpdateMax: true, isNewMax });

        add("Evaluate Direction", `if (goLeft)\nDo we need to go Left next? (${goLeft ? 'Yes' : 'No'})`, 25, { currNodeId: node.id, parentId, goLeft, step, hlCheckDir: true });

        if (goLeft) {
            add("Continue ZigZag Left", `dfs(node.left, false, step + 1);\nMoving LEFT. Next direction must be RIGHT (false). Step increases to ${step + 1}.`, 26, { currNodeId: node.id, hlRecurseLeftContinue: true });
            dfs(node.left, false, step + 1, node.id, [...activePath, node.left?.id].filter(n => n !== undefined));

            add("Restart ZigZag Right", `dfs(node.right, true, 1);\nMoving RIGHT breaks the required 'Left' zigzag. We restart a new path downwards with Step 1.`, 27, { currNodeId: node.id, hlRecurseRightRestart: true });
            dfs(node.right, true, 1, node.id, [node.id, node.right?.id].filter(n => n !== undefined));
        } else {
            add("Continue ZigZag Right", `dfs(node.right, true, step + 1);\nMoving RIGHT. Next direction must be LEFT (true). Step increases to ${step + 1}.`, 29, { currNodeId: node.id, hlRecurseRightContinue: true });
            dfs(node.right, true, step + 1, node.id, [...activePath, node.right?.id].filter(n => n !== undefined));

            add("Restart ZigZag Left", `dfs(node.left, false, 1);\nMoving LEFT breaks the required 'Right' zigzag. We restart a new path downwards with Step 1.`, 30, { currNodeId: node.id, hlRecurseLeftRestart: true });
            dfs(node.left, false, 1, node.id, [node.id, node.left?.id].filter(n => n !== undefined));
        }

        callStack.pop();
    };

    if (baseTreeArr.length === 0) {
        add("Empty Tree", "Tree is empty, returning 0.", 14, { isSuccess: true, finalAns: 0 });
        return steps;
    }

    add("Function Call", `public int longestZigZag(TreeNode root)`, 14, {});
    
    add("Seed Left Traversal", `dfs(root, true, 0);\nLaunch initial DFS assuming the first move is to the Left.`, 15, { hlInitLeft: true });
    dfs(treeData.root, true, 0, null, [treeData.root.id]);

    add("Seed Right Traversal", `dfs(root, false, 0);\nLaunch secondary DFS assuming the first move is to the Right.`, 16, { hlInitRight: true });
    dfs(treeData.root, false, 0, null, [treeData.root.id]);
    
    add("Execution Complete", `return maxStep;\nTraversal finished. The longest ZigZag path found has a length of ${globalMaxStep}.`, 17, { isSuccess: true, finalAns: globalMaxStep });

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
                  <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.isNewMax ? 'border-amber-400 ring-4 ring-amber-100 scale-105' : 'border-slate-200'}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Route size={14}/> Active State Engine</span>
                      
                      {st.currNodeId === null && st.hlCheckNull ? (
                          <div className="flex flex-col items-center justify-center w-full min-h-[80px] animate-in zoom-in duration-300 py-2">
                               <div className="flex items-center gap-4 text-rose-600 font-mono font-black text-xl bg-rose-50 px-6 py-3 rounded-2xl border-2 border-rose-300 shadow-md">
                                   <span>node == null</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-rose-200">return</span>
                               </div>
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">Base case reached.</span>
                          </div>
                      ) : st.currNodeId !== null && (st.step !== undefined) ? (
                          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 font-mono min-h-[80px] py-2">
                              
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Must go</span>
                                  <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${st.hlDirCheck ? 'bg-sky-100 border-sky-400 text-sky-800 scale-110 shadow-md' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                                      {st.goLeft ? <><ArrowLeft size={24}/> LEFT</> : <><ArrowRight size={24}/> RIGHT</>}
                                  </div>
                              </div>
                              
                              <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                              
                              <div className="flex flex-col items-center">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Curr Step Length</span>
                                  <div className={`border-2 text-3xl font-black px-6 py-2 rounded-xl transition-all duration-300 bg-slate-50 border-slate-300 text-slate-700`}>
                                      {st.step}
                                  </div>
                              </div>

                              <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                              
                              <div className="flex flex-col items-center min-w-[120px]">
                                  <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.isNewMax ? 'text-amber-600' : 'text-slate-400'}`}>Global Max Step</span>
                                  <div className={`border-2 text-4xl font-black px-6 py-2 rounded-xl transition-all duration-500 ${st.hlUpdateMax ? (st.isNewMax ? 'bg-amber-100 border-amber-500 text-amber-800 scale-110 shadow-lg' : 'bg-white border-slate-300 text-slate-800') : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                                      {st.globalMaxStep !== undefined ? st.globalMaxStep : 0}
                                  </div>
                              </div>
                          </div>
                      ) : (
                          <div className="flex items-center justify-center w-full min-h-[80px]">
                              <span className="text-slate-400 italic text-sm font-mono">Starting search...</span>
                          </div>
                      )}

                  </div>
              </div>

              {/* Free-floating Interactive State Space Tree */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl">
                  
                  <div className={`relative w-full transition-all duration-700`} style={{ minHeight: `${treeContainerHeight}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-4 px-3 py-1 rounded-lg border shadow-sm bg-slate-50 text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap`}><Network size={12} className="inline mr-1"/> Binary Tree</span>
                      <div className="absolute inset-0 w-full h-full">
                          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                              {treeData.edges.map((edge: any, i: number) => {
                                  let isActive = false;
                                  let isBestPath = false;

                                  // Detect if this edge is part of the absolute best zigzag found so far
                                  if (st.bestPath) {
                                      for (let j=0; j < st.bestPath.length - 1; j++) {
                                          if (st.bestPath[j] === edge.source && st.bestPath[j+1] === edge.target) isBestPath = true;
                                      }
                                  }

                                  // Detect if this edge is part of the currently explored path
                                  if (st.activePath) {
                                      for (let j=0; j < st.activePath.length - 1; j++) {
                                          if (st.activePath[j] === edge.source && st.activePath[j+1] === edge.target) isActive = true;
                                      }
                                  }

                                  // Current recursive branch highlighting
                                  if (st.currNodeId === edge.source) {
                                      if (st.hlRecurseLeftContinue && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                      if (st.hlRecurseLeftRestart && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.left?.id) isActive = true;
                                      if (st.hlRecurseRightContinue && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.right?.id) isActive = true;
                                      if (st.hlRecurseRightRestart && edge.target === treeData.nodes.find((n:any)=>n.id===edge.source)?.originalNode?.right?.id) isActive = true;
                                  }

                                  let strokeColor = '#e2e8f0'; // slate-200
                                  let strokeWidth = 2;
                                  let opacity = 0.4;

                                  if (isBestPath) {
                                      strokeColor = '#f59e0b'; // amber-500 (gold)
                                      strokeWidth = 6;
                                      opacity = 1;
                                  } else if (isActive) {
                                      strokeColor = '#8b5cf6'; // violet-500
                                      strokeWidth = 4;
                                      opacity = 0.9;
                                  }
                                  
                                  if (st.isSuccess && !isBestPath) {
                                      opacity = 0.1; // Fade out everything except the golden path at the end
                                  }

                                  return <line key={`edge-${i}`} x1={`calc(50% + ${edge.sx}px)`} y1={edge.sy + 20} x2={`calc(50% + ${edge.tx}px)`} y2={edge.ty - 20} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}

                              {/* Draw Virtual Null Edge to visualize base case hits */}
                              {st.currNodeId === null && st.activePath && st.activePath.length > 0 && (() => {
                                  const parentId = st.activePath[st.activePath.length - 1];
                                  const parent = treeData.nodes.find((n: any) => n.id === parentId);
                                  if (!parent) return null;
                                  let sx = parent.x;
                                  let sy = parent.y + 20;
                                  // Determine side by checking if parent's left/right exist
                                  let isLeftChild = parent.originalNode?.left === null;
                                  let tx = isLeftChild ? parent.x - 30 : parent.x + 30;
                                  let ty = parent.y + 70 - 20;
                                  return <line x1={`calc(50% + ${sx}px)`} y1={sy} x2={`calc(50% + ${tx}px)`} y2={ty} stroke="#f43f5e" strokeWidth="4" strokeDasharray="4 4" opacity={0.8} className="animate-pulse transition-all duration-500" />
                              })()}
                          </svg>

                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id;
                              let isBestPath = st.bestPath && st.bestPath.includes(node.id);
                              let isPath = st.activePath && st.activePath.includes(node.id);
                              
                              let bgClass = "bg-white border-slate-300 text-slate-400 opacity-60"; // Unvisited
                              
                              if (isBestPath) {
                                  bgClass = "bg-amber-100 border-amber-500 text-amber-800 shadow-md z-20 opacity-100";
                              } else if (isActive) {
                                  bgClass = "bg-violet-100 border-violet-500 ring-4 ring-violet-200 shadow-xl text-violet-900 scale-125 z-30";
                              } else if (isPath) {
                                  bgClass = "bg-violet-50 border-violet-300 text-violet-700 shadow-md z-20 opacity-90";
                              }
                              
                              if (st.isSuccess) {
                                  if (isBestPath) {
                                      bgClass = "bg-amber-400 border-amber-600 text-amber-950 shadow-2xl scale-125 z-40 ring-4 ring-amber-200";
                                  } else {
                                      bgClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 z-10 scale-90";
                                  }
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500`} style={{ left: `calc(50% + ${node.x}px)`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      {isActive && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-white/90 px-1.5 rounded shadow-sm animate-bounce text-violet-600 border border-violet-200`}>
                                              curr
                                          </span>
                                      )}
                                      <div className={`w-10 h-10 md:w-14 md:h-14 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-base md:text-xl`}>{node.val}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          
                          {/* Virtual Null Node Rendering for Visualizing Base Case */}
                          {st.currNodeId === null && st.activePath && st.activePath.length > 0 && (() => {
                              const parentId = st.activePath[st.activePath.length - 1];
                              const parent = treeData.nodes.find((n: any) => n.id === parentId);
                              if (!parent) return null;
                              let isLeftChild = parent.originalNode?.left === null;
                              let px = isLeftChild ? parent.x - 30 : parent.x + 30;
                              let py = parent.y + 70;
                              return (
                                  <div className={`absolute flex flex-col items-center transition-all duration-500 z-30 scale-110`} style={{ 
                                      left: `calc(50% + ${px}px)`, 
                                      top: `${py}px`, 
                                      transform: 'translate(-50%, -50%)' 
                                  }}>
                                      <div className="w-8 h-8 flex flex-col items-center justify-center border-2 border-rose-400 bg-rose-50 rounded-full shadow-lg ring-4 ring-rose-200">
                                          <span className="font-mono font-black text-[10px] text-rose-600">null</span>
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
                <Route className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest ZigZag Path</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      State-Passing DFS
                  </span>
                  <span>•</span>
                  <span>LeetCode 1372</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Route size={28}/> Maximize the ZigZag</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given the <code>root</code> of a binary tree.</p>
                        <p>A ZigZag path for a binary tree is defined as follows:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-fit">
                            <li>Choose any node in the binary tree and a direction (right or left).</li>
                            <li>If the current direction is right, move to the right child of the current node; otherwise, move to the left child.</li>
                            <li>Change the direction from right to left or from left to right.</li>
                            <li>Repeat the second and third steps until you can't move in the tree.</li>
                        </ul>
                        <p className="font-bold mt-4">Return the longest ZigZag path contained in that tree. (A ZigZag length is defined as the number of nodes visited - 1. A single node has a length of 0).</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [1,null,1,1,1,null,null,1,1,null,1,null,null,null,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Longest ZigZag path is shown in <span className="text-blue-400 font-bold">Blue</span>.<br/>
                                It follows the path: right &rarr; left &rarr; right.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="180" height="220" viewBox="0 0 180 220">
                                <line x1="60" y1="20" x2="120" y2="60" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                
                                <line x1="120" y1="60" x2="80" y2="100" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                <line x1="120" y1="60" x2="160" y2="100" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="80" y1="100" x2="120" y2="140" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                
                                <line x1="160" y1="100" x2="140" y2="140" stroke="#475569" strokeWidth="2" />
                                <line x1="160" y1="100" x2="180" y2="140" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="120" y1="140" x2="140" y2="180" stroke="#475569" strokeWidth="2" />
                                
                                <circle cx="60" cy="20" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="60" y="24" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="120" cy="60" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="120" y="64" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="80" cy="100" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="80" y="104" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="160" cy="100" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="160" y="104" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="120" cy="140" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="120" y="144" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="140" cy="140" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="140" y="144" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>

                                <circle cx="180" cy="140" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="180" y="144" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="140" cy="180" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="140" y="184" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2:</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> root = [1,1,1,null,1,null,null,1,1,null,1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">4</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                Longest ZigZag path is shown in <span className="text-blue-400 font-bold">Blue</span>.<br/>
                                It follows the path: left &rarr; right &rarr; left &rarr; right.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="180" height="220" viewBox="0 0 180 220">
                                <line x1="90" y1="20" x2="50" y2="60" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                <line x1="90" y1="20" x2="130" y2="60" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="50" y1="60" x2="90" y2="100" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                
                                <line x1="90" y1="100" x2="60" y2="140" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                <line x1="90" y1="100" x2="120" y2="140" stroke="#475569" strokeWidth="2" />
                                
                                <line x1="60" y1="140" x2="90" y2="180" stroke="#60a5fa" strokeWidth="4" opacity="0.9"/>
                                
                                <circle cx="90" cy="20" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="90" y="24" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="50" cy="60" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="50" y="64" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="130" cy="60" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="130" y="64" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="90" cy="100" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="90" y="104" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="60" cy="140" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="60" y="144" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                                
                                <circle cx="120" cy="140" r="12" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                                <text x="120" y="144" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>

                                <circle cx="90" cy="180" r="12" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="90" y="184" fill="#93c5fd" fontSize="12" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 3:</span>
                            <span className="text-slate-300 block mb-2"><strong>Input:</strong> root = [1]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">0</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                There are no edges to form a ZigZag path. Length is 0.
                            </span>
                        </div>
                        <div className="shrink-0 bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center">
                            <svg width="80" height="60" viewBox="0 0 80 60">
                                <circle cx="40" cy="30" r="16" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                                <text x="40" y="35" fill="#93c5fd" fontSize="14" textAnchor="middle" fontWeight="bold">1</text>
                            </svg>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range [1, 5 * 10^4].</li>
                            <li>1 &le; Node.val &le; 100</li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Constraint</h4>
                        <p className="text-sm leading-relaxed">A zigzag path can start at <em>any</em> node. Running a full DFS downward from every single node takes O(N^2) time, causing a Time Limit Exceeded error. We must find the longest path by visiting every node exactly once.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy</h4>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>State-Passing DFS</strong>. Instead of recalculating, pass the current zigzag status down the recursive call stack. At each node, we know what direction we MUST go to continue the current zigzag. If we go the right way, we increment the step. If we go the wrong way, we simply start a brand new zigzag of length 1 from that child. We update a global maximum at every node.</p>
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
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10">
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, null, 1, 1, 1, null, null..." />
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
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Found maximum ZigZag path of length {st.finalAns}.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isNewMax ? 'text-amber-400' : (st.hlDirCheck ? 'text-sky-400' : (st.hlRecurseLeftContinue || st.hlRecurseRightContinue ? 'text-violet-400' : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                                           <div key={`frame-cs-${idx}`} className={`w-full py-1.5 px-3 rounded-lg border font-mono text-[10px] font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-violet-500 text-white border-violet-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                    <div className="inline-flex items-center justify-center p-4 bg-violet-100 text-violet-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexity</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Mastering Top-Down State Propagation in Tree Traversals.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Route size={24} className="text-violet-500"/> 1. The State-Passing Paradigm</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">In many tree problems, we calculate values bottom-up (returning data from children to parents). However, ZigZag paths require knowing exactly where you came from. We solve this <strong>top-down</strong>.</p>
                        <p className="text-slate-600 leading-relaxed">At every node, we pass down two pieces of state to our children: <code>goLeft</code> (a boolean telling the child what direction it MUST go to continue the streak) and <code>step</code> (the current streak length). The child uses this state to increment the global maximum, and then passes updated state down to its own children.</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><RotateCcw size={24} className="text-sky-500"/> 2. The Branching Logic</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">When processing a node, we must explore both of its children, but we pass them different states:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>The Continuing Child:</strong> If <code>goLeft</code> is true, going left successfully continues the zigzag. We call <code>dfs(node.left, false, step + 1)</code>. Notice we flip the boolean so the next step is forced right!</li>
                            <li><strong>The Restarting Child:</strong> We cannot ignore the right child! Even though going right breaks the current zigzag streak, that right child might be the start of a massive zigzag deep in the tree. We "restart" the streak by calling <code>dfs(node.right, true, 1)</code>.</li>
                        </ul>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We visit every single node in the tree exactly once via our DFS traversal. At each node, we perform an O(1) max calculation and two recursive calls. Total time is strictly linear.</li>
                            <li><strong>Space Complexity: O(H).</strong> We don't allocate any maps or arrays. The auxiliary space is dictated entirely by the depth of the recursive call stack. In the worst case (a skewed tree), the recursion goes $N$ levels deep, taking $O(N)$ space. For a perfectly balanced tree, it takes $O(\log N)$ space. Thus, space is $O(H)$ where $H$ is the tree height.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-violet-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is an elegant problem that tests your ability to pass state downward rather than upward. Interviewers often look for clean, un-duplicated recursive calls."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-violet-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-violet-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we solve this bottom-up (Post-order traversal) instead of top-down?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, absolutely.</p>
                            <p>Instead of passing states down, each node could return an array of two integers: <code>[longestZigZagStartingLeft, longestZigZagStartingRight]</code>. A node would calculate its own arrays based on its children: <code>myLeft = childLeft.right + 1</code> and <code>myRight = childRight.left + 1</code>. We would update the global max identically. Both approaches are O(N), but top-down is often considered slightly more intuitive to trace mentally."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q2: "Why do we use a global/class variable <code>maxStep</code> instead of returning it?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It dramatically simplifies the recursive function signature.</p>
                            <p>Because the longest zigzag path might be buried deep in a subtree and never actually reach the root, the recursive functions have to bubble up that maximum value alongside their own lengths if we don't use a global variable. While passing an integer array like <code>int[] max = new int[1]</code> or using a custom return Object is 'purer' OOP, keeping a simple class-level <code>maxStep</code> field is standard practice in competitive programming and perfectly acceptable in interviews for cleaner code."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><Activity size={24}/></span>
                            <span>Q3: "Why does the initial function call <code>dfs(root, true, 0)</code> AND <code>dfs(root, false, 0)</code>? Aren't we processing the root twice?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Technically yes, the root is evaluated twice, but it's an O(1) overhead.</p>
                            <p>We do this because a zigzag path starting from the root can begin by going either left or right. If we only called <code>dfs(root, true, 0)</code>, it would assume the root <em>must</em> go left to start a path, and it would evaluate the right child as a 'restart' with step 1. By executing both, we perfectly evaluate both directional possibilities from the absolute top of the tree. (Note: Many solutions just call <code>dfs(root.left, false, 1)</code> and <code>dfs(root.right, true, 1)</code> directly to avoid this)."</p>
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
                              <Route size={20}/>
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-hidden">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.isNewMax ? 'text-amber-400' : (st.hlCheckNull ? 'text-rose-400' : 'text-white')}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Call Stack Panel for Fullscreen */}
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
                                          <div key={`frame-${idx}`} className={`w-full py-2.5 px-4 rounded-xl border font-mono text-xs font-black shadow-md transition-all duration-300 shrink-0 ${isTop ? 'bg-violet-500 text-white border-violet-400 scale-100' : 'bg-slate-700 text-slate-300 border-slate-600 opacity-60 scale-95'}`}>
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
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex-[1] w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Input Array (Level Order)</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="1, null, 1..." />
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
                                
                                <div className="w-24 h-24 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-amber-500/10"><Trophy size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">TRAVERSAL COMPLETE</h2>
                                <p className="text-amber-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-2">Maximum ZigZag Length</div>
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