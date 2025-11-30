import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitBranch, ListOrdered, 
  ArrowRight, CornerDownLeft, Play, FastForward, CheckSquare
} from 'lucide-react';

const APPROACHES = {
  recursive: {
    id: 'recursive',
    title: '1. Recursive DFS',
    subtitle: 'Classic: O(N) Time, O(H) Space.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        helper(root, res);
        return res;
    }
    
    private void helper(TreeNode root, List<Integer> res) {
        // Base case: If node is null, return back up
        if (root != null) {
            // 1. Traverse the left subtree
            helper(root.left, res);
            
            // 2. Visit the current node
            res.add(root.val);
            
            // 3. Traverse the right subtree
            helper(root.right, res);
        }
    }
}`,
    explanation: "Inorder traversal requires us to visit nodes in a specific strict order: Left Child, Root Node, then Right Child. The recursive approach is the most natural way to express this mathematically. For any given node, we first recursively call our helper function on its left child, trusting that it will perfectly traverse the entire left branch. Once that returns, we 'visit' the current node by appending its value to our result list. Finally, we recursively call the helper on its right child. The call stack implicitly handles all the memory needed to track our path back up the tree, requiring O(H) space where H is the height of the tree."
  },
  iterative: {
    id: 'iterative',
    title: '2. Iterative (Stack)',
    subtitle: 'Standard: O(N) Time, O(H) Space.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        
        // Loop while there are nodes to process or stack is not empty
        while (curr != null || !stack.isEmpty()) {
            
            // 1. Reach the left-most node of the current Node
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            
            // 2. Curr must be null at this point. Pop the top of the stack.
            curr = stack.pop();
            
            // 3. Visit the node
            res.add(curr.val);
            
            // 4. We have visited the node and its left subtree. 
            // Now, it's time to visit the right subtree.
            curr = curr.right;
        }
        
        return res;
    }
}`,
    explanation: "To convert the recursive traversal into an iterative one, we must manually simulate the call stack using a `Stack` data structure. We start with a `curr` pointer at the root. We dive as far left as mathematically possible, pushing every node we encounter onto the stack until we hit `null`. At this point, the node at the top of the stack is the left-most unvisited node! We pop it, 'visit' it by adding its value to our result list, and then shift our `curr` pointer to its right child to begin traversing that branch. If the right child is `null`, the next iteration will just pop the parent node from the stack. This perfectly mimics the `Left -> Root -> Right` flow without using recursive function calls."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">94. Binary Tree Inorder Traversal</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>root</code> of a binary tree, return <em>the inorder traversal of its nodes' values</em>.
        </p>
        
        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          <strong>Inorder Traversal:</strong> Left Subtree → Root Node → Right Subtree
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex flex-col items-center opacity-80">
                  <pre className="text-center">  1  <br/>   \ <br/>    2<br/>   / <br/>  3  </pre>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> root = [1,null,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1,3,2]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> root = []</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> root = [1]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [1]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the tree is in the range <code>[0, 100]</code>.</li>
              <li><code>-100 &lt;= Node.val &lt;= 100</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Helper to parse string arrays into tree structures for internal trace usage
const buildTree = (arr) => {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    
    let root = { id: `node_0`, val: arr[0], left: null, right: null, idx: 0 };
    let queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        let curr = queue.shift();
        
        // Left child
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.left = { id: `node_${i}`, val: arr[i], left: null, right: null, idx: i };
            queue.push(curr.left);
        }
        i++;
        
        // Right child
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = { id: `node_${i}`, val: arr[i], left: null, right: null, idx: i };
            queue.push(curr.right);
        }
        i++;
    }
    return root;
};

const InorderVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('recursive');
  
  const [treeInput, setTreeInput] = useState('1,null,2,3');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    const parse = (str) => str.split(',').map(s => {
        let trimmed = s.trim().toLowerCase();
        if (trimmed === 'null' || trimmed === '') return null;
        let num = parseInt(trimmed, 10);
        return isNaN(num) ? null : num;
    });
    
    let arr = parse(treeInput);
    
    // UI Safety cap to prevent browser crashing in massive tree graphs
    if (arr.length > 31) arr = arr.slice(0, 31);

    let tree = buildTree(arr);

    return { tree, arr };
  }, [treeInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { tree } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; // Hard limit for safety
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'recursive') {
        let res = [];
        let callStack = [];

        addStep(
            "Initialization", 
            `Line 3-4: List<Integer> res = new ArrayList<>();\nhelper(root, res);\n\nInitializing empty result list and starting the recursive helper function from the root node.`, 
            4, 
            { res: [...res], curr: tree, action: 'init', stack: [], depth: 0 }
        );

        const dfs = (node, depth) => {
            if (steps.length > 2500) return;
            
            callStack.push(node ? node.id : 'null');
            let currentStack = [...callStack];

            addStep(
                `Enter helper() [Depth ${depth}]`, 
                `Line 9: if (root != null)\n\nEntering recursive helper. Current node is ${node ? `[${node.val}]` : 'null'}. Is it null?`, 
                9, 
                { res: [...res], curr: node, action: 'enter', stack: currentStack, depth }
            );

            if (node !== null) {
                
                addStep(
                    `Recurse Left [Depth ${depth}]`, 
                    `Line 11: helper(root.left, res);\n\nNode is valid. Diving into the LEFT subtree of [${node.val}].`, 
                    11, 
                    { res: [...res], curr: node, action: 'recurseLeft', stack: currentStack, depth }
                );

                dfs(node.left, depth + 1);

                res.push(node.val);
                addStep(
                    `Visit Node [Depth ${depth}]`, 
                    `Line 14: res.add(root.val);\n\nLeft subtree traversal complete. We now "visit" the current node [${node.val}] by adding it to our result list.`, 
                    14, 
                    { res: [...res], curr: node, action: 'visit', stack: currentStack, depth }
                );

                addStep(
                    `Recurse Right [Depth ${depth}]`, 
                    `Line 17: helper(root.right, res);\n\nNode [${node.val}] visited. Diving into the RIGHT subtree.`, 
                    17, 
                    { res: [...res], curr: node, action: 'recurseRight', stack: currentStack, depth }
                );

                dfs(node.right, depth + 1);
            } else {
                 addStep(
                    `Base Case (Null) [Depth ${depth}]`, 
                    `Line 9: root != null is FALSE.\n\nWe hit an empty branch. Returning to parent.`, 
                    9, 
                    { res: [...res], curr: node, action: 'nullReturn', stack: currentStack, depth }
                );
            }

            callStack.pop();
            if (depth > 0) {
                 addStep(
                    `Return to Parent`, 
                    `Function execution finished for this node. Popping off the call stack and returning to the caller.`, 
                    19, 
                    { res: [...res], curr: node, action: 'return', stack: [...callStack], depth: depth - 1 }
                );
            }
        };

        dfs(tree, 0);

        addStep(
            "Algorithm Complete", 
            `Line 5: return res;\n\nThe full inorder traversal has been completed successfully!`, 
            5, 
            { res: [...res], curr: null, action: 'success', stack: [], depth: 0, isSuccess: true, ans: res }
        );

    } else if (selectedApproachId === 'iterative') {
        
        let res = [];
        let stack = [];
        let curr = tree;

        addStep(
            "Initialization", 
            `Line 3-5: Initialize res list, explicit stack, and set 'curr' pointer to the root node.`, 
            5, 
            { res: [...res], curr, stack: [...stack], action: 'init' }
        );

        let iter = 0;
        while (curr !== null || stack.length > 0) {
            if (iter++ > 150) break; // safety
            
            addStep(
                "Evaluate Outer Loop", 
                `Line 8: while (curr != null || !stack.isEmpty())\n\nWe still have nodes to process.`, 
                8, 
                { res: [...res], curr, stack: [...stack], action: 'outerLoop' }
            );

            if (curr !== null) {
                 addStep(
                    "Dive Left", 
                    `Line 11: while (curr != null)\n\nWe must traverse as far left as possible, pushing every node we pass onto the stack to remember our path back up.`, 
                    11, 
                    { res: [...res], curr, stack: [...stack], action: 'innerLoop' }
                );
            }

            while (curr !== null) {
                if (iter++ > 150) break;
                
                stack.push(curr);
                
                addStep(
                    "Push and Move Left", 
                    `Line 12-13: stack.push(curr); curr = curr.left;\n\nPushed [${curr.val}] onto stack. Moving curr to its left child.`, 
                    13, 
                    { res: [...res], curr: curr.left, stack: [...stack], action: 'pushLeft', lastPushed: curr }
                );
                
                curr = curr.left;
            }

            if (stack.length > 0) {
                let popped = stack.pop();
                curr = popped;

                addStep(
                    "Pop from Stack", 
                    `Line 17: curr = stack.pop();\n\n'curr' became null, meaning we hit the bottom of the left branch. We pop the most recent node from the stack to process it: [${curr.val}].`, 
                    17, 
                    { res: [...res], curr, stack: [...stack], action: 'pop' }
                );

                res.push(curr.val);
                
                addStep(
                    "Visit Node", 
                    `Line 20: res.add(curr.val);\n\nWe "visit" the node by adding its value [${curr.val}] to our result list.`, 
                    20, 
                    { res: [...res], curr, stack: [...stack], action: 'visit' }
                );

                curr = curr.right;

                addStep(
                    "Move Right", 
                    `Line 24: curr = curr.right;\n\nNow that the node and its left subtree are fully processed, we shift our focus to its right subtree.`, 
                    24, 
                    { res: [...res], curr, stack: [...stack], action: 'moveRight', lastVisited: popped }
                );
            }
        }

        addStep(
            "Algorithm Complete", 
            `Line 27: return res;\n\nStack is empty and curr is null. Iterative traversal is complete!`, 
            27, 
            { res: [...res], curr: null, stack: [...stack], action: 'success', isSuccess: true, ans: res }
        );
    }

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

    return steps;
  }, [parsedData, selectedApproachId]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const state = cur.state || {};
  const { isSuccess, ans, action, curr, res, stack, depth, lastPushed, lastVisited } = state;
  const { tree } = parsedData;

  // SVG Render Helper for Trees
  const renderTreeSvg = (root, activeNode, actionType, stackArr) => {
      const nodes = [];
      const edges = [];
      const nodeRadius = 16;
      
      // Determine what nodes are currently in the stack visually
      const inStackIds = new Set();
      if (stackArr) {
          if (selectedApproachId === 'iterative') {
              stackArr.forEach(n => inStackIds.add(n.id));
          } else if (selectedApproachId === 'recursive') {
              stackArr.forEach(id => inStackIds.add(id));
          }
      }

      const traverse = (node, cx, cy, level, dx) => {
          if (!node) return;

          if (node.left) {
              const nx = cx - dx;
              const ny = cy + 45;
              edges.push(<line key={`e-l-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke="#cbd5e1" strokeWidth="2" />);
              traverse(node.left, nx, ny, level + 1, dx / 1.8);
          }
          if (node.right) {
              const nx = cx + dx;
              const ny = cy + 45;
              edges.push(<line key={`e-r-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke="#cbd5e1" strokeWidth="2" />);
              traverse(node.right, nx, ny, level + 1, dx / 1.8);
          }

          let isTarget = activeNode && activeNode.id === node.id;
          let isInStack = inStackIds.has(node.id);
          let isVisited = res && res.includes(node.val);

          let fill = "#ffffff";
          let stroke = "#94a3b8";
          let strokeWidth = 2;
          let textColor = "#334155";
          
          if (isTarget) {
              strokeWidth = 4;
              if (actionType === 'visit') {
                  fill = "#d1fae5"; stroke = "#10b981"; textColor = "#064e3b";
              } else if (actionType.includes('Left') || actionType.includes('Right') || actionType === 'moveRight') {
                  fill = "#e0e7ff"; stroke = "#3b82f6"; textColor = "#1e3a8a";
              } else {
                  fill = "#f3e8ff"; stroke = "#8b5cf6"; textColor = "#312e81";
              }
          } else if (isVisited) {
              fill = "#f8fafc"; stroke = "#10b981"; textColor = "#10b981";
          } else if (isInStack) {
              fill = "#fef3c7"; stroke = "#f59e0b"; textColor = "#b45309";
          }

          // Animate the pushing to stack manually
          let isJustPushed = actionType === 'pushLeft' && lastPushed && lastPushed.id === node.id;
          if (isJustPushed) {
              fill = "#fef3c7"; stroke = "#f59e0b"; textColor = "#b45309"; strokeWidth = 4;
          }

          nodes.push(
              <g key={`g-${node.id}`} className="transition-all duration-300">
                  <circle 
                      cx={cx} 
                      cy={cy} 
                      r={nodeRadius} 
                      fill={fill} 
                      stroke={stroke} 
                      strokeWidth={strokeWidth} 
                      className={isTarget ? 'animate-pulse' : ''}
                  />
                  <text 
                      x={cx} 
                      y={cy} 
                      textAnchor="middle" 
                      dominantBaseline="central" 
                      fontSize="14" 
                      fontWeight="bold" 
                      fontFamily="monospace"
                      fill={textColor}
                  >
                      {node.val}
                  </text>
                  
                  {isTarget && (
                      <circle cx={cx} cy={cy} r={nodeRadius + 6} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="2 2" className="animate-spin-slow opacity-50" />
                  )}
                  {isVisited && !isTarget && (
                      <Check size={12} strokeWidth={4} className="text-emerald-500 absolute" style={{ transform: `translate(${cx + 8}px, ${cy - 18}px)` }} />
                  )}
              </g>
          );
      };

      if (root) {
          traverse(root, 150, 30, 0, 70); // viewBox 0 0 300 240
      } else {
          // Render ghost root if empty tree input
           nodes.push(
              <g key={`g-null-root`} className="transition-all duration-300">
                  <circle cx={150} cy={30} r={nodeRadius} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="4 2"/>
                  <text x={150} y={30} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#94a3b8">null</text>
              </g>
          );
      }

      return (
          <svg viewBox="0 0 300 240" className="w-full h-full max-h-[300px]">
              {edges}
              {nodes}
          </svg>
      );
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <ListOrdered className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Binary Tree Inorder</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 94</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Trees / DFS / Stack</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Col: Code & Context (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                
                {/* Approach Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.values(APPROACHES).map((app) => {
                        const isSelected = selectedApproachId === app.id;
                        const [time, space] = app.complexity.split(' | ');
                        return (
                            <button 
                               key={app.id}
                               onClick={() => { setSelectedApproachId(app.id); setCurrentStep(0); }}
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-violet-600 border-violet-600 text-white shadow-violet-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-violet-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-violet-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-violet-100' : 'text-slate-400'}`}>
                                    <span>{time}</span>
                                    <span>{space}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Code Window */}
                <div className="bg-[#0f172a] rounded-3xl h-[460px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-violet-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'visit' ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? 'bg-sky-500/20 border-sky-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'visit' ? 'emerald' : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? 'sky' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Execution State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label={selectedApproachId === 'recursive' ? "Root Node" : "Curr Node"} val={curr !== undefined ? (curr ? `[v:${curr.val}]` : 'null') : "-"} color="purple" active={curr !== undefined} />
                        
                        {selectedApproachId === 'recursive' && (
                            <VariableCard label="Call Depth" val={depth !== null && depth !== undefined ? depth : "-"} color="sky" active={depth !== null && depth !== undefined} />
                        )}
                        {selectedApproachId === 'iterative' && (
                            <VariableCard label="Stack Size" val={stack ? stack.length : "-"} color="amber" active={stack !== undefined} />
                        )}

                        <VariableCard label="Result Size" val={res ? res.length : "-"} color="emerald" active={res !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Tree (Level-Order Array)</label>
                        <input type="text" value={treeInput} onChange={(e) => { setTreeInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="1,null,2,3" />
                        <p className="text-[9px] text-slate-400 pl-1">e.g., 1,null,2,3 (Max 31 nodes for visualization)</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'visit' ? 'bg-emerald-900 border-emerald-800' : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? 'bg-sky-900 border-sky-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action === 'visit' ? <CheckSquare size={100}/> : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? <ArrowRight size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'visit' ? 'text-emerald-400' : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? 'text-sky-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'visit' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('Left') || action.includes('Right') || action === 'moveRight' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[140px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-6 overflow-y-auto overflow-x-hidden">
                      
                      {/* Interactive Tree Map Area */}
                      <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[220px] bg-slate-50 border-2 border-slate-200 rounded-3xl p-4 shadow-inner relative">
                          <span className="absolute top-4 left-6 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2"><GitBranch size={14}/> Tree Architecture</span>
                          
                          {/* Legend */}
                          <div className="absolute top-4 right-4 flex items-center gap-3">
                              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-fuchsia-100 border-2 border-fuchsia-400"></div><span className="text-[9px] text-slate-500 font-bold uppercase">Curr</span></div>
                              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-100 border-2 border-amber-400"></div><span className="text-[9px] text-slate-500 font-bold uppercase">Stack</span></div>
                              <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-100 border-2 border-emerald-400"></div><span className="text-[9px] text-slate-500 font-bold uppercase">Visited</span></div>
                          </div>

                          <div className="w-full h-full max-w-sm mt-6">
                              {renderTreeSvg(tree, curr, action, stack)}
                          </div>
                      </div>

                      {/* State tracking: Stack and Result */}
                      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 h-32">
                          
                          {/* Call Stack / Explicit Stack Array */}
                          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-4 flex flex-col shadow-xl relative overflow-hidden">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-3 flex items-center gap-2"><Layers size={14}/> {selectedApproachId === 'recursive' ? 'Call Stack (Implicit)' : 'Node Stack (Explicit)'}</span>
                              
                              <div className="flex gap-2 font-mono font-bold text-sm overflow-x-auto w-full pb-2 snap-x snap-mandatory flex-nowrap items-end h-full">
                                  {stack && stack.map((nodeData, idx) => {
                                      let isTop = idx === stack.length - 1;
                                      
                                      // Render depending on approach (recursive stores string IDs, iterative stores raw nodes)
                                      let displayVal = "";
                                      if (selectedApproachId === 'recursive') {
                                           if (nodeData === 'null') displayVal = 'null';
                                           else {
                                               // dirty search in tree for val by id, usually just need ID tracking but we want nice UI
                                               // For recursive, stack just stores ids, but let's visually show a box.
                                               displayVal = nodeData; // fallback
                                           }
                                      } else {
                                           displayVal = nodeData.val;
                                      }

                                      // Refine recursive display mapping if possible
                                      if (selectedApproachId === 'recursive') {
                                          let found = parsedData.arr.findIndex((_, index) => `node_${index}` === nodeData);
                                          if (found !== -1) displayVal = parsedData.arr[found];
                                      }

                                      return (
                                          <div key={`st-${idx}`} className={`flex flex-col items-center justify-center min-w-[36px] h-10 bg-amber-100 border-2 border-amber-400 rounded-lg text-amber-800 snap-center shadow-md ${isTop ? 'animate-in slide-in-from-right-4' : ''}`}>
                                              {displayVal}
                                          </div>
                                      );
                                  })}
                                  {(!stack || stack.length === 0) && <span className="text-slate-500 italic text-xs mx-auto my-auto opacity-50">Stack Empty</span>}
                              </div>
                          </div>

                          {/* Result Array */}
                          <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 flex flex-col shadow-sm relative overflow-hidden">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-3 flex items-center justify-between w-full">
                                  <div className="flex items-center gap-2"><ListOrdered size={14}/> Result Traversal Array</div>
                              </span>
                              
                              <div className="flex items-center gap-2 font-mono font-black text-lg overflow-x-auto w-full pb-2 h-full flex-wrap content-start">
                                  <span className="text-slate-300 text-2xl">[</span>
                                  {res && res.map((val, idx) => {
                                      let isLastAdded = action === 'visit' && idx === res.length - 1;
                                      return (
                                          <React.Fragment key={`res-${idx}`}>
                                              <span className={`px-2 py-1 rounded-lg border-2 shadow-sm transition-all duration-500 ${isLastAdded ? 'bg-emerald-100 text-emerald-800 border-emerald-400 scale-110 z-10 animate-in zoom-in' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                                  {val}
                                              </span>
                                              {idx < res.length - 1 && <span className="text-slate-300">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-300 text-2xl">]</span>
                              </div>
                          </div>

                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">TRAVERSAL COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  All Nodes Visited Successfully
                              </span>
                          </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Theory / Learn Tab */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <ListOrdered className="text-violet-600"/> Depth-First Traversal Orders
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Tree traversal simply dictates the order in which we "visit" or process nodes. For Binary Trees, there are three primary Depth-First Search (DFS) patterns. The name of the pattern simply tells you when you process the <strong>Root</strong> node relative to its children.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-sky-50 border border-sky-100 rounded-3xl shadow-sm">
                    <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm mb-3">Pre-order</h3>
                    <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-3 rounded-xl border border-sky-200 shadow-inner">
                        1. Root<br/>2. Left<br/>3. Right
                    </p>
                    <p className="text-[10px] text-sky-600 mt-3 leading-tight">Used to create a copy of the tree, or serialize it for storage.</p>
                </div>
                
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl shadow-sm transform scale-105 z-10 ring-4 ring-emerald-500/20">
                    <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm mb-3">In-order (This Problem)</h3>
                    <p className="text-xs text-emerald-800 leading-relaxed font-bold bg-white p-3 rounded-xl border border-emerald-200 shadow-inner">
                        1. Left<br/>2. Root<br/>3. Right
                    </p>
                    <p className="text-[10px] text-emerald-600 mt-3 leading-tight">Most common. In a Binary Search Tree (BST), this visits nodes in perfectly sorted ascending order!</p>
                </div>

                <div className="p-6 bg-purple-50 border border-purple-100 rounded-3xl shadow-sm">
                    <h3 className="font-black text-purple-900 flex items-center gap-2 uppercase tracking-tighter text-sm mb-3">Post-order</h3>
                    <p className="text-xs text-purple-800 leading-relaxed font-bold bg-white p-3 rounded-xl border border-purple-200 shadow-inner">
                        1. Left<br/>2. Right<br/>3. Root
                    </p>
                    <p className="text-[10px] text-purple-600 mt-3 leading-tight">Used to safely delete trees, since you delete children before parents.</p>
                </div>
            </div>

            <div className="w-full h-px bg-slate-200 my-8"></div>

            <div className="max-w-4xl space-y-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Layers className="text-violet-600"/> The Magic of the Iterative Stack
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-violet-100 pl-6">
                Recursion is elegant, but under the hood, the computer uses memory (the Call Stack) to remember where it was before jumping into a function. Converting recursion to iteration requires us to manually create and manage this <code>Stack</code>.
              </p>
              
              <div className="bg-slate-900 text-white rounded-[2rem] p-8 shadow-xl mt-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                      <FastForward size={140} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                      <div>
                          <h4 className="font-black text-amber-400 uppercase tracking-widest text-xs mb-4">The Logic Flow</h4>
                          <ul className="space-y-4 text-xs text-slate-300">
                              <li><strong className="text-white">1. Dive Left:</strong> Walk down the left side of the tree as far as possible, pushing every node onto the Stack.</li>
                              <li><strong className="text-white">2. Hit Rock Bottom:</strong> When <code>curr</code> hits null, the node at the top of the stack is the left-most unvisited node.</li>
                              <li><strong className="text-white">3. Visit & Pivot:</strong> Pop it, record its value, and set <code>curr</code> to its right child. Repeat!</li>
                          </ul>
                      </div>
                      <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px]">
                            <span className="text-emerald-400">// The Core Iterative Loop</span><br/><br/>
                            <span className="text-sky-300">while</span> (curr != null || !stack.isEmpty()) {'{'}<br/>
                            &nbsp;&nbsp;<span className="text-slate-500">// 1. Dive Left</span><br/>
                            &nbsp;&nbsp;<span className="text-sky-300">while</span> (curr != null) {'{'}<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;stack.push(curr);<br/>
                            &nbsp;&nbsp;&nbsp;&nbsp;curr = curr.left;<br/>
                            &nbsp;&nbsp;{'}'}<br/><br/>
                            &nbsp;&nbsp;<span className="text-slate-500">// 2 & 3. Pop, Visit, Pivot Right</span><br/>
                            &nbsp;&nbsp;curr = stack.pop();<br/>
                            &nbsp;&nbsp;res.add(curr.val);<br/>
                            &nbsp;&nbsp;curr = curr.right;<br/>
                            {'}'}
                      </div>
                  </div>
              </div>
            </div>

          </div>
        )}
        
        {/* Interview Tab */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-8 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "While the recursive DFS approach is trivially easy to write and mathematically sound, interviewers often ask to implement tree traversals iteratively to test deep understanding of the call stack. To perform an iterative Inorder Traversal, I utilize an explicit `Stack` and a `curr` pointer initialized to the root. I run a `while` loop that continues as long as `curr` is not null or the stack is not empty. Inside, I aggressively traverse down the left subtrees, pushing every node onto the stack until `curr` becomes null. At this point, the node at the top of the stack is mathematically the 'left-most' unvisited node. I pop it, append its value to my result list (thereby 'visiting' it), and then immediately shift my `curr` pointer to its right child to begin traversing that branch. This guarantees $O(N)$ time complexity and $O(H)$ space complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is Morris Traversal better?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Morris Traversal achieves strict $O(1)$ space by temporarily modifying the tree structure (creating "threads" from a leaf to its successor). While brilliant theoretically, it is rarely expected in standard interviews and can be highly frowned upon in production code because it mutates the input data structure concurrently, which breaks multi-threading safety. Stick to the Stack.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-emerald-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Both the recursive and iterative solutions visit every single node in the binary tree exactly once, making the time bounds strictly linear.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(H)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The space is bound by the max depth of the implicit call stack (recursion) or the explicit `Stack` array (iterative). In a balanced tree, height $H = \log N$. In a skewed tree, $H = N$.</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

const VariableCard = ({ label, val, color, active }) => {
    const bgMap = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700'
    };
    
    const inactiveMap = 'bg-slate-50 border-slate-200 text-slate-300';

    return (
        <div className={`p-3 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden h-full ${active ? bgMap[color] : inactiveMap}`}>
             <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1 truncate px-1">{label}</span>
             <div className={`text-xl font-black font-mono leading-none truncate w-full text-center px-2`}>
                 {val !== null && val !== undefined ? val : '-'}
             </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|inorderTraversal|helper|root|res|left|right|val|curr|push|pop|isEmpty)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
  const bgActive = `bg-${theme}-500/15`;
  const borderActive = `bg-${theme}-500`;
  const textActive = `text-${theme}-400`;

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? bgActive : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderActive}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${textActive} font-bold` : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-green-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'break', 'continue'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['inorderTraversal', 'helper', 'add', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['root', 'res', 'curr', 'stack'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (['left', 'right', 'val'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default InorderVisualizer;