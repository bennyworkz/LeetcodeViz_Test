import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, Network,
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, AlignVerticalSpaceAround,
  ZoomIn, ZoomOut, Maximize, GitMerge, SortAsc, LayoutGrid, Database,
  AlertTriangle, Clock, Cpu, HelpCircle, Target
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  bfsTreeMap: {
    id: 'bfsTreeMap',
    title: '1. BFS + TreeMap O(N log N)',
    icon: <Database size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'sky',
    code: `class Solution {
    class Tuple {
        TreeNode node;
        int row;
        int col;
        public Tuple(TreeNode _node, int _row, int _col) {
            node = _node; row = _row; col = _col;
        }
    }
    
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        // TreeMap maps Column -> (Row -> PriorityQueue of Values)
        TreeMap<Integer, TreeMap<Integer, PriorityQueue<Integer>>> map = new TreeMap<>();
        Queue<Tuple> q = new LinkedList<>();
        
        q.offer(new Tuple(root, 0, 0));
        
        while (!q.isEmpty()) {
            Tuple tuple = q.poll();
            TreeNode node = tuple.node;
            int row = tuple.row;
            int col = tuple.col;
            
            // Insert node value into our nested Map
            map.putIfAbsent(col, new TreeMap<>());
            map.get(col).putIfAbsent(row, new PriorityQueue<>());
            map.get(col).get(row).offer(node.val);
            
            // Traverse Left (col - 1, row + 1)
            if (node.left != null) {
                q.offer(new Tuple(node.left, row + 1, col - 1));
            }
            // Traverse Right (col + 1, row + 1)
            if (node.right != null) {
                q.offer(new Tuple(node.right, row + 1, col + 1));
            }
        }
        
        // Compile the result from the sorted TreeMap
        List<List<Integer>> list = new ArrayList<>();
        for (TreeMap<Integer, PriorityQueue<Integer>> rows : map.values()) {
            list.add(new ArrayList<>());
            for (PriorityQueue<Integer> nodes : rows.values()) {
                while (!nodes.isEmpty()) {
                    list.get(list.size() - 1).add(nodes.poll());
                }
            }
        }
        return list;
    }
}`,
    desc: "The industry standard approach. We use Breadth-First Search (BFS) to traverse the tree layer by layer. We keep track of the (row, col) coordinates. We use a nested `TreeMap` where the outer map sorts the columns (Left to Right), and the inner map sorts the rows (Top to Bottom). If two nodes land on the exact same spot, the `PriorityQueue` sorts them by value!"
  },
  dfsSorting: {
    id: 'dfsSorting',
    title: '2. DFS + Flat Sorting O(N log N)',
    icon: <SortAsc size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'emerald',
    code: `class Solution {
    class Tuple implements Comparable<Tuple> {
        TreeNode node;
        int row;
        int col;
        public Tuple(TreeNode _node, int _row, int _col) {
            node = _node; row = _row; col = _col;
        }
        
        @Override
        public int compareTo(Tuple other) {
            if (this.col != other.col) 
                return Integer.compare(this.col, other.col);
            if (this.row != other.row) 
                return Integer.compare(this.row, other.row);
            return Integer.compare(this.node.val, other.node.val);
        }
    }
    
    List<Tuple> nodes = new ArrayList<>();
    
    public List<List<Integer>> verticalTraversal(TreeNode root) {
        // 1. Collect all nodes with their coordinates
        dfs(root, 0, 0);
        
        // 2. Sort all nodes using our custom Compare method
        Collections.sort(nodes);
        
        // 3. Extract grouped values
        List<List<Integer>> res = new ArrayList<>();
        Integer currCol = null;
        
        for (Tuple t : nodes) {
            if (currCol == null || t.col != currCol) {
                currCol = t.col;
                res.add(new ArrayList<>());
            }
            res.get(res.size() - 1).add(t.node.val);
        }
        
        return res;
    }
    
    private void dfs(TreeNode node, int row, int col) {
        if (node == null) return;
        
        nodes.add(new Tuple(node, row, col));
        
        dfs(node.left, row + 1, col - 1);
        dfs(node.right, row + 1, col + 1);
    }
}`,
    desc: "A highly intuitive alternative! Instead of maintaining complex nested TreeMaps and PriorityQueues during traversal, we simply run a basic DFS to tag every node with its (row, col) coordinates and dump them into a flat List. Then, we execute a single `Collections.sort()` with a custom comparator: Sort by Col -> Sort by Row -> Sort by Value. Finally, we group them by column."
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
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|char|boolean|class|return|if|else|while|for|new|String|verticalTraversal|dfs|compareTo|offer|poll|putIfAbsent|get|add|values|isEmpty|compare|compareTo|size|Sort|Collections|List|ArrayList|LinkedList|Queue|TreeMap|PriorityQueue|Tuple|Solution|TreeNode|root|node|row|col|_node|_row|_col|other|currCol|res|list|map|q|nodes)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
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
            
            const isKeyword = ['public', 'private', 'void', 'int', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new', 'null', '@Override'].includes(part);
            const isObject = ['String', 'Solution', 'TreeNode', 'ArrayList', 'List', 'Tuple', 'TreeMap', 'PriorityQueue', 'Queue', 'LinkedList', 'Collections', 'Integer'].includes(part);
            const isPointer = ['root', 'node', 'val', 'left', 'right', 'row', 'col', 'currCol', 'map', 'q', 'res', 'list', 'nodes', 'other', 't', '_node', '_row', '_col'].includes(part);
            const isMapCall = ['verticalTraversal', 'dfs', 'compareTo', 'offer', 'poll', 'putIfAbsent', 'get', 'add', 'values', 'isEmpty', 'compare', 'size', 'sort'].includes(part);
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

export default function VerticalOrderVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('bfsTreeMap');
  
  // Example tree with overlap: 1, 2, 3, 4, 5, 6, 7
  // node 5 is at 0,2. node 6 is at 0,2. They will overlap and sorting matters!
  const [treeInput, setTreeInput] = useState('1, 2, 3, 4, 6, 5, 7');
  
  const [baseTreeArr, setBaseTreeArr] = useState<(number | null)[]>([1, 2, 3, 4, 6, 5, 7]);

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
      if (arr.length === 0) arr = [1, 2, 3, 4, 6, 5, 7];
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

  // Build Tree Geometry + Coordinates
  const treeData = useMemo(() => {
      if (baseTreeArr.length === 0 || baseTreeArr[0] === null || baseTreeArr[0] === undefined) {
          return { root: null, nodes: [], edges: [], maxDepth: 0, logicalCols: new Set<number>() };
      }
      
      let nodes: any[] = [];
      let edges: any[] = [];
      let logicalCols = new Set<number>();
      
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
      const positionMap: Record<string, number> = {};

      const assignCoords = (node: any, depth: number, col: number) => {
          if (!node) return;
          if (depth > maxD) maxD = depth;
          logicalCols.add(col);
          
          node.logicalCol = col;
          node.logicalRow = depth;
          
          // Compute visual displacement if multiple nodes share the same (col, row)
          const key = `${col},${depth}`;
          const count = positionMap[key] || 0;
          positionMap[key] = count + 1;

          // Visual coordinates. Space columns by 70px.
          // Shift slightly diagonally if multiple nodes overlap perfectly
          node.x = col * 70 + (count * 15);
          node.y = depth * 80 + (count * 15);
          
          node.isOverlapping = count > 0; // flag for visual UI tweaks

          nodes.push(node);

          if (node.left) {
              edges.push({ source: node.id, target: node.left.id, isLeft: true });
              assignCoords(node.left, depth + 1, col - 1);
          }
          if (node.right) {
              edges.push({ source: node.id, target: node.right.id, isLeft: false });
              assignCoords(node.right, depth + 1, col + 1);
          }
      };
      
      assignCoords(root, 0, 0);

      // Update edges with precise coordinates after nodes are placed
      edges.forEach(e => {
          let s = nodes.find(n => n.id === e.source);
          let t = nodes.find(n => n.id === e.target);
          e.sx = s.x; e.sy = s.y + 24; // offset from center
          e.tx = t.x; e.ty = t.y - 24;
      });

      return { root, nodes, edges, maxDepth: maxD, logicalCols };
  }, [baseTreeArr]);

  // Generate trace line-by-line
  const trace = useMemo(() => {
    const steps: any[] = [];
    if (!treeData.root) {
        steps.push({ phase: 'Init', description: `Tree is empty.`, line: 11, state: { res: [], map: {} } });
        return steps;
    }

    if (selectedOpId === 'bfsTreeMap') {
        let map: Record<number, Record<number, number[]>> = {};
        let q: { node: any, row: number, col: number }[] = [];
        let list: number[][] = [];
        
        const cloneMap = () => JSON.parse(JSON.stringify(map));
        const cloneQ = () => q.map(i => ({ val: i.node.val, row: i.row, col: i.col, id: i.node.id }));
        const cloneList = () => JSON.parse(JSON.stringify(list));

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { map: cloneMap(), q: cloneQ(), resList: cloneList(), ...st } 
        });

        add("Init Map", `TreeMap<Integer, TreeMap<Integer, PriorityQueue<Integer>>> map = new TreeMap<>();\nInitializing the outer TreeMap to map Columns to Rows.`, 13, { hlPhase: 'init' });
        add("Init Queue", `Queue<Tuple> q = new LinkedList<>();\nInitializing the BFS Queue.`, 14, { hlPhase: 'init' });
        
        q.push({ node: treeData.root, row: 0, col: 0 });
        add("Enqueue Root", `q.offer(new Tuple(root, 0, 0));\nPlacing the root node (${treeData.root.val}) into the queue at origin (0, 0).`, 16, { hlPhase: 'enqueue', currNodeId: treeData.root.id });

        while (q.length > 0) {
            if (steps.length > 2500) break;

            add("Check Queue", `while (!q.isEmpty()) {\nChecking if queue has elements. (Current size: ${q.length})`, 18, { hlPhase: 'checkQueue' });

            let curr = q.shift()!;
            add("Poll Queue", `Tuple tuple = q.poll();\nExtracting the next Tuple from the front of the queue.`, 19, { hlPhase: 'poll', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });
            
            add("Extract Node Data", `TreeNode node = tuple.node;\nUnpacking Node ${curr.node.val}, Row ${curr.row}, Col ${curr.col}.`, 20, { hlPhase: 'extract', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });

            if (!map[curr.col]) {
                map[curr.col] = {};
                add("Ensure Col Map Exists", `map.putIfAbsent(col, new TreeMap<>());\nColumn ${curr.col} not seen before. Creating inner TreeMap for rows.`, 25, { hlPhase: 'mapPutCol', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });
            } else {
                add("Ensure Col Map Exists", `map.putIfAbsent(col, new TreeMap<>());\nColumn ${curr.col} already exists in map. Proceeding.`, 25, { hlPhase: 'mapPutCol', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });
            }

            if (!map[curr.col][curr.row]) {
                map[curr.col][curr.row] = [];
                add("Ensure Row PQ Exists", `map.get(col).putIfAbsent(row, new PriorityQueue<>());\nRow ${curr.row} in Col ${curr.col} not seen before. Creating PriorityQueue.`, 26, { hlPhase: 'mapPutRow', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });
            } else {
                add("Ensure Row PQ Exists", `map.get(col).putIfAbsent(row, new PriorityQueue<>());\nRow ${curr.row} in Col ${curr.col} already exists. Proceeding.`, 26, { hlPhase: 'mapPutRow', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });
            }
            
            // Add and simulate Priority Queue sorting
            map[curr.col][curr.row].push(curr.node.val);
            map[curr.col][curr.row].sort((a,b) => a - b);
            
            add("Insert into PriorityQueue", `map.get(col).get(row).offer(node.val);\nInserted value ${curr.node.val}. PriorityQueue automatically sorts it ascending!`, 27, { hlPhase: 'mapPut', currNodeId: curr.node.id, cCol: curr.col, cRow: curr.row });

            add("Check Left Child", `if (node.left != null)\nChecking if Node ${curr.node.val} has a left child.`, 30, { hlPhase: 'checkLeft', currNodeId: curr.node.id });
            if (curr.node.left) {
                q.push({ node: curr.node.left, row: curr.row + 1, col: curr.col - 1 });
                add("Enqueue Left", `q.offer(new Tuple(node.left, row + 1, col - 1));\nEnqueued left child ${curr.node.left.val} at (Col: ${curr.col - 1}, Row: ${curr.row + 1}).`, 31, { hlPhase: 'enqueueL', currNodeId: curr.node.id, childId: curr.node.left.id, cCol: curr.col - 1, cRow: curr.row + 1 });
            }

            add("Check Right Child", `if (node.right != null)\nChecking if Node ${curr.node.val} has a right child.`, 34, { hlPhase: 'checkRight', currNodeId: curr.node.id });
            if (curr.node.right) {
                q.push({ node: curr.node.right, row: curr.row + 1, col: curr.col + 1 });
                add("Enqueue Right", `q.offer(new Tuple(node.right, row + 1, col + 1));\nEnqueued right child ${curr.node.right.val} at (Col: ${curr.col + 1}, Row: ${curr.row + 1}).`, 35, { hlPhase: 'enqueueR', currNodeId: curr.node.id, childId: curr.node.right.id, cCol: curr.col + 1, cRow: curr.row + 1 });
            }
        }

        add("Queue Empty", `while (!q.isEmpty()) {\nQueue is now empty. Traversal phase complete.`, 18, { hlPhase: 'queueEmpty' });

        add("Compilation Start", `List<List<Integer>> list = new ArrayList<>();\nInitializing the final 2D array list.`, 40, { hlPhase: 'compileStart' });

        let sortedCols = Object.keys(map).map(Number).sort((a,b) => a - b);
        for (let c of sortedCols) {
            add("Iterate Columns", `for (TreeMap<Integer, PriorityQueue<Integer>> rows : map.values())\nOuter map values are naturally sorted by Column. Moving to Column ${c}.`, 41, { hlPhase: 'compileColIter', hlCol: c });
            
            let colGroup: number[] = [];
            list.push(colGroup);
            add("New Col List", `list.add(new ArrayList<>());\nAppended a new empty array to represent Column ${c}.`, 42, { hlPhase: 'compileCol', hlCol: c });
            
            let sortedRows = Object.keys(map[c]).map(Number).sort((a,b) => a - b);
            for (let r of sortedRows) {
                add("Iterate Rows in Col", `for (PriorityQueue<Integer> nodes : rows.values())\nInner map values are naturally sorted by Row. Moving to Row ${r}.`, 43, { hlPhase: 'compileRowIter', hlCol: c, hlRow: r });
                
                let pq = [...map[c][r]];
                for (let i = 0; i < pq.length; i++) {
                    add("Check PQ Empty", `while (!nodes.isEmpty())\nPriorityQueue at Col ${c}, Row ${r} has elements.`, 44, { hlPhase: 'compileValsCheck', hlCol: c, hlRow: r });
                    
                    let val = pq[i];
                    colGroup.push(val);
                    add("Drain PQ", `list.get(list.size() - 1).add(nodes.poll());\nPolled ${val} from PriorityQueue and appended to Column ${c}'s list.`, 45, { hlPhase: 'compileVals', hlCol: c, hlRow: r });
                }
                add("PQ Empty", `while (!nodes.isEmpty())\nPriorityQueue is now empty.`, 44, { hlPhase: 'compileValsDone', hlCol: c, hlRow: r });
            }
        }

        add("Done", `return list;\nNested map fully drained. Vertical Traversal Complete!`, 49, { hlPhase: 'success', isSuccess: true });
    }
    else if (selectedOpId === 'dfsSorting') {
        let flatNodes: { val: number, id: number, row: number, col: number }[] = [];
        let callStack: { val: number, id: number, row: number, col: number }[] = [];
        let list: number[][] = [];
        
        const cloneFlat = () => [...flatNodes];
        const cloneStack = () => [...callStack];
        const cloneList = () => JSON.parse(JSON.stringify(list));

        const add = (ph: string, ds: string, ln: number, st: any = {}) => steps.push({ 
            phase: ph, description: ds, line: ln, state: { flatNodes: cloneFlat(), stack: cloneStack(), resList: cloneList(), ...st } 
        });

        add("Init Nodes List", `List<Tuple> nodes = new ArrayList<>();\nInitializing the flat array list that will hold every node.`, 20, { hlPhase: 'init' });
        add("Call DFS", `dfs(root, 0, 0);\nKicking off the Depth-First Search at root with (row 0, col 0).`, 24, { hlPhase: 'init' });

        const dfs = (node: any, row: number, col: number) => {
            if (steps.length > 2000) return;
            
            add("Check Null", `if (node == null) return;\nChecking if current pointer is null.`, 45, { hlPhase: 'dfsCheck' });
            if (!node) {
                add("DFS Null", `return;\nPointer is null, backtracking...`, 45, { hlPhase: 'dfsNull' });
                return;
            }

            callStack.push({ val: node.val, id: node.id, row, col });
            add("DFS Entry", `private void dfs(TreeNode node, int row, int col)\nEntered node ${node.val} at (col: ${col}, row: ${row}).`, 44, { hlPhase: 'enter', currNodeId: node.id, cCol: col, cRow: row });

            flatNodes.push({ val: node.val, id: node.id, row, col });
            add("Record Node", `nodes.add(new Tuple(node, row, col));\nInstantiated new Tuple and added ${node.val} to the flat list.`, 47, { hlPhase: 'record', currNodeId: node.id, cCol: col, cRow: row });

            add("Traverse Left", `dfs(node.left, row + 1, col - 1);\nDescending to left child (Row + 1, Col - 1).`, 49, { hlPhase: 'goLeft', currNodeId: node.id, childId: node.left ? node.left.id : null, cCol: col, cRow: row });
            dfs(node.left, row + 1, col - 1);

            add("Traverse Right", `dfs(node.right, row + 1, col + 1);\nDescending to right child (Row + 1, Col + 1).`, 50, { hlPhase: 'goRight', currNodeId: node.id, childId: node.right ? node.right.id : null, cCol: col, cRow: row });
            dfs(node.right, row + 1, col + 1);

            callStack.pop();
            add("Return", `Finished processing node ${node.val}. Removing from call stack.`, 51, { hlPhase: 'exit', currNodeId: node.id });
        };

        dfs(treeData.root, 0, 0);
        add("DFS Complete", `dfs(root, 0, 0);\nDFS traversal has fully completed. Flat list contains all nodes.`, 24, { hlPhase: 'dfsComplete' });

        add("Sort Collection", `Collections.sort(nodes);\nCalling custom sorting comparator. Sorting by Col ASC -> Row ASC -> Value ASC.`, 27, { hlPhase: 'sortStart' });
        
        // Simulate sorting
        flatNodes.sort((a,b) => {
            if (a.col !== b.col) return a.col - b.col;
            if (a.row !== b.row) return a.row - b.row;
            return a.val - b.val;
        });
        
        add("Sorting Complete", `Collections.sort(nodes);\nFlat list is now perfectly ordered!`, 27, { hlPhase: 'sortDone' });

        add("Init Result List", `List<List<Integer>> res = new ArrayList<>();\nCreating the 2D array to return.`, 30, { hlPhase: 'extractInit' });
        add("Init currCol", `Integer currCol = null;\nUsing currCol to track when we shift to a new column.`, 31, { hlPhase: 'extractInit' });

        let currCol: number | null = null;
        for (let i = 0; i < flatNodes.length; i++) {
            let t = flatNodes[i];
            
            add("Iterate Nodes", `for (Tuple t : nodes)\nIterating through sorted list. Currently observing node ${t.val} (Col: ${t.col}).`, 33, { hlPhase: 'checkGroup', flatIdx: i, hlCol: t.col });

            add("Check Col Change", `if (currCol == null || t.col != currCol)\nDoes this node belong to a new column?`, 34, { hlPhase: 'checkGroup', flatIdx: i, hlCol: t.col });
            if (currCol === null || t.col !== currCol) {
                currCol = t.col;
                add("Update currCol", `currCol = t.col;\nYes! Updating tracking pointer to Col ${currCol}.`, 35, { hlPhase: 'newGroup', flatIdx: i, hlCol: t.col });
                
                list.push([]);
                add("Add New List", `res.add(new ArrayList<>());\nAppended a new empty array for Column ${currCol}.`, 36, { hlPhase: 'newGroup', flatIdx: i, hlCol: t.col });
            }

            list[list.length - 1].push(t.val);
            add("Append to Result", `res.get(res.size() - 1).add(t.node.val);\nAdded ${t.val} to the active column group.`, 38, { hlPhase: 'appendVal', flatIdx: i, hlCol: t.col });
        }

        add("Done", `return res;\nVertical Traversal Complete!`, 41, { hlPhase: 'success', isSuccess: true });
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


  const renderVisuals = () => {
      if (treeData.nodes.length === 0 && st.hlPhase !== 'init') return <span className="text-slate-400 italic mt-10">Processing Tree...</span>;

      const containerSize = Math.max(350, treeData.maxDepth * 80 + 100);
      
      // Calculate background vertical lines based on logicalCols
      const cols = Array.from(treeData.logicalCols as Set<number>).sort((a,b) => a-b);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Dynamic State Dashboards specific to algorithm */}
              {selectedOpId === 'bfsTreeMap' && (
                  <div className="w-full max-w-6xl pointer-events-auto z-40 flex gap-4 px-4">
                      {/* Left side: Queue */}
                      <div className={`flex-[1] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'enqueue' || st.hlPhase === 'enqueueL' || st.hlPhase === 'enqueueR' || st.hlPhase === 'poll' || st.hlPhase === 'checkQueue' ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2 border-b pb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                                   <LayersIcon size={14}/> BFS Queue
                               </span>
                           </div>
                           <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                               {st.q && st.q.length > 0 ? st.q.map((item: any, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`stk-${idx}-${item.id}`} className={`flex justify-between transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700 opacity-70`}`}>
                                           <span>{item.val}</span>
                                           <span className="opacity-70 font-normal">({item.col}, {item.row})</span>
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                           </div>
                      </div>

                      {/* Right side: TreeMap Representation */}
                      <div className={`flex-[3] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${st.hlPhase === 'mapPut' || st.hlPhase === 'mapPutCol' || st.hlPhase === 'mapPutRow' || st.hlPhase === 'compileCol' || st.hlPhase === 'compileVals' || st.hlPhase === 'compileColIter' || st.hlPhase === 'compileRowIter' ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                   <Database size={14}/> Nested TreeMap State
                               </span>
                           </div>
                           <div className="flex gap-4 min-h-[100px] overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-start justify-start px-2">
                               {st.map && Object.keys(st.map).length > 0 ? Object.keys(st.map).map(Number).sort((a,b)=>a-b).map(colKey => {
                                   let isColActive = st.hlCol === colKey || st.cCol === colKey;
                                   return (
                                       <div key={`map-c${colKey}`} className={`flex flex-col min-w-[100px] border-2 rounded-xl p-2 transition-all ${isColActive ? 'border-amber-400 bg-amber-50 shadow-md scale-105' : 'border-slate-200 bg-slate-50'}`}>
                                            <div className={`text-center font-black text-xs font-mono mb-2 pb-1 border-b ${isColActive ? 'text-amber-700 border-amber-200' : 'text-slate-500 border-slate-200'}`}>Col {colKey}</div>
                                            <div className="flex flex-col gap-1.5">
                                                {Object.keys(st.map[colKey]).map(Number).sort((a,b)=>a-b).map(rowKey => {
                                                    let isRowActive = isColActive && (st.hlRow === rowKey || st.cRow === rowKey);
                                                    let vals = st.map[colKey][rowKey];
                                                    return (
                                                        <div key={`map-c${colKey}-r${rowKey}`} className={`flex items-center justify-between text-[10px] font-mono p-1 rounded ${isRowActive ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-white text-slate-600 border'}`}>
                                                            <span>R{rowKey}:</span>
                                                            <span className="font-bold">[{vals.join(',')}]</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                       </div>
                                   )
                               }) : <span className="text-slate-400 italic text-xs font-mono ml-2">Map Empty</span>}
                           </div>
                      </div>
                  </div>
              )}

              {selectedOpId === 'dfsSorting' && (
                  <div className="w-full max-w-6xl pointer-events-auto z-40 flex gap-4 px-4">
                      {/* Left: Call Stack */}
                      <div className={`flex-[1] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'enter' || st.hlPhase === 'exit' || st.hlPhase === 'dfsCheck') ? `border-${themeColor}-300 ring-4 ring-${themeColor}-100 scale-[1.02]` : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2 border-b pb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-${themeColor}-600 flex items-center gap-2`}>
                                   <LayersIcon size={14}/> DFS Call Stack
                               </span>
                           </div>
                           <div className="flex flex-col gap-1 h-full max-h-[150px] overflow-y-auto scrollbar-none justify-start px-1 mt-2">
                               {st.stack && st.stack.length > 0 ? [...st.stack].reverse().map((item: any, idx: number) => {
                                   let isTop = idx === 0;
                                   return (
                                       <div key={`dfs-stk-${idx}`} className={`flex justify-center transition-all duration-300 shrink-0 border-2 rounded-lg px-3 py-1.5 font-mono text-xs font-black ${isTop ? `bg-${themeColor}-500 border-${themeColor}-600 text-white shadow-md` : `bg-${themeColor}-50 border-${themeColor}-200 text-${themeColor}-700 opacity-70`}`}>
                                           dfs({item.val})
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono text-center pt-2">Empty</span>}
                           </div>
                      </div>

                      {/* Right: Flat List & Sorting */}
                      <div className={`flex-[3] flex flex-col bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 ${(st.hlPhase === 'record' || st.hlPhase === 'sortDone' || st.hlPhase === 'sortStart' || st.hlPhase === 'checkGroup') ? 'border-amber-300 ring-4 ring-amber-100 scale-[1.02]' : 'border-slate-200'}`}>
                           <div className="flex justify-between items-center mb-2 border-b pb-2">
                               <span className={`text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center gap-2`}>
                                   <ListOrdered size={14}/> Flat Tuple List {st.hlPhase === 'sortDone' || st.hlPhase === 'checkGroup' || st.hlPhase === 'newGroup' || st.hlPhase === 'appendVal' || st.isSuccess ? '(Sorted)' : '(Unsorted)'}
                               </span>
                           </div>
                           <div className="flex flex-wrap gap-2 min-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pb-2 items-start justify-start px-2 mt-2 content-start">
                               {st.flatNodes && st.flatNodes.length > 0 ? st.flatNodes.map((item: any, idx: number) => {
                                   let isActive = st.flatIdx === idx || (st.hlPhase === 'record' && idx === st.flatNodes.length - 1);
                                   let isSorted = st.hlPhase === 'sortDone' || st.hlPhase === 'checkGroup' || st.hlPhase === 'newGroup' || st.hlPhase === 'appendVal' || st.isSuccess;
                                   return (
                                       <div key={`flat-${idx}-${item.id}`} className={`flex flex-col items-center justify-center transition-all duration-500 shrink-0 border-2 rounded-xl px-2 py-1.5 font-mono ${isActive ? 'bg-amber-400 border-amber-500 text-amber-950 scale-110 shadow-lg z-10' : (isSorted ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-500')}`}>
                                           <span className="text-sm font-black">{item.val}</span>
                                           <span className="text-[8px] opacity-70">C:{item.col} R:{item.row}</span>
                                       </div>
                                   );
                               }) : <span className="text-slate-400 italic text-xs font-mono ml-2 mt-2">List Empty</span>}
                           </div>
                      </div>
                  </div>
              )}

              {/* Graphical Visualizer (Tree Map) */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl pointer-events-none">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8`} style={{ minHeight: `${containerSize}px` }}>
                      <span className={`text-[10px] font-black uppercase tracking-widest mb-8 px-3 py-1 rounded-lg border shadow-sm bg-white text-slate-600 border-slate-200 absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-auto z-20`}><LayoutGrid size={12} className="inline mr-1"/> (X, Y) Coordinate Map</span>
                      
                      {/* Fixed unified origin container */}
                      <div className="relative w-0 h-full overflow-visible flex justify-center mt-12">
                          
                          {/* Render Vertical Column Guidelines */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                              {cols.map((colVal) => {
                                  const xPos = colVal * 70;
                                  const isActive = st.hlCol === colVal || st.cCol === colVal;
                                  return (
                                      <div key={`grid-col-${colVal}`} className={`absolute top-0 bottom-[-100px] border-l-2 border-dashed transition-all duration-500 ${isActive ? `border-${themeColor}-400 bg-${themeColor}-400/5` : 'border-slate-200'} w-[70px] -translate-x-[35px]`} style={{ left: `${xPos}px` }}>
                                          <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black font-mono tracking-widest px-2 py-0.5 rounded ${isActive ? `bg-${themeColor}-100 text-${themeColor}-700` : 'text-slate-400 bg-slate-50 border border-slate-200'}`}>COL {colVal}</div>
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
                                      strokeColor = themeColor === 'sky' ? '#38bdf8' : '#34d399'; 
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
                              let inResList = st.resList && st.resList.some((colGroup: number[]) => colGroup.includes(node.val));
                              
                              let bgClass = "bg-white border-slate-300 text-slate-500 shadow-sm"; 
                              let scaleClass = "scale-100";
                              
                              if (isActive) {
                                  bgClass = `bg-${themeColor}-100 border-${themeColor}-500 text-${themeColor}-900 shadow-xl ring-4 ring-${themeColor}-200 z-30`;
                                  scaleClass = "scale-125";
                              } else if (inResList) {
                                  // Highlight fully processed nodes visually
                                  bgClass = `bg-indigo-400 border-indigo-600 text-white shadow-md z-10`;
                              } else if (st.isSuccess) {
                                  bgClass = "bg-indigo-50 border-indigo-200 text-indigo-400 opacity-40"; 
                              }

                              return (
                                  <div key={`node-${node.id}`} className={`absolute flex flex-col items-center transition-all duration-500 ${scaleClass}`} style={{ left: `${node.x}px`, top: `${node.y}px`, transform: 'translate(-50%, -50%)' }}>
                                      
                                      {/* Coordinates Badge */}
                                      {!st.isSuccess && (
                                          <div className={`absolute -right-6 -bottom-2 ${isActive ? `bg-${themeColor}-500 text-white` : 'bg-slate-100 text-slate-500 border border-slate-300'} rounded-md px-1 py-0.5 shadow-sm z-40 text-[8px] font-black font-mono tracking-tighter whitespace-nowrap transition-colors`}>
                                              {node.logicalCol}, {node.logicalRow}
                                          </div>
                                      )}

                                      {/* Overlap Hint Indicator */}
                                      {node.isOverlapping && !st.isSuccess && (
                                           <div className={`absolute -top-2 -right-2 bg-amber-500 w-3 h-3 rounded-full border-2 border-white shadow-sm z-50 animate-pulse`} title="Nodes sharing same coordinates"></div>
                                      )}

                                      <div className={`w-12 h-12 flex flex-col items-center justify-center border-[3px] rounded-full transition-all duration-300 ${bgClass}`}>
                                          <span className={`font-mono font-black text-lg leading-none`}>{String(node.val)}</span>
                                      </div>
                                  </div>
                              )
                          })}
                          </div>
                      </div>
                  </div>

              </div>

              {/* Compilation Bottom Tracker */}
              {st.resList && st.resList.length > 0 && (
                   <div className={`w-full max-w-4xl bg-white p-4 rounded-3xl border-4 shadow-sm transition-all duration-500 z-40 pointer-events-auto ${st.hlPhase === 'compileValsDone' || st.hlPhase === 'appendVal' || st.hlPhase === 'newGroup' || st.hlPhase === 'compileCol' ? 'border-indigo-300 ring-4 ring-indigo-100 scale-[1.02]' : 'border-slate-200'}`}>
                        <div className="flex justify-between items-center mb-2 border-b pb-2">
                            <span className={`text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2`}>
                                <ListOrdered size={14}/> Final Result: List&lt;List&lt;Integer&gt;&gt;
                            </span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 py-2 items-center justify-start px-2">
                             {st.resList.map((colGroup: number[], idx: number) => {
                                 let sortedCols = Array.from(treeData.logicalCols as Set<number>).sort((a,b)=>a-b);
                                 let colLabel = sortedCols[idx];
                                 let isColActive = st.hlCol === colLabel;
                                 
                                 return (
                                     <div key={`resList-${idx}`} className={`flex flex-col items-center gap-1 transition-all duration-300 shrink-0 border-2 rounded-xl px-4 py-2 ${isColActive ? 'bg-indigo-50 border-indigo-400 shadow-md scale-110' : 'bg-slate-50 border-slate-200'}`}>
                                         <span className="text-[9px] font-black font-mono uppercase text-slate-400">Col {colLabel}</span>
                                         <div className="flex gap-1 font-mono font-bold text-indigo-900">
                                             [ {colGroup.join(', ')} ]
                                         </div>
                                     </div>
                                 )
                             })}
                        </div>
                   </div>
              )}

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
                <AlignVerticalSpaceAround className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Vertical Order Traversal</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      LC Hard / Matrix Tree
                  </span>
                  <span>•</span>
                  <span>LeetCode 987</span>
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
                        <p className="mb-4">Given the <code>root</code> of a binary tree, calculate the <strong>vertical order traversal</strong> of the binary tree.</p>
                        
                        <p className="mb-4">For each node at position <code>(row, col)</code>, its left and right children will be at positions <code>(row + 1, col - 1)</code> and <code>(row + 1, col + 1)</code> respectively. The root of the tree is at <code>(0, 0)</code>.</p>
                        
                        <p className="mb-4">The vertical order traversal of a binary tree is a list of top-to-bottom orderings for each column index starting from the leftmost column and ending on the rightmost column.</p>

                        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl text-amber-900 font-medium">
                            <span className="flex items-center gap-2 mb-2 font-bold text-amber-700"><AlertTriangle size={18}/> Critical Sorting Rule:</span>
                            There may be multiple nodes in the same row and same column. In such a case, sort these nodes by their <strong>values</strong>.
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl max-w-xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><LayoutGrid size={14}/> Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li>The number of nodes in the tree is in the range <code>[1, 1000]</code>.</li>
                            <li><code>0 &le; Node.val &le; 1000</code></li>
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
                            <span>Example 1: Standard Tree</span>
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">No Overlap</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [3,9,20,null,null,15,7]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> [[9],[3,15],[20],[7]]</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>Column -1: Only node 9 is in this column.</p>
                                    <p>Column 0: Nodes 3 and 15 are in this column in that order from top to bottom.</p>
                                    <p>Column 1: Only node 20 is in this column.</p>
                                    <p>Column 2: Only node 7 is in this column.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Mapping:</span>
                                <pre className={`text-slate-300 font-bold text-sm`}>
{`      3 (0,0)
     /      \\
(-1,1) 9      20 (+1,1)
            /   \\
      15(0,2)   7 (+2,2)`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                            <span>Example 2: Overlapping Nodes (Sorted Correctly)</span>
                            <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">Collision Detected</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [1,2,3,4,5,6,7]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> [[4],[2],[1,5,6],[3],[7]]</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>Column -2: Only node 4.</p>
                                    <p>Column -1: Only node 2.</p>
                                    <p>Column 0: Nodes 1, 5, and 6 are in this column.</p>
                                    <p className="text-amber-300">&rarr; 1 is at (0, 0), so it comes first.</p>
                                    <p className="text-amber-300">&rarr; 5 and 6 are both at (2, 0). Since 5 &lt; 6, 5 comes before 6.</p>
                                    <p>Column 1: Only node 3.</p>
                                    <p>Column 2: Only node 7.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Mapping:</span>
                                <pre className={`text-slate-300 font-bold text-sm`}>
{`      1 (0,0)
     /      \\
(-1,1) 2      3 (+1,1)
      / \\    / \\
     4   5  6   7
(-2,2)  (0,2)   (+2,2)`}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Example 3 */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl text-white">
                        <div className="bg-slate-800/50 px-6 py-3 border-b border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                            <span>Example 3: Overlapping Nodes (Flipped Input)</span>
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded">Sorting Enforced</span>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-start">
                            <div className="flex-1 space-y-4 font-mono text-sm">
                                <p className="text-slate-300"><strong className="text-emerald-400">Input:</strong> root = [1,2,3,4,6,5,7]</p>
                                <p className="text-slate-300"><strong className="text-sky-400">Output:</strong> [[4],[2],[1,5,6],[3],[7]]</p>
                                <div className="space-y-2 text-xs text-slate-400 mt-4 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                    <p><strong>Explanation:</strong></p>
                                    <p>Even though 6 is now the left child of 2, and 5 is the right child of 3, they still both end up at coordinate <code>(row 2, col 0)</code>.</p>
                                    <p className="text-rose-300">&rarr; Because 5 &lt; 6, node 5 still appears before node 6 in the final output array.</p>
                                </div>
                            </div>
                            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 shrink-0 w-full lg:w-auto">
                                <span className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2 block">Tree Mapping:</span>
                                <pre className={`text-slate-300 font-bold text-sm`}>
{`      1 (0,0)
     /      \\
(-1,1) 2      3 (+1,1)
      / \\    / \\
     4   6  5   7
(-2,2)  (0,2)   (+2,2)`}
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
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Tree Array (Try overlapping nodes!)</label>
                            <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="1, 2, 3, 4, 6, 5, 7" />
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
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'mapPut' || st.hlPhase === 'record' ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                    <p className="text-slate-500 text-lg leading-relaxed">Deep dive into data structures, sorting overhead, and memory footprints.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-5xl mx-auto">
                    
                    {/* Approach 1 */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-sky-50 border-b border-sky-100 p-6">
                            <h4 className="text-2xl font-black text-sky-900 flex items-center gap-3"><Database size={28} className="text-sky-500"/> Approach 1: BFS + Nested TreeMap</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                To natively group items by columns from left-to-right, and then by rows from top-to-bottom, we can utilize a nested <code>TreeMap</code>. 
                                A TreeMap in Java is backed by a Red-Black Tree, which guarantees that its keys are always sorted.
                            </p>
                            
                            <div className="bg-slate-900 text-white p-6 rounded-2xl font-mono text-sm leading-relaxed shadow-inner overflow-x-auto">
                                <span className="text-slate-400 block mb-2">// The core data structure:</span>
                                <span className="text-sky-400">TreeMap</span>&lt;Integer, <span className="text-sky-400">TreeMap</span>&lt;Integer, <span className="text-emerald-400">PriorityQueue</span>&lt;Integer&gt;&gt;&gt; map;
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Clock size={18} className="text-sky-500"/> Time Complexity: <span className="text-sky-600 font-mono ml-1">O(N log N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>We perform a standard BFS traversal, touching each of the <code className="bg-slate-200 px-1 rounded">N</code> nodes once.</li>
                                        <li>For every node, inserting its column into the outer TreeMap takes <code className="bg-slate-200 px-1 rounded">O(log(width))</code>.</li>
                                        <li>Inserting its row into the inner TreeMap takes <code className="bg-slate-200 px-1 rounded">O(log(height))</code>.</li>
                                        <li>Inserting its value into the PriorityQueue takes <code className="bg-slate-200 px-1 rounded">O(log(k))</code> where <code className="bg-slate-200 px-1 rounded">k</code> is the number of overlapping nodes.</li>
                                        <li>In the worst-case (a completely skewed tree), this approaches <strong>O(N log N)</strong>.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Cpu size={18} className="text-sky-500"/> Space Complexity: <span className="text-sky-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>The BFS Queue will hold at most <code className="bg-slate-200 px-1 rounded">O(N/2)</code> nodes at the deepest leaf level.</li>
                                        <li>The nested TreeMap stores exactly <code className="bg-slate-200 px-1 rounded">N</code> integer values across various PriorityQueues.</li>
                                        <li>The Map's overhead for nodes/pointers is proportional to the number of distinct coordinates.</li>
                                        <li>Overall space scales linearly with the number of nodes: <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Approach 2 */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex flex-col">
                        <div className="bg-emerald-50 border-b border-emerald-100 p-6">
                            <h4 className="text-2xl font-black text-emerald-900 flex items-center gap-3"><SortAsc size={28} className="text-emerald-500"/> Approach 2: DFS + Flat Tuple Sorting</h4>
                        </div>
                        <div className="p-8 space-y-6">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                Instead of fighting with complex nested data structures, we can decouple the traversal from the sorting. 
                                We traverse the tree (DFS or BFS, doesn't matter) and create a flat list of <code>Tuple</code> objects containing <code>(nodeVal, col, row)</code>.
                            </p>
                            
                            <div className="bg-slate-900 text-white p-6 rounded-2xl font-mono text-sm leading-relaxed shadow-inner overflow-x-auto">
                                <span className="text-slate-400 block mb-2">// The custom comparator rule:</span>
                                Collections.sort(nodes, (a, b) -&gt; {'{\n'}
                                {'    '}if (a.col != b.col) return a.col - b.col; <span className="text-emerald-400">// Rule 1: Left to Right</span>
                                {'    '}if (a.row != b.row) return a.row - b.row; <span className="text-emerald-400">// Rule 2: Top to Bottom</span>
                                {'    '}return a.val - b.val;                     <span className="text-emerald-400">// Rule 3: Smallest Value</span>
                                {'}'});
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 pt-4">
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Clock size={18} className="text-emerald-500"/> Time Complexity: <span className="text-emerald-600 font-mono ml-1">O(N log N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>The DFS traversal visits every node exactly once to build the flat list: <code className="bg-slate-200 px-1 rounded">O(N)</code>.</li>
                                        <li>Sorting the list of <code className="bg-slate-200 px-1 rounded">N</code> Tuples using Java's highly optimized Timsort takes <code className="bg-slate-200 px-1 rounded">O(N log N)</code>.</li>
                                        <li>Iterating over the sorted list to build the final nested array result takes <code className="bg-slate-200 px-1 rounded">O(N)</code>.</li>
                                        <li>The sorting step dominates the operation, making the overall time <strong>O(N log N)</strong>.</li>
                                    </ul>
                                </div>
                                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                                    <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Cpu size={18} className="text-emerald-500"/> Space Complexity: <span className="text-emerald-600 font-mono ml-1">O(N)</span></h5>
                                    <ul className="space-y-2 text-slate-600 text-sm list-disc pl-5">
                                        <li>The DFS recursion call stack will go as deep as the tree height: <code className="bg-slate-200 px-1 rounded">O(H)</code>.</li>
                                        <li>The flat <code>List&lt;Tuple&gt;</code> stores exactly one object per node, taking <code className="bg-slate-200 px-1 rounded">O(N)</code> space.</li>
                                        <li>Timsort requires an additional <code className="bg-slate-200 px-1 rounded">O(N)</code> space for its temporary merging arrays.</li>
                                        <li>Overall space is strictly bounded by <strong>O(N)</strong>.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl md:text-4xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><HelpCircle size={36} className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>This is LeetCode 987 (Hard). It is frequently asked by Meta, Google, and Amazon to test a candidate's ability to map complex multi-dimensional logic into clean code.</p>
                </div>
                
                <div className="space-y-6 max-w-5xl mx-auto">
                    
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-amber-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-amber-100 text-amber-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><AlertTriangle size={24}/></span>
                            <span>"Wait, how is this problem different from standard Level Order Traversal?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "A standard Level-Order Traversal (BFS) groups nodes strictly by their <strong>Row</strong> (depth). Vertical Order Traversal groups nodes strictly by their <strong>Column</strong> (horizontal offset)."</p>
                            <p>"Furthermore, this specific variation (LC 987) introduces a complex edge case: if two nodes fall on the exact same column AND row, they must be sorted by their actual integer values. Standard BFS doesn't require any value-based sorting."</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-sky-100 text-sky-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><Database size={24}/></span>
                            <span>"Why can't we just use a standard HashMap instead of a TreeMap?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "A standard HashMap does not maintain any ordering for its keys. The problem explicitly requires returning the columns ordered from <strong>left to right</strong> (smallest column index to largest)."</p>
                            <p>"If we used a standard HashMap, we would have to extract all the keys at the end of our traversal, sort those keys manually in an array, and then build our result list. A <code>TreeMap</code> automatically keeps its keys sorted continuously, eliminating the need for a secondary sorting step at the end."</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><SortAsc size={24}/></span>
                            <span>"Which is better to write in an interview: The TreeMap BFS approach or the DFS Flat Tuple approach?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The <strong>DFS Flat Tuple</strong> approach is generally preferred and highly recommended for interviews."</p>
                            <p>"While both have <code>O(N log N)</code> time complexity and <code>O(N)</code> space complexity, the Flat Tuple approach is significantly less prone to syntax errors. Writing <code>TreeMap&lt;Integer, TreeMap&lt;Integer, PriorityQueue&lt;Integer&gt;&gt;&gt;</code> under pressure is stressful and hard to read. Defining a simple <code>Tuple</code> class and writing a custom <code>compareTo()</code> method shows strong Object-Oriented Design skills and makes the logic crystal clear."</p>
                        </div>
                    </div>

                    {/* Q4 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-indigo-300 transition-colors rounded-3xl p-8 shadow-sm group">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-4 leading-tight">
                            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0 group-hover:scale-110 transition-transform"><Cpu size={24}/></span>
                            <span>"Is it possible to optimize the space complexity?"</span>
                        </h4>
                        <div className="pl-14 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "No, <code>O(N)</code> is the strict lower bound for space."</p>
                            <p>"Because the problem requires us to sort elements that share coordinates, and group all elements by column, we are fundamentally required to store the coordinates and values of all <code>N</code> nodes in memory simultaneously before we can produce the final output array."</p>
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
                      <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'mapPut' || st.hlPhase === 'record' ? 'text-amber-400' : 'text-white'}`}>{String(curStepData.phase || "")}</div>
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
                              <input type="text" value={treeInput} onChange={(e) => setTreeInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder='1, 2, 3, 4, 6...' />
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
                                    <div className={`text-${themeColor}-500 text-[10px] font-black uppercase tracking-widest mb-2`}>Final Grouped Result Array</div>
                                    <div className="font-mono text-white text-3xl font-black leading-relaxed flex flex-col items-center justify-center gap-2 max-w-full px-4 text-center">
                                        [ {st.resList && st.resList.map((colGroup: number[]) => `[${colGroup.join(',')}]`).join(', ')} ]
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