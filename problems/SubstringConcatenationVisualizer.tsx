import React, { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Activity, BookOpen, Code2, 
  Check, Copy, Trophy, Target, AlertCircle, Layers, FileText, 
  ArrowDown, ArrowUp, Zap, Timer, Calculator, ListOrdered, 
  ArrowRight, Hash, XSquare, Shuffle, FastForward, Blocks, CheckSquare,
  Search, Info
} from 'lucide-react';

const APPROACHES = {
  slidingWindow: {
    id: 'slidingWindow',
    title: 'Sliding Window + HashMap',
    subtitle: 'Optimal: O(N * L) Time, O(M) Space.',
    icon: <Layers size={16} />,
    complexity: 'Time: O(N * M * L) | Space: O(M)', // M is num words, L is word length, N is string length (simple version)
    code: `class Solution {
    public List<Integer> findSubstring(String s, String[] words) {
        List<Integer> res = new ArrayList<>();
        if (s == null || words.length == 0) return res;
        
        int wordLen = words[0].length();
        int numWords = words.length;
        int totalLen = wordLen * numWords;
        
        // 1. Map target word frequencies
        Map<String, Integer> counts = new HashMap<>();
        for (String word : words) {
            counts.put(word, counts.getOrDefault(word, 0) + 1);
        }
        
        // 2. Iterate through possible starting indices
        for (int i = 0; i <= s.length() - totalLen; i++) {
            Map<String, Integer> seen = new HashMap<>();
            int j = 0;
            
            // 3. Check each word in the current window
            while (j < numWords) {
                int wordIndex = i + j * wordLen;
                String word = s.substring(wordIndex, wordIndex + wordLen);
                
                if (counts.containsKey(word)) {
                    seen.put(word, seen.getOrDefault(word, 0) + 1);
                    if (seen.get(word) > counts.get(word)) {
                        break; // Exceeded required frequency
                    }
                } else {
                    break; // Invalid word found
                }
                j++;
            }
            
            // 4. If all words matched perfectly
            if (j == numWords) {
                res.add(i);
            }
        }
        return res;
    }
}`,
    explanation: "We can iterate through every possible starting index `i` in the string `s` that has enough characters left to fit all our words (`totalLen`). For each starting index, we check the words sequentially. We extract the next word of length `wordLen` and check if it exists in our required `counts` map. If it does, we record it in our `seen` map for this window. If the `seen` count ever exceeds the `counts` requirement, or if we find a word not in `counts`, we instantly break out and move `i` forward. If we successfully match all words (`j == numWords`), we record `i` as a valid starting index!"
  }
};

const ProblemStatement = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-3xl">
      <h2 className="text-2xl font-black text-slate-900 mb-6">30. Substring with Concatenation of All Words</h2>
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          You are given a string <code>s</code> and an array of strings <code>words</code>. All the strings of <code>words</code> are of <strong>the same length</strong>.
        </p>

        <p className="text-lg leading-relaxed font-bold text-slate-800 border-l-4 border-blue-500 pl-4 bg-blue-50 py-3 mt-4">
          A concatenated substring in <code>s</code> is a substring that contains all the strings of any permutation of <code>words</code> concatenated.
        </p>

        <ul className="list-disc pl-6 space-y-2 text-slate-700 text-sm">
            <li>For example, if <code>words = ["ab","cd","ef"]</code>, then <code>"abcdef"</code>, <code>"abefcd"</code>, <code>"cdabef"</code>, etc. are all valid concatenated substrings.</li>
            <li><code>"acdbef"</code> is not a valid concatenated substring because it is not the concatenation of any permutation of <code>words</code>.</li>
        </ul>
        
        <p className="text-lg leading-relaxed">
          Return the starting indices of all the concatenated substrings in <code>s</code>. You can return the answer in <strong>any order</strong>.
        </p>

        <div className="space-y-6 mt-10">
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 1:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "barfoothefoobarman", words = ["foo","bar"]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> [0,9]</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> Since words.length == 2 and words[i].length == 3, the concatenated substring has to be of length 6. <br/>
                The substring starting at 0 is "barfoo". It is the concatenation of ["bar","foo"] which is a permutation of words.<br/>
                The substring starting at 9 is "foobar". It is the concatenation of ["foo","bar"] which is a permutation of words.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Example 2:</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 font-mono text-sm space-y-2">
              <p><span className="text-slate-400 font-bold">Input:</span> s = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]</p>
              <p><span className="text-slate-400 font-bold">Output:</span> []</p>
              <p className="text-slate-500 text-xs mt-2 font-sans border-t border-slate-200 pt-2">
                <strong>Explanation:</strong> Since words.length == 4 and words[i].length == 4, the concatenated substring has to be of length 16.<br/>
                There is no substring of length 16 in s that is equal to the concatenation of any permutation of words.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Constraints:</h3>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 font-mono text-sm bg-slate-50 p-4 rounded-xl border border-slate-200 w-max pr-12">
              <li><code>1 &lt;= s.length &lt;= 10<sup>4</sup></code></li>
              <li><code>1 &lt;= words.length &lt;= 5000</code></li>
              <li><code>1 &lt;= words[i].length &lt;= 30</code></li>
              <li><code>s</code> and <code>words[i]</code> consist of lowercase English letters.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const SubstringConcatenationVisualizer = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedApproachId, setSelectedApproachId] = useState('slidingWindow');
  
  const [sInput, setSInput] = useState('barfoothefoobarman');
  const [wordsInput, setWordsInput] = useState('foo, bar');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedApproach = APPROACHES[selectedApproachId];

  const parsedData = useMemo(() => {
    let s = sInput.trim();
    if (!s) s = "barfoothefoobarman";
    
    // Limit string length for performance in visualizer
    if (s.length > 50) s = s.substring(0, 50);

    let rawWords = wordsInput.split(',').map(x => x.trim()).filter(x => x !== "");
    if (rawWords.length === 0) rawWords = ["foo", "bar"];
    
    // Enforce uniform length constraint
    const targetLen = rawWords[0].length;
    let words = rawWords.filter(w => w.length === targetLen);
    
    // Limit words
    if (words.length > 10) words = words.slice(0, 10);

    return { s, words };
  }, [sInput, wordsInput]);

  const trace = useMemo(() => {
    const steps = [];
    const { s, words } = parsedData;

    const addStep = (phase, desc, line, vars) => {
      if (steps.length > 2000) return; 
      steps.push({ phase, description: desc, line, state: JSON.parse(JSON.stringify({ ...vars })) });
    };

    let res = [];
    if (!s || words.length === 0) {
        addStep("Edge Case", "Input string or words array is empty. Returning early.", 4, { res, action: 'init' });
        return steps;
    }

    let wordLen = words[0].length;
    let numWords = words.length;
    let totalLen = wordLen * numWords;

    addStep("Initialization", `Line 5-8: Calculate lengths.\n\nWord Length: ${wordLen}\nNumber of Words: ${numWords}\nTotal Window Length: ${totalLen}`, 8, { s, words, res, wordLen, numWords, totalLen, action: 'init' });

    let counts = {};
    for (let w of words) {
        counts[w] = (counts[w] || 0) + 1;
    }

    addStep("Build Target Map", `Line 11-14: Build frequency map of required words.\n\nCounts Map initialized.`, 14, { s, words, res, wordLen, numWords, totalLen, counts, action: 'buildMap' });

    const maxI = s.length - totalLen;

    for (let i = 0; i <= maxI; i++) {
        let seen = {};
        let j = 0;
        
        addStep(`Window starts at ${i}`, `Line 17-18: Initialize new window.\n\nChecking substring from index ${i} to ${i + totalLen}.\nReset 'seen' map for this iteration.`, 18, { s, words, res, wordLen, numWords, totalLen, counts, i, j, seen, action: 'startWindow' });

        let windowFailed = false;

        while (j < numWords) {
            let wordIndex = i + j * wordLen;
            let word = s.substring(wordIndex, wordIndex + wordLen);
            
            addStep(`Extract Word ${j+1}/${numWords}`, `Line 22-23: Extract word.\n\nIndex: ${wordIndex} to ${wordIndex + wordLen}\nWord Extracted: "${word}"`, 23, { s, words, res, wordLen, numWords, totalLen, counts, i, j, wordIndex, word, seen, action: 'extract' });
            
            if (counts[word]) {
                seen[word] = (seen[word] || 0) + 1;
                addStep("Word Match!", `Line 25-26: "${word}" exists in our target list.\n\nUpdating 'seen' map.`, 26, { s, words, res, wordLen, numWords, totalLen, counts, i, j, wordIndex, word, seen, action: 'record' });
                
                if (seen[word] > counts[word]) {
                    addStep("Frequency Exceeded", `Line 27-28: "${word}" appears ${seen[word]} times, but we only need ${counts[word]}.\n\nBreaking inner loop. Window invalid.`, 28, { s, words, res, wordLen, numWords, totalLen, counts, i, j, wordIndex, word, seen, action: 'failCount' });
                    windowFailed = true;
                    break;
                }
            } else {
                addStep("Invalid Word", `Line 31-32: "${word}" is not required.\n\nBreaking inner loop immediately. Window invalid.`, 32, { s, words, res, wordLen, numWords, totalLen, counts, i, j, wordIndex, word, seen, action: 'failInvalid' });
                windowFailed = true;
                break;
            }
            j++;
        }

        if (j === numWords) {
            res.push(i);
            addStep("Perfect Match!", `Line 38-39: All words matched perfectly! (j == ${numWords})\n\nAdding index ${i} to results.`, 39, { s, words, res, wordLen, numWords, totalLen, counts, i, j, seen, action: 'match' });
        }
    }

    addStep("Algorithm Complete", `Line 42: return res;\n\nProcessed all possible starting indices up to ${maxI}.\nFinal result: [${res.join(', ')}]`, 42, { s, words, res, wordLen, numWords, totalLen, counts, action: 'success', isSuccess: true });

    if (steps.length === 0) {
        addStep("Init", "Start", 1, {});
    }

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
  const state = cur.state || {};
  const { isSuccess, action, s, words, res, wordLen, numWords, totalLen, counts, i, j, wordIndex, word, seen } = state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 flex items-center justify-center">
                <Search className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Substring Concatenation</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded tracking-widest uppercase">LC 30</span>
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
                               className={`px-3 py-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200 scale-[1.02]' : 'bg-white border-slate-200 text-slate-500 hover:border-blue-300 hover:bg-slate-50'}`}
                            >
                                <div className="flex items-center justify-center w-full gap-2">
                                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{app.icon}</div>
                                  <span className="text-[11px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">
                                      {app.title}
                                  </span>
                                </div>
                                <div className={`flex w-full items-center justify-between px-1 text-[9px] font-mono leading-tight mt-1 opacity-90 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
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
                      <Code2 size={14} className="text-blue-400" />
                      <span className="font-bold uppercase text-[10px] text-white">Solution.java</span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div className="p-6 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                      {cur.line && (
                        <div className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${isSuccess || action === 'match' ? 'bg-emerald-500/20 border-emerald-500' : (action === 'failCount' || action === 'failInvalid' ? 'bg-rose-500/20 border-rose-500' : (action === 'record' ? 'bg-blue-500/20 border-blue-500' : 'bg-sky-500/20 border-sky-500'))}`} style={{ top: `${((cur.line - 1) * 16.5) + 24}px`, height: '16.5px' }} />
                      )}
                      
                      {selectedApproach.code.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                            <CodeLineRenderer num={idx + 1} code={line} active={cur.line === idx + 1} theme={action === 'failCount' || action === 'failInvalid' ? 'rose' : (action === 'match' ? 'emerald' : 'blue')} />
                        </React.Fragment>
                      ))}
                  </div>
                </div>

                {/* Variables Panel */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                          <Layers size={18} />
                          <h4 className="text-sm font-black uppercase tracking-widest font-mono">Iteration State</h4>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        <VariableCard label="Window (i)" val={i !== null && i !== undefined ? i : "-"} color="purple" active={i !== null && i !== undefined} />
                        <VariableCard label="Word Idx (j)" val={j !== null && j !== undefined ? j : "-"} color="sky" active={j !== null && j !== undefined} />
                        <VariableCard label="Curr Word" val={word ? `"${word}"` : "-"} color="amber" active={word !== null && word !== undefined} />
                        <VariableCard label="Matches" val={res ? res.length : "-"} color="emerald" active={res !== undefined && res.length > 0} />
                    </div>
                </div>
              </div>

              {/* Right Col: Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-end shrink-0">
                    <div className="flex-[3] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">Target String (s)</label>
                        <input type="text" value={sInput} onChange={(e) => { setSInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="barfoothefoobarman" />
                    </div>
                    <div className="flex-[2] space-y-1.5 w-full">
                        <label className="text-[10px] font-black text-blue-600 uppercase block pl-1 tracking-widest font-mono">Words Array (CSV)</label>
                        <input type="text" value={wordsInput} onChange={(e) => { setWordsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-inner tracking-widest font-bold text-slate-700" placeholder="foo, bar" />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto pb-1">
                      <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 md:flex-none md:w-24 px-6 py-3 bg-slate-100 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <ChevronLeft size={16}/>
                      </button>
                      <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] md:flex-none md:w-36 px-6 py-3 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        Next <ChevronRight size={16}/>
                      </button>
                    </div>
                </div>

                {/* Execution Log */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[200px] relative overflow-hidden group shrink-0 ${isSuccess || action === 'match' ? 'bg-emerald-900 border-emerald-800' : (action === 'failCount' || action === 'failInvalid' ? 'bg-rose-900 border-rose-800' : (action === 'record' ? 'bg-blue-900 border-blue-800' : 'bg-slate-900 border-slate-800'))}`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                      {isSuccess || action === 'match' ? <Check size={100}/> : (action === 'failCount' || action === 'failInvalid' ? <XSquare size={100}/> : (action === 'record' ? <Activity size={100}/> : <Search size={100}/>))}
                  </div>
                  <div className="flex items-center justify-between mb-3 relative z-10">
                     <div className="flex items-center gap-2">
                        <Activity size={14} className={isSuccess || action === 'match' ? "text-emerald-400" : (action === 'failCount' || action === 'failInvalid' ? 'text-rose-400' : (action === 'record' ? 'text-blue-400' : 'text-slate-400'))}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Log</span>
                     </div>
                     <div className="flex gap-2 items-center">
                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${isSuccess || action === 'match' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : (action === 'failCount' || action === 'failInvalid' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30')}`}>Line {cur.line}</div>
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
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 flex-1 relative flex flex-col overflow-hidden shadow-inner min-h-[460px] items-center justify-start pt-10">
                   
                   <div className="flex flex-col items-center w-full h-full relative z-10 pb-8 gap-8 overflow-y-auto overflow-x-hidden">
                      
                      {/* Top: String & Window Visualization */}
                      {s && (
                        <div className="w-full flex flex-col items-center border-b border-slate-200 pb-8 relative">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono mb-4 flex items-center gap-2"><Target size={14}/> String & Sliding Window</span>
                            
                            <div className="flex items-start max-w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 relative pt-2">
                                <div className="flex gap-1">
                                {s.split('').map((char, idx) => {
                                    const isMatch = res && res.includes(idx);
                                    const isInWindow = i !== undefined && idx >= i && idx < i + totalLen;
                                    const isCurrentWord = wordIndex !== undefined && idx >= wordIndex && idx < wordIndex + wordLen;
                                    const isPartOfAnyMatch = res && res.some(r => idx >= r && idx < r + totalLen);
                                    
                                    let boxClass = "w-7 h-9 flex items-center justify-center font-mono font-bold text-sm rounded-md transition-all duration-300 border-2 ";
                                    let charClass = "text-slate-600";

                                    if (isCurrentWord) {
                                        boxClass += "bg-amber-100 border-amber-400 shadow-md scale-110 z-10";
                                        charClass = "text-amber-900";
                                    } else if (isInWindow && !isPartOfAnyMatch) {
                                        boxClass += "bg-blue-50 border-blue-200";
                                        charClass = "text-blue-800";
                                    } else if (isPartOfAnyMatch) {
                                        boxClass += "bg-emerald-100 border-emerald-300";
                                        charClass = "text-emerald-800";
                                    } else {
                                        boxClass += "bg-white border-slate-100";
                                    }

                                    return (
                                        <div key={`char-${idx}`} className="flex flex-col items-center relative">
                                            <span className={`text-[8px] font-mono mb-1 ${idx === i || isMatch ? 'text-blue-500 font-bold' : 'text-slate-300'}`}>{idx}</span>
                                            <div className={boxClass}>
                                                <span className={charClass}>{char}</span>
                                            </div>
                                            {isMatch && (
                                              <div className="absolute -bottom-3 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            )}
                                        </div>
                                    )
                                })}
                                </div>

                                {/* Active Window Bracket */}
                                {i !== undefined && totalLen > 0 && (
                                  <div 
                                    className="absolute bottom-0 h-1 bg-blue-400/50 rounded-full transition-all duration-300"
                                    style={{
                                      left: `${i * 32}px`, // approx width (w-7 = 28px + gap-1 = 4px)
                                      width: `${totalLen * 32 - 4}px`,
                                      display: 'block'
                                    }}
                                  />
                                )}
                            </div>
                        </div>
                      )}

                      {/* Middle/Bottom: Hash Maps Comparison Panel */}
                      {counts && (
                          <div className="w-full flex justify-center gap-8 px-4 h-full">
                              
                              {/* TARGET MAP */}
                              <div className="flex-1 flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-purple-500 tracking-widest font-mono mb-3 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 shadow-sm">Target (counts)</span>
                                  <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                      {Object.entries(counts).map(([w, c]) => (
                                          <div key={`target-${w}`} className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
                                              <span className="font-mono font-bold text-slate-700 text-sm">{w}</span>
                                              <span className="bg-slate-100 text-slate-600 font-mono font-black text-xs px-2 py-0.5 rounded">{c}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>

                              <div className="flex items-center text-slate-300">
                                  <ArrowRight size={24} />
                              </div>

                              {/* SEEN MAP */}
                              <div className="flex-1 flex flex-col items-center">
                                  <span className="text-[10px] font-black uppercase text-sky-500 tracking-widest font-mono mb-3 bg-sky-50 px-3 py-1 rounded-full border border-sky-100 shadow-sm">Current (seen)</span>
                                  <div className="flex flex-col gap-2 w-full max-w-[200px]">
                                      {seen ? Object.entries(counts).map(([w, targetCount]) => {
                                          const currentCount = seen[w] || 0;
                                          const isActive = word === w && (action === 'record' || action === 'failCount');
                                          const isOver = currentCount > targetCount;
                                          const isMet = currentCount === targetCount && currentCount > 0;
                                          
                                          let borderClass = "border-slate-200 bg-white";
                                          let countBg = "bg-slate-100 text-slate-600";
                                          
                                          if (isActive) {
                                              borderClass = isOver ? "border-rose-400 bg-rose-50 shadow-md scale-105 transition-all" : "border-amber-400 bg-amber-50 shadow-md scale-105 transition-all";
                                          } else if (isMet) {
                                              borderClass = "border-emerald-200 bg-emerald-50/50";
                                              countBg = "bg-emerald-100 text-emerald-700";
                                          } else if (isOver) {
                                              borderClass = "border-rose-200 bg-rose-50/50";
                                              countBg = "bg-rose-100 text-rose-700";
                                          } else if (currentCount > 0) {
                                              borderClass = "border-blue-200 bg-blue-50/50";
                                              countBg = "bg-blue-100 text-blue-700";
                                          }

                                          return (
                                              <div key={`seen-${w}`} className={`flex justify-between items-center border p-3 rounded-xl shadow-sm ${borderClass}`}>
                                                  <span className="font-mono font-bold text-slate-700 text-sm">{w}</span>
                                                  <span className={`font-mono font-black text-xs px-2 py-0.5 rounded ${countBg}`}>{currentCount}</span>
                                              </div>
                                          )
                                      }) : (
                                          <div className="text-slate-400 text-xs font-mono italic text-center mt-4">Window Empty</div>
                                      )}
                                      
                                      {/* Show invalid word if present */}
                                      {action === 'failInvalid' && word && !counts[word] && (
                                           <div className={`flex justify-between items-center border p-3 rounded-xl shadow-md border-rose-400 bg-rose-50 scale-105 transition-all mt-2`}>
                                              <span className="font-mono font-bold text-rose-700 text-sm line-through decoration-rose-400">{word}</span>
                                              <span className={`font-mono font-black text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-800`}>1</span>
                                          </div>
                                      )}
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
                              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter block mb-1">COMPLETED</span>
                              <span className={`text-sm font-black uppercase tracking-widest font-mono mb-4 block text-emerald-600`}>
                                  Found {res.length} valid substrings
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
                <Layers className="text-blue-600"/> Sliding Window & Hash Maps
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-blue-100 pl-6">
                Instead of generating all possible permutations of the words array (which takes <code>O(M!)</code> time), we can leverage a Sliding Window approach combined with Hash Maps to efficiently count and verify word frequencies within our string.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-8 bg-purple-50 border border-purple-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-purple-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Hash size={18}/> Frequency Maps
                        </h3>
                        <p className="text-sm text-purple-800 leading-relaxed mb-4">
                            First, we populate a <strong>Target Map</strong> with the counts of each word in the <code>words</code> array.
                        </p>
                        <div className="text-xs text-purple-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-purple-200 shadow-inner space-y-3">
                            <p>For example, if <code>words = ["foo", "bar", "foo"]</code>, our Target Map is: <br/> <code>&#123; foo: 2, bar: 1 &#125;</code></p>
                            <p>For every sliding window in our string, we create a temporary <strong>Seen Map</strong>. As we chop the window into chunks of <code>wordLength</code>, we record what we see and compare against the Target.</p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl space-y-4 shadow-sm h-full">
                        <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm">
                            <Activity size={18}/> Early Termination
                        </h3>
                        <p className="text-xs text-sky-800 leading-relaxed mb-4">
                            The real power of this algorithm is breaking out of the inner loop as soon as a window becomes invalid.
                        </p>
                        <div className="text-xs text-sky-800 leading-relaxed font-bold bg-white p-4 rounded-xl border border-sky-200 shadow-inner space-y-2">
                            <p><strong>Rule 1:</strong> If we extract a word that doesn't exist in our Target Map, this window is a bust. Break immediately.</p>
                            <p><strong>Rule 2:</strong> If we extract a valid word, but its count in our <code>Seen Map</code> suddenly exceeds the Target Map count, we have too many copies of it! Break immediately.</p>
                            <p>If we successfully extract <code>M</code> valid words without breaking, we've found a match!</p>
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
                        "For this problem, because all words are exactly the same length $L$, we don't need backtracking. I implemented a sliding window approach with two Hash Maps. First, I map the frequencies of the required words. Then, I iterate through the string with an outer index $i$ representing the start of a window of size $M \times L$. Inside the window, I jump by steps of $L$ to extract each word, counting them in a local 'seen' map. If I encounter an invalid word or exceed the required frequency of a valid word, I immediately break. While this implementation is $O(N \cdot M \cdot L)$, which is very good, I can further optimize this to true $O(N \cdot L)$ by staggering the starting offset from $0$ to $L-1$, allowing us to slide the inner window dynamically instead of resetting the 'seen' map from scratch every single time."
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                           <AlertCircle size={14} className="text-blue-500"/> FAQ: The fully optimal O(N * L) version
                        </h4>
                        <div className="space-y-3">
                            <div className="text-xs text-slate-600 leading-relaxed">
                                The code shown checks every index <code>i</code> independently, clearing the map each time. A more optimal approach runs the outer loop only <code>L</code> times (from 0 to <code>wordLen - 1</code>). Inside, it acts like a true sliding window: adding a word on the right, removing a word on the left, keeping a running hash map. This brings the time complexity strictly to $O(N \cdot L)$ but is trickier to implement cleanly. Both are usually acceptable in interviews!
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
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(N &times; M &times; L)</span>
                                <p className="text-[10px] text-slate-500 mt-1">Outer loop runs $N - M \times L$ times. Inner loop runs $M$ times (number of words). Inside, substring extraction takes $O(L)$ time. Hence, $O(N \cdot M \cdot L)$.</p>
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 block mb-1 uppercase">Space Complexity</span>
                                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">O(M)</span>
                                <p className="text-[10px] text-slate-500 mt-1">We store at most $M$ unique words in our two Hash Maps. Since each word length is bounded, space scales linearly with $M$.</p>
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
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 ${active ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'blue' }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\'.*?\'|\b(?:public|private|class|return|if|else|while|int|long|double|void|String|boolean|new|this|for|break|continue|char|List|Integer|Set|HashSet|Map|HashMap|Math|Arrays|ArrayList|ListNode|TreeNode|Stack|StringBuilder|put|getOrDefault|containsKey|add|remove|get|substring|length)\b|\b\d+(?:\.\d+)?\b)/g).filter(Boolean);
  
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
          if (['int', 'long', 'double', 'boolean', 'String', 'void', 'char', 'List', 'Integer', 'Set', 'HashSet', 'Map', 'HashMap', 'Math', 'Arrays', 'ArrayList', 'ListNode', 'TreeNode', 'Stack', 'StringBuilder'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['put', 'getOrDefault', 'containsKey', 'add', 'remove', 'get', 'substring', 'length'].includes(part)) return <span key={i} className="text-blue-300 font-bold">{part}</span>;
          if (['n', 'k', 's', 'words', 'res', 'wordLen', 'numWords', 'totalLen', 'counts', 'seen', 'i', 'j', 'wordIndex', 'word'].includes(part)) return <span key={i} className="text-purple-400 font-bold">{part}</span>;
          if (/^\d+(\.\d+)?$/.test(part)) return <span key={i} className="text-yellow-400">{part}</span>; // Numbers including floats
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SubstringConcatenationVisualizer;