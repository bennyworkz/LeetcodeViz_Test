import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  Regex, Grid3X3, TextCursor, HelpCircle, XCircle
} from 'lucide-react';

const APPROACHES = {
  bottomUpDP: {
    id: 'bottomUpDP',
    title: '1. Bottom-Up DP (Tabulation)',
    subtitle: 'Optimal: O(S×P) Time & Space.',
    icon: <Grid3X3 size={16} />,
    complexity: 'Time: O(S × P) | Space: O(S × P)',
    code: `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        
        // dp[i][j] means s[0..i-1] matches p[0..j-1]
        boolean[][] dp = new boolean[m + 1][n + 1];
        
        // Base case: empty string matches empty pattern
        dp[0][0] = true;
        
        // Initialize first row (empty string matching with pattern)
        // e.g., "" matches "a*b*c*"
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 2];
            }
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                char sc = s.charAt(i - 1);
                char pc = p.charAt(j - 1);
                
                if (pc == '.' || pc == sc) {
                    // Direct match or '.' wildcard
                    dp[i][j] = dp[i - 1][j - 1];
                } else if (pc == '*') {
                    char preceding = p.charAt(j - 2);
                    // Case 1: '*' represents zero occurrences of preceding char
                    dp[i][j] = dp[i][j - 2];
                    
                    // Case 2: '*' represents one or more occurrences
                    if (preceding == '.' || preceding == sc) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else {
                    // Characters don't match
                    dp[i][j] = false;
                }
            }
        }
        
        return dp[m][n];
    }
}`,
    explanation: "We use a 2D array where dp[i][j] represents whether the first 'i' characters of string 's' match the first 'j' characters of pattern 'p'. We build the solution from the bottom up. For normal characters and '.', we look diagonally back to dp[i-1][j-1]. The magic happens with '*'. When we see a '*', we can either choose to match ZERO of the preceding character (looking left 2 columns at dp[i][j-2]), or if the preceding character actually matches our current character in 's', we can match ONE OR MORE of it (looking up 1 row at dp[i-1][j])."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">10. Regular Expression Matching</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an input string <code>s</code> and a pattern <code>p</code>, implement regular expression matching with support for <code>'.'</code> and <code>'*'</code> where:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><code>'.'</code> Matches any single character.</li>
            <li><code>'*'</code> Matches zero or more of the preceding element.</li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          The matching should cover the <strong>entire</strong> input string (not partial).
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "aa", p = "a"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <p className="text-slate-500 italic mt-2 text-xs">// Explanation: "a" does not match the entire string "aa".</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "aa", p = "a*"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="text-slate-500 italic mt-2 text-xs">// Explanation: '*' means zero or more of the preceding element, 'a'. Therefore, by repeating 'a' once, it becomes "aa".</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "ab", p = ".*"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <p className="text-slate-500 italic mt-2 text-xs">// Explanation: ".*" means "zero or more (*) of any character (.)".</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 20</code></li>
              <li><code>1 &lt;= p.length &lt;= 20</code></li>
              <li><code>s</code> contains only lowercase English letters.</li>
              <li><code>p</code> contains only lowercase English letters, <code>'.'</code>, and <code>'*'</code>.</li>
              <li>It is guaranteed for each appearance of the character <code>'*'</code>, there will be a previous valid character to match.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const RegexVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('bottomUpDP');
  const [sInput, setSInput] = useState('aab');
  const [pInput, setPInput] = useState('c*a*b');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim().toLowerCase().replace(/[^a-z]/g, '');
    let p = pInput.trim().toLowerCase().replace(/[^a-z.*]/g, '');
    
    if (!s) s = "aab";
    if (!p) p = "c*a*b";
    
    // UI Safeguard
    if (s.length > 8) s = s.slice(0, 8);
    if (p.length > 8) p = p.slice(0, 8);

    return { s, p };
  }, [sInput, pInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s, p } = parsedData;
    const m = s.length;
    const n = p.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    const cloneDP = (grid) => grid.map(row => [...row]);

    if (selectedApproachId === 'bottomUpDP') {
        let dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(false));
        
        addStep(
            "1. Initialize DP Table", 
            `Create a boolean DP table of size (${m} + 1) × (${n} + 1).\n\n• dp[i][j] asks: Does the prefix of 's' up to length 'i' match the prefix of 'p' up to length 'j'?\n• We use +1 bounds to explicitly represent the "Empty String" (length 0).`, 
            6, 
            { dp: cloneDP(dp), i: null, j: null, action: 'init' }
        );
        
        dp[0][0] = true;
        addStep(
            "2. Base Case: Empty Strings", 
            `Line 9: dp[0][0] = true;\n\nAn empty string "" perfectly matches an empty pattern "". This is our anchor for all future subproblems.`, 
            9, 
            { dp: cloneDP(dp), i: 0, j: 0, action: 'base', deps: [] }
        );
        
        // Initialize first row
        for (let j = 1; j <= n; j++) {
            let pc = p.charAt(j - 1);
            if (pc === '*') {
                dp[0][j] = dp[0][j - 2];
                addStep(
                    "3. Initializing First Row (Empty String vs Pattern)", 
                    `Line 14: Pattern char p[${j-1}] is '*'.\n\nCan pattern prefix length ${j} match an empty string?\nYes! A '*' means we can choose ZERO occurrences of the preceding character.\nBy dropping both the '*' and its preceding char, we inherit the result from 2 columns left.\n\ndp[0][${j}] = dp[0][${j-2}] = ${dp[0][j-2]}`, 
                    14, 
                    { dp: cloneDP(dp), i: 0, j, action: 'firstRowStar', deps: [[0, j-2]] }
                );
            } else {
                addStep(
                    "3. Initializing First Row (Empty String vs Pattern)", 
                    `Line 13: Pattern char p[${j-1}] is '${pc}'.\n\nA normal character (or '.') cannot possibly match an empty string unless a '*' cancels it out later.\n\ndp[0][${j}] remains FALSE.`, 
                    13, 
                    { dp: cloneDP(dp), i: 0, j, action: 'firstRowNormal', deps: [] }
                );
            }
        }
        
        // Fill DP Table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                let sc = s.charAt(i - 1);
                let pc = p.charAt(j - 1);
                
                addStep(
                    "4. Evaluate Next Subproblem", 
                    `Goal: Does string prefix length ${i} match pattern prefix length ${j}?\n\nWe must compare the current end characters:\n• s[${i-1}] is '${sc}'\n• p[${j-1}] is '${pc}'`, 
                    20, 
                    { dp: cloneDP(dp), i, j, sc, pc, action: 'evaluating', deps: [] }
                );
                
                if (pc === '.' || pc === sc) {
                    dp[i][j] = dp[i - 1][j - 1];
                    let reason = pc === '.' 
                        ? `The pattern character is '.', which automatically matches any single string character ('${sc}').` 
                        : `The characters explicitly match ('${sc}' == '${pc}').`;
                        
                    addStep(
                        "5a. Exact Match or Wildcard '.'", 
                        `Line 24: ${reason}\n\nSince the current characters resolve, the overall match depends strictly on whether the prefixes BEFORE these characters matched.\nWe inherit the result from the diagonal (i-1, j-1).\n\ndp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i-1][j-1]}.`, 
                        24, 
                        { dp: cloneDP(dp), i, j, sc, pc, action: 'matchDirect', deps: [[i-1, j-1]] }
                    );
                } else if (pc === '*') {
                    let preceding = p.charAt(j - 2);
                    
                    // Case 1: Zero occurrences
                    dp[i][j] = dp[i][j - 2];
                    addStep(
                        "5b. Star Action - Option 1: Zero Matches", 
                        `Line 28: Pattern is '*'. Preceding char is '${preceding}'.\n\nOption 1: We assume the '*' dictates ZERO occurrences of '${preceding}'. We completely drop both '${preceding}' and '*' from the pattern.\nWe inherit the result from 2 columns left (j-2).\n\ndp[${i}][${j}] (currently) = dp[${i}][${j-2}] = ${dp[i][j-2]}.`, 
                        28, 
                        { dp: cloneDP(dp), i, j, sc, pc, action: 'matchStarZero', deps: [[i, j-2]], preceding }
                    );
                    
                    // Case 2: One or more occurrences
                    if (preceding === '.' || preceding === sc) {
                        let prevVal = dp[i][j];
                        let upVal = dp[i - 1][j];
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                        
                        addStep(
                            "5c. Star Action - Option 2: Multiple Matches", 
                            `Line 31: Preceding char '${preceding}' matches string char '${sc}'!\n\nOption 2: Since they match, we can "consume" the string char, but keep the '*' active in the pattern to potentially match even more copies.\nWe inherit the result from 1 row UP (i-1).\n\nIs Option 1 OR Option 2 true?\ndp[${i}][${j}] = (${prevVal}) || dp[${i-1}][${j}] (${upVal}) = ${dp[i][j]}.`, 
                            32, 
                            { dp: cloneDP(dp), i, j, sc, pc, action: 'matchStarMulti', deps: [[i-1, j], [i, j-2]], preceding }
                        );
                    } else {
                        addStep(
                            "5c. Star Action - Option 2 Invalid", 
                            `Line 31: Preceding char '${preceding}' DOES NOT match string char '${sc}'.\n\nBecause they don't match, we cannot use the '*' to replicate '${preceding}'. Option 2 is impossible.\nWe are strictly forced to keep the result from Option 1 (Zero matches).\n\ndp[${i}][${j}] remains ${dp[i][j]}.`, 
                            31, 
                            { dp: cloneDP(dp), i, j, sc, pc, action: 'matchStarFail', deps: [[i, j-2]], preceding }
                        );
                    }
                } else {
                    dp[i][j] = false;
                    addStep(
                        "5d. Hard Mismatch", 
                        `Line 36: Characters do not match ('${sc}' != '${pc}'), and there is no wildcard to bypass it.\n\nThis path is a dead end.\ndp[${i}][${j}] = false.`, 
                        36, 
                        { dp: cloneDP(dp), i, j, sc, pc, action: 'mismatch', deps: [] }
                    );
                }
            }
        }
        
        addStep(
            "6. Evaluation Complete", 
            `Line 41: The entire DP table is filled.\n\nThe ultimate answer is located at the bottom-right cell, which represents the full string against the full pattern.\nReturn dp[${m}][${n}] = ${dp[m][n]}.`, 
            41, 
            { dp: cloneDP(dp), i: m, j: n, action: 'success', isSuccess: true, ans: dp[m][n] }
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
  const { isSuccess, ans, dp, i: currI, j: currJ, sc, pc, action, deps, preceding } = state;
  const { s, p } = parsedData;

  // Render Grid helper
  const sArr = ["", ...s.split('')];
  const pArr = ["", ...p.split('')];

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Regex className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Regex Matching</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 10</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Dynamic Programming / Strings</span>
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
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="s[i-1]" val={sc ?? null} color="sky" active={sc !== null && sc !== undefined} />
                        <VariableCard label="p[j-1]" val={pc ?? null} color="purple" active={pc !== null && pc !== undefined} />
                        <VariableCard label="Row (i)" val={currI ?? null} color="indigo" active={currI !== null && currI !== undefined} />
                        <VariableCard label="Col (j)" val={currJ ?? null} color="violet" active={currJ !== null && currJ !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="aab" />
                    </div>
                    
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Pattern (p)</label>
                        <input type="text" value={pInput} onChange={(e) => { setPInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="c*a*b" />
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
                      {isSuccess ? (ans ? <Check size={100}/> : <XCircle size={100}/>) : <TextCursor size={100}/>}
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 pt-4">
                      
                      {/* Grid Representation */}
                      {dp && (
                          <div className="overflow-x-auto w-full flex flex-col items-center pb-6">
                              <div 
                                className="grid gap-1 md:gap-1.5 p-3 bg-slate-100 border border-slate-200 rounded-3xl shadow-inner mx-auto relative w-max"
                                style={{ 
                                    gridTemplateColumns: `auto repeat(${pArr.length}, minmax(0, 1fr))`,
                                    gridTemplateRows: `auto repeat(${sArr.length}, minmax(0, 1fr))`,
                                }}
                              >
                                  {/* Top Header (Pattern) */}
                                  <div className="w-8 h-8 sm:w-10 sm:h-10"></div> {/* Empty corner */}
                                  {pArr.map((char, j) => (
                                      <div key={`header-p-${j}`} className="flex flex-col items-center justify-end pb-1 font-mono font-black text-slate-500 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                                          <span className="text-[10px] text-slate-400 font-normal">{j}</span>
                                          <span className="text-lg md:text-xl text-purple-600">{char === "" ? "∅" : char}</span>
                                      </div>
                                  ))}

                                  {/* Rows */}
                                  {sArr.map((sChar, i) => (
                                      <React.Fragment key={`row-${i}`}>
                                          {/* Left Header (String) */}
                                          <div className="flex flex-row items-center justify-end pr-2 font-mono font-black text-slate-500 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                                              <span className="text-lg md:text-xl text-sky-600 mr-2">{sChar === "" ? "∅" : sChar}</span>
                                              <span className="text-[10px] text-slate-400 font-normal">{i}</span>
                                          </div>

                                          {/* Cells */}
                                          {pArr.map((_, j) => {
                                              let val = dp[i][j];
                                              
                                              let isCurrent = currI === i && currJ === j;
                                              let isDep = deps && deps.some(d => d[0] === i && d[1] === j);
                                              let isEvaluated = val !== null;

                                              let bgClass = "bg-white";
                                              let borderClass = "border-slate-300";
                                              let textClass = "text-transparent";
                                              let extra = "shadow-sm";
                                              let content = "";

                                              if (isEvaluated) {
                                                  content = val ? "T" : "F";
                                                  textClass = val ? "text-emerald-600" : "text-slate-400";
                                                  bgClass = val ? "bg-emerald-50" : "bg-white";
                                                  borderClass = val ? "border-emerald-300" : "border-slate-200";
                                              }

                                              if (isCurrent && !isSuccess) {
                                                  bgClass = "bg-violet-100";
                                                  borderClass = "border-violet-500";
                                                  textClass = val === null ? "text-transparent" : (val ? "text-violet-700 font-bold" : "text-violet-400");
                                                  extra = "scale-110 z-20 shadow-lg ring-4 ring-violet-500/20";
                                              } else if (isDep) {
                                                  bgClass = "bg-amber-100";
                                                  borderClass = "border-amber-400 border-dashed";
                                                  textClass = val ? "text-amber-700 font-bold" : "text-amber-500";
                                                  extra = "scale-105 z-10 shadow-md";
                                              } else if (isSuccess && isCurrent) {
                                                  // Highlight final answer
                                                  bgClass = val ? "bg-emerald-100" : "bg-rose-100";
                                                  borderClass = val ? "border-emerald-500" : "border-rose-500";
                                                  textClass = val ? "text-emerald-800" : "text-rose-800";
                                                  extra = "scale-125 z-30 shadow-2xl ring-4 " + (val ? "ring-emerald-500/30" : "ring-rose-500/30");
                                              } else if (!isEvaluated && !isCurrent) {
                                                  bgClass = "bg-slate-50 opacity-50";
                                                  borderClass = "border-slate-200 border-dashed";
                                              }

                                              return (
                                                  <div key={`cell-${i}-${j}`} className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border-2 font-mono font-black text-sm sm:text-base transition-all duration-300 ${bgClass} ${borderClass} ${textClass} ${extra}`}>
                                                      {content}
                                                  </div>
                                              )
                                          })}
                                      </React.Fragment>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* State Analysis Explanation overlay below matrix */}
                      {!isSuccess && action && action !== 'init' && action !== 'success' && (
                          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm animate-in slide-in-from-bottom-2 flex items-center gap-6 mt-2 max-w-2xl w-full">
                              <div className="flex flex-col gap-2 shrink-0">
                                  <div className="flex items-center gap-3 font-mono font-bold text-sm">
                                      <span className="text-slate-500 w-16">Char <span className="text-sky-600">s[{currI-1}]</span>:</span> 
                                      <span className="bg-white border px-2 py-0.5 rounded shadow-sm text-sky-700">{sc || '∅'}</span>
                                  </div>
                                  <div className="flex items-center gap-3 font-mono font-bold text-sm">
                                      <span className="text-slate-500 w-16">Patt <span className="text-purple-600">p[{currJ-1}]</span>:</span> 
                                      <span className="bg-white border px-2 py-0.5 rounded shadow-sm text-purple-700">{pc || '∅'}</span>
                                  </div>
                              </div>
                              <div className="h-12 w-px bg-slate-300"></div>
                              <div className="flex-1 text-sm font-sans text-slate-700 leading-relaxed font-semibold">
                                  {action === 'firstRowStar' && "Handling empty string. '*' allows us to drop the preceding char. Copy value from dp[0][j-2]."}
                                  {action === 'firstRowNormal' && "Normal character cannot possibly match an empty string. False."}
                                  {action === 'matchDirect' && "Chars match! Overall result depends entirely on previous prefixes. Inherit diagonal dp[i-1][j-1]."}
                                  {action === 'matchStarZero' && "Option 1 (Zero Uses): Ignore '*' and preceding char entirely. Look left 2 columns to dp[i][j-2]."}
                                  {action === 'matchStarMulti' && "Option 2 (Multi Uses): Preceding char matches string! Consume string char, keep '*' active. Look up 1 row to dp[i-1][j]."}
                                  {action === 'matchStarFail' && "'*' preceding char mismatch. Option 2 invalid. Forced to use Option 1 (Zero uses)."}
                                  {action === 'mismatch' && "Hard mismatch. Characters differ, no wildcard to save it. False."}
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans ? <Check size={32} strokeWidth={3}/> : <XCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MATCH COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${ans ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {ans ? `String matches the pattern!` : `String does not match pattern.`}
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
                <Regex className="text-violet-600"/> Demystifying Regex DP
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                String matching problems are best solved by breaking them down into smaller string matching problems. If we know whether prefixes of <code>s</code> match prefixes of <code>p</code>, we can build the answer for the full strings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ListOrdered size={18}/> Normal Characters & '.'
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            If the current pattern character is a regular letter or a <code>'.'</code>, the transition is simple:
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            If <code>p[j-1] == s[i-1]</code> OR <code>p[j-1] == '.'</code>:<br/><br/>
                            We know these specific characters match. So the overall match depends entirely on whether the remaining substrings matched.<br/><br/>
                            We look diagonally: <code>dp[i][j] = dp[i-1][j-1]</code>
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> The Dreaded '*' Character
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The <code>'*'</code> is difficult because it acts on the <em>preceding</em> character. It creates two distinct possibilities:
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-3">
                            <p><strong>Option 1: Match Zero</strong><br/>We ignore the <code>*</code> and its preceding character entirely. We look left 2 columns:<br/><code>dp[i][j] = dp[i][j-2]</code></p>
                            <p><strong>Option 2: Match One or More</strong><br/>If the preceding character actually matches <code>s[i-1]</code>, we can "consume" the character in <code>s</code> and keep the <code>*</code> active in <code>p</code> to match more! We look UP 1 row:<br/><code>dp[i][j] = dp[i-1][j]</code></p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Grid3X3 size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Why DP Table Dimensions are +1</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           Why do we create <code>dp[m+1][n+1]</code> instead of <code>dp[m][n]</code>?
                        </p>
                        <p>
                           We need to represent the concept of an <strong>Empty String (∅)</strong>. If <code>s = "a"</code> and <code>p = "c*a"</code>, the <code>"c*"</code> matches the empty string part of <code>s</code>.
                        </p>
                        <p>
                           By shifting everything by 1, index 0 represents ∅. This allows us to cleanly set <code>dp[0][0] = true</code> (∅ matches ∅) and handle cases where a pattern starts with a zero-match sequence (like <code>a*b*</code>).
                        </p>
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
                        "I used Bottom-Up Dynamic Programming (Tabulation) to solve this. I created a 2D boolean array where `dp[i][j]` tracks if the prefix of `s` of length `i` matches the prefix of `p` of length `j`. The base cases handle empty string matching. For the transitions, if the characters match or the pattern has a `.` wildcard, I pull the diagonal value `dp[i-1][j-1]`. If the pattern has a `*`, I have two choices: either treat it as zero matches and pull `dp[i][j-2]`, or, if the preceding character is a match, treat it as multiple matches by pulling `dp[i-1][j]`. This evaluates all possibilities systematically in $O(S \times P)$ time."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Top-Down vs Bottom-Up?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                A Top-Down Recursive approach with Memoization is also highly acceptable and often easier to write in an interview setting. It uses the exact same logic but recursively checks <code>isMatch(i, j)</code>. Bottom-up (Tabulation) avoids recursive call stack overhead, which makes it slightly faster in practice and avoids StackOverflow errors on extremely large strings, though LC limits are small here (N=20).
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(S × P)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We evaluate every state exactly once. There are $S$ rows and $P$ columns in our DP matrix. The work inside each cell calculation is $O(1)$ operations.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(S × P)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We explicitly allocate a 2D boolean array of dimensions $(S+1) \times (P+1)$ to store the subproblem results. (Note: Space can be optimized to $O(P)$ by only keeping the previous row).</p>
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
        indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        slate: 'bg-slate-100 border-slate-300 text-slate-700',
        violet: 'bg-violet-50 border-violet-200 text-violet-700'
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

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|dp|s|p|sc|pc|preceding)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for', 'continue', 'break'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['dp'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['s', 'sc'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['p', 'pc', 'preceding'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default RegexVisualizer;