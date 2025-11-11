import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitBranch, Share2, 
  ArrowRight, ArrowLeft, XSquare, PlusSquare, SplitSquareHorizontal, Network,
  Database, Archive
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: 'Backtracking (Divide & Conquer)',
    subtitle: 'Optimal: O(4^n / n^(3/2)) Time.',
    icon: <GitBranch size={16} />,
    complexity: 'Time: O(Catalan(n)) | Space: O(Catalan(n))',
    code: `class Solution {
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        return build(1, n);
    }
    
    private List<TreeNode> build(int start, int end) {
        List<TreeNode> res = new ArrayList<>();
        
        // Base case: empty subtree
        if (start > end) {
            res.add(null);
            return res;
        }
        
        // BACKTRACKING: Try every number in the range as the root
        for (int i = start; i <= end; i++) {
            // Generate all possible left and right subtrees
            List<TreeNode> leftTrees = build(start, i - 1);
            List<TreeNode> rightTrees = build(i + 1, end);
            
            // Cartesian product: connect every left with every right
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    TreeNode root = new TreeNode(i);
                    root.left = left;
                    root.right = right;
                    res.add(root); // Add valid tree
                }
            }
        }
        
        return res;
    }
}`,
    explanation: "This approach perfectly embodies Backtracking combined with Divide and Conquer. To build all valid Binary Search Trees (BSTs), we systematically choose a number `i` to be the root. Because it's a BST, every number strictly less than `i` MUST go into the left subtree, and every number strictly greater MUST go into the right subtree (Divide). We recursively generate all possible left and right subtrees, and then backtrack by trying the next possible root `i+1`. We perform a Cartesian product to link every valid left/right combination to our root, satisfying the Binary Tree constraints!"
  },
  dpMemo: {
    id: 'dpMemo',
    title: 'Dynamic Programming (Memo)',
    subtitle: 'Optimized: Caches Subtrees.',
    icon: <Database size={16} />,
    complexity: 'Time: O(Catalan(n)) | Space: O(Catalan(n))',
    code: `class Solution {
    public List<TreeNode> generateTrees(int n) {
        if (n == 0) return new ArrayList<>();
        return build(1, n, new HashMap<>());
    }
    
    private List<TreeNode> build(int start, int end, Map<String, List<TreeNode>> memo) {
        List<TreeNode> res = new ArrayList<>();
        if (start > end) {
            res.add(null);
            return res;
        }
        
        String key = start + "-" + end;
        if (memo.containsKey(key)) {
            return memo.get(key); // Return cached subtrees!
        }
        
        for (int i = start; i <= end; i++) {
            List<TreeNode> leftTrees = build(start, i - 1, memo);
            List<TreeNode> rightTrees = build(i + 1, end, memo);
            
            for (TreeNode left : leftTrees) {
                for (TreeNode right : rightTrees) {
                    TreeNode root = new TreeNode(i);
                    root.left = left;
                    root.right = right;
                    res.add(root);
                }
            }
        }
        
        memo.put(key, res); // Cache before returning
        return res;
    }
}`,
    explanation: "This Dynamic Programming (Memoization) approach leverages the fact that the same subranges `[start, end]` are requested multiple times during the Cartesian product combinations. We use a HashMap to cache the list of generated subtrees for each range `start-end`. Whenever a recursive call asks for a range we've already computed, we instantly return the cached list in O(1) time. This prevents massive redundant calculations across overlapping subproblems, heavily optimizing the Backtracking/Tree building process!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">95. Unique Binary Search Trees II</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an integer <code>n</code>, return <em>all the structurally unique <strong>BST's</strong> (binary search trees), which has exactly <code>n</code> nodes of unique values from <code>1</code> to <code>n</code></em>. Return the answer in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <div className="flex justify-center gap-8 opacity-80 overflow-x-auto pb-4">
                  <pre className="text-center"> 1 <br/>  \ <br/>   3<br/>  / <br/> 2  </pre>
                  <pre className="text-center"> 1 <br/>  \ <br/>   2<br/>    \ <br/>     3</pre>
                  <pre className="text-center">  2  <br/> / \ <br/>1   3</pre>
                  <pre className="text-center">   3<br/>  / <br/> 2  <br/>/   <br/>1   </pre>
                  <pre className="text-center">   3<br/>  / <br/> 1  <br/>  \ <br/>   2</pre>
              </div>
              <p><span className="text-slate-400 font-bold">Input:</span> n = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1,null,2,null,3],[1,null,3,2],[2,1,3],[3,1,null,null,2],[3,2,null,1]]</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [[1]]</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= n &lt;= 8</code></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

// Helper for unique ID generation in trees to prevent React key collisions
let globalId = 0;
const getId = () => `node_${globalId++}`;

const UniqueBSTVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('backtracking');
  
  const [nInput, setNInput] = useState('3');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let n = parseInt(nInput.trim(), 10);
    if (isNaN(n) || n < 1) n = 1;
    
    // UI Safety cap. Catalan(4) = 14 trees, Catalan(5) = 42 trees.
    // 4 is safe for trace size and UI rendering.
    if (n > 4) n = 4;

    return { n };
  }, [nInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { n } = parsedData;
    globalId = 0;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'backtracking' || selectedApproachId === 'dpMemo') {
        
        let memo = {};

        addStep(
            "Initialization", 
            selectedApproachId === 'dpMemo' ? `Line 3-4: if (n == 0) ... return build(1, ${n}, memo);\n\nStarting DP builder with full range [1, ${n}] and an empty cache.` : `Line 3-4: if (n == 0) ... return build(1, ${n});\n\nStarting the recursive backtracking builder with the full range [1, ${n}].`, 
            4, 
            { n, start: 1, end: n, i: null, depth: 0, action: 'init', leftTrees: null, rightTrees: null, currentRes: [], memo: {...memo} }
        );

        const build = (start, end, depth) => {
            if (steps.length > 2500) return [];

            addStep(
                `Enter build(${start}, ${end})`, 
                selectedApproachId === 'dpMemo' ? `Line 7: private List<TreeNode> build(int start, int end, Map memo)\n\nCreating trees for range [${start}, ${end}].` : `Line 7: private List<TreeNode> build(int start, int end)\n\nCreating trees for range [${start}, ${end}].`, 
                7, 
                { n, start, end, i: null, depth, action: 'call', leftTrees: null, rightTrees: null, currentRes: [], memo: {...memo} }
            );

            if (start > end) {
                addStep(
                    `Base Case (Empty Range)`, 
                    `Line 9-10: if (${start} > ${end}) { res.add(null); return res; }\n\nThe range is empty. We return a list containing exactly one 'null' node to represent an empty subtree.`, 
                    selectedApproachId === 'dpMemo' ? 10 : 12, 
                    { n, start, end, i: null, depth, action: 'base', leftTrees: null, rightTrees: null, currentRes: [null], memo: {...memo} }
                );
                return [null];
            }

            let key = `${start}-${end}`;
            if (selectedApproachId === 'dpMemo') {
                if (memo[key]) {
                    addStep(
                        `Cache Hit! [${key}]`, 
                        `Line 15: if (memo.containsKey("${key}")) return memo.get("${key}");\n\nWe already computed the subtrees for [${start}, ${end}]! Returning ${memo[key].length} cached trees.`, 
                        16, 
                        { n, start, end, i: null, depth, action: 'cacheHit', leftTrees: null, rightTrees: null, currentRes: memo[key], memo: {...memo}, cacheKey: key }
                    );
                    return memo[key];
                }
            }

            let res = [];

            for (let i = start; i <= end; i++) {
                let lineOffset = selectedApproachId === 'dpMemo' ? 3 : 0;
                addStep(
                    `Select Root (i=${i})`, 
                    `Line ${16 + lineOffset}: for (int i = ${start}; i <= ${end}; i++)\n\nWe choose ${i} to be the root of our subtree.`, 
                    16 + lineOffset, 
                    { n, start, end, i, depth, action: 'chooseRoot', leftTrees: null, rightTrees: null, currentRes: [...res], memo: {...memo} }
                );

                addStep(
                    `Recurse Left Subtrees`, 
                    `Line ${18 + lineOffset}: List<TreeNode> leftTrees = build(${start}, ${i - 1});\n\nAsking recursion to build all possible left subtrees using numbers strictly less than ${i} (Range: [${start}, ${i-1}]).`, 
                    18 + lineOffset, 
                    { n, start, end, i, depth, action: 'recurseLeft', leftTrees: null, rightTrees: null, currentRes: [...res], memo: {...memo} }
                );
                let leftTrees = build(start, i - 1, depth + 1);

                addStep(
                    `Recurse Right Subtrees`, 
                    `Line ${19 + lineOffset}: List<TreeNode> rightTrees = build(${i + 1}, ${end});\n\nAsking recursion to build all possible right subtrees using numbers strictly greater than ${i} (Range: [${i+1}, ${end}]).`, 
                    19 + lineOffset, 
                    { n, start, end, i, depth, action: 'recurseRight', leftTrees, rightTrees: null, currentRes: [...res], memo: {...memo} }
                );
                let rightTrees = build(i + 1, end, depth + 1);

                addStep(
                    `Cartesian Product`, 
                    `Line ${22 + lineOffset}-23: for (TreeNode left : leftTrees) { for (TreeNode right : rightTrees) }\n\nWe have ${leftTrees.length} left subtrees and ${rightTrees.length} right subtrees. We will create ${leftTrees.length * rightTrees.length} combinations using ${i} as the root.`, 
                    22 + lineOffset, 
                    { n, start, end, i, depth, action: 'combineStart', leftTrees, rightTrees, currentRes: [...res], memo: {...memo} }
                );

                for (let left of leftTrees) {
                    for (let right of rightTrees) {
                        let root = { val: i, left, right, id: getId() };
                        res.push(root);

                        addStep(
                            `Connect & Add`, 
                            `Line ${24 + lineOffset}-${27 + lineOffset}: root.left = left; root.right = right; res.add(root);\n\nAttached a left/right combination to root ${i} and added to our local result list.`, 
                            27 + lineOffset, 
                            { n, start, end, i, depth, action: 'addTree', leftTrees, rightTrees, activeLeft: left, activeRight: right, newTree: root, currentRes: [...res], memo: {...memo} }
                        );
                    }
                }
            }

            if (selectedApproachId === 'dpMemo') {
                memo[key] = res;
                addStep(
                    `Cache Store [${key}]`, 
                    `Line 34: memo.put("${key}", res);\n\nCaching the ${res.length} trees generated for range [${start}, ${end}] to prevent future re-calculation.`, 
                    34, 
                    { n, start, end, i: null, depth, action: 'cacheStore', leftTrees: null, rightTrees: null, currentRes: [...res], memo: {...memo}, cacheKey: key }
                );
            }

            addStep(
                `Return Range Result`, 
                `Line ${selectedApproachId === 'dpMemo' ? 35 : 33}: return res;\n\nFinished processing range [${start}, ${end}]. Returning list of ${res.length} valid trees to parent.`, 
                selectedApproachId === 'dpMemo' ? 35 : 33, 
                { n, start, end, i: null, depth, action: 'return', leftTrees: null, rightTrees: null, currentRes: [...res], memo: {...memo} }
            );

            return res;
        };

        let finalRes = build(1, n, 0);

        addStep(
            "Algorithm Complete", 
            `Line 5: return build(1, n);\n\nExecution finished. Generated ${finalRes.length} unique BSTs for n = ${n}.`, 
            5, 
            { n, start: 1, end: n, i: null, depth: 0, action: 'success', isSuccess: true, ans: finalRes, memo: {...memo} }
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
  const { isSuccess, ans, action, n, start, end, i: currI, depth, leftTrees, rightTrees, currentRes, newTree, activeLeft, activeRight, memo, cacheKey } = state;

  // Tiny SVG Tree Renderer Component
  const TreeGraph = ({ root, isSubtree = false, highlightColor = null }) => {
      const nodes = [];
      const edges = [];
      
      const traverse = (node, cx, cy, level, dx) => {
          if (!node) return;

          if (node.left) {
              const nx = cx - dx;
              const ny = cy + 20;
              edges.push(<line key={`e-l-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={highlightColor || "#cbd5e1"} strokeWidth="1.5" />);
              traverse(node.left, nx, ny, level + 1, dx / 1.6);
          }
          if (node.right) {
              const nx = cx + dx;
              const ny = cy + 20;
              edges.push(<line key={`e-r-${node.id}`} x1={cx} y1={cy} x2={nx} y2={ny} stroke={highlightColor || "#cbd5e1"} strokeWidth="1.5" />);
              traverse(node.right, nx, ny, level + 1, dx / 1.6);
          }

          let fill = highlightColor ? `${highlightColor}20` : "#ffffff";
          let stroke = highlightColor || "#94a3b8";
          let textColor = highlightColor || "#334155";

          nodes.push(
              <g key={`g-${node.id}`}>
                  <circle cx={cx} cy={cy} r={8} fill={fill} stroke={stroke} strokeWidth="1.5" />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize="8" fontWeight="bold" fontFamily="monospace" fill={textColor}>
                      {node.val}
                  </text>
              </g>
          );
      };

      if (!root) {
          return (
              <svg viewBox="0 0 60 40" className="w-10 h-8 opacity-50">
                  <circle cx={30} cy={20} r={6} fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2"/>
                  <text x={30} y={20} textAnchor="middle" dominantBaseline="central" fontSize="6" fill="#94a3b8">null</text>
              </svg>
          )
      }

      // Root is usually at cx=50. dx determines spread.
      traverse(root, 50, 10, 0, 20);

      return (
          <svg viewBox="0 0 100 80" className="w-16 h-16 shrink-0 filter drop-shadow-sm">
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
                <Network className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Unique BST II</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 95</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Trees / Divide & Conquer</span>
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
                <div className="grid grid-cols-1 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('Left') ? 'bg-sky-500/20 border-sky-500' : (action.includes('Right') ? 'bg-amber-500/20 border-amber-500' : (action === 'chooseRoot' || action.includes('combine') || action === 'addTree' ? 'bg-purple-500/20 border-purple-500' : (action.includes('cache') ? 'bg-teal-500/20 border-teal-500' : 'bg-violet-500/20 border-violet-500'))))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('Left') ? 'sky' : (action.includes('Right') ? 'amber' : (action === 'chooseRoot' || action.includes('combine') || action === 'addTree' ? 'purple' : (action.includes('cache') ? 'teal' : 'violet')))} />
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Depth" val={depth !== null && depth !== undefined ? depth : "-"} color="slate" active={depth !== null && depth !== undefined} />
                        <VariableCard label="Range [s, e]" val={start !== undefined && end !== undefined ? `[${start}, ${end}]` : "-"} color="sky" active={start !== undefined && end !== undefined} />
                        <VariableCard label="Root (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="purple" active={currI !== null && currI !== undefined} />
                        {selectedApproachId === 'dpMemo' ? (
                            <VariableCard label="Cache Size" val={memo ? Object.keys(memo).length : "-"} color="teal" active={memo !== undefined} />
                        ) : (
                            <VariableCard label="Res Size" val={currentRes !== undefined ? currentRes.length : "-"} color="emerald" active={currentRes !== undefined} />
                        )}
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Number of Nodes (n)</label>
                        <input type="number" min="1" max="4" value={nInput} onChange={(e) => { setNInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="3" />
                        <p className="text-[9px] text-slate-400 pl-1">Max 4 for visualizer (Catalan numbers grow exponentially).</p>
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('Left') ? 'bg-sky-900 border-sky-800' : (action.includes('Right') ? 'bg-amber-900 border-amber-800' : (action === 'chooseRoot' || action.includes('combine') || action === 'addTree' ? 'bg-purple-900 border-purple-800' : (action.includes('cache') ? 'bg-teal-900 border-teal-800' : 'bg-slate-900 border-slate-800'))))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : (action.includes('Left') ? <ArrowLeft size={100}/> : (action.includes('Right') ? <ArrowRight size={100}/> : (action === 'chooseRoot' ? <Target size={100}/> : (action === 'addTree' ? <PlusSquare size={100}/> : (action.includes('cache') ? <Database size={100}/> : <Network size={100} />)))))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('Left') ? 'text-sky-400' : (action.includes('Right') ? 'text-amber-400' : (action === 'chooseRoot' || action.includes('combine') || action === 'addTree' ? 'text-purple-400' : (action.includes('cache') ? 'text-teal-400' : 'text-violet-400'))))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('Left') ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : (action.includes('Right') ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : (action === 'chooseRoot' || action.includes('combine') || action === 'addTree' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : (action.includes('cache') ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start pt-10">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Array Representation & Range */}
                      {!isSuccess && n > 0 && (
                          <div className="w-full flex flex-col items-center border-b border-slate-200 pb-8 relative">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-6 flex items-center gap-2">
                                  <Target size={14}/> Active Range [start, end]
                                  {selectedApproachId === 'dpMemo' && memo && (
                                       <span className="ml-4 bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded shadow-sm flex items-center gap-1"><Database size={12}/> {Object.keys(memo).length} Cached Subtrees</span>
                                  )}
                              </span>
                              
                              <div className="flex gap-2">
                                  {Array.from({length: n}).map((_, idx) => {
                                      let val = idx + 1;
                                      let inRange = start !== undefined && end !== undefined && val >= start && val <= end;
                                      let isRoot = currI === val;

                                      let boxClass = "w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-4 font-mono font-black text-xl transition-all duration-300 relative ";
                                      
                                      if (isRoot) {
                                          boxClass += "bg-purple-100 border-purple-500 text-purple-900 scale-110 shadow-lg ring-4 ring-purple-300/30 z-20";
                                      } else if (inRange) {
                                          boxClass += "bg-white border-slate-400 text-slate-800 shadow-sm z-10";
                                      } else {
                                          boxClass += "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
                                      }

                                      return (
                                          <div key={`n-${val}`} className={boxClass}>
                                              {val}
                                              {isRoot && (
                                                  <div className="absolute -bottom-8 flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                      <ArrowUp size={16} className="text-purple-500" strokeWidth={3}/>
                                                      <span className="text-[9px] font-black font-mono tracking-widest text-purple-800 bg-purple-100 px-1 py-0.5 rounded shadow-sm border border-purple-300 mt-1 leading-none">root(i)</span>
                                                  </div>
                                              )}
                                          </div>
                                      );
                                  })}
                              </div>

                              {/* Range Brackets Visualization */}
                              {start !== undefined && end !== undefined && start <= end && (
                                  <div className="absolute top-[4.5rem] w-full flex justify-center pointer-events-none z-0">
                                      {/* Simplified bracket estimation based on gap spacing */}
                                      <div 
                                         className="border-b-2 border-x-2 border-slate-300 h-4 rounded-b-lg transition-all duration-300"
                                         style={{
                                             width: `${(end - start + 1) * 3.5}rem`,
                                             transform: `translateX(${((start + end)/2 - (n+1)/2) * 3.5}rem)`
                                         }}
                                      ></div>
                                  </div>
                              )}
                              
                              {/* Cache Animation Toast */}
                              {action === 'cacheHit' && cacheKey && (
                                  <div className="absolute top-[4rem] text-teal-600 font-black text-sm uppercase tracking-widest animate-in slide-in-from-bottom-2 flex items-center gap-2">
                                      <Archive size={16}/> Loaded [{cacheKey}] from Memory!
                                  </div>
                              )}
                          </div>
                      )}

                      {/* Cartesian Product Zone */}
                      {!isSuccess && action !== 'init' && action !== 'call' && start <= end && (
                          <div className="w-full flex flex-col gap-6 animate-in slide-in-from-bottom-4">
                              
                              {/* Subtrees Returned */}
                              <div className="grid grid-cols-2 gap-4 w-full">
                                  
                                  {/* Left Subtrees */}
                                  <div className={`bg-sky-50 border-2 rounded-2xl p-4 flex flex-col items-center shadow-sm transition-colors duration-300 ${action.includes('Left') ? 'border-sky-400 ring-4 ring-sky-300/20' : 'border-sky-200'}`}>
                                      <span className="text-[10px] font-black uppercase text-sky-600 tracking-widest font-mono mb-2">Left Subtrees</span>
                                      {leftTrees === null ? (
                                          <div className="flex items-center justify-center h-16 text-sky-400/50 animate-pulse"><Activity size={24}/></div>
                                      ) : (
                                          <div className="flex flex-wrap justify-center gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                                              {leftTrees.map((tree, tidx) => (
                                                  <div key={`l-${tidx}`} className={`bg-white rounded-xl border-2 p-1 shadow-sm transition-all ${activeLeft === tree && action === 'addTree' ? 'border-sky-500 ring-2 ring-sky-300 scale-110' : 'border-slate-200'}`}>
                                                      <TreeGraph root={tree} highlightColor="#0ea5e9" />
                                                  </div>
                                              ))}
                                              {leftTrees.length === 0 && <span className="text-xs text-sky-400 italic my-auto">[]</span>}
                                          </div>
                                      )}
                                  </div>

                                  {/* Right Subtrees */}
                                  <div className={`bg-amber-50 border-2 rounded-2xl p-4 flex flex-col items-center shadow-sm transition-colors duration-300 ${action.includes('Right') ? 'border-amber-400 ring-4 ring-amber-300/20' : 'border-amber-200'}`}>
                                      <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest font-mono mb-2">Right Subtrees</span>
                                      {rightTrees === null ? (
                                          <div className="flex items-center justify-center h-16 text-amber-400/50 animate-pulse"><Activity size={24}/></div>
                                      ) : (
                                          <div className="flex flex-wrap justify-center gap-2 max-h-[120px] overflow-y-auto custom-scrollbar">
                                              {rightTrees.map((tree, tidx) => (
                                                  <div key={`r-${tidx}`} className={`bg-white rounded-xl border-2 p-1 shadow-sm transition-all ${activeRight === tree && action === 'addTree' ? 'border-amber-500 ring-2 ring-amber-300 scale-110' : 'border-slate-200'}`}>
                                                      <TreeGraph root={tree} highlightColor="#f59e0b" />
                                                  </div>
                                              ))}
                                              {rightTrees.length === 0 && <span className="text-xs text-amber-400 italic my-auto">[]</span>}
                                          </div>
                                      )}
                                  </div>

                              </div>

                              {/* Current Combinations Built */}
                              <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col items-center min-h-[160px]">
                                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><SplitSquareHorizontal size={14}/> Combinations Built (`res`)</span>
                                  <div className="flex flex-wrap justify-center gap-3">
                                      {currentRes && currentRes.map((tree, tidx) => {
                                          let isNew = action === 'addTree' && tidx === currentRes.length - 1;
                                          return (
                                              <div key={`c-${tidx}`} className={`bg-slate-800 rounded-2xl border-2 p-2 shadow-md transition-all duration-500 ${isNew ? 'border-purple-500 scale-110 shadow-purple-500/20 animate-in zoom-in' : 'border-slate-700'}`}>
                                                  <TreeGraph root={tree} highlightColor={isNew ? "#a855f7" : "#94a3b8"} />
                                              </div>
                                          );
                                      })}
                                      {(!currentRes || currentRes.length === 0) && <span className="text-slate-600 text-sm italic font-mono my-auto">Awaiting Cartesian combinations...</span>}
                                  </div>
                              </div>

                          </div>
                      )}

                      {/* Display final success view nicely if complete */}
                      {isSuccess && ans && (
                           <div className="w-full h-full flex flex-col items-center">
                                <span className="text-sm font-black uppercase text-emerald-600 tracking-widest font-mono mb-6 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 shadow-sm">All {ans.length} Structurally Unique BSTs</span>
                                <div className="flex flex-wrap justify-center gap-4 p-4 w-full h-full content-start overflow-y-auto custom-scrollbar">
                                    {ans.map((tree, tidx) => (
                                        <div key={`ans-${tidx}`} className="bg-white rounded-2xl border-2 border-slate-200 p-3 shadow-md hover:border-emerald-400 hover:shadow-emerald-100 transition-all cursor-crosshair">
                                            <TreeGraph root={tree} highlightColor="#10b981" />
                                        </div>
                                    ))}
                                </div>
                           </div>
                      )}

                   </div>
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
                <GitBranch className="text-violet-600"/> Backtracking & BST Properties
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Generating combinations of structures is a classic application of Backtracking and Divide and Conquer. The strict constraint of a Binary Search Tree (BST) provides the perfect pivot: if we choose <code>i</code> as the root, the left and right children are strictly isolated into distinct ranges!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <SplitSquareHorizontal size={18}/> The Range Pivot
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            For a range <code>[start, end]</code>, any number <code>i</code> can be the root.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>Because it's a BST, everything to the left of <code>i</code> must be strictly smaller. This guarantees the left subtree can only be constructed from the range <code>[start, i - 1]</code>.</p>
                            <p>Everything to the right must be strictly greater, so the right subtree is constructed from <code>[i + 1, end]</code>.</p>
                            <p>These subproblems are entirely independent!</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Database size={18}/> Dynamic Programming
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Since we are frequently asking to build subtrees for the exact same ranges, we can optimize this heavily.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>If we've already calculated all valid BSTs for the range <code>[2, 4]</code>, there is no need to recursively rebuild them.</p>
                            <p>By saving the result to a <code>HashMap</code> (Memoization), we transform a pure Backtracking approach into a Top-Down Dynamic Programming solution, trading a little memory for extreme speedups in larger ranges.</p>
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
                        "To generate all structurally unique Binary Search Trees, I used a Backtracking algorithm enhanced with Top-Down Dynamic Programming (Memoization). The key insight relies entirely on the BST property: if we pick a number `i` as the root, all numbers in `[start, i-1]` form the left Binary Tree and `[i+1, end]` form the right. By iterating `i` across the entire range, I recursively collect a list of all valid subtrees. Then, I use a nested loop to calculate the Cartesian product—combining every left tree with every right tree onto a new root `i`. To prevent redundant calculations for overlapping subproblems (e.g., repeatedly generating the tree for range `[2,3]`), I cache the resulting lists in a HashMap mapped by their `start-end` range. The time and space complexity are bounded by the Catalan number $C_n$."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Can we optimize with Memoization?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Yes. The recursive function <code>build(start, end)</code> will frequently evaluate the same ranges multiple times. We can cache the results using a 2D array or HashMap. However, because we must return <em>distinctly new node objects</em> for the final trees to be independent, we would need to implement deep-cloning logic for the cached trees before returning them, which limits the practical speedup in languages like Java.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(4<sup>n</sup> / n<sup>3/2</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The number of unique BSTs is given by the n-th Catalan number, C_n. We perform constant work to link the roots for each of these generated combinations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(4<sup>n</sup> / n<sup>3/2</sup>)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We must allocate memory for every single node in every single generated tree. Since there are $C_n$ trees, and each has exactly $n$ nodes, the space scales proportionally.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|generateTrees|build|start|end|res|add|leftTrees|rightTrees|left|right|root|Map|HashMap|memo|containsKey|get|put|key)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder', 'Map', 'HashMap'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['generateTrees', 'build', 'add', 'containsKey', 'get', 'put'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['start', 'end', 'res', 'leftTrees', 'rightTrees', 'left', 'right', 'root', 'memo', 'key'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default UniqueBSTVisualizer;