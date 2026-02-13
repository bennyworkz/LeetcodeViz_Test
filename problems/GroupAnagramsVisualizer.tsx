
import React, { useState, useMemo } from 'react';
// Added missing 'BarChart3' icon to the lucide-react imports
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Layers, Hash, Database, Filter, Search, FileText, LayoutGrid, Calculator, BarChart3 } from 'lucide-react';

const APPROACHES = {
  sorting: {
    id: 'sorting',
    title: '1. Categorize by Sorting',
    subtitle: 'N * K log K',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N * K log K) | Space: O(NK)',
    code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs.length == 0) return new ArrayList<>();
        Map<String, List> ans = new HashMap<String, List>();
        for (String s : strs) {
            char[] ca = s.toCharArray();
            Arrays.sort(ca);
            String key = String.valueOf(ca);
            if (!ans.containsKey(key)) {
                ans.put(key, new ArrayList());
            }
            ans.get(key).add(s);
        }
        return new ArrayList(ans.values());
    }
}`,
    explanation: "Two strings are anagrams if and only if their sorted strings are equal. We use the sorted string as a 'signature' key for our HashMap buckets."
  },
  counting: {
    id: 'counting',
    title: '2. Categorize by Count',
    subtitle: 'Optimal O(NK)',
    icon: <Calculator size={16} />,
    complexity: 'Time: O(NK) | Space: O(NK)',
    code: `class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        if (strs.length == 0) return new ArrayList<>();
        Map<String, List> ans = new HashMap<String, List>();
        int[] count = new int[26];
        for (String s : strs) {
            Arrays.fill(count, 0);
            for (char c : s.toCharArray()) count[c - 'a']++;

            StringBuilder sb = new StringBuilder("");
            for (int i = 0; i < 26; i++) {
                sb.append('#');
                sb.append(count[i]);
            }
            String key = sb.toString();
            if (!ans.containsKey(key)) {
                ans.put(key, new ArrayList());
            }
            ans.get(key).add(s);
        }
        return new ArrayList(ans.values());
    }
}`,
    explanation: "Instead of sorting, we count the frequency of each character (a-z). A string's frequency distribution is a unique signature for its anagram group."
  }
};

const GroupAnagramsVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('sorting');
  const [strsInput, setStrsInput] = useState("eat,tea,tan,ate,nat,bat");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const strs = useMemo(() => strsInput.split(',').map(s => s.trim()).filter(s => s.length >= 0), [strsInput]);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = strs.length;
    const ansMap: Record<string, string[]> = {};

    const addStep = (phase: string, desc: string, line: number, state: any) => {
      steps.push({ 
        phase, 
        description: desc, 
        line, 
        state: { 
          ...state, 
          ansMap: JSON.parse(JSON.stringify(ansMap)),
          currentStrs: [...strs] 
        } 
      });
    };

    if (selectedApproach === 'sorting') {
      addStep("Initialization", "Check if input array is empty.", 3, {});
      if (n === 0) {
        addStep("Return", "Input is empty, returning empty list.", 3, { finished: true });
        return steps;
      }

      addStep("Initialization", "Initialize a HashMap to store grouped anagrams.", 4, {});

      for (let idx = 0; idx < strs.length; idx++) {
        const s = strs[idx];
        addStep("Process String", `Iteration ${idx}: Processing word "${s}".`, 5, { currentIdx: idx, s });

        const ca = s.split('');
        addStep("Transform", `Convert "${s}" to a character array.`, 6, { currentIdx: idx, s, ca: [...ca] });

        ca.sort();
        addStep("Sort", `Sort the character array: [${ca.join(',')}]`, 7, { currentIdx: idx, s, ca: [...ca] });

        const key = ca.join('');
        addStep("Generate Key", `Convert sorted array back to string to use as key: "${key}"`, 8, { currentIdx: idx, s, key });

        const exists = ansMap[key] !== undefined;
        addStep("Map Check", `Check if HashMap contains key "${key}"? ${exists ? "Yes" : "No"}`, 9, { currentIdx: idx, s, key, exists });

        if (!exists) {
          addStep("Create Bucket", `Key "${key}" not found. Creating a new list for this anagram group.`, 10, { currentIdx: idx, s, key, exists });
          ansMap[key] = [];
        }

        addStep("Add to Group", `Add "${s}" to the group belonging to key "${key}".`, 12, { currentIdx: idx, s, key, activeBucket: key });
        ansMap[key].push(s);
      }

      addStep("Return", "All words processed. Converting Map values to the final list.", 14, { finished: true });

    } else {
      // Counting Approach
      addStep("Initialization", "Check if input array is empty.", 3, {});
      addStep("Initialization", "Initialize HashMap and frequency count array buffer.", 4, {});

      for (let idx = 0; idx < strs.length; idx++) {
        const s = strs[idx];
        addStep("Process String", `Processing word "${s}".`, 6, { currentIdx: idx, s });

        const count = new Array(26).fill(0);
        addStep("Reset Buffer", "Filling character count buffer with 0s.", 7, { currentIdx: idx, s, count: [...count] });

        for (let char of s) {
          count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
        }
        addStep("Count Characters", `Generating frequency map for "${s}".`, 8, { currentIdx: idx, s, count: [...count] });

        let sb = "";
        for (let i = 0; i < 26; i++) {
          sb += `#${count[i]}`;
        }
        const key = sb;
        addStep("Build Key", `Building unique key from frequencies: "${key.substring(0, 15)}..."`, 15, { currentIdx: idx, s, key, count: [...count] });

        const exists = ansMap[key] !== undefined;
        addStep("Map Check", `Check if key exists in memory? ${exists ? "Yes" : "No"}`, 16, { currentIdx: idx, s, key, exists });

        if (!exists) {
          addStep("Create Bucket", `New anagram pattern detected. Initializing bucket.`, 17, { currentIdx: idx, s, key, exists });
          ansMap[key] = [];
        }

        addStep("Add to Group", `Pushing "${s}" into its corresponding group.`, 19, { currentIdx: idx, s, key, activeBucket: key });
        ansMap[key].push(s);
      }
      addStep("Return", "Algorithm finished. Aggregating all anagram groups.", 21, { finished: true });
    }

    return steps;
  }, [strs, selectedApproach]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleCopy = () => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const cur = trace[currentStep] || trace[0];
  const { currentIdx, s, key, ca, ansMap, count, finished, activeBucket } = cur.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-100 flex items-center justify-center">
                <LayoutGrid className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Group Anagrams</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-widest font-black text-[10px]">High Frequency</span>
                <span>LC 49 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-inner">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'problem' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 animate-in fade-in duration-700">
            <div className="max-w-3xl space-y-8">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 font-mono tracking-tighter">49. Group Anagrams</h2>
                <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
                  <p>Given an array of strings <code>strs</code>, group the <strong>anagrams</strong> together. You can return the answer in <strong>any order</strong>.</p>
                  <p>An <strong>Anagram</strong> is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example 1:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 font-mono text-sm space-y-3 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> strs = ["eat","tea","tan","ate","nat","bat"]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> [["bat"],["nat","tan"],["ate","eat","tea"]]</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Hash size={16}/> Example 2:
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 font-mono text-sm space-y-2 shadow-inner">
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Input:</span> strs = [""]</p>
                    <p><span className="text-slate-400 font-bold uppercase tracking-tighter">Output:</span> [[""]]</p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <AlertCircle size={14} /> Constraints:
                </h3>
                <ul className="list-disc list-inside space-y-3 text-sm font-mono text-slate-600 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">1 {'<='} strs.length {'<='} 10<sup>4</sup></code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">0 {'<='} strs[i].length {'<='} 100</code></li>
                  <li><code className="bg-slate-100 px-1.5 rounded text-slate-800">strs[i]</code> consists of lowercase English letters.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {(Object.keys(APPROACHES) as Array<keyof typeof APPROACHES>).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-indigo-600 text-white shadow-lg' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key].complexity}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-[#0f172a] rounded-3xl h-[520px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Code2 size={14} className="text-indigo-400" />
                    <span className="font-bold uppercase tracking-tight">GroupAnagrams.java</span>
                  </div>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    <div className="absolute left-0 right-0 bg-indigo-500/15 border-l-4 border-indigo-500 transition-all duration-300 pointer-events-none z-0" style={{ top: `${(cur.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                    ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Target size={18} />
                    <h4 className="text-sm font-black uppercase tracking-widest">Logic Insight</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">{APPROACHES[selectedApproach].explanation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-indigo-600 uppercase block pl-1 tracking-widest font-mono">Input Strings (comma separated)</label>
                  <input value={strsInput} onChange={(e) => { setStrsInput(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner" />
                </div>
                <div className="flex gap-3">
                  <button onClick={handlePrev} disabled={currentStep === 0} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <ChevronLeft size={16}/> Prev
                  </button>
                  <button onClick={handleNext} disabled={currentStep === trace.length - 1} className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                    Next Step <ChevronRight size={16}/>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900 text-white rounded-3xl p-7 shadow-2xl border border-slate-800 min-h-[160px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Search size={100}/>
                </div>
                <div className="flex items-center gap-2 mb-3">
                   <Target size={14} className="text-indigo-400"/>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 font-mono">Execution Context</span>
                </div>
                <div className="text-lg font-black tracking-tight mb-2 uppercase font-mono">
                    {cur.phase}
                </div>
                <p className="text-sm leading-relaxed text-slate-400 border-t border-slate-800/50 pt-3">{cur.description}</p>
              </div>

              {/* Simulation Arena */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 min-h-[500px] relative flex flex-col justify-between overflow-hidden shadow-inner transition-all duration-500">
                
                {/* State Variables Dashboard */}
                {!finished && (
                  <div className="w-full grid grid-cols-2 gap-4 z-10 mb-8">
                     <div className="bg-slate-50 rounded-3xl p-5 border border-slate-100 flex flex-col items-center justify-center shadow-sm relative overflow-hidden group">
                        <span className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest font-mono">Current Word</span>
                        <div className="text-2xl font-black text-indigo-600 font-mono">"{s ?? '...'}"</div>
                     </div>
                     <div className="bg-indigo-50/50 rounded-3xl p-5 border border-indigo-100 flex flex-col items-center justify-center shadow-sm">
                        <span className="text-[9px] font-black text-indigo-400 uppercase mb-1 tracking-widest font-mono">Key Identity</span>
                        <div className="text-xs font-black text-slate-800 font-mono truncate w-full text-center">
                            {key ? (key.length > 20 ? key.substring(0, 18) + '...' : key) : '---'}
                        </div>
                     </div>
                  </div>
                )}

                {/* Main Visual: Input Strings + Map Buckets */}
                <div className="flex-1 flex flex-col gap-10">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest font-mono">Input Data: strs[]</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">Total: {strs.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {strs.map((str, idx) => (
                                <div key={idx} className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all duration-300 border-2 ${currentIdx === idx ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-110' : 'bg-white text-slate-600 border-slate-100'}`}>
                                    {str || '""'}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-mono">HashMap State: [Key &rarr; List]</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400">Buckets: {Object.keys(ansMap || {}).length}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto scrollbar-thin pr-2">
                            {Object.entries(ansMap || {}).map(([mKey, mList]) => (
                                <div key={mKey} className={`p-4 rounded-2xl border-2 transition-all duration-500 ${activeBucket === mKey ? 'bg-emerald-50 border-emerald-500 shadow-md ring-4 ring-emerald-100 scale-[1.02]' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-tighter truncate font-mono">Key: {mKey}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(mList as string[]).map((val, vIdx) => (
                                            <span key={vIdx} className="px-2 py-0.5 bg-white border border-emerald-200 text-emerald-700 rounded-md text-[10px] font-bold font-mono">
                                                {val || '""'}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {Object.keys(ansMap || {}).length === 0 && (
                                <div className="col-span-full py-8 text-center text-slate-300 font-mono text-xs border-2 border-dashed border-slate-100 rounded-3xl">Memory is Currently Empty</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Final State Banner */}
                {finished && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-indigo-600/5 backdrop-blur-[4px] animate-in fade-in duration-1000">
                    <div className="bg-white border-2 border-indigo-100 px-12 py-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] flex flex-col items-center gap-6 transform -rotate-1 hover:rotate-0 transition-transform">
                      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-xl mb-2">
                          <Check size={48} strokeWidth={3}/>
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] block mb-2 font-mono">Groups Formed</span>
                        <div className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums drop-shadow-sm">{Object.keys(ansMap || {}).length}</div>
                        <div className="mt-4 px-6 py-2 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest font-mono">
                           Execution Complete
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
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3 font-mono">
                <BookOpen className="text-indigo-600"/> The Logic of Anagram Grouping
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed max-w-4xl">
                The core challenge is finding a <strong>unique identifier</strong> (key) that is identical for all anagrams but different for non-anagrams. This is an application of the <i>Bucket Sorting</i> pattern using HashMaps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-indigo-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Layers size={18}/> Key Strategy A: Sorted String</h3>
                        <p className="text-sm text-indigo-800 leading-relaxed">
                          By sorting the letters of a word, we remove the original order, leaving only the <strong>frequency and identity</strong> of characters. <code>"eat"</code>, <code>"tea"</code>, and <code>"ate"</code> all become <code>"aet"</code>.
                        </p>
                        <div className="bg-white/50 p-3 rounded-xl border border-indigo-100 text-[11px] font-mono text-indigo-600 italic">
                            Cost: O(K log K) per word.
                        </div>
                    </div>
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl space-y-3 shadow-sm">
                        <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm font-mono"><Hash size={18}/> Key Strategy B: Frequency Array</h3>
                        <p className="text-sm text-emerald-700 leading-relaxed">
                          For small alphabets (like lowercase a-z), we can use an array of size 26. This is mathematically equivalent to sorting but performs in linear time. <code>"eat" &rarr; [1,0,0,0,1,0...1,0]</code>.
                        </p>
                        <div className="bg-white/50 p-3 rounded-xl border border-indigo-100 text-[11px] font-mono text-emerald-600 italic">
                            Cost: O(K) per word.
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 flex flex-col justify-center gap-6 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <Database size={140} />
                    </div>
                    <div className="flex items-center gap-4 relative z-10">
                      <BarChart3 size={32} className="text-indigo-400" />
                      <h4 className="font-black uppercase tracking-widest text-xs font-mono">Efficiency Metrics</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-6 relative z-10">
                      <div className="p-5 bg-slate-800/80 rounded-3xl border border-slate-700 backdrop-blur-sm">
                          <span className="text-[10px] text-slate-500 block mb-1 uppercase font-black font-mono">Time Complexity</span>
                          <div className="font-mono text-2xl font-black text-indigo-400">O(NK)</div>
                          <p className="text-[10px] text-slate-500 mt-2">N strings, average length K.</p>
                      </div>
                      <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
                          <span className="text-[10px] text-indigo-200 block mb-1 uppercase font-black font-mono">Space Complexity</span>
                          <div className="font-mono text-2xl font-black">O(NK)</div>
                          <p className="text-[10px] text-indigo-200 mt-2">To store all input data in the Map.</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed italic relative z-10 font-mono">
                      "While Sorting is slightly slower asymptotically, for short words (K &lt; 10), it is often faster in practice due to lower constant overhead than string building."
                    </p>
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
                        <Trophy size={24} /> Senior Interview Pitch
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 font-mono">
                        "For high-volume string processing, I implemented a grouping strategy leveraging HashMaps. By mapping each string to a canonical representation—either via sorting or frequency counting—we reduce the comparison problem to a constant-time lookup. In the 'Categorize by Count' approach, we achieve a strict linear O(NK) runtime, which is theoretically optimal as we must visit every character at least once. This demonstrates a deep understanding of memory management and algorithmic scaling."
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm space-y-6">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tighter font-mono">
                        <MessageSquare className="text-indigo-500" size={20} /> Candidate Q&A
                    </h3>
                    <div className="space-y-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"What are the edge cases for this problem?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "1. Empty input array (return empty list).<br/>
                                2. Single-character strings (groups of 1).<br/>
                                3. Strings of different lengths (can never be anagrams).<br/>
                                4. Strings with non-alphabetical characters (key generator needs to handle these)."
                            </p>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-colors">
                            <p className="text-sm font-black text-slate-800 mb-2 uppercase tracking-tighter font-mono">"Why not use Nested Loops O(N²K)?"</p>
                            <p className="text-xs text-slate-600 leading-relaxed font-mono">
                                "Checking every string against every other string using a character-count comparison takes O(N²K). For N=10,000, this results in 100 million comparisons, which is prohibitively slow. The HashMap approach reduces this to O(N) comparisons total."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-[2rem] p-8 shadow-sm">
                    <h3 className="text-lg font-black text-indigo-900 mb-6 uppercase tracking-widest flex items-center gap-2 font-mono">
                        <AlertCircle size={20}/> Amazon Leadership Focus
                    </h3>
                    <ul className="space-y-8">
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">1</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Invent and Simplify</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Highlight how the HashMap transforms a complex relationship search into a simple categorization task.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-200 text-indigo-700 flex items-center justify-center font-black text-sm shrink-0 shadow-sm font-mono">2</div>
                            <div>
                              <p className="text-sm font-black text-indigo-900 uppercase tracking-tight font-mono">Dive Deep</p>
                              <p className="text-xs text-indigo-800 leading-relaxed mt-1 font-mono">Discuss the internal mechanics of your HashMap: collision handling, hashing of the key string, and potential for using specialized hashing for large alphabets.</p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center border border-slate-200 shadow-sm">
                    <BarChart3 className="text-slate-400 mb-3" size={48} />
                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest text-center mb-6 font-mono">Efficiency Benchmark</p>
                    <div className="space-y-4 w-full">
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Brute O(N²K)</span>
                                <span className="text-rose-500 font-black font-mono">~100M Ops</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-400 w-full" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="text-slate-400 font-bold uppercase font-mono">Optimized O(NK)</span>
                                <span className="text-indigo-500 font-black font-mono">~1M Ops</span>
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

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all duration-300 ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Map|HashMap|ArrayList|List|Arrays|sort|fill|toCharArray|valueOf|containsKey|put|get|values|append|toString)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] transition-colors duration-300 ${active ? 'bg-indigo-500/10 font-bold' : ''}`}>
      <span className="w-10 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none shrink-0">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-orange-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean'].includes(part)) return <span key={i} className="text-sky-400">{part}</span>;
          if (['Map', 'HashMap', 'ArrayList', 'List', 'Arrays', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['sort', 'fill', 'toCharArray', 'valueOf', 'containsKey', 'put', 'get', 'values', 'append', 'toString'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default GroupAnagramsVisualizer;
