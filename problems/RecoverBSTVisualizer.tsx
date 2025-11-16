import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  Zap, Timer, ListOrdered, ArrowRight, Hash, XSquare, Blocks, 
  CheckSquare, Search, Info, ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  inorderDfs: {
    id: 'inorderDfs',
    title: 'In-Order Traversal (DFS)',
    subtitle: 'Standard: O(N) Time, O(H) Space.',
    icon: <Activity size={16} />,
    complexity: 'Time: O(N) | Space: O(H)', 
    code: `class Solution {
    TreeNode first = null;
    TreeNode second = null;
    TreeNode prev = null;
    
    public void recoverTree(TreeNode root) {
        // 1. Find the two swapped nodes
        inorder(root);
        
        // 2. Swap their values back
        int temp = first.val;
        first.val = second.val;
        second.val = temp;
    }
    
    private void inorder(TreeNode root) {
        if (root == null) return;
        
        inorder(root.left);
        
        // Check for BST violation
        if (prev != null && prev.val > root.val) {
            if (first == null) {
                first = prev;
                second = root; // Might be adjacent
            } else {
                second = root; // Distant swap
            }
        }
        
        // Move previous pointer to current node
        prev = root;
        
        inorder(root.right);
    }
}`,
    explanation: "An in-order traversal of a valid BST yields a strictly increasing sequence. By keeping track of the `prev` node during traversal, we can detect anomalies where `prev.val > current.val`. The first time we see a dip, the `first` swapped node is `prev`, and the `second` is `current` (in case they are adjacent). If we see another dip later, we update `second` to the new `current`. Finally, we simply swap their values."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">99. Recover Binary Search Tree</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given the <code>root</code> of a binary search tree (BST), where the values of <strong>exactly two nodes</strong> of the tree were swapped by mistake. 
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 bg-emerald-50 py-3 mt-4">
          <em>Recover the tree without changing its structure.</em>
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> root = [1,3,null,null,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [3,1,null,null,2]</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> 3 cannot be a left child of 1 because 3 &gt; 1. Swapping 1 and 3 makes the BST valid.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> root = [3,1,4,null,null,2]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [2,1,4,null,null,3]</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> 2 cannot be in the right subtree of 3 because 2 &lt; 3. Swapping 2 and 3 makes the BST valid.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints & Follow-Up:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li>The number of nodes in the tree is in the range <code>[2, 1000]</code>.</li>
              <li><code>-2<sup>31</sup> &lt;= Node.val &lt;= 2<sup>31</sup> - 1</code></li>
          </ul>
          <p className="text-sm italic font-bold text-slate-700 mt-4">
            Follow up: A solution using <code>O(n)</code> space is pretty straight-forward. Could you devise a constant <code>O(1)</code> space solution?
          </p>
        </div>
      </div>
    </div>
  </div>
);

const RecoverBSTVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('inorderDfs');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  // Hardcoded visualizer trace for the specific Example 2: [3, 1, 4, null, null, 2]
  // In-order traversal of this tree visits: B(1) -> A(3) -> D(2) -> C(4)
  const trace = useMemo(() => {
    const steps = [];
    const add = (phase, desc, line, state) => {
      steps.push({
        phase, 
        description: desc, 
        line, 
        state: { 
          ...state, 
          inOrder: [...state.inOrder],
          nodes: { ...state.nodes }
        }
      });
    };

    let s = { 
        curr: null, prev: null, first: null, second: null, 
        inOrder: [], swapped: false, 
        nodes: { A: 3, B: 1, C: 4, D: 2 } 
    };

    add('Initialization', 'Starting in-order traversal to find anomalies. \n\nWe initialize pointers for first, second, and prev as null.', 8, s);

    // Node B (1)
    s.curr = 'B';
    add('Process Node', 'Exploring left-most node. \n\nCurrent node is 1. Prev is null.', 17, s);
    add('Check Violation', 'Skipping violation check since prev is null.', 22, s);
    s.prev = 'B';
    s.inOrder.push(1);
    add('Update Prev', 'Added 1 to our in-order path. \n\nMoved prev pointer to current node (1).', 33, s);

    // Node A (3)
    s.curr = 'A';
    add('Process Node', 'Moving back up to root.\n\nCurrent node is 3. Prev is 1.', 17, s);
    add('Check Violation', 'Is prev (1) > curr (3)? \n\nNo, 1 < 3. Order is perfectly maintained.', 22, s);
    s.prev = 'A';
    s.inOrder.push(3);
    add('Update Prev', 'Added 3 to our in-order path. \n\nMoved prev pointer to current node (3).', 33, s);

    // Node D (2)
    s.curr = 'D';
    add('Process Node', 'Exploring right subtree, then dropping left. \n\nCurrent node is 2. Prev is 3.', 17, s);
    add('Violation Found!', 'Is prev (3) > curr (2)? \n\nYES! We found a dip in our strictly increasing sequence.', 22, s);
    s.first = 'A';
    s.second = 'D';
    add('Mark Anomalies', 'Since `first` is null, we found our first drop! \n\nWe set first = prev (3) and second = curr (2).', 24, s);
    s.prev = 'D';
    s.inOrder.push(2);
    add('Update Prev', 'Added 2 to our in-order path. \n\nMoved prev pointer to current node (2).', 33, s);

    // Node C (4)
    s.curr = 'C';
    add('Process Node', 'Moving back up. \n\nCurrent node is 4. Prev is 2.', 17, s);
    add('Check Violation', 'Is prev (2) > curr (4)? \n\nNo, 2 < 4. Order is maintained.', 22, s);
    s.prev = 'C';
    s.inOrder.push(4);
    add('Update Prev', 'Added 4 to our in-order path. \n\nMoved prev pointer to current node (4).', 33, s);

    // Final Swap
    s.curr = null;
    s.prev = null;
    add('Traversal Complete', 'Finished visiting all nodes.\n\nIdentified `first` node holding 3, and `second` node holding 2.', 11, s);
    
    s.nodes = { A: 2, B: 1, C: 4, D: 3 }; 
    s.swapped = true;
    s.inOrder = [1, 2, 3, 4];
    add('Values Swapped', 'Swapped the values of first and second nodes. \n\nThe BST is completely recovered!', 12, s);

    return steps;
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const s = cur.state || {};

  // Helper to determine node colors dynamically
  const getNodeStyles = (id) => {
      if (s.swapped && (id === 'A' || id === 'D')) {
          return { stroke: "#10b981", fill: "#d1fae5", text: "#047857", shadow: "drop-shadow(0 4px 6px rgba(16,185,129,0.3))" };
      } else if (s.curr === id) {
          return { stroke: "#0ea5e9", fill: "#e0f2fe", text: "#0369a1", shadow: "drop-shadow(0 4px 6px rgba(14,165,233,0.4))", scale: "scale(1.1)", z: 10 };
      } else if (s.prev === id) {
          return { stroke: "#a855f7", fill: "#f3e8ff", text: "#7e22ce", shadow: "drop-shadow(0 4px 6px rgba(168,85,247,0.4))", scale: "scale(1.05)", z: 5 };
      } else if (s.first === id) {
          return { stroke: "#f59e0b", fill: "#fef3c7", text: "#b45309", shadow: "drop-shadow(0 0 12px rgba(245,158,11,0.5))" };
      } else if (s.second === id) {
          return { stroke: "#f43f5e", fill: "#ffe4e6", text: "#be123c", shadow: "drop-shadow(0 0 12px rgba(244,63,94,0.5))" };
      }
      return { stroke: "#cbd5e1", fill: "#ffffff", text: "#334155", shadow: "", scale: "scale(1)", z: 0 };
  };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
                <ArrowLeftRight className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Recover BST</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 99</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Tree / DFS Traversal</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto">
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-emerald-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.swapped ? 'bg-emerald-500/20 border-emerald-500' : (cur.phase.includes('Violation') ? 'bg-rose-500/20 border-rose-500' : (cur.phase.includes('Mark') ? 'bg-amber-500/20 border-amber-500' : 'bg-sky-500/20 border-sky-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={cur.phase.includes('Violation') ? 'rose' : (s.swapped ? 'emerald' : (cur.phase.includes('Mark') ? 'amber' : 'sky'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Pointer Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Curr" val={s.curr ? s.nodes[s.curr] : "-"} color="sky" active={s.curr !== null} />
                        <VariableCard label="Prev" val={s.prev ? s.nodes[s.prev] : "-"} color="purple" active={s.prev !== null} />
                        <VariableCard label="First" val={s.first ? s.nodes[s.first] : "-"} color="amber" active={s.first !== null} />
                        <VariableCard label="Second" val={s.second ? s.nodes[s.second] : "-"} color="rose" active={s.second !== null} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Tree Structure</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 truncate cursor-not-allowed opacity-80">
                            [3, 1, 4, null, null, 2]
                        </div>
                        <p className="text-[9px] text-slate-400 pl-1">Fixed test case for visualization.</p>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-36 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${s.swapped ? 'bg-emerald-900 border-emerald-800' : (cur.phase.includes('Violation') ? 'bg-rose-900 border-rose-800' : (cur.phase.includes('Mark') ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.swapped ? <Check size={100}/> : (cur.phase.includes('Violation') ? <XSquare size={100}/> : (cur.phase.includes('Mark') ? <AlertCircle size={100}/> : <Blocks size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.swapped ? "text-emerald-400" : (cur.phase.includes('Violation') ? 'text-rose-400' : (cur.phase.includes('Mark') ? 'text-amber-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.swapped ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (cur.phase.includes('Violation') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30')}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-10 overflow-hidden">
                      
                      {/* Interactive SVG Tree */}
                      <div className="w-full flex-1 min-h-[260px] relative">
                          <svg width="100%" height="100%" viewBox="0 0 400 240" className="overflow-visible select-none">
                              {/* Connector Lines */}
                              <line x1="200" y1="40" x2="100" y2="140" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                              <line x1="200" y1="40" x2="300" y2="140" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                              <line x1="300" y1="140" x2="200" y2="220" stroke="#e2e8f0" strokeWidth="6" strokeLinecap="round" />
                              
                              {/* Nodes */}
                              {['A', 'B', 'C', 'D'].map((id) => {
                                  let cx, cy;
                                  if (id === 'A') { cx = 200; cy = 40; }
                                  if (id === 'B') { cx = 100; cy = 140; }
                                  if (id === 'C') { cx = 300; cy = 140; }
                                  if (id === 'D') { cx = 200; cy = 220; }
                                  
                                  const styles = getNodeStyles(id);
                                  
                                  return (
                                      <g key={id} style={{ transform: `${styles.scale}`, transformOrigin: `${cx}px ${cy}px`, transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
                                          <circle 
                                            cx={cx} 
                                            cy={cy} 
                                            r="28" 
                                            fill={styles.fill} 
                                            stroke={styles.stroke} 
                                            strokeWidth="5" 
                                            style={{ filter: styles.shadow }}
                                          />
                                          <text 
                                            x={cx} 
                                            y={cy} 
                                            textAnchor="middle" 
                                            dy=".33em" 
                                            fill={styles.text} 
                                            fontSize="24" 
                                            fontWeight="800" 
                                            fontFamily="monospace"
                                          >
                                              {s.nodes[id]}
                                          </text>
                                      </g>
                                  )
                              })}
                          </svg>
                      </div>

                      {/* In-Order Traversal Array Panel */}
                      <div className="w-full flex flex-col items-center mt-auto border-t border-slate-200 pt-8 relative">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2">
                              <ListOrdered size={14}/> In-Order Traversal Build
                          </span>
                          
                          <div className="flex gap-2 items-center bg-slate-900 border-4 border-slate-800 p-4 rounded-2xl shadow-xl min-w-[200px] h-20 justify-center">
                              {s.inOrder.length === 0 ? (
                                  <span className="text-slate-600 font-mono text-sm italic">Empty</span>
                              ) : (
                                  s.inOrder.map((val, idx) => {
                                      let boxClass = "w-10 h-10 flex items-center justify-center font-mono font-black text-xl mx-1 rounded-lg transition-all duration-300 ";
                                      
                                      // Check if this specific element is a dip from the previous
                                      const isDip = idx > 0 && s.inOrder[idx - 1] > val;
                                      
                                      if (s.swapped) {
                                          boxClass += "bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
                                      } else if (isDip) {
                                          boxClass += "bg-rose-500/20 border-2 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse";
                                      } else if (idx === s.inOrder.length - 1) {
                                          boxClass += "bg-sky-500/20 border-2 border-sky-500 text-sky-400 animate-in zoom-in";
                                      } else {
                                          boxClass += "bg-slate-800 text-white border border-slate-700";
                                      }

                                      return (
                                          <div key={`inorder-${idx}`} className="flex items-center gap-2">
                                              {idx > 0 && (
                                                  <span className={`text-xl font-black ${isDip ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`}>
                                                      {isDip ? '>' : '<'}
                                                  </span>
                                              )}
                                              <div className={boxClass}>
                                                  {val}
                                              </div>
                                          </div>
                                      );
                                  })
                              )}
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {s.swapped && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">TREE RECOVERED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  In-Order is strictly increasing
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
                <ListOrdered className="text-emerald-600"/> The In-Order Property
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                A Binary Search Tree has one absolute rule: the left child is smaller, and the right child is larger. When you perform an <strong>in-order traversal</strong> (Left, Root, Right), you will print the nodes in a <strong>strictly increasing</strong> sorted array.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Adjacent Swaps
                        </h3>
                        <p className="text-sm text-amber-800 leading-relaxed mb-4">
                            If two nodes that are adjacent in the sorted order are swapped, we will only see <strong>one violation</strong> (one dip).
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-3">
                            <p>Sorted: <code>[1, 2, 3, 4]</code></p>
                            <p>Swap 2 and 3: <code>[1, <span className="text-rose-500">3, 2</span>, 4]</code></p>
                            <p>Notice there is only one dip where <code>prev &gt; curr</code> (3 &gt; 2). In this case, <code>first</code> is 3, and <code>second</code> is 2.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> Distant Swaps
                        </h3>
                        <p className="text-xs text-rose-800 leading-relaxed mb-4">
                            If two distant nodes are swapped, we will see <strong>two violations</strong> (two dips).
                        </p>
                        <div className="text-xs text-rose-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <p>Sorted: <code>[1, 2, 3, 4, 5]</code></p>
                            <p>Swap 2 and 5: <code>[1, <span className="text-rose-500">5, 3</span>, 4, <span className="text-rose-500">2</span>]</code></p>
                            <p>Dip 1: 5 &gt; 3. (<code>first</code> = 5, <code>second</code> = 3)</p>
                            <p>Dip 2: 4 &gt; 2. (Update <code>second</code> = 2). Result: Swap 5 and 2!</p>
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
                        "Because traversing a BST in-order produces a strictly increasing sequence, a swapped pair of nodes will always create anomalies where the previous node is strictly greater than the current node. I utilized standard O(H) recursion to do an in-order traversal, tracking `prev`, `first`, and `second` pointers. If I encounter a dip, the `first` node is assigned to the larger `prev` element, and the `second` node to the smaller `current` element. If another dip occurs later (a distant swap), I simply update the `second` pointer to the new `current`. After traversing, I swap their values."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-emerald-500"/> Follow-Up: Morris Traversal
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The prompt asks for an <code>O(1)</code> space solution. Recursive DFS takes <code>O(H)</code> space due to the call stack. To achieve true <code>O(1)</code> space, we must use <strong>Morris Traversal</strong>. It temporarily threads the tree by creating links from predecessor nodes directly back to the current node, allowing us to traverse the tree without a stack, and then safely removes those threads to restore the original structure.
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
                                <p className="text-[10px] text-slate-500 mt-1">We perform a complete in-order traversal of the tree, visiting each node exactly once. Swapping the values at the end is an O(1) operation.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(H)</span>
                                <p className="text-[10px] text-slate-500 mt-1">For standard DFS, the implicit recursion stack holds at most H elements, where H is the height of the tree. In the worst case (skewed tree), this is O(N). (O(1) if implementing Morris Traversal).</p>
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|TreeNode|Math|Arrays|ArrayList|recoverTree|inorder)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'TreeNode', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['recoverTree', 'inorder'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['root', 'first', 'second', 'prev', 'temp', 'val', 'left', 'right'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RecoverBSTVisualizer;