
import React, { useState, useMemo } from 'react';
import { RotateCcw, ChevronRight, ChevronLeft, Activity, BookOpen, Code2, Check, Copy, AlignLeft, Zap, Trophy, MessageSquare, Target, AlertCircle, Cpu, Maximize, MousePointer2, Calculator, Search, FileText } from 'lucide-react';

const APPROACHES = {
  optimal: {
    id: 'optimal',
    title: '1. Optimized Window',
    subtitle: 'HashMap Tracker',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(min(m, n))',
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length(), ans = 0;
        Map<Character, Integer> map = new HashMap<>(); // character -> next index
        for (int j = 0, i = 0; j < n; j++) {
            if (map.containsKey(s.charAt(j))) {
                i = Math.max(map.get(s.charAt(j)), i);
            }
            ans = Math.max(ans, j - i + 1);
            map.put(s.charAt(j), j + 1);
        }
        return ans;
    }
}`,
    explanation: "This is the most efficient sliding window technique. As we scan with pointer 'j', we store each character's position in a Map. If we see a repeat, we instantly 'jump' the left pointer 'i' to the position after the previous occurrence."
  },
  sliding: {
    id: 'sliding',
    title: '2. Standard Window',
    subtitle: 'HashSet Shrinking',
    icon: <Search size={16} />,
    complexity: 'Time: O(2N) | Space: O(min(m, n))',
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        Set<Character> set = new HashSet<>();
        int ans = 0, i = 0, j = 0;
        while (i < n && j < n) {
            if (!set.contains(s.charAt(j))) {
                set.add(s.charAt(j++));
                ans = Math.max(ans, j - i);
            } else {
                set.remove(s.charAt(i++));
            }
        }
        return ans;
    }
}`,
    explanation: "A more common Sliding Window implementation. We expand the window from the right. If we hit a duplicate, we shrink from the left character-by-character until the window is valid again."
  },
  brute: {
    id: 'brute',
    title: '3. Brute Force',
    subtitle: 'Check All Substrings',
    icon: <AlertCircle size={16} />,
    complexity: 'Time: O(N³) | Space: O(min(n, m))',
    code: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        int n = s.length();
        int res = 0;
        for (int i = 0; i < n; i++) {
            for (int j = i; j < n; j++) {
                if (allUnique(s, i, j)) {
                    res = Math.max(res, j - i + 1);
                }
            }
        }
        return res;
    }
}`,
    explanation: "Checks every possible substring in the string to see if it contains unique characters. This is extremely slow for long inputs."
  }
};

const LongestSubstringVisualizer = () => {
  const [activeTab, setActiveTab] = useState<'problem' | 'visualizer' | 'learn' | 'interview'>('visualizer');
  const [selectedApproach, setSelectedApproach] = useState<keyof typeof APPROACHES>('optimal');
  const [inputS, setInputS] = useState("abcabcbb");
  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = inputS.length;
    let finalAns = 0;

    const addStep = (phase: string, desc: string, line: number, state: any) => {
        steps.push({ phase, description: desc, line, state });
    };
    
    if (selectedApproach === 'optimal') {
      addStep("Strategy Selection", "To find the longest unique sequence, we could check all O(N²) substrings, but that's slow. We'll use a 'Sliding Window' with a HashMap. A Map allows us to 'teleport' the window when a duplicate hits, avoiding redundant checks.", 3, { i: 0, j: -1, ans: 0, map: {} });

      addStep("Understanding the Window", "Window starts at i=0. The HashMap will store the LAST SEEN position of characters. If we see a character again, we move 'i' past its previous location immediately.", 5, { i: 0, j: -1, ans: 0, map: {} });

      let ans = 0;
      let i = 0;
      const map: Record<number, number> = {};
      for (let j = 0; j < n; j++) {
        const char = inputS[j];
        if (map[char] !== undefined) {
          i = Math.max(map[char], i);
          addStep("Instant Jump", `Repeated character '${char}' detected. Jumping left boundary 'i' to ${i}.`, 6, { i, j, ans, map: { ...map } });
        }
        ans = Math.max(ans, j - i + 1);
        map[char] = j + 1;
        addStep("Expand Window", `Right pointer 'j' at index ${j} ('${char}'). Substring [${i}...${j}] is valid. Length: ${j-i+1}. Peak: ${ans}.`, 8, { i, j, ans, map: { ...map } });
      }
      finalAns = ans;
    } else if (selectedApproach === 'sliding') {
        let i = 0, j = 0, ans = 0;
        const set = new Set<string>();
        addStep("Init", "Initialize pointers i, j at the start.", 4, { i, j, ans, set: new Set() });
        while (j < n) {
            const char = inputS[j];
            if (!set.has(char)) {
                set.add(char);
                j++;
                ans = Math.max(ans, j - i);
                addStep("Add", `Added '${char}'. Window is valid. Expanding right.`, 8, { i, j, ans, set: new Set(set) });
            } else {
                const removedChar = inputS[i];
                set.delete(removedChar);
                i++;
                addStep("Shrink", `Duplicate found. Shrinking left boundary. Removed '${removedChar}'.`, 11, { i, j, ans, set: new Set(set) });
            }
        }
        finalAns = ans;
    } else {
        // Brute Force
        let ans = 0;
        addStep("Start Brute Force", "We will check every possible substring (i, j) for uniqueness.", 3, { i: -1, j: -1, ans: 0 });
        for (let i = 0; i < n; i++) {
            for (let j = i; j < n; j++) {
                const sub = inputS.substring(i, j + 1);
                const unique = new Set(sub.split('')).size === sub.length;
                if (unique) {
                    ans = Math.max(ans, j - i + 1);
                }
                addStep("Check Substring", `Checking "${sub}" [${i}...${j}]. Unique: ${unique}. Max so far: ${ans}`, 7, { i, j, ans });
            }
        }
        finalAns = ans;
    }

    addStep("Finish", `Scan complete. Maximum unique length found is ${finalAns}.`, 11, { ...steps[steps.length-1]?.state, finished: true });
    return steps;
  }, [inputS, selectedApproach]);

  const currentState = trace[currentStep] || trace[0];
  const { i: left, j: right, ans, map: currentMap, set: currentSet, finished } = currentState.state;

  return (
    <div className="bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-full">
      <div className="max-w-7xl w-full space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-600 p-3 rounded-xl shadow-lg shadow-orange-200">
                <Maximize className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Longest Substring</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-0.5">
                <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-tighter font-black">Amazon Prep</span>
                <span>LC 3 • Medium</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TabButton active={activeTab === 'problem'} onClick={() => setActiveTab('problem')} icon={<AlignLeft size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<Activity size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Learn" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'problem' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-6">3. Longest Substring Without Repeating Characters</h2>
            <div className="prose prose-slate max-w-none text-slate-600 space-y-4 text-lg leading-relaxed">
              <p>Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.</p>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 font-mono text-sm space-y-2 mt-6">
                <p><span className="text-slate-400 font-bold uppercase">Input:</span> s = "abcabcbb"</p>
                <p><span className="text-slate-400 font-bold uppercase">Output:</span> 3</p>
                <p className="text-slate-400 italic text-xs mt-2">Explanation: The answer is "abc", with the length of 3.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="flex flex-col gap-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-2 flex gap-2">
                {Object.keys(APPROACHES).map((key) => (
                  <button key={key} onClick={() => { setSelectedApproach(key as any); setCurrentStep(0); }} className={`flex-1 flex flex-col items-center justify-center py-4 px-3 rounded-xl transition-all duration-300 ${selectedApproach === key ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}>
                    <span className="text-xs font-black uppercase tracking-tight">{APPROACHES[key as keyof typeof APPROACHES].title}</span>
                    <span className={`text-[10px] opacity-70 ${selectedApproach === key ? 'text-white' : 'text-slate-400'}`}>
                      {APPROACHES[key as keyof typeof APPROACHES].complexity}
                    </span>
                  </button>
                ))}
              </div>
              <div className="bg-[#0f172a] rounded-2xl h-[400px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                <div className="bg-[#1e293b] px-4 py-2 border-b border-slate-700 flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span className="font-bold uppercase tracking-tight">LongestSubstring.java</span>
                  <button onClick={() => { navigator.clipboard.writeText(APPROACHES[selectedApproach].code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}>
                    {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="p-6 font-mono text-[13px] overflow-auto relative">
                    <div className="absolute left-0 right-0 bg-orange-500/15 border-l-4 border-orange-500 pointer-events-none z-0 transition-all duration-300" style={{ top: `${(currentState.line * 20.8) + 24 - 20.8}px`, height: '20.8px' }} />
                    {APPROACHES[selectedApproach].code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={currentState.line === idx + 1} />
                    ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="space-y-1.5 mb-6">
                  <label className="text-[10px] font-black text-orange-600 uppercase block pl-1 tracking-widest">Input String</label>
                  <input value={inputS} onChange={(e) => { setInputS(e.target.value); setCurrentStep(0); }} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} disabled={currentStep === 0} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30 hover:bg-slate-200 transition-colors">Prev</button>
                  <button onClick={() => setCurrentStep(prev => Math.min(trace.length - 1, prev + 1))} disabled={currentStep === trace.length - 1} className="flex-[2] py-3 bg-orange-600 text-white rounded-xl font-bold disabled:opacity-30 shadow-lg hover:bg-orange-700 transition-colors">Next Action</button>
                </div>
              </div>

              <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-xl border border-slate-700 min-h-[120px]">
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-2 tracking-widest">{currentState.phase}</span>
                <p className="text-sm text-slate-200 leading-relaxed">{currentState.description}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-10 min-h-[350px] flex flex-col justify-center items-center gap-10 relative overflow-hidden">
                <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Current Width</span>
                        <div className="text-2xl font-black text-slate-800 tabular-nums">{(right >= left ? right - left + 1 : 0)}</div>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col items-center">
                        <span className="text-[10px] font-black text-orange-400 uppercase mb-1 tracking-tighter">Peak Length</span>
                        <div className="text-2xl font-black text-orange-600 tabular-nums">{ans}</div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {inputS.split('').map((char, idx) => {
                    const isInWindow = idx >= left && idx <= right;
                    const isRight = right === idx;
                    return (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`w-10 h-12 border-2 rounded-lg flex items-center justify-center font-mono text-lg transition-all duration-300 relative ${isRight ? 'bg-orange-600 border-orange-700 text-white scale-110 shadow-lg' : isInWindow ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-white border-slate-100 text-slate-200'}`}>
                          {char}
                          {idx === left && right >= left && !finished && <div className="absolute -top-5 text-indigo-500 font-black text-[8px] tracking-tighter uppercase">Left</div>}
                        </div>
                        <span className="mt-1 text-[8px] font-mono text-slate-300">[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full flex flex-col items-center border-t border-slate-100 pt-6">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest flex items-center gap-2">
                      <Search size={12}/> Character Map / Set
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {selectedApproach === 'optimal' ? (
                            Object.entries(currentMap || {}).map(([k, v]) => (
                                <div key={k} className="px-2 py-1 bg-slate-50 border rounded-lg text-[10px] font-mono animate-in fade-in shadow-sm">
                                    <span className="font-bold text-orange-600">'{k}':</span> {v as number}
                                </div>
                            ))
                        ) : (
                            Array.from(currentSet || []).map((v: any) => (
                                <div key={v} className="px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-[10px] font-mono animate-in zoom-in shadow-sm">
                                    '{v}'
                                </div>
                            ))
                        )}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[500px] animate-in fade-in">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">The Sliding Window Protocol</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2"><Zap size={20}/> Why Jump?</h3>
                      <p className="text-slate-600 text-lg leading-relaxed">Most naive sliding windows shrink the left side by one step at a time. The <strong>Optimized HashMap Window</strong> doesn't waste time: it checks the map for the last position of the current character and 'teleports' the left pointer immediately past it.</p>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl text-white font-mono text-xs space-y-3 shadow-xl border border-slate-800">
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/> Found 'a' at index 2</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-rose-500"/> Encounter 'a' again at index 5</div>
                        <div className="flex items-center gap-2 border-l-2 border-indigo-500 pl-4 py-1 text-indigo-400 font-bold uppercase tracking-wider">Action: Teleport Window</div>
                        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> Jump Left pointer to 3</div>
                    </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Calculator size={20}/> Complexity Analysis</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">By using a HashMap, we visit each character exactly once with the right pointer. The left pointer never needs to "catch up" slowly.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center shadow-sm">
                        <div className="text-[10px] font-black text-orange-400 uppercase mb-1">Time</div>
                        <div className="text-2xl font-black text-orange-600">O(N)</div>
                        <div className="text-[9px] text-orange-400 uppercase mt-1">Single Linear Pass</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center shadow-sm">
                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Space</div>
                        <div className="text-2xl font-black text-slate-800">O(m)</div>
                        <div className="text-[9px] text-slate-400 uppercase mt-1">Alphabet Size</div>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'interview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-slate-800">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Calculator size={120} />
                  </div>
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-orange-400 relative z-10 font-black tracking-tight uppercase">
                    <Trophy size={20} /> Amazon Interview Defense
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed italic relative z-10">
                    "Amazon interviewers often use this question to test your ability to move from O(N²) to O(N). If you solve it with a HashSet (shrinking left one by one), they will ask if you can make it faster. Mentioning the 'Insta-Jump' with a HashMap or an ASCII array (for constant space O(128)) shows you care about extreme performance and numerical precision."
                  </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2 font-black">
                    <MessageSquare className="text-orange-500" size={18}/> Technical Q&A
                  </h3>
                  <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">"What if the string contains symbols or numbers?"</p>
                          <p className="text-xs text-slate-600 leading-relaxed italic">"The logic remains identical. The HashMap or ASCII-128 array handles any printable character. If the range is larger (UTF-8), the HashMap approach remains superior as it stays proportional to the input size."</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">"Can we avoid using the HashMap object?"</p>
                          <p className="text-xs text-slate-600 leading-relaxed italic">"Yes, by using an <code>int[128]</code> array. We use character codes as indices. This avoids object overhead and is often preferred in performance-critical low-level code at scale."</p>
                      </div>
                  </div>
              </div>
            </div>
            <div className="space-y-6">
                <div className="bg-orange-50 border border-orange-200 rounded-3xl p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-orange-900 mb-4 uppercase tracking-widest flex items-center gap-2 font-black">
                        <AlertCircle size={20}/> Interviewer Focus
                    </h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">1</div>
                            <div>
                              <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Window Shrinking vs Jumping</p>
                              <p className="text-xs text-orange-800 leading-relaxed mt-1">Be ready to explain why <code>i = Math.max(map.get(s.charAt(j)), i)</code> is used instead of just <code>i = map.get(s.charAt(j))</code>. (Hint: the last seen character might be behind the current window start).</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">2</div>
                            <div>
                              <p className="text-sm font-black text-orange-900 uppercase tracking-tight">Empty Inputs</p>
                              <p className="text-xs text-orange-800 leading-relaxed mt-1">A string of length 0 should return 0. The current loop handles this naturally since <code>j &lt; n</code> is immediately false.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all ${active ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{icon} {label}</button>
);

const CodeLineRenderer: React.FC<{ num: number; code: string; active?: boolean }> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|\".*?\"|\b(?:public|class|return|if|else|while|int|void|String|boolean|new|this|for|Map|HashMap|HashSet|Set|Character|Integer|containsKey|contains|get|add|remove|put|length|max|charAt)\b|\b\d+\b)/g).filter(Boolean);
  return (
    <div className={`flex relative z-10 min-h-[20.8px] ${active ? 'font-bold bg-orange-500/5' : ''}`}>
      <span className="w-8 text-right pr-4 text-slate-700 border-r border-slate-800/50 mr-4 font-mono text-[11px] select-none">{num}</span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-70'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"')) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'for'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'boolean', 'void'].includes(part)) return <span key={i} className="text-sky-400">{part}</span>;
          if (['Map', 'HashMap', 'Integer', 'String'].includes(part)) return <span key={i} className="text-yellow-400 font-bold">{part}</span>;
          if (['containsKey', 'contains', 'get', 'add', 'remove', 'put', 'length', 'max', 'charAt'].includes(part)) return <span key={i} className="text-blue-400">{part}</span>;
          if (/^\d+$/.test(part)) return <span key={i} className="text-rose-400">{part}</span>;
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default LongestSubstringVisualizer;
