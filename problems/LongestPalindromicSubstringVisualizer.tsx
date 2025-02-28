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
  ArrowUp,
  Info, 
  BarChart3, 
  X, 
  Maximize2,
  Table as TableIcon,
  Scaling,
  MousePointer2,
  Timer,
  ShieldCheck,
  BrainCircuit,
  CornerDownRight
} from 'lucide-react';

const APPROACHES = {
  expand: {
    id: 'expand',
    title: '1. Expand Centers',
    subtitle: 'Optimal O(1) Space',
    icon: <Scaling size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `class Solution {
    public String longestPalindrome(String s) {
        if (s == null || s.length() < 1) return "";
        int start = 0, end = 0;
        for (int i = 0; i < s.length(); i++) {
            int len1 = expandAroundCenter(s, i, i);
            int len2 = expandAroundCenter(s, i, i + 1);
            int len = Math.max(len1, len2);
            if (len > end - start) {
                start = i - (len - 1) / 2;
                end = i + len / 2;
            }
        }
        return s.substring(start, end + 1);
    }

    private int expandAroundCenter(String s, int left, int right) {
        while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
            left--;
            right++;
        }
        return right - left - 1;
    }
}`,
    explanation: "Palindromes are symmetric. We can pick a center (or a pair of indices for even length) and expand outwards as long as characters match. This is memory-efficient because we don't store previous results."
  },
  dp: {
    id: 'dp',
    title: '2. Dynamic Prog',
    subtitle: 'Table O(N²) Space',
    icon: <TableIcon size={16} />,
    complexity: 'Time: O(N²) | Space: O(N²)',
    code: `class Solution {
    public String longestPalindrome(String s) {
        int n = s.length();
        boolean[][] dp = new boolean[n][n];
        int start = 0, maxLen = 1;
        
        for (int i = 0; i < n; i++) dp[i][i] = true;
        
        for (int len = 2; len <= n; len++) {
            for (int i = 0; i <= n - len; i++) {
                int j = i + len - 1;
                if (s.charAt(i) == s.charAt(j)) {
                    if (len == 2 || dp[i+1][j-1]) {
                        dp[i][j] = true;
                        if (len > maxLen) {
                            start = i;
                            maxLen = len;
                        }
                    }
                }
            }
        }
        return s.substring(start, start + maxLen);
    }
}`,
    explanation: "Uses a table where dp[i][j] indicates if s[i...j] is a palindrome. Base cases are substrings of length 1 and 2. Longer substrings depend on the result of their inner substring (dp[i+1][j-1])."
  }
};

const LongestPalindromicSubstringVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproach, setSelectedApproach] = useState('expand');
  const [inputS, setInputS] = useState("babad");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps = [];
    let s = inputS.trim();
    if (!s) s = "babad";
    const n = s.length;

    if (n === 0) return [{ phase: 'Empty', description: 'String is empty.', line: 1, state: { finished: true, s, start: 0, end: -1 } }];

    const addStep = (phase, desc, line, state) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          s,
          start: 0,
          end: 0,
          i: -1,
          j: -1,
          L: -1,
          R: -1,
          centerType: null, // 'odd' | 'even'
          centerIdx: -1,
          isMatch: null,
          maxLen: 1,
          dp: null,
          depI: -1,
          depJ: -1,
          found: false,
          ...state 
        } 
      });
    };

    if (selectedApproach === 'expand') {
      addStep("Init Pointers", "Line 4: We initialize `start` and `end` pointers to 0. These will track the global longest palindrome found.", 4, { start: 0, end: 0 });
      let start = 0, end = 0;

      for (let i = 0; i < n; i++) {
        addStep("Outer Loop", `Line 5: Iterating through the string. Current index i = ${i}. We will treat '${s[i]}' as the center.`, 5, { i, start, end });

        // --- ODD EXPANSION ---
        addStep("Odd Expansion", `Line 6: Call expandAroundCenter(s, left=${i}, right=${i}). We are looking for an odd-length palindrome centered exactly AT index ${i}.`, 6, { i, start, end, L: i, R: i, centerType: 'odd', centerIdx: i });
        let l1 = i, r1 = i;
        while(true) {
            addStep("While Condition", `Line 18: Checking bounds: left >= 0 && right < ${n}. Also checking character match: s[${l1}] == s[${r1}].`, 18, { i, start, end, L: l1, R: r1, centerType: 'odd', centerIdx: i });
            
            if (l1 < 0 || r1 >= n) {
                addStep("Bounds Hit", `Line 18: Expansion stopped because a pointer went out of bounds.`, 18, { i, start, end, L: l1, R: r1, centerType: 'odd', centerIdx: i, isMatch: false });
                break;
            }
            const isMatch = s[l1] === s[r1];
            if (isMatch) {
                addStep("Match!", `Line 18: s[${l1}] ('${s[l1]}') equals s[${r1}] ('${s[r1]}'). This segment is a valid palindrome!`, 18, { i, start, end, L: l1, R: r1, centerType: 'odd', centerIdx: i, isMatch: true, found: true });
                l1--; r1++;
                addStep("Expand Window", `Lines 19-20: Decrement left to ${l1}, increment right to ${r1} to check the next outer layer.`, 19, { i, start, end, L: l1, R: r1, centerType: 'odd', centerIdx: i, found: true });
            } else {
                addStep("Mismatch", `Line 18: Mismatch! s[${l1}] ('${s[l1]}') does NOT equal s[${r1}] ('${s[r1]}'). Expansion stops.`, 18, { i, start, end, L: l1, R: r1, centerType: 'odd', centerIdx: i, isMatch: false });
                break;
            }
        }
        let len1 = r1 - l1 - 1;
        addStep("Return Length", `Line 22: Calculate actual palindrome length: right - left - 1 = ${r1} - ${l1} - 1 = ${len1}.`, 22, { i, start, end, currentLen: len1 });

        // --- EVEN EXPANSION ---
        addStep("Even Expansion", `Line 7: Call expandAroundCenter(s, left=${i}, right=${i+1}). We are looking for an even-length palindrome centered BETWEEN indices ${i} and ${i+1}.`, 7, { i, start, end, L: i, R: i+1, centerType: 'even', centerIdx: i });
        let l2 = i, r2 = i + 1;
        while(true) {
            addStep("While Condition", `Line 18: Checking bounds: left >= 0 && right < ${n}. Also checking character match: s[${l2}] == s[${r2}].`, 18, { i, start, end, L: l2, R: r2, centerType: 'even', centerIdx: i });
            
            if (l2 < 0 || r2 >= n) {
                addStep("Bounds Hit", `Line 18: Expansion stopped because a pointer went out of bounds.`, 18, { i, start, end, L: l2, R: r2, centerType: 'even', centerIdx: i, isMatch: false });
                break;
            }
            const isMatch = s[l2] === s[r2];
            if (isMatch) {
                addStep("Match!", `Line 18: s[${l2}] ('${s[l2]}') equals s[${r2}] ('${s[r2]}'). This segment is a valid palindrome!`, 18, { i, start, end, L: l2, R: r2, centerType: 'even', centerIdx: i, isMatch: true, found: true });
                l2--; r2++;
                addStep("Expand Window", `Lines 19-20: Decrement left to ${l2}, increment right to ${r2} to check the next outer layer.`, 19, { i, start, end, L: l2, R: r2, centerType: 'even', centerIdx: i, found: true });
            } else {
                addStep("Mismatch", `Line 18: Mismatch! s[${l2}] ('${s[l2]}') does NOT equal s[${r2}] ('${s[r2]}'). Expansion stops.`, 18, { i, start, end, L: l2, R: r2, centerType: 'even', centerIdx: i, isMatch: false });
                break;
            }
        }
        let len2 = r2 - l2 - 1;
        addStep("Return Length", `Line 22: Calculate actual palindrome length: right - left - 1 = ${r2} - ${l2} - 1 = ${len2}.`, 22, { i, start, end, currentLen: len2 });

        // --- COMPARISON ---
        const maxLenStep = Math.max(len1, len2);
        addStep("Max Length", `Line 8: Math.max(len1=${len1}, len2=${len2}) = ${maxLenStep}. This is the longest palindrome found from center i=${i}.`, 8, { i, start, end, currentLen: maxLenStep });

        addStep("Check Record", `Line 9: Is new length ${maxLenStep} > current global best length (${end - start})?`, 9, { i, start, end, currentLen: maxLenStep });
        if (maxLenStep > (end - start)) {
            const oldStart = start;
            const oldEnd = end;
            start = i - Math.floor((maxLenStep - 1) / 2);
            end = i + Math.floor(maxLenStep / 2);
            addStep("Update Global", `Lines 10-11: Yes! Updating global start to ${start} and end to ${end}. Substring is now "${s.substring(start, end + 1)}".`, 10, { i, start, end, currentLen: maxLenStep });
        }
      }
      addStep("Conclusion", `Line 14: Loop finished. Returning global longest palindrome: "${s.substring(start, end + 1)}".`, 14, { start, end, finished: true });

    } else {
      // --- DP APPROACH ---
      const dp = Array.from({ length: n }, () => Array(n).fill(false));
      let startIdx = 0, maxLen = 1;

      addStep("Init Arrays", "Lines 3-5: Initialize DP table of size N x N. dp[i][j] will store true if substring s[i...j] is a palindrome.", 4, { dp: JSON.parse(JSON.stringify(dp)) });

      addStep("Base Case Loop", "Line 7: Loop to set all length 1 substrings as true.", 7, { dp: JSON.parse(JSON.stringify(dp)) });
      for (let i = 0; i < n; i++) {
        dp[i][i] = true;
      }
      addStep("Base Cases Set", `Line 7: Every single character s[i] is naturally a palindrome. Diagonals dp[i][i] set to true.`, 7, { dp: JSON.parse(JSON.stringify(dp)), i: -1, j: -1 });

      for (let length = 2; length <= n; length++) {
        addStep("Length Loop", `Line 9: Scanning all possible substrings of length ${length}.`, 9, { dp: JSON.parse(JSON.stringify(dp)), currLen: length });
        
        for (let i = 0; i <= n - length; i++) {
          const j = i + length - 1;
          addStep("Determine Substring", `Lines 10-11: Testing start index i=${i}. The end index j is ${i} + ${length} - 1 = ${j}. Substring: "${s.substring(i, j + 1)}"`, 11, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length });

          const isMatch = s[i] === s[j];
          addStep("Check Endpoints", `Line 12: Do the endpoints match? s[${i}] ('${s[i]}') == s[${j}] ('${s[j]}')? -> ${isMatch ? 'TRUE' : 'FALSE'}.`, 12, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length, isMatch });
          
          if (isMatch) {
            const isInnerPal = length === 2 || dp[i + 1][j - 1];
            addStep("Check Inner", `Line 13: Endpoints match! Now check if inner core is a palindrome.\nCondition: (length == 2 OR dp[i+1][j-1]).\nEvaluating: (${length} == 2 OR dp[${i+1}][${j-1}]). Result: ${isInnerPal ? 'TRUE' : 'FALSE'}.`, 13, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length, depI: length > 2 ? i + 1 : -1, depJ: length > 2 ? j - 1 : -1, isMatch });
            
            if (isInnerPal) {
              dp[i][j] = true;
              addStep("Mark Valid", `Line 14: Both conditions met. dp[${i}][${j}] is now marked TRUE.`, 14, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length });
              
              addStep("Check Record", `Line 15: Is current length (${length}) > maxLen (${maxLen})?`, 15, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length, start: startIdx, end: startIdx + maxLen - 1 });
              if (length > maxLen) {
                startIdx = i;
                maxLen = length;
                addStep("Update Best", `Lines 16-17: New record! Start index updated to ${startIdx}, maxLen updated to ${maxLen}.`, 16, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length, start: startIdx, end: startIdx + maxLen - 1 });
              }
            } else {
                addStep("Inner Failed", `Line 13: Endpoints matched, but the inner substring dp[${i+1}][${j-1}] was false. Discarding.`, 13, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length });
            }
          } else {
            addStep("Endpoints Failed", "Line 12: Endpoints did not match. Cannot be a palindrome.", 12, { dp: JSON.parse(JSON.stringify(dp)), i, j, currLen: length, isMatch: false });
          }
        }
      }
      addStep("Conclusion", `Line 23: DP iterations complete. Longest palindrome identified: "${s.substring(startIdx, startIdx + maxLen)}".`, 23, { dp: JSON.parse(JSON.stringify(dp)), start: startIdx, end: startIdx + maxLen - 1, finished: true });
    }

    return steps;
  }, [inputS, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { 
    navigator.clipboard.writeText(APPROACHES[selectedApproach].code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  const cur = trace[currentStep] || trace[0] || { state: {} };
  const { s: text, start, end, i, j, L, R, found, dp, finished, currentLen, centerType, centerIdx, isMatch, depI, depJ } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <Maximize2 className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Longest Palindromic Substring</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">Amazon Most Asked</span>
                <span>LC 5 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto max-w-full">
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
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">5. Longest Palindromic Substring</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given a string <code>s</code>, return <em>the longest palindromic substring</em> in <code>s</code>.</p>
                  <p>A <strong>palindrome</strong> is a string that reads the same forward and backward.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Examples:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> s = "babad"</p>
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> "bab"</p>
                        <p className="text-slate-500 italic text-[10px] mt-2">Note: "aba" is also a valid answer.</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm shadow-inner">
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Input:</span> s = "cbbd"</p>
                        <p><span className="text-slate-400 font-bold uppercase tracking-tighter text-[10px]">Output:</span> "bb"</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800 font-bold">1 {'<='} s.length {'<='} 1000</code></li>
                  <li><code>s</code> consists of only digits and English letters.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            
            {/* Left Col: Code & Context */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES)).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight text-[10px]">Solution.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[12px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/20 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${((cur.line - 1) * 20) + 24}px`, height: '20px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                        <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} />
                      </React.Fragment>
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Info size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest font-mono">Algorithm Note</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            {/* Right Col: Visualizer */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              
              {/* Controls */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end shrink-0">
                <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input String</label>
                    <input value={inputS} onChange={(e) => { setInputS(e.target.value.replace(/[^a-zA-Z0-9]/g, '')); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" maxLength={10} placeholder="babad" />
                    <p className="text-[9px] text-slate-400 pl-1 font-mono">Alphanumeric. Max 10 chars for visualizer fitting.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto pb-5">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 sm:flex-none sm:w-20 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] sm:flex-none sm:w-32 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-md shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-1">
                    Next <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              {/* Execution Log */}
              <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[180px] relative overflow-hidden group shrink-0 ${isMatch === true || cur.phase === 'Match!' ? 'bg-emerald-900 border-emerald-800' : (isMatch === false || cur.phase === 'Mismatch' ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    {selectedApproach === 'expand' ? <Scaling size={100}/> : <Database size={100}/>}
                </div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                   <div className="flex items-center gap-2">
                      <Activity size={14} className={isMatch === true ? "text-emerald-400" : (isMatch === false ? 'text-rose-400' : "text-indigo-400")}/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Details</span>
                   </div>
                   <div className="px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Line {cur.line}</div>
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 font-mono whitespace-pre-line relative z-10">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[460px] relative flex flex-col overflow-hidden shadow-inner items-center justify-start pt-8">
                
                {/* State Variables Dashboard */}
                {!finished && (
                  <div className="w-full flex justify-center gap-6 z-10 mb-8">
                     <div className="bg-slate-50 rounded-2xl px-6 py-3 border border-slate-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Global Longest</span>
                        <div className="text-2xl font-black text-slate-800 font-mono">
                            {end - start + 1} <span className="text-xs text-slate-400 ml-1">("{text.substring(start, end + 1)}")</span>
                        </div>
                     </div>
                  </div>
                )}

                <div className="flex flex-col items-center justify-center w-full relative z-10 gap-10">
                    
                    {/* Visual: Expand Approach */}
                    {selectedApproach === 'expand' && (
                        <div className="flex flex-col items-center w-full gap-8 mt-4">
                            
                            {/* Non-overlapping Grid system for Array + Pointers */}
                            <div className="flex gap-2">
                                {inputS.split('').map((char, idx) => {
                                    const isL = L === idx;
                                    const isR = R === idx;
                                    const isCenterOdd = centerType === 'odd' && centerIdx === idx;
                                    const isCenterEven = centerType === 'even' && centerIdx === idx; // The gap is attached to the right of this index
                                    const isExpanding = L !== -1 && R !== -1 && idx >= L && idx <= R;
                                    
                                    let boxClass = "w-12 h-14 border-2 rounded-xl flex items-center justify-center font-mono text-2xl transition-all duration-300 relative z-10 ";
                                    
                                    if (isExpanding) {
                                        boxClass += isMatch === false ? "bg-rose-100 border-rose-500 text-rose-800 shadow-[0_0_15px_rgba(244,63,94,0.3)]" : "bg-indigo-100 border-indigo-500 text-indigo-800 shadow-[0_0_15px_rgba(99,102,241,0.3)]";
                                        if (isL || isR) boxClass += " scale-110 ring-4 ring-indigo-500/20";
                                    } else {
                                        boxClass += "bg-white border-slate-200 text-slate-400";
                                    }

                                    return (
                                        <div key={idx} className="flex flex-col items-center gap-2">
                                            {/* Top Container: Center Indicator */}
                                            <div className="h-8 flex items-end justify-center relative w-full">
                                                {isCenterOdd && (
                                                    <div className="flex flex-col items-center text-amber-500 animate-in fade-in zoom-in">
                                                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-amber-200">Center i</span>
                                                        <ArrowDown size={14} strokeWidth={3} className="mt-1"/>
                                                    </div>
                                                )}
                                                {isCenterEven && (
                                                    <div className="absolute -right-3 flex flex-col items-center text-amber-500 animate-in fade-in zoom-in z-30 transform translate-x-1/2">
                                                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-amber-200">Center i</span>
                                                        <div className="h-16 w-0.5 bg-amber-400 mt-1 border-x border-white"></div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Character Box */}
                                            <div className={boxClass}>
                                                {char}
                                                <span className={`absolute -top-3 -right-2 text-[8px] font-bold font-mono ${isL || isR ? 'text-indigo-600' : 'text-slate-300'}`}>{idx}</span>
                                            </div>

                                            {/* Bottom Container: L / R Pointers */}
                                            <div className="h-10 flex items-start justify-center w-full">
                                                {isL && isR && L >= 0 && (
                                                    <div className={`flex flex-col items-center text-indigo-500 animate-in slide-in-from-bottom-2`}>
                                                        <ArrowUp size={16} strokeWidth={3} />
                                                        <span className="text-[10px] font-black mt-1 uppercase bg-indigo-50 px-2 rounded-full border border-indigo-200">L, R</span>
                                                    </div>
                                                )}
                                                {isL && L !== R && L >= 0 && (
                                                    <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2 ${isMatch === false ? 'text-rose-500' : 'text-indigo-500'}`}>
                                                        <ArrowUp size={16} strokeWidth={3} />
                                                        <span className={`text-[10px] font-black mt-1 uppercase px-2 rounded-full border ${isMatch === false ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-200'}`}>L</span>
                                                    </div>
                                                )}
                                                {isR && L !== R && R < text.length && (
                                                    <div className={`flex flex-col items-center animate-in slide-in-from-bottom-2 ${isMatch === false ? 'text-rose-500' : 'text-indigo-500'}`}>
                                                        <ArrowUp size={16} strokeWidth={3} />
                                                        <span className={`text-[10px] font-black mt-1 uppercase px-2 rounded-full border ${isMatch === false ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-200'}`}>R</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Comparison HUD below everything */}
                            <div className="h-16 w-full flex justify-center">
                                {isMatch !== null && (
                                    <div className="flex items-center gap-4 bg-slate-50 px-8 py-3 rounded-2xl border border-slate-200 shadow-sm animate-in zoom-in slide-in-from-bottom-4 duration-300">
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Left: s[{L}]</span>
                                            <span className={`text-xl font-mono font-black ${isMatch ? 'text-indigo-600' : 'text-rose-600'}`}>
                                                {L < 0 ? 'Out of Bounds' : `'${text[L]}'`}
                                            </span>
                                        </div>
                                        <div className="text-slate-300 font-black text-xl">==</div>
                                        <div className="flex flex-col items-center">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 font-mono">Right: s[{R}]</span>
                                            <span className={`text-xl font-mono font-black ${isMatch ? 'text-indigo-600' : 'text-rose-600'}`}>
                                                {R >= text.length ? 'Out of Bounds' : `'${text[R]}'`}
                                            </span>
                                        </div>
                                        <div className="ml-4 pl-4 border-l border-slate-200 flex items-center h-full">
                                            {isMatch ? 
                                                <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1 border border-emerald-200 shadow-sm"><Check size={14}/> Match</span> : 
                                                <span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-xs font-black uppercase flex items-center gap-1 border border-rose-200 shadow-sm"><X size={14}/> Mismatch</span>
                                            }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Visual: DP Approach */}
                    {selectedApproach === 'dp' && dp && (
                      <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-500 max-w-full overflow-x-auto pb-4">
                        <div className="flex flex-col gap-1 p-5 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm">
                          
                          {/* Column Headers (j) */}
                          <div className="flex gap-1 mb-2">
                            <div className="w-10 h-10 flex items-end justify-end pr-1 pb-1 text-[10px] font-black text-slate-300 font-mono">i \ j</div>
                            {inputS.split('').map((c, idx) => (
                              <div key={`col-${idx}`} className={`w-10 h-10 flex flex-col items-center justify-center font-mono font-black border-b-2 transition-colors ${j === idx ? 'text-indigo-600 border-indigo-400 bg-indigo-50/50 rounded-t-lg' : 'text-slate-400 border-slate-200'}`}>
                                  <span className="text-[9px] opacity-50">{idx}</span>
                                  <span>{c}</span>
                              </div>
                            ))}
                          </div>

                          {/* Rows (i) */}
                          {dp.map((row, rIdx) => (
                            <div key={`row-${rIdx}`} className="flex gap-1">
                              {/* Row Header */}
                              <div className={`w-10 h-10 flex items-center justify-between px-1.5 font-mono font-black border-r-2 transition-colors ${i === rIdx ? 'text-indigo-600 border-indigo-400 bg-indigo-50/50 rounded-l-lg' : 'text-slate-400 border-slate-200'}`}>
                                  <span className="text-[9px] opacity-50">{rIdx}</span>
                                  <span>{inputS[rIdx]}</span>
                              </div>
                              
                              {/* Cells */}
                              {row.map((val, cIdx) => {
                                const isActive = i === rIdx && j === cIdx;
                                const isDependency = depI === rIdx && depJ === cIdx;
                                const isInvalid = rIdx > cIdx; // lower triangle
                                
                                let cellClass = "w-10 h-10 rounded-md flex items-center justify-center text-sm font-black font-mono transition-all duration-300 relative ";
                                
                                if (isInvalid) {
                                    cellClass += "bg-slate-100/50 text-transparent";
                                } else if (isActive) {
                                    cellClass += "bg-indigo-600 text-white shadow-xl scale-110 z-20 ring-2 ring-indigo-300 ring-offset-2";
                                } else if (isDependency) {
                                    cellClass += "bg-amber-100 text-amber-800 shadow-md scale-105 z-10 border-2 border-amber-400";
                                } else if (val) {
                                    cellClass += "bg-emerald-50 text-emerald-600 border border-emerald-200";
                                } else {
                                    cellClass += "bg-white text-slate-300 border border-slate-100";
                                }

                                return (
                                  <div key={`cell-${rIdx}-${cIdx}`} className={cellClass}>
                                    {!isInvalid && (val ? 'T' : 'F')}
                                    {/* Clean embedded dependency badge */}
                                    {isDependency && (
                                        <div className="absolute top-0 right-0 bg-amber-500 text-white text-[6px] px-0.5 rounded-bl-sm rounded-tr-md uppercase tracking-tighter">dep</div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                        
                        {/* DP Comparison HUD */}
                        <div className="h-16 mt-6 flex justify-center items-center w-full">
                            {i !== -1 && j !== -1 && (
                                <div className="flex flex-wrap items-center justify-center gap-3 bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm text-xs font-mono animate-in slide-in-from-bottom-4 duration-300">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">DP Rule Check:</span>
                                    
                                    {/* Endpoint match */}
                                    <span className={`px-2 py-1 rounded border font-bold flex items-center gap-1 ${isMatch ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                        s[{i}] == s[{j}]
                                        {isMatch ? <Check size={12}/> : <X size={12}/>}
                                    </span>
                                    
                                    {/* Inner dependency match (only if endpoints matched) */}
                                    {isMatch && depI !== -1 && (
                                        <>
                                            <span className="text-slate-300 font-black text-sm">&&</span>
                                            <span className={`px-2 py-1 rounded border font-bold flex items-center gap-1 ${dp[depI][depJ] ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-slate-100 border-slate-300 text-slate-500'}`}>
                                                dp[{depI}][{depJ}]
                                                {dp[depI][depJ] ? <Check size={12}/> : <X size={12}/>}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                      </div>
                    )}
                </div>

                {/* Completion Result Overlay */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Longest Found</span>
                        <div className="text-4xl font-black font-mono text-indigo-600 bg-indigo-50 px-6 py-2 rounded-2xl border border-indigo-100">
                           "{text.substring(start, end + 1)}"
                        </div>
                        <div className="mt-6 px-6 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest font-mono border border-slate-200">
                           Final Length: {end - start + 1}
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
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 font-mono leading-tight">
                <BookOpen className="text-indigo-600"/> Finding Symmetry in Chaos
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-mono tracking-tight">
                A palindrome is perfectly balanced. To find the longest one, we must explore all potential <strong>centers of symmetry</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><BrainCircuit size={18}/> The Dual-Center Pattern</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed italic border-l-2 border-indigo-200 pl-4">
                          "Every string has 2N-1 potential centers."
                        </p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-mono">
                          1. <strong>Single-Char Centers:</strong> Odd-length palindromes like 'aba' centered at 'b'. (N centers)<br/><br/>
                          2. <strong>Gap Centers:</strong> Even-length palindromes like 'abba' centered at the gap between 'bb'. (N-1 centers)
                        </p>
                    </div>
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Layers size={18}/> DP Dependency Rule</h3>
                        <p className="text-sm text-amber-700 leading-relaxed font-mono">
                          A substring <code>s[i...j]</code> is a palindrome IF AND ONLY IF:
                          <br/>1. The characters at endpoints match: <code>s[i] == s[j]</code>
                          <br/>2. The core <code>s[i+1...j-1]</code> is already a palindrome.
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Timer size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Efficiency Profile</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Expand Centers</span>
                          <div className="font-mono text-xl font-black text-indigo-400">O(N²) / O(1)</div>
                          <p className="text-[9px] text-slate-500 mt-2 font-mono uppercase tracking-tighter">Memory King</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Dynamic Prog</span>
                          <div className="font-mono text-xl font-black">O(N²) / O(N²)</div>
                          <p className="text-[9px] text-indigo-200 mt-2 font-mono uppercase tracking-tighter">Tabular Storage</p>
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <h4 className="text-[10px] font-black text-emerald-400 uppercase mb-1 flex items-center gap-2"><ShieldCheck size={12}/> Pro: Manacher's Algorithm</h4>
                      <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                        By using the symmetry of already discovered palindromes, we can skip redundant checks and find the result in <b>O(N)</b> linear time.
                      </p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="space-y-6">
                <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <Trophy size={140} />
                    </div>
                    <h3 className="text-xl font-black flex items-center gap-3 mb-4 text-amber-400 relative z-10 uppercase tracking-tight font-mono">
                        <Trophy size={24} /> Senior Interview Defense
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "In production environments like Amazon's high-traffic indexing services, memory footprint is as critical as runtime. I chose the 'Expand Around Center' algorithm because it maintains O(N²) runtime while requiring only <b>O(1) auxiliary space</b>. Compared to the DP approach, this eliminates the O(N²) memory overhead entirely, avoiding cache misses and potential stack/heap issues with large inputs, while staying modular and highly readable."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono font-black tracking-tight">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Can you solve this faster than O(N²)?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "Yes, using <strong>Manacher's Algorithm</strong>. It preprocesses the string and uses a 'rightmost boundary' tracker to mirror expansion results, achieving <b>O(N)</b>. However, Manacher's is complex to implement bug-free in a 45-minute interview, so I'd implement expansion first and offer Manacher's as a follow-up optimization."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"How does your code handle edge cases?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "I include a guard clause for null/empty strings. The loop range <code>i &lt; s.length() - 1</code> and boundary checks inside the expansion method ensure we never trigger an <code>IndexOutOfBoundsException</code>."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Leadership Strategy
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Customer Obsession</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Frame the space optimization as a way to ensure the algorithm works on low-memory mobile devices without performance degradation.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Ownership</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Acknowledge the O(N²) worst case. In strings with millions of identical characters, this could be slow. Discussing constraints shows you take responsibility for the code's impact.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <Database className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono tracking-tighter">Memory Scaling</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">DP Array O(N²)</span>
                                <span className="text-rose-500 font-black font-mono tracking-tighter">Heavy (1MB @ N=1000)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Expand Center O(1)</span>
                                <span className="text-indigo-500 font-black font-mono tracking-tighter">Static (Few Integers)</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500 w-[1%]" />
                            </div>
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|void|String|boolean|new|this|for|char|Math|max|substring|charAt|length)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-8 text-slate-600 text-right pr-4 border-r border-slate-800/50 mr-4 font-mono text-[10px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void', 'char'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['String', 'Math'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['max', 'substring', 'charAt', 'length'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LongestPalindromicSubstringVisualizer;
