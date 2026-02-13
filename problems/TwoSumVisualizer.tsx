
import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Search, Database, Calculator, FileText } from 'lucide-react';

const APPROACHES = {
  hashmap: {
    id: 'hashmap',
    title: '1. One-Pass Hash Map',
    subtitle: 'Optimal O(N)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int[] twoSum(int[] nums, int k) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = k - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
    explanation: "This approach uses a Hash Map to store numbers we have already seen. For each new number, we calculate its 'complement' (the value needed to reach the target). If the complement is already in our map, we've found our pair."
  },
  brute: {
    id: 'brute',
    title: '2. Brute Force',
    subtitle: 'Quadratic Search',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public int[] twoSum(int[] nums, int k) {
        for (int i = 0; i < nums.length; i++) {
            for (int j = i + 1; j < nums.length; j++) {
                if (nums[i] + nums[j] == k) {
                    return new int[] { i, j };
                }
            }
        }
        return new int[] {};
    }
}`,
    explanation: "Checks every possible pair in the array. While simple to implement, its O(N²) performance makes it unsuitable for large datasets common at Amazon."
  }
};

const TwoSumVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('hashmap');
  const [numsInput, setNumsInput] = useState("2,7,11,15");
  const [target, setTarget] = useState(9);
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const nums = useMemo(() => numsInput.split(',').map(n => parseInt(n.trim()) || 0), [numsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = nums.length;
    
    if (selectedApproach === 'hashmap') {
      // INTRO STEPS - Explaining "Why Map?"
      steps.push({
        phase: "Algorithm Strategy",
        description: "GOAL: Find a pair that sums to the target. In a simple array, finding a specific number takes O(N) time. If we search for every number's pair in the array, it becomes O(N²).",
        line: 2,
        state: { i: -1, map: {}, complement: null, exists: false }
      });
      
      steps.push({
        phase: "Choosing the Data Structure",
        description: "Why a Hash Map? Unlike an Array or Linked List, a Hash Map allows us to check if a number exists in 'Constant Time' (O(1) on average). This is our 'Memory' to remember seen values.",
        line: 3,
        state: { i: -1, map: {}, complement: null, exists: false }
      });

      const map: Record<number, number> = {};
      for (let i = 0; i < n; i++) {
        const val = nums[i];
        const complement = target - val;
        const exists = map[complement] !== undefined;
        
        steps.push({
          phase: "Calculate Complement",
          description: `Index ${i} (value: ${val}). We need ${target} - ${val} = ${complement} to complete the pair. Checking the Hash Map memory...`,
          line: 5,
          state: { i, map: { ...map }, complement, exists, matched: exists, result: exists ? [map[complement], i] : null }
        });

        if (exists) {
          steps.push({
            phase: "Pair Found!",
            description: `Match found! Complement ${complement} was stored previously at index ${map[complement]}. Indices [${map[complement]}, ${i}] sum to ${target}.`,
            line: 7,
            state: { i, map: { ...map }, complement, exists, matched: true, result: [map[complement], i], finished: true }
          });
          return steps;
        }
        map[val] = i;
        steps.push({
          phase: "Memorize Value",
          description: `${complement} not found. Storing current value ${val} at index ${i} into our Map for future lookups.`,
          line: 9,
          state: { i, map: { ...map }, complement, exists, matched: false }
        });
      }
    } else {
      steps.push({
        phase: "Brute Force Start",
        description: "Checking every possible pair using nested loops. i=0...n, j=i+1...n.",
        line: 3,
        state: { i: -1, j: -1, sum: null, matched: false }
      });

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const sum = nums[i] + nums[j];
          const matched = sum === target;
          steps.push({
            phase: "Comparison",
            description: `Testing nums[${i}] (${nums[i]}) + nums[${j}] (${nums[j]}) = ${sum}. Target is ${target}.`,
            line: 5,
            state: { i, j, sum, matched, result: matched ? [i, j] : null }
          });
          if (matched) {
            steps.push({
              phase: "Match Found",
              description: `Correct pair found! Indices ${i} and ${j} sum to exactly ${target}.`,
              line: 6,
              state: { i, j, sum, matched: true, result: [i, j], finished: true }
            });
            return steps;
          }
        }
      }
    }
    steps.push({ phase: "No Solution", description: "Reached end of process without finding a valid pair.", line: 11, state: { finished: true, success: false } });
    return steps;
  }, [nums, target, selectedApproach]);

  const currentState = trace[currentStep] || trace[0];
  const { i: activeI, j: activeJ, map, complement, matched, finished, result } = currentState.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-200">
                <Database className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Two Sum</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Amazon Prep</span>
                <span>LC 1 • Easy</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<AlignLeft size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-6">1. Two Sum</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg">
              <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code>.</em></p>
              <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm space-y-2 mt-6">
                <p><span className="text-slate-400 font-bold uppercase">Input:</span> nums = [2,7,11,15], target = 9</p>
                <p><span className="text-slate-400 font-bold uppercase">Output:</span> [0,1]</p>
                <p className="text-slate-400 italic text-xs mt-2">Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2">
                {Object.keys(APPROACHES).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key as any); setCurrentStep(0); }} className={`flex-1 py-4 px-3 rounded-xl transition-all ${selectedApproach === key ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key as keyof typeof APPROACHES].title}</span>
                  </button>
                ))}
              </div>
              <div className="bg-[#0f172a] rounded-2xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Solution.java</span>
                  <button onClick={() => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-slate-400 hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] overflow-auto relative">
                    <div className="absolute left-0 right-0 bg-orange-500/15 border-l-4 border-orange-500 pointer-events-none z-0 transition-all duration-300" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black text-orange-600 uppercase block pl-1 tracking-widest">Input Array</label>
                    <input value={numsInput} onChange={(e) => { setNumsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-purple-600 uppercase block pl-1 tracking-widest">Target</label>
                    <input type="number" value={target} onChange={(e) => { setTarget(parseInt(e.target.value) || 0); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30 hover:bg-slate-200 transition-colors">Prev</button>
                  <button onClick={() => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1))} disabled={currentStep === trace.length - 1} className="flex-[2] py-3 bg-orange-600 text-white rounded-xl font-bold disabled:opacity-30 shadow-lg shadow-orange-100 hover:bg-orange-700 transition-colors">Next Action</button>
                </div>
              </div>

              <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 min-h-[120px]">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{currentState.phase}</span>
                <p className="text-sm leading-relaxed text-slate-200">{currentState.description}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-8 min-h-[300px] flex flex-col justify-center items-center gap-12 relative overflow-hidden">
                {selectedApproach === 'hashmap' && map && (
                  <div className="w-full flex flex-col items-center animate-in slide-in-from-top-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                      <Database size={12}/> Hash Map (Value &rarr; Index)
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      {Object.entries(map).map(([key, val]) => (
                        <div key={key} className={`p-3 border-2 rounded-xl text-center transition-all animate-in zoom-in ${complement?.toString() === key && matched ? 'bg-green-50 border-green-500 scale-110' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="text-[8px] font-black text-slate-400 uppercase">Val</div>
                          <div className="font-mono font-bold text-slate-800">{key}</div>
                          <div className="h-px w-full bg-slate-200 my-1" />
                          <div className="text-[8px] font-black text-orange-600 uppercase">Idx</div>
                          <div className="font-mono font-bold text-slate-800">{val as any}</div>
                        </div>
                      ))}
                      {Object.keys(map).length === 0 && <span className="text-slate-300 italic text-sm">Initial State: Empty Map</span>}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap justify-center gap-4">
                  {nums.map((num, idx) => {
                    const isPointer = selectedApproach === 'hashmap' ? activeI === idx : (idx === activeI || idx === activeJ);
                    const isResult = result?.includes(idx);
                    
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`w-14 h-16 border-2 rounded-xl flex items-center justify-center font-mono text-xl transition-all duration-300 relative ${isResult ? 'bg-green-500 border-green-600 text-white scale-125 z-10 shadow-xl' : isPointer ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-100' : 'bg-white border-slate-200 text-slate-700'}`}>
                          {num}
                          {isPointer && !finished && (
                            <div className="absolute -top-6 text-orange-500 animate-bounce"><Target size={14}/></div>
                          )}
                        </div>
                        <span className="mt-2 text-[10px] font-mono font-black text-slate-400">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                {finished && (
                  <div className="animate-in zoom-in bg-green-50 border-2 border-green-200 p-6 rounded-3xl flex flex-col items-center gap-1 shadow-xl">
                    <Check className="text-green-600" size={32} />
                    <span className="text-xs font-black uppercase text-green-700">Success</span>
                    <div className="text-xl font-black text-slate-900">Indices: [{result?.join(', ')}]</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[500px] animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Complement Strategy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold flex items-center gap-2 text-orange-600"><Search size={20}/> One-Pass Logic</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">Instead of asking "Which two numbers sum to target?", we flip the logic: "I have X, does my partner (Target - X) exist in my memory?"</p>
                </div>
                <div className="p-6 bg-slate-900 rounded-2xl text-orange-400 font-mono text-sm leading-relaxed shadow-xl border border-slate-800">
                  <span className="text-slate-500">// Example Run</span><br/>
                  1. Current = 2, Target = 9 <br/>
                  2. Needed Complement = 9 - 2 = 7 <br/>
                  3. Check Map: Does 7 exist? <br/>
                  4. If No: Store 2 at index 0 for later.
                </div>
                <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 space-y-2">
                  <h4 className="font-black text-orange-800 uppercase text-xs">The Lookup Advantage</h4>
                  <p className="text-sm text-orange-900 italic">"In a list of 1 million items, finding 7 takes 1 million steps. In a Hash Map, it takes exactly 1 step."</p>
                </div>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Cpu size={20}/> Time-Space Tradeoff</h3>
                <p className="text-sm text-slate-600 leading-relaxed">This is a classic "Trading Memory for Speed" optimization. By using O(N) extra space to store our map, we reduce execution time from quadratic O(N²) to linear O(N).</p>
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Brute Force</div>
                        <div className="text-2xl font-black text-slate-800">O(N²)</div>
                        <div className="text-[9px] text-slate-400 uppercase mt-1">Slow on large data</div>
                    </div>
                    <div className="bg-orange-600 p-4 rounded-xl shadow-lg text-white text-center">
                        <div className="text-[10px] font-black opacity-70 uppercase mb-1">Hash Map</div>
                        <div className="text-2xl font-black">O(N)</div>
                        <div className="text-[9px] opacity-70 uppercase mt-1">Lightning fast</div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Target size={120} />
                    </div>
                    <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10 text-orange-400">
                        <Trophy size={20} />
                        The Senior Amazon Pitch
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                        "While a brute force O(N²) approach is intuitive, I opted for a single-pass Hash Map solution to achieve linear O(N) time complexity. This optimization is critical for Amazon's large-scale datasets where N could be millions. By trading a small amount of memory to store a frequency table, we eliminate the need for nested iterations, ensuring the service remains performant under high load. This approach is superior for unsorted data."
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4 uppercase tracking-tight">
                        <MessageSquare className="text-orange-500" size={20} />
                        Critical Follow-ups
                    </h3>
                    <div className="space-y-4 text-sm text-slate-600">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="font-black text-slate-800 mb-1">"What if the array is already sorted?"</p>
                            <p className="leading-relaxed">"If the input is sorted, I would switch to a <strong>Two-Pointer</strong> approach (converging left and right). This achieves O(N) time but improves space complexity to <strong>O(1)</strong>, which is the absolute most memory-efficient solution possible."</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="font-black text-slate-800 mb-1">"Can we use the same index twice?"</p>
                            <p className="leading-relaxed">"No, the problem restricts this. By checking for the complement <i>before</i> adding the current number to the map, my solution naturally prevents using the same element twice."</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle size={20}/> Interviewer Focus Points
                    </h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</div>
                            <div>
                              <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Edge Case: Empty/Small Input</p>
                              <p className="text-xs text-orange-800 leading-relaxed mt-1">Mention that if <code>nums.length &lt; 2</code>, we should return immediately as no pair exists.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</div>
                            <div>
                              <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Collision Handling</p>
                              <p className="text-xs text-orange-800 leading-relaxed mt-1">Understand how the Hash Map handles collisions (Chaining vs Open Addressing) if asked deep dive questions.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">3</div>
                            <div>
                              <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Return Values</p>
                              <p className="text-xs text-orange-800 leading-relaxed mt-1">If no pair exists, the method returns an empty array or throws an exception. Clarifying this demonstrates professional rigor.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${active ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{icon} {label}</button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Map|HashMap|Integer|contains|containsKey|get|put|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] ${active ? 'font-bold bg-orange-500/5' : ''}`}>
      <span className="w-8 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400">{part}</span>;
          if (['Map', 'HashMap', 'Integer', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['containsKey', 'get', 'put', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default TwoSumVisualizer;
