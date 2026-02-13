import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, Hash, Plus, ArrowRight, Database, Calculator, FileText, LayoutGrid, BarChart3, TrendingUp, ArrowDown, Droplet, Info } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Elementary Math',
    subtitle: 'Linear One-Pass',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(max(M,N)) | Space: O(max(M,N))',
    code: `class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummyHead = new ListNode(0);
        ListNode curr = dummyHead;
        int carry = 0;
        while (l1 != null || l2 != null || carry != 0) {
            int x = (l1 != null) ? l1.val : 0;
            int y = (l2 != null) ? l2.val : 0;
            int sum = carry + x + y;
            carry = sum / 10;
            curr.next = new ListNode(sum % 10);
            curr = curr.next;
            if (l1 != null) l1 = l1.next;
            if (l2 != null) l2 = l2.next;
        }
        return dummyHead.next;
    }
}`,
    explanation: "We simulate the standard addition algorithm. By traversing the lists from the head (least significant digit), we can easily propagate the carry to the next position. Using a dummy head simplifies result construction."
  }
};

const AddTwoNumbersVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [l1Input, setL1Input] = useState("2,4,3");
  const [l2Input, setL2Input] = useState("5,6,4");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const l1Arr = useMemo(() => l1Input.split(',').map(s => parseInt(s.trim()) || 0), [l1Input]);
  const l2Arr = useMemo(() => l2Input.split(',').map(s => parseInt(s.trim()) || 0), [l2Input]);

  const trace = useMemo(() => {
    const steps = [];
    const resArr: number[] = [];
    let carry = 0;
    let i = 0, j = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          ...state, 
          resArr: [...resArr],
          l1: [...l1Arr],
          l2: [...l2Arr]
        } 
      });
    };

    addStep("Init", "Create a dummy head node to simplify the linked list construction.", 3, { p1: -1, p2: -1, carry: 0 });
    addStep("Init", "Initialize 'curr' pointer to track the tail of our result list.", 4, { p1: -1, p2: -1, carry: 0 });
    addStep("Init", "Set initial carry to 0.", 5, { p1: -1, p2: -1, carry: 0 });

    while (i < l1Arr.length || j < l2Arr.length || carry !== 0) {
      addStep("Loop Header", "Check: Are there more digits in L1, L2, or a remaining carry?", 6, { p1: i, p2: j, carry });
      
      const x = i < l1Arr.length ? l1Arr[i] : 0;
      addStep("Read L1", `Extracting digit from L1. Found ${i < l1Arr.length ? l1Arr[i] : "null (using 0)"}.`, 7, { p1: i, p2: j, carry, x });
      
      const y = j < l2Arr.length ? l2Arr[j] : 0;
      addStep("Read L2", `Extracting digit from L2. Found ${j < l2Arr.length ? l2Arr[j] : "null (using 0)"}.`, 8, { p1: i, p2: j, carry, x, y });
      
      const sum = carry + x + y;
      addStep("Summation", `Calculate total sum for this position: carry(${carry}) + x(${x}) + y(${y}) = ${sum}.`, 9, { p1: i, p2: j, carry, x, y, sum });
      
      const nextCarry = Math.floor(sum / 10);
      addStep("Carry Update", `New carry is sum/10: ${sum} / 10 = ${nextCarry}.`, 10, { p1: i, p2: j, carry: nextCarry, x, y, sum });
      carry = nextCarry;

      const digit = sum % 10;
      resArr.push(digit);
      addStep("Create Node", `Creating new result node with sum % 10: ${sum} % 10 = ${digit}.`, 11, { p1: i, p2: j, carry, x, y, sum, digit });
      addStep("Advance Result", "Move the result tail pointer forward to the new node.", 12, { p1: i, p2: j, carry, x, y, sum, digit });

      if (i < l1Arr.length) {
        addStep("Advance L1", "Index 'i' is within bounds. Moving L1 pointer to next node.", 13, { p1: i, p2: j, carry, x, y, sum });
        i++;
      }
      if (j < l2Arr.length) {
        addStep("Advance L2", "Index 'j' is within bounds. Moving L2 pointer to next node.", 14, { p1: i, p2: j, carry, x, y, sum });
        j++;
      }
    }

    addStep("Finalization", "All inputs and carry processed. Returning the result list starting from dummyHead.next.", 16, { finished: true });
    return steps;
  }, [l1Arr, l2Arr]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES.optimal.code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Plus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Add Two Numbers</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">LinkedList Master</span>
                <span>LC 2 • Medium</span>
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

        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">2. Add Two Numbers</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>You are given two <strong>non-empty</strong> linked lists representing two non-negative integers. The digits are stored in <strong>reverse order</strong>, and each of their nodes contains a single digit.</p>
                  <p>Add the two numbers and return the sum as a linked list.</p>
                  <p>You may assume the two numbers do not contain any leading zero, except the number 0 itself.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example 1:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 font-mono text-sm space-y-3 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> l1 = [2,4,3], l2 = [5,6,4]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> [7,0,8]</p>
                    <p className="text-slate-500 italic text-xs leading-relaxed border-t border-slate-200 pt-3">
                      Explanation: 342 + 465 = 807.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li>The number of nodes in each linked list is in the range <code>[1, 100]</code>.</li>
                  <li><code>0 &lt;= Node.val &lt;= 9</code></li>
                  <li>It is guaranteed that the list represents a number that does not have leading zeros.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <VisualizerMode 
            trace={trace} 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep}
            l1Input={l1Input}
            setL1Input={setL1Input}
            l2Input={l2Input}
            setL2Input={setL2Input}
            handleCopy={handleCopy}
            copied={copied}
          />
        )}

        {activeTab === 'learn' && <LearnMode />}
        {activeTab === 'interview' && <InterviewHelper />}

      </div>
    </div>
  );
};

const VisualizerMode = ({ trace, currentStep, setCurrentStep, l1Input, setL1Input, l2Input, setL2Input, handleCopy, copied }: any) => {
  const cur = trace[currentStep] || trace[0];
  const { p1, p2, carry, resArr, l1, l2, finished, sum } = cur.state;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
      <div className="flex flex-col gap-6">
        <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
          <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Code2 size={14} className="text-indigo-400" />
              <span className="font-bold uppercase tracking-tight">AddTwoNumbers.java</span>
            </div>
            <button onClick={handleCopy} className="hover:text-white transition-colors">
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
              <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
              {APPROACHES.optimal.code.split('\n').map((line, idx) => (
                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
              ))}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
              <Info size={18} />
              <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES.optimal.explanation}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest">L1 (CSV)</label>
                  <input value={l1Input} onChange={(e) => { setL1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
              </div>
              <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-purple-600 uppercase block pl-1 tracking-widest">L2 (CSV)</label>
                  <input value={l2Input} onChange={(e) => { setL2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-inner" />
              </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setCurrentStep((p: number) => Math.max(0, p - 1))} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <ChevronLeft size={16}/> Prev
            </button>
            <button onClick={() => setCurrentStep((p: number) => Math.min(trace.length - 1, p + 1))} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
              Next Step <ChevronRight size={16}/>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
              <Database size={100}/>
          </div>
          <div className="flex items-center gap-2 mb-3">
             <Target size={14} className="text-blue-400"/>
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Additions Engine</span>
          </div>
          <div className="text-lg font-black tracking-tight mb-2 uppercase">
              {cur.phase}
          </div>
          <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[400px] relative flex flex-col justify-center gap-8 overflow-hidden shadow-inner">
            <div className="space-y-2">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">List 1 (Digits Reversed)</span>
                <div className="flex items-center gap-3">
                    {l1.map((val: number, idx: number) => (
                        <ListNodeVisual key={idx} val={val} isActive={p1 === idx} color="indigo" />
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-6 px-4">
                <div className="bg-slate-100 p-2 rounded-full"><Plus size={16} className="text-slate-400"/></div>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Carry</span>
                        <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center font-mono font-black ${carry > 0 ? 'bg-amber-50 border-amber-400 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                            {carry}
                        </div>
                    </div>
                    <div className="text-2xl font-black text-slate-200">=</div>
                    <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase">Current Sum</span>
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 border-2 border-indigo-200 flex items-center justify-center font-mono font-black text-xl text-indigo-700">
                            {sum ?? '?'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block">List 2 (Digits Reversed)</span>
                <div className="flex items-center gap-3">
                    {l2.map((val: number, idx: number) => (
                        <ListNodeVisual key={idx} val={val} isActive={p2 === idx} color="purple" />
                    ))}
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block">Resulting Sum List</span>
                <div className="flex items-center gap-3">
                    {resArr.map((val: number, idx: number) => (
                        <ListNodeVisual key={idx} val={val} isActive={idx === resArr.length - 1 && !finished} color="emerald" />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const ListNodeVisual = ({ val, isActive, color }: any) => {
    const colors: any = {
        indigo: isActive ? 'bg-indigo-600 border-indigo-700 text-white' : 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: isActive ? 'bg-purple-600 border-purple-700 text-white' : 'bg-purple-50 border-purple-200 text-purple-700',
        emerald: isActive ? 'bg-emerald-600 border-emerald-700 text-white' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
    };
    return (
        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-mono font-black text-lg transition-all duration-300 ${colors[color]} ${isActive ? 'scale-110 shadow-lg' : 'opacity-80'}`}>
            {val}
        </div>
    );
};

const LearnMode = () => (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[500px] animate-in fade-in space-y-10">
        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Reverse Order Logic</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed text-lg">
                    This problem is deceptively simple because the linked lists are already in <strong>reverse order</strong>. This matches exactly how humans perform addition on paper: starting from the <i>ones</i> place and moving to <i>tens</i>, <i>hundreds</i>, etc.
                </p>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="font-bold flex items-center gap-2"><Plus size={18}/> Manual Addition</h3>
                    <div className="font-mono text-xl space-y-1 text-center">
                        <div className="text-slate-400 tracking-widest">3 4 2</div>
                        <div className="border-b-2 border-slate-300 pb-1 text-slate-400 tracking-widest">+ 4 6 5</div>
                        <div className="pt-1 font-black text-indigo-600 tracking-widest">8 0 7</div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-600"><Zap size={20}/> The Carry Bit</h3>
                <p className="text-sm text-slate-600">
                    The only real state we need to track besides our list pointers is the <code>carry</code>. 
                    Because each node can only hold a single digit (0-9), any sum &ge; 10 must overflow its tens-place into the next calculation.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                        <div className="text-[10px] font-black uppercase text-indigo-400 mb-1">Time</div>
                        <div className="text-2xl font-black">O(max(M,N))</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                        <div className="text-[10px] font-black uppercase text-slate-400 mb-1">Space</div>
                        <div className="text-2xl font-black">O(max(M,N))</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const InterviewHelper = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
        <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                    <Trophy size={140} />
                </div>
                <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight font-mono">
                    <Trophy size={24} /> Senior Interview Pitch
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                    "I implemented an O(max(M,N)) elementary math simulation to handle arbitrary-precision addition. By leveraging the provided reverse-order property of the input lists, I can perform a single linear scan from the least significant digit, propagating the carry forward. My solution uses a dummy head node pattern to streamline result construction and ensures all edge cases—including trailing carries that extend the list length—are handled in a single, robust pass."
                </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono">
                    <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                </h3>
                <div className="space-y-4">
                    <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Why use a dummy head?"</p>
                        <p className="text-xs text-slate-600 leading-relaxed font-mono">
                            "A dummy head avoids special-case logic for the first node of the result list. Instead of checking if <code>head == null</code> on every iteration, we simply attach new nodes to <code>curr.next</code> and return <code>dummy.next</code> at the end."
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                    <AlertCircle size={20}/> Leadership Focus
                </h3>
                <ul className="space-y-8">
                    <li className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                        <div>
                          <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Attention to Detail</p>
                          <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Don't forget the final carry! If L1 and L2 are exhausted but <code>carry == 1</code>, you must append one last node.</p>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                        <div>
                          <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Robustness</p>
                          <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Mention handling lists of vastly different lengths. The ternary checks <code>(l1 != null) ? l1.val : 0</code> handle this elegantly.</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
);

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|ListNode|Math|max|min|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'ListNode'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['Math', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['length', 'max', 'min'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default AddTwoNumbersVisualizer;
