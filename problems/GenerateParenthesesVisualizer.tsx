
import React, { useState, useMemo } from 'react';
import { 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  BookOpen, 
  Code2, 
  Check, 
  Copy, 
  Zap, 
  Trophy, 
  MessageSquare, 
  Target, 
  AlertCircle, 
  Cpu, 
  Layers, 
  Hash, 
  Database, 
  Calculator, 
  FileText, 
  ArrowRight, 
  ArrowDown, 
  Info, 
  BarChart3, 
  X, 
  GitBranch, 
  Split, 
  Parentheses, 
  TreePine, 
  Binary, 
  MousePointer2, 
  Trash2, 
  ListFilter, 
  Plus,
  Timer,
  Network,
  Undo2,
  CornerRightDown,
  ArrowUp,
  History
} from 'lucide-react';

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: '1. Backtracking',
    subtitle: 'Pruned Recursion',
    icon: <Zap size={16} />,
    complexity: 'Time: O(4ⁿ / √n) | Space: O(n)',
    code: `class Solution {
    public List<String> generateParenthesis(int n) {
        List<String> res = new ArrayList<>();
        backtrack(res, new StringBuilder(), 0, 0, n);
        return res;
    }

    private void backtrack(List<String> res, StringBuilder cur, 
                           int open, int close, int max) {
        if (cur.length() == max * 2) {
            res.add(cur.toString());
            return;
        }

        if (open < max) {
            cur.append("(");
            backtrack(res, cur, open + 1, close, max);
            cur.deleteCharAt(cur.length() - 1);
        }
        
        if (close < open) {
            cur.append(")");
            backtrack(res, cur, open, close + 1, max);
            cur.deleteCharAt(cur.length() - 1);
        }
    }
}`,
    explanation: "Backtracking is a DFS traversal of a state tree. To explore multiple paths using a single shared buffer (StringBuilder), we must 'undo' our changes when we return from a deeper call. Lines 18 and 24 are the crucial 'Cleanup' steps."
  }
};

interface TreeNode {
  id: string;
  parentId: string | null;
  val: string;
  open: number;
  close: number;
  isCompleted: boolean;
}

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">22. Generate Parentheses</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600 font-mono font-bold">n</code> pairs of parentheses, write a function to <em>generate all combinations of well-formed parentheses.</em>
        </p>
        <div className="space-y-8 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 3</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ["((()))","(()())","(())()","()(())","()()()"]</p>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> n = 1</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ["()"]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GenerateParenthesesVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach] = useState<keyof typeof APPROACHES>('backtracking');
  const [nInput, setNInput] = useState(3);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const n = useMemo(() => Math.min(Math.max(1, nInput), 4), [nInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const res: string[] = [];
    const nodes: TreeNode[] = [];
    let nodeIdCounter = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          n,
          res: [...res],
          treeNodes: nodes.map(node => ({ ...node })),
          ...state 
        } 
      });
    };

    const runBacktrack = (curStr: string, open: number, close: number, parentId: string | null, stack: any[]) => {
      const currentId = `node-${nodeIdCounter++}`;
      const charAdded = curStr.slice(-1) || "root";
      
      const newNode: TreeNode = {
        id: currentId,
        parentId,
        val: charAdded,
        open,
        close,
        isCompleted: false
      };
      nodes.push(newNode);

      const frame = { id: currentId, curStr, open, close };
      const currentStack = [...stack, frame];

      // Entry
      addStep("Method Entry", `Called backtrack for "${curStr}". Checking state.`, 9, { activeNodeId: currentId, callStack: currentStack });
      
      // Base case
      addStep("Base Case Check", `Check length ${curStr.length} == ${n * 2}.`, 10, { activeNodeId: currentId, callStack: currentStack });
      if (curStr.length === n * 2) {
        newNode.isCompleted = true;
        res.push(curStr);
        addStep("Leaf: Solution", `"${curStr}" is complete. Adding to result list and returning to parent.`, 11, { activeNodeId: currentId, callStack: currentStack, res: [...res], isSuccess: true });
        addStep("Return", "Returning from recursive frame.", 12, { activeNodeId: currentId, callStack: currentStack });
        return;
      }

      // Branch 1: Opener
      addStep("Condition Check", `Check: open(${open}) < n(${n})?`, 15, { activeNodeId: currentId, callStack: currentStack });
      if (open < n) {
        addStep("Action: Append", `Appending "(" to the builder.`, 16, { activeNodeId: currentId, callStack: currentStack, highlightChar: '(' });
        addStep("Recursive Jump", `Jumping into a new frame to explore "(" branch.`, 17, { activeNodeId: currentId, callStack: currentStack });
        
        runBacktrack(curStr + "(", open + 1, close, currentId, currentStack);
        
        // BACKTRACK 1: Cleaning up the opener
        addStep("Backtrack (Cleanup)", `Returned to frame "${curStr}". Removing the last "(" to explore closing options.`, 18, { activeNodeId: currentId, callStack: currentStack, isBacktracking: true, removedChar: '(' });
      }

      // Branch 2: Closer
      addStep("Condition Check", `Check: close(${close}) < open(${open})?`, 21, { activeNodeId: currentId, callStack: currentStack });
      if (close < open) {
        addStep("Action: Append", `Appending ")" to the builder.`, 22, { activeNodeId: currentId, callStack: currentStack, highlightChar: ')' });
        addStep("Recursive Jump", `Jumping into a new frame to explore ")" branch.`, 23, { activeNodeId: currentId, callStack: currentStack });
        
        runBacktrack(curStr + ")", open, close + 1, currentId, currentStack);
        
        // BACKTRACK 2: Cleaning up the closer
        addStep("Backtrack (Cleanup)", `Returned to frame "${curStr}". Removing the last ")" and finishing this frame.`, 24, { activeNodeId: currentId, callStack: currentStack, isBacktracking: true, removedChar: ')' });
      }

      addStep("Function Exit", `All choices for "${curStr}" explored. Returning to caller.`, 26, { activeNodeId: currentId, callStack: currentStack });
    };

    addStep("Init", `Target pairs: ${n}. Starting root call.`, 4, { callStack: [] });
    runBacktrack("", 0, 0, null, []);
    addStep("Conclusion", `Exploration finished. Total solutions: ${res.length}`, 26, { finished: true, callStack: [] });

    return steps;
  }, [n]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES.backtracking.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { res, treeNodes, activeNodeId, callStack, finished, isBacktracking, isSuccess } = cur.state;
  const currentFrame = callStack[callStack.length - 1] || { curStr: "", open: 0, close: 0 };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Parentheses className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Generate Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 22</span>
                <span className="opacity-60">•</span>
                <span className="font-bold">BACKTRACKING FLOW</span>
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

        {/* Added missing ProblemStatement rendering */}
        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left Col: Code & Variable Context (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase text-[10px] text-white">Backtrack.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className={`absolute left-0 right-0 border-l-4 transition-all duration-200 z-0 ${isBacktracking ? 'bg-rose-500/10 border-rose-500' : 'bg-indigo-500/15 border-indigo-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                    {APPROACHES.backtracking.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
                {isBacktracking && (
                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl border-2 border-rose-400">
                        Backtracking Active
                    </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Layers size={18} />
                        <h4 className="text-sm font-black uppercase tracking-widest font-mono">Call Stack</h4>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 font-mono">Depth: {callStack.length}</span>
                  </div>
                  <div className="flex flex-col-reverse gap-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                      {callStack.map((frame: any, idx: number) => (
                          <div key={idx} className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${idx === callStack.length - 1 ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                              <div className="flex flex-col">
                                <span className="text-[8px] font-black text-slate-400 uppercase">Frame {idx}</span>
                                <span className="text-xs font-mono font-bold text-indigo-700 truncate w-24">"{frame.curStr}"</span>
                              </div>
                              <div className="flex gap-3 px-2">
                                <div className="text-center">
                                    <span className="text-[7px] block font-black text-slate-400 uppercase">O</span>
                                    <span className="text-[10px] font-black font-mono">{frame.open}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-[7px] block font-black text-slate-400 uppercase">C</span>
                                    <span className="text-[10px] font-black font-mono">{frame.close}</span>
                                </div>
                              </div>
                          </div>
                      ))}
                      {callStack.length === 0 && <div className="py-4 text-center text-slate-200 font-mono text-xs italic uppercase tracking-widest">Stack Empty</div>}
                  </div>
              </div>
            </div>

            {/* Right Col: Simulation Arena & Controls (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-1.5 w-full">
                      <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Set N (Max Pairs)</label>
                      <input type="number" min="1" max="4" value={nInput} onChange={(e) => { setNInput(parseInt(e.target.value) || 1); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <ChevronLeft size={16}/> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      {isBacktracking ? 'Undo Choice' : 'Next Execution'} <ChevronRight size={16}/>
                    </button>
                   </div>
              </div>

              {/* Action Log / Status */}
              <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${isBacktracking ? 'bg-rose-900 border-rose-800' : isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    {isBacktracking ? <Undo2 size={100} /> : <GitBranch size={100}/>}
                </div>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Target size={14} className={isBacktracking ? "text-rose-400" : "text-indigo-400"}/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                   </div>
                   {isBacktracking && <div className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[8px] font-black uppercase animate-pulse font-mono tracking-tighter">Backtracking (Line {cur.line})</div>}
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[550px] relative flex flex-col overflow-hidden shadow-inner">
                <div className="flex items-center justify-between mb-8 z-10">
                   <div className="flex items-center gap-2">
                    <Network size={16} className="text-indigo-600"/>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Visual Recursion Tree (n={n})</span>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                         <span className="text-[9px] font-black uppercase text-slate-400 font-mono">Active</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                         <span className="text-[9px] font-black uppercase text-slate-400 font-mono">Solution</span>
                      </div>
                   </div>
                </div>
                
                {/* Decision Tree */}
                <div className="flex-1 relative w-full overflow-auto scrollbar-thin flex justify-center">
                  <TreeRenderer nodes={treeNodes} activeNodeId={activeNodeId} n={n} isBacktracking={isBacktracking} />
                </div>

                {/* Bottom variables float */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col gap-4">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-6 mb-2">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase font-mono">OPEN</span>
                                <span className="text-lg font-black text-indigo-600">{currentFrame.open}</span>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase font-mono">CLOSE</span>
                                <span className="text-lg font-black text-purple-600">{currentFrame.close}</span>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase font-mono">LIMIT</span>
                                <span className="text-lg font-black text-slate-800">{n}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {currentFrame.curStr.split('').map((char: string, idx: number) => {
                                const isLast = idx === currentFrame.curStr.length - 1;
                                return (
                                    <div key={idx} className={`w-10 h-14 border-2 rounded-xl flex items-center justify-center font-mono font-black text-2xl transition-all duration-300 shadow-sm ${isLast && isBacktracking ? 'bg-rose-500 border-rose-600 text-white scale-110' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                                        {char}
                                        {isLast && isBacktracking && (
                                            <div className="absolute -top-7 text-rose-500 font-black text-[9px] animate-bounce flex flex-col items-center">
                                                <Trash2 size={12} />
                                                POP
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {currentFrame.curStr.length === 0 && <span className="text-slate-300 italic font-mono text-sm">(Empty Buffer)</span>}
                        </div>
                    </div>
                </div>

                {/* Floating Results Panel */}
                <div className="absolute top-20 right-8 w-40 animate-in slide-in-from-right-4 z-20">
                    <div className="bg-slate-900 shadow-2xl p-4 rounded-3xl border border-slate-700">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-3 border-b border-slate-700 pb-2 font-mono">Result List</span>
                        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                            {res.map((item: string, idx: number) => (
                                <div key={idx} className="text-[10px] font-mono font-bold text-white bg-indigo-600/30 px-2 py-1 rounded border border-indigo-500/20 truncate animate-in zoom-in">
                                    {item}
                                </div>
                            ))}
                            {res.length === 0 && <span className="text-[9px] text-slate-600 italic font-mono">Empty...</span>}
                        </div>
                    </div>
                </div>

                {/* Final Success Overlay */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-2xl flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Search Complete</span>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono italic underline decoration-blue-100 decoration-8 underline-offset-8">
                           {res.length}
                        </div>
                        <div className="mt-8 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           O(Catalan(N)) States Processed
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fixed: activeTab comparison changed from 'theory' to 'learn' to match state type definition */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> The Mechanics of the "Unwind"
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                Most developers understand the "Downwards" call, but the "Upwards" backtrack is where the logic often fails. In this problem, <code>StringBuilder</code> is a <strong>shared resource</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Stack Discipline</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4 font-black">
                          "Leaving the room exactly as you found it."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          When <code>backtrack(...)</code> on line 17 finishes, we are back in the parent frame. But the <code>StringBuilder</code> still has the '(' we added. If we don't call <code>deleteCharAt</code> on line 18, the next attempt (adding a ')') would be added to the WRONG string.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <History size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Shared Resource Problem</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">StringBuilder (Single)</span>
                          <div className="font-mono text-lg font-bold text-indigo-300">Mutable & Efficient</div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest">Requires manual Backtrack step</p>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        )}
        
        {/* Interview Tab remains as a fallback for high-level defense */}
        {activeTab === 'interview' && (
             <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Backtracking Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "The primary complexity in this problem is managing the search space while reusing a single mutable resource. My solution uses a 'StringBuilder' with explicit 'Undo' operations. This ensures we visit exactly the valid states (N-th Catalan number) without the O(N²) memory pressure of creating new String objects at every depth. By returning the builder to its previous state after each recursive call, we maintain a pure DFS traversal of the valid permutation tree."
                    </p>
                </div>
             </div>
        )}

      </div>
    </div>
  );
};

const TreeRenderer = ({ nodes, activeNodeId, n, isBacktracking }: { nodes: TreeNode[], activeNodeId: string | null, n: number, isBacktracking?: boolean }) => {
    const nodesByDepth = useMemo(() => {
        const getDepth = (node: TreeNode): number => {
            if (!node.parentId) return 0;
            const parent = nodes.find(n => n.id === node.parentId);
            return parent ? 1 + getDepth(parent) : 0;
        };

        const map: Record<number, TreeNode[]> = {};
        nodes.forEach(node => {
            const d = getDepth(node);
            if (!map[d]) map[d] = [];
            map[d].push(node);
        });
        return map;
    }, [nodes]);

    const canvasWidth = 800;
    const canvasHeight = 500;
    const depthSpacing = canvasHeight / (n * 2 + 1);

    return (
        <svg width={canvasWidth} height={canvasHeight} className="overflow-visible">
            <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
            </defs>
            {nodes.map(node => {
                const depth = Object.keys(nodesByDepth).find(d => nodesByDepth[parseInt(d)].includes(node));
                const dInt = parseInt(depth || "0");
                const siblings = nodesByDepth[dInt];
                const indexInDepth = siblings.indexOf(node);
                
                const x = (canvasWidth / (siblings.length + 1)) * (indexInDepth + 1);
                const y = dInt * depthSpacing + 40;

                const parent = nodes.find(n => n.id === node.parentId);
                let px = 0, py = 0;
                if (parent) {
                    const pDepth = dInt - 1;
                    const pSiblings = nodesByDepth[pDepth];
                    const pIndex = pSiblings.indexOf(parent);
                    px = (canvasWidth / (pSiblings.length + 1)) * (pIndex + 1);
                    py = pDepth * depthSpacing + 40;
                }

                const isActive = node.id === activeNodeId;

                return (
                    <g key={node.id} className="transition-all duration-500">
                        {parent && (
                            <line 
                                x1={px} y1={py} x2={x} y2={y} 
                                stroke={isActive ? (isBacktracking ? "#f43f5e" : "#6366f1") : "#e2e8f0"} 
                                strokeWidth={isActive ? 3 : 1} 
                                strokeDasharray={isBacktracking && isActive ? "4 4" : "0"}
                                className="transition-all duration-500"
                            />
                        )}
                        <circle 
                            cx={x} cy={y} r={14} 
                            fill={isActive ? (isBacktracking ? "#f43f5e" : "#6366f1") : node.isCompleted ? "#10b981" : "white"} 
                            stroke={isActive ? (isBacktracking ? "#be123c" : "#4338ca") : "#cbd5e1"} 
                            strokeWidth={isActive ? 3 : 1.5}
                            filter={isActive ? "url(#glow)" : ""}
                            className="transition-all duration-300 shadow-sm"
                        />
                        <text 
                            x={x} y={y + 4} 
                            textAnchor="middle" 
                            fontSize="10" 
                            fontWeight="900" 
                            fill={isActive || node.isCompleted ? "white" : "#64748b"}
                            className="select-none pointer-events-none font-mono"
                        >
                            {node.val === 'root' ? 'S' : node.val}
                        </text>
                        {isActive && !isBacktracking && (
                            <circle cx={x} cy={y} r={18} fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="4 2" className="animate-spin-slow" />
                        )}
                        {isActive && isBacktracking && (
                             <g className="animate-pulse">
                                <circle cx={x} cy={y} r={18} fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
                             </g>
                        )}
                    </g>
                );
            })}
        </svg>
    );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|void|String|boolean|new|this|for|List|ArrayList|StringBuilder|length|append|deleteCharAt|toString)\b|\b\d+\b)/g).filter(Boolean);

  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? 'bg-indigo-500/15' : ''}`}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? 'text-indigo-400 font-bold' : 'text-slate-700'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'String', 'StringBuilder'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'append', 'deleteCharAt', 'toString'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default GenerateParenthesesVisualizer;
