import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitBranch, GitMerge, 
  XSquare, PlusSquare, SplitSquareHorizontal, CheckSquare,
  ListOrdered
} from 'lucide-react';

const APPROACHES = {
  dfs: {
    id: 'dfs',
    title: '1. Depth-First Search (Recursive)',
    subtitle: 'Optimal: O(N) Time, O(H) Space.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    code: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Base case 1: Both nodes are null. They are identical at this leaf.
        if (p == null && q == null) {
            return true;
        }
        
        // Base case 2: One is null but the other isn't, OR values differ.
        if (p == null || q == null || p.val != q.val) {
            return false;
        }
        
        // Recursive step: Both nodes match!
        // We must now ensure both their left subtrees AND right subtrees match.
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}`,
    explanation: "The recursive Depth-First Search (DFS) is the most elegant way to solve tree comparison problems. We break the problem down into comparing just two nodes at a time. First, we check the base cases: if both nodes are `null`, we've safely hit the bottom of both branches at the same time (return `true`). If only ONE is `null`, or if their values differ, the trees are not identical (return `false`). If they pass these checks, the current nodes are identical! However, for the whole tree to be identical, we must recursively ask the exact same question for their left children AND their right children. The recursion stack implicitly handles the traversal, taking O(H) space where H is the height of the tree."
  },
  bfs: {
    id: 'bfs',
    title: '2. Breadth-First Search (Queue)',
    subtitle: 'Iterative: O(N) Time, O(N) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // Use a single queue to hold pairs of nodes to compare
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(p);
        queue.offer(q);
        
        while (!queue.isEmpty()) {
            // Poll them in pairs
            TreeNode nodeP = queue.poll();
            TreeNode nodeQ = queue.poll();
            
            // If both are null, this branch matches, continue to next pair
            if (nodeP == null && nodeQ == null) continue;
            
            // If structural mismatch or value mismatch, fail immediately
            if (nodeP == null || nodeQ == null || nodeP.val != nodeQ.val) {
                return false;
            }
            
            // Enqueue the children in strict paired order:
            // Left child of P, Left child of Q
            queue.offer(nodeP.left);
            queue.offer(nodeQ.left);
            
            // Right child of P, Right child of Q
            queue.offer(nodeP.right);
            queue.offer(nodeQ.right);
        }
        
        return true; // We exhausted the queue with no mismatches
    }
}`,
    explanation: "If we want to avoid recursion, we can use an iterative Breadth-First Search (BFS) using a Queue. We enqueue the roots of both trees together as a pair. While the queue isn't empty, we dequeue two nodes at a time and compare them. The comparison logic is identical to DFS: both null is fine, one null or different values means failure. If they match, we enqueue their children. The critical part is the order: we must enqueue `p.left` then `q.left`, followed by `p.right` then `q.right`. This guarantees that in the next loop iterations, the nodes popped off together are the exact structural equivalents from both trees. If the queue completely empties without returning false, the trees are identical."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">100. Same Tree</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the roots of two binary trees <code>p</code> and <code>q</code>, write a function to check if they are the same or not.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-8 justify-center opacity-80">
                  <div className="flex flex-col items-center">
                      <span className="text-xs mb-2 text-slate-400">Tree P</span>
                      <pre className="text-center">  1  <br/> / \ <br/>2   3</pre>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-xs mb-2 text-slate-400">Tree Q</span>
                      <pre className="text-center">  1  <br/> / \ <br/>2   3</pre>
                  </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> p = [1,2,3], q = [1,2,3]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex items-center gap-8 justify-center opacity-80">
                  <div className="flex flex-col items-center">
                      <span className="text-xs mb-2 text-slate-400">Tree P</span>
                      <pre className="text-center">  1  <br/> /   <br/>2    </pre>
                  </div>
                  <div className="flex flex-col items-center">
                      <span className="text-xs mb-2 text-slate-400">Tree Q</span>
                      <pre className="text-center">  1  <br/>   \ <br/>    2</pre>
                  </div>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> p = [1,2], q = [1,null,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: Structurally different. Tree P has a left child, Tree Q has a right child.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in both trees is in the range <code>[0, 100]</code>.</li>
              <li><code>-10<sup>4</sup> &lt;= Node.val &lt;= 10<sup>4</sup></code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Helper to parse string arrays into tree structures for internal trace usage
const buildTree = (arr, prefix) => {
    if (!arr || arr.length === 0 || arr[0] === null) return null;
    
    let root = { id: `${prefix}_0`, val: arr[0], left: null, right: null, idx: 0 };
    let queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < arr.length) {
        let curr = queue.shift();
        
        // Left child
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.left = { id: `${prefix}_${i}`, val: arr[i], left: null, right: null, idx: i };
            queue.push(curr.left);
        }
        i++;
        
        // Right child
        if (i < arr.length && arr[i] !== null && arr[i] !== undefined) {
            curr.right = { id: `${prefix}_${i}`, val: arr[i], left: null, right: null, idx: i };
            queue.push(curr.right);
        }
        i++;
    }
    return root;
};

const SameTreeVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dfs');
  
  // Default to a partial match to show failure gracefully
  const [pInput, setPInput] = useState('1,2,3');
  const [qInput, setQInput] = useState('1,2,null,4');
  
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
    
    let pArr = parse(pInput);
    let qArr = parse(qInput);
    
    // UI Caps
    if (pArr.length > 15) pArr = pArr.slice(0, 15);
    if (qArr.length > 15) qArr = qArr.slice(0, 15);

    let pTree = buildTree(pArr, 'P');
    let qTree = buildTree(qArr, 'Q');

    return { pTree, qTree, pArr, qArr };
  }, [pInput, qInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { pTree, qTree } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; // Hard limit for safety
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'dfs') {
        
        addStep("Initial Call", `isSameTree(p, q);\n\nStarting DFS comparison from the root nodes of both trees.`, 2, { currP: pTree, currQ: qTree, action: 'init', depth: 0 });

        const dfs = (p, q, depth) => {
            if (steps.length > 2000) return false;

            addStep(`Compare Nodes (Depth ${depth})`, `Line 4: if (p == null && q == null)\n\nComparing node P: [${p ? p.val : 'null'}] and node Q: [${q ? q.val : 'null'}]. Are both null?`, 4, { currP: p, currQ: q, action: 'evalNulls', depth });

            if (p === null && q === null) {
                addStep(`Both Null (Match)`, `Line 5: return true;\n\nBoth nodes are null. This means we've successfully reached the end of identical branches without errors.`, 5, { currP: p, currQ: q, action: 'matchNull', depth, isReturn: true, retVal: true });
                return true;
            }

            let pValStr = p ? p.val : "null";
            let qValStr = q ? q.val : "null";
            
            addStep(`Check Mismatches (Depth ${depth})`, `Line 9: if (p == null || q == null || p.val != q.val)\n\nAre there any structural mismatches (one is null) or value mismatches (${pValStr} != ${qValStr})?`, 9, { currP: p, currQ: q, action: 'evalVals', depth });

            if (p === null || q === null || p.val !== q.val) {
                let reason = (p === null || q === null) ? "Structural mismatch: One node is null while the other exists." : `Value mismatch: ${p.val} != ${q.val}.`;
                addStep(`Mismatch Found!`, `Line 10: return false;\n\n${reason} The trees are strictly NOT the same.`, 10, { currP: p, currQ: q, action: 'mismatch', depth, isReturn: true, retVal: false });
                return false;
            }

            addStep(`Nodes Match!`, `Line 14: return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n\nNodes [${p.val}] match! Now we must recursively verify both their left and right subtrees.`, 14, { currP: p, currQ: q, action: 'matchNode', depth });

            addStep(`Recurse Left (Depth ${depth})`, `Line 14: isSameTree(p.left, q.left)\n\nMoving to the left children of [${p.val}].`, 14, { currP: p, currQ: q, action: 'recurseLeft', depth });
            
            let leftMatch = dfs(p.left, q.left, depth + 1);
            
            if (!leftMatch) {
                addStep(`Left Subtree Failed`, `Line 14: The left subtree returned false. Short-circuiting...`, 14, { currP: p, currQ: q, action: 'returnUpFalse', depth, isReturn: true, retVal: false });
                return false;
            }

            addStep(`Recurse Right (Depth ${depth})`, `Line 14: isSameTree(p.right, q.right)\n\nLeft matched. Now moving to the right children of [${p.val}].`, 14, { currP: p, currQ: q, action: 'recurseRight', depth });

            let rightMatch = dfs(p.right, q.right, depth + 1);

            let finalMatch = leftMatch && rightMatch;
            
            addStep(`Subtrees Verified`, `Line 14: return ${leftMatch} && ${rightMatch};\n\nBoth subtrees of [${p.val}] returned ${finalMatch}. Rolling back up.`, 14, { currP: p, currQ: q, action: finalMatch ? 'returnUpTrue' : 'returnUpFalse', depth, isReturn: true, retVal: finalMatch });

            return finalMatch;
        };

        let finalResult = dfs(pTree, qTree, 0);

        addStep("Algorithm Complete", `Result: ${finalResult}\n\nThe recursion has fully unwound. The trees are ${finalResult ? 'IDENTICAL' : 'DIFFERENT'}.`, 2, { currP: null, currQ: null, action: 'success', isSuccess: true, ans: finalResult });

    } else if (selectedApproachId === 'bfs') {
        
        let queue = [];
        addStep("Initialization", `Line 3-5: Queue<TreeNode> queue = new LinkedList<>();\nqueue.offer(p); queue.offer(q);\n\nInitialize queue and push both root nodes.`, 5, { currP: null, currQ: null, queue: [...queue, pTree, qTree], action: 'init' });
        
        queue.push(pTree);
        queue.push(qTree);

        let iter = 0;
        while (queue.length > 0) {
            if (iter++ > 200) break; // infinite loop safeguard
            if (steps.length > 2000) break;

            addStep("Evaluate Queue", `Line 7: while (!queue.isEmpty())\n\nQueue has elements. We will process the next paired nodes.`, 7, { currP: null, currQ: null, queue: [...queue], action: 'loopStart' });

            let nodeP = queue.shift();
            let nodeQ = queue.shift();

            addStep("Dequeue Pair", `Line 9-10: TreeNode nodeP = queue.poll(); TreeNode nodeQ = queue.poll();\n\nPopped Node P: [${nodeP ? nodeP.val : 'null'}] and Node Q: [${nodeQ ? nodeQ.val : 'null'}].`, 10, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'poll' });

            addStep("Check Both Null", `Line 13: if (nodeP == null && nodeQ == null) continue;\n\nAre both null?`, 13, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'evalNulls' });

            if (nodeP === null && nodeQ === null) {
                addStep("Skip Pair", `Line 13: continue;\n\nBoth are null, which is a structural match for leaf endings. We skip adding children and continue to the next pair in the queue.`, 13, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'continueNull' });
                continue;
            }

            let pValStr = nodeP ? nodeP.val : "null";
            let qValStr = nodeQ ? nodeQ.val : "null";

            addStep("Check Mismatches", `Line 16: if (nodeP == null || nodeQ == null || nodeP.val != nodeQ.val)\n\nChecking for structural mismatch or value mismatch (${pValStr} vs ${qValStr}).`, 16, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'evalVals' });

            if (nodeP === null || nodeQ === null || nodeP.val !== nodeQ.val) {
                 addStep("Mismatch Found!", `Line 17: return false;\n\nThe nodes don't match. Trees are definitely different. Exiting immediately.`, 17, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'mismatch', isReturn: true, retVal: false });
                 
                 addStep("Algorithm Complete", `Result: false\n\nBFS queue terminated early due to mismatch.`, 27, { currP: null, currQ: null, queue: [...queue], action: 'success', isSuccess: true, ans: false });
                 return steps;
            }

            addStep("Nodes Match (Enqueue Children)", `Line 21-25: queue.offer(...);\n\nNodes [${nodeP.val}] match! Enqueueing their left children together, then their right children together to maintain pair alignment.`, 21, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'matchNode' });

            queue.push(nodeP.left);
            queue.push(nodeQ.left);
            queue.push(nodeP.right);
            queue.push(nodeQ.right);

            addStep("Children Enqueued", `Queue updated. Left pair: [${nodeP.left ? nodeP.left.val : 'null'}, ${nodeQ.left ? nodeQ.left.val : 'null'}]. Right pair: [${nodeP.right ? nodeP.right.val : 'null'}, ${nodeQ.right ? nodeQ.right.val : 'null'}].`, 25, { currP: nodeP, currQ: nodeQ, queue: [...queue], action: 'pushChildren' });
        }

        addStep("Algorithm Complete", `Line 28: return true;\n\nThe queue is completely empty. We checked every pair and found no mismatches. The trees are structurally and identically the same!`, 28, { currP: null, currQ: null, queue: [...queue], action: 'success', isSuccess: true, ans: true });
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
  const { isSuccess, ans, action, currP, currQ, depth, queue } = state;
  const { pTree, qTree, pArr, qArr } = parsedData;

  // Render SVG tree helper
  const renderTreeSvg = (root, prefix, activeNodeId, actionType, otherActiveNodeId) => {
      // Calculate coordinates dynamically based on depth
      const nodes = [];
      const edges = [];
      const nodeRadius = 14;

      const traverse = (node, cx, cy, level, dx) => {
          if (!node) {
              // Draw small ghost null node for visual completeness during comparison
              if ((activeNodeId && activeNodeId === `${prefix}_null_${cx}_${cy}`) || actionType === 'evalNulls' || actionType === 'mismatch' || actionType === 'continueNull') {
                   // Only render if it's currently relevant to the trace to avoid clutter
              }
              return;
          }

          if (node.left) {
              const nx = cx - dx;
              const ny = cy + 40;
              edges.push(<line key={`e-l-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke="#cbd5e1" strokeWidth="2" />);
              traverse(node.left, nx, ny, level + 1, dx / 1.8);
          }
          if (node.right) {
              const nx = cx + dx;
              const ny = cy + 40;
              edges.push(<line key={`e-r-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke="#cbd5e1" strokeWidth="2" />);
              traverse(node.right, nx, ny, level + 1, dx / 1.8);
          }

          let isTarget = activeNodeId === node.id;
          
          let fill = "#ffffff";
          let stroke = "#94a3b8";
          let strokeWidth = 2;
          let textColor = "#334155";
          
          if (isTarget) {
              strokeWidth = 4;
              if (actionType === 'mismatch') {
                  fill = "#ffe4e6"; stroke = "#f43f5e"; textColor = "#881337";
              } else if (actionType.includes('match')) {
                  fill = "#d1fae5"; stroke = "#10b981"; textColor = "#064e3b";
              } else if (actionType.includes('recurse') || actionType.includes('push')) {
                  fill = "#e0e7ff"; stroke = "#3b82f6"; textColor = "#1e3a8a";
              } else {
                  fill = "#f3e8ff"; stroke = "#8b5cf6"; textColor = "#312e81";
              }
          } else if (isSuccess) {
              fill = ans ? "#d1fae5" : "#f8fafc";
              stroke = ans ? "#10b981" : "#cbd5e1";
              textColor = ans ? "#064e3b" : "#94a3b8";
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
                      className={isTarget && actionType !== 'mismatch' ? 'animate-pulse' : ''}
                  />
                  <text 
                      x={cx} 
                      y={cy} 
                      textAnchor="middle" 
                      dominantBaseline="central" 
                      fontSize="12" 
                      fontWeight="bold" 
                      fontFamily="monospace"
                      fill={textColor}
                  >
                      {node.val}
                  </text>
                  {isTarget && (
                      <circle cx={cx} cy={cy} r={nodeRadius + 6} fill="none" stroke={stroke} strokeWidth="2" strokeDasharray="2 2" className="animate-spin-slow opacity-50" />
                  )}
              </g>
          );
      };

      traverse(root, 100, 20, 0, 45); // viewBox 0 0 200 180

      // Edge case: if tree is entirely null, render a ghost null root
      if (!root) {
          let isTarget = activeNodeId === null && actionType.includes('Null');
           nodes.push(
              <g key={`g-null-root`} className="transition-all duration-300">
                  <circle cx={100} cy={20} r={nodeRadius} fill="#f1f5f9" stroke={isTarget ? "#f43f5e" : "#cbd5e1"} strokeWidth={isTarget ? 3 : 2} strokeDasharray="4 2"/>
                  <text x={100} y={20} textAnchor="middle" dominantBaseline="central" fontSize="9" fill="#94a3b8">null</text>
              </g>
          );
      }

      return (
          <svg viewBox="0 0 200 180" className="w-full h-full max-h-[220px]">
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
                <SplitSquareHorizontal className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Same Tree</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 100</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Trees / DFS / BFS</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'mismatch' ? 'bg-rose-500/20 border-rose-500' : (action.includes('match') || action === 'returnUpTrue' ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'mismatch' ? 'rose' : (action.includes('match') || action === 'returnUpTrue' ? 'emerald' : 'violet')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-violet-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <VariableCard label="Node P (val)" val={currP !== undefined ? (currP ? currP.val : 'null') : "-"} color="purple" active={currP !== undefined} />
                        <VariableCard label="Node Q (val)" val={currQ !== undefined ? (currQ ? currQ.val : 'null') : "-"} color="amber" active={currQ !== undefined} />
                        
                        {selectedApproachId === 'dfs' ? (
                            <VariableCard label="Depth" val={depth !== null && depth !== undefined ? depth : "-"} color="sky" active={depth !== null && depth !== undefined} />
                        ) : (
                            <VariableCard label="Queue Size" val={queue !== undefined ? queue.length : "-"} color="sky" active={queue !== undefined} />
                        )}
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Tree P (Level Order)</label>
                        <input type="text" value={pInput} onChange={(e) => { setPInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="1,2,3" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Tree Q (Level Order)</label>
                        <input type="text" value={qInput} onChange={(e) => { setQInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="1,2,null,4" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? (ans ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : (action === 'mismatch' ? 'bg-rose-900 border-rose-800' : (action.includes('match') || action === 'returnUpTrue' ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? (ans ? <Check size={100}/> : <XSquare size={100}/>) : (action === 'mismatch' ? <XSquare size={100}/> : (action.includes('match') ? <CheckSquare size={100}/> : <GitBranch size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? (ans ? "text-emerald-400" : "text-rose-400") : (action === 'mismatch' ? 'text-rose-400' : (action.includes('match') || action === 'returnUpTrue' ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? (ans ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : (action === 'mismatch' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('match') || action === 'returnUpTrue' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-6 gap-6">
                      
                      {/* Tree Grids Side by Side */}
                      <div className="w-full flex justify-between gap-4 h-[240px]">
                          
                          {/* Tree P Container */}
                          <div className={`flex-1 bg-slate-50 border-2 rounded-3xl p-4 flex flex-col items-center relative transition-colors duration-300 ${action === 'mismatch' ? 'border-rose-200' : (action.includes('match') ? 'border-emerald-200' : 'border-slate-200')}`}>
                              <span className="text-[10px] font-black uppercase text-purple-600 tracking-widest font-mono bg-purple-100 px-3 py-1 rounded-lg border border-purple-200 mb-2 shadow-sm">Tree P</span>
                              <div className="w-full flex-1">
                                  {renderTreeSvg(pTree, 'P', currP ? currP.id : null, action, currQ ? currQ.id : null)}
                              </div>
                          </div>

                          {/* Divider */}
                          <div className="w-px bg-slate-200 h-full flex flex-col items-center justify-center relative">
                               <div className={`absolute p-2 rounded-full border-2 bg-white transition-all duration-300 ${action === 'mismatch' ? 'border-rose-400 text-rose-500 shadow-md' : (action.includes('match') ? 'border-emerald-400 text-emerald-500 shadow-md scale-110' : 'border-slate-200 text-slate-400')}`}>
                                  {action === 'mismatch' ? <XSquare size={20}/> : (action.includes('match') ? <CheckSquare size={20}/> : <GitMerge size={20}/>)}
                               </div>
                          </div>

                          {/* Tree Q Container */}
                          <div className={`flex-1 bg-slate-50 border-2 rounded-3xl p-4 flex flex-col items-center relative transition-colors duration-300 ${action === 'mismatch' ? 'border-rose-200' : (action.includes('match') ? 'border-emerald-200' : 'border-slate-200')}`}>
                              <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest font-mono bg-amber-100 px-3 py-1 rounded-lg border border-amber-200 mb-2 shadow-sm">Tree Q</span>
                              <div className="w-full flex-1">
                                  {renderTreeSvg(qTree, 'Q', currQ ? currQ.id : null, action, currP ? currP.id : null)}
                              </div>
                          </div>

                      </div>

                      {/* BFS Queue visualization if applicable */}
                      {selectedApproachId === 'bfs' && queue && (
                          <div className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col relative overflow-hidden mt-4 shrink-0">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-3 flex items-center gap-2"><ListOrdered size={14}/> BFS Pair Queue</span>
                                
                                <div className="flex gap-3 font-mono font-bold text-xs overflow-x-auto w-full pb-2 snap-x snap-mandatory">
                                    {queue.length > 0 ? (
                                        // Queue holds flat nodes. We dequeue in pairs, but the array is flat.
                                        // Let's visualize them in pairs in the UI if length is even
                                        Array.from({length: Math.ceil(queue.length / 2)}).map((_, pairIdx) => {
                                            let node1 = queue[pairIdx * 2];
                                            let node2 = queue[pairIdx * 2 + 1];
                                            return (
                                                <div key={`q-pair-${pairIdx}`} className="flex flex-col items-center bg-slate-800 border border-slate-600 rounded-xl p-2 snap-center shadow-md min-w-[100px] shrink-0">
                                                    <span className="text-slate-400 text-[9px] mb-1">Pair {pairIdx + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-2 py-1 rounded ${node1 ? 'bg-purple-900/50 text-purple-300 border border-purple-700' : 'bg-slate-700 text-slate-500 border border-slate-600'}`}>{node1 ? node1.val : 'null'}</span>
                                                        <span className="text-slate-500">,</span>
                                                        <span className={`px-2 py-1 rounded ${node2 ? 'bg-amber-900/50 text-amber-300 border border-amber-700' : 'bg-slate-700 text-slate-500 border border-slate-600'}`}>{node2 ? node2.val : 'null'}</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <span className="text-slate-500 italic mt-2">Queue Empty</span>
                                    )}
                                </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans ? <Check size={32} strokeWidth={3}/> : <XSquare size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">VERIFICATION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block ${ans ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  Trees are {ans ? 'Identical' : 'Different'}
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
                <GitBranch className="text-violet-600"/> Synchronized Traversal
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                To check if two tree structures are identical, you must traverse both of them simultaneously, checking that every single node perfectly maps to its counterpart in the other tree.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Structural Base Cases
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Before checking the values inside the nodes, we must ensure the nodes actually exist!
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p><strong>Both Null:</strong> Valid leaf ending. They match structurally.</p>
                            <p><strong>One Null, One Exists:</strong> Structural mismatch! One tree has a branch where the other doesn't. Fail instantly.</p>
                            <p><strong>Both Exist:</strong> Structure matches so far. Now we can safely check <code>p.val == q.val</code> without throwing NullPointerExceptions.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <GitMerge size={18}/> DFS vs BFS Memory
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Both approaches take $O(N)$ time because you must check every node in the worst case (identical trees). However, their memory profiles differ.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><strong>DFS Space:</strong> $O(H)$ where H is tree height. In a balanced tree, this is highly efficient $O(\log N)$. In a worst-case linked-list tree, it is $O(N)$.</p>
                            <p><strong>BFS Space:</strong> $O(N)$. The queue must hold an entire horizontal "level" of the tree. The bottom level of a full binary tree contains $N/2$ nodes.</p>
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
                        "I chose the recursive Depth-First Search approach for its simplicity and elegant handling of state. The algorithm synchronizes the traversal of both trees simultaneously. At each step, I first evaluate the structural base cases: if both nodes are null, the branches terminate identically, so I return true. If only one is null, or if their values mismatch, the trees differ, so I immediately short-circuit and return false. If the current nodes are valid and identical, I recursively ask the exact same question for both their left subtrees and right subtrees. This approach operates in $O(N)$ time as it visits each node once in the worst case, and takes $O(H)$ auxiliary space on the call stack, which is generally more memory-efficient than maintaining an explicit queue for BFS."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we serialize them to strings?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You *could* write a pre-order traversal that outputs a string (e.g., "1,2,null,null,3") for both trees and compare the two strings. However, this is incredibly inefficient. It forces an $O(N)$ full traversal and $O(N)$ string memory allocation even if the root nodes immediately mismatch! The recursive approach short-circuits instantly upon the first mismatch.
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
                                <p className="text-[10px] text-slate-500 mt-1">In the worst-case scenario (trees are perfectly identical), the algorithm must visit every single node in both trees exactly once to verify them.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(H)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The space is dictated by the maximum depth of the recursion stack. In a balanced tree, height H is $O(\log N)$. In a worst-case skewed tree, it degrades to $O(N)$.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|Queue|LinkedList|offer|poll|isEmpty|isSameTree|p|q|val|left|right|nodeP|nodeQ)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'Queue', 'LinkedList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isSameTree', 'val', 'left', 'right', 'offer', 'poll', 'isEmpty'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['p', 'nodeP'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (['q', 'nodeQ'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SameTreeVisualizer;