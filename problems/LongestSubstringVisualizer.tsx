import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, Hash, SplitSquareHorizontal, ScanLine, Zap, Database
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  slidingWindowSet: {
    id: 'slidingWindowSet',
    title: '1. Sliding Window (HashSet)',
    icon: <ScanLine size={16} />,
    complexity: 'Time: O(N) | Space: O(K)',
    code: `public int lengthOfLongestSubstring(String s) {
    Set<Character> set = new HashSet<>();
    int left = 0, maxLen = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        
        // If duplicate found, shrink window from the left
        while (set.contains(c)) {
            set.remove(s.charAt(left));
            left++;
        }
        
        // Add current char and update max
        set.add(c);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    
    return maxLen;
}`,
    desc: "The standard Sliding Window approach. We use a HashSet to keep track of characters in the current window. The 'right' pointer expands the window. If we encounter a character already in the Set, we use a while loop to increment the 'left' pointer, removing characters from the Set until the duplicate is gone."
  },
  slidingWindowMap: {
    id: 'slidingWindowMap',
    title: '2. Optimized Window (HashMap)',
    icon: <Zap size={16} />,
    complexity: 'Time: O(N) | Space: O(K)',
    code: `public int lengthOfLongestSubstring(String s) {
    int n = s.length(), ans = 0;
    Map<Character, Integer> map = new HashMap<>(); 
    for (int j = 0, i = 0; j < n; j++) {
        if (map.containsKey(s.charAt(j))) {
            i = Math.max(map.get(s.charAt(j)), i);
        }
        ans = Math.max(ans, j - i + 1);
        map.put(s.charAt(j), j + 1);
    }
    return ans;
}`,
    desc: "The Optimized Sliding Window. Instead of slowly inching the 'left' pointer forward, we use a HashMap to store the NEXT index (j+1) for each character. When we find a duplicate, we instantly JUMP the 'left' pointer (i) to the index right after the previous occurrence. This is strictly O(N) with fewer operations."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'fuchsia' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|break|new|length|char|String|charAt|Math|max|Set|HashSet|Map|HashMap|contains|containsKey|add|remove|put|get)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'fuchsia' 
    ? { bg: `bg-fuchsia-500/20`, border: `border-fuchsia-400`, text: `text-fuchsia-300` }
    : { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new', 'char'].includes(part);
            const isObject = ['String', 'Math', 'Set', 'HashSet', 'Map', 'HashMap'].includes(part);
            const isVar = ['s', 'left', 'right', 'c', 'set', 'map', 'maxLen', 'ans', 'i', 'j', 'n'].includes(part);
            const isMapCall = ['length', 'charAt', 'max', 'contains', 'containsKey', 'add', 'remove', 'put', 'get'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return (
              <span key={idx} className={className}>
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
}

const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position }) => {
    const colorClasses = {
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
        sky: 'bg-sky-100 text-sky-700 border-sky-300',
        fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
                {String(label)}
            </span>
            {position === 'top' ? <ArrowDown size={14} className={`text-${color}-500`} strokeWidth={3}/> : <ArrowUp size={14} className={`text-${color}-500`} strokeWidth={3}/>}
        </div>
    );
};

interface NodeBlockProps {
  val: string | null;
  idx?: number;
  themeColor?: string;
  isTarget?: boolean;
  inWindow?: boolean;
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget, inWindow = false }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];

    // Special highlighting for items currently inside the sliding window
    if (inWindow && themeColor === 'slate') {
        activeTheme = { bg: 'bg-indigo-50/50', border: 'border-indigo-300 border-dashed', text: 'text-indigo-900', index: 'bg-indigo-100/50 text-indigo-500' };
    }

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300').replace(' border-dashed','')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[44px] min-h-[52px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl md:text-2xl px-1 py-1 bg-white/60 ${activeTheme.text}`}>
                    {displayVal}
                </div>
                {idx !== undefined && (
                    <div className={`flex w-full h-4 md:h-5 border-t border-black/10 ${activeTheme.index}`}>
                        <div className="flex-1 flex items-center justify-center">
                             <span className="text-[8px] md:text-[9px] font-black tracking-widest uppercase">{idx}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Application ---

export default function LongestSubstringVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('slidingWindowMap');
  
  const [inputString, setInputString] = useState('abcabcbb');
  const [baseStr, setBaseStr] = useState('');
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(1); 
  };

  const handleNext = () => { 
    if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); 
  };
  
  const handlePrev = () => { 
    if (currentStep > 0) setCurrentStep(prev => prev - 1); 
  };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // Keep it short to avoid massive trace steps
    setBaseStr(inputString.substring(0, 15).replace(/\s/g, '')); 
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
  }, [inputString, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e) => {
        if (!canvasContainerRef.current?.contains(e.target)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const trace = useMemo(() => {
    const steps = [];
    if (!baseStr || baseStr.length === 0) return [{ phase: 'Init', description: 'Enter a valid string.', line: 0, state: { sArr: [] } }];

    let sArr = baseStr.split('');
    let n = sArr.length;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, 
        description: ds, 
        line: ln, 
        state: { 
            sArr: [...sArr],
            n,
            ...st 
        } 
    });

    if (selectedOpId === 'slidingWindowSet') {
        let left = 0, maxLen = 0;
        let set = []; // Emulate Set behavior for visualizer tracking
        
        add("Init Variables", `Initialize HashSet to track characters in the window. Start 'left' at 0, 'maxLen' at 0.`, 3, { left, maxLen, set: [...set] });

        for (let right = 0; right < n; right++) {
            let c = sArr[right];
            add("Expand Window", `for (int right = ${right}...); Read character '${c}'.`, 5, { left, right, maxLen, set: [...set], hlRight: true });
            
            add("Check Duplicate", `while (set.contains('${c}')) -> Does the Set already contain '${c}'?`, 8, { left, right, maxLen, set: [...set], checkingSet: true, curChar: c });

            while (set.includes(c)) {
                add("Duplicate Found", `Yes! '${c}' is a duplicate. We must shrink the window from the left to remove it.`, 8, { left, right, maxLen, set: [...set], isDup: true, curChar: c });
                
                let removedChar = sArr[left];
                set = set.filter(x => x !== removedChar); // remove single instance behavior (HashSet simulation for unique chars)
                
                add("Shrink Window", `set.remove('${removedChar}'); left++; Ejected left character from Set.`, 10, { left: left + 1, right, maxLen, set: [...set], justRemoved: removedChar, curChar: c });
                left++;
                
                add("Re-Check Duplicate", `while (set.contains('${c}')) -> Does the Set STILL contain '${c}'?`, 8, { left, right, maxLen, set: [...set], checkingSet: true, curChar: c });
            }

            set.push(c);
            add("Add to Set", `No duplicate present. Add '${c}' to the Set. The window [${left}...${right}] is now valid!`, 13, { left, right, maxLen, set: [...set], justAdded: c });
            
            let curLen = right - left + 1;
            let oldMax = maxLen;
            maxLen = Math.max(maxLen, curLen);
            
            add("Update Max Length", `maxLen = Math.max(${oldMax}, ${right} - ${left} + 1) -> max(${oldMax}, ${curLen}) = ${maxLen}.`, 14, { left, right, maxLen, set: [...set], curLen, maxUpdated: maxLen !== oldMax });
        }

        add("Return Result", `End of string reached. Return maxLen = ${maxLen}.`, 17, { maxLen, isSuccess: true });

    } else if (selectedOpId === 'slidingWindowMap') {
        let i = 0, ans = 0;
        let map = new Map();
        
        add("Init Variables", `int n = ${n}, ans = 0; Map tracks next index (j+1) for each char.`, 2, { left: i, maxLen: ans, mapState: new Map(map) });

        for (let j = 0; j < n; j++) {
            let c = sArr[j];
            add("Expand Window", `for (int j = ${j}...); Read character '${c}'.`, 4, { left: i, right: j, maxLen: ans, mapState: new Map(map), hlRight: true });
            
            add("Check Map", `if (map.containsKey('${c}')) -> Have we seen '${c}' before?`, 5, { left: i, right: j, maxLen: ans, mapState: new Map(map), checkingMap: true, curChar: c });

            if (map.has(c)) {
                let lastSeenNextIdx = map.get(c);
                let oldI = i;
                i = Math.max(lastSeenNextIdx, i);
                
                add("Jump Left Pointer", `Yes! We saw it earlier. Jump 'i' pointer to Math.max(${lastSeenNextIdx}, ${oldI}) = ${i}.`, 6, { left: i, right: j, maxLen: ans, mapState: new Map(map), curChar: c, jumped: true, oldLeft: oldI });
            } else {
                add("No Duplicate", `No. It's a new character. 'i' pointer stays at ${i}.`, 5, { left: i, right: j, maxLen: ans, mapState: new Map(map), curChar: c });
            }

            let curLen = j - i + 1;
            let oldAns = ans;
            ans = Math.max(ans, curLen);
            
            add("Update Max Length", `ans = Math.max(${oldAns}, ${j} - ${i} + 1) -> max(${oldAns}, ${curLen}) = ${ans}.`, 8, { left: i, right: j, maxLen: ans, mapState: new Map(map), curLen, maxUpdated: ans !== oldAns });

            map.set(c, j + 1);
            add("Update Map", `map.put('${c}', ${j + 1}); Record NEXT index to jump to if seen again.`, 9, { left: i, right: j, maxLen: ans, mapState: new Map(map), justMapped: c });
        }

        add("Return Result", `End of string reached. Return ans = ${ans}.`, 11, { maxLen: ans, isSuccess: true });
    }

    return steps;
  }, [baseStr, selectedOpId]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { sArr: [] } };
  const st = curStepData.state || { sArr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'slidingWindowMap' ? 'fuchsia' : 'sky';

  // --- Rendering Helpers ---

  const renderStringArray = (isTheater = false) => {
      if (!st.sArr || st.sArr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center relative">
                  
                  {st.sArr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let labels = [];
                      let isWindow = false;

                      if (st.left !== undefined && st.right !== undefined) {
                          if (idx >= st.left && idx <= st.right) {
                              isWindow = true; // Highlight the active sliding window
                          }
                      }

                      if (st.left === idx) {
                          color = 'sky'; isHl = true;
                          labels.push({ text: selectedOpId === 'slidingWindowMap' ? 'i' : 'left', color: 'sky', pos: 'bottom' });
                      }
                      
                      if (st.right === idx) {
                          color = 'fuchsia'; isHl = true;
                          labels.push({ text: selectedOpId === 'slidingWindowMap' ? 'j' : 'right', color: 'fuchsia', pos: 'top' });
                      }

                      // Highlighting dup check focus
                      if (st.hlRight && st.right === idx) {
                          color = 'amber';
                      }

                      if (st.isDup && st.right === idx) {
                          color = 'rose';
                      }
                      
                      // Highlight old left during a jump
                      if (st.jumped && st.oldLeft === idx) {
                          labels.push({ text: 'old i', color: 'slate', pos: 'bottom' });
                      }

                      return (
                          <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                              
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} inWindow={isWindow} />
                          </div>
                      )
                  })}
              </div>

              {/* Data Structure Tracker (Set or Map) */}
              <div className="flex flex-col md:flex-row gap-6 mt-8 w-full max-w-4xl justify-center">
                  
                  {/* Set Bucket */}
                  {selectedOpId === 'slidingWindowSet' && st.set !== undefined && (
                      <div className={`flex-1 px-6 py-4 border-[3px] rounded-[2rem] flex flex-col items-center shadow-lg transition-all duration-500 bg-sky-50/50 border-sky-200`}>
                          <div className="flex items-center gap-2 mb-3">
                              <Hash size={18} className="text-sky-500" />
                              <span className="text-sm font-black uppercase tracking-widest text-sky-700">HashSet</span>
                          </div>
                          <div className="flex flex-wrap gap-2 justify-center w-full min-h-[40px]">
                              {st.set.length === 0 ? (
                                  <span className="font-mono text-sky-300 italic text-sm">Empty</span>
                              ) : (
                                  st.set.map((charVal, idx) => {
                                      const isRecent = st.justAdded === charVal;
                                      const isChecking = st.checkingSet && st.curChar === charVal;
                                      const isRemoving = st.justRemoved === charVal;
                                      
                                      let boxColor = 'bg-white border-sky-300 text-sky-800';
                                      let transform = 'scale-100';
                                      
                                      if (isRecent) { boxColor = 'bg-emerald-500 border-emerald-600 text-white shadow-md z-10'; transform = 'scale-110'; }
                                      else if (isChecking) { boxColor = 'bg-amber-400 border-amber-500 text-amber-900 shadow-md z-10'; transform = 'scale-110'; }
                                      else if (isRemoving) { boxColor = 'bg-rose-500 border-rose-600 text-white scale-75 opacity-50'; }

                                      return (
                                          <div key={idx} className={`w-8 h-8 flex items-center justify-center font-mono font-bold text-sm rounded-lg border-2 transition-all duration-300 ${boxColor} ${transform}`}>
                                              {charVal}
                                          </div>
                                      )
                                  })
                              )}
                          </div>
                      </div>
                  )}

                  {/* Map Bucket */}
                  {selectedOpId === 'slidingWindowMap' && st.mapState !== undefined && (
                      <div className={`flex-1 px-6 py-4 border-[3px] rounded-[2rem] flex flex-col items-center shadow-lg transition-all duration-500 bg-fuchsia-50/50 border-fuchsia-200`}>
                          <div className="flex items-center gap-2 mb-3">
                              <Database size={18} className="text-fuchsia-500" />
                              <span className="text-sm font-black uppercase tracking-widest text-fuchsia-700">HashMap &lt;Char, Next Index (j+1)&gt;</span>
                          </div>
                          <div className="flex flex-wrap gap-3 justify-center w-full min-h-[40px]">
                              {Array.from(st.mapState.entries()).length === 0 ? (
                                  <span className="font-mono text-fuchsia-300 italic text-sm">Empty</span>
                              ) : (
                                  Array.from(st.mapState.entries()).map(([k, v]) => {
                                      const isRecent = st.justMapped === k;
                                      const isChecking = st.checkingMap && st.curChar === k;
                                      
                                      let boxColor = 'bg-white border-fuchsia-300 text-fuchsia-800';
                                      if (isRecent) boxColor = 'bg-emerald-50 border-emerald-400 text-emerald-800 scale-105 shadow-md';
                                      if (isChecking) boxColor = 'bg-amber-50 border-amber-400 text-amber-900 scale-105 shadow-md';

                                      return (
                                          <div key={`map-${k}`} className={`flex flex-col border-2 rounded-xl overflow-hidden shadow-sm transition-all duration-300 ${boxColor}`}>
                                              <div className="bg-slate-100/50 text-[9px] font-black font-mono text-center p-1 border-b border-inherit opacity-80">'{k}'</div>
                                              <div className="p-2 font-mono text-xs font-bold flex justify-center text-center w-full">
                                                  {v}
                                              </div>
                                          </div>
                                      )
                                  })
                              )}
                          </div>
                      </div>
                  )}

                  {/* Best So Far Badge */}
                  {st.maxLen !== undefined && (
                      <div className={`px-6 py-4 border-[3px] rounded-[2rem] flex flex-col justify-center items-center shadow-lg transition-all duration-500 min-w-[150px] ${st.maxUpdated ? 'bg-emerald-100 border-emerald-400 scale-105 shadow-emerald-200/50' : 'bg-slate-50 border-slate-200'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{selectedOpId === 'slidingWindowMap' ? 'ans (Max)' : 'Max Length'}</span>
                          <span className={`font-mono font-black text-4xl ${st.maxUpdated ? 'text-emerald-700' : 'text-slate-700'}`}>{st.maxLen}</span>
                          {st.curLen !== undefined && <span className="text-[9px] font-black text-slate-400 mt-1">Cur Window: {st.curLen}</span>}
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'fuchsia' ? 'bg-fuchsia-600' : 'bg-sky-600'}`}>
                <ScanLine className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Longest Substring</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'fuchsia' ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 3 • Sliding Window
                  </span>
                  <span>•</span>
                  <span>No Repeating Characters</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-sky-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  Given a string <code>s</code>, find the length of the <strong>longest substring</strong> without repeating characters.<br/>
                  A substring is a contiguous non-empty sequence of characters within a string.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "abcabcbb"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The answer is "abc", with the length of 3.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "bbbbb"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 1</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The answer is "b", with the length of 1.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3</span>
                        <div><span className="text-white font-bold">Input:</span> s = "pwwkew"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: The answer is "wke", with the length of 3. Notice that "pwke" is a subsequence and not a substring.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></li>
                        <li><code>s</code> consists of English letters, digits, symbols and spaces.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'fuchsia' ? 'bg-fuchsia-600 text-white border-fuchsia-600 scale-[1.02]' : 'bg-sky-600 text-white border-sky-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'fuchsia' ? 'text-fuchsia-200' : 'text-sky-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-sky-600'}`}>
                                <span>Input String 's'</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'fuchsia' ? 'focus:ring-fuchsia-500' : 'focus:ring-sky-500'}`} 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'fuchsia' ? 'bg-fuchsia-600 shadow-fuchsia-200 hover:bg-fuchsia-700' : 'bg-sky-600 shadow-sky-200 hover:bg-sky-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Evaluation Complete</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : (
                        <>
                            <div className="text-lg font-black tracking-tight mb-1 uppercase font-mono text-white leading-none truncate">{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'fuchsia' ? 'text-fuchsia-500' : 'text-sky-500'}`}><Layout size={14}/> Window Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* State Variables Row */}
                           <div className="flex gap-4 min-w-max h-[70px]">
                                {st.left !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-2 border-sky-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">{selectedOpId === 'slidingWindowMap' ? 'Ptr i (Left)' : 'Left Ptr'}</span>
                                        <span className="font-mono font-black text-xl text-sky-600">{st.left}</span>
                                    </div>
                                )}
                                {st.right !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-2 border-fuchsia-200 p-2 rounded-xl min-w-[80px] shadow-sm animate-in slide-in-from-left-4">
                                        <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">{selectedOpId === 'slidingWindowMap' ? 'Ptr j (Right)' : 'Right Ptr'}</span>
                                        <span className="font-mono font-black text-xl text-fuchsia-600">{st.right}</span>
                                    </div>
                                )}
                           </div>

                           {/* String Visualizer */}
                           {renderStringArray(false)}

                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-[#0f172a] text-white border border-slate-800 relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><ScanLine size={120}/></div>
                        <h3 className="font-black text-sky-400 text-lg uppercase tracking-widest mb-6">The Sliding Window</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>We use a flexible window represented by <code>left</code> and <code>right</code> pointers to frame valid substrings.</p>
                            <p>The <code>right</code> pointer acts as an explorer, moving forward one character at a time and adding it to our "Window Set".</p>
                            <p>If the <code>right</code> pointer encounters a character that is <strong>already inside the Set</strong>, the window is invalid! We must contract the window by moving the <code>left</code> pointer forward, removing characters from the Set until the duplicate is ejected.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">The HashMap "Jump" Optimization</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>The standard Set approach is $O(N)$ but requires the <code>left</code> pointer to slowly march forward step-by-step to find the duplicate.</p>
                            <p>Instead of a Set, we can use a <strong>HashMap</strong> to store the <em>exact next index</em> (<code>j+1</code>) where we last saw each character.</p>
                            <p>Now, if we encounter a duplicate, we don't need a slow <code>while</code> loop. We just instantly teleport the <code>left</code> pointer (<code>i</code>) to the index immediately following the old duplicate. This guarantees we process the string with mathematically fewer operations!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-sky-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-sky-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Securing the HashMap Jump</h3>
                    <p className="text-sm text-sky-50 leading-relaxed italic max-w-2xl font-mono">"Every candidate can write the HashSet sliding window. To get the 'Strong Hire', you must immediately recognize the redundancy of the while-loop and propose the HashMap index-jumping optimization."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-sky-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ScanLine size={16}/></div>
                               1. State the Standard Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "The standard way to solve this in O(N) time is using a Sliding Window with a HashSet. I expand a 'right' pointer and add characters to the set. If I hit a duplicate, I use a while loop to increment my 'left' pointer and remove characters from the set until the duplicate is ejected."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ShieldAlert size={16}/></div>
                               2. Point out the Inefficiency
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "However, that while loop is slightly inefficient. If the duplicate character is deep inside the window, the 'left' pointer has to step through every single valid character one by one just to reach it."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><Zap size={16}/></div>
                               3. Deliver the Map Optimization
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "I can optimize the constant time factor by swapping the HashSet for a HashMap. The map will store characters as keys and the index right after them (j+1) as values. When my 'right' pointer hits a character already in the map, I don't need a while loop. I can instantly jump my 'left' pointer (i) to 'map.get(char)', immediately bypassing the old duplicate!"
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        )}
      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[650px] 2xl:w-[800px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110] shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'fuchsia' ? 'bg-fuchsia-500 shadow-fuchsia-900/50' : 'bg-sky-500 shadow-sky-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'fuchsia' ? 'bg-fuchsia-600 text-white shadow-md' : 'bg-sky-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-sky-600'}`}>Input String 's'</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'fuchsia' ? 'focus:ring-fuchsia-500' : 'focus:ring-sky-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'fuchsia' ? 'hover:bg-fuchsia-50 hover:text-fuchsia-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'fuchsia' ? 'hover:bg-fuchsia-50 hover:text-fuchsia-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'fuchsia' ? 'hover:bg-fuchsia-50 hover:text-fuchsia-600' : 'hover:bg-sky-50 hover:text-sky-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'fuchsia' ? 'bg-fuchsia-600 hover:bg-fuchsia-700 border-fuchsia-400 shadow-fuchsia-900/30' : 'bg-sky-600 hover:bg-sky-700 border-sky-400 shadow-sky-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}
                           
                           {/* State Variables Row */}
                           <div className="flex gap-8 origin-center mb-8 z-30">
                                {st.left !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                        <span className="text-xs uppercase tracking-widest font-black text-sky-500 mb-2">{selectedOpId === 'slidingWindowMap' ? 'Ptr i (Left)' : 'Left Ptr'}</span>
                                        <span className="font-mono font-black text-5xl text-sky-600 mt-2">{st.left}</span>
                                    </div>
                                )}
                                {st.right !== undefined && (
                                    <div className="flex flex-col items-center bg-white border-[3px] border-fuchsia-200 p-6 rounded-2xl min-w-[150px] shadow-xl animate-in slide-in-from-left-6">
                                        <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500 mb-2">{selectedOpId === 'slidingWindowMap' ? 'Ptr j (Right)' : 'Right Ptr'}</span>
                                        <span className="font-mono font-black text-5xl text-fuchsia-600 mt-2">{st.right}</span>
                                    </div>
                                )}
                           </div>

                           {/* String Visualizer */}
                           <div className="scale-125 origin-top mt-10">
                               {renderStringArray(true)}
                           </div>

                      </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-emerald-500/30`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 bg-emerald-500/20 text-emerald-500 ring-emerald-500/10`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    SCAN COMPLETE
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest text-emerald-400`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20`}>
                                        <RotateCcw size={24}/> RESTART VIZ
                                    </button>
                                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700 shadow-xl shadow-black/20">
                                        CLOSE
                                    </button>
                                </div>
                            </div>
                        </div>
                   )}
              </div>
          </div>
      )}
    </div>
  );
}