import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, GitBranch, ShieldAlert,
  ArrowRight, CornerUpLeft, PlusSquare, XSquare, Grid2X2, 
  Asterisk, HelpCircle, FastForward
} from 'lucide-react';

const APPROACHES = {
  greedy: {
    id: 'greedy',
    title: '1. Two Pointers (Greedy)',
    subtitle: 'Optimal: O(S+P) Avg Time, O(1) Space.',
    icon: <FastForward size={16} />,
    complexity: 'Time: O(S+P) Avg | Space: O(1)',
    code: `class Solution {
    public boolean isMatch(String s, String p) {
        int sLen = s.length(), pLen = p.length();
        int i = 0, j = 0;
        int starIdx = -1, match = 0;
        
        while (i < sLen) {
            // 1. Exact match or '?' match
            if (j < pLen && (p.charAt(j) == '?' || p.charAt(j) == s.charAt(i))) {
                i++;
                j++;
            } 
            // 2. Found a '*', record its position and the current string position
            else if (j < pLen && p.charAt(j) == '*') {
                starIdx = j;
                match = i;
                j++; // Try to match '*' with an empty string first
            } 
            // 3. Mismatch occurred, but we have a '*' to fall back on!
            else if (starIdx != -1) {
                j = starIdx + 1; // Reset pattern pointer to right after '*'
                match++;         // '*' absorbs one more character from s
                i = match;       // Reset string pointer
            } 
            // 4. Mismatch and no '*' to save us
            else {
                return false;
            }
        }
        
        // Consume any remaining '*' at the end of the pattern
        while (j < pLen && p.charAt(j) == '*') {
            j++;
        }
        
        // True if we exhausted the pattern
        return j == pLen;
    }
}`,
    explanation: "This is a brilliant greedy approach. We use two pointers, `i` for the string and `j` for the pattern. We try to match character by character. If we see a `*`, we record its position (`starIdx`) and the current position in the string (`match`), and then tentatively assume the `*` matches ZERO characters (`j++`). If we later hit a mismatch, we don't fail immediately! We check if we've seen a `*` before. If yes, we backtrack: we reset `j` to the character immediately after the `*`, and we increment `match` to make the `*` absorb one more character from `s`, then reset `i`. This greedy fallback continues until we either match the string or run out of options."
  },
  dp: {
    id: 'dp',
    title: '2. 2D Dynamic Programming',
    subtitle: 'Classic: O(S×P) Time, O(S×P) Space.',
    icon: <Grid2X2 size={16} />,
    complexity: 'Time: O(S × P) | Space: O(S × P)',
    code: `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length();
        int n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        
        // Empty pattern matches empty string
        dp[0][0] = true;
        
        // Empty string matches patterns that are only '*'
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }
        
        // Fill the DP table
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j - 1) == '?' || s.charAt(i - 1) == p.charAt(j - 1)) {
                    // Match single char: inherit diagonal
                    dp[i][j] = dp[i - 1][j - 1];
                } else if (p.charAt(j - 1) == '*') {
                    // Match '*': either acts as empty (top) or absorbs a char (left)
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                }
            }
        }
        
        return dp[m][n];
    }
}`,
    explanation: "This is the classic bottom-up DP approach. We build a matrix `dp[m+1][n+1]` where `dp[i][j]` is true if the first `i` characters of `s` match the first `j` characters of `p`. First, an empty string and empty pattern match (`dp[0][0] = true`). Then we initialize the first row (empty string matching with pattern): it's only true if the pattern consists exclusively of `*`. For the rest of the table, if the pattern character is `?` or a direct match, we inherit from the diagonal (`dp[i-1][j-1]`). If the pattern character is `*`, it can either match an empty sequence (inherit from `dp[i][j-1]`) or absorb a character (inherit from `dp[i-1][j]`)."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">44. Wildcard Matching</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given an input string (<code>s</code>) and a pattern (<code>p</code>), implement wildcard pattern matching with support for <code>'?'</code> and <code>'*'</code> where:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium bg-slate-50 p-4 rounded-xl border border-slate-200 w-max">
            <li><code>'?'</code> Matches any single character.</li>
            <li><code>'*'</code> Matches any sequence of characters (including the empty sequence).</li>
        </ul>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-emerald-500 pl-4 bg-emerald-50 py-2 mt-4">
          The matching should cover the <strong>entire</strong> input string (not partial).
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "aa", p = "a"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "a" does not match the entire string "aa".</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "aa", p = "*"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> true</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: '*' matches any sequence.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "cb", p = "?a"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> false</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= s.length, p.length &lt;= 2000</code></li>
              <li><code>s</code> contains only lowercase English letters.</li>
              <li><code>p</code> contains only lowercase English letters, <code>'?'</code> or <code>'*'</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const WildcardVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('greedy');
  
  const [sInput, setSInput] = useState('adceb');
  const [pInput, setPInput] = useState('*a*b');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim().toLowerCase().replace(/[^a-z]/g, '');
    let p = pInput.trim().toLowerCase().replace(/[^a-z\?\*]/g, '');
    
    // UI Safety cap to prevent browser crashing in massive DP tables
    if (s.length > 12) s = s.substring(0, 12);
    if (p.length > 12) p = p.substring(0, 12);

    return { s, p };
  }, [sInput, pInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s, p } = parsedData;
    const sLen = s.length;
    const pLen = p.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2500) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'greedy') {
        let i = 0;
        let j = 0;
        let starIdx = -1;
        let match = 0;

        addStep(
            "Initialization", 
            `Line 3-4: Initialize pointers.\ni (string) = 0, j (pattern) = 0.\nstarIdx = -1, match = 0.`, 
            4, 
            { s, p, i, j, starIdx, match, action: 'init' }
        );

        let iter = 0;
        while (i < sLen) {
            if (iter++ > 1000) break; // Infinite loop safety
            
            addStep(
                "Evaluate Loop", 
                `Line 6: while (i < sLen)\n\nWe are looking at s[${i}] = '${s[i]}' and p[${j}] = '${j < pLen ? p[j] : 'out of bounds'}'.`, 
                6, 
                { s, p, i, j, starIdx, match, action: 'loop' }
            );

            if (j < pLen && (p[j] === '?' || p[j] === s[i])) {
                addStep(
                    "Exact or '?' Match", 
                    `Line 8: if (j < pLen && (p[j] == '?' || p[j] == s[i]))\n\n'${p[j]}' matches '${s[i]}'! We advance both pointers.`, 
                    8, 
                    { s, p, i, j, starIdx, match, action: 'matchChar' }
                );
                i++;
                j++;
            } 
            else if (j < pLen && p[j] === '*') {
                starIdx = j;
                match = i;
                
                addStep(
                    "Found Asterisk (*)", 
                    `Line 13: else if (j < pLen && p[j] == '*')\n\nWe hit a '*'. We record its position (starIdx = ${j}) and our current string position (match = ${i}). We tentatively assume the '*' matches 0 characters by advancing j.`, 
                    14, 
                    { s, p, i, j, starIdx, match, action: 'foundStar' }
                );
                j++;
            } 
            else if (starIdx !== -1) {
                j = starIdx + 1;
                match++;
                
                addStep(
                    "Mismatch! Backtrack to Asterisk", 
                    `Line 19: else if (starIdx != -1)\n\nMismatch occurred between '${s[i]}' and '${j < pLen ? p[j] : 'out of bounds'}'. BUT we have a previous '*' at index ${starIdx} to fall back on!\nResetting j to right after the '*' (j = ${starIdx + 1}). '*' absorbs one more char, so match becomes ${match}. We reset i to match.`, 
                    20, 
                    { s, p, i, j, starIdx, match, action: 'backtrackStar' }
                );
                i = match;
            } 
            else {
                addStep(
                    "Fatal Mismatch", 
                    `Line 25: else { return false; }\n\nMismatch between '${s[i]}' and '${j < pLen ? p[j] : 'out of bounds'}', and we have NO previous '*' to save us. The pattern fails.`, 
                    26, 
                    { s, p, i, j, starIdx, match, action: 'fatal', isSuccess: true, ans: false }
                );
                return steps;
            }
        }

        addStep(
            "String Exhausted", 
            `Line 30: while (j < pLen && p.charAt(j) == '*')\n\nThe string is fully matched. We must now consume any remaining trailing '*' characters in the pattern, since they can safely match an empty string.`, 
            30, 
            { s, p, i, j, starIdx, match, action: 'checkRemaining' }
        );

        while (j < pLen && p[j] === '*') {
            addStep(
                "Consume Trailing Asterisk", 
                `Line 31: j++;\n\nConsuming '*' at pattern index ${j}.`, 
                31, 
                { s, p, i, j, starIdx, match, action: 'consumeTrailing' }
            );
            j++;
        }

        let isMatch = j === pLen;
        addStep(
            "Return Result", 
            `Line 35: return j == pLen;\n\nDid we successfully exhaust the entire pattern? j (${j}) == pLen (${pLen}) is ${isMatch}.`, 
            35, 
            { s, p, i, j, starIdx, match, action: 'success', isSuccess: true, ans: isMatch }
        );

    } else if (selectedApproachId === 'dp') {
        
        let dp = Array.from({length: sLen + 1}, () => Array(pLen + 1).fill(false));
        
        addStep(
            "Initialize DP Table", 
            `Line 5: boolean[][] dp = new boolean[m + 1][n + 1];\n\nCreate a DP matrix. dp[i][j] represents if s[0...i-1] matches p[0...j-1].`, 
            5, 
            { s, p, dp: dp.map(r => [...r]), i: null, j: null, action: 'init' }
        );

        dp[0][0] = true;
        addStep(
            "Base Case: Empty String & Pattern", 
            `Line 8: dp[0][0] = true;\n\nAn empty string always matches an empty pattern.`, 
            8, 
            { s, p, dp: dp.map(r => [...r]), i: 0, j: 0, action: 'baseCase0' }
        );

        for (let j = 1; j <= pLen; j++) {
            if (p[j - 1] === '*') {
                dp[0][j] = dp[0][j - 1];
            }
        }
        
        addStep(
            "Base Case: Empty String vs Pattern", 
            `Line 11-15: Initialize first row.\n\nAn empty string only matches a pattern if the pattern is entirely composed of '*' up to that point.`, 
            12, 
            { s, p, dp: dp.map(r => [...r]), i: 0, j: null, action: 'baseCaseFirstRow' }
        );

        for (let i = 1; i <= sLen; i++) {
            for (let j = 1; j <= pLen; j++) {
                
                addStep(
                    "Evaluate DP Cell", 
                    `Line 18: Evaluating dp[${i}][${j}] (s_char: '${s[i-1]}', p_char: '${p[j-1]}')`, 
                    18, 
                    { s, p, dp: dp.map(r => [...r]), i, j, action: 'evalCell' }
                );

                if (p[j - 1] === '?' || s[i - 1] === p[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                    addStep(
                        "Match Character or '?'", 
                        `Line 19: if (p.charAt(j-1) == '?' || s == p)\n\nCharacters match! We inherit the boolean value from the diagonal dp[${i-1}][${j-1}] (${dp[i-1][j-1]}).`, 
                        21, 
                        { s, p, dp: dp.map(r => [...r]), i, j, action: 'matchDiagonal' }
                    );
                } else if (p[j - 1] === '*') {
                    dp[i][j] = dp[i - 1][j] || dp[i][j - 1];
                    addStep(
                        "Asterisk Found", 
                        `Line 22: else if (p.charAt(j-1) == '*')\n\nThe '*' can act as empty (inherit from Left: dp[${i}][${j-1}] = ${dp[i][j-1]}) OR absorb the current string character (inherit from Top: dp[${i-1}][${j}] = ${dp[i-1][j]}). Result is ${dp[i][j]}.`, 
                        24, 
                        { s, p, dp: dp.map(r => [...r]), i, j, action: 'matchStar' }
                    );
                } else {
                    dp[i][j] = false;
                    addStep(
                        "Mismatch", 
                        `Line 18: No condition met. Characters don't match and pattern isn't a wildcard.\ndp[${i}][${j}] = false.`, 
                        18, 
                        { s, p, dp: dp.map(r => [...r]), i, j, action: 'mismatch' }
                    );
                }
            }
        }

        addStep(
            "Return Result", 
            `Line 30: return dp[m][n];\n\nDP table complete. The final answer is located at the bottom right.`, 
            30, 
            { s, p, dp: dp.map(r => [...r]), i: sLen, j: pLen, action: 'success', isSuccess: true, ans: dp[sLen][pLen] }
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
  const { isSuccess, ans, action, s, p, i: currI, j: currJ, starIdx, match, dp } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Asterisk className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Wildcard Matching</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 44</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Two Pointers / DP</span>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? (ans ? 'bg-emerald-500/20 border-emerald-500' : 'bg-rose-500/20 border-rose-500') : (action === 'fatal' || action === 'mismatch' ? 'bg-rose-500/20 border-rose-500' : (action === 'backtrackStar' ? 'bg-amber-500/20 border-amber-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'fatal' || action === 'mismatch' ? 'rose' : (action === 'backtrackStar' ? 'amber' : 'violet')} />
                        </React.Fragment>
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
                    
                    {selectedApproachId === 'greedy' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="String (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Pattern (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                            <VariableCard label="starIdx" val={starIdx !== undefined && starIdx !== -1 ? starIdx : "-"} color="amber" active={starIdx !== undefined && starIdx !== -1} />
                            <VariableCard label="match" val={match !== undefined && starIdx !== -1 ? match : "-"} color="emerald" active={match !== undefined && starIdx !== -1} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Row (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="Col (j)" val={currJ !== null && currJ !== undefined ? currJ : "-"} color="purple" active={currJ !== null && currJ !== undefined} />
                            <VariableCard label="DP[i][j]" val={dp && currI !== null && currJ !== null ? (dp[currI][currJ] ? 'T' : 'F') : "-"} color={dp && currI !== null && currJ !== null && dp[currI][currJ] ? "emerald" : "slate"} active={dp !== undefined && currI !== null && currJ !== null} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="adceb" />
                    </div>
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Pattern (p)</label>
                        <input type="text" value={pInput} onChange={(e) => { setPInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="*a*b" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-violet-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-violet-100 hover:bg-violet-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? (ans ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : (action === 'fatal' || action === 'mismatch' ? 'bg-rose-900 border-rose-800' : (action === 'backtrackStar' ? 'bg-amber-900 border-amber-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? (ans ? <Check size={100}/> : <XSquare size={100}/>) : (action === 'fatal' || action === 'mismatch' ? <XSquare size={100}/> : (action === 'backtrackStar' ? <CornerUpLeft size={100}/> : (action === 'foundStar' || action === 'matchStar' ? <Asterisk size={100}/> : <Activity size={100}/>)))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? (ans ? "text-emerald-400" : "text-rose-400") : (action === 'fatal' || action === 'mismatch' ? 'text-rose-400' : (action === 'backtrackStar' ? 'text-amber-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? (ans ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30') : (action === 'fatal' || action === 'mismatch' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action === 'backtrackStar' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-start justify-start pt-16">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-12 gap-10 overflow-y-auto overflow-x-auto">
                      
                      {/* GREEDY APPROACH UI */}
                      {selectedApproachId === 'greedy' && s !== undefined && p !== undefined && (
                          <div className="flex flex-col gap-12 w-full max-w-lg mt-6">
                              
                              {/* String S Array */}
                              <div className="flex items-center gap-2 relative p-4 bg-slate-50 border-b border-slate-200 rounded-t-3xl min-w-max mx-auto px-10">
                                  <span className="absolute left-2 -top-6 text-[10px] font-black uppercase text-sky-600 tracking-widest font-mono">String s</span>
                                  {s.split('').map((char, idx) => {
                                      let isCurrentI = currI === idx;
                                      let isMatchAnchor = match === idx && starIdx !== -1 && !isSuccess;

                                      let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border-2 font-mono font-black text-lg transition-all duration-300 shrink-0 ";
                                      
                                      if (isCurrentI && !isSuccess) {
                                          boxClass += "bg-sky-100 border-sky-500 text-sky-900 scale-110 shadow-md ring-4 ring-sky-300/30 z-20";
                                      } else if (idx < currI && !isSuccess) {
                                          boxClass += "bg-slate-200 border-slate-300 text-slate-500 opacity-60";
                                      } else {
                                          boxClass += "bg-white border-slate-300 text-slate-700 shadow-sm";
                                      }

                                      return (
                                          <div key={`s-${idx}`} className="flex flex-col items-center relative">
                                              
                                              {/* Top Match Anchor Pointer */}
                                              <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full z-40">
                                                  {isMatchAnchor && (
                                                      <div className="flex flex-col items-center animate-in slide-in-from-top-2 opacity-80">
                                                          <span className="text-[9px] font-black font-mono tracking-widest text-emerald-800 bg-emerald-100 px-1 py-0.5 rounded border border-emerald-300 mb-1 leading-none">match</span>
                                                          <ArrowDown size={14} className="text-emerald-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>{char}</div>
                                              
                                              {/* Bottom Current I Pointer */}
                                              <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                                  {isCurrentI && (
                                                      <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                          <ArrowUp size={16} className="text-sky-500" strokeWidth={3}/>
                                                          <span className="text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mt-1 text-sky-800 bg-sky-100 border-sky-300">i</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {/* Virtual End of String Indicator for i */}
                                  <div className="flex flex-col items-center relative w-10">
                                      <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-30">
                                          {currI === s.length && !isSuccess && (
                                              <div className="flex flex-col items-center animate-in slide-in-from-bottom-2">
                                                  <ArrowUp size={16} className="text-sky-500" strokeWidth={3}/>
                                                  <span className="text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mt-1 text-sky-800 bg-sky-100 border-sky-300">i</span>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>

                              {/* Connection Line & Status visual */}
                              <div className="w-full flex justify-center h-4 relative">
                                  {!isSuccess && currI < s.length && currJ < p.length && (action === 'matchChar' || action === 'foundStar' || action === 'fatal' || action === 'loop') && (
                                      <div className="absolute top-1/2 -translate-y-1/2 h-full flex flex-col justify-center items-center">
                                          <div className={`h-full w-0.5 border-l-2 border-dashed ${action === 'matchChar' || action === 'foundStar' ? 'border-emerald-400' : (action === 'fatal' ? 'border-rose-400' : 'border-slate-300')}`}></div>
                                      </div>
                                  )}
                                  {!isSuccess && action === 'backtrackStar' && (
                                      <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 text-amber-500 font-mono text-[10px] font-black uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200 shadow-sm animate-bounce z-50">
                                          <CornerUpLeft size={14}/> Backtracking to *
                                      </div>
                                  )}
                              </div>

                              {/* Pattern P Array */}
                              <div className="flex items-center gap-2 relative p-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl min-w-max mx-auto px-10">
                                  <span className="absolute left-2 -bottom-6 text-[10px] font-black uppercase text-purple-600 tracking-widest font-mono">Pattern p</span>
                                  {p.split('').map((char, idx) => {
                                      let isCurrentJ = currJ === idx;
                                      let isStarAnchor = starIdx === idx && !isSuccess;

                                      let boxClass = "relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg border-2 font-mono font-black text-lg transition-all duration-300 shrink-0 ";
                                      let textClass = "text-slate-700";
                                      
                                      if (char === '*' || char === '?') {
                                          textClass = "text-amber-600";
                                      }

                                      if (isCurrentJ && !isSuccess) {
                                          boxClass += "bg-purple-100 border-purple-500 scale-110 shadow-md ring-4 ring-purple-300/30 z-20";
                                          if (char === '*' || char === '?') textClass = "text-amber-700";
                                          else textClass = "text-purple-900";
                                      } else if (isStarAnchor) {
                                          boxClass += "bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300/50 z-10 scale-105";
                                          textClass = "text-amber-800";
                                      } else if (idx < currJ && !isSuccess) {
                                          boxClass += "bg-slate-200 border-slate-300 text-slate-500 opacity-60";
                                      } else {
                                          boxClass += "bg-white border-slate-300 shadow-sm";
                                      }

                                      return (
                                          <div key={`p-${idx}`} className="flex flex-col items-center relative">
                                              
                                              {/* Top Current J Pointer */}
                                              <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full z-30">
                                                  {isCurrentJ && (
                                                      <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                          <span className="text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mb-1 text-purple-800 bg-purple-100 border-purple-300">j</span>
                                                          <ArrowDown size={16} className="text-purple-500" strokeWidth={3}/>
                                                      </div>
                                                  )}
                                              </div>

                                              <div className={boxClass}>{char}</div>
                                              
                                              {/* Bottom Star Anchor Pointer */}
                                              <div className="absolute -bottom-10 flex flex-col items-center h-8 w-full z-40">
                                                  {isStarAnchor && (
                                                      <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 opacity-80">
                                                          <ArrowUp size={14} className="text-amber-500" strokeWidth={3}/>
                                                          <span className="text-[9px] font-black font-mono tracking-widest text-amber-800 bg-amber-100 px-1 py-0.5 rounded border border-amber-300 mt-1 leading-none">starIdx</span>
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      );
                                  })}
                                  {/* Virtual End of Pattern Indicator for j */}
                                  <div className="flex flex-col items-center relative w-10">
                                      <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full z-30">
                                          {currJ === p.length && !isSuccess && (
                                              <div className="flex flex-col items-center animate-in slide-in-from-top-2">
                                                  <span className="text-[10px] font-black font-mono tracking-widest px-1.5 py-0.5 rounded border shadow-sm mb-1 text-purple-800 bg-purple-100 border-purple-300">j</span>
                                                  <ArrowDown size={16} className="text-purple-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>

                          </div>
                      )}


                      {/* DP APPROACH UI */}
                      {selectedApproachId === 'dp' && dp && (
                          <div className="bg-slate-800 p-2 rounded-xl shadow-xl w-max mx-auto border-4 border-slate-700 mt-6 relative">
                              
                              {/* Axis Labels */}
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Pattern (p)</div>
                              <div className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">String (s)</div>

                              <div className="flex flex-col gap-0 border-2 border-slate-900 bg-slate-900">
                                  
                                  {/* Column Headers (Pattern) */}
                                  <div className="flex gap-0">
                                      <div className="w-10 h-10 bg-slate-900 flex items-center justify-center font-mono font-bold text-slate-500 text-xs"></div>
                                      <div className="w-10 h-10 bg-slate-800 flex items-center justify-center font-mono font-black text-amber-500 text-lg border border-slate-700">""</div>
                                      {p.split('').map((char, j) => (
                                          <div key={`col-${j}`} className="w-10 h-10 bg-slate-800 flex items-center justify-center font-mono font-black text-amber-500 text-lg border border-slate-700">
                                              {char}
                                          </div>
                                      ))}
                                  </div>

                                  {/* Matrix Rows */}
                                  {dp.map((rowArr, i) => (
                                      <div key={`row-${i}`} className="flex gap-0">
                                          {/* Row Header (String) */}
                                          <div className="w-10 h-10 bg-slate-800 flex items-center justify-center font-mono font-black text-sky-400 text-lg border border-slate-700">
                                              {i === 0 ? '""' : s[i-1]}
                                          </div>

                                          {/* DP Cells */}
                                          {rowArr.map((cellVal, j) => {
                                              let isTarget = currI === i && currJ === j && !isSuccess;
                                              
                                              // Dependencies
                                              let isDiagDep = action === 'matchDiagonal' && currI - 1 === i && currJ - 1 === j;
                                              let isTopDep = action === 'matchStar' && currI - 1 === i && currJ === j;
                                              let isLeftDep = action === 'matchStar' && currI === i && currJ - 1 === j;

                                              let isFinalAns = isSuccess && i === s.length && j === p.length;

                                              let cellClass = "w-10 h-10 flex flex-col items-center justify-center transition-all duration-300 relative border font-mono font-black text-base ";
                                              
                                              if (isFinalAns) {
                                                  cellClass += ans ? "bg-emerald-500 border-emerald-600 text-white z-30 scale-110" : "bg-rose-500 border-rose-600 text-white z-30 scale-110";
                                              } else if (isTarget) {
                                                  cellClass += "bg-violet-300 border-violet-500 text-violet-900 scale-110 shadow-lg z-20 ring-2 ring-violet-400";
                                              } else if (isDiagDep || isTopDep || isLeftDep) {
                                                  cellClass += "bg-amber-100 border-amber-400 text-amber-800 z-10";
                                              } else if (cellVal === true) {
                                                  cellClass += "bg-emerald-50 border-slate-300 text-emerald-600";
                                              } else if (cellVal === false) {
                                                  cellClass += "bg-white border-slate-300 text-slate-300";
                                              }

                                              return (
                                                  <div key={`cell-${i}-${j}`} className={cellClass}>
                                                      {cellVal ? 'T' : 'F'}
                                                      
                                                      {isDiagDep && <ArrowRight className="absolute -bottom-3 -right-3 text-amber-500 z-50 transform rotate-45" size={16} strokeWidth={4} />}
                                                      {isTopDep && <ArrowDown className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-amber-500 z-50" size={16} strokeWidth={4} />}
                                                      {isLeftDep && <ArrowRight className="absolute -right-4 top-1/2 -translate-y-1/2 text-amber-500 z-50" size={16} strokeWidth={4} />}
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans ? <Check size={32} strokeWidth={3}/> : <XSquare size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">MATCHING COMPLETE</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block ${ans ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  String {ans ? 'matches' : 'does not match'} pattern
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
                <Asterisk className="text-violet-600"/> The Greedy Fallback Concept
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Wildcard Matching is famously known for having an $O(S \times P)$ 2D DP solution. However, because the <code>*</code> wildcard is completely unconstrained (unlike Regular Expression Matching where <code>*</code> acts on the preceding character), we can actually solve this greedily using Two Pointers in $O(S + P)$ average time!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <FastForward size={18}/> Tentative Advancement
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            When we encounter a <code>*</code>, we do NOT immediately fork our process or run a recursive DFS.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-3">
                            <p>We greedily assume the <code>*</code> matches <strong>zero</strong> characters. We just advance the pattern pointer and keep the string pointer where it is.</p>
                            <p>But before we do, we drop an anchor! We record <code>starIdx = j</code> and <code>match = i</code> so we know exactly where to retreat if our greedy guess was wrong.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <CornerUpLeft size={18}/> The Backtrack
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            If our tentative zero-character assumption leads to a mismatch later on...
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We don't return false! We check if we have an anchor (<code>starIdx != -1</code>).</p>
                            <p>If we do, we jump back! We set <code>j</code> back to the character immediately following the <code>*</code>.</p>
                            <p>We then increment our <code>match</code> anchor. This effectively tells the <code>*</code>: "Okay, you need to swallow one more character. Try again."</p>
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
                        "While a standard 2D Dynamic Programming table safely solves this in $O(S \times P)$ Time and Space, I chose the Greedy Two-Pointer approach because it optimizes space to strict $O(1)$ and brings the average time complexity down to $O(S + P)$. The core idea is that the `*` wildcard can match any sequence independently. When I encounter a `*`, I record its position and my current position in the string, then greedily attempt to match it with zero characters. If I later encounter a mismatch, instead of failing, I backtrack to the last recorded `*` position, forcing it to absorb one more character from the string, and try again. This localized backtracking is extremely fast in practice, only degrading to $O(S \times P)$ in pathological cases filled with chained asterisks."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Is this same as Regex Matching (LC 10)?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                No! In Regular Expression Matching (LC 10), the <code>*</code> modifies the character <em>preceding</em> it (e.g., <code>a*</code> means zero or more 'a's). In Wildcard Matching, <code>*</code> is an independent token that matches any sequence of anything. This subtle difference is why Wildcard can be solved greedily, while Regex absolutely requires DP or full Backtracking.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Greedy: O(S+P) Avg</span>
                                <p className="text-[10px] text-slate-500 mt-1">Average case is linear. Worst case $O(S \times P)$ only occurs with patterns like <code>*a*a*a*a*a*a*a*b</code> checked against long repetitive strings. DP is strictly $O(S \times P)$ always.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Greedy: O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The greedy approach uses four integer pointers, requiring $O(1)$ auxiliary space. The DP approach allocates an $O(S \times P)$ boolean matrix (though it can be optimized to $O(P)$ 1D array).</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|isMatch|charAt|length|s|p|sLen|pLen|starIdx|match|dp)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['isMatch', 'length', 'charAt'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['s', 'p', 'sLen', 'pLen', 'dp'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (['starIdx', 'match'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default WildcardVisualizer;