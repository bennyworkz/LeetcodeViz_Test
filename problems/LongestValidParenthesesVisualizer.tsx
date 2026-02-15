import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Search, Split, Crosshair, 
  ListOrdered, Brackets, Maximize2, RefreshCw, ArrowLeftRight
} from 'lucide-react';

const APPROACHES = {
  stackMethod: {
    id: 'stackMethod',
    title: '1. Index Stack',
    subtitle: 'Classic: O(N) Time, O(N) Space.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `class Solution {
    public int longestValidParentheses(String s) {
        int maxLen = 0;
        Stack<Integer> stack = new Stack<>();
        stack.push(-1); // Base boundary for valid substrings
        
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);
            } else {
                stack.pop();
                
                if (stack.isEmpty()) {
                    stack.push(i); // Update base boundary
                } else {
                    maxLen = Math.max(maxLen, i - stack.peek());
                }
            }
        }
        
        return maxLen;
    }
}`,
    explanation: "This approach uses a stack to keep track of the INDICES of the characters, not the characters themselves. We start by pushing `-1` to the stack to act as a base boundary for valid substrings. Whenever we see an open parenthesis '(', we push its index. When we see a closed parenthesis ')', we immediately pop from the stack. If the stack becomes empty, it means this ')' is unmatched and breaks our valid chain, so we push its index to serve as the new base boundary. If the stack is NOT empty, we've found a valid pair! The length of the current valid substring is simply the current index `i` minus the index at the top of the stack (`stack.peek()`). We keep updating `maxLen`."
  },
  twoCounters: {
    id: 'twoCounters',
    title: '2. Two Counters (L/R Scan)',
    subtitle: 'Optimal: O(N) Time, O(1) Space.',
    icon: <ArrowLeftRight size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `class Solution {
    public int longestValidParentheses(String s) {
        int left = 0, right = 0, maxLen = 0;
        
        // Scan from Left to Right
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') left++;
            else right++;
            
            if (left == right) {
                maxLen = Math.max(maxLen, 2 * right);
            } else if (right > left) {
                left = right = 0; // Reset counters
            }
        }
        
        left = right = 0; // Reset for second pass
        
        // Scan from Right to Left
        for (int i = s.length() - 1; i >= 0; i--) {
            if (s.charAt(i) == '(') left++;
            else right++;
            
            if (left == right) {
                maxLen = Math.max(maxLen, 2 * left);
            } else if (left > right) {
                left = right = 0; // Reset counters
            }
        }
        
        return maxLen;
    }
}`,
    explanation: "This brilliant approach achieves O(1) space by doing two passes. We maintain two counters: `left` (for '(') and `right` (for ')'). On the Left-to-Right scan, we increment the respective counters. Whenever `left == right`, we've found a perfectly valid substring! We update `maxLen`. If `right > left`, we have too many closing brackets, the chain is irreparably broken, so we reset both counters to 0. However, this left-to-right scan fails if there are too many open brackets (e.g., `(()`). To solve this, we simply reset the counters and do a Right-to-Left scan! This time, if `left > right`, the chain is broken and we reset."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">32. Longest Valid Parentheses</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given a string containing just the characters <code>'('</code> and <code>')'</code>, return <em>the length of the longest valid (well-formed) parentheses substring</em>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "(()"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 2</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The longest valid parentheses substring is "()".</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = ")()())"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 4</p>
              <div className="text-slate-500 italic mt-2 text-xs font-sans">
                 <p>Explanation: The longest valid parentheses substring is "()()".</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = ""</p>
              <p><span className="text-slate-400 font-bold">Output:</span> 0</p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>0 &lt;= s.length &lt;= 3 * 10<sup>4</sup></code></li>
              <li><code>s[i]</code> is <code>'('</code>, or <code>')'</code>.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const LongestValidParenthesesVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('stackMethod');
  const [sInput, setSInput] = useState(')()())');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    // Only allow '(' and ')'
    let s = sInput.replace(/[^()]/g, '');
    if (!s && sInput.length > 0) s = ")()())"; // fallback if they type invalid chars
    
    // UI Safeguards to fit on screen
    if (s.length > 16) s = s.slice(0, 16);

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

    if (selectedApproachId === 'stackMethod') {
        let maxLen = 0;
        let stack = [];

        addStep(
            "Initialization", 
            `Line 3-4: int maxLen = 0;\nStack<Integer> stack = new Stack<>();\n\nInitialize maxLen tracker and the integer stack.`, 
            4, 
            { maxLen, stack: [...stack], i: null, action: 'init' }
        );

        stack.push(-1);
        addStep(
            "Push Base Boundary", 
            `Line 5: stack.push(-1);\n\nWe push -1 onto the stack. This acts as an anchor or \"base boundary\" to help calculate the length of valid substrings seamlessly.`, 
            5, 
            { maxLen, stack: [...stack], i: null, action: 'pushBoundary' }
        );

        let iter = 0;
        for (let i = 0; i < n; i++) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate Loop", 
                `Line 7: for (int i = ${i}; i < ${n}; i++)\n\nProcessing character at index ${i}: '${s[i]}'.`, 
                7, 
                { maxLen, stack: [...stack], i, action: 'loop' }
            );

            if (s[i] === '(') {
                addStep(
                    "Open Parenthesis Found", 
                    `Line 8: if (s.charAt(${i}) == '(')\n\nIt's an open bracket. We push its index onto the stack so we can match it later.`, 
                    8, 
                    { maxLen, stack: [...stack], i, action: 'checkOpen' }
                );
                stack.push(i);
                addStep(
                    "Push Index", 
                    `Line 9: stack.push(${i});\n\nIndex ${i} is pushed onto the stack.`, 
                    9, 
                    { maxLen, stack: [...stack], i, action: 'pushOpen' }
                );
            } else {
                addStep(
                    "Close Parenthesis Found", 
                    `Line 10: else\n\nIt's a close bracket ')'. The first thing we do is pop the stack to attempt a match.`, 
                    10, 
                    { maxLen, stack: [...stack], i, action: 'checkClose' }
                );
                
                stack.pop();
                
                addStep(
                    "Pop Stack", 
                    `Line 11: stack.pop();\n\nWe pop the top element. Now we check if the stack is empty to see if this was a valid match or an unmatched closing bracket.`, 
                    11, 
                    { maxLen, stack: [...stack], i, action: 'pop' }
                );

                if (stack.length === 0) {
                    addStep(
                        "Stack Empty (Unmatched Close)", 
                        `Line 13: if (stack.isEmpty())\n\nThe stack is empty! This means there was no '(' to match this ')'. This breaks the valid chain.`, 
                        13, 
                        { maxLen, stack: [...stack], i, action: 'checkEmptyTrue' }
                    );
                    stack.push(i);
                    addStep(
                        "Update Base Boundary", 
                        `Line 14: stack.push(${i});\n\nWe push the current index ${i} to serve as the new base boundary for any future valid substrings.`, 
                        14, 
                        { maxLen, stack: [...stack], i, action: 'pushBoundary' }
                    );
                } else {
                    addStep(
                        "Valid Match Found!", 
                        `Line 15: else\n\nThe stack is NOT empty. We found a valid pair! We can now calculate the length of the current unbroken valid substring.`, 
                        15, 
                        { maxLen, stack: [...stack], i, action: 'checkEmptyFalse' }
                    );
                    
                    let peekVal = stack[stack.length - 1];
                    let currentLen = i - peekVal;
                    let oldMax = maxLen;
                    maxLen = Math.max(maxLen, currentLen);
                    
                    addStep(
                        "Update Max Length", 
                        `Line 16: maxLen = Math.max(maxLen, i - stack.peek());\n\nLength = ${i} - ${peekVal} (top of stack) = ${currentLen}.\nmaxLen = max(${oldMax}, ${currentLen}) = ${maxLen}.`, 
                        16, 
                        { maxLen, stack: [...stack], i, action: 'updateMax', currentLen }
                    );
                }
            }
        }
        
        addStep(
            "Return Result", 
            `Line 21: return maxLen;\n\nThe loop finishes. The longest valid parentheses substring is length ${maxLen}.`, 
            21, 
            { maxLen, stack: [...stack], i: null, action: 'success', isSuccess: true, ans: maxLen }
        );

    } else if (selectedApproachId === 'twoCounters') {
        
        let left = 0;
        let right = 0;
        let maxLen = 0;

        addStep(
            "Initialization", 
            `Line 3: int left = 0, right = 0, maxLen = 0;\n\nInitialize our counters and max length. We will scan the string twice.`, 
            3, 
            { left, right, maxLen, i: null, action: 'init', pass: 'L2R' }
        );

        addStep(
            "Start Left-to-Right Scan", 
            `Line 6: for (int i = 0; i < s.length(); i++)\n\nWe scan from Left to Right.`, 
            6, 
            { left, right, maxLen, i: null, action: 'loopStart', pass: 'L2R' }
        );

        let iter = 0;
        for (let i = 0; i < n; i++) {
            if (iter++ > 100) break;

            addStep(
                "Evaluate Character (L2R)", 
                `Line 6: i = ${i}, char = '${s[i]}'.\n\nChecking the current character.`, 
                6, 
                { left, right, maxLen, i, action: 'evalChar', pass: 'L2R' }
            );

            if (s[i] === '(') {
                left++;
                addStep(
                    "Increment Left Counter", 
                    `Line 7: if (s.charAt(${i}) == '(') left++;\n\nOpen parenthesis found. left becomes ${left}.`, 
                    7, 
                    { left, right, maxLen, i, action: 'incLeft', pass: 'L2R' }
                );
            } else {
                right++;
                addStep(
                    "Increment Right Counter", 
                    `Line 8: else right++;\n\nClose parenthesis found. right becomes ${right}.`, 
                    8, 
                    { left, right, maxLen, i, action: 'incRight', pass: 'L2R' }
                );
            }

            if (left === right) {
                let currentLen = 2 * right;
                let oldMax = maxLen;
                maxLen = Math.max(maxLen, currentLen);
                addStep(
                    "Valid Substring Found!", 
                    `Line 10: if (left == right)\n\nWe have exactly ${left} open and ${right} close brackets. A perfect match!\nmaxLen = max(${oldMax}, 2 * ${right}) = ${maxLen}.`, 
                    11, 
                    { left, right, maxLen, i, action: 'updateMax', currentLen, pass: 'L2R' }
                );
            } else if (right > left) {
                left = 0;
                right = 0;
                addStep(
                    "Invalid Substring (Reset)", 
                    `Line 12: else if (right > left)\n\nWe have ${right} close brackets but only ${left} open brackets. The sequence is irreparably broken.\nWe reset left and right to 0.`, 
                    13, 
                    { left, right, maxLen, i, action: 'reset', pass: 'L2R' }
                );
            } else {
                addStep(
                    "Sequence Still Building", 
                    `Line 10: left (${left}) > right (${right}).\n\nWe have more open brackets than close brackets. We wait for more close brackets to match them.`, 
                    10, 
                    { left, right, maxLen, i, action: 'waiting', pass: 'L2R' }
                );
            }
        }

        left = 0;
        right = 0;
        addStep(
            "Reset for Right-to-Left Scan", 
            `Line 17: left = right = 0;\n\nThe left-to-right pass is done. We reset counters. We MUST do a right-to-left pass to catch cases like "(()" where left > right the whole time.`, 
            17, 
            { left, right, maxLen, i: null, action: 'resetScan', pass: 'R2L' }
        );

        addStep(
            "Start Right-to-Left Scan", 
            `Line 20: for (int i = s.length() - 1; i >= 0; i--)\n\nWe scan from Right to Left.`, 
            20, 
            { left, right, maxLen, i: null, action: 'loopStart', pass: 'R2L' }
        );

        for (let i = n - 1; i >= 0; i--) {
            if (iter++ > 200) break;

            addStep(
                "Evaluate Character (R2L)", 
                `Line 20: i = ${i}, char = '${s[i]}'.\n\nChecking the current character.`, 
                20, 
                { left, right, maxLen, i, action: 'evalChar', pass: 'R2L' }
            );

            if (s[i] === '(') {
                left++;
                addStep(
                    "Increment Left Counter", 
                    `Line 21: if (s.charAt(${i}) == '(') left++;\n\nOpen parenthesis found. left becomes ${left}.`, 
                    21, 
                    { left, right, maxLen, i, action: 'incLeft', pass: 'R2L' }
                );
            } else {
                right++;
                addStep(
                    "Increment Right Counter", 
                    `Line 22: else right++;\n\nClose parenthesis found. right becomes ${right}.`, 
                    22, 
                    { left, right, maxLen, i, action: 'incRight', pass: 'R2L' }
                );
            }

            if (left === right) {
                let currentLen = 2 * left;
                let oldMax = maxLen;
                maxLen = Math.max(maxLen, currentLen);
                addStep(
                    "Valid Substring Found!", 
                    `Line 24: if (left == right)\n\nWe have exactly ${left} open and ${right} close brackets. A perfect match!\nmaxLen = max(${oldMax}, 2 * ${left}) = ${maxLen}.`, 
                    25, 
                    { left, right, maxLen, i, action: 'updateMax', currentLen, pass: 'R2L' }
                );
            } else if (left > right) {
                // Notice the condition flips for R2L
                left = 0;
                right = 0;
                addStep(
                    "Invalid Substring (Reset)", 
                    `Line 26: else if (left > right)\n\nScanning right-to-left, having too many open brackets (${left}) breaks the sequence.\nWe reset left and right to 0.`, 
                    27, 
                    { left, right, maxLen, i, action: 'reset', pass: 'R2L' }
                );
            } else {
                addStep(
                    "Sequence Still Building", 
                    `Line 24: right (${right}) > left (${left}).\n\nWe wait for more open brackets to match them.`, 
                    24, 
                    { left, right, maxLen, i, action: 'waiting', pass: 'R2L' }
                );
            }
        }

        addStep(
            "Return Result", 
            `Line 31: return maxLen;\n\nBoth passes are complete. We return maxLen: ${maxLen}.`, 
            31, 
            { left, right, maxLen, i: null, action: 'success', isSuccess: true, ans: maxLen, pass: 'Done' }
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
  const { isSuccess, ans, action, maxLen, i: activeI, stack, left, right, pass } = state;
  const { s } = parsedData;
  const sArr = s.split('');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <Brackets className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest Valid Parentheses</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 32</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Strings / Stack / Two Pointers</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : (action === 'reset' || action === 'checkEmptyTrue' ? 'bg-rose-500/20 border-rose-500' : 'bg-violet-500/20 border-violet-500')}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'reset' || action === 'checkEmptyTrue' ? 'rose' : 'violet'} />
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
                    
                    {selectedApproachId === 'stackMethod' ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            <VariableCard label="Index (i)" val={activeI !== null && activeI !== undefined ? activeI : "-"} color="sky" active={activeI !== null && activeI !== undefined} />
                            <VariableCard label="Char" val={activeI !== null && activeI !== undefined && activeI < sArr.length ? `'${sArr[activeI]}'` : "-"} color="purple" active={activeI !== null && activeI !== undefined} />
                            <VariableCard label="Max Length" val={maxLen !== null && maxLen !== undefined ? maxLen : "0"} color="emerald" active={true} />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <VariableCard label="Pass" val={pass !== undefined ? pass : "-"} color="slate" active={pass !== undefined} />
                            <VariableCard label="Left '('" val={left !== undefined ? left : "-"} color="sky" active={left !== undefined} />
                            <VariableCard label="Right ')'" val={right !== undefined ? right : "-"} color="purple" active={right !== undefined} />
                            <VariableCard label="Max Len" val={maxLen !== undefined ? maxLen : "-"} color="emerald" active={maxLen !== undefined} />
                        </div>
                    )}
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Input String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner tracking-[0.2em] font-bold" placeholder=")()())" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : (action === 'reset' || action === 'checkEmptyTrue' ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800')}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <Maximize2 size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : (action === 'reset' || action === 'checkEmptyTrue' ? 'text-rose-400' : 'text-violet-400')}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'reset' || action === 'checkEmptyTrue' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30')}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pt-4 pb-8 gap-10 overflow-y-auto">
                      
                      {/* String Array Representation */}
                      <div className="flex flex-wrap justify-center w-full gap-y-12 gap-x-2 mt-4">
                          {sArr.map((char, idx) => {
                              
                              let isCurrent = activeI === idx && !isSuccess;
                              let isStacked = stack && stack.includes(idx); // Element is currently represented in stack
                              let isInvalid = false; // Logic could determine invalid characters, but visual is fine without it

                              let cls = "relative w-10 h-12 md:w-12 md:h-14 flex flex-col items-center justify-center rounded-xl border-2 font-mono font-black text-xl md:text-2xl transition-all duration-300 z-10 ";
                              let textClass = "text-slate-700";
                              
                              if (isSuccess) {
                                  cls += "bg-emerald-50 border-emerald-400 scale-100 shadow-sm";
                                  textClass = "text-emerald-700";
                              } else if (isCurrent) {
                                  if (action === 'reset' || action === 'checkEmptyTrue') {
                                      cls += "bg-rose-100 border-rose-500 scale-110 shadow-lg ring-4 ring-rose-300/50 z-30 animate-pulse";
                                      textClass = "text-rose-800";
                                  } else {
                                      cls += "bg-sky-100 border-sky-500 scale-110 shadow-lg ring-4 ring-sky-300/50 z-30";
                                      textClass = "text-sky-800";
                                  }
                              } else if (isStacked) {
                                  cls += "bg-violet-50 border-violet-300 shadow-inner scale-95 opacity-80";
                                  textClass = "text-violet-600";
                              } else {
                                  cls += "bg-white border-slate-300 shadow-sm";
                              }

                              return (
                                  <div key={idx} className="flex flex-col items-center relative">
                                      {/* Top Pointers */}
                                      <div className="absolute -top-10 flex flex-col items-center justify-end h-8 w-full gap-1 z-30">
                                          {isCurrent && (
                                              <div className="flex flex-col items-center animate-bounce">
                                                  <span className="text-[10px] font-black font-mono tracking-widest text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-300 shadow-sm mb-1">i</span>
                                                  <ArrowDown size={14} className="text-sky-500" strokeWidth={3}/>
                                              </div>
                                          )}
                                      </div>

                                      <div className={cls}>
                                          <span className={textClass}>{char}</span>
                                          <span className="absolute -bottom-2 -right-2 text-[8px] md:text-[9px] font-mono font-bold text-white bg-slate-800 rounded px-1 shadow-sm">{idx}</span>
                                      </div>
                                  </div>
                              );
                          })}
                          {sArr.length === 0 && <span className="text-slate-400 italic font-mono text-sm">Empty String</span>}
                      </div>

                      {/* STACK VISUALIZATION */}
                      {selectedApproachId === 'stackMethod' && stack !== undefined && (
                          <div className="flex flex-col items-center w-full max-w-sm mt-8 border-t border-slate-200 pt-8">
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono text-center mb-4 flex items-center gap-1"><Layers size={14}/> Index Stack</span>
                              
                              <div className="flex flex-col-reverse items-center justify-start w-32 min-h-[160px] bg-slate-100 border-x-4 border-b-4 border-slate-300 rounded-b-2xl p-2 gap-1 relative overflow-y-auto">
                                  {stack.map((val, idx) => {
                                      let isTop = idx === stack.length - 1;
                                      let isBase = val === -1;
                                      
                                      let charRepr = isBase ? "BASE" : `'${s[val]}'`;
                                      
                                      let boxClass = "w-full flex items-center justify-between px-3 py-2 rounded-lg font-mono font-black text-sm border-2 transition-all duration-300 shadow-sm shrink-0 ";
                                      
                                      if (isBase) boxClass += "bg-slate-800 border-slate-900 text-white";
                                      else if (isTop && (action === 'pushOpen' || action === 'pushBoundary')) boxClass += "bg-emerald-100 border-emerald-400 text-emerald-800 animate-in slide-in-from-top-4 fade-in";
                                      else boxClass += "bg-white border-slate-300 text-slate-700";

                                      return (
                                          <div key={`${idx}-${val}`} className={boxClass}>
                                              <span className="opacity-60">{charRepr}</span>
                                              <span>{val}</span>
                                          </div>
                                      );
                                  })}
                                  
                                  {action === 'pop' && (
                                       <div className="w-full flex items-center justify-center px-3 py-2 rounded-lg font-mono font-black text-sm border-2 border-dashed border-rose-300 bg-rose-50 text-rose-400 animate-out fade-out slide-out-to-top-4 duration-500 absolute top-2 shrink-0">
                                           POPPED
                                       </div>
                                  )}
                                  
                                  {stack.length === 0 && action !== 'pop' && <span className="text-slate-400 italic text-xs my-auto">Empty</span>}
                              </div>
                          </div>
                      )}

                      {/* TWO COUNTERS VISUALIZATION */}
                      {selectedApproachId === 'twoCounters' && left !== undefined && (
                          <div className="flex flex-col items-center w-full gap-8 mt-8 border-t border-slate-200 pt-8">
                              
                              <div className="flex items-center gap-4 text-xs font-black font-mono tracking-widest uppercase">
                                  <span className={`px-3 py-1 rounded-full border-2 ${pass === 'L2R' ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>Left-To-Right ➔</span>
                                  <span className={`px-3 py-1 rounded-full border-2 ${pass === 'R2L' ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>⬅ Right-To-Left</span>
                              </div>

                              <div className="flex items-center gap-6 md:gap-12 w-full justify-center">
                                  {/* Left Counter */}
                                  <div className={`flex flex-col items-center p-6 rounded-3xl border-4 transition-all duration-500 ${action === 'incLeft' ? 'bg-sky-100 border-sky-400 scale-110 shadow-lg' : (action === 'reset' ? 'bg-rose-100 border-rose-400 scale-95 opacity-50' : 'bg-slate-50 border-slate-200 shadow-sm')}`}>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1 font-black"><span className="text-sky-600 text-base">{'('}</span> Left Count</span>
                                      <span className={`text-4xl font-black font-mono ${action === 'incLeft' ? 'text-sky-700' : 'text-slate-700'}`}>{left}</span>
                                  </div>

                                  {/* Compare Logic */}
                                  <div className="flex flex-col items-center gap-2">
                                      <div className={`p-4 rounded-full border-4 transition-all duration-300 ${left === right && left > 0 ? 'bg-emerald-100 border-emerald-400 text-emerald-600 shadow-lg scale-110' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
                                          {left === right ? '=' : '≠'}
                                      </div>
                                  </div>

                                  {/* Right Counter */}
                                  <div className={`flex flex-col items-center p-6 rounded-3xl border-4 transition-all duration-500 ${action === 'incRight' ? 'bg-purple-100 border-purple-400 scale-110 shadow-lg' : (action === 'reset' ? 'bg-rose-100 border-rose-400 scale-95 opacity-50' : 'bg-slate-50 border-slate-200 shadow-sm')}`}>
                                      <span className="text-[10px] text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1 font-black"><span className="text-purple-600 text-base">{')'}</span> Right Count</span>
                                      <span className={`text-4xl font-black font-mono ${action === 'incRight' ? 'text-purple-700' : 'text-slate-700'}`}>{right}</span>
                                  </div>
                              </div>

                          </div>
                      )}

                   </div>

                  {/* Final Overlays */}
                  {isSuccess && (
                    <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/10 backdrop-blur-[2px] animate-in fade-in duration-500 pointer-events-none">
                       <div className="bg-white border-2 border-slate-100 px-10 py-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4 transform -rotate-1 pointer-events-auto">
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-emerald-100 text-emerald-600`}>
                              <Check size={32} strokeWidth={3}/>
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SCAN COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Longest Valid Substring: {ans}
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
                <Brackets className="text-violet-600"/> The Anatomy of Valid Parentheses
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                A perfectly valid parentheses string has two properties: it has an equal number of open and closed brackets, and at no point reading from left to right does the number of closed brackets exceed the number of open brackets.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Layers size={18}/> Stack Strategy: Boundary Tracking
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            Instead of pushing characters to the stack, we push their <strong>indices</strong>. This allows us to instantly calculate lengths!
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            We start by pushing <code>-1</code>. This acts as a wall.<br/><br/>
                            Every time we successfully pop an open bracket, the element now sitting at the top of the stack is the index of the <em>last unmatched character</em>. The distance from the current index <code>i</code> to that boundary gives us the exact length of the valid segment we just completed.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <ArrowLeftRight size={18}/> Two Counters: Squeezing the Array
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            We can avoid $O(N)$ stack memory by using just two counters: <code>left</code> and <code>right</code>.
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p><strong>L2R Scan:</strong> If <code>right &gt; left</code>, the sequence is permanently broken (e.g., <code>())</code>). Reset to 0.</p>
                            <p><strong>Why two passes?</strong> A L2R scan fails on <code>(()</code>. <code>left</code> is 2, <code>right</code> is 1. It never resets, but it never matches either! By doing a reverse R2L scan, the condition flips (reset if <code>left &gt; right</code>), perfectly catching these edge cases.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <AlertCircle size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-rose-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The "-1" Initialization Trick</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            Why push <code>-1</code> into the stack before the loop starts? 
                            <br/><br/>
                            Consider the simple string <code>"()"</code>.
                            At index 0, we push 0.
                            At index 1, we pop 0. The stack is now empty. How do we calculate the length? <code>1 - ? = 2</code>.
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-[10px] text-rose-300">
                            // Without -1:<br/>
                            // Stack is empty, logic fails.<br/><br/>
                            // With -1:<br/>
                            // Stack has [-1].<br/>
                            // Push 0 -&gt; [-1, 0]<br/>
                            // Pop 0 -&gt; [-1]<br/>
                            // Calculate: i (1) - peek (-1) = 2!<br/>
                            // Perfectly gives length 2.
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
                        "There are two highly optimal ways I can solve this. The first is an $O(N)$ Time and $O(N)$ Space Stack approach. Instead of pushing characters, I push their indices. By initializing the stack with `-1` as a boundary, I can dynamically calculate the length of valid substrings by subtracting the current index from the stack's top index after a pop. However, to optimize the space complexity to strict $O(1)$, I would use the Two Counters approach. By tracking open and closed brackets and updating the max length whenever they are equal, I can identify valid segments. A single left-to-right pass resets when closed brackets exceed open ones. A symmetric right-to-left pass catches the edge cases where open brackets exceed closed ones. Both passes take $O(N)$ time and use $O(1)$ auxiliary space."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: Why does dynamic programming work?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                There is a third valid approach using DP. <code>dp[i]</code> stores the length of the longest valid substring ending at <code>i</code>. If <code>s[i] == ')'</code>, we check the character immediately preceding the potential valid substring (<code>i - dp[i-1] - 1</code>). While mathematically elegant, the Two Counters method is generally preferred in interviews as it achieves the same $O(N)$ time but drops the $O(N)$ array allocation to $O(1)$ constant space.
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
                                <p className="text-[10px] text-slate-500 mt-1">Stack: One single pass through the string of length N. Operations inside loop are O(1).<br/>Counters: Two complete passes through the string. $O(2N) \rightarrow O(N)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Stack: O(N) | Counters: O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Stack requires up to $O(N)$ memory if the string is entirely open brackets `(((((`. Counters use just 3 integer variables, scaling infinitely with zero extra memory.</p>
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
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|maxLen|stack|length|charAt|push|pop|isEmpty|peek|max|left|right)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['maxLen'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['left', 'right'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['stack', 'push', 'pop', 'isEmpty', 'peek'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (['charAt', 'length', 'max'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LongestValidParenthesesVisualizer;