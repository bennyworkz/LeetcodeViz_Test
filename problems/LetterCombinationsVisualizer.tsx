
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
  Phone, 
  Binary, 
  MousePointer2, 
  Trash2, 
  Network,
  Undo2,
  CornerDownRight,
  History,
  Timer,
  ListOrdered,
  RefreshCw,
  Search,
  Plus
} from 'lucide-react';

const MAPPING = ["", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];

const APPROACHES = {
  backtracking: {
    id: 'backtracking',
    title: '1. Backtracking (DFS)',
    subtitle: 'Recursive Unwinding',
    icon: <Zap size={16} />,
    complexity: 'Time: O(4ⁿ) | Space: O(n)',
    code: `class Solution {
    public List<String> letterCombinations(String digits) {
        if (digits.isEmpty()) return new ArrayList<>();
        String[] map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        List<String> res = new ArrayList<>();
        backtrack(res, digits, map, new StringBuilder(), 0);
        return res;
    }

    private void backtrack(List<String> res, String digits, String[] map, StringBuilder sb, int idx) {
        if (idx == digits.length()) {
            res.add(sb.toString());
            return;
        }
        String letters = map[digits.charAt(idx) - '0'];
        for (char c : letters.toCharArray()) {
            sb.append(c);
            backtrack(res, digits, map, sb, idx + 1);
            sb.deleteCharAt(sb.length() - 1);
        }
    }
}`,
    explanation: "Backtracking exploratively builds a solution using recursion. When we return from a branch, we must manually undo our last choice (Line 19) to restore the shared StringBuilder for the next character."
  },
  iterative: {
    id: 'iterative',
    title: '2. BFS (Queue)',
    subtitle: 'Layer-by-Layer',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(4ⁿ) | Space: O(4ⁿ)',
    code: `class Solution {
    public List<String> letterCombinations(String digits) {
        LinkedList<String> ans = new LinkedList<String>();
        if(digits.isEmpty()) return ans;
        String[] map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
        ans.add("");
        for(int i = 0; i < digits.length(); i++) {
            int x = Character.getNumericValue(digits.charAt(i));
            while(ans.peek().length() == i) {
                String t = ans.remove();
                for(char s : map[x].toCharArray()) {
                    ans.add(t + s);
                }
            }
        }
        return ans;
    }
}`,
    explanation: "Iterative approach uses a Queue to build combinations layer by layer. For each digit, we drain the queue of all strings of the previous length, append all possible letters, and push them back."
  }
};

interface TreeNode {
  id: string;
  parentId: string | null;
  val: string;
  depth: number;
  status: 'active' | 'visited' | 'leaf';
}

const ProblemStatement = () => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
    <div className="max-w-3xl space-y-8">
      <div>
        <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">17. Letter Combinations of a Phone Number</h2>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
          <p>Given a string containing digits from <code>2-9</code> inclusive, return all possible letter combinations that the number could represent. Return the answer in <strong>any order</strong>.</p>
          <p>A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.</p>
        </div>
      </div>

      <div className="flex justify-center py-6">
         <div className="grid grid-cols-3 gap-3 p-6 bg-slate-100 rounded-[2.5rem] shadow-inner border border-slate-200">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <div key={num} className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center transition-all hover:scale-105">
                   <span className="text-sm font-black text-slate-900">{num}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{MAPPING[num] || ""}</span>
                </div>
            ))}
         </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Hash size={16}/> Examples:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
            <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> digits = "23"</p>
            <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> ["ad","ae","af","bd","be","bf","cd","ce","cf"]</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm shadow-inner space-y-3">
            <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> digits = ""</p>
            <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> []</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <AlertCircle size={14} /> Constraints:
        </h3>
        <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
          <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold text-indigo-600">0 {'<='} digits.length {'<='} 4</code></li>
          <li><code>digits[i]</code> is a digit in the range <code>['2', '9']</code>.</li>
        </ul>
      </div>
    </div>
  </div>
);

const LetterCombinationsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('backtracking');
  const [inputDigits, setInputDigits] = useState("23");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const digits = useMemo(() => inputDigits.replace(/[^2-9]/g, '').substring(0, 4), [inputDigits]);

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
          digits,
          res: [...res],
          treeNodes: nodes.map(n => ({ ...n })),
          ...state 
        } 
      });
    };

    if (digits.length === 0) {
        addStep("Guard Clause", "Empty input detected. Returning empty result list.", 3, { finished: true });
        return steps;
    }

    if (selectedApproach === 'backtracking') {
      const backtrack = (idx: number, sb: string, parentId: string | null, stack: any[]) => {
        const currentId = `node-${nodeIdCounter++}`;
        const charAdded = sb.slice(-1) || "ROOT";
        
        const newNode: TreeNode = {
          id: currentId,
          parentId,
          val: charAdded,
          depth: idx,
          status: 'active'
        };
        nodes.push(newNode);

        const frame = { id: currentId, idx, currentStr: sb };
        const currentStack = [...stack, frame];

        addStep("Method Entry", `Called backtrack for idx ${idx}. Current path: "${sb}".`, 10, { activeNodeId: currentId, callStack: currentStack });
        
        addStep("Condition Check", `Evaluating: Is idx (${idx}) == digits.length (${digits.length})?`, 11, { activeNodeId: currentId, callStack: currentStack });
        if (idx === digits.length) {
          addStep("Base Case Met", "Current path is complete. Adding to results.", 11, { activeNodeId: currentId, callStack: currentStack });
          newNode.status = 'leaf';
          res.push(sb);
          addStep("Action: Add", `Added "${sb}" to result list. Returning to parent frame.`, 12, { activeNodeId: currentId, callStack: currentStack, res: [...res] });
          addStep("Return", "Stack unwinding...", 13, { activeNodeId: currentId, callStack: currentStack });
          return;
        }

        const digit = digits[idx];
        const letters = MAPPING[parseInt(digit)];
        addStep("Variable Fetch", `Getting letters for digit '${digit}': "${letters}".`, 15, { activeNodeId: currentId, callStack: currentStack, letters });

        addStep("Loop Header", `Starting loop through characters in "${letters}".`, 16, { activeNodeId: currentId, callStack: currentStack, letters });

        for (let i = 0; i < letters.length; i++) {
          const c = letters[i];
          addStep("Loop Iteration", `Picking letter '${c}' (Index ${i} of "${letters}").`, 16, { activeNodeId: currentId, callStack: currentStack, activeChar: c });

          addStep("Action: Append", `Appending '${c}' to the shared StringBuilder buffer.`, 17, { activeNodeId: currentId, callStack: currentStack, activeChar: c });
          
          addStep("Recurse", `Calling backtrack(idx: ${idx + 1}) to explore deeper.`, 18, { activeNodeId: currentId, callStack: currentStack });
          backtrack(idx + 1, sb + c, currentId, currentStack);

          newNode.status = 'active';
          addStep("Return to Frame", `Returned from recursion for '${c}'. Restoring context.`, 18, { activeNodeId: currentId, callStack: currentStack });
          addStep("Backtrack (Undo)", `Deleting last character '${c}' to prepare for next letter in loop.`, 19, { activeNodeId: currentId, callStack: currentStack, isBacktracking: true, removedChar: c });
        }

        newNode.status = 'visited';
        addStep("Method Exit", `Finished all letters for digit '${digit}'. Returning to caller.`, 21, { activeNodeId: currentId, callStack: currentStack });
      };

      addStep("Initialization", "Setting up digit mapping and empty results list.", 4, { callStack: [] });
      backtrack(0, "", null, []);
      addStep("Conclusion", "Exhaustive search finished. All combinations identified.", 22, { finished: true, callStack: [] });

    } else {
        // BFS Iterative Engine
        let queue: string[] = [""];
        addStep("Init Queue", "Starting with a queue containing an empty string seed.", 6, { queue: [""] });

        for (let i = 0; i < digits.length; i++) {
            const digit = digits[i];
            const letters = MAPPING[parseInt(digit)];
            addStep("Outer Loop", `Processing Digit '${digit}' at index ${i}.`, 7, { i, queue: [...queue], letters });

            addStep("Variable Fetch", `Getting numeric value of '${digit}'.`, 8, { i, queue: [...queue], letters });

            addStep("While Condition", `Checking: Is queue.peek().length (${queue[0].length}) == i (${i})?`, 9, { i, queue: [...queue], letters });
            while (queue.length > 0 && queue[0].length === i) {
                addStep("Condition True", "Strings in queue are still from previous level. Continue processing.", 9, { i, queue: [...queue], letters });
                
                const t = queue.shift()!;
                addStep("Action: Poll", `Removing "${t}" from front of queue.`, 10, { i, queue: [...queue], t, letters });

                addStep("Inner Loop", `Mapping letters for '${digit}': "${letters}".`, 11, { i, queue: [...queue], t, letters });
                for (let sChar of letters) {
                    addStep("Loop Iteration", `Combining prefix "${t}" with letter '${sChar}'.`, 11, { i, queue: [...queue], t, letters, sChar });
                    const combined = t + sChar;
                    queue.push(combined);
                    addStep("Action: Offer", `Adding "${combined}" to back of queue.`, 12, { i, queue: [...queue], t, letters, sChar });
                }
                
                if (queue.length > 0 && queue[0].length === i) {
                    addStep("While Loop Check", "Checking next item in queue for current level...", 9, { i, queue: [...queue], letters });
                } else {
                    addStep("While Loop Done", "No more items for current level in queue.", 9, { i, queue: [...queue], letters });
                }
            }
        }
        res.push(...queue);
        addStep("Final Result", "Queue now contains all combinations of full length.", 15, { queue: [...queue], finished: true, res: [...queue] });
    }

    return steps;
  }, [digits, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0];
  const { 
    res: resultList, 
    treeNodes, 
    activeNodeId, 
    callStack, 
    finished, 
    isBacktracking, 
    letters, 
    activeChar, 
    queue, 
    t: bfsPrefix, 
    sChar: bfsSuffix,
    i: bfsIdx
  } = cur.state;

  const currentFrame = callStack?.[callStack.length - 1] || { currentStr: "", idx: 0 };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center text-white">
                <Phone size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Letter Combinations</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-2 font-mono">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 17</span>
                <span className="opacity-60">•</span>
                <span className="font-bold text-slate-400">STATE EXPLORATION</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && <ProblemStatement />}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left Col: Code & Variable Context (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm overflow-hidden">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                    <button
                        key={key}
                        onClick={() => { setSelectedApproach(key); setCurrentStep(0); }}
                        className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        <div className="mb-1">{APPROACHES[key].icon}</div>
                        <span className="text-[10px] font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className={`absolute left-0 right-0 border-l-4 transition-all duration-200 z-0 ${isBacktracking ? 'bg-rose-500/10 border-rose-500' : 'bg-indigo-500/15 border-indigo-500'}`} style={{ top: `${(cur.line * 16.5) + 24 - 16.5}px`, height: '16.5px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
                {isBacktracking && (
                    <div className="absolute bottom-6 right-6 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest animate-bounce shadow-xl border-2 border-rose-400 font-mono tracking-tighter">
                        Backtracking Active
                    </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-indigo-600">
                        {selectedApproach === 'backtracking' ? <Layers size={18} /> : <RefreshCw size={18} />}
                        <h4 className="text-sm font-black uppercase tracking-widest font-mono">{selectedApproach === 'backtracking' ? 'Call Stack' : 'Queue State'}</h4>
                    </div>
                  </div>
                  <div className="flex flex-col-reverse gap-2 max-h-[140px] overflow-y-auto scrollbar-thin">
                      {selectedApproach === 'backtracking' ? (
                          callStack?.map((frame: any, idx: number) => (
                              <div key={idx} className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center justify-between ${idx === callStack.length - 1 ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                                  <div className="flex flex-col">
                                    <span className="text-[8px] font-black text-slate-400 uppercase font-mono">Frame {idx}</span>
                                    <span className="text-xs font-mono font-bold text-indigo-700 truncate w-24">"{frame.currentStr}"</span>
                                  </div>
                                  <div className="flex gap-3 px-2">
                                    <div className="text-center">
                                        <span className="text-[7px] block font-black text-slate-400 uppercase font-mono tracking-tighter">IDX</span>
                                        <span className="text-[10px] font-black font-mono">{frame.idx}</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="text-[7px] block font-black text-slate-400 uppercase font-mono tracking-tighter">VAL</span>
                                        <span className="text-[10px] font-black font-mono">{digits[frame.idx] || 'EOF'}</span>
                                    </div>
                                  </div>
                              </div>
                          ))
                      ) : (
                        <div className="flex flex-wrap gap-1">
                            {queue?.map((item: string, idx: number) => (
                                <div key={idx} className={`px-2 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-[9px] font-mono font-bold animate-in zoom-in`}>
                                    "{item}"
                                </div>
                            ))}
                        </div>
                      )}
                      {(!callStack?.length && !queue?.length) && <div className="py-4 text-center text-slate-200 font-mono text-xs italic uppercase tracking-widest">Memory Ready</div>}
                  </div>
              </div>
            </div>

            {/* Right Col: Simulation Arena & Controls (8/12) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Controls */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end">
                  <div className="flex-1 space-y-1.5 w-full">
                      <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono tracking-tighter">Input Digits (2-9)</label>
                      <input value={inputDigits} onChange={(e) => { setInputDigits(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" placeholder="234" maxLength={4} />
                   </div>
                   <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                      <ChevronLeft size={16}/> Prev
                    </button>
                    <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                      {isBacktracking ? 'Undo Step' : 'Next Step'} <ChevronRight size={16}/>
                    </button>
                   </div>
              </div>

              {/* Action Log / Status */}
              <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group ${isBacktracking ? 'bg-rose-900 border-rose-800' : cur.state.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    {isBacktracking ? <Undo2 size={100} /> : selectedApproach === 'backtracking' ? <GitBranch size={100}/> : <Network size={100}/>}
                </div>
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                      <Target size={14} className={isBacktracking ? "text-rose-400" : "text-indigo-400"}/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono tracking-tighter">Runtime Engine</span>
                   </div>
                   {isBacktracking && <div className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[8px] font-black uppercase animate-pulse font-mono tracking-tighter">Stack Cleaning (Line {cur.line})</div>}
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3 italic font-mono">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[550px] relative flex flex-col overflow-hidden shadow-inner transition-all duration-500">
                <div className="flex items-center justify-between mb-8 z-10">
                   <div className="flex items-center gap-2">
                    <Network size={16} className="text-indigo-600"/>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Process Visualization (n={digits.length})</span>
                   </div>
                   <div className="flex gap-4 font-mono">
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                         <span className="text-[9px] font-black uppercase text-slate-400">Processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                         <span className="text-[9px] font-black uppercase text-slate-400">Complete</span>
                      </div>
                   </div>
                </div>
                
                {/* Visual Content: Decision Tree or Queue Tape */}
                <div className="flex-1 relative w-full overflow-auto scrollbar-thin flex justify-center">
                  {selectedApproach === 'backtracking' ? (
                      <TreeRenderer nodes={treeNodes} activeNodeId={activeNodeId} digits={digits} isBacktracking={isBacktracking} />
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full gap-8">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Active Prefix Transfer</span>
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-2xl font-mono font-black text-xl text-indigo-700 animate-in slide-in-from-left-4">
                                    {bfsPrefix !== undefined ? `"${bfsPrefix}"` : "---"}
                                </div>
                                <Plus className="text-slate-300" />
                                <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl font-mono font-black text-xl text-emerald-700 animate-in slide-in-from-right-4">
                                    {bfsSuffix !== undefined ? `'${bfsSuffix}'` : '-'}
                                </div>
                                <ArrowRight className="text-slate-300" />
                                <div className="p-4 bg-emerald-600 border-2 border-emerald-700 rounded-2xl font-mono font-black text-xl text-white shadow-xl animate-in zoom-in">
                                    {bfsPrefix !== undefined && bfsSuffix !== undefined ? `"${bfsPrefix + bfsSuffix}"` : "?"}
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono text-center">Queue Pipeline (BFS Layer)</span>
                            <div className="flex gap-2 justify-center overflow-x-auto p-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                                {queue?.map((qItem: string, idx: number) => (
                                    <div key={idx} className="px-4 py-2 bg-white border-2 border-indigo-100 text-indigo-700 rounded-xl text-xs font-mono font-bold shadow-sm whitespace-nowrap animate-in slide-in-from-right-4">
                                        {qItem || '""'}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                  )}
                </div>

                {/* Bottom variables float */}
                <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col gap-4">
                    <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-6 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-3 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-6 mb-2 font-mono">
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Scanning Digit</span>
                                <span className="text-xl font-black text-indigo-600">
                                    {selectedApproach === 'backtracking' ? digits[currentFrame.idx] : digits[bfsIdx] || 'EOF'}
                                </span>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Current Choices</span>
                                <span className="text-xl font-black text-purple-600">"{letters || '---'}"</span>
                            </div>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Active Pick</span>
                                <span className="text-xl font-black text-emerald-600">'{activeChar || bfsSuffix || '-'}'</span>
                            </div>
                        </div>
                        
                        {/* StringBuilder / Buffer monitor */}
                        <div className="flex gap-2">
                            {selectedApproach === 'backtracking' ? (
                                currentFrame.currentStr.split('').map((char: string, idx: number) => {
                                    const isLast = idx === currentFrame.currentStr.length - 1;
                                    return (
                                        <div key={idx} className={`w-10 h-14 border-2 rounded-xl flex items-center justify-center font-mono font-black text-2xl transition-all duration-300 shadow-sm ${isLast && isBacktracking ? 'bg-rose-500 border-rose-600 text-white scale-110' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                                            {char}
                                            {isLast && isBacktracking && (
                                                <div className="absolute -top-7 text-rose-500 font-black text-[9px] animate-bounce flex flex-col items-center font-mono tracking-tighter">
                                                    <Trash2 size={12} />
                                                    POP
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="flex items-center gap-2 px-6 py-2 bg-indigo-100 rounded-2xl text-indigo-700 font-mono font-black border border-indigo-200">
                                    <Database size={16}/> BFS QUEUE SIZE: {queue?.length || 0}
                                </div>
                            )}
                            {(selectedApproach === 'backtracking' && currentFrame.currentStr.length === 0) && <span className="text-slate-300 italic font-mono text-sm">(Empty Builder)</span>}
                        </div>
                    </div>
                </div>

                {/* Floating Results Panel */}
                <div className="absolute top-20 right-8 w-40 animate-in slide-in-from-right-4 z-20">
                    <div className="bg-slate-900 shadow-2xl p-4 rounded-3xl border border-slate-700">
                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-3 border-b border-slate-700 pb-2 font-mono font-black">Accumulated: {resultList.length}</span>
                        <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin pr-1 font-mono">
                            {resultList.map((item: string, idx: number) => (
                                <div key={idx} className="text-[10px] font-mono font-bold text-white bg-indigo-600/30 px-2 py-1 rounded border border-indigo-500/20 truncate animate-in zoom-in">
                                    {item}
                                </div>
                            ))}
                            {resultList.length === 0 && <span className="text-[9px] text-slate-600 italic font-mono">exploring...</span>}
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
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono tracking-tighter font-black">All Combinations Found</span>
                        <div className="text-7xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm font-mono italic underline decoration-indigo-100 decoration-8 underline-offset-8">
                           {resultList.length}
                        </div>
                        <div className="mt-8 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono shadow-sm">
                           Search Space: O(3ⁿ * 4ᵐ)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <BookOpen className="text-indigo-600"/> Mastering Combinatorial Search
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-indigo-100 pl-6">
                This problem is a classic application of the <strong>Cartesian Product of Sets</strong>. Each digit in the input represents a set of characters, and we need every possible way to pick one item from each set.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Layers size={18}/> Backtracking Pattern</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4 font-black">
                          "Depth-First State Exploration."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                          1. <strong>Base Case:</strong> Index matches total digits (Add builder to results).
                          <br/>2. <strong>Recurse:</strong> Choose a letter, go deeper into the next index.
                          <br/>3. <strong>Cleanup:</strong> Crucially, <code>deleteCharAt</code> is called to reuse the same memory for the next letter in the current set.
                        </p>
                    </div>
                    <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm"><Network size={18}/> Iterative BFS</h3>
                        <p className="text-sm text-emerald-700 leading-relaxed font-black font-black">
                          "Breadth-First Extension."
                        </p>
                        <p className="text-xs text-emerald-600 leading-relaxed">
                          Instead of going deep, we extend all current possibilities for the new digit. Level 0 is "", Level 1 is ["a", "b", "c"], Level 2 is ["ad", "ae", "af", "bd"...].
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-black">Resource Management</h4>
                    </div>
                    <div className="grid grid-cols-1 gap-4 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono tracking-tighter">DFS Memory</span>
                          <div className="font-mono text-lg font-bold text-indigo-300">O(N) Stack + O(1) Builder</div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest font-black">Very frugal for deep searches</p>
                      </div>
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono tracking-tighter">BFS Memory</span>
                          <div className="font-mono text-lg font-bold text-emerald-300">O(4ⁿ) Queue Storage</div>
                          <p className="text-[9px] text-slate-400 mt-2 uppercase font-black tracking-widest font-black">Can consume massive RAM for large N</p>
                      </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500 font-mono">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono font-black">
                        "Generating letter combinations is an exploration of a multi-way decision tree. I implemented a recursive backtracking algorithm (DFS) that optimizes memory through shared mutable state. By leveraging a single StringBuilder and performing a symmetric delete operation after each recursive return, I maintain the state space at O(N) auxiliary space beyond the results. The time complexity is bounded by the total number of combinations, approximately O(4ⁿ \cdot N), as each unique string must be physically constructed once."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black underline underline-offset-4 decoration-indigo-200 font-black">"Why recursion over simple loops?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                "The number of nested loops required would equal the length of the input digits. Since the input length is variable, we need recursion (or a stack/queue) to handle dynamic nesting depth."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-black underline underline-offset-4 decoration-indigo-200 font-black">"How to handle the empty string case?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed italic font-black">
                                "In my solution, I use an early guard clause: <code>{"if (digits.isEmpty()) return new ArrayList<>()"}</code>. Without this, the seed string "" would be added to the result, returning [""] instead of an empty list, which would fail the test case."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-black tracking-widest font-black">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-black font-black">Dive Deep: Hitting RAM Limits</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Discuss the scalability. With 4 choices per digit, 20 digits would lead to 4²⁰ &approx; 1 trillion combinations. Explain that for larger inputs, we wouldn't return a List but would use an <b>Iterator</b> or <b>Generator</b> pattern.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-black font-black">Frugality</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono italic">Mention that <code>StringBuilder</code> is significantly faster than string concatenation (<code>+</code>) inside the recursion because it avoids creating O(4ⁿ) temporary immutable string objects.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Binary className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter font-black underline decoration-indigo-100 decoration-8 underline-offset-4 font-black">Exploration Growth</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-black tracking-tighter font-black">Small Input (n=2)</span>
                                <span className="text-indigo-500 font-black font-mono font-black">9 Nodes</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-indigo-400 w-[10%]" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-black tracking-tighter font-black">Max Input (n=4)</span>
                                <span className="text-rose-500 font-black font-mono font-black">256 Nodes</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-6 text-center leading-relaxed">Exponential complexity: Adding one digit <br/><span className="text-indigo-600 font-black font-black">Multiplies</span> work by up to 4x.</p>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TreeRenderer = ({ nodes, activeNodeId, digits, isBacktracking }: { nodes: TreeNode[], activeNodeId: string | null, digits: string, isBacktracking?: boolean }) => {
    const nodesByDepth = useMemo(() => {
        const map: Record<number, TreeNode[]> = {};
        nodes.forEach(node => {
            const d = node.depth;
            if (!map[d]) map[d] = [];
            map[d].push(node);
        });
        return map;
    }, [nodes]);

    const canvasWidth = 800;
    const canvasHeight = 500;
    const depthSpacing = canvasHeight / (digits.length + 2);

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
                const depth = node.depth;
                const siblings = nodesByDepth[depth];
                const indexInDepth = siblings.indexOf(node);
                
                const x = (canvasWidth / (siblings.length + 1)) * (indexInDepth + 1);
                const y = depth * depthSpacing + 40;

                const parent = nodes.find(n => n.id === node.parentId);
                let px = 0, py = 0;
                if (parent) {
                    const pDepth = parent.depth;
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
                            fill={isActive ? (isBacktracking ? "#f43f5e" : "#6366f1") : node.status === 'leaf' ? "#10b981" : node.status === 'visited' ? "#f1f5f9" : "white"} 
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
                            fill={isActive || node.status === 'leaf' ? "white" : "#64748b"}
                            className="select-none pointer-events-none font-mono font-black"
                        >
                            {node.val === 'ROOT' ? 'S' : node.val}
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
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|char|List|ArrayList|StringBuilder|LinkedList|length|append|deleteCharAt|toString|charAt|toCharArray|peek|remove|add|Character|getNumericValue)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? 'bg-indigo-500/15' : ''}`}>
      {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? 'text-indigo-400 font-bold' : 'text-slate-700 font-black'}`}>{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100 font-black' : 'opacity-60 group-hover:opacity-100 font-black'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['List', 'ArrayList', 'StringBuilder', 'String', 'LinkedList'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'append', 'deleteCharAt', 'toString', 'charAt', 'toCharArray', 'peek', 'remove', 'add', 'getNumericValue'].includes(part)) return <span key={i} className="text-indigo-300 font-bold">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const TopicButton = ({ active, onClick, title, desc }: { active: boolean; onClick: () => void; title: string; desc: string }) => (
  <button onClick={onClick} className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${active ? 'bg-indigo-50 border-indigo-500 shadow-md ring-1 ring-indigo-100' : 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}`}>
    <div className={`font-black uppercase tracking-tight text-sm ${active ? 'text-blue-800' : 'text-slate-700 group-hover:text-blue-700'}`}>{title}</div>
    <div className={`text-[10px] font-bold mt-1 ${active ? 'text-blue-600' : 'text-slate-400'}`}>{desc}</div>
  </button>
);

export default LetterCombinationsVisualizer;
