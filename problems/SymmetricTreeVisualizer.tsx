import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, Network,
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, AlignVerticalSpaceAround,
  ZoomIn, ZoomOut, Maximize, GitMerge, SortAsc, LayoutGrid, Database,
  AlertTriangle, Clock, Cpu, HelpCircle, Target, SplitSquareHorizontal, GitCompare,
  CheckCircle2
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  recursiveDFS: {
    id: 'recursiveDFS',
    title: '1. Recursive DFS O(N)',
    icon: <GitCompare size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    theme: 'emerald',
    code: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        return isMirror(root.left, root.right);
    }
    
    private boolean isMirror(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null) return false;
        if (t1.val != t2.val) return false;
        
        return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);
    }
}`,
    desc: "The most elegant and standard approach. A tree is symmetric if the left subtree is a perfect mirror reflection of the right subtree. We use a helper function `isMirror(t1, t2)`. At every step, we verify that the current nodes match in structure and value. Then, we recursively check if the 'Outer' branches match (`t1.left` with `t2.right`) AND if the 'Inner' branches match (`t1.right` with `t2.left`)."
  },
  iterativeBFS: {
    id: 'iterativeBFS',
    title: '2. Iterative BFS O(N)',
    icon: <LayersIcon size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    public boolean isSymmetric(TreeNode root) {
        if (root == null) return true;
        
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root.left);
        q.offer(root.right);
        
        while (!q.isEmpty()) {
            TreeNode t1 = q.poll();
            TreeNode t2 = q.poll();
            
            if (t1 == null && t2 == null) continue;
            if (t1 == null || t2 == null) return false;
            if (t1.val != t2.val) return false;
            
            q.offer(t1.left);
            q.offer(t2.right);
            q.offer(t1.right);
            q.offer(t2.left);
        }
        return true;
    }
}`,
    desc: "A Breadth-First Search approach. We use a standard Queue, but we always push and poll nodes in perfectly mirrored pairs. We initialize the queue with the root's left and right children. In the loop, we pull out two nodes, verify they match, and then push their children in a specifically crossed sequence: Outer Pair (`t1.left`, `t2.right`) followed by Inner Pair (`t1.right`, `t2.left`)."
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

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|isSymmetric|isMirror|Solution|TreeNode|root|t1|t2|val|left|right|Queue|LinkedList|q|offer|poll|isEmpty|continue|null)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'null', 'continue'].includes(part);
            const isObject = ['String', 'Solution', 'TreeNode', 'Queue', 'LinkedList'].includes(part);
            const isPointer = ['root', 't1', 't2', 'val', 'left', 'right', 'q'].includes(part);
            const isMapCall = ['isSymmetric', 'isMirror', 'offer', 'poll', 'isEmpty'].includes(part);
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

export default function SymmetricTreeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('recursiveDFS');
  
  const [treeInput, setTreeInput] = useState('1, 2, 2, 3, 4, 4, 3');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 2, 2, 3, 4, 4, 3]);

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
      if (arr.length === 0) return [];
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
          return { root: null, nodes: [], edges: [], maxDepth: 0 };
      }
      
      let nodes: any[] = [];
      let edges: any[] = [];
      
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
              edges.push({ source: node.id, target: node.left.id, sx: node.x, sy: node.y + 28, tx: (minX + node.x)/2, ty: (depth+1)*80 - 28, isLeft: true });
              assignCoords(node.left, depth + 1, minX, node.x);
          }
          if (node.right) {
              edges.push({ source: node.id, target: node.right.id, sx: node.x, sy: node.y + 28, tx: (node.x + maxX)/2, ty: (depth+1)*80 - 28, isLeft: false });
              assignCoords(node.right, depth + 1, node.x, maxX);
          }
      };
      
      assignCoords(root, 0, -300, 300);

      return { root, nodes, edges, maxDepth: maxD };
  }, [baseTreeArr]);

  // Generate trace line-by-line
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root) {
        steps.push({ phase: 'Init', description: `Tree is empty. Symmetric by default.`, line: 3, state: { res: true } });
        return steps;
    }

    if (selectedOpId === 'recursiveDFS') {
        let callStack: { t1Id: number | null, t2Id: number | null }[] = [];
        
        const cloneStack = () => [...callStack];

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { stack: cloneStack(), ...st } 
        });

        add("Init", `public boolean isSymmetric(TreeNode root)`, 2, { hlPhase: 'init' });
        
        add("Check Root Null", `if (root == null) return true;\nRoot is not null.`, 3, { hlPhase: 'checkRoot' });

        add("Trigger Mirror", `return isMirror(root.left, root.right);\nKicking off mirrored traversal on left and right children.`, 4, { hlPhase: 'startMirror', t1Id: treeData.root.left ? treeData.root.left.id : null, t2Id: treeData.root.right ? treeData.root.right.id : null });

        const isMirror = (n1: any, n2: any): boolean => {
            if (steps.length > 2000) return false;

            let id1 = n1 ? n1.id : null;
            let id2 = n2 ? n2.id : null;
            let val1 = n1 ? String(n1.val) : 'null';
            let val2 = n2 ? String(n2.val) : 'null';

            callStack.push({ t1Id: id1, t2Id: id2 });
            
            add("Mirror Call", `private boolean isMirror(TreeNode t1, TreeNode t2)\nEvaluating t1 (${val1}) against t2 (${val2}).`, 7, { hlPhase: 'enter', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });

            add("Check Both Null", `if (t1 == null && t2 == null) return true;`, 8, { hlPhase: 'checkBoth', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (!n1 && !n2) {
                add("Return True", `Both branches hit null symmetrically. Local structural match!`, 8, { hlPhase: 'retTrue', t1Id: id1, t2Id: id2 });
                callStack.pop();
                return true;
            }

            add("Check One Null", `if (t1 == null || t2 == null) return false;`, 9, { hlPhase: 'checkOne', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (!n1 || !n2) {
                add("Return False", `One branch hit null while the other didn't. Structural mismatch!`, 9, { hlPhase: 'retFalse', t1Id: id1, t2Id: id2 });
                callStack.pop();
                return false;
            }

            add("Check Values", `if (t1.val != t2.val) return false;`, 10, { hlPhase: 'checkVal', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (n1.val !== n2.val) {
                add("Return False", `Values differ (${n1.val} != ${n2.val}). Value mismatch!`, 10, { hlPhase: 'retFalse', t1Id: id1, t2Id: id2 });
                callStack.pop();
                return false;
            }

            add("Recurse Outward & Inward", `return isMirror(t1.left, t2.right) && isMirror(t1.right, t2.left);\nNodes match! Recursing on Outer branches, then Inner branches.`, 12, { hlPhase: 'recurse', t1Id: id1, t2Id: id2 });

            let outerMatch = isMirror(n1.left, n2.right);
            if (!outerMatch) {
                add("Return False", `Outer branches mismatched. Short-circuiting.`, 12, { hlPhase: 'retFalse', t1Id: id1, t2Id: id2 });
                callStack.pop();
                return false;
            }

            let innerMatch = isMirror(n1.right, n2.left);

            let res = outerMatch && innerMatch;
            add("Return Result", `Both recursive calls returned ${res}. Passing result up.`, 12, { hlPhase: res ? 'retTrue' : 'retFalse', t1Id: id1, t2Id: id2 });
            
            callStack.pop();
            return res;
        };

        let finalAns = isMirror(treeData.root.left, treeData.root.right);
        add("Done", `Evaluation complete. Tree is ${finalAns ? 'Symmetric' : 'Asymmetric'}.`, 4, { hlPhase: 'success', isSuccess: true, finalAns });

    } else if (selectedOpId === 'iterativeBFS') {
        let q: { t1: any, t2: any }[] = [];
        
        const cloneQ = () => q.flatMap(pair => [
            { val: pair.t1 ? pair.t1.val : 'n', id: pair.t1 ? pair.t1.id : null },
            { val: pair.t2 ? pair.t2.val : 'n', id: pair.t2 ? pair.t2.id : null }
        ]);

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { q: cloneQ(), ...st } 
        });

        add("Init", `public boolean isSymmetric(TreeNode root)`, 2, { hlPhase: 'init' });
        
        add("Check Root Null", `if (root == null) return true;`, 3, { hlPhase: 'checkRoot' });

        add("Init Queue", `Queue<TreeNode> q = new LinkedList<>();`, 5, { hlPhase: 'initQ' });
        
        q.push({ t1: treeData.root.left, t2: treeData.root.right });
        add("Offer Root Children", `q.offer(root.left);\nq.offer(root.right);\nEnqueued the root's left and right children.`, 6, { hlPhase: 'enqueue', t1Id: treeData.root.left ? treeData.root.left.id : null, t2Id: treeData.root.right ? treeData.root.right.id : null });

        let finalAns = true;

        while (q.length > 0) {
            if (steps.length > 2500) break;

            add("While Loop", `while (!q.isEmpty()) {\nQueue has elements. Processing next pair.`, 9, { hlPhase: 'loop' });

            let pair = q.shift()!;
            let n1 = pair.t1;
            let n2 = pair.t2;

            let id1 = n1 ? n1.id : null;
            let id2 = n2 ? n2.id : null;
            let val1 = n1 ? String(n1.val) : 'null';
            let val2 = n2 ? String(n2.val) : 'null';

            add("Poll Pair", `TreeNode t1 = q.poll();\nTreeNode t2 = q.poll();\nPolled t1 (${val1}) and t2 (${val2}).`, 10, { hlPhase: 'poll', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });

            add("Check Both Null", `if (t1 == null && t2 == null) continue;`, 13, { hlPhase: 'checkBoth', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (!n1 && !n2) {
                add("Continue", `Both are null. Structural match. Skipping to next iteration.`, 13, { hlPhase: 'continue', t1Id: id1, t2Id: id2 });
                continue;
            }

            add("Check One Null", `if (t1 == null || t2 == null) return false;`, 14, { hlPhase: 'checkOne', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (!n1 || !n2) {
                add("Return False", `One is null, the other is not. Mismatch!`, 14, { hlPhase: 'retFalse', t1Id: id1, t2Id: id2 });
                finalAns = false;
                break;
            }

            add("Check Values", `if (t1.val != t2.val) return false;`, 15, { hlPhase: 'checkVal', t1Id: id1, t2Id: id2, v1: val1, v2: val2 });
            if (n1.val !== n2.val) {
                add("Return False", `Values differ. Mismatch!`, 15, { hlPhase: 'retFalse', t1Id: id1, t2Id: id2 });
                finalAns = false;
                break;
            }

            q.push({ t1: n1.left, t2: n2.right });
            add("Offer Outer Pair", `q.offer(t1.left);\nq.offer(t2.right);\nEnqueuing the OUTER branches for comparison later.`, 17, { hlPhase: 'enqueueOuter', t1Id: id1, t2Id: id2 });

            q.push({ t1: n1.right, t2: n2.left });
            add("Offer Inner Pair", `q.offer(t1.right);\nq.offer(t2.left);\nEnqueuing the INNER branches for comparison later.`, 19, { hlPhase: 'enqueueInner', t1Id: id1, t2Id: id2 });
        }

        if (finalAns) {
            add("Done", `return true;\nQueue emptied without mismatches. Tree is Symmetric!`, 22, { hlPhase: 'success', isSuccess: true, finalAns });
        } else {
            add("Done", `Mismatch found. Tree is Asymmetric!`, 15, { hlPhase: 'success', isSuccess: true, finalAns });
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

      let isEval = st.hlPhase === 'checkBoth' || st.hlPhase === 'checkOne' || st.hlPhase === 'checkVal';
      let isMismatch = st.hlPhase === 'retFalse';
      let isMatch = st.hlPhase === 'retTrue' || st.hlPhase === 'continue';

      let borderCol = isMismatch ? 'border-rose-400 ring-4 ring-rose-100' : (isMatch ? 'border-emerald-400 ring-4 ring-emerald-100' : `border-slate-200`);

      return (
          <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${borderCol} scale-105 z-40`}>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><SplitSquareHorizontal size={14}/> Symmetrical Node Monitor</span>
              
              <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 font-mono min-h-[80px] py-2 w-full animate-in fade-in zoom-in duration-300">
                  
                  {/* Node T1 (Left side conceptually) */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isEval || isMismatch || isMatch ? 'text-amber-500' : 'text-slate-400'}`}>Node T1</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isEval || isMismatch || isMatch ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.v1 !== undefined ? st.v1 : '?'}
                      </div>
                  </div>

                  {/* Comparator */}
                  {isEval || isMatch || isMismatch ? (
                      <div className="flex flex-col items-center mx-2 animate-in zoom-in">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-400`}>Comparator</span>
                          <div className={`text-2xl font-black ${isMismatch ? 'text-rose-500' : (isMatch ? 'text-emerald-500' : 'text-slate-400')} transition-colors`}>
                              {isMismatch ? '!=' : '=='}
                          </div>
                      </div>
                  ) : (
                      <div className="w-px h-12 bg-slate-200 hidden md:block mx-4"></div>
                  )}

                  {/* Node T2 (Right side conceptually) */}
                  <div className="flex flex-col items-center min-w-[80px]">
                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isEval || isMismatch || isMatch ? 'text-amber-500' : 'text-slate-400'}`}>Node T2</span>
                      <div className={`border-2 text-2xl font-black px-6 py-2 rounded-xl transition-all duration-300 ${isEval || isMismatch || isMatch ? 'bg-amber-50 border-amber-400 text-amber-800 shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700'}`}>
                          {st.v2 !== undefined ? st.v2 : '?'}
                      </div>
                  </div>

                  {/* Result/Action Arrow */}
                  {(isMismatch || isMatch || st.hlPhase === 'recurse' || st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner') && (
                      <ArrowRight size={24} className={`mx-2 ${isMismatch ? 'text-rose-500' : (isMatch ? 'text-emerald-500' : 'text-purple-500')} animate-in slide-in-from-left-2`}/>
                  )}
                  
                  {/* Action */}
                  {(isMismatch || isMatch) && (
                      <div className="flex flex-col items-center min-w-[100px] animate-in slide-in-from-right-4">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${isMismatch ? 'text-rose-500' : 'text-emerald-500'}`}>Result</span>
                          <div className={`border-2 text-xl font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm ${isMismatch ? 'bg-rose-100 border-rose-500 text-rose-900' : 'bg-emerald-100 border-emerald-500 text-emerald-900'}`}>
                              <span>{isMismatch ? 'FALSE' : 'TRUE'}</span>
                          </div>
                      </div>
                  )}

                  {(st.hlPhase === 'recurse' || st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner') && (
                      <div className="flex flex-col items-center min-w-[100px] animate-in slide-in-from-right-4">
                          <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-purple-500`}>Action</span>
                          <div className={`border-2 text-lg font-black px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm bg-purple-50 border-purple-400 text-purple-800`}>
                              <span>{st.hlPhase === 'enqueueOuter' ? 'ENQUEUE OUTER' : (st.hlPhase === 'enqueueInner' ? 'ENQUEUE INNER' : 'RECURSE DEEPER')}</span>
                          </div>
                      </div>
                  )}

              </div>
          </div>
      );
  }

  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && st.hlPhase !== 'init') return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      const containerSize = Math.max(350, treeData.maxDepth * 80 + 100);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Top: Active State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40 min-h-[140px]">
                  {renderActiveDashboard()}
              </div>

              {/* Data Trackers (Stacks / Queues) */}
              <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8 px-4 pointer-events-auto items-stretch justify-center mt-4">
                  <div className={`flex-1 flex flex-col bg-white p-4 rounded-2xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'enqueue' || st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner' ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'}`}>
                       <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-2 flex items-center gap-2`}>
                           <LayersIcon size={14} />
                           {selectedOpId === 'recursiveDFS' ? 'DFS Call Stack [t1, t2]' : 'BFS Queue [t1, t2]'}
                       </span>
                       
                       {selectedOpId === 'recursiveDFS' ? (
                           <div className={`flex flex-col gap-1 max-h-[150px] overflow-auto scrollbar-none items-center justify-start`}>
                               {st.stack?.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                   let n1Obj = treeData.nodes.find((n:any) => n.id === item.t1Id);
                                   let n2Obj = treeData.nodes.find((n:any) => n.id === item.t2Id);
                                   let v1 = n1Obj ? n1Obj.val : 'null';
                                   let v2 = n2Obj ? n2Obj.val : 'null';
                                   let isTop = idx === 0;
                                   
                                   return (
                                       <div key={`stk-${idx}`} className={`flex justify-center shrink-0 border-2 rounded-lg px-4 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                           isMirror({v1}, {v2})
                                       </div>
                                   );
                               }) : <span className="text-slate-300 text-xs italic mt-2">Empty</span>}
                           </div>
                       ) : (
                           <div className={`flex flex-row gap-2 min-h-[60px] overflow-auto scrollbar-none items-center justify-start px-2`}>
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">OUT</span>
                               {st.q && st.q.length > 0 ? Array.from({length: st.q.length/2}).map((_, idx) => {
                                   let item1 = st.q[idx*2];
                                   let item2 = st.q[idx*2 + 1];
                                   let isTop = idx === 0;
                                   let isNew = idx === (st.q.length/2) - 1 && (st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner' || st.hlPhase === 'enqueue');

                                   return (
                                       <div key={`q-${idx}`} className={`flex flex-col items-center justify-center shrink-0 border-2 rounded-xl px-3 py-1 font-mono text-sm font-black transition-all duration-300 ${isNew ? 'bg-amber-400 border-amber-500 text-amber-950 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                           <span>{item1.val}</span>
                                           <div className="w-4 border-b border-slate-300 my-0.5"></div>
                                           <span>{item2.val}</span>
                                       </div>
                                   );
                               }) : <span className="text-slate-300 text-xs italic">Empty</span>}
                               <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0 ml-auto">IN</span>
                           </div>
                       )}
                  </div>
              </div>

              {/* Graphical Visualizer (Tree Map) */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-white text-slate-700 border-slate-300 absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto flex items-center gap-1`}><SplitSquareHorizontal size={14}/> Symmetrical Plane</span>
                      
                      {/* Center Axis Line */}
                      <div className="absolute top-8 bottom-8 border-l-[3px] border-dashed border-sky-200 left-1/2 z-0 shadow-[0_0_15px_rgba(56,189,248,0.4)]"></div>

                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12 z-10">
                          <svg className="absolute top-0 left-0 overflow-visible" style={{ width: '1px', height: '1px' }}>
                              {treeData.edges.map((edge: any, idx: number) => {
                                  // Determine active edges for T1 and T2
                                  let isActive1 = (st.hlPhase === 'goLeft' || st.hlPhase === 'enqueueOuter' || st.hlPhase === 'recurse') && edge.source === st.t1Id;
                                  let isActive2 = (st.hlPhase === 'goRight' || st.hlPhase === 'enqueueInner' || st.hlPhase === 'recurse') && edge.source === st.t2Id;
                                  
                                  let strokeColor = '#cbd5e1'; 
                                  let strokeWidth = 2;
                                  let opacity = 0.6;

                                  if (isActive1 || isActive2) {
                                      strokeColor = '#a855f7'; // Purple for active evaluation paths
                                      strokeWidth = 4;
                                      opacity = 1;
                                  }

                                  return <line key={`edge-${idx}`} x1={edge.sx} y1={edge.sy} x2={edge.tx} y2={edge.ty} stroke={strokeColor} strokeWidth={strokeWidth} opacity={opacity} className="transition-all duration-300"/>
                              })}
                          </svg>

                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-20 overflow-visible">
                          {treeData.nodes.map((node: any) => {
                              let isT1 = st.t1Id === node.id && !st.isSuccess;
                              let isT2 = st.t2Id === node.id && !st.isSuccess;
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm";
                              let scaleClass = "scale-100";

                              if (isT1 || isT2) {
                                  bgClass = "bg-amber-100 border-amber-500 text-amber-900 shadow-xl ring-4 ring-amber-200 z-30";
                                  scaleClass = "scale-125";
                              } else if (node.x < 0) {
                                  bgClass = "bg-sky-50 border-sky-300 text-sky-700 opacity-90"; // Visual left hint
                              } else if (node.x > 0) {
                                  bgClass = "bg-emerald-50 border-emerald-300 text-emerald-700 opacity-90"; // Visual right hint
                              }

                              if (st.isSuccess) {
                                  bgClass = st.finalAns ? `bg-emerald-500 border-emerald-600 text-white shadow-lg` : `bg-rose-500 border-rose-600 text-white shadow-lg`;
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {isT1 && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -top-6 whitespace-nowrap bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce`}>
                                              T1
                                          </span>
                                      )}
                                      {isT2 && !st.isSuccess && (
                                          <span className={`text-[9px] font-black font-mono uppercase tracking-widest absolute -bottom-6 whitespace-nowrap bg-amber-500 text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce`}>
                                              T2
                                          </span>
                                      )}

                                      <div className={`w-12 h-12 sm:w-14 sm:h-14 flex flex-col items-center justify-center border-4 rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{String(node.val)}</span>
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
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Symmetric Tree</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dual-Pointer Traversal
                  </span>
                  <span>•</span>
                  <span>LeetCode 101</span>
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
                        <p className="mb-4">Given the <code>root</code> of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).</p>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl max-w-xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><LayoutGrid size={14}/> Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>
                            <li><code>-100 &le; Node.val &le; 100</code></li>
                        </ul>
                    </div>
                </section>
                
                <hr className="border-slate-200" />

                {/* Detailed Examples */}
                <section className="space-y-8">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}>
                        <Target size={28}/> Examples
                    </div>

                    {/* Example 1 */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                            <span>Example 1: Perfectly Symmetric</span>
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">Returns True</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [1,2,2,3,4,4,3]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> true</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>The left subtree of 1 is [2,3,4]. The right subtree is [2,4,3]. They are perfect structural and value-based mirror reflections of each other.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto text-center">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                <pre className={`text-${themeColor}-400 font-bold text-sm`}>
{`      1
     / \\
    2   2
   / \\ / \\
  3  4 4  3`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                            <span>Example 2: Structural Mismatch</span>
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded">Returns False</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [1,2,2,null,3,null,3]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> false</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>Even though the values (3) are the same, they are structurally skewed. The left 2 has a right child, but the right 2 ALSO has a right child. For perfect symmetry, the right 2 should have had a LEFT child.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto text-center">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                <pre className={`text-rose-400 font-bold text-sm`}>
{`      1
     / \\
    2   2
     \\   \\
      3   3`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                            <span>Example 3: Value Mismatch</span>
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded">Returns False</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [1,2,2,3,4,3,4]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> false</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>The structure is a perfect mirror, but the internal values do not align. The left node's right child (4) must mirror the right node's left child (which is 3). Because 4 != 3, symmetry fails.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto text-center">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Visualization:</span>
                                <pre className={`text-rose-400 font-bold text-sm`}>
{`      1
     / \\
    2   2
   / \\ / \\
  3  4 3  4`}
                                </pre>
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
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 2, 3, 4, 4, 3" />
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

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (st.finalAns ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.finalAns ? <CheckCircle2 size={24}/> : <XCircle size={24}/>}
                                EVALUATION COMPLETE
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Tree is {st.finalAns ? 'Symmetric' : 'Asymmetric'}.
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'retFalse' || st.hlPhase === 'checkOne' || st.hlPhase === 'checkVal' ? 'text-rose-400' : (st.hlPhase === 'retTrue' || st.hlPhase === 'continue' || st.hlPhase === 'checkBoth' ? 'text-emerald-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Deep dive into Dual-Pointer Traversals and Mirroring Logic.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-5xl mx-auto">
                    
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-emerald-50 border-b border-emerald-100 p-6">
                            <h4 className="text-2xl font-black text-emerald-900 flex items-center gap-3"><GitCompare size={28} className="text-emerald-500"/> Symmetric Tree vs Same Tree</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                This problem is an immediate successor to LeetCode 100: Same Tree. The core mechanics are identical, but the recursive routing is intentionally crossed.
                            </p>
                            
                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800">Same Tree (Parallel Logic)</h5>
                                    <p className="text-sm text-slate-600 mb-4">You compare the left child of Tree 1 with the left child of Tree 2. Everything stays on the same side.</p>
                                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                                        return isSame(p.left, q.left) &&<br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isSame(p.right, q.right);
                                    </div>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800">Symmetric Tree (Mirrored Logic)</h5>
                                    <p className="text-sm text-slate-600 mb-4">You compare the left child of T1 with the right child of T2. Everything crosses the center axis.</p>
                                    <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm shadow-inner">
                                        return isMirror(t1.left, t2.right) &&<br/>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;isMirror(t1.right, t2.left);
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-sky-50 border-b border-sky-100 p-6">
                            <h4 className="text-2xl font-black text-sky-900 flex items-center gap-3"><LayersIcon size={28} className="text-sky-500"/> Time & Space Complexity Breakdown</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6 pt-2">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Clock size={18} className="text-sky-500"/> Time Complexity: <span className="text-sky-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>Whether using Recursive DFS or Iterative BFS, we must potentially touch every node in the tree to verify perfect symmetry.</li>
                                        <li>If a mismatch is found early, both algorithms will short-circuit and return false immediately, operating in best-case <code className="bg-slate-200 px-1 rounded">O(1)</code>.</li>
                                        <li>However, if the tree is completely symmetric, we traverse all <code className="bg-slate-200 px-1 rounded">N</code> nodes. Total Time is strictly bounded by <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Cpu size={18} className="text-sky-500"/> Space Complexity: <span className="text-sky-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>For the <strong>Recursive DFS</strong>, the recursion call stack will go as deep as the tree height. In the worst case (a highly skewed zig-zag tree that manages to be symmetric), this is bounded by <code className="bg-slate-200 px-1 rounded">O(N)</code>. In a balanced tree, it is <code className="bg-slate-200 px-1 rounded">O(log N)</code>.</li>
                                        <li>For the <strong>Iterative BFS</strong>, the Queue stores nodes level by level. The widest level of a binary tree contains roughly <code className="bg-slate-200 px-1 rounded">N/2</code> nodes, which simplifies to <strong>O(N)</strong> auxiliary space.</li>
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
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>This is a classic FAANG problem (LeetCode 101 - Easy/Medium). It tests your ability to think about Dual-Pointer Tree traversals and how to accurately manipulate both recursive call stacks and iterative queues.</p>
                </div>
                
                <div className="space-y-6 max-w-5xl mx-auto">
                    
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><AlertTriangle size={24}/></span>
                            <span>"Can you solve this Iteratively? If so, why is pushing 'null' into the Queue necessary?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Yes, using Breadth-First Search."</p>
                            <p>"Pushing <code>null</code> into the Queue is absolutely critical because we are checking for <strong>structural</strong> symmetry, not just value equality. If we ignored nulls, a tree like <code>[1,2,2,null,3,null,3]</code> would have a queue that looks perfectly symmetrical (pulling 3 and 3), but it's structurally asymmetric. By explicitly queuing nulls, we preserve the exact physical geometry of the branches to catch missing limbs."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-sky-100 text-sky-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><Database size={24}/></span>
                            <span>"Why do we check 't1 == null && t2 == null' before checking 't1 == null || t2 == null'?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "It's standard short-circuit logic."</p>
                            <p>"If both are null, the branches ended symmetrically. We return <code>true</code> (or <code>continue</code> in BFS). If we don't catch that state first, the next line <code>t1 == null || t2 == null</code> would catch it and incorrectly return <code>false</code>, claiming an asymmetry when there actually is a perfect match of empty branches!"</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-purple-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-purple-100 text-purple-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><Code2 size={24}/></span>
                            <span>"Which approach is safer in a massive production system?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The Iterative BFS approach using a Queue."</p>
                            <p>"In production, you cannot predict the shape of the data. If a massive, skewed tree is passed in, the Recursive DFS approach will cause a <code>StackOverflowError</code> and crash the entire JVM because the internal Call Stack limit is quite small (usually ~1MB). The Iterative approach places the Queue on the Heap memory (which is Gigabytes large), making it virtually immune to deep recursion crashes."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'retFalse' || st.hlPhase === 'checkOne' || st.hlPhase === 'checkVal' ? 'text-rose-400' : (st.hlPhase === 'retTrue' || st.hlPhase === 'continue' || st.hlPhase === 'checkBoth' ? 'text-emerald-400' : (st.hlPhase === 'enter' || st.hlPhase === 'poll' ? `text-amber-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
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
                  
                  {st.isSuccess === undefined && (
                      <div className="absolute bottom-10 left-10 z-50 pointer-events-auto animate-in slide-in-from-bottom-10 w-full max-w-sm flex flex-col gap-4">
                           
                           {/* Call Stacks / Queues */}
                           <div className="flex gap-4">
                               <div className={`flex-1 flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'poll' || st.hlPhase === 'enqueue' || st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner') ? 'border-amber-300 ring-2 ring-amber-50' : 'border-slate-200'}`}>
                                    <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 border-b pb-2 flex items-center gap-2`}>
                                        <LayersIcon size={14} />
                                        {selectedOpId === 'recursiveDFS' ? 'DFS Call Stack [t1, t2]' : 'BFS Queue [t1, t2]'}
                                    </span>
                                    
                                    {selectedOpId === 'recursiveDFS' ? (
                                        <div className={`flex flex-col gap-1 max-h-[150px] overflow-auto scrollbar-none items-center justify-start`}>
                                            {st.stack?.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                                let n1Obj = treeData.nodes.find((n:any) => n.id === item.t1Id);
                                                let n2Obj = treeData.nodes.find((n:any) => n.id === item.t2Id);
                                                let v1 = n1Obj ? n1Obj.val : 'null';
                                                let v2 = n2Obj ? n2Obj.val : 'null';
                                                let isTop = idx === 0;
                                                
                                                return (
                                                    <div key={`fs-stk-${idx}`} className={`flex justify-center shrink-0 border-2 rounded-lg px-4 py-1.5 font-mono text-xs font-black ${isTop ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                                                        isMirror({v1}, {v2})
                                                    </div>
                                                );
                                            }) : <span className="text-slate-300 text-xs italic mt-2">Empty</span>}
                                        </div>
                                    ) : (
                                        <div className={`flex flex-row gap-2 min-h-[60px] overflow-auto scrollbar-none items-center justify-start px-2`}>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">OUT</span>
                                            {st.q && st.q.length > 0 ? Array.from({length: st.q.length/2}).map((_, idx) => {
                                                let item1 = st.q[idx*2];
                                                let item2 = st.q[idx*2 + 1];
                                                let isNew = idx === (st.q.length/2) - 1 && (st.hlPhase === 'enqueueOuter' || st.hlPhase === 'enqueueInner' || st.hlPhase === 'enqueue');

                                                return (
                                                    <div key={`fs-q-${idx}`} className={`flex flex-col items-center justify-center shrink-0 border-2 rounded-xl px-3 py-1 font-mono text-sm font-black transition-all duration-300 ${isNew ? 'bg-amber-400 border-amber-500 text-amber-950 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                        <span>{item1.val}</span>
                                                        <div className="w-4 border-b border-slate-300 my-0.5"></div>
                                                        <span>{item2.val}</span>
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
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 2...' />
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
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.finalAns ? 'border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]' : 'border-rose-500 shadow-[0_0_150px_rgba(243,63,94,0.3)]'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.finalAns ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                
                                <div className={`w-24 h-24 ${st.finalAns ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'} rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4`}>
                                    {st.finalAns ? <CheckCircle2 size={48}/> : <XCircle size={48}/>}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">EVALUATION COMPLETE</h2>
                                <p className={`${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} font-mono text-xs uppercase mb-8 tracking-widest opacity-60`}>Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className={`${st.finalAns ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest mb-2`}>Final Result</div>
                                    <div className={`font-mono ${st.finalAns ? 'text-emerald-400' : 'text-rose-400'} text-5xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center`}>
                                        {st.finalAns ? 'Symmetric Tree' : 'Asymmetric Tree'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.finalAns ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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