import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout, Hash
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  expandCenter: {
    id: 'expandCenter',
    title: '1. Expand Around Center (Optimal)',
    icon: <Maximize size={16} />,
    complexity: 'Time: O(N²) | Space: O(1)',
    code: `public int countSubstrings(String s) {
    int totalCount = 0;
    
    for (int i = 0; i < s.length(); i++) {
        // Drop pebble ON the letter (Odd length palindromes)
        totalCount += countPalindromesAroundCenter(s, i, i);
        
        // Drop pebble BETWEEN letters (Even length palindromes)
        totalCount += countPalindromesAroundCenter(s, i, i + 1);
    }
    
    return totalCount;
}

private int countPalindromesAroundCenter(String s, int left, int right) {
    int localCount = 0;
    
    // Expand ripples outwards as long as letters match
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        localCount++; // Found a valid palindrome!
        left--;       // Expand left ripple
        right++;      // Expand right ripple
    }
    
    return localCount;
}`,
    desc: "The 'Pebble in a Pond' approach. A palindrome mirrors around its center. We iterate through the string, treating every index as a potential center. We expand outwards (left--, right++). Every time the letters match, we just found a valid palindrome, so we increment our count! We must do this for both Odd centers (1 letter) and Even centers (between 2 letters)."
  },
  bruteForce: {
    id: 'bruteForce',
    title: '2. Brute Force (Naive)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N³) | Space: O(1)',
    code: `public int countSubstrings(String s) {
    int count = 0;
    int n = s.length();
    
    // Generate every possible substring
    for (int i = 0; i < n; i++) {
        for (int j = i; j < n; j++) {
            if (isPalindrome(s, i, j)) {
                count++;
            }
        }
    }
    
    return count;
}

private boolean isPalindrome(String s, int left, int right) {
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
    }
    return true;
}`,
    desc: "The absolute beginner approach. We use two nested loops to generate every single possible substring in the entire word. Then, for each substring, we use a third loop to check if it reads the same forwards and backwards. Because it involves 3 nested loops, the time complexity is terrible (O(N³))."
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
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
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math'].includes(part);
            const isVar = ['s', 'totalCount', 'localCount', 'count', 'left', 'right', 'n'].includes(part);
            const isMapCall = ['length', 'charAt', 'countPalindromesAroundCenter', 'isPalindrome'].includes(part);
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
              <span key={i} className={className}>
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
}

const NodeBlock: React.FC<NodeBlockProps> = ({ val, idx, themeColor = 'slate', isTarget }) => {
    const themes = {
        emerald: { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-800', index: 'bg-emerald-100 text-emerald-600' },
        sky: { bg: 'bg-sky-50', border: 'border-sky-400', text: 'text-sky-800', index: 'bg-sky-100 text-sky-600' },
        fuchsia: { bg: 'bg-fuchsia-50', border: 'border-fuchsia-400', text: 'text-fuchsia-800', index: 'bg-fuchsia-100 text-fuchsia-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' },
    };
    
    let activeTheme = themes[themeColor] || themes['slate'];

    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;
    
    const displayVal = val === null ? '_' : String(val);

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-2xl px-1 py-1 bg-white/60 ${activeTheme.text}`}>
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

export default function PalindromicSubstringsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('expandCenter');
  
  const [inputString, setInputString] = useState('aaa');
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
    // Keep it short to avoid massive trace steps (O(N^2) generates many steps)
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
    if (!baseStr || baseStr.length === 0) return [{ phase: 'Init', description: 'Enter a valid string.', line: 0, state: { sArr: [], foundPalindromes: [] } }];

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

    if (selectedOpId === 'expandCenter') {
        let totalCount = 0;
        let foundPalindromes = [];
        
        add("Init Variables", `int totalCount = 0; Tracks the total number of palindromes found.`, 2, { totalCount, foundPalindromes: [...foundPalindromes] });

        for (let i = 0; i < n; i++) {
            add("Main Loop", `for (int i = ${i}...) -> Select index ${i} ('${sArr[i]}') as the starting center pebble.`, 4, { totalCount, i, foundPalindromes: [...foundPalindromes] });
            
            // --- ODD EXPANSION ---
            add("Odd Palindrome Setup", `Phase 1: Test for an ODD length palindrome. We drop our pebble exactly ON index ${i}.`, 6, { totalCount, i, isOddMode: true, foundPalindromes: [...foundPalindromes] });
            
            let L1 = i, R1 = i;
            let localCount1 = 0;
            add("Call Expand (Odd)", `countPalindromesAroundCenter(s, ${L1}, ${R1});`, 15, { totalCount, i, left: L1, right: R1, isOddMode: true, isExpanding: true, foundPalindromes: [...foundPalindromes], localCount: localCount1 });
            
            while (L1 >= 0 && R1 < n) {
                add("Check Match (Odd)", `while (s[${L1}] == s[${R1}]) -> Does '${sArr[L1]}' == '${sArr[R1]}'?`, 18, { totalCount, i, left: L1, right: R1, isOddMode: true, isExpanding: true, hlMatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount1 });
                if (sArr[L1] === sArr[R1]) {
                    localCount1++;
                    totalCount++;
                    let newPal = baseStr.substring(L1, R1 + 1);
                    foundPalindromes.push(newPal);
                    
                    add("Match! (Odd)", `Yes! Found palindrome "${newPal}". Increment count. Expand the ripples outwards.`, 19, { totalCount, i, left: L1, right: R1, isOddMode: true, isExpanding: true, matched: true, foundPalindromes: [...foundPalindromes], localCount: localCount1, justAdded: newPal });
                    L1--;
                    R1++;
                } else {
                    add("Mismatch (Odd)", `No! '${sArr[L1]}' != '${sArr[R1]}'. The ripple hit different letters. Stop expanding.`, 18, { totalCount, i, left: L1, right: R1, isOddMode: true, isExpanding: true, mismatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount1 });
                    break;
                }
            }
            if (L1 < 0 || R1 >= n) {
                add("Bounds Hit (Odd)", `Hit the edge of the string. Stop expanding.`, 18, { totalCount, i, left: L1, right: R1, isOddMode: true, isExpanding: true, mismatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount1 });
            }
            
            add("Return Count (Odd)", `Return localCount = ${localCount1}. Total is now ${totalCount}.`, 24, { totalCount, i, foundPalindromes: [...foundPalindromes] });

            // --- EVEN EXPANSION ---
            add("Even Palindrome Setup", `Phase 2: Test for an EVEN length palindrome. We drop our pebble BETWEEN index ${i} and ${i+1}.`, 9, { totalCount, i, isEvenMode: true, foundPalindromes: [...foundPalindromes] });
            
            let L2 = i, R2 = i + 1;
            let localCount2 = 0;
            add("Call Expand (Even)", `countPalindromesAroundCenter(s, ${L2}, ${R2});`, 15, { totalCount, i, left: L2, right: R2, isEvenMode: true, isExpanding: true, foundPalindromes: [...foundPalindromes], localCount: localCount2 });
            
            while (L2 >= 0 && R2 < n) {
                add("Check Match (Even)", `while (s[${L2}] == s[${R2}]) -> Does '${sArr[L2]}' == '${sArr[R2]}'?`, 18, { totalCount, i, left: L2, right: R2, isEvenMode: true, isExpanding: true, hlMatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount2 });
                if (sArr[L2] === sArr[R2]) {
                    localCount2++;
                    totalCount++;
                    let newPal = baseStr.substring(L2, R2 + 1);
                    foundPalindromes.push(newPal);
                    
                    add("Match! (Even)", `Yes! Found palindrome "${newPal}". Increment count. Expand the ripples outwards.`, 19, { totalCount, i, left: L2, right: R2, isEvenMode: true, isExpanding: true, matched: true, foundPalindromes: [...foundPalindromes], localCount: localCount2, justAdded: newPal });
                    L2--;
                    R2++;
                } else {
                    add("Mismatch (Even)", `No! '${sArr[L2]}' != '${sArr[R2]}'. The ripple hit different letters. Stop expanding.`, 18, { totalCount, i, left: L2, right: R2, isEvenMode: true, isExpanding: true, mismatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount2 });
                    break;
                }
            }
            if (L2 < 0 || R2 >= n) {
                add("Bounds Hit (Even)", `Hit the edge of the string. Stop expanding.`, 18, { totalCount, i, left: L2, right: R2, isEvenMode: true, isExpanding: true, mismatch: true, foundPalindromes: [...foundPalindromes], localCount: localCount2 });
            }

            add("Return Count (Even)", `Return localCount = ${localCount2}. Total is now ${totalCount}.`, 24, { totalCount, i, foundPalindromes: [...foundPalindromes] });
        }

        add("Return Result", `return totalCount -> All possible centers explored. Found ${totalCount} total palindromes.`, 12, { totalCount, isSuccess: true, foundPalindromes: [...foundPalindromes] });

    } else if (selectedOpId === 'bruteForce') {
        let count = 0;
        let foundPalindromes = [];
        add("Init", `int count = 0;`, 2, { count, foundPalindromes: [...foundPalindromes] });

        for (let i = 0; i < n; i++) {
            add("Outer Loop", `for (int i = ${i}...) -> Start of substring.`, 6, { count, i, foundPalindromes: [...foundPalindromes] });
            for (let j = i; j < n; j++) {
                add("Inner Loop", `for (int j = ${j}...) -> End of substring. Checking "${baseStr.substring(i, j+1)}".`, 7, { count, i, j, checkingSub: true, foundPalindromes: [...foundPalindromes] });
                
                // Simulation of isPalindrome
                let isPal = true;
                let L = i, R = j;
                add("Call isPalindrome", `Check if "${baseStr.substring(i, j+1)}" is valid...`, 16, { count, i, j, left: L, right: R, inHelper: true, foundPalindromes: [...foundPalindromes] });
                
                while (L < R) {
                    add("Check Edges", `if (s[${L}] != s[${R}]) -> '${sArr[L]}' vs '${sArr[R]}'`, 18, { count, i, j, left: L, right: R, inHelper: true, hlMatch: true, foundPalindromes: [...foundPalindromes] });
                    if (sArr[L] !== sArr[R]) {
                        isPal = false;
                        add("Mismatch!", `Mismatch found. Not a palindrome.`, 18, { count, i, j, left: L, right: R, inHelper: true, mismatch: true, foundPalindromes: [...foundPalindromes] });
                        break;
                    }
                    L++;
                    R--;
                }

                if (isPal) {
                    count++;
                    let newPal = baseStr.substring(i, j + 1);
                    foundPalindromes.push(newPal);
                    add("Is Palindrome", `Valid palindrome found! Increment count to ${count}.`, 9, { count, i, j, isPal: true, foundPalindromes: [...foundPalindromes], justAdded: newPal });
                }
            }
        }
        add("Return Result", `Checked all substrings. return count = ${count}.`, 14, { count, isSuccess: true, foundPalindromes: [...foundPalindromes] });
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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { sArr: [], foundPalindromes: [] } };
  const st = curStepData.state || { sArr: [], foundPalindromes: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'expandCenter' ? 'fuchsia' : 'sky';

  // --- Rendering Helpers ---

  const renderStringArray = (isTheater = false) => {
      if (!st.sArr || st.sArr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.sArr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let labels = [];

                      // --- Expand Around Center Visuals ---
                      if (selectedOpId === 'expandCenter') {
                          // The pebble (Center)
                          if (st.i === idx) {
                              color = 'amber'; isHl = true;
                              labels.push({ text: 'Center', color: 'amber', pos: 'top' });
                          }

                          // The ripples (Left and Right bounds during expansion)
                          if (st.isExpanding && (st.left === idx || st.right === idx)) {
                              color = st.mismatch ? 'rose' : (st.matched ? 'emerald' : 'sky');
                              isHl = true;
                              labels.push({ text: st.left === idx ? 'Left' : 'Right', color: color, pos: 'bottom' });
                          }

                          // Currently verified valid palindrome slice bounds
                          if (!st.isExpanding && st.left !== undefined && st.right !== undefined) {
                              if (idx > st.left && idx < st.right) {
                                  color = 'emerald';
                              }
                          }
                      } 
                      // --- Brute Force Visuals ---
                      else if (selectedOpId === 'bruteForce') {
                          if (st.i === idx) {
                              color = 'sky'; isHl = true;
                              labels.push({ text: 'i', color: 'sky', pos: 'top' });
                          }
                          if (st.j === idx) {
                              color = 'fuchsia'; isHl = true;
                              labels.push({ text: 'j', color: 'fuchsia', pos: 'bottom' });
                          }

                          if (st.checkingSub && idx >= st.i && idx <= st.j) {
                              color = 'emerald';
                          }

                          if (st.inHelper) {
                              if (st.left === idx || st.right === idx) {
                                  color = st.mismatch ? 'rose' : 'amber';
                                  isHl = true;
                                  labels.push({ text: st.left === idx ? 'L' : 'R', color: color, pos: 'bottom' });
                              }
                          }
                      }

                      return (
                          <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-2' : 'scale-100 z-10 m-1'}`}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                              
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                          </div>
                      )
                  })}
              </div>

              {/* Found Palindromes Bucket */}
              {st.foundPalindromes !== undefined && (
                  <div className={`mt-8 w-full max-w-2xl px-6 py-4 border-[3px] rounded-[2rem] flex flex-col items-center shadow-lg transition-all duration-500 bg-emerald-50/50 border-emerald-200`}>
                      <div className="flex items-center gap-2 mb-3">
                          <Hash size={18} className="text-emerald-500" />
                          <span className="text-sm font-black uppercase tracking-widest text-emerald-700">Palindromes Found: {st.foundPalindromes.length}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center w-full min-h-[40px]">
                          {st.foundPalindromes.length === 0 ? (
                              <span className="font-mono text-emerald-300 italic text-sm">None yet...</span>
                          ) : (
                              st.foundPalindromes.map((pal, idx) => {
                                  const isRecent = st.justAdded === pal && idx === st.foundPalindromes.length - 1;
                                  return (
                                      <div key={idx} className={`px-3 py-1 font-mono font-bold text-sm rounded-lg border-2 transition-all duration-500 ${isRecent ? 'bg-emerald-500 border-emerald-600 text-white scale-110 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10' : 'bg-white border-emerald-300 text-emerald-800'}`}>
                                          "{pal}"
                                      </div>
                                  )
                              })
                          )}
                      </div>
                  </div>
              )}
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
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Palindromic Substrings</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'fuchsia' ? 'text-fuchsia-600 bg-fuchsia-50' : 'text-sky-600 bg-sky-50'}`}>
                      LC 647 • Center Expansion
                  </span>
                  <span>•</span>
                  <span>O(1) Space Constraint</span>
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
                  Given a string <code>s</code>, return the number of <strong>palindromic substrings</strong> in it.<br/>
                  A string is a palindrome when it reads the same backward as forward.<br/>
                  A substring is a contiguous sequence of characters within the string.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-fuchsia-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-fuchsia-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "abc"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 3</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Three palindromic strings: "a", "b", "c".</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "aaa"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 6</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= s.length &lt;= 1000</li>
                        <li><code>s</code> consists of lowercase English letters.</li>
                        <li className={`font-bold mt-2 ${themeColor === 'fuchsia' ? 'text-fuchsia-600' : 'text-sky-600'}`}>Trap: Substrings with the exact same characters but different start/end indices are counted differently! (e.g. the multiple "a"s in Example 2).</li>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'fuchsia' ? 'text-fuchsia-500' : 'text-sky-500'}`}><Layout size={14}/> Pebble Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'fuchsia' ? 'hover:text-fuchsia-600' : 'hover:text-sky-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Target size={120}/></div>
                        <h3 className="font-black text-fuchsia-400 text-lg uppercase tracking-widest mb-6">The Pebble in a Pond</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>How do humans look for palindromes? We find a middle point and look outwards to the left and right. This algorithm does exactly that.</p>
                            <p>Imagine dropping a pebble into a pond at index <code>i</code>. The ripples expand left (<code>i-1</code>) and right (<code>i+1</code>).</p>
                            <p>Every single time the letter hit by the left ripple matches the letter hit by the right ripple, <strong>we have discovered a valid palindrome.</strong> We simply increment our counter by 1 and let the ripple continue.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-fuchsia-50 border border-fuchsia-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-fuchsia-700 text-lg uppercase tracking-widest mb-6">The Odd vs. Even Trap</h3>
                        <div className="space-y-4 text-sm text-fuchsia-900/80 leading-relaxed font-medium">
                            <p>There is one massive trap: Palindromes can have an Odd or Even length.</p>
                            <p><strong>Odd:</strong> <code>"aba"</code>. The center is a single letter (<code>'b'</code>). The pebble drops exactly ON index <code>i</code>. Both pointers start at <code>i</code>.</p>
                            <p><strong>Even:</strong> <code>"abba"</code>. The center is a blank space between the two <code>'b'</code>s. The pebble drops BETWEEN index <code>i</code> and <code>i+1</code>. The left pointer starts at <code>i</code>, the right starts at <code>i+1</code>.</p>
                            <p>Because we don't know which type is hiding at any given spot, we must test <strong>both</strong> an odd drop and an even drop for every single index <code>i</code> in the string!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-fuchsia-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-fuchsia-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">Securing the O(1) Space Follow-up</h3>
                    <p className="text-sm text-fuchsia-50 leading-relaxed italic max-w-2xl font-mono">"Interviewers will almost always ask this question to see if you default to Dynamic Programming. If you do, they will ask you to optimize the space. Jump straight to the Expand Around Center method to show seniority."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-fuchsia-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><SearchCode size={16}/></div>
                               1. Acknowledge Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "The brute force approach is to check every possible substring using nested loops, which takes O(N³) time. This is far too slow."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Layout size={16}/></div>
                               2. Mention Dynamic Programming
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "I could optimize the time to O(N²) using Dynamic Programming. I'd create an NxN boolean table where dp[i][j] is true if the substring from i to j is a palindrome. However, allocating that 2D array costs O(N²) memory, which scales poorly."
                            </p>
                        </div>

                        <div className="bg-fuchsia-50/50 border border-fuchsia-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-fuchsia-800 text-sm uppercase tracking-widest">
                               <div className="bg-fuchsia-200 p-2 rounded-lg text-fuchsia-700"><Maximize size={16}/></div>
                               3. Pivot to Expand Around Center (O(1) Space)
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-fuchsia-100 shadow-inner flex-1">
                                "To achieve O(N²) time but strictly O(1) space, I will use the 'Expand Around Center' technique. A palindrome mirrors around its center. There are 2N-1 possible centers in a string. I will loop through the string and attempt to expand outward from both the 'i' (odd) and 'i, i+1' (even) centers. Every time my expanding left and right pointers match, I have found a valid palindromic substring, so I simply increment my total count."
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
                           {renderStringArray(true)}

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
                                    COUNT COMPLETE
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