import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  Zap, Timer, ListOrdered, ArrowRight, Hash, XSquare, Blocks, 
  CheckSquare, Search, Info, Grid3X3, ArrowDownRight, ArrowDown, ArrowRight as ArrowRightIcon
} from 'lucide-react';

const APPROACHES = {
  dp2d: {
    id: 'dp2d',
    title: 'Dynamic Programming (2D)',
    subtitle: 'Optimal: O(M * N) Time, O(M * N) Space.',
    icon: <Grid3X3 size={16} />,
    complexity: 'Time: O(M * N) | Space: O(M * N)', 
    code: `class Solution {
    public boolean isInterleave(String s1, String s2, String s3) {
        int m = s1.length(), n = s2.length();
        
        // 1. Length check
        if (m + n != s3.length()) return false;
        
        // dp[i][j] means if s3[0..i+j-1] is an interleaving of s1[0..i-1] and s2[0..j-1]
        boolean[][] dp = new boolean[m + 1][n + 1];
        
        // 2. Base case: empty strings interleave to empty string
        dp[0][0] = true;
        
        for (int i = 0; i <= m; i++) {
            for (int j = 0; j <= n; j++) {
                if (i == 0 && j == 0) continue;
                
                // Which char in s3 are we trying to match?
                int p = i + j - 1; 
                
                // 3. Can we take the current char from s1?
                if (i > 0 && s1.charAt(i - 1) == s3.charAt(p)) {
                    dp[i][j] = dp[i][j] || dp[i - 1][j];
                }
                
                // 4. Can we take the current char from s2?
                if (j > 0 && s2.charAt(j - 1) == s3.charAt(p)) {
                    dp[i][j] = dp[i][j] || dp[i][j - 1];
                }
            }
        }
        
        return dp[m][n];
    }
}`,
    explanation: "We build a 2D grid where `dp[i][j]` is true if the prefix of `s3` (length `i+j`) can be formed by interleaving the prefix of `s1` (length `i`) and the prefix of `s2` (length `j`). At each cell, we check two possibilities: Can the current character of `s3` come from `s1` (if it matches and the cell strictly above is true), OR can it come from `s2` (if it matches and the cell strictly to the left is true)?"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">97. Interleaving String</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given strings <code>s1</code>, <code>s2</code>, and <code>s3</code>, find whether <code>s3</code> is formed by an <strong>interleaving</strong> of <code>s1</code> and <code>s2</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-teal-500 pl-4 bg-teal-50 py-3 mt-4">
          An interleaving of two strings <code>s</code> and <code>t</code> is a configuration where they are divided into non-empty substrings such that:<br/>
          <code>s = s<sub>1</sub> + s<sub>2</sub> + ... + s<sub>n</sub></code><br/>
          <code>t = t<sub>1</sub> + t<sub>2</sub> + ... + t<sub>m</sub></code><br/>
          <code>|n - m| &lt;= 1</code><br/>
          The interleaving is <code>s<sub>1</sub> + t<sub>1</sub> + s<sub>2</sub> + t<sub>2</sub> + ...</code>
        </p>
        
        <p className="text-sm italic text-slate-500">
          Note: <code>a + b</code> is the concatenation of strings <code>a</code> and <code>b</code>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s1 = "aabcc", s2 = "dbbca", s3 = "aadbbcbcac"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> One way to obtain s3 is:<br/>
                Split s1 into "aa" + "bc" + "c", and s2 into "dbbc" + "a".<br/>
                Interleaving the two splits, we get "aa" + "dbbc" + "bc" + "a" + "c" = "aadbbcbcac".
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s1 = "aabcc", s2 = "dbbca", s3 = "aadbbbaccc"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> Notice how it is impossible to interleave s1 and s2 to form s3.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= s1.length, s2.length &lt;= 100</code></li>
              <li><code>0 &lt;= s3.length &lt;= 200</code></li>
              <li><code>s1</code>, <code>s2</code>, and <code>s3</code> consist of lowercase English letters.</li>
          </ul>
          <p className="text-sm italic font-bold text-slate-700 mt-4">
            Follow up: Could you solve it using only <code>O(s2.length)</code> additional memory space?
          </p>
        </div>
      </div>
    </div>
  </div>
);

const InterleavingStringVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dp2d');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Short defaults to keep the DP grid readable without scrolling
  const [s1Input, setS1Input] = useState('aab');
  const [s2Input, setS2Input] = useState('axy');
  const [s3Input, setS3Input] = useState('aaxaby');

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Limit inputs for visualization sanity (max 6 chars)
    const s1 = s1Input.trim().substring(0, 6);
    const s2 = s2Input.trim().substring(0, 6);
    const s3 = s3Input.trim().substring(0, 12);
    return { s1, s2, s3 };
  }, [s1Input, s2Input, s3Input]);

  const trace = useMemo(() => {
    const steps = [];
    const { s1, s2, s3 } = parsedData;

    const m = s1.length;
    const n = s2.length;

    const add = (phase, desc, line, stateProps) => {
        if (steps.length > 2000) return;
        // Deep clone DP array
        const dpClone = stateProps.dp ? stateProps.dp.map(row => [...row]) : [];
        steps.push({
            phase,
            description: desc,
            line,
            state: { ...stateProps, dp: dpClone }
        });
    };

    let dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(false));

    add('Length Check', `Checking if s1.length (${m}) + s2.length (${n}) == s3.length (${s3.length}).`, 5, { s1, s2, s3, dp, m, n, i: null, j: null, p: null });

    if (m + n !== s3.length) {
        add('Length Mismatch', `Lengths do not match. It's impossible to form s3. Returning false immediately.`, 5, { s1, s2, s3, dp, m, n, i: null, j: null, p: null, isFail: true });
        return steps;
    }

    add('Initialize DP Map', `Created a 2D boolean grid of size ${m + 1} x ${n + 1}.`, 8, { s1, s2, s3, dp, m, n, i: null, j: null, p: null });

    dp[0][0] = true;
    add('Base Case', `dp[0][0] = true.\n\nTwo empty strings interleave to form an empty string perfectly.`, 11, { s1, s2, s3, dp, m, n, i: 0, j: 0, p: null });

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if (i === 0 && j === 0) continue;

            const p = i + j - 1;
            const targetChar = s3[p];
            let val = false;

            add(`Cell (${i}, ${j})`, `Evaluating dp[${i}][${j}].\n\nTarget char in s3 is at index ${p}: '${targetChar}'`, 17, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: false, checkLeft: false });

            let topMatch = false;
            if (i > 0) {
                const s1Char = s1[i - 1];
                const charMatch = s1Char === targetChar;
                add(`Check Top (s1)`, `Can we take from s1?\ns1[${i-1}] is '${s1Char}'. Does it match target '${targetChar}'?\n\n${charMatch ? 'YES.' : 'NO.'}`, 20, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: true, checkLeft: false });
                
                if (charMatch) {
                    const aboveValid = dp[i - 1][j];
                    add(`Check Path Above`, `'${s1Char}' matches! Now check if path above dp[${i-1}][${j}] is true.\n\nAbove is ${aboveValid}.`, 21, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: true, checkLeft: false, topMatch: charMatch, aboveValid });
                    if (aboveValid) {
                        val = true;
                        topMatch = true;
                    }
                }
            }

            let leftMatch = false;
            if (j > 0) {
                const s2Char = s2[j - 1];
                const charMatch = s2Char === targetChar;
                add(`Check Left (s2)`, `Can we take from s2?\ns2[${j-1}] is '${s2Char}'. Does it match target '${targetChar}'?\n\n${charMatch ? 'YES.' : 'NO.'}`, 25, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: false, checkLeft: true, topResult: val });
                
                if (charMatch) {
                    const leftValid = dp[i][j - 1];
                    add(`Check Path Left`, `'${s2Char}' matches! Now check if path left dp[${i}][${j-1}] is true.\n\nLeft is ${leftValid}.`, 26, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: false, checkLeft: true, leftMatch: charMatch, leftValid, topResult: val });
                    if (leftValid) {
                        val = true;
                        leftMatch = true;
                    }
                }
            }

            dp[i][j] = val;
            add(`Result for (${i}, ${j})`, `dp[${i}][${j}] becomes ${val ? 'TRUE' : 'FALSE'}.\n\n${val ? 'Valid interleaving path found.' : 'No valid path reaches here.'}`, 28, { s1, s2, s3, dp, m, n, i, j, p, targetChar, checkTop: false, checkLeft: false, cellResult: val });
        }
    }

    const finalAns = dp[m][n];
    add('Complete', `Finished filling grid. The answer is dp[${m}][${n}] = ${finalAns}.`, 32, { s1, s2, s3, dp, m, n, i: m, j: n, p: s3.length - 1, isSuccess: finalAns, isComplete: true, finalAns });

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
  const s = cur.state || {};

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-teal-600 p-4 rounded-2xl shadow-lg shadow-teal-100 flex items-center justify-center">
                <Grid3X3 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Interleaving String</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 97</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / 2D Grid</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-teal-600 border-teal-600 text-white shadow-teal-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-teal-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-teal-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${s.isComplete ? (s.isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500') : (s.checkTop ? 'bg-purple-500/20 border-purple-500' : (s.checkLeft ? 'bg-amber-500/20 border-amber-500' : 'bg-teal-500/20 border-teal-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={s.isComplete ? (s.isSuccess ? 'emerald' : 'rose') : (s.checkTop ? 'purple' : (s.checkLeft ? 'amber' : 'teal'))} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-teal-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration Variables</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Row (i)" val={s.i !== null && s.i !== undefined ? s.i : "-"} color="purple" active={s.i !== null} />
                        <VariableCard label="Col (j)" val={s.j !== null && s.j !== undefined ? s.j : "-"} color="amber" active={s.j !== null} />
                        <VariableCard label="Target (p)" val={s.p !== null && s.p !== undefined ? s.p : "-"} color="sky" active={s.p !== null} />
                        <VariableCard label="s3[p]" val={s.targetChar ? `'${s.targetChar}'` : "-"} color="teal" active={s.targetChar !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-purple-600 uppercase block pl-1 tracking-widest font-mono">String 1</label>
                        <input type="text" value={s1Input} onChange={(e) => { setS1Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="flex-1 space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-amber-600 uppercase block pl-1 tracking-widest font-mono">String 2</label>
                        <input type="text" value={s2Input} onChange={(e) => { setS2Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="flex-[1.5] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-teal-600 uppercase block pl-1 tracking-widest font-mono">Target s3</label>
                        <input type="text" value={s3Input} onChange={(e) => { setS3Input(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-mono text-sm shadow-inner tracking-widest font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500" />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-16 px-4 py-2.5 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-28 px-4 py-2.5 bg-teal-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center gap-1">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[160px] relative overflow-hidden group shrink-0 ${s.isComplete ? (s.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : (s.checkTop ? 'bg-purple-900 border-purple-800' : (s.checkLeft ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {s.isComplete ? (s.isSuccess ? <Check size={100}/> : <XSquare size={100}/>) : (s.checkTop ? <ArrowDown size={100}/> : (s.checkLeft ? <ArrowRightIcon size={100}/> : <Grid3X3 size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={s.isComplete ? (s.isSuccess ? "text-emerald-400" : "text-rose-400") : (s.checkTop ? 'text-purple-400' : (s.checkLeft ? 'text-amber-400' : 'text-teal-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${s.isComplete ? (s.isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : (s.checkTop ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : (s.checkLeft ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner items-center justify-start pt-8 min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 gap-8 overflow-y-auto overflow-x-auto">
                      
                      {/* String References */}
                      {s.s3 && !s.isFail && (
                          <div className="flex flex-col gap-3 w-full max-w-xl mx-auto border-b border-slate-200 pb-6 mb-2">
                              {/* S3 Display */}
                              <div className="flex flex-col gap-1 items-center">
                                  <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest font-mono">Target String (s3)</span>
                                  <div className="flex gap-1">
                                      {s.s3.split('').map((char, index) => {
                                          let isTarget = s.p === index;
                                          let boxClass = "w-8 h-10 flex items-center justify-center font-mono font-bold text-lg rounded-md border-2 transition-all ";
                                          
                                          if (isTarget) {
                                              boxClass += "bg-teal-100 border-teal-500 text-teal-900 scale-110 shadow-md";
                                          } else if (s.p !== null && index < s.p) {
                                              boxClass += "bg-slate-100 border-slate-300 text-slate-400"; // Already processed
                                          } else {
                                              boxClass += "bg-white border-slate-200 text-slate-700";
                                          }

                                          return (
                                              <div key={`s3-${index}`} className="flex flex-col items-center">
                                                  <span className={`text-[8px] font-mono mb-1 ${isTarget ? 'text-teal-600 font-bold' : 'text-slate-400'}`}>{index}</span>
                                                  <div className={boxClass}>{char}</div>
                                              </div>
                                          );
                                      })}
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* DP Grid */}
                      {s.dp && !s.isFail && (
                          <div className="relative">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2 justify-center pb-2">
                                  <Grid3X3 size={14}/> DP Array (boolean)
                              </span>
                              
                              <table className="border-collapse mx-auto">
                                  <thead>
                                      <tr>
                                          {/* Empty top-left corners */}
                                          <th className="p-2"></th>
                                          <th className="p-2 text-slate-400 font-mono text-xs">""</th>
                                          {s.s2.split('').map((char, index) => (
                                              <th key={`s2-hdr-${index}`} className={`p-2 font-mono font-black text-lg transition-colors ${s.j === index + 1 ? 'text-amber-600 scale-110' : 'text-amber-500'}`}>
                                                  <div className="flex flex-col items-center">
                                                      <span className="text-[9px] text-amber-400/50 mb-1 leading-none">{index}</span>
                                                      {char}
                                                  </div>
                                              </th>
                                          ))}
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {s.dp.map((row, rIdx) => (
                                          <tr key={`row-${rIdx}`}>
                                              <th className={`px-4 py-2 font-mono font-black text-lg transition-colors ${s.i === rIdx && rIdx > 0 ? 'text-purple-600 scale-110' : 'text-purple-500'}`}>
                                                  {rIdx === 0 ? <span className="text-slate-400 text-xs text-center block">""</span> : (
                                                      <div className="flex items-center gap-2 justify-end">
                                                          <span className="text-[9px] text-purple-400/50">{rIdx - 1}</span>
                                                          {s.s1[rIdx - 1]}
                                                      </div>
                                                  )}
                                              </th>
                                              {row.map((val, cIdx) => {
                                                  // Determine cell styling
                                                  const isActive = s.i === rIdx && s.j === cIdx;
                                                  const isTopCheck = s.checkTop && s.i - 1 === rIdx && s.j === cIdx;
                                                  const isLeftCheck = s.checkLeft && s.i === rIdx && s.j - 1 === cIdx;
                                                  
                                                  let cellClass = "w-12 h-12 border-2 text-center font-mono font-bold text-sm transition-all duration-300 relative ";
                                                  
                                                  if (isActive) {
                                                      cellClass += "border-teal-500 ring-4 ring-teal-200 z-10 shadow-lg " + (val ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-400");
                                                  } else if (isTopCheck) {
                                                      cellClass += "border-purple-500 bg-purple-50 z-0 ";
                                                      if (val) cellClass += "text-purple-700 font-black"; else cellClass += "text-purple-300";
                                                  } else if (isLeftCheck) {
                                                      cellClass += "border-amber-500 bg-amber-50 z-0 ";
                                                      if (val) cellClass += "text-amber-700 font-black"; else cellClass += "text-amber-300";
                                                  } else {
                                                      cellClass += "border-slate-200 ";
                                                      if (val === true) {
                                                          cellClass += "bg-emerald-50 text-emerald-600";
                                                      } else if (val === false && (rIdx < s.i || (rIdx === s.i && cIdx < s.j))) {
                                                          cellClass += "bg-white text-slate-300 opacity-60"; // Processed but false
                                                      } else {
                                                          cellClass += "bg-white text-slate-200"; // Unprocessed or 0
                                                      }
                                                  }

                                                  return (
                                                      <td key={`cell-${rIdx}-${cIdx}`} className="p-0.5">
                                                          <div className={cellClass}>
                                                              <div className="absolute inset-0 flex items-center justify-center">
                                                                  {val === true ? 'T' : 'F'}
                                                              </div>
                                                              {isTopCheck && (
                                                                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-purple-500 animate-bounce">
                                                                      <ArrowDown size={14} strokeWidth={3}/>
                                                                  </div>
                                                              )}
                                                              {isLeftCheck && (
                                                                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-amber-500 animate-bounce">
                                                                      <ArrowRightIcon size={14} strokeWidth={3}/>
                                                                  </div>
                                                              )}
                                                          </div>
                                                      </td>
                                                  );
                                              })}
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {s.isComplete && !s.isFail && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${s.finalAns ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {s.finalAns ? <Check size={32} strokeWidth={3}/> : <XSquare size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">EVALUATION COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block ${s.finalAns ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {s.finalAns ? 'Valid Interleaving' : 'Invalid Interleaving'}
                              </span>
                          </div>
                      </div>
                    </div>
                  )}
                  {s.isFail && (
                      <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-rose-100 text-rose-600">
                              <XSquare size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">EARLY REJECTION</span>
                              <span className="text-sm font-black uppercase tracking-widest font-mono mb-4 block text-rose-600">
                                  Lengths do not match
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
                <Grid3X3 className="text-teal-600"/> 2D Dynamic Programming
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-teal-100 pl-6">
                We can solve this recursively by checking if the first character of <code>s3</code> matches <code>s1</code> or <code>s2</code>, and traversing down. However, that creates overlapping subproblems. A 2D DP array beautifully caches these overlapping states.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-purple-50 border border-purple-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-purple-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> State Definition
                        </h3>
                        <p className="text-sm text-purple-800 leading-relaxed mb-4">
                            <code>dp[i][j]</code> represents whether the <strong>first i characters</strong> of <code>s1</code> and the <strong>first j characters</strong> of <code>s2</code> can successfully form the <strong>first i+j characters</strong> of <code>s3</code>.
                        </p>
                        <div className="text-xs text-purple-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-purple-200 shadow-inner space-y-3">
                            <p><strong>Base Case:</strong> <code>dp[0][0] = true</code> (Empty strings make an empty string).</p>
                            <p>If we want to evaluate <code>dp[i][j]</code>, we look at the last character added to <code>s3</code>, which is at index <code>i+j-1</code>.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowDownRight size={18}/> Transitions
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            To reach cell <code>(i, j)</code>, we must have come from either directly above <code>(i-1, j)</code> or directly left <code>(i, j-1)</code>.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><strong>From Above (Taking from s1):</strong><br/> If <code>s1[i-1] == s3[i+j-1]</code> AND the path above <code>dp[i-1][j]</code> is valid.</p>
                            <p><strong>From Left (Taking from s2):</strong><br/> If <code>s2[j-1] == s3[i+j-1]</code> AND the path left <code>dp[i][j-1]</code> is valid.</p>
                            <p>If either path is true, <code>dp[i][j]</code> becomes true.</p>
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
                        "First, I check if `s1.length + s2.length == s3.length`. If not, I return false immediately. To avoid exponential time complexity from plain recursion, I use a 2D dynamic programming approach. I define a boolean `dp` matrix where `dp[i][j]` tells us if the prefix of `s3` of length `i+j` can be formed by prefixes of `s1` (length `i`) and `s2` (length `j`). At each step, I check if the current character of `s3` matches `s1`'s current character (relying on `dp[i-1][j]`) or `s2`'s current character (relying on `dp[i][j-1]`). The final answer resides in `dp[m][n]`."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-teal-500"/> Follow-Up: O(n) Space Optimization
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The prompt asks for an <code>O(s2.length)</code> space solution. Notice that calculating the current row <code>i</code> only requires the values from the <strong>previous row</strong> <code>i-1</code> and the <strong>current row's left cell</strong> <code>j-1</code>. 
                                <br/><br/>
                                Therefore, we don't need an entire 2D matrix. We can reduce space to a 1D array of size <code>n + 1</code>, updating it in place as we iterate through the rows. `dp[j]` from the previous loop iteration acts as `dp[i-1][j]` (above), and the newly updated `dp[j-1]` acts as the cell to the left.
                            </div>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <Timer size={14} className="text-teal-500"/> Time & Space Complexity
                        </h4>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Time Complexity</span>
                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">O(M * N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We populate a grid of size `M x N`. Finding the value for each cell takes O(1) time because we simply do two character comparisons and logical OR lookups.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">O(M * N) standard, O(N) optimized</span>
                                <p className="text-[10px] text-slate-500 mt-1">The 2D array requires `(M+1) * (N+1)` boolean slots. Using the 1D array space optimization trick, this drops to `O(N)` where N is the length of `s2`.</p>
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
        teal: 'bg-teal-50 border-teal-200 text-teal-700',
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 shrink-0'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'teal' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Math|Arrays|ArrayList|isInterleave|charAt|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Math', 'Arrays', 'ArrayList'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isInterleave', 'charAt', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s1', 's2', 's3', 'm', 'n', 'dp', 'i', 'j', 'p'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default InterleavingStringVisualizer;