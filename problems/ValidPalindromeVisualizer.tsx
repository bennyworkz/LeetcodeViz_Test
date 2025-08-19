import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, CaseSensitive, XCircle, ArrowDown, ArrowUp, Layout
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  twoPointers: {
    id: 'twoPointers',
    title: '1. Two Pointers (Optimal)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        // Skip non-alphanumeric characters from left
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        
        // Skip non-alphanumeric characters from right
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }
        
        // Compare lowercase characters
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}`,
    desc: "The most optimal O(1) space approach. We use two pointers starting from the opposite ends of the string. We move them inwards, completely skipping over any spaces or punctuation marks. When both pointers sit on alphanumeric characters, we compare their lowercase versions. If they mismatch, it's not a palindrome."
  },
  filterReverse: {
    id: 'filterReverse',
    title: '2. Filter & Reverse',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N) | Space: O(N)',
    code: `public boolean isPalindrome(String s) {
    StringBuilder builder = new StringBuilder();
    
    // Filter and lowercase
    for (char ch : s.toCharArray()) {
        if (Character.isLetterOrDigit(ch)) {
            builder.append(Character.toLowerCase(ch));
        }
    }
    
    String filteredString = builder.toString();
    String reversedString = builder.reverse().toString();
    
    // Compare
    return filteredString.equals(reversedString);
}`,
    desc: "A very intuitive O(N) space approach. In the first pass, we build a brand new string that only contains the lowercase alphanumeric characters from the original string. Then, we simply reverse this new string and check if the reversed version is identical to the original filtered version."
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
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|return|if|else|for|while|continue|new|length|char|String|StringBuilder|Character|toLowerCase|isLetterOrDigit|toCharArray|append|toString|reverse|equals)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!])/g).filter(Boolean);
  const activeStyles = { bg: `bg-sky-500/20`, border: `border-sky-400`, text: `text-sky-300` };
  
  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `text-sky-400 font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] ${active ? 'opacity-100' : 'opacity-60'}`}>
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'return', 'if', 'else', 'for', 'while', 'continue', 'new', 'char'].includes(part);
            const isObject = ['String', 'StringBuilder', 'Character'].includes(part);
            const isVar = ['s', 'left', 'right', 'ch', 'builder', 'filteredString', 'reversedString'].includes(part);
            const isMapCall = ['length', 'toLowerCase', 'isLetterOrDigit', 'toCharArray', 'append', 'toString', 'reverse', 'equals'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-fuchsia-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (!isNaN(parseInt(part.trim())) && part.trim() !== '') className = 'text-emerald-400';

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
        cyan: 'bg-cyan-100 text-cyan-700 border-cyan-300',
        rose: 'bg-rose-100 text-rose-700 border-rose-300',
        amber: 'bg-amber-100 text-amber-700 border-amber-300',
        slate: 'bg-slate-100 text-slate-600 border-slate-300'
    };
    const activeColorClass = colorClasses[color] || colorClasses['slate'];
    const alignClass = position === 'top' ? 'flex-col-reverse -top-10' : 'flex-col -bottom-10';

    return (
        <div className={`absolute ${alignClass} flex items-center justify-center animate-in zoom-in duration-300 z-30 pointer-events-none`}>
            <span className={`text-[11px] font-black font-mono px-2 py-0.5 rounded border shadow-sm ${activeColorClass} whitespace-nowrap`}>
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
        rose: { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-800', index: 'bg-rose-100 text-rose-600' },
        amber: { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-800', index: 'bg-amber-100 text-amber-600' },
        slate: { bg: 'bg-white', border: 'border-slate-300', text: 'text-slate-700', index: 'bg-slate-100 text-slate-400' }
    };
    
    const activeTheme = themes[themeColor] || themes['slate'];
    const targetClasses = isTarget ? `ring-4 ring-[${activeTheme.border.replace('border-','').replace('-400','-300')}] shadow-xl z-20 scale-110` : `shadow-sm z-10`;

    // Handle space rendering to be visible
    const displayVal = val === ' ' ? '␣' : (val === null ? '_' : String(val));
    const opacityClass = val === ' ' ? 'opacity-40' : 'opacity-100';

    return (
        <div className={`relative flex flex-col items-center group transition-all duration-500`}>
            <div className={`flex flex-col items-center min-w-[48px] min-h-[56px] md:min-w-[56px] md:min-h-[64px] border-2 transition-all duration-300 ${activeTheme.bg} ${activeTheme.border} ${targetClasses} rounded-xl relative shadow-sm overflow-hidden`}>
                <div className={`flex-1 flex justify-center items-center w-full font-mono font-black text-xl md:text-2xl px-1 py-1 bg-white/60 ${activeTheme.text} ${opacityClass}`}>
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

export default function ValidPalindromeVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('twoPointers');
  
  const [inputString, setInputString] = useState('A man, a plan!');
  const [baseArray, setBaseArray] = useState([]);
  
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

  const parseInput = (str) => {
      // Limit to ~25 chars for UI performance
      return str.split('').slice(0, 25); 
  };

  useEffect(() => {
    const arr = parseInput(inputString);
    setBaseArray(arr);
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
    if (!baseArray || baseArray.length === 0) return [{ phase: 'Init', description: 'Enter a string.', line: 0, state: { sArr: [] } }];

    let sArr = [...baseArray];
    let n = sArr.length;

    const isAlnum = (char) => {
        return /^[a-zA-Z0-9]$/.test(char);
    };

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

    if (selectedOpId === 'twoPointers') {
        let left = 0;
        add("Init Left", `int left = 0; Start at the beginning.`, 2, { left });
        
        let right = n - 1;
        add("Init Right", `int right = s.length() - 1; Start at the end.`, 3, { left, right });

        let skippedLeft = [];
        let skippedRight = [];
        let matched = [];

        while (left < right) {
            add("Loop Condition", `while (left < right) -> Is ${left} < ${right}?`, 5, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched] });
            
            // Check Left Alnum
            let isLeftAlnum = isAlnum(sArr[left]);
            add("Check Left Alnum", `!Character.isLetterOrDigit('${sArr[left]}') -> Is it a valid character?`, 7, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], hlLeft: true });
            
            if (!isLeftAlnum) {
                skippedLeft.push(left);
                add("Skip Left", `No, '${sArr[left]}' is not alphanumeric. Increment left++.`, 8, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched] });
                left++;
                continue;
            }

            // Check Right Alnum
            let isRightAlnum = isAlnum(sArr[right]);
            add("Check Right Alnum", `!Character.isLetterOrDigit('${sArr[right]}') -> Is it a valid character?`, 12, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], hlRight: true });
            
            if (!isRightAlnum) {
                skippedRight.push(right);
                add("Skip Right", `No, '${sArr[right]}' is not alphanumeric. Decrement right--.`, 13, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched] });
                right--;
                continue;
            }

            // Both are Alnum, Compare
            let charL = sArr[left].toLowerCase();
            let charR = sArr[right].toLowerCase();
            
            add("Compare Valid Chars", `if (toLowerCase('${sArr[left]}') != toLowerCase('${sArr[right]}')) -> Does '${charL}' != '${charR}'?`, 17, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], comparing: true });

            if (charL !== charR) {
                add("Mismatch Found!", `Mismatch! '${charL}' does not equal '${charR}'. Not a palindrome. return false.`, 18, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], isFail: true });
                return steps;
            }

            matched.push(left, right);
            add("Match!", `Characters match! Continue moving inwards. left++, right--.`, 21, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], isMatch: true });
            
            left++;
            right--;
        }

        add("Validation Complete", `Pointers met or crossed (${left} >= ${right}). Every valid pair matched perfectly. return true.`, 25, { left, right, skippedLeft: [...skippedLeft], skippedRight: [...skippedRight], matched: [...matched], isSuccess: true });

    } else if (selectedOpId === 'filterReverse') {
        let builder = [];
        
        add("Init Builder", `StringBuilder builder = new StringBuilder();`, 2, { builder: [...builder] });

        for (let i = 0; i < n; i++) {
            add("Loop Condition", `for (char ch : s.toCharArray()) -> Read character '${sArr[i]}'.`, 5, { builder: [...builder], i });
            
            let isCharAlnum = isAlnum(sArr[i]);
            add("Check Alnum", `if (Character.isLetterOrDigit('${sArr[i]}'))`, 6, { builder: [...builder], i, hlChar: true });
            
            if (isCharAlnum) {
                let lower = sArr[i].toLowerCase();
                builder.push(lower);
                add("Append Char", `Yes. Append lowercased '${lower}' to builder.`, 7, { builder: [...builder], i, justAppended: true });
            } else {
                add("Skip Char", `No. It's punctuation/space. Skip it.`, 6, { builder: [...builder], i, skippedChar: true });
            }
        }

        let filteredString = builder.join('');
        add("Create Filtered", `String filteredString = builder.toString(); -> "${filteredString}"`, 11, { builder: [...builder], filteredString, phase: 2 });
        
        let reversedString = [...builder].reverse().join('');
        add("Create Reversed", `String reversedString = builder.reverse().toString(); -> "${reversedString}"`, 12, { builder: [...builder], filteredString, reversedString, phase: 2 });

        add("Compare Strings", `return filteredString.equals(reversedString); -> Does "${filteredString}" == "${reversedString}"?`, 15, { builder: [...builder], filteredString, reversedString, phase: 2, comparing: true });

        if (filteredString === reversedString) {
            add("Match!", `The strings are identical. return true.`, 15, { builder: [...builder], filteredString, reversedString, phase: 2, isSuccess: true });
        } else {
            add("Mismatch!", `The strings differ. return false.`, 15, { builder: [...builder], filteredString, reversedString, phase: 2, isFail: true });
        }
    }

    return steps;
  }, [baseArray, selectedOpId]);

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

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className="bg-sky-600 p-4 rounded-2xl shadow-lg flex items-center justify-center">
                <CaseSensitive className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Valid Palindrome</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                      LC 125 • Two Pointers
                  </span>
                  <span>•</span>
                  <span>String Manipulation</span>
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
                <div className="flex items-center gap-3 text-sky-600 font-black text-2xl uppercase tracking-tighter"><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.<br/><br/>
                  Given a string <code>s</code>, return <code>true</code> if it is a palindrome, or <code>false</code> otherwise.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-sky-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-sky-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> s = "A man, a plan, a canal: Panama"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: "amanaplanacanalpanama" is a palindrome.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-rose-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-rose-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> s = "race a car"</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> false</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: "raceacar" is not a palindrome.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 3 (Trap)</span>
                        <div><span className="text-white font-bold">Input:</span> s = " "</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> true</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-1">
                        <li>1 &lt;= s.length &lt;= 2 * 10<sup>5</sup></li>
                        <li><code>s</code> consists only of printable ASCII characters.</li>
                        <li className="font-bold text-sky-600 mt-2">Trap: Do not assume the string only has letters and spaces. It can have complex punctuation that must be skipped completely.</li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-sky-600 text-white border-sky-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? 'text-sky-200' : 'text-slate-400'}`}>{op.complexity}</div>
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
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className="text-[10px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1 flex justify-between">
                                <span>Input String</span>
                            </label>
                            <input 
                                type="text"
                                value={inputString} 
                                onChange={(e) => setInputString(e.target.value)} 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" 
                                spellCheck={false}
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className={`px-6 py-3 bg-sky-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-sky-200 hover:bg-sky-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-6 shadow-xl border transition-all duration-300 min-h-[130px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : st.isFail ? 'bg-rose-900 border-rose-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={80} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-2 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={20}/> Valid Palindrome</div>
                            <p className="text-sm leading-relaxed text-white mt-1 font-mono font-bold tracking-tight">{String(curStepData.description)}</p>
                         </div>
                    ) : st.isFail ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-xl font-black tracking-tight uppercase font-mono text-rose-400 flex items-center gap-3"><XCircle size={20}/> Invalid Palindrome</div>
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
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur"><Layout size={14} className="text-sky-500"/> String & State</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className="p-1.5 text-slate-600 hover:text-sky-600 rounded-lg transition-colors"><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-10 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           
                           {/* State Variables Row */}
                           {selectedOpId === 'twoPointers' && (
                               <div className="flex gap-4 min-w-max h-[70px]">
                                    {st.left !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-sky-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Left Ptr</span>
                                            <span className="font-mono font-black text-xl text-sky-600">{st.left}</span>
                                        </div>
                                    )}
                                    {st.right !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-fuchsia-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-fuchsia-500">Right Ptr</span>
                                            <span className="font-mono font-black text-xl text-fuchsia-600">{st.right}</span>
                                        </div>
                                    )}
                                    {st.comparing && (
                                        <div className="flex items-center gap-2 animate-in zoom-in border-2 border-amber-300 bg-amber-50 p-2 rounded-xl shadow-md">
                                            <div className="w-8 h-8 rounded bg-white border border-amber-200 flex items-center justify-center font-mono font-black text-amber-700">{st.sArr[st.left]?.toLowerCase()}</div>
                                            <span className="font-black text-amber-500 text-xs">==</span>
                                            <div className="w-8 h-8 rounded bg-white border border-amber-200 flex items-center justify-center font-mono font-black text-amber-700">{st.sArr[st.right]?.toLowerCase()}</div>
                                        </div>
                                    )}
                               </div>
                           )}

                           {selectedOpId === 'filterReverse' && (
                                <div className="flex gap-4 min-w-max h-[70px]">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-2 border-sky-200 p-2 rounded-xl min-w-[80px] shadow-sm">
                                            <span className="text-[9px] uppercase tracking-widest font-black text-sky-500">Explorer i</span>
                                            <span className="font-mono font-black text-xl text-sky-600">{st.i}</span>
                                        </div>
                                    )}
                                </div>
                           )}

                           {/* Main String Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-4xl mt-6">
                               <div className="flex gap-2 p-4 border-2 border-slate-200 bg-white/90 rounded-2xl shadow-xl backdrop-blur-sm flex-wrap justify-center w-full min-h-[100px]">
                                   {(st.sArr || []).length === 0 && <span className="text-slate-400 italic">empty</span>}
                                   {(st.sArr || []).map((val, idx) => {
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Two Pointers Logic
                                       if (selectedOpId === 'twoPointers') {
                                           const isLeftSkipped = st.skippedLeft && st.skippedLeft.includes(idx);
                                           const isRightSkipped = st.skippedRight && st.skippedRight.includes(idx);
                                           const isMatched = st.matched && st.matched.includes(idx);
                                           
                                           if (isLeftSkipped || isRightSkipped) {
                                               color = 'slate'; // Will be handled by opacity inside NodeBlock natively if space, or we just leave slate
                                           }

                                           if (st.left === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'left', color: 'sky', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'right', color: 'fuchsia', pos: 'top' });
                                           }
                                           
                                           if (st.comparing && (st.left === idx || st.right === idx)) {
                                               color = 'amber';
                                           }

                                           if (isMatched) {
                                               color = 'emerald';
                                               isHl = false; // drop scale once matched
                                           }

                                           if (st.isFail && (st.left === idx || st.right === idx)) {
                                               color = 'rose';
                                           }
                                       } 
                                       // Filter & Reverse Logic
                                       else if (selectedOpId === 'filterReverse') {
                                           if (st.i === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.hlChar && st.i === idx) color = 'amber';
                                           if (st.justAppended && st.i === idx) color = 'emerald';
                                           if (st.skippedChar && st.i === idx) color = 'rose';
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
                           </div>

                           {/* Secondary Arrays (Filter Reverse) */}
                           {selectedOpId === 'filterReverse' && (st.phase === 2 || st.builder !== undefined) && (
                               <div className="flex flex-col md:flex-row gap-8 w-full justify-center mt-4">
                                    <div className="flex flex-col items-center">
                                        <div className="text-[10px] font-black text-sky-600 uppercase tracking-widest font-mono mb-2">Filtered String</div>
                                        <div className="flex gap-1 p-3 border-2 border-sky-200 bg-sky-50/80 rounded-2xl shadow-md min-w-[150px] min-h-[60px] flex-wrap justify-center">
                                            {(st.builder || []).length === 0 && <span className="text-sky-300 italic text-xs mt-2">Empty</span>}
                                            {(st.builder || []).map((val, idx) => (
                                                <div key={`b-${idx}`} className={`w-8 h-8 flex items-center justify-center border-2 border-sky-300 bg-white font-mono font-bold rounded-lg text-sky-800 ${st.justAppended && idx === st.builder.length - 1 ? 'scale-110 shadow-md border-emerald-400 text-emerald-700' : ''} ${st.comparing || st.isSuccess ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : ''} ${st.isFail ? 'border-rose-400 bg-rose-50 text-rose-800' : ''}`}>
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {st.phase === 2 && (
                                        <div className="flex flex-col items-center">
                                            <div className="text-[10px] font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-2">Reversed String</div>
                                            <div className="flex gap-1 p-3 border-2 border-fuchsia-200 bg-fuchsia-50/80 rounded-2xl shadow-md min-w-[150px] min-h-[60px] flex-wrap justify-center animate-in slide-in-from-left-4">
                                                {(st.reversedString ? st.reversedString.split('') : []).map((val, idx) => (
                                                    <div key={`r-${idx}`} className={`w-8 h-8 flex items-center justify-center border-2 border-fuchsia-300 bg-white font-mono font-bold rounded-lg text-fuchsia-800 ${st.comparing || st.isSuccess ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : ''} ${st.isFail ? 'border-rose-400 bg-rose-50 text-rose-800' : ''}`}>
                                                        {val}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                               </div>
                           )}

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
                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><ArrowRightLeft size={120}/></div>
                        <h3 className="font-black text-sky-400 text-lg uppercase tracking-widest mb-6">The Two Pointers Strategy</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>A palindrome reads the same forwards and backwards. This naturally suggests checking the string from both ends simultaneously.</p>
                            <p>We place one pointer at the start (<code>left</code>) and one at the end (<code>right</code>).</p>
                            <p>If the characters at both pointers match, we step them inwards. If they ever mismatch, the string is definitely NOT a palindrome. If the pointers meet in the middle without a mismatch, it IS a palindrome.</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-sky-50 border border-sky-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-sky-700 text-lg uppercase tracking-widest mb-6">Handling Noise (Spaces & Punctuation)</h3>
                        <div className="space-y-4 text-sm text-sky-900/80 leading-relaxed font-medium">
                            <p>The problem states we must <em>ignore</em> non-alphanumeric characters.</p>
                            <p>Instead of creating a whole new cleaned string (which takes $O(N)$ memory), we just tell our pointers to "skip" the noise.</p>
                            <p>If <code>left</code> is pointing at a comma, we just increment <code>left++</code> until it hits a letter or number. We do the same for <code>right</code> moving backwards. This ensures our core comparison logic only ever evaluates valid characters.</p>
                        </div>
                    </div>

                    <div className="p-8 md:col-span-2 rounded-3xl bg-slate-50 border border-slate-200 relative overflow-hidden shadow-inner flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4 text-sm text-slate-600 leading-relaxed font-medium">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest mb-4">Why Not String Reverse?</h3>
                            <p>The Brute Force approach involves filtering the string, building a new one, reversing it, and doing an <code>.equals()</code> check.</p>
                            <p>This is functionally correct and easy to write, but it forces the computer to allocate new memory for the filtered string AND the reversed string. For a string with 1 million characters, you just allocated megabytes of temporary garbage memory.</p>
                            <p>Two Pointers solves this entirely in-place, using literally zero extra memory allocations ($O(1)$ Space).</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-sky-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-sky-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">The "In-Place" Check</h3>
                    <p className="text-sm text-sky-50 leading-relaxed italic max-w-2xl font-mono">"This is a fundamental string manipulation question. Interviewers use it to see if you can handle off-by-one errors and while-loop conditions gracefully. They specifically want to see the O(1) space optimization."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-sky-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><SearchCode size={16}/></div>
                               1. Acknowledge the Brute Force
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "The naive solution would be to create a new StringBuilder, iterate over the original string, append only the lowercase letters and digits, and then check if that new string equals its reverse. However, this creates O(N) auxiliary space."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ArrowRightLeft size={16}/></div>
                               2. Propose Two Pointers
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "To optimize space to strictly O(1), I can evaluate the string in-place using two pointers. One pointer starts at the beginning (index 0) and the other at the end (length - 1). I will step them towards each other."
                            </p>
                        </div>

                        <div className="bg-sky-50/50 border border-sky-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-sky-800 text-sm uppercase tracking-widest">
                               <div className="bg-sky-200 p-2 rounded-lg text-sky-700"><ShieldAlert size={16}/></div>
                               3. Handle the Noise & Traps
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-sky-100 shadow-inner flex-1">
                                "Inside the main loop, I will use inner while-loops to safely advance the left and right pointers past any non-alphanumeric characters, ensuring I don't go out of bounds. Once both pointers are on valid characters, I compare them. If they don't match, I immediately return false. If the loop completes without mismatches, it's a valid palindrome."
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
                          <div className="bg-sky-500 p-2 rounded-lg text-white shadow-lg shadow-sky-900/50"><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 whitespace-pre-wrap">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-x-auto">
                        <div className="min-w-max pr-4">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} />
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : st.isFail ? 'bg-rose-900/40 border-rose-800' : 'bg-slate-800/40 border-slate-700'}`}>
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
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? 'bg-sky-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-80 space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-widest font-mono text-sky-600 pl-1">Input String</label>
                              <input type="text" value={inputString} onChange={(e) => setInputString(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 focus:ring-sky-500 outline-none transition-all shadow-inner" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className="p-3 text-slate-600 hover:text-sky-600 rounded-xl hover:bg-sky-50 transition-all"><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {(!st.isSuccess && !st.isFail) && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess || st.isFail} className="px-12 py-6 bg-sky-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:bg-sky-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-sky-400 shadow-sky-900/20">NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           
                           {/* --- Strict Flexbox Layout (Theater) --- */}

                           {/* State Variables */}
                           {selectedOpId === 'twoPointers' && (
                               <div className="flex gap-8 origin-center mb-8 z-30">
                                    {st.left !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                            <span className="text-xs uppercase tracking-widest font-black text-sky-500">Left Ptr</span>
                                            <span className="font-mono font-black text-5xl text-sky-600 mt-2">{st.left}</span>
                                        </div>
                                    )}
                                    {st.right !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-fuchsia-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                            <span className="text-xs uppercase tracking-widest font-black text-fuchsia-500">Right Ptr</span>
                                            <span className="font-mono font-black text-5xl text-fuchsia-600 mt-2">{st.right}</span>
                                        </div>
                                    )}
                                    {st.comparing && (
                                        <div className="flex items-center gap-4 animate-in zoom-in border-[4px] border-amber-300 bg-amber-50 p-6 rounded-2xl shadow-xl ml-4">
                                            <div className="w-16 h-16 rounded-xl bg-white border-2 border-amber-200 flex items-center justify-center font-mono font-black text-amber-700 text-3xl shadow-sm">{st.sArr[st.left]?.toLowerCase()}</div>
                                            <span className="font-black text-amber-500 text-2xl mx-2">==</span>
                                            <div className="w-16 h-16 rounded-xl bg-white border-2 border-amber-200 flex items-center justify-center font-mono font-black text-amber-700 text-3xl shadow-sm">{st.sArr[st.right]?.toLowerCase()}</div>
                                        </div>
                                    )}
                               </div>
                           )}

                           {selectedOpId === 'filterReverse' && (
                                <div className="flex gap-8 origin-center mb-8 z-30">
                                    {st.i !== undefined && (
                                        <div className="flex flex-col items-center bg-white border-[3px] border-sky-200 p-6 rounded-2xl min-w-[150px] shadow-xl">
                                            <span className="text-xs uppercase tracking-widest font-black text-sky-500">Explorer i</span>
                                            <span className="font-mono font-black text-5xl text-sky-600 mt-2">{st.i}</span>
                                        </div>
                                    )}
                                </div>
                           )}

                           {/* Array Visualizer */}
                           <div className="flex flex-col items-center w-full max-w-6xl mt-4 scale-125 origin-top">
                               <div className="flex gap-4 p-8 border-[4px] border-slate-200 bg-white/90 rounded-[2rem] shadow-2xl backdrop-blur-sm flex-wrap justify-center w-full">
                                   {(st.sArr || []).length === 0 && <span className="text-slate-400 italic text-3xl p-4">empty</span>}
                                   {(st.sArr || []).map((val, idx) => {
                                       
                                       let color = 'slate';
                                       let isHl = false;
                                       let labels = [];

                                       // Two Pointers Logic
                                       if (selectedOpId === 'twoPointers') {
                                           const isLeftSkipped = st.skippedLeft && st.skippedLeft.includes(idx);
                                           const isRightSkipped = st.skippedRight && st.skippedRight.includes(idx);
                                           const isMatched = st.matched && st.matched.includes(idx);
                                           
                                           if (st.left === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'left', color: 'sky', pos: 'bottom' });
                                           }
                                           if (st.right === idx) {
                                               color = 'fuchsia'; isHl = true;
                                               labels.push({ text: 'right', color: 'fuchsia', pos: 'top' });
                                           }
                                           
                                           if (st.comparing && (st.left === idx || st.right === idx)) {
                                               color = 'amber';
                                           }

                                           if (isMatched) {
                                               color = 'emerald';
                                               isHl = false; 
                                           }

                                           if (st.isFail && (st.left === idx || st.right === idx)) {
                                               color = 'rose';
                                           }
                                       } 
                                       // Filter & Reverse Logic
                                       else if (selectedOpId === 'filterReverse') {
                                           if (st.i === idx) {
                                               color = 'sky'; isHl = true;
                                               labels.push({ text: 'i', color: 'sky', pos: 'top' });
                                           }
                                           if (st.hlChar && st.i === idx) color = 'amber';
                                           if (st.justAppended && st.i === idx) color = 'emerald';
                                           if (st.skippedChar && st.i === idx) color = 'rose';
                                       }

                                       return (
                                           <div key={`num-fs-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-4' : 'scale-100 z-10 mx-1'} my-6`}>
                                               <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">{labels.filter(l => l.pos === 'top').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="top" />)}</div>
                                               <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">{labels.filter(l => l.pos === 'bottom').map((l, j) => <PointerLabel key={j} label={l.text} color={l.color} position="bottom" />)}</div>
                                               
                                               <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>

                           {/* Secondary Arrays (Filter Reverse) Fullscreen */}
                           {selectedOpId === 'filterReverse' && (st.phase === 2 || st.builder !== undefined) && (
                               <div className="flex flex-row gap-16 w-full justify-center mt-12 scale-125 origin-top">
                                    <div className="flex flex-col items-center">
                                        <div className="text-xs font-black text-sky-600 uppercase tracking-widest font-mono mb-4 bg-sky-100 px-6 py-2 rounded-full shadow-sm">Filtered String</div>
                                        <div className="flex gap-2 p-6 border-[3px] border-sky-200 bg-sky-50/80 rounded-[2rem] shadow-xl min-w-[200px] min-h-[100px] flex-wrap justify-center">
                                            {(st.builder || []).length === 0 && <span className="text-sky-300 italic text-xl mt-4">Empty</span>}
                                            {(st.builder || []).map((val, idx) => (
                                                <div key={`b-fs-${idx}`} className={`w-12 h-12 flex items-center justify-center border-[3px] border-sky-300 bg-white font-mono font-black text-2xl rounded-xl text-sky-800 ${st.justAppended && idx === st.builder.length - 1 ? 'scale-125 shadow-xl border-emerald-400 text-emerald-700 z-20' : ''} ${st.comparing || st.isSuccess ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : ''} ${st.isFail ? 'border-rose-400 bg-rose-50 text-rose-800' : ''}`}>
                                                    {val}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {st.phase === 2 && (
                                        <div className="flex flex-col items-center">
                                            <div className="text-xs font-black text-fuchsia-600 uppercase tracking-widest font-mono mb-4 bg-fuchsia-100 px-6 py-2 rounded-full shadow-sm">Reversed String</div>
                                            <div className="flex gap-2 p-6 border-[3px] border-fuchsia-200 bg-fuchsia-50/80 rounded-[2rem] shadow-xl min-w-[200px] min-h-[100px] flex-wrap justify-center animate-in slide-in-from-left-8">
                                                {(st.reversedString ? st.reversedString.split('') : []).map((val, idx) => (
                                                    <div key={`r-fs-${idx}`} className={`w-12 h-12 flex items-center justify-center border-[3px] border-fuchsia-300 bg-white font-mono font-black text-2xl rounded-xl text-fuchsia-800 ${st.comparing || st.isSuccess ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : ''} ${st.isFail ? 'border-rose-400 bg-rose-50 text-rose-800' : ''}`}>
                                                        {val}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                               </div>
                           )}

                      </div>
                  </div>
                  {(st.isSuccess || st.isFail) && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${st.isSuccess ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${st.isSuccess ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${st.isSuccess ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    {st.isSuccess ? <PartyPopper size={48}/> : <XCircle size={48} />}
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    {st.isSuccess ? 'VALID PALINDROME' : 'INVALID PALINDROME'}
                                </h2>
                                <p className={`font-mono text-sm uppercase mb-8 tracking-widest ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {String(curStepData.description)}
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${st.isSuccess ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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