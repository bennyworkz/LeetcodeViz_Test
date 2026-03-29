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
  AlignEndHorizontal, ArrowLeftRight, ScissorsLineDashed, Repeat1, Shuffle, ListTree, GitFork, ArrowDownToLine, Workflow, Lock, Unlock, Zap as Lightning, Target, Brackets, Smartphone, Split as SplitIcon, Globe, Map, Grid, Crown, Hash as HashIcon, FastForward, Boxes, ToggleLeft, AlignStartHorizontal, Crosshair, Thermometer, Sun, Flame, TrendingUp, BarChart2, Filter as FilterIcon, Infinity, ArrowRightFromLine, Calculator, ArrowDownAZ, Users, DollarSign, UserPlus, Milestone, Wand2, FlaskConical, Sparkles, Clock, GitPullRequest, Leaf, Route, Map as MapIcon, Key, Eye, Sigma, MapPin as MapPinIcon, Target as TargetIcon, Search as SearchIcon, Bug, Clock as ClockIcon, Keyboard, AlignLeft, AlignRight, SplitSquareVertical, IterationCcw, Home, Bot, Flag, ArrowDownRight, Waypoints, Scale, Ruler, GitCompare, ArrowRightLeft
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  iterativeBFS: {
    id: 'iterativeBFS',
    title: '1. Iterative BFS (Deque)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'indigo',
    code: `class Solution {
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        List<List<Integer>> res = new ArrayList<>();
        if (root == null) return res;
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        boolean leftToRight = true;
        
        while (!q.isEmpty()) {
            int size = q.size();
            LinkedList<Integer> currLevel = new LinkedList<>();
            for (int i = 0; i < size; i++) {
                TreeNode node = q.poll();
                if (leftToRight) {
                    currLevel.addLast(node.val);
                } else {
                    currLevel.addFirst(node.val);
                }
                if (node.left != null) q.offer(node.left);
                if (node.right != null) q.offer(node.right);
            }
            res.add(currLevel);
            leftToRight = !leftToRight;
        }
        return res;
    }
}`,
    desc: "The standard way to traverse a tree level-by-level is using Breadth-First Search (BFS) with a Queue. To achieve the 'zigzag' effect without complex stack management, we just change HOW we insert into our temporary level list! We maintain a boolean flag `leftToRight`. If true, we append to the back (`addLast`). If false, we prepend to the front (`addFirst`), efficiently reversing the order of that level in O(1) time per element using a LinkedList."
  },
  recursiveDFS: {
    id: 'recursiveDFS',
    title: '2. Recursive DFS (Modulo)',
    icon: <Waypoints size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    List<List<Integer>> res = new ArrayList<>();
    public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
        dfs(root, 0);
        return res;
    }
    
    private void dfs(TreeNode node, int level) {
        if (node == null) return;
        
        if (res.size() == level) {
            res.add(new LinkedList<>());
        }
        
        if (level % 2 == 0) {
            res.get(level).add(node.val);
        } else {
            res.get(level).add(0, node.val);
        }
        
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    }
}`,
    desc: "We can remarkably solve a BFS problem using Preorder DFS by tracking the current `level`! Because we know even levels (0, 2, 4) should be Left-to-Right and odd levels (1, 3, 5) should be Right-to-Left, we can just use the modulo operator (`level % 2 == 0`). We retrieve the sub-list for the current level. If the level is even, we append the node normally. If it's odd, we insert it at index 0."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'indigo', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|zigzagLevelOrder|dfs|Solution|TreeNode|root|res|ArrayList|LinkedList|List|Queue|q|node|currLevel|val|left|right|add|addFirst|addLast|offer|poll|isEmpty|size|leftToRight|level|get|null)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}])/g).filter(Boolean);
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
            const isObject = ['String', 'Solution', 'TreeNode', 'ArrayList', 'LinkedList', 'List', 'Queue'].includes(part);
            const isPointer = ['root', 'res', 'node', 'val', 'left', 'right', 'q', 'currLevel', 'size', 'leftToRight', 'level', 'i'].includes(part);
            const isMapCall = ['zigzagLevelOrder', 'dfs', 'add', 'addFirst', 'addLast', 'offer', 'poll', 'isEmpty', 'get'].includes(part);
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

export default function ZigzagTraversalVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('iterativeBFS');
  
  const [treeInput, setTreeInput] = useState('3, 9, 20, null, null, 15, 7');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([3, 9, 20, null, null, 15, 7]);

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
      if (arr.length === 0) return [];
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

      let maxD = 0;
      const assignCoords = (node: any, depth: number, minX: number, maxX: number) => {
          if (!node) return;
          if (depth > maxD) maxD = depth;
          
          node.x = (minX + maxX) / 2;
          node.y = depth * 80;
          nodes.push(node);

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
      
      assignCoords(root, 0, -300, 300);

      return { root, nodes, edges, maxDepth: maxD };
  }, [baseTreeArr]);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root) {
        steps.push({ phase: 'init', description: `Tree is empty. Returning empty list.`, line: 4, state: { res: [] } });
        return steps;
    }

    let res: number[][] = [];

    if (selectedOpId === 'iterativeBFS') {
        let queue: any[] = [];
        let visitedNodes = new Set<number>();
        let currLevel: number[] = [];
        let leftToRight = true;
        
        const cloneRes = () => res.map(arr => [...arr]);
        const cloneQueue = () => queue.map(n => n.id);

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { res: cloneRes(), queue: cloneQueue(), currLevel: [...currLevel], visited: new Set(visitedNodes), leftToRight, ...st } 
        });

        add("Function Call", `public List<List<Integer>> zigzagLevelOrder(TreeNode root)`, 2, { hlPhase: 'init' });
        
        add("Init Array & Queue", `List<List<Integer>> res = new ArrayList<>();\nQueue<TreeNode> q = new LinkedList<>();`, 3, { hlPhase: 'initArrays' });
        
        queue.push(treeData.root);
        add("Offer Root", `q.offer(root);\nPushing root node ${treeData.root.val} to queue.`, 6, { hlPhase: 'offer', pushedId: treeData.root.id });

        add("Init Flag", `boolean leftToRight = true;\nStarting at level 0, we move left to right.`, 7, { hlPhase: 'initFlag' });

        let levelCounter = 0;

        while (queue.length > 0) {
            if (steps.length > 2500) break;

            add("While Loop", `while (!q.isEmpty())\nQueue is not empty. Moving to next level.`, 9, { hlPhase: 'loop', level: levelCounter });

            let levelSize = queue.length;
            add("Get Level Size", `int size = q.size();\nSnapshotting size (${levelSize}) to process only current level nodes.`, 10, { hlPhase: 'size', level: levelCounter, levelSize });

            currLevel = [];
            add("Init Level List", `LinkedList<Integer> currLevel = new LinkedList<>();\nCreating a new temporary Deque/LinkedList.`, 11, { hlPhase: 'initLevel', level: levelCounter, levelSize });

            for (let i = 0; i < levelSize; i++) {
                add("For Loop", `for (int i = 0; i < size; i++)\nProcessing node ${i + 1} of ${levelSize}.`, 12, { hlPhase: 'for', level: levelCounter, levelSize, i });

                let node = queue.shift()!;
                add("Poll Node", `TreeNode node = q.poll();\nPopped front node ${node.val} from queue.`, 13, { hlPhase: 'poll', currNodeId: node.id, level: levelCounter });

                add("Check Direction", `if (leftToRight)\nIs current level moving Left-to-Right? ${leftToRight ? 'YES.' : 'NO.'}`, 14, { hlPhase: 'checkDir', currNodeId: node.id, level: levelCounter });
                
                if (leftToRight) {
                    currLevel.push(node.val); // equivalent to addLast
                    visitedNodes.add(node.id);
                    add("Append to End", `currLevel.addLast(node.val);\nAppending ${node.val} to the END of the list.`, 15, { hlPhase: 'addLast', currNodeId: node.id, addedVal: node.val, level: levelCounter });
                } else {
                    currLevel.unshift(node.val); // equivalent to addFirst
                    visitedNodes.add(node.id);
                    add("Prepend to Front", `currLevel.addFirst(node.val);\nInserting ${node.val} at the FRONT of the list to reverse order!`, 17, { hlPhase: 'addFirst', currNodeId: node.id, addedVal: node.val, level: levelCounter });
                }

                add("Check Children", `if (node.left != null) q.offer(node.left);\nif (node.right != null) q.offer(node.right);\nEnqueuing children normally for next level.`, 19, { hlPhase: 'checkChildren', currNodeId: node.id, level: levelCounter });
                if (node.left) {
                    queue.push(node.left);
                    add("Offer Left", `q.offer(node.left);\nEnqueued left child ${node.left.val}.`, 19, { hlPhase: 'offerLeft', currNodeId: node.id, pushedId: node.left.id, level: levelCounter });
                }

                if (node.right) {
                    queue.push(node.right);
                    add("Offer Right", `q.offer(node.right);\nEnqueued right child ${node.right.val}.`, 20, { hlPhase: 'offerRight', currNodeId: node.id, pushedId: node.right.id, level: levelCounter });
                }
            }

            res.push([...currLevel]);
            add("Add Level to Result", `res.add(currLevel);\nLevel ${levelCounter} complete. Appending [${currLevel.join(',')}] to final result.`, 22, { hlPhase: 'addRes', addedLevel: [...currLevel], level: levelCounter });
            
            leftToRight = !leftToRight;
            add("Toggle Direction", `leftToRight = !leftToRight;\nSwitching direction for the next level!`, 23, { hlPhase: 'toggleDir', level: levelCounter });
            
            levelCounter++;
            currLevel = []; // clear for viz
        }

        add("Return Result", `return res;\nQueue is empty. Zigzag Traversal complete!`, 25, { hlPhase: 'success', isSuccess: true });
    }
    else if (selectedOpId === 'recursiveDFS') {
        let callStack: number[] = [];
        let visitedNodes = new Set<number>();
        
        const cloneRes = () => res.map(arr => [...arr]);
        const cloneStack = () => [...callStack];

        const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { res: cloneRes(), stack: cloneStack(), visited: new Set(visitedNodes), ...st } 
        });

        add("Function Call", `public List<List<Integer>> zigzagLevelOrder(TreeNode root)`, 3, { hlPhase: 'init' });
        
        add("Start DFS", `dfs(root, 0);\nKicking off recursive DFS starting at level 0.`, 4, { hlPhase: 'init' });

        const dfs = (node: any, level: number) => {
            if (steps.length > 2500) return;

            let nId = node ? node.id : -1;
            callStack.push(nId);
            
            add("DFS Entry", `private void dfs(TreeNode node, int level)\nEntering node ${node ? node.val : 'null'} at depth ${level}.`, 8, { hlPhase: 'enter', currNodeId: nId, level });

            add("Null Check", `if (node == null) return;\nIs node null? ${node ? 'NO.' : 'YES. Backtracking.'}`, 9, { hlPhase: 'check', currNodeId: nId, level });
            if (!node) {
                callStack.pop();
                return;
            }

            add("Size Check", `if (res.size() == level)\nResult size (${res.length}) == level (${level})?`, 11, { hlPhase: 'sizeCheck', currNodeId: nId, level });
            if (res.length === level) {
                res.push([]);
                add("Create Sub-List", `res.add(new LinkedList<>());\nWe reached a new depth! Creating a new empty list for level ${level}.`, 12, { hlPhase: 'newList', currNodeId: nId, level });
            }

            let isEven = level % 2 === 0;
            add("Modulo Check", `if (level % 2 == 0)\nIs level ${level} even? ${isEven ? 'YES (Left-to-Right).' : 'NO (Right-to-Left).'}`, 15, { hlPhase: 'checkMod', currNodeId: nId, level, isEven });

            if (isEven) {
                res[level].push(node.val);
                visitedNodes.add(node.id);
                add("Append to End", `res.get(level).add(node.val);\nAppending ${node.val} to the END of list ${level}.`, 16, { hlPhase: 'addLast', currNodeId: nId, addedVal: node.val, level, isEven });
            } else {
                res[level].unshift(node.val);
                visitedNodes.add(node.id);
                add("Prepend to Front", `res.get(level).add(0, node.val);\nInserting ${node.val} at FRONT (index 0) of list ${level}.`, 18, { hlPhase: 'addFirst', currNodeId: nId, addedVal: node.val, level, isEven });
            }

            add("DFS Left", `dfs(node.left, level + 1);\nDiving down the LEFT branch passing level + 1 (${level + 1})...`, 21, { hlPhase: 'goLeft', currNodeId: nId, childId: node.left ? node.left.id : -1, level });
            dfs(node.left, level + 1);

            add("DFS Right", `dfs(node.right, level + 1);\nDiving down the RIGHT branch passing level + 1 (${level + 1})...`, 22, { hlPhase: 'goRight', currNodeId: nId, childId: node.right ? node.right.id : -1, level });
            dfs(node.right, level + 1);

            callStack.pop();
            add("End DFS", `}\nFinished processing node ${node.val}. Popping off call stack.`, 23, { hlPhase: 'exit', currNodeId: nId, level });
        };

        dfs(treeData.root, 0);

        add("Return Result", `return res;\nDFS completely finished. Returning final zigzag array.`, 5, { hlPhase: 'success', isSuccess: true });
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
      
      let pushedNode = null;
      if (st.pushedId !== undefined) {
          pushedNode = treeData.nodes.find((n:any) => n.id === st.pushedId);
      }

      // Determine active direction based on BFS state or DFS state
      let isL2R = selectedOpId === 'iterativeBFS' ? st.leftToRight : (st.isEven !== undefined ? st.isEven : (st.level % 2 === 0));

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'addLast' || st.hlPhase === 'addFirst' ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100 scale-105` : `border-slate-200`}`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><ArrowRightLeft size={14}/> Zigzag Monitor</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Direction Indicator */}
                  {st.level !== undefined && (
                      <div className="flex flex-col items-center min-w-[100px] animate-in slide-in-from-left-4">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'checkDir' || st.hlPhase === 'toggleDir' || st.hlPhase === 'checkMod' ? 'text-amber-500' : 'text-slate-400'}`}>Direction</span>
                          <div className={`border-2 text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 font-black transition-all duration-300 ${st.hlPhase === 'checkDir' || st.hlPhase === 'toggleDir' || st.hlPhase === 'checkMod' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110' : (isL2R ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-rose-50 border-rose-300 text-rose-700')}`}>
                              {isL2R ? (
                                  <><ArrowRight size={16}/> LEFT TO RIGHT</>
                              ) : (
                                  <><ArrowLeft size={16}/> RIGHT TO LEFT</>
                              )}
                          </div>
                      </div>
                  )}

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-4"></div>

                  {/* Current Node */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'addLast' || st.hlPhase === 'addFirst' ? 'text-amber-500' : 'text-slate-400'}`}>Current Node</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'addLast' || st.hlPhase === 'addFirst' ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-md scale-110' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {cNode ? String(cNode.val) : (st.currNodeId === -1 || st.currNodeId === null ? 'null' : '?')}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-4"></div>

                  {/* Action Evaluation */}
                  <div className="flex items-center gap-4">
                      {st.hlPhase === 'addLast' ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-800 shadow-sm flex items-center gap-2`}>
                                  <span>APPEND (End)</span>
                                  <ArrowRight size={16}/>
                                  <span className={`text-${themeColor}-600 bg-white px-2 py-0.5 rounded-md border border-${themeColor}-300`}>{st.addedVal}</span>
                              </div>
                          </div>
                      ) : st.hlPhase === 'addFirst' ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-rose-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-rose-100 border-rose-500 text-rose-800 shadow-sm flex items-center gap-2`}>
                                  <span>PREPEND (Front)</span>
                                  <ArrowLeft size={16}/>
                                  <span className={`text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-300`}>{st.addedVal}</span>
                              </div>
                          </div>
                      ) : st.hlPhase === 'addRes' ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-emerald-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-emerald-100 border-emerald-500 text-emerald-800 shadow-sm flex items-center gap-2`}>
                                  <span>ADD LEVEL TO RES</span>
                                  <ArrowRight size={16}/>
                                  <span className={`text-emerald-600 bg-white px-2 py-0.5 rounded-md border border-emerald-300`}>[ {st.addedLevel && st.addedLevel.join(', ')} ]</span>
                              </div>
                          </div>
                      ) : (st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft') ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-sky-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-sky-100 border-sky-500 text-sky-800 shadow-sm flex items-center gap-2`}>
                                  <span>OFFER TO QUEUE</span>
                                  <ArrowRight size={16}/>
                                  <span className={`text-sky-600 bg-white px-2 py-0.5 rounded-md border border-sky-300`}>{pushedNode ? pushedNode.val : '?'}</span>
                              </div>
                          </div>
                      ) : (st.hlPhase === 'goLeft' || st.hlPhase === 'goRight') ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-purple-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-purple-100 border-purple-500 text-purple-800 shadow-sm flex items-center gap-2`}>
                                  <span>{st.hlPhase === 'goLeft' ? 'RECURSE LEFT' : 'RECURSE RIGHT'}</span>
                              </div>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center opacity-60">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>State</span>
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
      const containerSize = Math.max(300, treeData.maxDepth * 80 + 100);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Data Trackers (Res & Queue/Stack) */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  {/* Results Array (List of Lists) */}
                  <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addRes' || st.hlPhase === 'addFirst' || st.hlPhase === 'addLast' || st.hlPhase === 'newList' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                               <ListOrdered size={14}/> Result Array 
                           </span>
                       </div>
                       
                       <div className="flex flex-col gap-2 min-h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-2 items-start justify-start">
                           {st.res && st.res.length > 0 ? st.res.map((lvlArr: number[], idx: number) => {
                               let isNewRow = st.hlPhase === 'addRes' && idx === st.res.length - 1;
                               let isModifyingRow = (st.hlPhase === 'addFirst' || st.hlPhase === 'addLast') && idx === (selectedOpId === 'iterativeBFS' ? st.res.length - 1 : st.level);
                               let isActiveRow = isNewRow || isModifyingRow;

                               return (
                                   <div key={`res-row-${idx}`} className={`flex gap-2 items-center w-full transition-all duration-300 border-2 rounded-xl p-2 ${isActiveRow ? `bg-${themeColor}-50 border-${themeColor}-400 shadow-sm` : 'bg-slate-50 border-slate-200'}`}>
                                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-12 shrink-0">Lvl {idx}</span>
                                       <div className="flex gap-1 overflow-x-auto scrollbar-none flex-1">
                                           {lvlArr.map((val, vIdx) => {
                                               let isNewVal = isModifyingRow && (st.hlPhase === 'addFirst' ? vIdx === 0 : vIdx === lvlArr.length - 1);
                                               return (
                                                   <div key={`v-${idx}-${vIdx}`} className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono font-black border transition-all duration-500 ${isNewVal ? `bg-${themeColor}-500 border-${themeColor}-600 text-white scale-110 shadow-md` : 'bg-white border-slate-300 text-slate-700'}`}>
                                                       {val}
                                                   </div>
                                               )
                                           })}
                                       </div>
                                   </div>
                               );
                           }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty List</span>}
                       </div>
                  </div>

                  {/* Active Processing List (Iterative currLevel) */}
                  {selectedOpId === 'iterativeBFS' && (
                      <div className={`w-full md:w-56 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addFirst' || st.hlPhase === 'addLast' || st.hlPhase === 'initLevel' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2 border-b pb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                   <ArrowRightLeft size={14}/> currLevel List
                               </span>
                           </div>
                           <div className="flex flex-wrap gap-2 h-full content-start justify-start pt-2">
                               {st.currLevel && st.currLevel.length > 0 ? st.currLevel.map((val: number, idx: number) => {
                                   let isNew = (st.hlPhase === 'addFirst' && idx === 0) || (st.hlPhase === 'addLast' && idx === st.currLevel.length - 1);
                                   return (
                                       <div key={`curlvl-${idx}`} className={`flex justify-center transition-all duration-500 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-base font-black ${isNew ? 'bg-amber-500 border-amber-600 text-white shadow-md scale-110 animate-in zoom-in' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                                           {val}
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2 w-full">Empty</span>}
                           </div>
                      </div>
                  )}

                  {/* Queue / Call Stack */}
                  <div className={`w-full ${selectedOpId === 'iterativeBFS' ? 'md:w-64' : 'md:w-64'} flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft' || st.hlPhase === 'poll' || st.hlPhase === 'enter') ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2 border-b pb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                               {selectedOpId === 'iterativeBFS' ? <Layers size={14}/> : <LayersIcon size={14}/>} 
                               {selectedOpId === 'recursiveDFS' ? 'Call Stack (DFS)' : 'BFS Queue'}
                           </span>
                       </div>
                       
                       {selectedOpId === 'iterativeBFS' ? (
                           // Horizontal Queue Render
                           <div className="flex gap-2 min-h-[60px] items-center overflow-x-auto scrollbar-none justify-start px-2 mt-2">
                               <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest shrink-0">OUT</span>
                               {st.queue && st.queue.length > 0 ? st.queue.map((nodeId: number, idx: number) => {
                                   let nObj = treeData.nodes.find((n:any) => n.id === nodeId);
                                   let isLast = idx === st.queue.length - 1;
                                   let isNew = isLast && (st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft');
                                   
                                   return (
                                       <div key={`q-${idx}-${nodeId}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg w-10 h-10 items-center font-mono text-base font-black ${isNew ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-110' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                           {nObj ? nObj.val : '?'}
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center px-4 shrink-0">Empty</span>}
                               <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest shrink-0 ml-auto">IN</span>
                           </div>
                       ) : (
                           // Vertical Stack Render
                           <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                               {st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((nodeId: number, idx: number) => {
                                   let isTop = idx === 0;
                                   let nObj = treeData.nodes.find((n:any) => n.id === nodeId);
                                   let displayStr = `dfs(${nObj ? nObj.val : 'null'})`;
                                   
                                   return (
                                       <div key={`stk-${idx}-${nodeId}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-70'}`}>
                                           {displayStr}
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                           </div>
                       )}
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
                                  
                                  let isActiveLeftEdge = (st.hlPhase === 'goLeft' || st.hlPhase === 'offerLeft') && activeId === edge.source && edge.isLeft;
                                  let isActiveRightEdge = (st.hlPhase === 'goRight' || st.hlPhase === 'offerRight') && activeId === edge.source && !edge.isLeft;
                                  let isActivelyTraversing = isActiveLeftEdge || isActiveRightEdge;

                                  let strokeColor = '#cbd5e1'; // default slate-300
                                  let strokeWidth = 2;
                                  let opacity = 0.6;

                                  if (isActivelyTraversing) {
                                      strokeColor = selectedOpId === 'iterativeBFS' ? '#0ea5e9' : '#10b981'; // sky or emerald
                                      strokeWidth = 4;
                                      opacity = 1;
                                  } else if (st.visited && st.visited.has(edge.target)) {
                                      strokeColor = themeColor === 'emerald' ? '#10b981' : '#6366f1'; // match theme visited
                                      strokeWidth = 3;
                                      opacity = 0.8;
                                  }

                                  // Using absolute x,y coordinates since SVG 0,0 is now strictly aligned with div 0,0
                                  return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 overflow-visible">
                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id && !st.isSuccess;
                              let isVisited = st.visited && st.visited.has(node.id);
                              
                              let isInQueue = selectedOpId === 'iterativeBFS' && st.queue && st.queue.includes(node.id) && !isActive;
                              let isInStack = selectedOpId === 'recursiveDFS' && st.stack && st.stack.includes(node.id) && !isActive;
                              
                              let isBeingPushed = (st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft' || st.hlPhase === 'offer') && st.pushedId === node.id;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; // Base Unvisited
                              let scaleClass = "scale-100";
                              
                              if (isActive) {
                                  bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                  scaleClass = "scale-125";
                              } else if (isBeingPushed) {
                                  bgClass = "bg-sky-100 border-sky-500 text-sky-900 shadow-lg ring-4 ring-sky-200 z-20 animate-pulse";
                                  scaleClass = "scale-110";
                              } else if (isInQueue) {
                                  bgClass = "bg-white border-sky-400 text-sky-700 shadow-md ring-2 ring-sky-200 z-10"; // Highlighted outline for queued
                              } else if (isInStack) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-md z-10";
                              } else if (isVisited) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-800 shadow-sm`;
                              }

                              if (st.isSuccess) {
                                  bgClass = `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-lg`;
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* Floating Badges */}
                                      {isActive && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce`}>
                                              curr
                                          </span>
                                      )}
                                      {isInQueue && !isBeingPushed && !st.isSuccess && (
                                          <span className={`text-[8px] font-black font-mono uppercase tracking-widest absolute -bottom-4 whitespace-nowrap text-sky-500 opacity-80`}>
                                              in queue
                                          </span>
                                      )}
                                      {isVisited && !isActive && !st.isSuccess && (
                                          <div className={`absolute -right-2 -bottom-2 bg-${themeColor}-500 text-white rounded-full p-0.5 shadow-sm z-40 border border-white`}>
                                              <Check size={12} strokeWidth={4}/>
                                          </div>
                                      )}

                                      <div className={`w-14 h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-xl leading-none`}>{node.val}</span>
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
                <ArrowRightLeft className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Zigzag Level Order</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Breadth-First Search
                  </span>
                  <span>•</span>
                  <span>LeetCode 103</span>
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
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><ArrowRightLeft size={28}/> Traverse by Zigzag Level</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given the <code>root</code> of a binary tree, return <em>the zigzag level order traversal of its nodes' values.</em></p>
                        <p>A Zigzag Traversal means evaluating the tree horizontally, but alternating direction every step (i.e., from left to right, then right to left for the next level and alternate between).</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-8`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 1: Basic Tree</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [3,9,20,null,null,15,7]</p>
                                    <p><strong>Output:</strong> [[3],[20,9],[15,7]]</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`    3  (->)
   / \\
  9  20 (<-)
    /  \\
   15   7 (->)`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 2: Single Node</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = [1]</p>
                                    <p><strong>Output:</strong> [[1]]</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className={`text-${themeColor}-400 font-bold`}>
{`   1`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col gap-4 mt-4`}>
                        <div className="w-full space-y-2">
                            <span className={`text-${themeColor}-400 block uppercase text-[10px] font-black tracking-widest`}>Example 3: Empty Tree</span>
                            <div className="text-slate-300 break-all space-y-4">
                                <div>
                                    <p><strong>Input:</strong> root = []</p>
                                    <p><strong>Output:</strong> []</p>
                                </div>
                                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 w-fit">
                                    <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                    <pre className="text-slate-500 italic">
{`  (empty)`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range <code>[0, 2000]</code>.</li>
                            <li><code>-100 &le; Node.val &le; 100</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Goal size={16} className="text-sky-500"/> The Core Insight</h4>
                        <p className="text-sm leading-relaxed">This is exactly like standard Level Order Traversal with one twist: every alternate level needs to be reversed. Instead of completely rewriting the BFS logic using two Stacks or tracking complex state, we can just change <em>how we add items into our temporary row list</em>. We use a <code>LinkedList</code> (Deque) and alternate between <code>addLast()</code> (append) and <code>addFirst()</code> (prepend) to magically reverse the sequence on the fly!</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h4 className="font-black uppercase text-xs tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Workflow size={16} className={`text-${themeColor}-500`}/> The Strategy Options</h4>
                        <p className="text-sm leading-relaxed text-slate-600 mb-2"><strong>1. Iterative BFS:</strong> We use a standard Queue. We maintain a boolean flag <code>leftToRight</code>. Inside the level-processing loop, if the flag is true, we append items. If false, we prepend them. At the end of the loop, we toggle the flag <code>leftToRight = !leftToRight</code>.</p>
                        <p className="text-sm leading-relaxed text-slate-600"><strong>2. Recursive DFS:</strong> Surprisingly, we can use DFS! We pass a <code>level</code> integer down the recursive calls. If <code>level % 2 == 0</code>, we append the node's value. If it's an odd level, we prepend the node's value to the list at index 0.</p>
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
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-${themeColor}-400`}>
                                <PartyPopper size={24}/> TRAVERSAL COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Every node successfully visited in Zigzag Level sequence.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' || st.hlPhase === 'addFirst' || st.hlPhase === 'addLast' || st.hlPhase === 'newList' ? 'text-indigo-400' : (st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft' || st.hlPhase === 'poll' ? 'text-sky-400' : (st.hlPhase === 'size' || st.hlPhase === 'initLevel' || st.hlPhase === 'toggleDir' || st.hlPhase === 'checkMod' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding the List Insertion Trick.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowRightLeft size={24} className="text-sky-500"/> 1. The AddFirst Trick</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Reversing arrays manually using a two-pointer approach or <code>Collections.reverse()</code> takes $O(K)$ time per level, where $K$ is the size of the level. This isn't terrible, but we can do better.</p>
                        <p className="text-slate-600 leading-relaxed">By using a <code>LinkedList</code> (which implements the <code>Deque</code> interface) for our temporary level lists, we get access to <code>addFirst()</code>. Inserting an element at the front of a LinkedList is an $O(1)$ constant time operation. This automatically reverses the order of the nodes on the fly without needing a separate reversing pass!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Waypoints size={24} className="text-emerald-500"/> 2. DFS for Zigzag BFS?</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">It seems impossible, but DFS works perfectly here. When you dive down the tree recursively, you pass the current depth (<code>level</code>). You then push the node's value into the sub-list sitting at <code>res.get(level)</code>.</p>
                        <p className="text-slate-600 leading-relaxed">Standard DFS visits left branches before right branches. By simply evaluating <code>level % 2 == 0</code>, we decide if we should <code>add()</code> to the back (keeping the left-to-right order) or <code>add(0, val)</code> to the front (forcing the right-most elements to end up at the start of the list).</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-rose-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(N).</strong> We visit every single node in the tree exactly once. Because <code>addFirst</code> on a LinkedList is $O(1)$, reversing the layers does not add any extra asymptotic time cost. Total time is strictly $O(N)$.</li>
                            <li><strong>Space Complexity: O(W) or O(N).</strong> For BFS, the Queue holds at most the number of nodes on the widest level of the tree. For a balanced tree, the bottom level contains approximately $N/2$ nodes. Therefore, the worst-case space complexity is $O(N)$.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a brilliant twist on the standard BFS template. If you can explain *why* LinkedList.addFirst() is $O(1)$ while ArrayList.add(0, val) is $O(N)$, you will immediately stand out as an elite candidate."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we just reverse the queue insertion order (push right, then push left) instead of modifying the list?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, that corrupts the structure for future levels.</p>
                            <p>If you push Right then Left to flip the current level, when you poll those nodes for the NEXT level, their children will be pulled in the wrong structural order. It cascades and destroys the tree alignment. The Queue MUST process Left then Right normally every single time. Reversal must only happen on the final output arrays."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "Why use `LinkedList` instead of `ArrayList` for the `currLevel` variable?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To avoid $O(N)$ shift operations."</p>
                            <p>An `ArrayList` is backed by a continuous block of memory. If you insert an element at index 0, the CPU must physically shift every single existing element one slot to the right. A `LinkedList` just updates two memory pointers (`prev` and `next`), so inserting at the front is always lightning fast $O(1)$."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-amber-500 mt-0.5"><ShieldAlert size={24}/></span>
                            <span>Q3: "Which approach is better in a production environment: BFS or DFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "BFS is generally safer for deeply nested structures."</p>
                            <p>While DFS uses a beautiful short recursive syntax, it is bound by the JVM Call Stack limits. If a tree is highly unbalanced (like a linked list) and has 100,000 nodes, DFS will throw a <code>StackOverflowError</code> and crash the application. BFS uses a Queue located on the Heap memory, which is vastly larger, making it robust against deeply skewed trees."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' || st.hlPhase === 'addFirst' || st.hlPhase === 'addLast' || st.hlPhase === 'newList' ? 'text-indigo-400' : (st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft' || st.hlPhase === 'poll' ? 'text-sky-400' : (st.hlPhase === 'size' || st.hlPhase === 'initLevel' || st.hlPhase === 'toggleDir' || st.hlPhase === 'checkMod' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                           
                           {/* Call Stack / Iterative Stack */}
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft' || st.hlPhase === 'poll' || st.hlPhase === 'enter') ? 'border-sky-300 ring-4 ring-sky-100 scale-[1.02]' : 'border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-2 border-b pb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-sky-600 flex items-center gap-2`}>
                                        {selectedOpId === 'iterativeBFS' ? <Layers size={14}/> : <LayersIcon size={14}/>} 
                                        {selectedOpId === 'recursiveDFS' ? 'Call Stack (DFS)' : 'BFS Queue'}
                                    </span>
                                </div>
                                {selectedOpId === 'iterativeBFS' ? (
                                    <div className="flex gap-2 min-h-[60px] items-center overflow-x-auto scrollbar-none justify-start px-2 mt-2">
                                        <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest shrink-0">OUT</span>
                                        {st.queue && st.queue.length > 0 ? st.queue.map((nodeId: number, idx: number) => {
                                            let nObj = treeData.nodes.find((n:any) => n.id === nodeId);
                                            let isFirst = idx === 0;
                                            let isLast = idx === st.queue.length - 1;
                                            let isNew = isLast && (st.hlPhase === 'offer' || st.hlPhase === 'offerRight' || st.hlPhase === 'offerLeft');
                                            
                                            return (
                                                <div key={`fs-q-${idx}-${nodeId}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg w-10 h-10 items-center font-mono text-base font-black ${isNew ? 'bg-sky-500 border-sky-600 text-white shadow-md scale-110' : 'bg-sky-50 border-sky-200 text-sky-700'}`}>
                                                    {nObj ? nObj.val : '?'}
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono text-center px-4 shrink-0">Empty</span>}
                                        <span className="text-slate-300 font-black text-[10px] uppercase tracking-widest shrink-0 ml-auto">IN</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                                        {st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((nodeId: number, idx: number) => {
                                            let isTop = idx === 0;
                                            let nObj = treeData.nodes.find((n:any) => n.id === nodeId);
                                            let displayStr = `dfs(${nObj ? nObj.val : 'null'})`;
                                            
                                            return (
                                                <div key={`fs-stk-${idx}-${nodeId}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-emerald-500 border-emerald-600 text-white shadow-md' : 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-70'}`}>
                                                    {displayStr}
                                                </div>
                                            );
                                        }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                                    </div>
                                )}
                           </div>

                           {/* Results Array */}
                           <div className={`w-full flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addRes' || st.hlPhase === 'addVal' || st.hlPhase === 'newList' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                                        <ListOrdered size={14}/> Result Array
                                    </span>
                                </div>
                                <div className="flex flex-col gap-2 min-h-[80px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-2 items-start justify-start">
                                    {st.res && st.res.length > 0 ? st.res.map((lvlArr: number[], idx: number) => {
                                        let isNewRow = st.hlPhase === 'addRes' && idx === st.res.length - 1;
                                        let isModifyingRow = (st.hlPhase === 'addFirst' || st.hlPhase === 'addLast') && idx === (selectedOpId === 'iterativeBFS' ? st.res.length - 1 : st.level);
                                        let isActiveRow = isNewRow || isModifyingRow;

                                        return (
                                            <div key={`fs-res-row-${idx}`} className={`flex gap-2 items-center w-full transition-all duration-300 border-2 rounded-xl p-2 ${isActiveRow ? `bg-${themeColor}-50 border-${themeColor}-400 shadow-sm` : 'bg-slate-50 border-slate-200'}`}>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-12 shrink-0">Lvl {idx}</span>
                                                <div className="flex gap-1 overflow-x-auto scrollbar-none flex-1">
                                                    {lvlArr.map((val, vIdx) => {
                                                        let isNewVal = isModifyingRow && (st.hlPhase === 'addFirst' ? vIdx === 0 : vIdx === lvlArr.length - 1);
                                                        return (
                                                            <div key={`fs-v-${idx}-${vIdx}`} className={`flex items-center justify-center w-8 h-8 rounded-lg font-mono font-black border transition-all duration-300 ${isNewVal ? `bg-${themeColor}-500 border-${themeColor}-600 text-white scale-110 shadow-md` : 'bg-white border-slate-300 text-slate-700'}`}>
                                                                {val}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty List</span>}
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
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-${themeColor}-600`}>Tree Array</label>
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='3, 9, 20, null, null, 15, 7' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 ring-${themeColor}-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Zigzag Level Order Result</div>
                                    <div className="font-mono text-white text-xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center">
                                        [ {st.res && st.res.map((arr:any) => `[${arr.join(',')}]`).join(', ')} ]
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