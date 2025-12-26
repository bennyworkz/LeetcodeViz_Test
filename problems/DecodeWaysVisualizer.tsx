import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, LayoutList, Fingerprint, DivideSquare, ShieldAlert, ArrowRight
} from 'lucide-react';

const APPROACHES = {
  dpArray: {
    id: 'dpArray',
    title: '1D Dynamic Programming',
    subtitle: 'Classic: O(N) Time, O(N) Space.',
    icon: <LayoutList size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int numDecodings(String s) {
        // A string starting with '0' cannot be decoded
        if (s == null || s.length() == 0 || s.charAt(0) == '0') {
            return 0;
        }
        
        int n = s.length();
        int[] dp = new int[n + 1];
        
        // Base cases
        dp[0] = 1; // Empty string has 1 way to be decoded
        dp[1] = 1; // First char is valid (checked above)
        
        for (int i = 2; i <= n; i++) {
            // Check 1-digit mapping
            int oneDigit = s.charAt(i - 1) - '0';
            if (oneDigit >= 1) {
                dp[i] += dp[i - 1];
            }
            
            // Check 2-digit mapping
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));
            if (twoDigits >= 10 && twoDigits <= 26) {
                dp[i] += dp[i - 2];
            }
        }
        
        return dp[n];
    }
}`,
    explanation: "This approach uses 1D Dynamic Programming. We use an array `dp` of size `n + 1`, where `dp[i]` represents the number of ways to decode the prefix of the string of length `i`. We initialize `dp[0] = 1` (an empty string is fully \"decoded\") and `dp[1] = 1` (assuming the first character isn't '0'). For each subsequent character at index `i`, we check two possibilities. First, can the single character at `i-1` be decoded on its own? (i.e., is it between 1 and 9). If yes, we carry over the possibilities from `dp[i-1]`. Second, can the two characters ending at `i-1` be decoded as a pair? (i.e., is the number between 10 and 26). If yes, we ALSO add the possibilities from `dp[i-2]`. The final answer is stored in `dp[n]`."
  },
  spaceOptimized: {
    id: 'spaceOptimized',
    title: 'Space-Optimized DP',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int numDecodings(String s) {
        if (s == null || s.length() == 0 || s.charAt(0) == '0') {
            return 0;
        }
        
        int n = s.length();
        
        // Instead of an array, keep track of only the last two states
        int prev2 = 1; // Corresponds to dp[i-2]
        int prev1 = 1; // Corresponds to dp[i-1]
        
        for (int i = 2; i <= n; i++) {
            int curr = 0;
            int oneDigit = s.charAt(i - 1) - '0';
            int twoDigits = Integer.parseInt(s.substring(i - 2, i));
            
            if (oneDigit >= 1) {
                curr += prev1;
            }
            
            if (twoDigits >= 10 && twoDigits <= 26) {
                curr += prev2;
            }
            
            // Slide the window forward for the next iteration
            prev2 = prev1;
            prev1 = curr;
        }
        
        return prev1;
    }
}`,
    explanation: "Notice that to compute `dp[i]`, we only ever need `dp[i-1]` and `dp[i-2]`. The rest of the array is never looked at again! We can eliminate the $O(N)$ space requirement by replacing the array with just two integer variables, `prev1` and `prev2`. We calculate the `curr` possibilities using the same logic (checking 1-digit and 2-digit validity). Once `curr` is calculated, we slide our variables forward: `prev2` becomes `prev1`, and `prev1` becomes `curr`. This reduces our space complexity to a strictly constant $O(1)$ while maintaining $O(N)$ execution time."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">91. Decode Ways</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          A message containing letters from <code>A-Z</code> can be <strong>encoded</strong> into numbers using the following mapping:
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-max shadow-sm font-mono text-sm grid grid-cols-6 gap-x-6 gap-y-2">
            <div>'A' -&gt; "1"</div><div>'B' -&gt; "2"</div><div>...</div>
            <div>'Z' -&gt; "26"</div>
        </div>

        <p className="text-lg leading-relaxed">
          To <strong>decode</strong> an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways). For example, <code>"11106"</code> can be mapped into:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-800 marker:text-violet-500 font-medium">
            <li><code>"AAJF"</code> with the grouping <code>(1 1 10 6)</code></li>
            <li><code>"KJF"</code> with the grouping <code>(11 10 6)</code></li>
        </ul>

        <p className="text-sm leading-relaxed text-rose-600 font-bold bg-rose-50 p-3 rounded-lg border border-rose-200">
          Note that the grouping <code>(1 11 06)</code> is invalid because <code>"06"</code> cannot be mapped into <code>'F'</code> since <code>"6"</code> is different from <code>"06"</code>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          Given a string <code>s</code> containing only digits, return the <strong>number of ways</strong> to <strong>decode</strong> it.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "12"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "12" could be decoded as "AB" (1 2) or "L" (12).</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "226"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 3</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "226" could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "06"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 0</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: "06" cannot be mapped to "F" because of the leading zero ("6" is different from "06").</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 100</code></li>
              <li><code>s</code> contains only digits and may contain leading zero(s).</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const DecodeWaysVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('dpArray');
  const [sInput, setSInput] = useState('226');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.replace(/[^0-9]/g, '');
    if (!s) s = "226";
    if (s.length > 15) s = s.substring(0, 15); // UI safety cap
    return { s };
  }, [sInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s } = parsedData;
    const n = s.length;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    addStep(
        "Evaluate Edge Cases", 
        `Line 3-5: if (s == null || s.length() == 0 || s.charAt(0) == '0')\n\nWe immediately check if the string starts with a '0'. Since no valid mapping begins with '0', the entire string becomes impossible to decode.`, 
        3, 
        { action: 'evalEdge', s, i: null, dp: null, oneDigit: null, twoDigits: null }
    );

    if (s.charAt(0) === '0') {
        addStep(
            "Return Base Case (Invalid)", 
            `Line 4: return 0;\n\nThe string starts with '0'. It cannot be decoded. Returning 0.`, 
            4, 
            { action: 'success', isSuccess: true, ans: 0, s, i: null, dp: null }
        );
        return steps;
    }

    if (selectedApproachId === 'dpArray') {
        
        let dp = Array(n + 1).fill(0);
        
        addStep(
            "Initialization", 
            `Line 7-8: int n = ${n};\nint[] dp = new int[${n + 1}];\n\nCreate a DP array of size n + 1. dp[i] will store the number of ways to decode the substring s[0...i-1].`, 
            8, 
            { action: 'init', s, dp: [...dp], i: null, oneDigit: null, twoDigits: null }
        );

        dp[0] = 1;
        dp[1] = 1;

        addStep(
            "Base Cases", 
            `Line 11-12: dp[0] = 1; dp[1] = 1;\n\nAn empty string technically has 1 way to be \"decoded\" (doing nothing). Since we checked that s[0] != '0', the string up to index 1 has exactly 1 valid decoding.`, 
            12, 
            { action: 'baseCases', s, dp: [...dp], i: null, oneDigit: null, twoDigits: null }
        );

        for (let i = 2; i <= n; i++) {
            
            addStep(
                "Iterate DP Array", 
                `Line 14: for (int i = ${i}; i <= ${n}; i++)\n\nWe are looking at the character '${s.charAt(i-1)}' (which is the ${i}-th character in the string).`, 
                14, 
                { action: 'loopStart', s, dp: [...dp], i, oneDigit: null, twoDigits: null }
            );

            let oneDigit = parseInt(s.substring(i - 1, i));
            
            addStep(
                "Evaluate 1-Digit Mapping", 
                `Line 16: int oneDigit = s.charAt(${i - 1}) - '0';\n\nThe single digit at this position is ${oneDigit}. Is it valid? (between 1 and 9).`, 
                16, 
                { action: 'evalOne', s, dp: [...dp], i, oneDigit, twoDigits: null }
            );

            if (oneDigit >= 1) {
                dp[i] += dp[i - 1];
                addStep(
                    "Apply 1-Digit Mapping", 
                    `Line 17-18: if (oneDigit >= 1) dp[i] += dp[i - 1];\n\nValid! We can treat '${oneDigit}' as a standalone character. We carry over all the possibilities we had BEFORE this character: dp[${i}] += dp[${i - 1}] (${dp[i-1]}).`, 
                    18, 
                    { action: 'addOne', s, dp: [...dp], i, oneDigit, twoDigits: null }
                );
            } else {
                 addStep(
                    "Invalid 1-Digit Mapping", 
                    `Line 17: if (oneDigit >= 1) is FALSE.\n\nThe digit is '0'. '0' alone does not map to any letter. We add nothing to dp[${i}].`, 
                    17, 
                    { action: 'skipOne', s, dp: [...dp], i, oneDigit, twoDigits: null }
                );
            }

            let twoDigits = parseInt(s.substring(i - 2, i));

            addStep(
                "Evaluate 2-Digit Mapping", 
                `Line 21: int twoDigits = Integer.parseInt(s.substring(${i - 2}, ${i}));\n\nLooking at the two-character block ending here: "${twoDigits}". Is it between 10 and 26?`, 
                21, 
                { action: 'evalTwo', s, dp: [...dp], i, oneDigit, twoDigits }
            );

            if (twoDigits >= 10 && twoDigits <= 26) {
                dp[i] += dp[i - 2];
                addStep(
                    "Apply 2-Digit Mapping", 
                    `Line 22-23: if (twoDigits >= 10 && twoDigits <= 26) dp[i] += dp[i - 2];\n\nValid! "${twoDigits}" maps to a letter (J-Z). We can group them together. We add all possibilities from BEFORE this pair: dp[${i}] += dp[${i - 2}] (${dp[i-2]}).`, 
                    23, 
                    { action: 'addTwo', s, dp: [...dp], i, oneDigit, twoDigits }
                );
            } else {
                 let reason = twoDigits < 10 ? "It has a leading zero (e.g. '06'), which is invalid." : "It is greater than 26, and there is no 27th letter in the alphabet.";
                 addStep(
                    "Invalid 2-Digit Mapping", 
                    `Line 22: if (twoDigits >= 10 && twoDigits <= 26) is FALSE.\n\n"${s.substring(i - 2, i)}" is not a valid letter code. ${reason}`, 
                    22, 
                    { action: 'skipTwo', s, dp: [...dp], i, oneDigit, twoDigits }
                );
            }
        }

        addStep(
            "Return DP Result", 
            `Line 27: return dp[${n}];\n\nWe have evaluated the entire string. The final index dp[${n}] contains the total number of ways to decode the string.`, 
            27, 
            { action: 'success', s, dp: [...dp], i: n, isSuccess: true, ans: dp[n] }
        );

    } else if (selectedApproachId === 'spaceOptimized') {
        
        let prev2 = 1;
        let prev1 = 1;

        addStep(
            "Initialization", 
            `Line 8-10: int prev2 = 1; int prev1 = 1;\n\nInstead of a full array, we only need to remember the last two states (equivalent to dp[0] and dp[1]).`, 
            10, 
            { action: 'init', s, prev2, prev1, curr: 0, i: null, oneDigit: null, twoDigits: null }
        );

        for (let i = 2; i <= n; i++) {
            let curr = 0;

            addStep(
                "Iterate String", 
                `Line 12: for (int i = ${i}; i <= ${n}; i++)\n\nWe are looking at the character '${s.charAt(i-1)}' (which is the ${i}-th character in the string). Initialize 'curr' possibilities to 0.`, 
                12, 
                { action: 'loopStart', s, prev2, prev1, curr, i, oneDigit: null, twoDigits: null }
            );

            let oneDigit = parseInt(s.substring(i - 1, i));
            
            addStep(
                "Evaluate 1-Digit Mapping", 
                `Line 16: if (oneDigit >= 1)\n\nThe single digit is ${oneDigit}. Is it valid?`, 
                16, 
                { action: 'evalOne', s, prev2, prev1, curr, i, oneDigit, twoDigits: null }
            );

            if (oneDigit >= 1) {
                curr += prev1;
                addStep(
                    "Apply 1-Digit Mapping", 
                    `Line 17: curr += prev1;\n\nValid! We add 'prev1' (${prev1}) to 'curr'. curr = ${curr}.`, 
                    17, 
                    { action: 'addOne', s, prev2, prev1, curr, i, oneDigit, twoDigits: null }
                );
            }

            let twoDigits = parseInt(s.substring(i - 2, i));

            addStep(
                "Evaluate 2-Digit Mapping", 
                `Line 20: if (twoDigits >= 10 && twoDigits <= 26)\n\nThe two-digit pair is "${twoDigits}". Is it valid?`, 
                20, 
                { action: 'evalTwo', s, prev2, prev1, curr, i, oneDigit, twoDigits }
            );

            if (twoDigits >= 10 && twoDigits <= 26) {
                curr += prev2;
                addStep(
                    "Apply 2-Digit Mapping", 
                    `Line 21: curr += prev2;\n\nValid! We add 'prev2' (${prev2}) to 'curr'. curr = ${curr}.`, 
                    21, 
                    { action: 'addTwo', s, prev2, prev1, curr, i, oneDigit, twoDigits }
                );
            }

            addStep(
                "Slide Window Forward", 
                `Line 25-26: prev2 = prev1; prev1 = curr;\n\nWe finish this step. We slide our variables forward so they represent the new 'previous two' states for the next loop.`, 
                26, 
                { action: 'slide', s, prev2: prev1, prev1: curr, curr, i, oneDigit, twoDigits }
            );
            
            prev2 = prev1;
            prev1 = curr;
        }

        addStep(
            "Return Result", 
            `Line 29: return prev1;\n\nWe have evaluated the entire string. 'prev1' contains the final answer.`, 
            29, 
            { action: 'success', s, prev2, prev1, curr: 0, i: n, isSuccess: true, ans: prev1 }
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
  const { isSuccess, ans, action, s, dp, i: currI, oneDigit, twoDigits, prev1, prev2, curr: optCurr } = state;
  const n = s ? s.length : 0;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Fingerprint className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Decode Ways</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 91</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action.includes('skip') || action === 'evalEdge' ? 'bg-rose-500/20 border-rose-500' : (action.includes('add') ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action.includes('skip') || action === 'evalEdge' ? 'rose' : (action.includes('add') ? 'emerald' : 'violet')} />
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
                    
                    {selectedApproachId === 'dpArray' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Index (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="sky" active={currI !== null && currI !== undefined} />
                            <VariableCard label="1-Digit Eval" val={oneDigit !== null && oneDigit !== undefined ? oneDigit : "-"} color="purple" active={oneDigit !== null && oneDigit !== undefined} />
                            <VariableCard label="2-Digit Eval" val={twoDigits !== null && twoDigits !== undefined ? twoDigits : "-"} color="amber" active={twoDigits !== null && twoDigits !== undefined} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="curr" val={optCurr !== null && optCurr !== undefined ? optCurr : "-"} color="emerald" active={optCurr !== null && optCurr !== undefined} />
                            <VariableCard label="prev1" val={prev1 !== null && prev1 !== undefined ? prev1 : "-"} color="sky" active={prev1 !== null && prev1 !== undefined} />
                            <VariableCard label="prev2" val={prev2 !== null && prev2 !== undefined ? prev2 : "-"} color="purple" active={prev2 !== null && prev2 !== undefined} />
                            <VariableCard label="Index (i)" val={currI !== null && currI !== undefined ? currI : "-"} color="slate" active={currI !== null && currI !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Encoded String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="226" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action.includes('skip') || action === 'evalEdge' ? 'bg-rose-900 border-rose-800' : (action.includes('add') ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Fingerprint size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action.includes('skip') || action === 'evalEdge' ? 'text-rose-400' : (action.includes('add') ? 'text-emerald-400' : 'text-violet-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action.includes('skip') || action === 'evalEdge' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : (action.includes('add') ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'))}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-center">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-10 overflow-x-auto">
                      
                      {/* String Header */}
                      <div className="flex flex-col items-center w-full max-w-full">
                          
                          <div className="flex gap-2 p-4 bg-slate-50 border-b border-slate-200 min-w-max mx-auto overflow-x-auto items-end pb-8">
                              {/* Empty DP prefix marker */}
                              <div className="flex flex-col items-center relative group opacity-50 mr-4">
                                  <div className="relative w-12 h-12 flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-100 font-mono font-black text-sm text-slate-400">
                                      ""
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono mt-2">dp[0]</div>
                              </div>

                              {s && s.split('').map((char, idx) => {
                                  // String is 0-indexed, DP is 1-indexed. So string idx aligns with dp idx+1.
                                  let dpIdx = idx + 1;
                                  
                                  let isEvaluatingOne = action.includes('One') && currI === dpIdx;
                                  let isEvaluatingTwo = action.includes('Two') && (currI === dpIdx || currI - 1 === dpIdx);
                                  
                                  let isEvaluatedTarget = currI === dpIdx && !isSuccess;

                                  let boxClass = "relative w-12 h-14 md:w-14 md:h-16 flex items-center justify-center rounded-xl border-2 font-mono font-black text-xl md:text-2xl transition-all duration-300 shrink-0 ";
                                  let textClass = "text-slate-700";

                                  if (isEvaluatedTarget) {
                                      boxClass += "bg-sky-100 border-sky-400 shadow-md ring-4 ring-sky-300/30 scale-105 z-20";
                                      textClass = "text-sky-900";
                                  } else if (isEvaluatingTwo && currI - 1 === dpIdx) {
                                      boxClass += "bg-purple-100 border-purple-400 shadow-sm z-10";
                                      textClass = "text-purple-800";
                                  } else {
                                      boxClass += "bg-white border-slate-300 shadow-sm";
                                  }

                                  if (char === '0' && isEvaluatedTarget && action.includes('skip')) {
                                      boxClass += " border-rose-500 bg-rose-100 ring-rose-300/30";
                                      textClass = "text-rose-900";
                                  }

                                  return (
                                      <div key={idx} className="flex flex-col items-center relative group">
                                          {/* Pointer Indicator */}
                                          <div className="absolute -top-8 flex flex-col items-center justify-end h-6 w-full z-30">
                                              {isEvaluatedTarget && (
                                                  <div className={`flex flex-col items-center animate-in slide-in-from-top-2`}>
                                                      <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1 rounded shadow-sm border border-sky-200">s[i-1]</span>
                                                  </div>
                                              )}
                                          </div>

                                          <div className={boxClass}>
                                              <span className={textClass}>{char}</span>
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-2 font-bold flex flex-col items-center gap-1">
                                              <span>dp[{dpIdx}]</span>
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>

                          {/* 1D DP Array View */}
                          {selectedApproachId === 'dpArray' && dp && (
                              <div className="flex gap-2 p-4 min-w-max mx-auto overflow-x-auto relative -mt-4">
                                  {dp.map((val, idx) => {
                                      
                                      let isCurrentDP = currI === idx && !isSuccess;
                                      let isDPMinus1 = action.includes('One') && currI - 1 === idx;
                                      let isDPMinus2 = action.includes('Two') && currI - 2 === idx;
                                      let isFinalAns = isSuccess && idx === n;

                                      let boxClass = "relative w-12 h-10 md:w-14 md:h-12 flex items-center justify-center rounded-lg border-2 font-mono font-black text-base md:text-lg transition-all duration-500 shrink-0 ";
                                      
                                      if (isFinalAns) {
                                          boxClass += "bg-emerald-500 border-emerald-600 text-white shadow-xl scale-110 z-30 ring-4 ring-emerald-200";
                                      } else if (isCurrentDP) {
                                          if (action === 'addOne' || action === 'addTwo') boxClass += "bg-emerald-100 border-emerald-400 text-emerald-800 scale-110 shadow-lg ring-4 ring-emerald-300/30 z-20";
                                          else boxClass += "bg-sky-50 border-sky-400 text-sky-900 shadow-md z-10";
                                      } else if (isDPMinus1) {
                                          if (action === 'addOne') boxClass += "bg-sky-100 border-sky-500 text-sky-900 shadow-md ring-2 ring-sky-300 z-10";
                                          else boxClass += "bg-slate-100 border-slate-300 text-slate-500";
                                      } else if (isDPMinus2) {
                                          if (action === 'addTwo') boxClass += "bg-purple-100 border-purple-500 text-purple-900 shadow-md ring-2 ring-purple-300 z-10";
                                          else boxClass += "bg-slate-100 border-slate-300 text-slate-500";
                                      } else {
                                          boxClass += "bg-slate-50 border-slate-200 text-slate-400";
                                      }

                                      // First element is DP[0] margin fix to align with dummy string
                                      let extraMargin = idx === 0 ? "mr-4" : "";

                                      return (
                                          <div key={`dp-${idx}`} className={`flex flex-col items-center relative ${extraMargin}`}>
                                              <div className={boxClass}>
                                                  {val}
                                                  
                                                  {isDPMinus1 && action === 'addOne' && <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 text-sky-500 z-50" size={16} strokeWidth={4} />}
                                                  {isDPMinus2 && action === 'addTwo' && <ArrowRight className="absolute -right-12 top-0 -translate-y-full text-purple-500 z-50 transform rotate-12" size={16} strokeWidth={4} />}
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>
                          )}

                          {/* Space Optimized Variable View */}
                          {selectedApproachId === 'spaceOptimized' && prev1 !== undefined && (
                              <div className="flex gap-6 p-4 min-w-max mx-auto overflow-x-auto relative mt-4 items-center justify-center w-full">
                                  
                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] uppercase tracking-widest font-black text-purple-400 mb-1">prev2</span>
                                      <div className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black font-mono transition-all duration-500 ${action === 'addTwo' ? 'bg-purple-100 border-purple-500 text-purple-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                          {prev2}
                                      </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] uppercase tracking-widest font-black text-sky-400 mb-1">prev1</span>
                                      <div className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black font-mono transition-all duration-500 ${action === 'addOne' ? 'bg-sky-100 border-sky-500 text-sky-800 scale-110 shadow-lg' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                                          {prev1}
                                      </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                      <span className="text-[10px] uppercase tracking-widest font-black text-emerald-500 mb-1">curr</span>
                                      <div className={`w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-2xl font-black font-mono transition-all duration-500 ${action.includes('add') ? 'bg-emerald-100 border-emerald-500 text-emerald-800 scale-110 shadow-lg ring-4 ring-emerald-300/30' : 'bg-white border-slate-300 text-slate-800 shadow-sm'}`}>
                                          {optCurr}
                                      </div>
                                  </div>

                              </div>
                          )}

                      </div>

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${ans === 0 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {ans === 0 ? <AlertCircle size={32} strokeWidth={3}/> : <Check size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">{ans === 0 ? 'INVALID DECODING' : 'DECODING COMPLETE'}</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${ans === 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                  Found {ans} Ways
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
                <LayoutList className="text-violet-600"/> Overlapping Subproblems
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                Decoding a string relies heavily on the answers to slightly smaller versions of the same string. To know how many ways we can decode "226", we need to know how many ways we can decode "22" (and append '6') AND how many ways we can decode "2" (and append '26'). This perfectly fits the Dynamic Programming pattern.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Fingerprint size={18}/> 1-Digit vs 2-Digit Check
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            At any given character, we have exactly two choices we can attempt to make:
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p><strong>1. Single Digit:</strong> If the character is between '1' and '9', it maps to A-I. We inherit all combinations from exactly 1 step back: <code>dp[i] += dp[i-1]</code>.</p>
                            <p><strong>2. Double Digit:</strong> If the character and the one before it form a number between 10 and 26, it maps to J-Z. We inherit all combinations from exactly 2 steps back: <code>dp[i] += dp[i-2]</code>.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ShieldAlert size={18}/> The Zero Trap
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            The character '0' has no mapping. It is the string-killer.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>If the string starts with '0' (e.g., "06"), it's instantly invalid. Return 0.</p>
                            <p>If a '0' appears in the middle (e.g., "30"), the single digit check fails. Then the double digit check evaluates "30". Since "30" &gt; 26, the double digit check also fails. `dp[i]` remains 0. The chain is broken!</p>
                            <p>If the string is "20", single check fails, but double check ("20" &lt;= 26) passes! It is safely grouped as 'T'.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Zap size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">Space Optimization Magic</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Just like the Fibonacci sequence, to compute <code>dp[i]</code>, we only ever look at <code>dp[i-1]</code> and <code>dp[i-2]</code>. The rest of the huge array is literally abandoned memory.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-emerald-300 space-y-2">
                            <p className="text-white">// Instead of an array, use variables:</p>
                            <p>int prev2 = 1; // Represents dp[i-2]</p>
                            <p>int prev1 = 1; // Represents dp[i-1]</p>
                            <br/>
                            <p className="text-white">// Compute current step:</p>
                            <p>int curr = checkOne() ? prev1 : 0;</p>
                            <p>curr += checkTwo() ? prev2 : 0;</p>
                            <br/>
                            <p className="text-white">// Shift the window forward:</p>
                            <p>prev2 = prev1;</p>
                            <p>prev1 = curr;</p>
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
                        "I solved this problem using Dynamic Programming. The logic mirrors the Fibonacci sequence, where the number of ways to decode a string up to index `i` relies on the solutions to `i-1` and `i-2`. At each character, I check two constraints: if the single character is valid (`1-9`), I carry over the combinations from `dp[i-1]`. If the two-character suffix is valid (`10-26`), I add the combinations from `dp[i-2]`. While a standard 1D `dp` array requires $O(N)$ Space, I optimized this to strict $O(1)$ Space. Since we only ever need the immediately preceding two states, I replaced the array with two integer variables (`prev1` and `prev2`) and continuously slide them forward after computing the current state. This achieves an optimal $O(N)$ Time and $O(1)$ Space complexity."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: What about Recursive DFS?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                You can definitely solve this using a recursive Depth-First Search with Memoization (Top-Down DP). The logic is identical: at each step, try branching 1 digit and 2 digits. However, recursion incurs overhead due to the call stack and uses $O(N)$ space. The iterative Bottom-Up approach is preferred because it's slightly faster and allows for the $O(1)$ space optimization trick.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We loop through the string of length N exactly once. At each step, we perform constant time $O(1)$ checks (array lookups, parsing small 2-char substrings).</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Array: O(N) | Optimized: O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The standard array approach creates a table of size N+1. The optimized approach just uses 3 primitive integers (`prev1`, `prev2`, `curr`), requiring constant space regardless of input size.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|numDecodings|charAt|length|parseInt|substring|dp|oneDigit|twoDigits|prev1|prev2|curr)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['numDecodings', 'length', 'charAt', 'parseInt', 'substring'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['dp', 'prev1', 'prev2'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['curr'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['oneDigit', 'twoDigits'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default DecodeWaysVisualizer;