import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Search, Type, ArrowRight, CornerDownRight, Hash
} from 'lucide-react';

const APPROACHES = {
  bruteForce: {
    id: 'bruteForce',
    title: '1. Sliding Window (Brute Force)',
    subtitle: 'Standard: O(N×M) Time, O(1) Space.',
    icon: <Search size={16} />,
    complexity: 'Time: O(N × M) | Space: O(1)',
    code: `class Solution {
    public int strStr(String haystack, String needle) {
        int m = haystack.length();
        int n = needle.length();
        
        for (int i = 0; i <= m - n; i++) {
            int j = 0;
            while (j < n && haystack.charAt(i + j) == needle.charAt(j)) {
                j++;
            }
            if (j == n) {
                return i;
            }
        }
        
        return -1;
    }
}`,
    explanation: "The Brute Force approach checks every possible starting position in the `haystack`. We slide a window of size equal to the `needle` across the `haystack`. For each starting index `i`, we use an inner loop with pointer `j` to compare characters one by one. If we find a mismatch, we immediately stop and advance our starting position `i` by 1. If `j` successfully reaches the end of the `needle`, we have found a full match and return `i`. While easy to write, this can be slow if there are many partial matches."
  },
  kmp: {
    id: 'kmp',
    title: '2. Knuth-Morris-Pratt (KMP)',
    subtitle: 'Optimal: O(N+M) Time, O(M) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N + M) | Space: O(M)',
    code: `class Solution {
    public int strStr(String haystack, String needle) {
        int m = haystack.length(), n = needle.length();
        if (n == 0) return 0;
        
        // Step 1: Build LPS (Longest Prefix Suffix) array
        int[] lps = new int[n];
        int prevLPS = 0, i = 1;
        while (i < n) {
            if (needle.charAt(i) == needle.charAt(prevLPS)) {
                lps[i++] = ++prevLPS;
            } else if (prevLPS == 0) {
                lps[i++] = 0;
            } else {
                prevLPS = lps[prevLPS - 1];
            }
        }
        
        // Step 2: Search using LPS
        i = 0; int j = 0;
        while (i < m) {
            if (haystack.charAt(i) == needle.charAt(j)) {
                i++; j++;
                if (j == n) return i - n;
            } else if (j == 0) {
                i++;
            } else {
                j = lps[j - 1]; // KMP Magic: Slide needle without backtracking i
            }
        }
        return -1;
    }
}`,
    explanation: "KMP is an advanced algorithm that guarantees O(N+M) time. The flaw of Brute Force is that when a mismatch occurs, it forgets all the matching characters it just saw and completely resets. KMP first pre-computes an `lps` array for the needle. `lps[k]` tells us the length of the longest proper prefix that is also a suffix up to index `k`. During the search, if a mismatch happens at `needle[j]`, instead of moving the haystack pointer `i` backwards, we use `lps[j-1]` to safely 'slide' the needle forward, keeping `i` exactly where it is. We never backtrack `i`!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">28. Find the Index of the First Occurrence in a String</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two strings <code>needle</code> and <code>haystack</code>, return the index of the first occurrence of <code>needle</code> in <code>haystack</code>, or <code>-1</code> if <code>needle</code> is not part of <code>haystack</code>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> haystack = "sadbutsad", needle = "sad"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 0</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "sad" occurs at index 0 and 6.</p>
                 <p>The first occurrence is at index 0, so we return 0.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> haystack = "leetcode", needle = "leeto"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> -1</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "leeto" did not occur in "leetcode", so we return -1.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= haystack.length, needle.length &lt;= 10<sup>4</sup></code></li>
              <li><code>haystack</code> and <code>needle</code> consist of only lowercase English characters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const StrStrVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('bruteForce');
  const [haystackInput, setHaystackInput] = useState('sadbutsad');
  const [needleInput, setNeedleInput] = useState('sad');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let haystack = haystackInput.toLowerCase().replace(/[^a-z]/g, '');
    let needle = needleInput.toLowerCase().replace(/[^a-z]/g, '');
    
    if (!haystack) haystack = "sadbutsad";
    if (!needle) needle = "sad";
    
    // UI Safeguards
    if (haystack.length > 20) haystack = haystack.slice(0, 20);
    if (needle.length > 10) needle = needle.slice(0, 10);

    return { haystack, needle };
  }, [haystackInput, needleInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { haystack, needle } = parsedData;
    const m = haystack.length;
    const n = needle.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    if (selectedApproachId === 'bruteForce') {
        
        addStep(
            "Initialization", 
            `Line 3-4: int m = ${m}, n = ${n};\n\nWe store the lengths of haystack and needle. We will slide a window of size ${n} across the haystack.`, 
            4, 
            { m, n, i: null, j: null, action: 'init', offset: 0 }
        );

        let iter = 0;
        let found = false;

        for (let i = 0; i <= m - n; i++) {
            if (iter++ > 200) break;

            addStep(
                "Evaluate Outer Loop", 
                `Line 6: for (int i = ${i}; i <= ${m - n}; i++)\n\nWe start comparing from index ${i} of haystack. (We only need to go up to ${m - n}, because a full match must have enough remaining characters to fit the needle).`, 
                6, 
                { m, n, i, j: null, action: 'outerLoop', offset: i }
            );

            let j = 0;
            addStep(
                "Initialize Inner Pointer", 
                `Line 7: int j = 0;\n\nReset the needle pointer 'j' to 0 for this new starting position.`, 
                7, 
                { m, n, i, j, action: 'innerInit', offset: i }
            );

            while (j < n) {
                addStep(
                    "Evaluate Inner Loop Condition", 
                    `Line 8: while (j < ${n} && haystack.charAt(${i} + ${j}) == needle.charAt(${j}))\n\nChecking if we should continue matching characters.`, 
                    8, 
                    { m, n, i, j, action: 'evalInner', offset: i }
                );

                let hChar = haystack[i + j];
                let nChar = needle[j];

                if (hChar === nChar) {
                    addStep(
                        "Character Match!", 
                        `Line 8 Evaluates TRUE: haystack[${i + j}] ('${hChar}') == needle[${j}] ('${nChar}').\n\nThey match! We will increment 'j' to check the next character.`, 
                        8, 
                        { m, n, i, j, action: 'match', offset: i, matchIdx: j }
                    );
                    j++;
                    addStep(
                        "Increment Needle Pointer", 
                        `Line 9: j++;\n\nj becomes ${j}.`, 
                        9, 
                        { m, n, i, j, action: 'incrementJ', offset: i }
                    );
                } else {
                    addStep(
                        "Character Mismatch", 
                        `Line 8 Evaluates FALSE: haystack[${i + j}] ('${hChar}') != needle[${j}] ('${nChar}').\n\nThe pattern breaks. We immediately exit the inner while loop.`, 
                        8, 
                        { m, n, i, j, action: 'mismatch', offset: i, mismatchIdx: j }
                    );
                    break;
                }
            }

            addStep(
                "Check Full Match", 
                `Line 11: if (j == n)\n\nDid we successfully match all characters? Is ${j} == ${n}? ${j === n ? 'YES!' : 'No.'}`, 
                11, 
                { m, n, i, j, action: 'checkResult', offset: i }
            );

            if (j === n) {
                addStep(
                    "Target Found!", 
                    `Line 12: return i;\n\nWe successfully matched the entire needle starting at index ${i} in the haystack. We return ${i}.`, 
                    12, 
                    { m, n, i, j, action: 'success', offset: i, isSuccess: true, ans: i }
                );
                found = true;
                break;
            }
        }
        
        if (!found) {
            addStep(
                "Search Exhausted", 
                `Line 16: return -1;\n\nWe checked every possible starting window and found no full matches. The needle is not in the haystack.`, 
                16, 
                { m, n, i: null, j: null, action: 'success', offset: 0, isSuccess: true, ans: -1 }
            );
        }

    } else if (selectedApproachId === 'kmp') {
        
        addStep(
            "Initialization", 
            `Line 3-4: int m = ${m}, n = ${n};\n\nStore lengths. If needle is empty (n=0), we return 0.`, 
            4, 
            { m, n, action: 'init' }
        );

        if (n === 0) {
            addStep("Empty Needle", "return 0;", 4, { m, n, action: 'success', isSuccess: true, ans: 0 });
            return steps;
        }

        // --- LPS Building Phase ---
        let lps = Array(n).fill(0);
        addStep(
            "Phase 1: Build LPS Array", 
            `Line 7-8: int[] lps = new int[${n}];\nint prevLPS = 0, i = 1;\n\nBefore searching, we build the Longest Prefix Suffix (LPS) array for the needle. This tells us how to 'slide' the needle safely when a mismatch occurs.`, 
            8, 
            { m, n, lps: [...lps], lpsI: 1, prevLPS: 0, action: 'buildLpsStart' }
        );

        let i = 1, prevLPS = 0;
        let iter = 0;
        while (i < n) {
            if (iter++ > 100) break;

            addStep(
                "LPS Loop", 
                `Line 9: while (i < ${n})\n\nComparing needle[i] ('${needle[i]}') with needle[prevLPS] ('${needle[prevLPS]}').`, 
                9, 
                { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsCompare' }
            );

            if (needle[i] === needle[prevLPS]) {
                addStep(
                    "LPS Match", 
                    `Line 10: needle[i] == needle[prevLPS]. Match!\n\nWe found a matching prefix and suffix.`, 
                    10, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsMatch' }
                );
                
                prevLPS++;
                lps[i] = prevLPS;
                
                addStep(
                    "Update LPS", 
                    `Line 11: lps[i++] = ++prevLPS;\n\nprevLPS becomes ${prevLPS}. lps[${i}] becomes ${prevLPS}. We increment i to ${i+1}.`, 
                    11, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsUpdate' }
                );
                i++;
            } else if (prevLPS === 0) {
                addStep(
                    "LPS Mismatch (At Start)", 
                    `Line 12: prevLPS == 0.\n\nMismatch, and we are already at the beginning of the prefix. There is no matching prefix-suffix here.`, 
                    12, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsMismatchZero' }
                );
                lps[i] = 0;
                addStep(
                    "Update LPS (Zero)", 
                    `Line 13: lps[i++] = 0;\n\nlps[${i}] becomes 0. We increment i to ${i+1}.`, 
                    13, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsUpdateZero' }
                );
                i++;
            } else {
                addStep(
                    "LPS Mismatch (Fallback)", 
                    `Line 14: Mismatch, but prevLPS > 0.\n\nWe fallback to the previous longest prefix suffix to see if a shorter prefix matches.`, 
                    14, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsFallback' }
                );
                prevLPS = lps[prevLPS - 1];
                addStep(
                    "Execute Fallback", 
                    `Line 15: prevLPS = lps[prevLPS - 1];\n\nprevLPS becomes ${prevLPS}. We will re-evaluate needle[i] against this new prevLPS.`, 
                    15, 
                    { m, n, lps: [...lps], lpsI: i, prevLPS, action: 'lpsFallbackExec' }
                );
            }
        }

        // --- Search Phase ---
        addStep(
            "Phase 2: Search Initialization", 
            `Line 19: i = 0; int j = 0;\n\nLPS is fully built: [${lps.join(', ')}].\nWe start the actual search. 'i' points to haystack, 'j' points to needle.`, 
            19, 
            { m, n, lps: [...lps], searchI: 0, searchJ: 0, action: 'searchInit', offset: 0 }
        );

        i = 0; 
        let j = 0;
        let found = false;
        iter = 0;

        while (i < m) {
            if (iter++ > 200) break;
            
            let offset = i - j; // Visual needle offset relative to haystack
            
            addStep(
                "Search Compare", 
                `Line 20-21: while (i < ${m}) \n\nComparing haystack[${i}] ('${haystack[i]}') with needle[${j}] ('${needle[j]}').`, 
                21, 
                { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchCompare', offset }
            );

            if (haystack[i] === needle[j]) {
                addStep(
                    "Search Match", 
                    `Line 21: haystack[i] == needle[j] is TRUE!\n\nCharacters match. We will advance both pointers.`, 
                    21, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchMatch', offset }
                );
                i++;
                j++;
                
                addStep(
                    "Advance Pointers", 
                    `Line 22: i++; j++;\n\ni becomes ${i}, j becomes ${j}.`, 
                    22, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchAdv', offset: i - j }
                );

                addStep(
                    "Check Full Match", 
                    `Line 23: if (j == n)\n\nHave we matched the entire needle? Is ${j} == ${n}? ${j === n ? 'YES!' : 'No.'}`, 
                    23, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchCheck', offset: i - j }
                );

                if (j === n) {
                    addStep(
                        "Target Found!", 
                        `Line 23: return i - n;\n\nWe successfully matched the entire needle! The match started at index ${i - n}.`, 
                        23, 
                        { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'success', offset: i - n, isSuccess: true, ans: i - n }
                    );
                    found = true;
                    break;
                }
            } else if (j === 0) {
                addStep(
                    "Mismatch at Needle Start", 
                    `Line 24: else if (j == 0)\n\nMismatch occurred at the very first character of the needle. We simply advance the haystack pointer 'i'.`, 
                    24, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchMismatchZero', offset }
                );
                i++;
                addStep(
                    "Advance Haystack Only", 
                    `Line 25: i++;\n\ni becomes ${i}.`, 
                    25, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchAdvI', offset: i - j }
                );
            } else {
                addStep(
                    "Mismatch Mid-Needle (KMP MAGIC)", 
                    `Line 26: else\n\nMismatch occurred at needle[${j}]. \nINSTEAD of moving 'i' backwards, we look at lps[${j-1}] to see if there is a prefix we can safely align with the suffix we just matched!`, 
                    26, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchMismatchMid', offset }
                );
                j = lps[j - 1];
                addStep(
                    "Slide Needle via LPS", 
                    `Line 27: j = lps[j - 1];\n\nj is updated to ${j}. The needle "slides" forward relative to the haystack, but 'i' (${i}) never moves backward!`, 
                    27, 
                    { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'searchShift', offset: i - j }
                );
            }
        }
        
        if (!found) {
            addStep(
                "Search Exhausted", 
                `Line 30: return -1;\n\nWe traversed the entire haystack and found no complete match.`, 
                30, 
                { m, n, lps: [...lps], searchI: i, searchJ: j, action: 'success', offset: 0, isSuccess: true, ans: -1 }
            );
        }
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
  const { isSuccess, ans, action, offset, m, n } = state;
  const { haystack, needle } = parsedData;

  // Extract variables safely based on approach
  let haystackI = null;
  let needleJ = null;
  let matchIdx = state.matchIdx;
  let mismatchIdx = state.mismatchIdx;

  if (selectedApproachId === 'bruteForce') {
      if (state.i !== undefined && state.j !== undefined && state.j !== null) {
          haystackI = state.i + state.j;
          needleJ = state.j;
      }
  } else {
      if (state.searchI !== undefined) {
          haystackI = state.searchI;
          needleJ = state.searchJ;
      }
  }

  // Pre-fill arrays for rendering
  const hArr = haystack.split('');
  const nArr = needle.split('');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">strStr() Search</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 28</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Sliding Window / KMP</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'mismatch' || action.includes('Fail') ? 'bg-rose-500/20 border-rose-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'mismatch' || action.includes('Fail') ? 'rose' : 'violet'} />
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
                    
                    {selectedApproachId === 'bruteForce' ? (
                        <div className="grid grid-cols-2 gap-3">
                            <VariableCard label="Start Idx (i)" val={state.i !== null ? state.i : "-"} color="purple" active={state.i !== null} />
                            <VariableCard label="Needle Ptr (j)" val={state.j !== null && state.j !== undefined ? state.j : "-"} color="sky" active={state.j !== null && state.j !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Haystack (i)" val={state.searchI !== undefined ? state.searchI : (state.lpsI !== undefined ? state.lpsI : "-")} color="sky" active={true} />
                            <VariableCard label="Needle (j)" val={state.searchJ !== undefined ? state.searchJ : "-"} color="purple" active={state.searchJ !== undefined} />
                            <VariableCard label="LPS Pointer" val={state.prevLPS !== undefined ? state.prevLPS : "-"} color="amber" active={state.prevLPS !== undefined} />
                            <VariableCard label="Offset" val={offset !== undefined ? offset : "-"} color="emerald" active={offset !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Haystack</label>
                        <input type="text" value={haystackInput} onChange={(e) => { setHaystackInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="sadbutsad" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Needle</label>
                        <input type="text" value={needleInput} onChange={(e) => { setNeedleInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="sad" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'mismatch' || action.includes('Fail') ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Search size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'mismatch' || action.includes('Fail') ? 'text-rose-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'mismatch' || action.includes('Fail') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px]">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-12 pb-8 overflow-y-auto">
                      
                      {/* LPS Table (KMP Only) */}
                      {selectedApproachId === 'kmp' && state.lps && (
                          <div className="mb-12 flex flex-col items-center">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono flex items-center gap-2 mb-2">LPS Array (Needle Prefix Tracking)</span>
                              <div className="flex gap-1 p-2 bg-slate-100 border border-slate-200 rounded-xl shadow-inner mx-auto">
                                  {state.lps.map((val, idx) => {
                                      let isCurrent = state.lpsI === idx;
                                      return (
                                          <div key={idx} className="flex flex-col items-center">
                                              <span className="text-[8px] text-slate-400 font-mono mb-1">{nArr[idx]}</span>
                                              <div className={`w-8 h-8 flex items-center justify-center rounded border font-mono font-bold text-sm transition-all duration-300 ${isCurrent ? 'bg-violet-100 border-violet-500 text-violet-900 scale-110 shadow-md ring-2 ring-violet-300/50 z-20' : 'bg-white border-slate-300 text-slate-700'}`}>
                                                  {val}
                                              </div>
                                              <span className="text-[8px] text-slate-400 font-mono mt-1">{idx}</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}

                      {/* Main Visualization Area */}
                      <div className="flex flex-col gap-6 items-start overflow-x-auto w-full max-w-full pb-10 px-4">
                          
                          {/* Haystack Row */}
                          <div className="flex gap-2 relative">
                              <div className="absolute -left-16 inset-y-0 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Hay</div>
                              
                              {hArr.map((char, idx) => {
                                  let isComparing = haystackI === idx && !isSuccess;
                                  let isMatchedSoFar = haystackI !== null && idx >= offset && idx < haystackI && !isSuccess;
                                  let isFinalMatch = isSuccess && ans !== -1 && idx >= ans && idx < ans + n;
                                  
                                  let isError = isComparing && (action === 'mismatch' || action === 'searchMismatchZero' || action === 'searchMismatchMid');

                                  let cls = "relative w-10 h-12 md:w-12 md:h-14 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl transition-all duration-300 z-10 ";
                                  
                                  if (isFinalMatch) {
                                      cls += "bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 shadow-lg ring-4 ring-emerald-300/50 z-30";
                                  } else if (isError) {
                                      cls += "bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg ring-4 ring-rose-300/50 z-30 animate-pulse";
                                  } else if (isComparing) {
                                      cls += "bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg ring-4 ring-sky-300/50 z-30";
                                  } else if (isMatchedSoFar) {
                                      cls += "bg-emerald-50 border-emerald-300 text-emerald-700";
                                  } else {
                                      cls += "bg-white border-slate-300 text-slate-700 shadow-sm";
                                  }

                                  return (
                                      <div key={`h-${idx}`} className="flex flex-col items-center relative shrink-0">
                                          {/* Top Pointer (i) */}
                                          <div className="absolute -top-10 flex flex-col items-center h-8 justify-end z-30">
                                              {isComparing && (
                                                  <div className={`flex flex-col items-center`}>
                                                      <span className="text-[10px] font-black font-mono bg-sky-100 text-sky-700 px-1 rounded border border-sky-300 tracking-widest shadow-sm">i</span>
                                                      <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          <div className={cls}>
                                              {char}
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-1">{idx}</div>
                                      </div>
                                  );
                              })}
                          </div>

                          {/* Divider */}
                          <div className="h-px w-full bg-slate-200 my-2 opacity-50 relative">
                              {offset !== undefined && offset !== null && !isSuccess && (
                                  <div 
                                      className="absolute top-0 bottom-0 bg-violet-200 transition-all duration-500"
                                      style={{ 
                                          // width calculation based on needle box size + gap: 48px width + 8px gap = 56px per char
                                          left: `${offset * 56}px`, 
                                          width: `${n * 56 - 8}px` 
                                      }}
                                  ></div>
                              )}
                          </div>

                          {/* Needle Row */}
                          <div 
                              className="flex gap-2 relative transition-all duration-500 ease-in-out"
                              style={{ transform: offset ? `translateX(${offset * 56}px)` : 'none' }} // 56 = box w-12 (48px) + gap-2 (8px)
                          >
                              <div className="absolute -left-20 inset-y-0 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Needle</div>
                              
                              {nArr.map((char, idx) => {
                                  let isComparing = needleJ === idx && !isSuccess;
                                  let isMatchedSoFar = needleJ !== null && idx < needleJ && !isSuccess;
                                  let isFinalMatch = isSuccess && ans !== -1;
                                  
                                  let isError = isComparing && (action === 'mismatch' || action === 'searchMismatchZero' || action === 'searchMismatchMid');

                                  let cls = "relative w-10 h-12 md:w-12 md:h-14 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl transition-all duration-300 z-10 ";
                                  
                                  if (isFinalMatch) {
                                      cls += "bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 shadow-lg ring-4 ring-emerald-300/50 z-30";
                                  } else if (isError) {
                                      cls += "bg-rose-100 border-rose-500 text-rose-800 scale-110 shadow-lg ring-4 ring-rose-300/50 z-30 animate-pulse";
                                  } else if (isComparing) {
                                      cls += "bg-purple-100 border-purple-500 text-purple-800 scale-110 shadow-lg ring-4 ring-purple-300/50 z-30";
                                  } else if (isMatchedSoFar) {
                                      cls += "bg-emerald-50 border-emerald-300 text-emerald-700";
                                  } else {
                                      cls += "bg-white border-slate-300 text-slate-700 shadow-sm";
                                  }

                                  return (
                                      <div key={`n-${idx}`} className="flex flex-col items-center relative shrink-0">
                                          <div className={cls}>
                                              {char}
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-1">{idx}</div>

                                          {/* Bottom Pointer (j) */}
                                          <div className="absolute -bottom-10 flex flex-col items-center h-8 justify-start z-30">
                                              {isComparing && (
                                                  <div className={`flex flex-col items-center`}>
                                                      <ArrowUp size={14} className="text-purple-500" strokeWidth={3}/>
                                                      <span className="text-[10px] font-black font-mono bg-purple-100 text-purple-700 px-1 rounded border border-purple-300 tracking-widest shadow-sm">j</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans !== -1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {ans !== -1 ? <Check size={32} strokeWidth={3}/> : <AlertCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${ans !== -1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {ans !== -1 ? `Found needle starting at index ${ans}` : `Needle not found in haystack`}
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
                <Search className="text-violet-600"/> String Search Algorithms
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Finding a substring inside another string is a foundational problem in computer science. While built-in functions like <code>indexOf()</code> handle this for us daily, understanding the underlying algorithms reveals powerful techniques for string manipulation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> The Brute Force Problem
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            The naive approach is perfectly fine for small strings. You anchor a window and check character by character.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            <strong>The Inefficiency:</strong> If you are matching a long string like "AAAAAB" against a haystack "AAAAAAAAAB", the brute force approach will match 5 'A's, fail on the 'B', and then shift the window forward by exactly 1 character and start checking all over again. It does redundant comparisons.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Zap size={18}/> KMP: The Smart Shift
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Knuth-Morris-Pratt (KMP) solves the redundancy. When a mismatch occurs, KMP looks at the characters it <em>already</em> successfully matched.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>It uses an <strong>LPS array</strong> (Longest Prefix Suffix).</p>
                            <p>If we successfully matched "ABCA" and failed on the 5th character, the LPS array tells us if any prefix of "ABCA" matches a suffix of "ABCA". (Here, "A" matches "A").</p>
                            <p>KMP uses this info to "slide" the needle forward to align that matching prefix, skipping impossible starting positions entirely!</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Hash size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Visualizing the LPS Array</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <code>needle = "A B A B C"</code>
                            <br/><br/>
                            LPS tracks the length of the longest proper prefix that is also a suffix for the substring up to that point.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300 space-y-1">
                            <div>Index 0: "A" -&gt; 0 (no proper prefix)</div>
                            <div>Index 1: "AB" -&gt; 0</div>
                            <div>Index 2: "ABA" -&gt; 1 (prefix "A", suffix "A")</div>
                            <div>Index 3: "ABAB" -&gt; 2 (prefix "AB", suffix "AB")</div>
                            <div>Index 4: "ABABC" -&gt; 0</div>
                            <div className="pt-2 text-amber-300">LPS = [0, 0, 1, 2, 0]</div>
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
                        "For a production environment, I would simply use the built-in `haystack.indexOf(needle)` as it is highly optimized under the hood. However, to implement it manually, the Brute Force Sliding Window approach is the easiest to implement cleanly, taking $O(N \times M)$ time. If the strings are extremely large and we need strict linearity, I would implement the Knuth-Morris-Pratt (KMP) algorithm. KMP preprocesses the needle in $O(M)$ time to build an LPS (Longest Prefix Suffix) array. During the search phase, this array dictates how far we can safely 'slide' the needle whenever a mismatch occurs, ensuring the haystack pointer never moves backwards, guaranteeing an optimal $O(N + M)$ time complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Which algorithm is expected?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                Because this is a LeetCode Easy, the standard sliding window approach is completely acceptable and will pass all test cases. Implementing full KMP perfectly from scratch without bugs is notoriously difficult under interview pressure. It is best to write the brute force solution first, and then explicitly mention KMP and its theoretical $O(N+M)$ benefits to show advanced knowledge.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Brute: O(N×M) | KMP: O(N+M)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Brute force checks $M$ characters for $N-M+1$ starting positions. KMP processes the needle ($M$) and then the haystack ($N$) linearly without backing up.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Brute: O(1) | KMP: O(M)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Brute force only uses two pointers. KMP requires allocating an integer array of size $M$ to store the LPS table.</p>
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

interface VariableCardProps {
  label: string;
  val: any;
  color: string;
  active: boolean;
}

const VariableCard: React.FC<VariableCardProps> = ({ label, val, color, active }) => {
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

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|haystack|needle|charAt|length|lps|prevLPS)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['haystack'].includes(part)) return <span key={i} className="text-sky-300 font-bold">{part}</span>;
          if (['needle'].includes(part)) return <span key={i} className="text-purple-300 font-bold">{part}</span>;
          if (['charAt', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['lps', 'prevLPS'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default StrStrVisualizer;