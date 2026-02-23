import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Database, ListOrdered, Zap, ArrowLeftRight, Timer,
  ScanSearch, Minimize, Maximize, Target as TargetIcon, XCircle, Search
} from 'lucide-react';

const APPROACHES = {
  slidingWindow: {
    id: 'slidingWindow',
    title: '1. Sliding Window (Optimal)',
    subtitle: 'Optimal: O(S + T) Time, O(1) Space.',
    icon: <ScanSearch size={16} />,
    complexity: 'Time: O(S + T) | Space: O(1)',
    code: `class Solution {
    public String minWindow(String s, String t) {
        if (s.length() == 0 || t.length() == 0) return "";
        
        // Dictionary to keep track of all the unique characters in t
        Map<Character, Integer> dictT = new HashMap<>();
        for (int i = 0; i < t.length(); i++) {
            int count = dictT.getOrDefault(t.charAt(i), 0);
            dictT.put(t.charAt(i), count + 1);
        }
        
        // Number of unique characters in t that need to be fully matched
        int required = dictT.size();
        
        // Left and Right pointers for the sliding window
        int l = 0, r = 0;
        
        // formed keeps track of how many unique chars have their required frequency met
        int formed = 0;
        
        // Dictionary to keep track of characters in the current window
        Map<Character, Integer> windowCounts = new HashMap<>();
        
        // ans list of the form (window length, left, right)
        int[] ans = {-1, 0, 0};
        
        while (r < s.length()) {
            // Expand the window by adding the character on the right
            char c = s.charAt(r);
            int count = windowCounts.getOrDefault(c, 0);
            windowCounts.put(c, count + 1);
            
            // If the current character's frequency matches its required frequency
            if (dictT.containsKey(c) && windowCounts.get(c).intValue() == dictT.get(c).intValue()) {
                formed++;
            }
            
            // Try and contract the window till it ceases to be 'desirable'
            while (l <= r && formed == required) {
                c = s.charAt(l);
                
                // Save the smallest window up to now
                if (ans[0] == -1 || r - l + 1 < ans[0]) {
                    ans[0] = r - l + 1;
                    ans[1] = l;
                    ans[2] = r;
                }
                
                // The character at the left pointer is no longer in the window
                windowCounts.put(c, windowCounts.get(c) - 1);
                if (dictT.containsKey(c) && windowCounts.get(c).intValue() < dictT.get(c).intValue()) {
                    formed--;
                }
                
                // Move the left pointer ahead
                l++;
            }
            
            // Move the right pointer ahead
            r++;
        }
        
        return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
    }
}`,
    explanation: "We use a Sliding Window approach. We maintain two pointers, 'left' and 'right'. We first expand our window by moving 'right' until we have collected all the characters required from 't'. We track this using two HashMaps: one for the target counts, and one for the current window counts. Once the window is VALID (contains all required characters), we attempt to shrink it by moving 'left' forward. We keep shrinking as long as the window remains valid, keeping track of the minimum length seen so far. Once the window becomes invalid, we go back to expanding 'right'."
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">76. Minimum Window Substring</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          Given two strings <code>s</code> and <code>t</code> of lengths <code>m</code> and <code>n</code> respectively, return <em>the <strong>minimum window</strong></em> <span className="underline decoration-violet-500 decoration-2 font-semibold">substring</span> <em>of</em> <code>s</code> <em>such that every character in</em> <code>t</code> <em>(<strong>including duplicates</strong>) is included in the window</em>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-violet-500 pl-4 bg-violet-50 py-2 mt-4">
          If there is no such substring, return the empty string <code>""</code>.
        </p>

        <p className="text-lg leading-relaxed">
          The testcases will be generated such that the answer is <strong>unique</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "ADOBECODEBANC", t = "ABC"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "BANC"</p>
              <p className="text-slate-500 italic mt-2 text-xs font-sans">// Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "a", t = "a"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> "a"</p>
              <p className="text-slate-500 italic mt-2 text-xs font-sans">// Explanation: The entire string s is the minimum window.</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 3:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "a", t = "aa"</p>
              <p><span className="text-slate-400 font-bold">Output:</span> ""</p>
              <p className="text-slate-500 italic mt-2 text-xs font-sans">// Explanation: Both 'a's from t must be included in the window. Since the largest window of s only has one 'a', return empty string.</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm flex gap-3 mt-8 items-start shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-amber-500" size={18} />
            <div className="space-y-2">
                <p><strong>Follow-up:</strong></p>
                <p>Could you find an algorithm that runs in <code>O(m + n)</code> time?</p>
            </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>m == s.length</code></li>
              <li><code>n == t.length</code></li>
              <li><code>1 &lt;= m, n &lt;= 10<sup>5</sup></code></li>
              <li><code>s</code> and <code>t</code> consist of uppercase and lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const MinWindowVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('slidingWindow');
  const [sInput, setSInput] = useState('ADOBECODEBANC');
  const [tInput, setTInput] = useState('ABC');
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim().replace(/[^a-zA-Z]/g, '');
    let t = tInput.trim().replace(/[^a-zA-Z]/g, '');
    
    if (!s) s = "ADOBECODEBANC";
    if (!t) t = "ABC";
    
    // UI Safeguard
    if (s.length > 20) s = s.slice(0, 20);
    if (t.length > 10) t = t.slice(0, 10);

    return { s, t };
  }, [sInput, tInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s, t } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 3000) return;
      steps.push({ phase, description: desc, line, state: { ...vars } });
    };

    const cloneMap = (map) => ({ ...map });

    if (selectedApproachId === 'slidingWindow') {
        let tMap = {};
        addStep(
            "Base Case Check", 
            `Line 3: if (s.length() == 0 || t.length() == 0) return "";\n\nCheck if either string is empty. Since both have characters, we proceed.`, 
            3, 
            { l: null, r: null, wMap: {}, tMap: {}, required: null, formed: null, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );
        
        addStep(
            "Initialize Target Dictionary", 
            `Line 6: Map<Character, Integer> dictT = new HashMap<>();\n\nWe create a HashMap 'dictT' to store the exact frequencies of each character we need to find from the target string 't'.`, 
            6, 
            { l: null, r: null, wMap: {}, tMap: {}, required: null, formed: null, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );

        for (let i = 0; i < t.length; i++) {
            let char = t[i];
            tMap[char] = (tMap[char] || 0) + 1;
            addStep(
                "Populate Target Map", 
                `Line 7-10: Looping through target 't'. Processing character '${char}'.\n\nWe record that we need ${tMap[char]} occurrence(s) of '${char}'.`, 
                9, 
                { l: null, r: null, wMap: {}, tMap: cloneMap(tMap), required: null, formed: null, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
            );
        }
        
        let required = Object.keys(tMap).length;
        addStep(
            "Calculate Required Unique Chars", 
            `Line 13: int required = dictT.size();\n\nWe count how many UNIQUE characters are in 'dictT'. There are ${required} unique character(s) whose frequency we must satisfy.`, 
            13, 
            { l: null, r: null, wMap: {}, tMap: cloneMap(tMap), required, formed: null, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );
        
        let l = 0, r = 0;
        addStep(
            "Initialize Pointers", 
            `Line 16: int l = 0, r = 0;\n\nWe initialize the left ('l') and right ('r') pointers of our sliding window to index 0.`, 
            16, 
            { l, r, wMap: {}, tMap: cloneMap(tMap), required, formed: null, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );
        
        let formed = 0;
        addStep(
            "Initialize Formed Counter", 
            `Line 19: int formed = 0;\n\nThis crucial variable tracks how many of the ${required} unique characters have successfully reached their target frequency in our current window.`, 
            19, 
            { l, r, wMap: {}, tMap: cloneMap(tMap), required, formed, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );
        
        let wMap = {};
        addStep(
            "Initialize Window Map", 
            `Line 22: Map<Character, Integer> windowCounts = new HashMap<>();\n\nThis map will dynamically track the frequencies of characters currently inside our [l..r] window.`, 
            22, 
            { l, r, wMap: cloneMap(wMap), tMap: cloneMap(tMap), required, formed, bestL: -1, bestR: -1, minLen: Infinity, action: 'init' }
        );
        
        let minLen = Infinity;
        let bestL = -1, bestR = -1;
        addStep(
            "Initialize Answer Tracker", 
            `Line 25: int[] ans = {-1, 0, 0};\n\nThis array stores {minimum_length, left_index, right_index} for our best valid window. (-1 indicates no valid window found yet).`, 
            25, 
            { l, r, wMap: cloneMap(wMap), tMap: cloneMap(tMap), required, formed, bestL, bestR, minLen, action: 'init' }
        );

        let safeCounter = 0;
        while (r < s.length && safeCounter++ < 200) {
            addStep(
                "Outer Loop Condition", 
                `Line 27: while (r < s.length())\n\nIs 'r' (${r}) less than the string length (${s.length})? Yes, continue expanding.`, 
                27, 
                { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'loopCond' }
            );

            let c = s.charAt(r);
            addStep(
                "Expansion Phase (Move Right)", 
                `Line 29-31: We expand our window by absorbing s[${r}], which is '${c}'.\n\nWe add '${c}' to our 'windowCounts' map to represent what's inside our current boundaries.`, 
                30, 
                { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'expand', activeChar: c }
            );
            
            wMap[c] = (wMap[c] || 0) + 1;
            
            let isExactMatch = tMap[c] !== undefined && wMap[c] === tMap[c];
            let matchText = "";
            
            if (tMap[c] !== undefined) {
                if (isExactMatch) {
                    matchText = `\n\nCRITICAL EVENT: By adding this '${c}', our window count exactly equals the target count (${tMap[c]}). We have satisfied the requirement for this specific character!`;
                } else if (wMap[c] < tMap[c]) {
                    matchText = `\n\nWe need ${tMap[c]} of '${c}', but we only have ${wMap[c]}. We still need more.`;
                } else {
                    matchText = `\n\nWe have a surplus! We have ${wMap[c]} of '${c}', but we only needed ${tMap[c]}. Surplus characters are safely ignored.`;
                }
            } else {
                matchText = `\n\nThe character '${c}' is not in our target string. It has no effect on our 'formed' count.`;
            }
            
            if (isExactMatch) {
                formed++;
            }
            
            addStep(
                "Evaluate Progress (Formed Variable)", 
                `Line 33-35: We check if adding '${c}' just fulfilled a requirement.${matchText}\n\nNotice we ONLY increment 'formed' when the counts are EXACTLY equal (==). If we used (>=), we would falsely increment 'formed' multiple times for a surplus!`, 
                34, 
                { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'evalExpand', activeChar: c }
            );

            while (l <= r && formed === required) {
                addStep(
                    "Window is VALID! Begin Optimization", 
                    `Line 38: while (l <= r && formed == required)\n\nThis condition is TRUE! Our 'formed' count (${formed}) matches our 'required' count (${required}).\n\nThis means our current window [${l}...${r}] is a guaranteed valid answer. But is it the MINIMUM? We must now try to shrink it from the left.`, 
                    38, 
                    { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'validWindow' }
                );
                
                let currentLen = r - l + 1;
                if (currentLen < minLen) {
                    minLen = currentLen;
                    bestL = l;
                    bestR = r;
                    addStep(
                        "Record New Minimum Window", 
                        `Line 42-46: Before shrinking, we check the length.\n\nCurrent window length is ${currentLen}. This is smaller than our previous best (${minLen === Infinity ? 'Infinity' : minLen}).\nWe save [${bestL}...${bestR}] as our optimal answer so far.`, 
                        43, 
                        { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'updateAns' }
                    );
                }

                let leftChar = s.charAt(l);
                addStep(
                    "Shrink Phase (Move Left)", 
                    `Line 49: We are attempting to make the window smaller by removing s[${l}], which is '${leftChar}'.\n\nWe decrement its count in 'windowCounts'. Does losing this character break our validity?`, 
                    49, 
                    { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'shrink', activeChar: leftChar }
                );

                wMap[leftChar]--;
                
                let didBreak = tMap[leftChar] !== undefined && wMap[leftChar] < tMap[leftChar];
                let breakText = "";
                
                if (didBreak) {
                    formed--;
                    breakText = `\n\n❌ DROPPED BELOW THRESHOLD: We need ${tMap[leftChar]} of '${leftChar}', but removing it dropped our count to ${wMap[leftChar]}.\nThe window is NO LONGER VALID. We decrement 'formed'.`;
                } else if (tMap[leftChar] !== undefined) {
                    breakText = `\n\nWe removed a '${leftChar}', but we still have ${wMap[leftChar]} left, which satisfies the ${tMap[leftChar]} we need (we just removed a surplus).\nThe window is STILL VALID!`;
                } else {
                    breakText = `\n\n'${leftChar}' isn't even a target character. Removing it is purely beneficial and doesn't affect validity.`;
                }

                addStep(
                    "Evaluate Post-Shrink Validity", 
                    `Line 50-53: We evaluate the aftermath of removing '${leftChar}'.${breakText}`, 
                    51, 
                    { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'evalShrink', activeChar: leftChar }
                );
                
                l++;
                addStep(
                    "Advance Left Pointer", 
                    `Line 56: We officially advance 'l' to ${l}.\n\nIf 'formed' is still equal to 'required', the while loop repeats, and we will try to shrink again! Otherwise, we will break out and resume expanding.`, 
                    56, 
                    { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'shrinkEnd' }
                );
            }
            
            r++;
            addStep(
                "Advance Right Pointer", 
                `Line 60: The inner shrink loop has terminated because our window became invalid (formed < required).\n\nWe must now advance 'r' to ${r} to go hunt for the characters we are missing.`, 
                60, 
                { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'expandEnd' }
            );
        }
        
        addStep(
            "Algorithm Complete", 
            `Line 63: 'r' has reached the end of the string.\n\nWe look at our saved 'ans' array. The absolute minimum window length was ${minLen === Infinity ? 'N/A' : minLen}, spanning from index ${bestL} to ${bestR}.\nWe return s.substring(${bestL}, ${bestR + 1}).`, 
            63, 
            { l, r, wMap: cloneMap(wMap), tMap, required, formed, bestL, bestR, minLen, action: 'success', isSuccess: true }
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
  const { isSuccess, l, r, wMap, tMap, required, formed, bestL, bestR, minLen, action, activeChar } = state;
  const { s, t } = parsedData;

  const sArr = s.split('');

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-violet-600 p-4 rounded-2xl shadow-lg shadow-violet-100 flex items-center justify-center">
                <ScanSearch className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Min Window Substring</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 76</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Sliding Window / Hash Map</span>
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
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 'bg-violet-500/20 border-violet-500'}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
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
                        <VariableCard label="Left (l)" val={l ?? null} color="rose" active={l !== null && l !== undefined} />
                        <VariableCard label="Right (r)" val={r ?? null} color="sky" active={r !== null && r !== undefined} />
                        <VariableCard label="Required" val={required ?? null} color="slate" active={required !== null && required !== undefined} />
                        <VariableCard label="Formed" val={formed ?? null} color={formed === required && required !== 0 ? "emerald" : "amber"} active={formed !== null && formed !== undefined} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Source String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner truncate" placeholder="ADOBECODEBANC" />
                    </div>
                    
                    <div className="flex-[1] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-violet-600 uppercase block pl-1 tracking-widest font-mono">Target (t)</label>
                        <input type="text" value={tInput} onChange={(e) => { setTInput(e.target.value.toUpperCase()); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all shadow-inner" placeholder="ABC" />
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
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[180px] relative overflow-hidden group shrink-0 ${isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess ? <Check size={100}/> : <ScanSearch size={100}/>}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess ? "text-emerald-400" : "text-violet-400"}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-violet-500/20 text-violet-300 border border-violet-500/30'}`}>Line {cur.line}</div>
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
                   
                   <div className="flex flex-col items-center justify-center w-full h-full relative z-10 pt-4 gap-12">
                      
                      {/* Substring Array Visualization */}
                      <div className="flex flex-col items-center w-full max-w-full overflow-x-auto pb-8 pt-8">
                          <div className="flex gap-1.5 md:gap-2">
                              {sArr.map((char, i) => {
                                  // Determine state of this character
                                  let isInWindow = l !== null && r !== null && i >= l && i <= r && !isSuccess && l <= r;
                                  let isBestWindow = isSuccess && bestL !== -1 && i >= bestL && i <= bestR;
                                  let isL = l !== null && i === l && !isSuccess;
                                  let isR = r !== null && i === r && !isSuccess;
                                  
                                  let isValidatingWindow = action === 'validWindow' || action === 'updateAns';
                                  
                                  // Base styling
                                  let boxClass = "w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 flex items-center justify-center rounded-xl border-2 font-mono font-black text-lg transition-all duration-300 z-10 relative ";
                                  
                                  if (isBestWindow) {
                                      boxClass += "bg-emerald-100 border-emerald-500 text-emerald-900 scale-110 shadow-lg ring-2 ring-emerald-400/30 z-20";
                                  } else if (isInWindow) {
                                      if (isValidatingWindow) {
                                          boxClass += "bg-emerald-50 border-emerald-400 text-emerald-800 scale-105 shadow-md";
                                      } else {
                                          boxClass += "bg-violet-100 border-violet-400 text-violet-900 scale-105 shadow-md";
                                      }
                                  } else {
                                      boxClass += "bg-white border-slate-200 text-slate-400";
                                  }

                                  // Active char pulse
                                  if (!isSuccess && i === r && action === 'expand') boxClass += " ring-4 ring-sky-300";
                                  if (!isSuccess && i === l && action === 'shrink') boxClass += " ring-4 ring-rose-300";

                                  return (
                                      <div key={i} className="flex flex-col items-center relative shrink-0">
                                          {/* Top Pointer (L) */}
                                          <div className="absolute -top-10 flex flex-col items-center h-8 justify-end z-30">
                                              {isL && (
                                                  <div className={`flex flex-col items-center ${action === 'shrink' ? 'animate-bounce' : ''}`}>
                                                      <span className="text-[10px] font-black font-mono bg-rose-100 text-rose-700 px-1 rounded border border-rose-300 tracking-widest shadow-sm">L</span>
                                                      <ArrowDown size={14} className="text-rose-500" strokeWidth={3}/>
                                                  </div>
                                              )}
                                          </div>

                                          <div className={boxClass}>
                                              {char}
                                          </div>
                                          
                                          <div className="text-[10px] text-slate-400 font-mono mt-1">{i}</div>

                                          {/* Bottom Pointer (R) */}
                                          <div className="absolute -bottom-10 flex flex-col items-center h-8 justify-start z-30">
                                              {isR && (
                                                  <div className={`flex flex-col items-center ${action === 'expand' ? 'animate-bounce' : ''}`}>
                                                      <ArrowUp size={14} className="text-sky-500" strokeWidth={3}/>
                                                      <span className="text-[10px] font-black font-mono bg-sky-100 text-sky-700 px-1 rounded border border-sky-300 tracking-widest shadow-sm">R</span>
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  )
                              })}
                          </div>

                          {/* Target Map Table */}
                          {tMap && Object.keys(tMap).length > 0 && (
                              <div className="mt-6 flex flex-col items-center bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm min-w-[300px]">
                                  <div className="flex items-center gap-2 mb-4">
                                      <TargetIcon size={16} className="text-slate-500"/>
                                      <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono">Frequency Map Tracking</span>
                                  </div>
                                  
                                  <div className="flex gap-4">
                                      {Object.keys(tMap).map(char => {
                                          let needed = tMap[char];
                                          let have = wMap && wMap[char] !== undefined ? wMap[char] : 0;
                                          let isSatisfied = have >= needed;
                                          let isJustUpdated = !isSuccess && activeChar === char && (action === 'evalExpand' || action === 'evalShrink');

                                          return (
                                              <div key={char} className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all duration-300 ${isSatisfied ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-slate-200'} ${isJustUpdated ? 'scale-110 shadow-lg ring-2 ring-violet-300' : ''}`}>
                                                  <span className="text-xl font-black font-mono mb-2">{char}</span>
                                                  <div className="flex items-center gap-2 text-xs font-mono font-bold">
                                                      <div className="flex flex-col items-center">
                                                          <span className="text-[8px] text-slate-400 uppercase">Have</span>
                                                          <span className={isSatisfied ? "text-emerald-700" : "text-amber-600"}>{have}</span>
                                                      </div>
                                                      <span className="text-slate-300">/</span>
                                                      <div className="flex flex-col items-center">
                                                          <span className="text-[8px] text-slate-400 uppercase">Need</span>
                                                          <span className="text-slate-700">{needed}</span>
                                                      </div>
                                                  </div>
                                                  {isSatisfied && <Check size={14} className="text-emerald-500 mt-1" strokeWidth={4}/>}
                                              </div>
                                          )
                                      })}
                                  </div>

                                  {/* Formed Status Bar */}
                                  <div className="mt-5 w-full flex flex-col gap-2">
                                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">
                                          <span>Overall Satisfied</span>
                                          <span className={formed === required ? "text-emerald-600" : "text-amber-600"}>{formed} of {required}</span>
                                      </div>
                                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                          <div 
                                              className={`h-full transition-all duration-500 ${formed === required ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                                              style={{ width: `${required === 0 ? 0 : (formed/required)*100}%` }}
                                          ></div>
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
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${bestL !== -1 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                              {bestL !== -1 ? <Check size={32} strokeWidth={3}/> : <XCircle size={32} strokeWidth={3}/>}
                          </div>
                          <div className="text-center flex flex-col items-center">
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">SEARCH COMPLETE</span>
                              <span className={`text-xs font-black uppercase tracking-widest font-mono mb-4 block ${bestL !== -1 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {bestL !== -1 ? `Minimum Window Found: "${s.substring(bestL, bestR + 1)}"` : `No valid window exists.`}
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
                <ScanSearch className="text-violet-600"/> The Sliding Window Pattern
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-violet-100 pl-6">
                The Sliding Window technique is perfect for finding the shortest, longest, or target subarray/substring. Instead of a nested loop $O(N^2)$ checking every possible start and end point, we use two pointers (`left` and `right`) to represent a "window" that crawls over the data in $O(N)$ time.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Maximize size={18}/> Phase 1: Expand (Seek Validity)
                        </h3>
                        <p className="text-sm text-sky-800 leading-relaxed mb-4">
                            We move the <code>right</code> pointer forward to expand the window. We are actively looking for characters that satisfy our target <code>t</code>.
                        </p>
                        <p className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner">
                            Every time we encounter a character, we add it to our <code>windowCounts</code> map.<br/><br/>
                            We keep expanding until our window is <strong>VALID</strong> — meaning it contains at least the required frequency of every character in <code>t</code>.
                        </p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-amber-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Minimize size={18}/> Phase 2: Shrink (Optimize)
                        </h3>
                        <p className="text-xs text-amber-800 leading-relaxed mb-4">
                            Once the window is valid, expanding it further will only make it longer. Since we want the <em>minimum</em> window, we must try to shrink it!
                        </p>
                        <div className="text-xs text-amber-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-amber-200 shadow-inner space-y-2">
                            <p>We move the <code>left</code> pointer forward, kicking characters out of our window.</p>
                            <p>At each step, we record the window's length as a potential answer.</p>
                            <p>We keep shrinking <strong>as long as the window remains valid</strong>. Once removing a character causes the window to become invalid, we stop shrinking and go back to Phase 1.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden md:col-span-2">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <TargetIcon size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <Target size={32} className="text-emerald-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs">The 'Formed' vs 'Required' Optimization</h4>
                    </div>
                    <div className="relative z-10 space-y-4 text-xs text-slate-300 leading-relaxed">
                        <p>
                           A naive approach would iterate through the entire Hash Map every time we move a pointer to check if the window is valid. Checking a map takes $O(K)$ time, which slows us down.
                        </p>
                        <p>
                           <strong>Optimization:</strong> We introduce two integer variables: <code>required</code> (total unique chars in `t`) and <code>formed</code> (how many of those unique chars have reached their target frequency in the window).
                        </p>
                        <div className="bg-slate-800/80 border border-slate-700/50 text-emerald-300 p-4 rounded-xl mt-4 font-mono text-[11px] font-bold">
                           // When expanding:<br/>
                           if (window[c] == target[c]) formed++;<br/><br/>
                           // When shrinking:<br/>
                           if (window[c] &lt; target[c]) formed--;<br/><br/>
                           // Constant time check!<br/>
                           boolean isValid = (formed == required);
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
                        "I solved this using the Sliding Window pattern. I maintain two pointers, `left` and `right`. The `right` pointer expands the window to incorporate characters until we've matched all the target frequencies from string `t`. To do this efficiently in $O(1)$ time per step, I track how many unique characters have met their frequency requirement using a `formed` variable. Once the window is valid (`formed == required`), I aggressively move the `left` pointer to shrink the window, continuously recording the minimum length. Once shrinking makes the window invalid, I resume expanding `right`. This ensures both strings are processed in linear $O(S + T)$ time."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-rose-500"/> FAQ: HashMap vs Array?
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                While HashMaps are conceptually easy to explain, in an actual interview it is much better to use a simple integer array (e.g., <code>int[] map = new int[128];</code>) to count ASCII characters. Array lookups are significantly faster than HashMaps because they avoid hashing overhead and memory object allocation. Both have the same Big-O time complexity, but the array has much smaller constants.
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(S + T)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We iterate through the string `t` once to build the target map $O(T)$. For string `s`, the `right` pointer moves from 0 to $S$, and the `left` pointer moves from 0 to $S$. Each character in `s` is visited at most twice. Total time is $O(S + T)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(1)</span>
                                <p className="text-[10px] text-slate-500 mt-1">The maximum size of our HashMap (or Array) is bounded by the character set size (e.g., 128 for ASCII or 26 for English letters). Since this is a fixed constant regardless of string length, space is strictly $O(1)$.</p>
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

const VariableCard: React.FC<{ label: string; val: number | null; color: string; active: boolean }> = ({ label, val, color, active }) => {
    const bgMap: Record<string, string> = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        sky: 'bg-sky-50 border-sky-200 text-sky-700',
        rose: 'bg-rose-50 border-rose-200 text-rose-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active: boolean; theme?: string }> = ({ num, code, active, theme = 'violet' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Math|Arrays|ArrayList|ListNode|Stack|Map|HashMap|Character|dictT|windowCounts|formed|required|ans|getOrDefault|containsKey)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'Stack', 'Map', 'Character'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['dictT', 'windowCounts'].includes(part)) return <span key={i} className="text-emerald-300 font-bold">{part}</span>;
          if (['formed', 'required'].includes(part)) return <span key={i} className="text-amber-400 font-bold">{part}</span>;
          if (['ans'].includes(part)) return <span key={i} className="text-violet-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default MinWindowVisualizer;