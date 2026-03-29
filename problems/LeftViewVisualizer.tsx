import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, Network,
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, AlignVerticalSpaceAround,
  ZoomIn, ZoomOut, Maximize, GitMerge, SortAsc, LayoutGrid, Database,
  AlertTriangle, Clock, Cpu, HelpCircle, Target, ArrowDownToLine, Eye, ArrowRightToLine
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bfsLevelOrder: {
    id: 'bfsLevelOrder',
    title: '1. BFS (Level Order) O(N)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'indigo',
    code: `class Solution {
    public ArrayList<Integer> leftView(TreeNode root) {
        ArrayList<Integer> ans = new ArrayList<>();
        if (root == null) return ans;
        
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        
        while (!q.isEmpty()) {
            int size = q.size();
            
            for (int i = 0; i < size; i++) {
                TreeNode temp = q.poll();
                
                // If it's the first node in this level, it's visible from the left!
                if (i == 0) {
                    ans.add(temp.val);
                }
                
                if (temp.left != null) q.add(temp.left);
                if (temp.right != null) q.add(temp.right);
            }
        }
        return ans;
    }
}`,
    desc: "The standard iterative approach using Breadth-First Search. We process the tree level by level. Because we iterate through each level from left to right, the VERY FIRST node we pull out of the queue during a level's for-loop (when i == 0) is guaranteed to be the left-most node of that entire row!"
  },
  dfsPreOrder: {
    id: 'dfsPreOrder',
    title: '2. DFS (Pre-order) O(N)',
    icon: <ArrowRightToLine size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'emerald',
    code: `class Solution {
    public ArrayList<Integer> leftView(TreeNode root) {
        ArrayList<Integer> ans = new ArrayList<>();
        dfs(root, 0, ans);
        return ans;
    }
    
    private void dfs(TreeNode node, int depth, ArrayList<Integer> ans) {
        if (node == null) return;
        
        // If this is the very first time we've reached this depth, add it!
        if (depth == ans.size()) {
            ans.add(node.val);
        }
        
        // Standard Pre-order strictly visits left branches before right branches
        dfs(node.left, depth + 1, ans);
        dfs(node.right, depth + 1, ans);
    }
}`,
    desc: "A remarkably elegant DFS approach. We traverse the tree keeping track of our current `depth`. Because we always traverse the `left` child before the `right` child, the first time we ever reach a new depth, it MUST be the left-most node! We can easily check if a depth is new by seeing if our current depth equals the size of our result array."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|leftView|dfs|TreeNode|root|node|depth|ans|ArrayList|Queue|LinkedList|q|add|poll|isEmpty|size|left|right|val|temp)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            const isObject = ['String', 'Solution', 'TreeNode', 'ArrayList', 'Queue', 'LinkedList'].includes(part);
            const isPointer = ['root', 'node', 'depth', 'ans', 'q', 'temp', 'left', 'right', 'val', 'i', 'size'].includes(part);
            const isMapCall = ['leftView', 'dfs', 'add', 'poll', 'isEmpty'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
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

export default function LeftViewVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bfsLevelOrder');
  
  const [treeInput, setTreeInput] = useState('1, 2, 3, null, 4, null, null, null, 5');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 2, 3, null, 4, null, null, null, 5]);

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
      while (arr.length > 0 && arr[arr.length - 1] === null) arr.pop();
      if (arr.length === 0) arr = [1, 2, 3, null, 4, null, null, null, 5];
      return arr.slice(0, 31);
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
      if (baseTreeArr.length === 0 || baseTreeArr[0] === null || baseTreeArr[0] === undefined) {
          return { root: null, nodes: [], edges: [], maxDepth: 0, logicalRows: new Set<number>() };
      }
      
      let nodes: any[] = [];
      let edges: any[] = [];
      let logicalRows = new Set<number>();
      
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
          logicalRows.add(depth);
          
          node.logicalRow = depth;
          
          // Standard balanced projection
          node.x = (minX + maxX) / 2;
          node.y = depth * 80;

          nodes.push(node);

          if (node.left) {
              edges.push({ source: node.id, target: node.left.id, sx: node.x, sy: node.y + 24, tx: (minX + node.x) / 2, ty: (depth + 1) * 80 - 24, isLeft: true });
              assignCoords(node.left, depth + 1, minX, node.x);
          }
          if (node.right) {
              edges.push({ source: node.id, target: node.right.id, sx: node.x, sy: node.y + 24, tx: (node.x + maxX) / 2, ty: (depth + 1) * 80 - 24, isLeft: false });
              assignCoords(node.right, depth + 1, node.x, maxX);
          }
      };
      
      assignCoords(root, 0, -300, 300);

      return { root, nodes, edges, maxDepth: maxD, logicalRows };
  }, [baseTreeArr]);

  // Generate trace line-by-line
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root) {
        steps.push({ phase: 'Init', description: `Tree is empty. Returning empty list.`, line: selectedOpId === 'bfsLevelOrder' ? 4 : 4, state: { resList: [], visitedIds: new Set(), visibleIds: new Set() } });
        return steps;
    }

    if (selectedOpId === 'bfsLevelOrder') {
        let q: any[] = [];
        let list: number[] = [];
        let visitedIds = new Set<number>();
        let visibleIds = new Set<number>();
        
        const cloneQ = () => q.map(n => ({ val: n.val, id: n.id }));
        const cloneList = () => [...list];

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { q: cloneQ(), resList: cloneList(), visitedIds: new Set(visitedIds), visibleIds: new Set(visibleIds), ...st } 
        });

        add("Init Result Array", `ArrayList<Integer> ans = new ArrayList<>();\nIf root is null, return immediately.`, 3, { hlPhase: 'init' });
        add("Init Queue", `Queue<TreeNode> q = new LinkedList<>();`, 6, { hlPhase: 'init' });
        
        q.push(treeData.root);
        add("Enqueue Root", `q.add(root);\nPlacing the root node (${treeData.root.val}) into the queue to start.`, 7, { hlPhase: 'enqueue', currNodeId: treeData.root.id });

        while (q.length > 0) {
            if (steps.length > 2000) break;

            add("While Loop", `while (!q.isEmpty()) {\nQueue is not empty. Moving to next depth level.`, 9, { hlPhase: 'loop' });

            let size = q.length;
            add("Capture Level Size", `int size = q.size();\nThere are ${size} nodes at this depth level.`, 10, { hlPhase: 'size', levelSize: size });

            for (let i = 0; i < size; i++) {
                add("For Loop", `for (int i = 0; i < size; i++) {\nProcessing node ${i} out of ${size} at this level.`, 12, { hlPhase: 'for', loopI: i, levelSize: size });

                let curr = q.shift()!;
                visitedIds.add(curr.id);
                add("Poll Node", `TreeNode temp = q.poll();\nExtracted node ${curr.val}.`, 13, { hlPhase: 'poll', currNodeId: curr.id, loopI: i, levelSize: size });

                add("Check First in Level", `if (i == 0) {\nChecking if this is the FIRST node of the current level.`, 16, { hlPhase: 'checkFirst', currNodeId: curr.id, loopI: i, levelSize: size });
                
                if (i === 0) {
                    list.push(curr.val);
                    visibleIds.add(curr.id);
                    add("Add to Result", `ans.add(temp.val);\nYes! i == 0, meaning it's the left-most node. Added ${curr.val} to Left View!`, 17, { hlPhase: 'addRes', currNodeId: curr.id, loopI: i, levelSize: size, addedVal: curr.val });
                } else {
                    add("Obscured Node", `i != 0.\nThis node is hidden behind the left-most node at this level. Skipping.`, 16, { hlPhase: 'skipRes', currNodeId: curr.id, loopI: i, levelSize: size });
                }

                add("Check Children", `if (temp.left != null) ... if (temp.right != null) ...\nEnqueuing children for the next level.`, 20, { hlPhase: 'checkChildren', currNodeId: curr.id, loopI: i, levelSize: size });

                if (curr.left) {
                    q.push(curr.left);
                    add("Traverse Left", `q.add(temp.left);\nEnqueued left child ${curr.left.val}.`, 20, { hlPhase: 'enqueueL', currNodeId: curr.id, childId: curr.left.id, loopI: i, levelSize: size });
                }
                if (curr.right) {
                    q.push(curr.right);
                    add("Traverse Right", `q.add(temp.right);\nEnqueued right child ${curr.right.val}.`, 21, { hlPhase: 'enqueueR', currNodeId: curr.id, childId: curr.right.id, loopI: i, levelSize: size });
                }
            }
        }

        add("Done", `return ans;\nLeft View Traversal Complete!`, 24, { hlPhase: 'success', isSuccess: true });
    }
    else if (selectedOpId === 'dfsPreOrder') {
        let callStack: { val: number, id: number, depth: number }[] = [];
        let list: number[] = [];
        let visitedIds = new Set<number>();
        let visibleIds = new Set<number>();
        
        const cloneStack = () => [...callStack];
        const cloneList = () => [...list];

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { stack: cloneStack(), resList: cloneList(), visitedIds: new Set(visitedIds), visibleIds: new Set(visibleIds), ...st } 
        });

        add("Start Process", `ArrayList<Integer> ans = new ArrayList<>();\ndfs(root, 0, ans);`, 4, { hlPhase: 'init' });

        const dfs = (node: any, depth: number) => {
            if (steps.length > 2000) return;
            
            add("Check Null", `if (node == null) return;\nChecking if current pointer is null.`, 9, { hlPhase: 'dfsCheck' });
            if (!node) {
                add("DFS Null", `return;\nPointer is null, backtracking...`, 9, { hlPhase: 'dfsNull' });
                return;
            }

            visitedIds.add(node.id);
            callStack.push({ val: node.val, id: node.id, depth });
            add("DFS Entry", `private void dfs(TreeNode node, int depth, ...)\nEntered node ${node.val} at depth ${depth}.`, 8, { hlPhase: 'enter', currNodeId: node.id, cDepth: depth });

            add("Evaluate Depth", `if (depth == ans.size())\nChecking if current depth (${depth}) equals ans.size() (${list.length}).`, 12, { hlPhase: 'checkDepth', currNodeId: node.id, cDepth: depth, listSize: list.length });
            
            if (depth === list.length) {
                list.push(node.val);
                visibleIds.add(node.id);
                add("Found New Depth", `ans.add(node.val);\nThis is the FIRST time reaching depth ${depth}. Adding ${node.val} to Left View!`, 13, { hlPhase: 'addRes', currNodeId: node.id, cDepth: depth, addedVal: node.val });
            } else {
                add("Obscured Node", `depth != ans.size().\nWe have already recorded a node for depth ${depth}. Node ${node.val} is obscured!`, 12, { hlPhase: 'skipRes', currNodeId: node.id, cDepth: depth });
            }

            add("Traverse Left", `dfs(node.left, depth + 1, ans);\nDescending to left child (Depth ${depth + 1}).`, 16, { hlPhase: 'goLeft', currNodeId: node.id, childId: node.left ? node.left.id : null, cDepth: depth });
            dfs(node.left, depth + 1);

            add("Traverse Right", `dfs(node.right, depth + 1, ans);\nDescending to right child (Depth ${depth + 1}).`, 17, { hlPhase: 'goRight', currNodeId: node.id, childId: node.right ? node.right.id : null, cDepth: depth });
            dfs(node.right, depth + 1);

            callStack.pop();
            add("Return", `Finished processing node ${node.val}. Removing from call stack.`, 18, { hlPhase: 'exit', currNodeId: node.id });
        };

        dfs(treeData.root, 0);
        add("Done", `return ans;\nLeft View Traversal Complete!`, 5, { hlPhase: 'success', isSuccess: true });
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
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
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

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      else if (e.key === 'Escape') setIsFullscreen(false);
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
      
      let valToRender = cNode ? String(cNode.val) : '?';

      let isEvaluating = st.hlPhase === 'checkFirst' || st.hlPhase === 'checkDepth';
      let isVisible = st.hlPhase === 'addRes';
      let isObscured = st.hlPhase === 'skipRes';

      let borderCol = isVisible ? `border-${themeColor}-400 ring-4 ring-${themeColor}-100` : (isObscured ? 'border-slate-400 ring-4 ring-slate-100' : 'border-slate-200');

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${borderCol} scale-105 z-40`}>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isVisible ? `text-${themeColor}-500` : (isObscured ? 'text-slate-500' : 'text-slate-400')} mb-4 flex items-center gap-1`}><Eye size={14}/> Left View Monitor</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Current Node/Value */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || isEvaluating || isVisible || isObscured ? 'text-amber-500' : 'text-slate-400'}`}>Evaluating Node</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || isEvaluating || isVisible || isObscured ? 'bg-amber-100 border-amber-500 text-amber-900 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {valToRender}
                      </div>
                  </div>

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>

                  {/* Conditions */}
                  {selectedOpId === 'bfsLevelOrder' && st.loopI !== undefined && (
                      <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Level Index (i)</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-700`}>
                                  {st.loopI}
                              </div>
                          </div>
                      </div>
                  )}

                  {selectedOpId === 'dfsPreOrder' && st.cDepth !== undefined && (
                      <div className="flex items-center gap-4 animate-in slide-in-from-bottom-2">
                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-500`}>Depth</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-${themeColor}-50 border-${themeColor}-300 text-${themeColor}-700`}>
                                  {st.cDepth}
                              </div>
                          </div>
                          
                          <div className="flex flex-col items-center min-w-[70px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-sky-500`}>Ans Size</span>
                              <div className={`border-2 text-xl font-black px-4 py-2 rounded-xl transition-all duration-300 bg-sky-50 border-sky-300 text-sky-700`}>
                                  {st.listSize !== undefined ? st.listSize : st.resList?.length}
                              </div>
                          </div>
                      </div>
                  )}

                  <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>

                  {/* Action Evaluation */}
                  <div className="flex items-center gap-4 min-w-[150px]">
                      {isVisible ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-right-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-${themeColor}-600`}>Result</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-800 shadow-md flex items-center gap-2`}>
                                  <span>VISIBLE (ADDED)</span>
                              </div>
                          </div>
                      ) : isObscured ? (
                           <div className="flex flex-col items-center animate-in slide-in-from-right-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Result</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-slate-100 border-slate-400 text-slate-700 shadow-md flex items-center gap-2`}>
                                  <span>OBSCURED (IGNORED)</span>
                              </div>
                          </div>
                      ) : isEvaluating ? (
                           <div className="flex flex-col items-center animate-in slide-in-from-right-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Logic</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-amber-100 border-amber-500 text-amber-800 shadow-md flex items-center gap-2`}>
                                  <span>{selectedOpId === 'bfsLevelOrder' ? 'CHECKING IF i == 0' : 'CHECKING IF depth == size'}</span>
                              </div>
                          </div>
                      ) : (st.hlPhase === 'goLeft' || st.hlPhase === 'goRight' || st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR') ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-purple-500`}>Action</span>
                              <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl bg-purple-50 border-purple-400 text-purple-700 shadow-sm flex items-center gap-2`}>
                                  <span>{(st.hlPhase === 'goLeft' || st.hlPhase === 'enqueueL') ? 'TRAVERSE LEFT' : 'TRAVERSE RIGHT'}</span>
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

      const containerSize = Math.max(350, treeData.maxDepth * 80 + 150);
      
      // Calculate background horizontal lines based on logicalRows (Depth)
      const rows = Array.from(treeData.logicalRows as Set<number>).sort((a,b) => a-b);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Data Trackers */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-4 px-4 pointer-events-auto items-stretch justify-center">
                  
                  {/* Left side: Queue / Stack */}
                  <div className={`flex-[1] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enqueue' || st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR' || st.hlPhase === 'poll' || st.hlPhase === 'checkQueue' || st.hlPhase === 'enter' || st.hlPhase === 'exit') ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2 border-b pb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                               <LayersIcon size={14}/> {selectedOpId === 'bfsLevelOrder' ? 'BFS Queue' : 'DFS Stack'}
                           </span>
                       </div>
                       <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                           {selectedOpId === 'bfsLevelOrder' ? (
                               <div className={`flex flex-row gap-2 min-h-[60px] overflow-auto scrollbar-none items-center justify-start px-2`}>
                                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">OUT</span>
                                   {st.q && st.q.length > 0 ? st.q.map((item: any, idx: number) => {
                                       let isNew = idx === st.q.length - 1 && (st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR' || st.hlPhase === 'enqueue');

                                       return (
                                           <div key={`fs-q-${idx}`} className={`flex flex-col items-center justify-center shrink-0 border-2 rounded-xl w-12 h-12 font-mono text-lg font-black transition-all duration-300 ${isNew ? `bg-${themeColor}-400 border-${themeColor}-500 text-${themeColor}-950 scale-110 shadow-lg` : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                               {item.val}
                                           </div>
                                       );
                                   }) : <span className="text-slate-300 text-xs italic">Empty</span>}
                                   <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0 ml-auto">IN</span>
                               </div>
                           ) : (
                               st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`stk-${idx}-${item.id}`} className={`flex justify-between transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700 opacity-70`}`}>
                                           <span>dfs({item.val})</span>
                                           <span className="opacity-70 font-normal">(Depth: {item.depth})</span>
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>
                           )}
                       </div>
                  </div>

                  {/* Right side: Result Array */}
                  <div className={`flex-[2] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'addRes' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-2 border-b pb-2">
                           <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                               <ListOrdered size={14}/> Result Array (Left View)
                           </span>
                       </div>
                       <div className="flex gap-4 min-h-[60px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 py-2 items-center justify-start px-2 mt-2">
                           {st.resList && st.resList.length > 0 ? st.resList.map((val: number, idx: number) => {
                               let isNew = idx === st.resList.length - 1 && st.hlPhase === 'addRes';
                               
                               return (
                                   <div key={`resList-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl px-4 py-2 ${isNew ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md scale-110` : 'bg-slate-50 border-slate-200'}`}>
                                       <span className={`text-[9px] font-black font-mono uppercase ${isNew ? `text-${themeColor}-100` : 'text-slate-400'}`}>Depth {idx}</span>
                                       <div className={`font-mono text-xl font-bold ${isNew ? 'text-white' : `text-${themeColor}-900`}`}>
                                           {val}
                                       </div>
                                   </div>
                               )
                           }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Empty</span>}
                       </div>
                  </div>
              </div>

              {/* Graphical Visualizer (Tree Map) */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8`} style={{ minHeight: `${containerSize}px` }}>
                      
                      {/* Fixed unified origin container */}
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 pb-16">
                          
                          {/* Render Horizontal Row Guidelines */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                              {rows.map((rowVal) => {
                                  const yPos = rowVal * 80;
                                  const isActive = st.cDepth === rowVal || (st.currNodeId && treeData.nodes.find(n => n.id === st.currNodeId)?.logicalRow === rowVal);
                                  return (
                                      <div key={`grid-row-${rowVal}`} className={`absolute left-[-250px] right-[-250px] border-t-2 border-dashed transition-all duration-500 ${isActive ? `border-${themeColor}-400 bg-${themeColor}-400/5` : 'border-slate-200'} h-[40px] -translate-y-[20px]`} style={{ top: `${yPos}px` }}>
                                          <div className={`absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 rounded-r-xl border-y border-r transition-all ${isActive ? `bg-${themeColor}-100 border-${themeColor}-300 text-${themeColor}-700 shadow-md` : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                                              <Eye size={18} className={isActive ? `text-${themeColor}-500` : 'text-slate-300'}/>
                                              <span className="text-[10px] font-black font-mono tracking-widest uppercase">Depth {rowVal}</span>
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>

                          <svg className="absolute top-0 left-0 overflow-visible z-10" style={{ width: '1px', height: '1px' }}>
                              {/* Render Edges */}
                              {treeData.edges.map((edge: any, idx: number) => {
                                  let activeId = st.currNodeId !== null ? st.currNodeId : -1;
                                  let isActiveEdge = (st.hlPhase === 'enqueueL' || st.hlPhase === 'goLeft' || st.hlPhase === 'enqueueR' || st.hlPhase === 'goRight') && activeId === edge.source && ((edge.isLeft && (st.hlPhase === 'enqueueL' || st.hlPhase === 'goLeft')) || (!edge.isLeft && (st.hlPhase === 'enqueueR' || st.hlPhase === 'goRight')));
                                  
                                  let strokeColor = '#cbd5e1'; 
                                  let strokeWidth = 2;
                                  let opacity = 0.6;

                                  if (isActiveEdge) {
                                      strokeColor = '#a855f7'; 
                                      strokeWidth = 4;
                                      opacity = 1;
                                  }

                                  return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          {/* Render Nodes */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                          {treeData.nodes.map((node: any) => {
                              let isActive = st.currNodeId === node.id && !st.isSuccess;
                              
                              let isVisited = st.visitedIds && st.visitedIds.has(node.id);
                              let isVisible = st.visibleIds && st.visibleIds.has(node.id);
                              let isObscured = isVisited && !isVisible;

                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                              let scaleClass = "scale-100";
                              
                              if (isActive) {
                                  bgClass = `bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30`;
                                  scaleClass = "scale-125";
                              } else if (isVisible) {
                                  // Highlight fully visible left nodes
                                  bgClass = `bg-${themeColor}-400 border-${themeColor}-600 text-white shadow-md z-20`;
                              } else if (isObscured) {
                                  // Gray out obscured nodes behind the left-most ones
                                  bgClass = "bg-slate-100 border-slate-300 text-slate-400 opacity-40 border-dashed z-10"; 
                              }

                              if (st.isSuccess) {
                                  if (isVisible) bgClass = `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-xl scale-110`;
                                  else bgClass = "bg-slate-100 border-slate-200 text-slate-300 opacity-20 border-dashed"; 
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* View Status Badge */}
                                      {!st.isSuccess && isVisible && !isActive && (
                                          <div className={`absolute -top-4 bg-${themeColor}-500 text-white rounded-md px-1.5 py-0.5 shadow-sm z-40 text-[7px] font-black font-mono tracking-widest whitespace-nowrap`}>
                                              VISIBLE
                                          </div>
                                      )}

                                      <div className={`w-12 h-12 flex flex-col items-center justify-center border-[3px] rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{String(node.val)}</span>
                                      </div>

                                      {/* Drop Shadow for Left Nodes */}
                                      {isVisible && !st.isSuccess && (
                                           <div className={`absolute w-full h-full bg-${themeColor}-500 blur-xl opacity-20 rounded-full z-[-1] -translate-x-2`}></div>
                                      )}
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Eye className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Left View of Binary Tree</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Depth Mapping
                  </span>
                  <span>•</span>
                  <span>GeeksForGeeks Classic</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory & Complexity" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview Tips" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 text-slate-700 space-y-12">
                
                {/* Full Problem Statement */}
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}>
                        <FileText size={28}/> Problem Statement
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-sm md:text-base leading-relaxed text-slate-700 shadow-inner">
                        <p className="mb-4">Given a Binary Tree, return its <strong>Left View</strong>. The left view of a binary tree is the set of nodes visible when the tree is viewed from the left side.</p>
                        
                        <p className="mb-4">Equivalently, you need to return the <strong>first node</strong> at every level of the tree, starting from the root down to the deepest leaf.</p>

                        <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 rounded-r-xl text-indigo-900 font-medium">
                            <span className="flex items-center gap-2 mb-2 font-bold text-indigo-700"><AlertTriangle size={18}/> Note on Subtrees:</span>
                            If a level does not have a node on the extreme left branch, but DOES have a node on a deeper right branch, that node WILL be visible from the left side.
                        </div>
                    </div>
                </section>
                
                <hr className="border-slate-200" />

                {/* Detailed Line of Sight Examples */}
                <section className="space-y-8">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}>
                        <Eye size={28}/> Line of Sight Examples
                    </div>

                    {/* Example 1 */}
                    <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-xl flex flex-col lg:flex-row border border-slate-800">
                        <div className="flex-1 p-6 md:p-8 space-y-6">
                            <div>
                                <h4 className={`text-${themeColor}-400 font-bold text-[10px] tracking-widest uppercase mb-2`}>Example 1: Standard Tree</h4>
                                <p className="text-slate-300 font-mono text-sm">Input: root = [1, 2, 3, null, 5, null, 4]</p>
                            </div>
                            <div>
                                <h4 className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-2">Output:</h4>
                                <p className="text-slate-300 font-mono text-sm">[1, 2, 5]</p>
                            </div>
                            <div>
                                <h4 className={`text-${themeColor}-400 font-bold text-[10px] tracking-widest uppercase mb-2`}>Explanation:</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Looking from the left side, the nodes visible are 1 at level 0, 2 at level 1, and 5 at level 2. Node 3 and 4 are completely blocked from view by 2 and 5 respectively.
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#1e293b] p-8 lg:w-80 flex items-center justify-center border-l border-slate-800 relative">
                            <div className="relative w-[200px] h-[160px]">
                                {/* SVG Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <line x1="100" y1="40" x2="60" y2="80" stroke="#475569" strokeWidth="2"/>
                                    <line x1="100" y1="40" x2="140" y2="80" stroke="#475569" strokeWidth="2"/>
                                    <line x1="60" y1="80" x2="100" y2="120" stroke="#475569" strokeWidth="2"/>
                                    <line x1="140" y1="80" x2="180" y2="120" stroke="#475569" strokeWidth="2"/>
                                </svg>
                                
                                {/* Nodes */}
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '100px', top: '40px'}}>1</div>
                                
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '60px', top: '80px'}}>2</div>
                                
                                <div className="absolute w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs z-10 -translate-x-1/2 -translate-y-1/2" style={{left: '140px', top: '80px'}}>3</div>
                                
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '100px', top: '120px'}}>5</div>
                                
                                <div className="absolute w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs z-10 -translate-x-1/2 -translate-y-1/2" style={{left: '180px', top: '120px'}}>4</div>
                                
                                {/* Eyes looking RIGHT */}
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '40px'}}/>
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '80px'}}/>
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '120px'}}/>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-[#0f172a] rounded-2xl overflow-hidden shadow-xl flex flex-col lg:flex-row border border-slate-800 mt-4">
                        <div className="flex-1 p-6 md:p-8 space-y-6">
                            <div>
                                <h4 className={`text-${themeColor}-400 font-bold text-[10px] tracking-widest uppercase mb-2`}>Example 2: Deep Right Branch</h4>
                                <p className="text-slate-300 font-mono text-sm">Input: root = [1, 2, 3, null, null, null, 4]</p>
                            </div>
                            <div>
                                <h4 className="text-emerald-400 font-bold text-[10px] tracking-widest uppercase mb-2">Output:</h4>
                                <p className="text-slate-300 font-mono text-sm">[1, 2, 4]</p>
                            </div>
                            <div>
                                <h4 className={`text-${themeColor}-400 font-bold text-[10px] tracking-widest uppercase mb-2`}>Explanation:</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">
                                    Even though 4 is on the far right side of the tree, it is the ONLY node that exists at level 2. Therefore, when looking from the left side, nothing blocks it! You will clearly see 1, then 2, then 4.
                                </p>
                            </div>
                        </div>
                        <div className="bg-[#1e293b] p-8 lg:w-80 flex items-center justify-center border-l border-slate-800 relative">
                            <div className="relative w-[200px] h-[160px]">
                                {/* SVG Lines */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                    <line x1="100" y1="40" x2="60" y2="80" stroke="#475569" strokeWidth="2"/>
                                    <line x1="100" y1="40" x2="140" y2="80" stroke="#475569" strokeWidth="2"/>
                                    <line x1="140" y1="80" x2="180" y2="120" stroke="#475569" strokeWidth="2"/>
                                </svg>
                                
                                {/* Nodes */}
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '100px', top: '40px'}}>1</div>
                                
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '60px', top: '80px'}}>2</div>
                                
                                <div className="absolute w-8 h-8 rounded-full border-2 border-slate-600 bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-xs z-10 -translate-x-1/2 -translate-y-1/2" style={{left: '140px', top: '80px'}}>3</div>
                                
                                <div className={`absolute w-8 h-8 rounded-full border-2 border-${themeColor}-500 bg-${themeColor}-500/20 text-${themeColor}-400 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(99,102,241,0.3)] z-10 -translate-x-1/2 -translate-y-1/2`} style={{left: '180px', top: '120px'}}>4</div>
                                
                                {/* Eyes looking RIGHT */}
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '40px'}}/>
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '80px'}}/>
                                <Eye size={16} className={`text-${themeColor}-500 absolute -translate-x-1/2 -translate-y-1/2`} style={{left: '10px', top: '120px'}}/>
                            </div>
                        </div>
                    </div>

                </section>
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3, null, 5..." />
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
                                <PartyPopper size={24}/> EXTRACTION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Left View successfully calculated.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' ? 'text-indigo-400' : (st.hlPhase === 'skipRes' ? 'text-rose-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Deep dive into Level Order constraints vs Pre-order Depth logic.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-5xl mx-auto">
                    
                    {/* Approach 1 */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-indigo-50 border-b border-indigo-100 p-6">
                            <h4 className="text-2xl font-black text-indigo-900 flex items-center gap-3"><LayersIcon size={28} className="text-indigo-500"/> Approach 1: BFS Level-by-Level Iteration</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                The most intuitive way to find the left-most node is to process the tree layer-by-layer using a <strong>Queue</strong>. 
                                We can capture the number of nodes currently in the queue (which represents an entire level) and loop exactly that many times.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Because we always enqueue the <code>left</code> child before the <code>right</code> child, the VERY FIRST node we extract during this inner loop <code>(where i == 0)</code> is guaranteed to be the left-most visible node for that level!
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Clock size={18} className="text-indigo-500"/> Time Complexity: <span className="text-indigo-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>Standard BFS touches each of the <code className="bg-slate-200 px-1 rounded">N</code> nodes exactly once.</li>
                                        <li>Checking <code>if (i == 0)</code> is an <code className="bg-slate-200 px-1 rounded">O(1)</code> operation.</li>
                                        <li>Overall Time Complexity is strictly bounded by <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Cpu size={18} className="text-indigo-500"/> Space Complexity: <span className="text-indigo-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>The Queue stores nodes level by level. In a full binary tree, the last level has <code className="bg-slate-200 px-1 rounded">N/2</code> nodes.</li>
                                        <li>The Result array stores exactly one node per level (bounded by <code className="bg-slate-200 px-1 rounded">H</code>, the height).</li>
                                        <li>Overall space is strictly bounded by <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-emerald-50 border-b border-emerald-100 p-6">
                            <h4 className="text-2xl font-black text-emerald-900 flex items-center gap-3"><ArrowRightToLine size={28} className="text-emerald-500"/> Approach 2: DFS Pre-order Traversal</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                We can achieve the exact same result recursively by keeping track of our current <code>depth</code>.
                                A standard Pre-order traversal explores the tree in this order: <strong>Root &rarr; Left Branch &rarr; Right Branch</strong>.
                            </p>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Because the recursion inherently dives all the way down the left side first, the first time we reach a new depth, we are standing on the left-most node! We know it's a new depth if <code>depth == ans.size()</code>.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Clock size={18} className="text-emerald-500"/> Time Complexity: <span className="text-emerald-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>DFS visits every node exactly once: <code className="bg-slate-200 px-1 rounded">O(N)</code>.</li>
                                        <li>Checking <code>ans.size()</code> and appending takes <code className="bg-slate-200 px-1 rounded">O(1)</code>.</li>
                                        <li>Total time is optimally bounded by <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Cpu size={18} className="text-emerald-500"/> Space Complexity: <span className="text-emerald-600 font-mono ml-1">O(H)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>The DFS recursive call stack goes as deep as the height of the tree: <code className="bg-slate-200 px-1 rounded">O(H)</code>.</li>
                                        <li>In the worst case (a skewed tree), height is <code className="bg-slate-200 px-1 rounded">N</code>, making it <code className="bg-slate-200 px-1 rounded">O(N)</code>.</li>
                                        <li>In a balanced tree, the stack only takes <strong>O(log N)</strong> memory, making DFS slightly more space-efficient than BFS!</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><HelpCircle size={36} className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>Left View is a highly popular entry-level graph traversal problem. It perfectly tests a candidate's understanding of how BFS layers and DFS call stacks manipulate data discovery.</p>
                </div>
                
                <div className="space-y-6 max-w-5xl mx-auto">
                    
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><ArrowRightToLine size={24}/></span>
                            <span>"How would you easily change your code to print the **Right View** of the Binary Tree instead?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It requires one tiny tweak in either approach."</p>
                            <p>"For <strong>BFS</strong>: Instead of checking <code>if (i == 0)</code> to grab the first node of the level, we check <code>if (i == size - 1)</code> to grab the very LAST node of the level loop!"</p>
                            <p>"For <strong>DFS</strong>: We simply swap the order of the recursive calls. Instead of traversing left then right, we traverse <code>dfs(node.right)</code> first, then <code>dfs(node.left)</code>. By visiting the right branches first, the first time we hit a new depth will naturally be the right-most node!"</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-sky-100 text-sky-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><LayersIcon size={24}/></span>
                            <span>"If the tree is completely unbalanced (like a linked list going straight right), which approach uses less memory?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The BFS approach uses less memory in a highly skewed tree."</p>
                            <p>"If the tree is a straight line, there is only 1 node per level. The BFS Queue will only ever hold a maximum of 1 node at any given time, giving it an auxiliary space complexity of <code>O(1)</code>. However, the DFS approach will plunge all the way to the bottom, creating a massive Call Stack of size <code>N</code>, resulting in <code>O(N)</code> space complexity."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><AlertTriangle size={24}/></span>
                            <span>"Why do we check 'depth == ans.size()' instead of passing a HashSet to track seen depths?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we are guaranteed to discover depths sequentially."</p>
                            <p>"Since we start at depth 0, we can't possibly jump to depth 2 without first passing through depth 1. Therefore, when we discover a new depth, the size of our answer array will exactly equal that depth (e.g., if we've found depths 0 and 1, the array size is 2. The next new depth we find will be 2). Using a HashSet would waste memory and add unnecessary <code>O(1)</code> hashing overhead."</p>
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
                  
                  <div className={`m-5 p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden shrink-0 ${st.isSuccess ? `bg-${themeColor}-900/40 border-${themeColor}-800` : 'bg-slate-800/40 border-slate-700'}`}>
                      <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                          <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                          <div className="flex gap-2 items-center">
                              <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                          </div>
                      </div>
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'addRes' ? `text-${themeColor}-400` : (st.hlPhase === 'skipRes' ? 'text-rose-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                      <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                  </div>

                  <div className="flex-1 overflow-x-hidden overflow-y-auto px-5 pb-10 relative scroll-smooth scrollbar-thin scrollbar-thumb-slate-700" ref={codeContainerFullscreenRef}>
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 relative">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {st.isSuccess === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm flex flex-col gap-4">
                           
                           {/* Call Stacks / Queues */}
                           <div className="flex gap-4">
                               <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'enqueue' || st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR') ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-2 flex items-center gap-2`}>
                                        <LayersIcon size={14} />
                                        {selectedOpId === 'dfsPreOrder' ? 'DFS Call Stack' : 'BFS Queue'}
                                    </span>
                                    
                                    {selectedOpId === 'dfsPreOrder' ? (
                                        <div className={`flex flex-col gap-1 max-h-[150px] overflow-auto scrollbar-none items-center justify-start`}>
                                            {st.stack?.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                                let isTop = idx === 0;
                                                return (
                                                    <div key={`fs-stk-${idx}`} className={`flex justify-between transition-all duration-300 shrink-0 border-2 rounded-lg px-4 py-1.5 font-mono text-xs font-black w-full ${isTop ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700 opacity-70`}`}>
                                                        <span>dfs({item.val})</span>
                                                        <span className="opacity-70 font-normal">(Depth: {item.depth})</span>
                                                    </div>
                                                );
                                            }) : <span className="text-slate-300 text-xs italic mt-2">Empty</span>}
                                        </div>
                                    ) : (
                                        <div className={`flex flex-row gap-2 min-h-[60px] overflow-auto scrollbar-none items-center justify-start px-2`}>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">OUT</span>
                                            {st.q && st.q.length > 0 ? st.q.map((item: any, idx: number) => {
                                                let isNew = idx === st.q.length - 1 && (st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR' || st.hlPhase === 'enqueue');

                                                return (
                                                    <div key={`fs-q-${idx}`} className={`flex items-center justify-center shrink-0 border-2 rounded-xl w-10 h-10 font-mono text-base font-black transition-all duration-300 ${isNew ? `bg-${themeColor}-400 border-${themeColor}-500 text-${themeColor}-950 scale-110 shadow-lg` : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                        {item.val}
                                                    </div>
                                                );
                                            }) : <span className="text-slate-300 text-xs italic">Empty</span>}
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0 ml-auto">IN</span>
                                        </div>
                                    )}
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
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 3, null, 4...' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-${themeColor}-500 shadow-[0_0_150px_rgba(14,165,233,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-${themeColor}-500`}></div>
                                
                                <div className={`w-24 h-24 bg-${themeColor}-500/20 text-${themeColor}-500 ring-${themeColor}-500/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    <Trophy size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EXTRACTION COMPLETE</h2>
                                <p className={`text-${themeColor}-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Left View Result</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center">
                                        [ {st.resList && st.resList.join(', ')} ]
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