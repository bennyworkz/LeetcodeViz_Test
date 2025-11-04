import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ListOrdered, ArrowRight, XSquare, Hash, 
  Scissors, Shuffle, CheckSquare, XCircle, Timer, RotateCcw
} from 'lucide-react';

const APPROACHES = {
  memoization: {
    id: 'memoization',
    title: 'Memoized Recursion',
    subtitle: 'Optimal: O(N^4) Time, O(N^3) Space.',
    icon: <Shuffle size={16} />,
    complexity: 'Time: O(N^4) | Space: O(N^3)', 
    code: `class Solution {
    Map<String, Boolean> memo = new HashMap<>();

    public boolean isScramble(String s1, String s2) {
        // 1. Base Cases
        if (s1.equals(s2)) return true;
        if (s1.length() != s2.length()) return false;
        
        String key = s1 + "," + s2;
        if (memo.containsKey(key)) return memo.get(key);

        // 2. Pruning: Anagram check
        int[] freqs = new int[26];
        for (int i = 0; i < s1.length(); i++) {
            freqs[s1.charAt(i) - 'a']++;
            freqs[s2.charAt(i) - 'a']--;
        }
        for (int f : freqs) {
            if (f != 0) {
                memo.put(key, false);
                return false;
            }
        }

        int n = s1.length();
        // 3. Try all possible split points
        for (int i = 1; i < n; i++) {
            // Case A: No Swap (Left matches Left, Right matches Right)
            if (isScramble(s1.substring(0, i), s2.substring(0, i)) &&
                isScramble(s1.substring(i), s2.substring(i))) {
                memo.put(key, true);
                return true;
            }
            
            // Case B: Swap (Left matches Right, Right matches Left)
            if (isScramble(s1.substring(0, i), s2.substring(n - i)) &&
                isScramble(s1.substring(i), s2.substring(0, n - i))) {
                memo.put(key, true);
                return true;
            }
        }

        // 4. If all splits fail
        memo.put(key, false);
        return false;
    }
}`,
    explanation: "To determine if `s2` is a scrambled string of `s1`, we can use Divide and Conquer with Memoization. For any two strings, if they are identical, it's a match. If they don't have the exact same characters (anagram check), we immediately prune the branch and return false. Otherwise, we try splitting the string at every possible index `i` (from 1 to N-1). For each split, there are two possibilities: either the two substrings were NOT swapped (so we compare `s1.left` to `s2.left` and `s1.right` to `s2.right`), or they WERE swapped (so we compare `s1.left` to `s2.right` and `s1.right` to `s2.left`). We recursively check both cases. To avoid redundant calculations, we cache the results in a hash map."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">87. Scramble String</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
        <p className="text-lg leading-relaxed">
          We can scramble a string s to get a string t using the following algorithm:
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-sm text-slate-700">
            <li>If the length of the string is 1, stop.</li>
            <li>If the length of the string is &gt; 1, do the following:
                <ul className="list-disc pl-6 space-y-1 mt-1">
                    <li>Split the string into two non-empty substrings at a random index, i.e., if the string is <code>s</code>, divide it to <code>x</code> and <code>y</code> where <code>s = x + y</code>.</li>
                    <li><strong>Randomly</strong> decide to swap the two substrings or to keep them in the same order. i.e., after this step, <code>s</code> may become <code>s = x + y</code> or <code>s = y + x</code>.</li>
                    <li>Apply step 1 recursively on each of the two substrings <code>x</code> and <code>y</code>.</li>
                </ul>
            </li>
        </ol>

        <p className="text-md mt-4">
          Given two strings <code>s1</code> and <code>s2</code> of <strong>the same length</strong>, return <code>true</code> if <code>s2</code> is a scrambled string of <code>s1</code>, otherwise, return <code>false</code>.
        </p>

        <div className="space-y-6 mt-8">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-4">
              <p><span className="text-slate-400 font-bold">Input:</span> s1 = "great", s2 = "rgeat"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="text-slate-500 leading-relaxed font-sans text-sm">
                <span className="text-slate-400 font-bold font-mono">Explanation:</span> One possible scenario applied on s1 is:
                <br/>"great" --&gt; "gr/eat" // divide at random index.
                <br/>"gr/eat" --&gt; "gr/eat" // random decision is not to swap.
                <br/>"gr/eat" --&gt; "g/r / e/at" // apply recursively.
                <br/>"g/r / e/at" --&gt; "r/g / e/at" // random decision to swap "g" and "r".
                <br/>"r/g / e/at" --&gt; "r/g / e/ a/t" // apply recursively.
                <br/>"r/g / e/ a/t" --&gt; "r/g / e/ a/t" // random decision is not to swap.
                <br/>We arrive at "rgeat", therefore it is a scrambled string.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s1 = "abcde", s2 = "caebd"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>s1.length == s2.length</code></li>
              <li><code>1 &lt;= s1.length &lt;= 30</code></li>
              <li><code>s1</code> and <code>s2</code> consist of lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const  ScrambleStringVisualizer= () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('memoization');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Default Inputs
  const [s1Input, setS1Input] = useState('great');
  const [s2Input, setS2Input] = useState('rgeat');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s1 = s1Input.trim().toLowerCase().replace(/[^a-z]/g, '');
    let s2 = s2Input.trim().toLowerCase().replace(/[^a-z]/g, '');
    
    // Fallback if empty or mismatched for the sake of visualizer safely
    if (!s1) s1 = "great";
    if (!s2) s2 = "rgeat";
    
    // Truncate to 5 chars to prevent recursive UI blowup
    if (s1.length > 6) s1 = s1.substring(0, 6);
    if (s2.length > 6) s2 = s2.substring(0, 6);
    
    // Equalize lengths
    if (s1.length !== s2.length) {
        let minLen = Math.min(s1.length, s2.length);
        s1 = s1.substring(0, minLen);
        s2 = s2.substring(0, minLen);
    }

    return { s1, s2 };
  }, [s1Input, s2Input]);

  const trace = useMemo(() => {
    const steps = [];
    const { s1, s2 } = parsedData;
    let memo = {};
    let callId = 0;

    const solve = (str1, str2, depth) => {
        if (steps.length > 2500) return false;
        callId++;

        steps.push({
            phase: 'Evaluate Subproblem',
            description: `Comparing:\ns1 = "${str1}"\ns2 = "${str2}"`,
            line: 5,
            state: { str1, str2, depth, action: 'eval', memo: {...memo} }
        });

        if (str1 === str2) {
            steps.push({
                phase: 'Base Case: Match',
                description: `Strings are identical! "${str1}" == "${str2}"`,
                line: 6,
                state: { str1, str2, depth, action: 'match', memo: {...memo} }
            });
            return true;
        }
        
        let key = str1 + "," + str2;
        if (memo[key] !== undefined) {
             steps.push({
                phase: 'Memoization Hit',
                description: `Result for "${str1}", "${str2}" already computed: ${memo[key]}`,
                line: 10,
                state: { str1, str2, depth, action: 'memo_hit', result: memo[key], memo: {...memo} }
            });
            return memo[key];
        }

        // Anagram check (pruning)
        let f1 = str1.split('').sort().join('');
        let f2 = str2.split('').sort().join('');
        if (f1 !== f2) {
             steps.push({
                phase: 'Pruning: Not Anagrams',
                description: `Characters don't match. Cannot be scrambled.\nSorted s1: ${f1}\nSorted s2: ${f2}`,
                line: 18,
                state: { str1, str2, depth, action: 'prune', memo: {...memo} }
            });
            memo[key] = false;
            return false;
        }

        let n = str1.length;
        for (let i = 1; i < n; i++) {
            if (steps.length > 2500) return false;
            
            steps.push({
                phase: `Split & Check (No Swap)`,
                description: `Splitting at length ${i}.\nChecking if Left matches Left, and Right matches Right.`,
                line: 25,
                state: { str1, str2, splitIdx: i, swapped: false, depth, action: 'split', memo: {...memo} }
            });

            if (solve(str1.substring(0, i), str2.substring(0, i), depth + 1) && 
                solve(str1.substring(i), str2.substring(i), depth + 1)) {
                
                memo[key] = true;
                steps.push({
                    phase: 'Valid Scramble Found',
                    description: `No-Swap split at ${i} was successful for "${str1}" and "${str2}".`,
                    line: 28,
                    state: { str1, str2, splitIdx: i, swapped: false, depth, action: 'success', memo: {...memo} }
                });
                return true;
            }

            steps.push({
                phase: `Split & Check (Swap)`,
                description: `Splitting at length ${i}.\nChecking if Left matches Right, and Right matches Left.`,
                line: 32,
                state: { str1, str2, splitIdx: i, swapped: true, depth, action: 'split', memo: {...memo} }
            });

            if (solve(str1.substring(0, i), str2.substring(n - i), depth + 1) && 
                solve(str1.substring(i), str2.substring(0, n - i), depth + 1)) {
                
                memo[key] = true;
                steps.push({
                    phase: 'Valid Scramble Found',
                    description: `Swap split at ${i} was successful for "${str1}" and "${str2}".`,
                    line: 35,
                    state: { str1, str2, splitIdx: i, swapped: true, depth, action: 'success', memo: {...memo} }
                });
                return true;
            }
        }

        memo[key] = false;
        steps.push({
            phase: 'No Valid Splits',
            description: `All possible splits failed for "${str1}" and "${str2}". Memoizing false.`,
            line: 39,
            state: { str1, str2, depth, action: 'fail', memo: {...memo} }
        });
        return false;
    };

    let result = false;
    if (s1.length === s2.length && s1.length > 0) {
        result = solve(s1, s2, 0);
    }
    
    steps.push({
        phase: 'Algorithm Complete',
        description: `Final Result: ${result}\n"${s2}" is ${result ? '' : 'NOT '}a scrambled string of "${s1}".`,
        line: 42,
        state: { str1: s1, str2: s2, isSuccess: result, action: 'complete', memo: {...memo} }
    });

    return steps;
  }, [parsedData]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedApproach.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const sState = cur.state || {};

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-100 flex items-center justify-center">
                <Shuffle className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Scramble String</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 87</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Strings</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-orange-500 border-orange-500 text-white shadow-orange-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-orange-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-orange-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${sState.action === 'complete' ? 'bg-emerald-500/20 border-emerald-500' : (sState.action === 'prune' || sState.action === 'fail' ? 'bg-rose-500/20 border-rose-500' : (sState.action === 'split' ? 'bg-amber-500/20 border-amber-500' : (sState.action === 'success' || sState.action === 'match' ? 'bg-teal-500/20 border-teal-500' : 'bg-orange-500/20 border-orange-500')))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={sState.action === 'complete' ? 'emerald' : (sState.action === 'prune' || sState.action === 'fail' ? 'rose' : (sState.action === 'split' ? 'amber' : (sState.action === 'success' || sState.action === 'match' ? 'teal' : 'orange')))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-orange-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <VariableCard label="Depth" val={sState.depth !== undefined ? sState.depth : "-"} color="purple" active={sState.depth !== undefined} />
                        <VariableCard label="Memo Entries" val={sState.memo ? Object.keys(sState.memo).length : "-"} color="sky" active={sState.memo && Object.keys(sState.memo).length > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full flex flex-col gap-2">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-orange-600 uppercase block pl-1 tracking-widest font-mono">String 1</label>
                                <input type="text" value={s1Input} onChange={(e) => { setS1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-sm shadow-inner font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500" placeholder="great" maxLength={6} />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-black text-orange-600 uppercase block pl-1 tracking-widest font-mono">String 2</label>
                                <input type="text" value={s2Input} onChange={(e) => { setS2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-mono text-sm shadow-inner font-bold text-slate-700 outline-none focus:ring-2 focus:ring-orange-500" placeholder="rgeat" maxLength={6} />
                            </div>
                        </div>
                        <p className="text-[9px] text-slate-400 pl-1 font-mono">Max length 6 (to prevent huge recursion trees).</p>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto pb-5">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2 bg-orange-500 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-orange-200 hover:bg-orange-600 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${sState.action === 'complete' ? 'bg-emerald-900 border-emerald-800' : (sState.action === 'prune' || sState.action === 'fail' ? 'bg-rose-900 border-rose-800' : (sState.action === 'match' || sState.action === 'success' || sState.action === 'memo_hit' ? 'bg-teal-900 border-teal-800' : (sState.action === 'split' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800')))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {sState.action === 'complete' || sState.action === 'match' || sState.action === 'success' || sState.action === 'memo_hit' ? <Check size={100}/> : (sState.action === 'prune' || sState.action === 'fail' ? <XCircle size={100}/> : (sState.action === 'split' ? <Scissors size={100}/> : <Activity size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={sState.action === 'complete' || sState.action === 'match' || sState.action === 'success' || sState.action === 'memo_hit' ? "text-teal-400" : (sState.action === 'prune' || sState.action === 'fail' ? 'text-rose-400' : (sState.action === 'split' ? 'text-amber-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${sState.action === 'complete' || sState.action === 'match' || sState.action === 'success' || sState.action === 'memo_hit' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30' : (sState.action === 'prune' || sState.action === 'fail' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (sState.action === 'split' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'))}`}>Line {cur.line}</div>
                     </div>
                  </div>
                  <div className="text-xl font-black tracking-tight mb-3 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                      {cur.phase}
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line overflow-y-auto max-h-[100px] scrollbar-thin relative z-10">
                      {cur.description}
                  </div>
                </div>

                {/* Simulation Arena */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-center min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-12 justify-center">
                      
                      {sState.str1 && sState.str2 && sState.action !== 'complete' && (
                          <div className="flex flex-col gap-16 relative w-full items-center">
                              
                              {/* S1 Row */}
                              <div className="flex items-center gap-4 relative">
                                  <div className="absolute -left-12 text-xs font-bold text-slate-400 font-mono">s1</div>
                                  
                                  {/* Render split strings if action is split */}
                                  {sState.action === 'split' ? (
                                      <div className="flex gap-4">
                                          <div className="flex bg-slate-800 rounded-xl p-1 shadow-lg border-2 border-slate-700">
                                              {sState.str1.substring(0, sState.splitIdx).split('').map((char, i) => (
                                                  <div key={`s1L-${i}`} className="w-10 h-12 flex items-center justify-center text-white font-mono font-black text-xl">{char}</div>
                                              ))}
                                          </div>
                                          <div className="flex bg-slate-800 rounded-xl p-1 shadow-lg border-2 border-slate-700">
                                              {sState.str1.substring(sState.splitIdx).split('').map((char, i) => (
                                                  <div key={`s1R-${i}`} className="w-10 h-12 flex items-center justify-center text-white font-mono font-black text-xl">{char}</div>
                                              ))}
                                          </div>
                                      </div>
                                  ) : (
                                      <div className={`flex rounded-xl p-1 shadow-md border-2 transition-colors ${sState.action === 'match' || sState.action === 'success' ? 'bg-teal-50 border-teal-400 text-teal-800' : (sState.action === 'prune' || sState.action === 'fail' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-slate-100 border-slate-300 text-slate-800')}`}>
                                          {sState.str1.split('').map((char, i) => (
                                              <div key={`s1-${i}`} className="w-10 h-12 flex items-center justify-center font-mono font-black text-xl">{char}</div>
                                          ))}
                                      </div>
                                  )}
                              </div>

                              {/* Connections / Swaps representation */}
                              {sState.action === 'split' && (
                                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center pointer-events-none z-0">
                                     {sState.swapped ? (
                                         <div className="flex items-center justify-center gap-8 w-64 h-24">
                                              <svg className="absolute w-full h-full text-amber-500 drop-shadow-md">
                                                 {/* Crossed arrows representing swap */}
                                                 <line x1="20%" y1="0%" x2="80%" y2="100%" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" markerEnd="url(#arrow)" />
                                                 <line x1="80%" y1="0%" x2="20%" y2="100%" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" markerEnd="url(#arrow)" />
                                                 <defs>
                                                     <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                         <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                                                     </marker>
                                                 </defs>
                                              </svg>
                                              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-300 shadow-sm z-10">SWAP EVAL</div>
                                         </div>
                                     ) : (
                                         <div className="flex items-center justify-center gap-16 w-64 h-24">
                                              <svg className="absolute w-full h-full text-sky-500 drop-shadow-md">
                                                 {/* Straight arrows representing no swap */}
                                                 <line x1="25%" y1="0%" x2="25%" y2="100%" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" markerEnd="url(#arrow-sky)" />
                                                 <line x1="75%" y1="0%" x2="75%" y2="100%" stroke="currentColor" strokeWidth="4" strokeDasharray="6,6" markerEnd="url(#arrow-sky)" />
                                                 <defs>
                                                     <marker id="arrow-sky" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                                         <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
                                                     </marker>
                                                 </defs>
                                              </svg>
                                              <div className="bg-sky-100 text-sky-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-sky-300 shadow-sm z-10 mt-8">NO SWAP EVAL</div>
                                         </div>
                                     )}
                                 </div>
                              )}

                              {/* S2 Row */}
                              <div className="flex items-center gap-4 relative z-10">
                                  <div className="absolute -left-12 text-xs font-bold text-slate-400 font-mono">s2</div>
                                  
                                  {sState.action === 'split' ? (
                                      <div className="flex gap-4">
                                          <div className="flex bg-slate-800 rounded-xl p-1 shadow-lg border-2 border-slate-700">
                                              {sState.str2.substring(0, sState.swapped ? sState.str2.length - sState.splitIdx : sState.splitIdx).split('').map((char, i) => (
                                                  <div key={`s2L-${i}`} className="w-10 h-12 flex items-center justify-center text-white font-mono font-black text-xl">{char}</div>
                                              ))}
                                          </div>
                                          <div className="flex bg-slate-800 rounded-xl p-1 shadow-lg border-2 border-slate-700">
                                              {sState.str2.substring(sState.swapped ? sState.str2.length - sState.splitIdx : sState.splitIdx).split('').map((char, i) => (
                                                  <div key={`s2R-${i}`} className="w-10 h-12 flex items-center justify-center text-white font-mono font-black text-xl">{char}</div>
                                              ))}
                                          </div>
                                      </div>
                                  ) : (
                                      <div className={`flex rounded-xl p-1 shadow-md border-2 transition-colors ${sState.action === 'match' || sState.action === 'success' ? 'bg-teal-50 border-teal-400 text-teal-800' : (sState.action === 'prune' || sState.action === 'fail' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-slate-100 border-slate-300 text-slate-800')}`}>
                                          {sState.str2.split('').map((char, i) => (
                                              <div key={`s2-${i}`} className="w-10 h-12 flex items-center justify-center font-mono font-black text-xl">{char}</div>
                                          ))}
                                      </div>
                                  )}
                              </div>

                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {sState.action === 'complete' && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${sState.isSuccess ? 'bg-teal-100 text-teal-600' : 'bg-rose-100 text-rose-600'}`}>
                              {sState.isSuccess ? <Check size={32} strokeWidth={3}/> : <XCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">
                                  {sState.isSuccess ? 'SCRAMBLED!' : 'NOT SCRAMBLED'}
                              </span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block ${sState.isSuccess ? 'text-teal-600' : 'text-rose-600'}`}>
                                  Final Evaluation Result
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
                <Shuffle className="text-orange-500"/> Divide & Conquer with DP
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-orange-100 pl-6">
                Scramble String is a classic 3D Dynamic Programming / Memoized Recursion problem. Since the split can happen anywhere, and the sub-parts can be swapped or un-swapped, we must check all combinations recursively.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Scissors size={18}/> Splitting Logic
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            For a string of length <code>N</code>, we can split it at any index <code>i</code> from <code>1</code> to <code>N-1</code>.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p><strong>Case 1: No Swap.</strong> The left part of <code>s1</code> (length <code>i</code>) matches the left part of <code>s2</code> (length <code>i</code>). The right part of <code>s1</code> matches the right part of <code>s2</code>.</p>
                            <p><strong>Case 2: Swap.</strong> The left part of <code>s1</code> (length <code>i</code>) matches the <em>right</em> part of <code>s2</code> (length <code>i</code>). The right part of <code>s1</code> matches the <em>left</em> part of <code>s2</code>.</p>
                            <p>If either case returns true for any split point <code>i</code>, the whole string is a valid scramble.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-rose-50 border border-rose-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-rose-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <AlertCircle size={18}/> The Importance of Pruning
                        </h3>
                        <p className="text-xs text-rose-800 leading-relaxed mb-4">
                            Without pruning, the recursion tree grows exponentially to $O(4^N)$.
                        </p>
                        <div className="text-xs text-rose-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-rose-200 shadow-inner space-y-2">
                            <p><strong>Anagram Check:</strong> If <code>s1</code> and <code>s2</code> don't have the exact same character frequencies, it's physically impossible for them to be scrambles. This simple $O(N)$ check avoids plunging into massive invalid recursive subtrees.</p>
                            <p><strong>Memoization:</strong> We use a HashMap or a 3D boolean array <code>dp[length][i][j]</code> to store previously computed results for substring comparisons, bringing the time down to polynomial.</p>
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
                        "To solve Scramble String, I use a recursive divide-and-conquer approach with memoization. For two strings s1 and s2, I first handle base cases: returning true if they are identical, and false if their character frequencies differ (using a size-26 frequency array for an O(N) anagram check). Then, I iterate a split index `i` from 1 to N-1. For each split, I recursively check two possibilities: the unswapped case (left matches left, right matches right) and the swapped case (left matches right, right matches left). If any recursive path returns true, I cache and return true. I memoize the states using the two strings as a key (or a 3D array of indices `[len][i][j]`) to avoid redundant work, achieving an O(N^4) time complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Layers size={14} className="text-orange-500"/> FAQ: Top-Down vs Bottom-Up DP?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You can solve this using a 3D Bottom-Up DP table: <code>dp[len][i][j]</code> where `len` is length, `i` is start index in s1, `j` is start index in s2.
                                <br/><br/>
                                However, <strong>Top-Down Recursion with Memoization is highly preferred</strong> in interviews for this problem. It's much easier to implement, logically translates directly from the problem description, and crucially, allows for early pruning (the anagram check) which pure Bottom-Up DP cannot easily do without ruining its loop structure.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-orange-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">O(N⁴)</span>
                                <p className="text-[10px] text-slate-500 mt-1">There are O(N^3) possible states (length, start index i, start index j). For each state, we loop up to N times to test split points. Thus, O(N^4).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">O(N³)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The memoization table stores O(N^3) states. The recursion stack goes up to depth N.</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        orange: 'bg-orange-50 border-orange-200 text-orange-700'
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'orange' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|isScramble|length|substring|equals|charAt|containsKey|get|put|Map|HashMap)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'Map', 'HashMap'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isScramble', 'length', 'substring', 'equals', 'charAt', 'containsKey', 'get', 'put'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s1', 's2', 'memo', 'key', 'freqs', 'i', 'n', 'f'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};


export default ScrambleStringVisualizer;