import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Network, MoveDown, Layers as StackIcon, ShieldCheck, XCircle
} from 'lucide-react';

const APPROACHES = {
  recursive: {
    id: 'recursive',
    title: '1. Recursive (Min/Max)',
    subtitle: 'Optimal: O(N) Time, O(H) Space.',
    icon: <Network size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    code: `class Solution {
    public boolean isValidBST(TreeNode root) {
        return isValid(root, null, null);
    }
    
    private boolean isValid(TreeNode node, Integer min, Integer max) {
        if (node == null) {
            return true;
        }
        
        if (min != null && node.val <= min) {
            return false;
        }
        
        if (max != null && node.val >= max) {
            return false;
        }
        
        boolean leftValid = isValid(node.left, min, node.val);
        boolean rightValid = isValid(node.right, node.val, max);
        
        return leftValid && rightValid;
    }
}`,
    explanation: "A Binary Search Tree requires that EVERY node in a left subtree is strictly less than the current node, and EVERY node in a right subtree is strictly greater. It's not enough to just check a node's immediate children. We use a Top-Down recursive approach, passing down an allowable 'min' and 'max' boundary for each node. When we branch left, the current node's value becomes the new 'max' boundary. When we branch right, the current node's value becomes the new 'min' boundary. If any node violates its inherited boundaries, the tree is invalid."
  },
  iterativeInorder: {
    id: 'iterativeInorder',
    title: '2. Iterative In-order',
    subtitle: 'Standard: O(N) Time, O(H) Space.',
    icon: <ListOrdered size={16} />,
    complexity: 'Time: O(N) | Space: O(H)',
    code: `class Solution {
    public boolean isValidBST(TreeNode root) {
        Stack<TreeNode> stack = new Stack<>();
        TreeNode curr = root;
        Integer prev = null;
        
        while (curr != null || !stack.isEmpty()) {
            // Traverse as far left as possible
            while (curr != null) {
                stack.push(curr);
                curr = curr.left;
            }
            
            // Process the node
            curr = stack.pop();
            
            // Check strictly increasing order
            if (prev != null && curr.val <= prev) {
                return false;
            }
            
            prev = curr.val;
            
            // Move right
            curr = curr.right;
        }
        
        return true;
    }
}`,
    explanation: "An inherent property of a valid Binary Search Tree is that an In-order Traversal (Left -> Root -> Right) will visit the nodes in strictly ascending order. We can simulate this traversal iteratively using a Stack. We dive all the way to the leftmost node, popping and evaluating nodes one by one. By keeping track of the previously visited value ('prev'), we just need to ensure that the current node's value is always strictly greater than 'prev'. If we ever encounter a drop in value, the BST is invalid."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">98. Validate Binary Search Tree</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given the <code>root</code> of a binary tree, determine if it is a valid binary search tree (BST).
        </p>

        <p className="text-lg leading-relaxed">
          A <strong>valid BST</strong> is defined as follows:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li>The left <span className="underline decoration-violet-500 decoration-2 font-semibold">subtree</span> of a node contains only nodes with keys <strong>less than</strong> the node's key.</li>
            <li>The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node's key.</li>
            <li>Both the left and right subtrees must also be binary search trees.</li>
        </ul>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-3 flex flex-col items-center">
              <svg width="120" height="120" viewBox="0 0 120 120" className="mb-2">
                 <line x1="60" y1="20" x2="30" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                 <line x1="60" y1="20" x2="90" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                 <circle cx="60" cy="20" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="60" y="25" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">2</text>
                 <circle cx="30" cy="80" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="30" y="85" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">1</text>
                 <circle cx="90" cy="80" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="90" y="85" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">3</text>
              </svg>
              <div className="w-full text-left">
                  <p><span className="text-slate-400 font-bold">Input:</span> root = [2,1,3]</p>
                  <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-3 flex flex-col items-center">
              <svg width="180" height="160" viewBox="0 0 180 160" className="mb-2">
                 <line x1="90" y1="20" x2="40" y2="70" stroke="#cbd5e1" strokeWidth="2" />
                 <line x1="90" y1="20" x2="140" y2="70" stroke="#cbd5e1" strokeWidth="2" />
                 <line x1="140" y1="70" x2="100" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                 <line x1="140" y1="70" x2="180" y2="130" stroke="#cbd5e1" strokeWidth="2" />
                 
                 <circle cx="90" cy="20" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="90" y="25" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">5</text>
                 
                 <circle cx="40" cy="70" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="40" y="75" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">1</text>
                 
                 <circle cx="140" cy="70" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="140" y="75" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">4</text>
                 
                 <circle cx="100" cy="130" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="100" y="135" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">3</text>
                 
                 <circle cx="180" cy="130" r="16" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
                 <text x="180" y="135" textAnchor="middle" fill="#334155" fontSize="14" fontWeight="bold">6</text>
              </svg>
              <div className="w-full text-left">
                  <p><span className="text-slate-400 font-bold">Input:</span> root = [5,1,4,null,null,3,6]</p>
                  <p><span className="text-slate-400 font-bold">Output:</span> false</p>
                  <p className="text-slate-500 italic mt-2 text-xs font-sans">// Explanation: The root node's value is 5 but its right child's value is 4.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the tree is in the range <code>[1, 10<sup>4</sup>]</code>.</li>
              <li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Helper to parse array into a tree structure for visualization
const parseTree = (arr) => {
    if (!arr || arr.length === 0) return [];
    
    let nodes = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== null && arr[i] !== "null") {
            let val = parseInt(arr[i]);
            if (!isNaN(val)) {
                nodes.push({ id: i, val: val, left: 2 * i + 1, right: 2 * i + 2 });
            } else {
                nodes.push(null);
            }
        } else {
            nodes.push(null);
        }
    }
    return nodes;
};

const ValidateBSTVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('recursive');
  const [treeInput, setTreeInput] = useState('5, 1, 4, null, null, 3, 6');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let rawArr = treeInput.split(',').map(s => s.trim());
    if (rawArr.length === 0 || rawArr[0] === '') rawArr = ['5', '1', '4', 'null', 'null', '3', '6'];
    
    // Safecap for UI rendering (prevent massive trees)
    if (rawArr.length > 31) rawArr = rawArr.slice(0, 31); 
    
    const treeNodes = parseTree(rawArr);
    return { arr: rawArr, nodes: treeNodes };
  }, [treeInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { nodes } = parsedData;
    
    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (!nodes || nodes.length === 0 || nodes[0] === null) {
        addStep("Init", "Tree is empty.", 1, { action: 'success', isSuccess: true, ans: true });
        return steps;
    }

    if (selectedApproachId === 'recursive') {
        
        addStep(
            "Begin Algorithm", 
            `Line 2-3: public boolean isValidBST(TreeNode root)\n\nWe start by calling our helper method 'isValid' passing the root of the tree and boundless min/max limits.\nreturn isValid(root, null, null);`, 
            3, 
            { currNodeId: 0, min: null, max: null, callStack: [], action: 'init' }
        );

        let callStack = [];
        
        // Helper recursive simulator
        const simulateIsValid = (nodeId, min, max, depth) => {
            if (steps.length > 1000) return false; // Hard limit

            let stackSnapshot = [...callStack];
            let isNull = nodeId >= nodes.length || nodes[nodeId] === null;
            let nodeVal = isNull ? null : nodes[nodeId].val;
            
            addStep(
                "Function Call: isValid", 
                `Line 6: private boolean isValid(TreeNode node, Integer min, Integer max)\n\nEntering recursive call.\nNode Value: ${isNull ? 'null' : nodeVal}\nMin Boundary: ${min === null ? 'null' : min}\nMax Boundary: ${max === null ? 'null' : max}`, 
                6, 
                { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'evaluating' }
            );

            addStep(
                "Check Null Condition", 
                `Line 7: if (node == null)\n\nIs the current node null? ${isNull ? 'Yes.' : 'No.'}`, 
                7, 
                { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'checkNull' }
            );

            if (isNull) {
                addStep(
                    "Null Base Case", 
                    `Line 8: return true;\n\nAn empty tree/node is technically a valid BST. Returning true up the call stack.`, 
                    8, 
                    { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'returnTrue' }
                );
                return true;
            }

            addStep(
                "Check Min Boundary", 
                `Line 11: if (min != null && node.val <= min)\n\nOur constraints say this node's value (${nodeVal}) must be strictly GREATER than the Min Boundary (${min === null ? 'None' : min}).\nIs ${nodeVal} <= ${min}? ${min !== null && nodeVal <= min ? 'YES! Violation.' : 'No, it is safe.'}`, 
                11, 
                { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'checkMin' }
            );

            if (min !== null && nodeVal <= min) {
                addStep(
                    "Min Boundary Violated", 
                    `Line 12: return false;\n\nThe tree is invalid because ${nodeVal} is not strictly greater than its ancestor boundary of ${min}. Returning false immediately.`, 
                    12, 
                    { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'invalid' }
                );
                return false;
            }

            addStep(
                "Check Max Boundary", 
                `Line 15: if (max != null && node.val >= max)\n\nOur constraints say this node's value (${nodeVal}) must be strictly LESS than the Max Boundary (${max === null ? 'None' : max}).\nIs ${nodeVal} >= ${max}? ${max !== null && nodeVal >= max ? 'YES! Violation.' : 'No, it is safe.'}`, 
                15, 
                { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'checkMax' }
            );

            if (max !== null && nodeVal >= max) {
                addStep(
                    "Max Boundary Violated", 
                    `Line 16: return false;\n\nThe tree is invalid because ${nodeVal} is not strictly less than its ancestor boundary of ${max}. Returning false immediately.`, 
                    16, 
                    { currNodeId: nodeId, min, max, callStack: stackSnapshot, action: 'invalid' }
                );
                return false;
            }

            callStack.push({ id: nodeId, val: nodeVal });
            let newStack = [...callStack];

            addStep(
                "Branch Left", 
                `Line 19: boolean leftValid = isValid(node.left, min, node.val);\n\nWe passed the checks! Now we must recursively validate the LEFT subtree.\nRule: All nodes in the left subtree must be LESS than the current node.\nWe pass down '${nodeVal}' as the new MAX boundary.`, 
                19, 
                { currNodeId: nodeId, min, max, callStack: newStack, action: 'branchLeft', nextId: nodes[nodeId].left }
            );

            let leftValid = simulateIsValid(nodes[nodeId].left, min, nodeVal, depth + 1);
            
            if (!leftValid) {
                callStack.pop();
                addStep(
                    "Left Subtree Invalid", 
                    `Line 22: return leftValid && rightValid;\n\nThe left subtree returned FALSE, so this entire tree is invalid. We propagate the false result up.`, 
                    22, 
                    { currNodeId: nodeId, min, max, callStack: [...callStack], action: 'invalid' }
                );
                return false;
            }

            addStep(
                "Branch Right", 
                `Line 20: boolean rightValid = isValid(node.right, node.val, max);\n\nThe left subtree was valid! Now we recursively validate the RIGHT subtree.\nRule: All nodes in the right subtree must be GREATER than the current node.\nWe pass down '${nodeVal}' as the new MIN boundary.`, 
                20, 
                { currNodeId: nodeId, min, max, callStack: newStack, action: 'branchRight', nextId: nodes[nodeId].right }
            );

            let rightValid = simulateIsValid(nodes[nodeId].right, nodeVal, max, depth + 1);

            callStack.pop();
            let finalStack = [...callStack];

            let isNodeValid = leftValid && rightValid;
            
            if (isNodeValid) {
                addStep(
                    "Subtree Valid", 
                    `Line 22: return leftValid && rightValid;\n\nBoth left and right subtrees returned TRUE. Node ${nodeVal} and its descendants are a valid BST! Returning true up the stack.`, 
                    22, 
                    { currNodeId: nodeId, min, max, callStack: finalStack, action: 'returnTrue' }
                );
            } else {
                addStep(
                    "Right Subtree Invalid", 
                    `Line 22: return leftValid && rightValid;\n\nThe right subtree returned FALSE, so this entire tree is invalid. Propagating false.`, 
                    22, 
                    { currNodeId: nodeId, min, max, callStack: finalStack, action: 'invalid' }
                );
            }

            return isNodeValid;
        };

        let finalRes = simulateIsValid(0, null, null, 0);
        
        addStep(
            "Algorithm Complete", 
            `Line 3: return isValid(root, null, null);\n\nThe recursion has entirely finished.\nFinal result: The tree is ${finalRes ? 'a Valid' : 'an Invalid'} Binary Search Tree.`, 
            3, 
            { currNodeId: null, min: null, max: null, callStack: [], action: 'success', isSuccess: true, ans: finalRes }
        );

    } else if (selectedApproachId === 'iterativeInorder') {
        
        addStep(
            "Initialize Variables", 
            `Line 3-5: Initialize iterative state.\n\n• 'stack' to keep track of our traversal path.\n• 'curr' pointer starts at the root.\n• 'prev' tracks the value of the previously evaluated node (starts as null).`, 
            5, 
            { currNodeId: 0, prev: null, stack: [], action: 'init' }
        );
        
        let stack = [];
        let curr = 0; // index in nodes array
        let prev = null;
        let iter = 0;

        while ((curr !== null || stack.length > 0) && iter++ < 100) {
            let isCurrNull = curr === null || curr >= nodes.length || nodes[curr] === null;
            
            addStep(
                "Evaluate Outer Loop", 
                `Line 7: while (curr != null || !stack.isEmpty())\n\nIs 'curr' pointing to a node OR is there something in the stack?\nYes. We continue traversal.`, 
                7, 
                { currNodeId: isCurrNull ? null : curr, prev, stack: [...stack], action: 'outerLoop' }
            );

            while (!isCurrNull) {
                addStep(
                    "Evaluate Inner Loop (Go Left)", 
                    `Line 9: while (curr != null)\n\n'curr' is at node ${nodes[curr].val}. We must travel as far left as mathematically possible to find the smallest element first.`, 
                    9, 
                    { currNodeId: curr, prev, stack: [...stack], action: 'innerLoop' }
                );

                stack.push(curr);
                addStep(
                    "Push to Stack", 
                    `Line 10: stack.push(curr);\n\nWe push node ${nodes[curr].val} onto the stack so we can process it later after exploring its left children.`, 
                    10, 
                    { currNodeId: curr, prev, stack: [...stack], action: 'push' }
                );
                
                curr = nodes[curr].left;
                isCurrNull = curr === null || curr >= nodes.length || nodes[curr] === null;
                
                addStep(
                    "Move Left", 
                    `Line 11: curr = curr.left;\n\nWe shift our 'curr' pointer to the left child.`, 
                    11, 
                    { currNodeId: isCurrNull ? null : curr, prev, stack: [...stack], action: 'moveLeft' }
                );
            }
            
            addStep(
                "Inner Loop Ends", 
                `Line 9: while (curr != null)\n\n'curr' is null! We have hit the leftmost bottom boundary. We exit the inner loop.`, 
                9, 
                { currNodeId: null, prev, stack: [...stack], action: 'innerEnd' }
            );

            curr = stack.pop();
            let poppedVal = nodes[curr].val;
            
            addStep(
                "Pop & Process Node", 
                `Line 15: curr = stack.pop();\n\nWe pop the top node from the stack. It is time to process node ${poppedVal}. In an in-order traversal, this should be the next smallest element in the entire tree.`, 
                15, 
                { currNodeId: curr, prev, stack: [...stack], action: 'pop' }
            );

            addStep(
                "Validate Strictly Increasing Order", 
                `Line 18: if (prev != null && curr.val <= prev)\n\nWe check if this node's value (${poppedVal}) is strictly GREATER than the previously processed node's value (${prev === null ? 'None' : prev}).\nIs ${poppedVal} <= ${prev}? ${prev !== null && poppedVal <= prev ? 'YES! Violation.' : 'No, it is valid.'}`, 
                18, 
                { currNodeId: curr, prev, stack: [...stack], action: 'compare' }
            );

            if (prev !== null && poppedVal <= prev) {
                addStep(
                    "Validation Failed", 
                    `Line 19: return false;\n\nThe strictly increasing property of the In-order traversal is broken (${poppedVal} <= ${prev}). This is not a valid BST! Return false.`, 
                    19, 
                    { currNodeId: curr, prev, stack: [...stack], action: 'invalid', isSuccess: true, ans: false }
                );
                break;
            }

            prev = poppedVal;
            addStep(
                "Update Previous Tracker", 
                `Line 22: prev = curr.val;\n\nWe successfully validated this node. We now record its value (${prev}) to compare against the next node we process.`, 
                22, 
                { currNodeId: curr, prev, stack: [...stack], action: 'updatePrev' }
            );

            curr = nodes[curr].right;
            isCurrNull = curr === null || curr >= nodes.length || nodes[curr] === null;
            addStep(
                "Move Right", 
                `Line 25: curr = curr.right;\n\nWe have explored this node and its left children. We now shift our focus to its right subtree.`, 
                25, 
                { currNodeId: isCurrNull ? null : curr, prev, stack: [...stack], action: 'moveRight' }
            );
        }
        
        let isSuccessAns = steps[steps.length - 1]?.state?.ans;
        if (isSuccessAns === undefined) {
             addStep(
                "Algorithm Complete", 
                `Line 28: return true;\n\nThe traversal finished, the stack is empty, and we never found a decreasing value. The entire tree is a valid Binary Search Tree!`, 
                28, 
                { currNodeId: null, prev, stack: [...stack], action: 'success', isSuccess: true, ans: true }
            );
        }
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
  const { isSuccess, ans, currNodeId, min, max, callStack, prev, stack, action } = state;
  const { nodes } = parsedData;

  // Visual Tree Layout Engine
  const getTreeLayout = () => {
      let layout = [];
      let edges = [];
      const boxW = 44; 
      const boxH = 44;
      
      // We will place nodes in a grid. Depth represents Y. X is based on binary position.
      const maxDepth = Math.floor(Math.log2(nodes.length + 1));
      const widthUnits = Math.pow(2, maxDepth); // Max leaf nodes possible
      
      const calcPos = (idx, d, wOffset) => {
          if (idx >= nodes.length || nodes[idx] === null) return null;
          
          // Calculate X: Center based on depth offset
          let segmentWidth = 100 / Math.pow(2, d);
          let startX = segmentWidth * wOffset;
          let cx = startX + (segmentWidth / 2);
          
          // Calculate Y: Evenly distribute from top to bottom
          let cy = (d * 22) + 10; 
          
          let nodeLayout = { id: idx, val: nodes[idx].val, cx, cy, realX: cx, realY: cy };
          layout.push(nodeLayout);

          let leftIdx = nodes[idx].left;
          let rightIdx = nodes[idx].right;

          let leftChild = calcPos(leftIdx, d + 1, wOffset * 2);
          if (leftChild) {
              edges.push({ x1: cx, y1: cy, x2: leftChild.cx, y2: leftChild.cy });
          }

          let rightChild = calcPos(rightIdx, d + 1, (wOffset * 2) + 1);
          if (rightChild) {
              edges.push({ x1: cx, y1: cy, x2: rightChild.cx, y2: rightChild.cy });
          }

          return nodeLayout;
      }
      
      if (nodes.length > 0 && nodes[0] !== null) {
          calcPos(0, 0, 0);
      }
      return { layout, edges };
  };

  const { layout, edges } = useMemo(() => getTreeLayout(), [nodes]);

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <ShieldCheck className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Validate BST</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 98</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Trees / DFS / In-order</span>
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
                <div className="grid grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? (ans ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500') : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme="violet" />
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
                    
                    {selectedApproachId === 'recursive' ? (
                        <div className="grid grid-cols-3 gap-3">
                            <VariableCard label="Curr Node" val={currNodeId !== null && nodes[currNodeId] !== null ? nodes[currNodeId].val : "null"} color="violet" active={currNodeId !== null} />
                            <VariableCard label="Min Bounds" val={min !== null ? min : "None"} color="sky" active={min !== undefined} />
                            <VariableCard label="Max Bounds" val={max !== null ? max : "None"} color="rose" active={max !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Curr Node" val={currNodeId !== null && nodes[currNodeId] !== null ? nodes[currNodeId].val : "null"} color="violet" active={currNodeId !== undefined} />
                            <VariableCard label="Prev Node" val={prev !== null ? prev : "null"} color="amber" active={prev !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Tree Nodes (Level Order Array)</label>
                        <input type="text" value={treeInput} onChange={(e) => { setTreeInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="5, 1, 4, null, null, 3, 6" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[180px] relative overflow-hidden group shrink-0 ${isSuccess ? (ans ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? (ans ? <Check size={100}/> : <XCircle size={100}/>) : <Network size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? (ans ? "text-emerald-400" : "text-rose-400") : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? (ans ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[120px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex items-start justify-center w-full h-full relative z-10 gap-8 h-[400px]">
                      
                      {/* Tree Render Canvas */}
                      <div className="relative w-[300px] md:w-[400px] h-[300px] md:h-[400px]">
                          {/* Draw Edges */}
                          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                              {edges.map((e, idx) => (
                                  <line 
                                      key={idx} 
                                      x1={`${e.x1}%`} y1={`${e.y1}%`} 
                                      x2={`${e.x2}%`} y2={`${e.y2}%`} 
                                      stroke="#cbd5e1" 
                                      strokeWidth="3" 
                                      strokeLinecap="round"
                                      className="transition-all duration-500"
                                  />
                              ))}
                          </svg>

                          {/* Draw Nodes */}
                          {layout.map((n) => {
                              let isCurrent = currNodeId === n.id && !isSuccess;
                              let isInvalid = action === 'invalid' && currNodeId === n.id;
                              let isStackPop = action === 'pop' && currNodeId === n.id;
                              let isBranchingLeft = action === 'branchLeft' && state.nextId === n.id;
                              let isBranchingRight = action === 'branchRight' && state.nextId === n.id;

                              let boxClass = "absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-4 font-mono font-black text-base md:text-lg flex items-center justify-center transition-all duration-500 z-10 ";
                              
                              if (isCurrent) {
                                  boxClass += "bg-violet-100 border-violet-500 text-violet-900 scale-125 shadow-lg ring-4 ring-violet-400/30 z-30";
                              } else if (isInvalid) {
                                  boxClass += "bg-rose-100 border-rose-500 text-rose-900 scale-125 shadow-lg ring-4 ring-rose-400/30 z-30 animate-pulse";
                              } else if (isStackPop) {
                                  boxClass += "bg-amber-100 border-amber-500 text-amber-900 scale-110 shadow-md z-20";
                              } else if (isBranchingLeft || isBranchingRight) {
                                  boxClass += "bg-sky-50 border-sky-400 text-sky-800 scale-110 shadow-md z-20 animate-bounce";
                              } else {
                                  boxClass += "bg-white border-slate-300 text-slate-600 shadow-sm hover:scale-110";
                              }

                              return (
                                  <div 
                                      key={`node-${n.id}`} 
                                      className={boxClass}
                                      style={{ left: `${n.cx}%`, top: `${n.cy}%` }}
                                  >
                                      {n.val}
                                      {isCurrent && (
                                         <div className="absolute -top-6 text-[10px] bg-violet-600 text-white px-1.5 py-0.5 rounded tracking-widest uppercase">Curr</div>
                                      )}
                                  </div>
                              );
                          })}
                      </div>

                      {/* Right Side Aux Visualizers */}
                      <div className="flex flex-col gap-6 w-32 shrink-0">
                          {/* Call Stack / Stack Visualizer */}
                          {selectedApproachId === 'recursive' && callStack !== undefined && (
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest font-mono flex items-center gap-1"><StackIcon size={12}/> Call Stack</span>
                                  <div className="flex flex-col-reverse justify-start border-x-2 border-b-2 border-slate-300 rounded-b-xl w-full bg-slate-50 min-h-[140px] p-2 gap-1.5 shadow-inner overflow-y-auto">
                                      {callStack.map((stk, idx) => (
                                          <div key={idx} className="bg-sky-500 text-white text-xs font-mono font-bold rounded-lg py-1 text-center shadow-sm truncate px-1">
                                              isValid({stk.val})
                                          </div>
                                      ))}
                                      {callStack.length === 0 && <div className="text-center text-[10px] text-slate-300 font-mono mt-auto mb-2 tracking-widest uppercase">Empty</div>}
                                  </div>
                              </div>
                          )}

                          {selectedApproachId === 'iterativeInorder' && stack !== undefined && (
                              <div className="flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest font-mono flex items-center gap-1"><StackIcon size={12}/> Stack</span>
                                  <div className="flex flex-col-reverse justify-start border-x-2 border-b-2 border-slate-300 rounded-b-xl w-full bg-slate-50 min-h-[140px] p-2 gap-1.5 shadow-inner overflow-y-auto">
                                      {stack.map((nodeIdx, idx) => (
                                          <div key={idx} className="bg-amber-500 text-white text-sm font-mono font-bold rounded-lg py-1.5 text-center shadow-sm">
                                              {nodes[nodeIdx].val}
                                          </div>
                                      ))}
                                      {stack.length === 0 && <div className="text-center text-[10px] text-slate-300 font-mono mt-auto mb-2 tracking-widest uppercase">Empty</div>}
                                  </div>
                              </div>
                          )}

                          {/* Order visualizer for Iterative */}
                          {selectedApproachId === 'iterativeInorder' && (
                              <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm flex flex-col items-center text-center mt-auto">
                                  <span className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest font-mono">In-order Prev</span>
                                  <div className="text-xl font-black font-mono text-amber-600 bg-amber-50 px-4 py-1 rounded-xl border border-amber-200 w-full truncate">
                                      {prev !== null && prev !== undefined ? prev : 'null'}
                                  </div>
                              </div>
                          )}
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans ? <Check size={32} strokeWidth={3}/> : <XCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">VALIDATION COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${ans ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {ans ? `Tree is a Valid BST!` : `Tree violates BST properties.`}
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
                <Network className="text-violet-600"/> The BST Property Trap
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The most common mistake when verifying a Binary Search Tree is only checking if a node is greater than its immediate left child and less than its immediate right child. This is <strong>incorrect</strong>. A valid BST requires that a node is greater than <strong>all</strong> nodes in its left subtree, and less than <strong>all</strong> nodes in its right subtree.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <MoveDown size={18}/> The Top-Down Boundaries
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            To ensure a node obeys rules set by its ancestors deep up the tree, we pass down dynamic bounds: <code>min</code> and <code>max</code>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            When traveling <strong>Left</strong>:<br/>
                            The current node becomes the absolute ceiling. We update <code>max = node.val</code>.<br/><br/>
                            When traveling <strong>Right</strong>:<br/>
                            The current node becomes the absolute floor. We update <code>min = node.val</code>.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> In-order Property
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            There is a beautiful mathematical relationship between Binary Search Trees and In-order Traversal (Left -&gt; Root -&gt; Right).
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>An In-order traversal of a valid BST will ALWAYS yield a strictly ascending, sorted array.</p>
                            <p>Therefore, we don't even need to track `min` and `max` limits if we use an iterative stack to traverse the tree in-order. We simply track the <code>prev</code> value we printed and verify <code>curr.val &gt; prev</code>.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <AlertCircle size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The Integer Overflow Edge Case</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-2 gap-8">
                        <div className="col-span-2">
                            A classic LeetCode trap is testing with a node value equal to <code>Integer.MAX_VALUE</code> or <code>Integer.MIN_VALUE</code>.
                        </div>
                        <div>
                            <span className="text-rose-400 font-bold block mb-2">The Bug:</span>
                            <p>If you initialize your min/max limits using standard Java primitives <code>int min = Integer.MIN_VALUE</code>, and the tree actually contains <code>Integer.MIN_VALUE</code> as a valid node, your comparison logic will fail or return false positives.</p>
                        </div>
                        <div>
                            <span className="text-emerald-400 font-bold block mb-2">The Fix:</span>
                            <p>Use the wrapper class <code>Integer</code> (which allows <code>null</code> to represent infinity), or use 64-bit <code>long</code> variables (<code>Long.MIN_VALUE</code>) to safely out-scale the 32-bit test cases.</p>
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
                        "To determine if the tree is a valid BST, I avoided the naive mistake of only checking immediate children. Instead, I used a Top-Down Recursive DFS approach passing explicit `min` and `max` constraints. Starting with `null` boundaries representing infinity, whenever I branched left, I updated the `max` boundary to the current node's value, and branching right updated the `min`. If any node broke its inherited constraints, I immediately returned false. I used `Integer` objects instead of primitive `int`s to safely handle boundary edge cases involving `Integer.MAX_VALUE`. This runs in $O(N)$ time visiting each node exactly once."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Recursive vs Iterative?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Both have identical Big-O complexities. The Recursive Min/Max approach is often cleaner to write and easier to understand. The Iterative In-order approach is brilliant because it doesn't require maintaining multiple variables for bounds (just `prev`), but writing a correct iterative stack traversal from scratch under pressure can be slightly more error-prone for some candidates. Both are excellent answers.
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
                                <p className="text-[10px] text-slate-500 mt-1">In the worst case (where the tree is valid), we must visit every single node in the tree exactly once to confirm it meets the constraints.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(H)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Where $H$ is the height of the tree. This is dictated by the maximum depth of the implicit recursive call stack (or explicit Stack object). In a balanced tree, space is $O(\log N)$. In a skewed tree, it degrades to $O(N)$.</p>
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

const VariableCard: React.FC<{ label: string; val: any; color: string; active: boolean }> = ({ label, val, color, active }) => {
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|isValid|curr|node|root|min|max|prev|stack|left|right|leftValid|rightValid|val|push|pop|isEmpty)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isValid', 'push', 'pop', 'isEmpty'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['node', 'root', 'curr'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['min', 'max', 'prev'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (['left', 'right', 'leftValid', 'rightValid', 'val'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default ValidateBSTVisualizer;