import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Code2, Check, Copy, Trophy,
  FileText, ChevronLeft, ChevronRight, RotateCcw, 
  ZoomIn, ZoomOut, Maximize2, Minimize,
  ShieldAlert, Lightbulb, MonitorPlay, PartyPopper, 
  AlignLeft, ArrowRightLeft, SearchCode, Maximize, Target, Focus, Type, CheckCircle2, XCircle, ArrowDown, ArrowUp, Layout
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  slidingWindowEdges: {
    id: 'slidingWindowEdges',
    title: '1. Sliding Window (Edges)',
    icon: <ArrowRightLeft size={16} />,
    complexity: 'Time: O(K) | Space: O(1)',
    code: `public int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int currentScore = 0;
    
    // Step 1: Calculate the sum of the first k cards
    for (int i = 0; i < k; i++) {
        currentScore += cardPoints[i];
    }
    
    int maxScore = currentScore;
    
    // Step 2: Slide the window from the end to the beginning
    // We remove one card from the right of our prefix window
    // and add one card from the end of the array.
    for (int i = k - 1; i >= 0; i--) {
        currentScore -= cardPoints[i];
        currentScore += cardPoints[n - k + i];
        maxScore = Math.max(maxScore, currentScore);
    }
    
    return maxScore;
}`,
    desc: "The Edges Sliding Window. Instead of viewing it as a traditional sliding window in the middle, we initialize a window taking all 'k' cards from the left. Then, one by one, we swap a card from the right side of our left-window with a card from the rightmost edge of the total array. This takes exactly O(K) steps."
  },
  minSubarray: {
    id: 'minSubarray',
    title: '2. Min Subarray (n - k)',
    icon: <SearchCode size={16} />,
    complexity: 'Time: O(N) | Space: O(1)',
    code: `public int maxScore(int[] cardPoints, int k) {
    int n = cardPoints.length;
    int totalSum = 0;
    for (int point : cardPoints) totalSum += point;
    
    int windowSize = n - k;
    if (windowSize == 0) return totalSum;
    
    int currentWindowSum = 0;
    for (int i = 0; i < windowSize; i++) {
        currentWindowSum += cardPoints[i];
    }
    
    int minWindowSum = currentWindowSum;
    
    // Slide the window of size (n - k) to find the minimum sum
    for (int i = windowSize; i < n; i++) {
        currentWindowSum += cardPoints[i] - cardPoints[i - windowSize];
        minWindowSum = Math.min(minWindowSum, currentWindowSum);
    }
    
    // Max score is the total sum minus the smallest contiguous block we leave behind
    return totalSum - minWindowSum;
}`,
    desc: "The Inverse Problem approach. If we must pick exactly 'k' cards from the edges, it means we must LEAVE EXACTLY a contiguous block of 'n - k' cards in the middle. To maximize the cards we take, we just need to minimize the sum of the 'n - k' cards we leave behind."
  }
};

// --- Helper UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? 'bg-[#1e293b] text-white shadow-md scale-105 border border-white/10' : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

const CodeLineRenderer = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|boolean|int|char|return|if|else|for|while|continue|break|new|length|String|charAt|substring|Math|max|min|maxScore|cardPoints)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&])/g).filter(Boolean);
  
  const activeStyles = theme === 'emerald' 
    ? { bg: `bg-emerald-500/20`, border: `border-emerald-400`, text: `text-emerald-300` }
    : { bg: `bg-rose-500/20`, border: `border-rose-400`, text: `text-rose-300` };

  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? activeStyles.text + ' font-bold' : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, i) => {
            const isKeyword = ['public', 'private', 'boolean', 'int', 'char', 'return', 'if', 'else', 'for', 'while', 'continue', 'break', 'new'].includes(part);
            const isObject = ['String', 'Math', 'Integer'].includes(part);
            const isVar = ['cardPoints', 'k', 'n', 'currentScore', 'maxScore', 'totalSum', 'windowSize', 'currentWindowSum', 'minWindowSum', 'point', 'i', 'j'].includes(part);
            const isMapCall = ['length', 'max', 'min', 'maxScore'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&'].includes(part.trim());

            let className = '';
            if (part.startsWith('//')) className = 'text-slate-500 italic';
            else if (isKeyword) className = 'text-pink-400 font-bold';
            else if (isObject) className = 'text-amber-400 font-bold';
            else if (isVar) className = 'text-sky-200';
            else if (isMapCall) className = 'text-emerald-300';
            else if (isOperator) className = 'text-slate-400 font-bold';
            else if (part.startsWith("'") || part.startsWith('"') || (!isNaN(parseInt(part.trim())) && part.trim() !== '')) className = 'text-emerald-400';

            return <span key={i} className={className}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

const PointerLabel = ({ label, color, position }) => {
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

const NodeBlock = ({ val, idx, themeColor = 'slate', isTarget }) => {
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

export default function MaxPointsCardsVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('slidingWindowEdges');
  
  const [cardsInput, setCardsInput] = useState('1,2,3,4,5,6,1');
  const [kInput, setKInput] = useState('3');
  
  const [baseCards, setBaseCards] = useState([1, 2, 3, 4, 5, 6, 1]);
  const [baseK, setBaseK] = useState(3);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef(null);
  const selectedOp = OPERATIONS[selectedOpId];

  const handleReset = () => { setCurrentStep(0); setPan({ x: 0, y: 0 }); setZoom(1); };
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };

  const toggleFullscreen = () => setIsFullscreen(prev => !prev);
  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));

  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('textarea') || e.target.closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Debounce input to safely parse arrays
  useEffect(() => {
    const timer = setTimeout(() => {
      let parsedArr = cardsInput.split(',').map(x => parseInt(x.trim())).filter(x => !isNaN(x));
      if (parsedArr.length === 0) parsedArr = [1,2,3,4,5,6,1];
      if (parsedArr.length > 20) parsedArr = parsedArr.slice(0, 20); // Keep it manageable for the visualizer
      
      let parsedK = Math.max(1, parseInt(kInput) || 1);
      parsedK = Math.min(parsedK, parsedArr.length); // k cannot exceed array length

      setBaseCards(parsedArr);
      setBaseK(parsedK);
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
    }, 400);
    return () => clearTimeout(timer);
  }, [cardsInput, kInput, selectedOpId]);

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
    if (!baseCards || baseCards.length === 0) return [{ phase: 'Init', description: 'Enter valid array.', line: 1, state: { arr: [] } }];

    let arr = [...baseCards];
    let n = arr.length;
    let k = baseK;

    const add = (ph, ds, ln, st) => steps.push({ 
        phase: ph, description: ds, line: ln, 
        state: { arr: [...arr], n, k, ...st } 
    });

    if (selectedOpId === 'slidingWindowEdges') {
        let currentScore = 0;
        let picked = new Set();
        
        add("Function Call", `public int maxScore(int[] cardPoints, int k) // k = ${k}`, 1, { picked: new Set(picked), currentScore, maxScore: 0 });
        add("Init Variables", `int n = ${n};\nint currentScore = 0;`, 2, { picked: new Set(picked), currentScore, maxScore: 0 });
        
        add("Prefix Sum Loop", `for (int i = 0; i < k; i++)\nCalculate the score if we take all ${k} cards from the left.`, 6, { picked: new Set(picked), currentScore, maxScore: 0 });
        for (let i = 0; i < k; i++) {
            currentScore += arr[i];
            picked.add(i);
            add("Add to Prefix", `currentScore += cardPoints[${i}]; // +${arr[i]}\ncurrentScore is now ${currentScore}.`, 7, { picked: new Set(picked), currentScore, maxScore: 0, hlIdx: i });
        }
        
        let maxScore = currentScore;
        add("Set Initial Max", `int maxScore = currentScore;\nInitial maxScore is ${maxScore}.`, 10, { picked: new Set(picked), currentScore, maxScore });

        add("Sliding End Loop", `for (int i = k - 1; i >= 0; i--)\nWe will swap one card from the left with one from the right.`, 14, { picked: new Set(picked), currentScore, maxScore });
        
        for (let i = k - 1; i >= 0; i--) {
            let rightIdx = n - k + i;
            
            add("Prepare Swap", `Swapping out card at index ${i} for card at index ${rightIdx}.`, 14, { picked: new Set(picked), currentScore, maxScore, removeTarget: i, addTarget: rightIdx });
            
            currentScore -= arr[i];
            picked.delete(i);
            add("Remove Left Card", `currentScore -= cardPoints[${i}]; // -${arr[i]}\ncurrentScore drops to ${currentScore}.`, 15, { picked: new Set(picked), currentScore, maxScore, hlRemove: i, addTarget: rightIdx });
            
            currentScore += arr[rightIdx];
            picked.add(rightIdx);
            add("Add Right Card", `currentScore += cardPoints[${rightIdx}]; // +${arr[rightIdx]}\ncurrentScore becomes ${currentScore}.`, 16, { picked: new Set(picked), currentScore, maxScore, hlAdd: rightIdx });
            
            let prevMax = maxScore;
            maxScore = Math.max(maxScore, currentScore);
            add("Update Max", `maxScore = Math.max(${prevMax}, ${currentScore});\nmaxScore is now ${maxScore}.`, 17, { picked: new Set(picked), currentScore, maxScore, hlUpdate: maxScore > prevMax });
        }
        
        add("Return Result", `return maxScore;\nAlgorithm complete. Maximum points obtainable is ${maxScore}.`, 20, { picked: new Set(picked), currentScore, maxScore, isSuccess: true });

    } else if (selectedOpId === 'minSubarray') {
        
        let totalSum = arr.reduce((a,b) => a+b, 0);
        add("Function Call & Init", `int totalSum = 0;\nCalculate the sum of the entire array.`, 2, { totalSum: 0, currentWindowSum: 0, minWindowSum: 0 });
        add("Calculate Total Sum", `for (int point : cardPoints) totalSum += point;\ntotalSum = ${totalSum}.`, 4, { totalSum, currentWindowSum: 0, minWindowSum: 0 });

        let windowSize = n - k;
        add("Calculate Ignored Window", `int windowSize = n - k;\nWe need to pick ${k} cards, meaning we MUST leave behind ${n} - ${k} = ${windowSize} contiguous cards.`, 6, { totalSum, windowSize, currentWindowSum: 0, minWindowSum: 0 });
        
        if (windowSize === 0) {
            add("Early Return", `if (windowSize == 0) return totalSum;\nWe are picking all cards! Return ${totalSum}.`, 7, { totalSum, windowSize, isSuccess: true, finalAns: totalSum });
            return steps;
        }

        let currentWindowSum = 0;
        add("Initial Window Loop", `for (int i = 0; i < windowSize; i++)\nCalculate the sum of the first ${windowSize} cards.`, 10, { totalSum, windowSize, currentWindowSum, minWindowSum: 0, left: 0, right: -1 });
        
        for (let i = 0; i < windowSize; i++) {
            currentWindowSum += arr[i];
            add("Add to Current Window", `currentWindowSum += cardPoints[${i}]; // +${arr[i]}\ncurrentWindowSum is now ${currentWindowSum}.`, 11, { totalSum, windowSize, currentWindowSum, minWindowSum: 0, left: 0, right: i, isExpanding: true });
        }
        
        let minWindowSum = currentWindowSum;
        add("Set Initial Min", `int minWindowSum = currentWindowSum;\nInitial minWindowSum is ${minWindowSum}.`, 14, { totalSum, windowSize, currentWindowSum, minWindowSum, left: 0, right: windowSize - 1 });

        add("Sliding Window Loop", `for (int i = windowSize; i < n; i++)\nSlide the window of size ${windowSize} to find the minimum sum.`, 17, { totalSum, windowSize, currentWindowSum, minWindowSum, left: 0, right: windowSize - 1 });
        
        for (let i = windowSize; i < n; i++) {
            let left = i - windowSize;
            let right = i;
            
            currentWindowSum += arr[right] - arr[left];
            add("Slide Forward", `currentWindowSum += cardPoints[${right}] - cardPoints[${left}];\nAdd ${arr[right]}, remove ${arr[left]}. Sum becomes ${currentWindowSum}.`, 18, { totalSum, windowSize, currentWindowSum, minWindowSum, left: left + 1, right, hlSlide: true });
            
            let prevMin = minWindowSum;
            minWindowSum = Math.min(minWindowSum, currentWindowSum);
            add("Update Min Sum", `minWindowSum = Math.min(${prevMin}, ${currentWindowSum});\nminWindowSum is now ${minWindowSum}.`, 19, { totalSum, windowSize, currentWindowSum, minWindowSum, left: left + 1, right, hlUpdate: minWindowSum < prevMin });
        }
        
        let finalAns = totalSum - minWindowSum;
        add("Return Result", `return totalSum - minWindowSum;\n${totalSum} - ${minWindowSum} = ${finalAns}.`, 23, { totalSum, windowSize, currentWindowSum, minWindowSum, left: n - windowSize, right: n - 1, isSuccess: true, finalAns });
    }

    return steps;
  }, [baseCards, baseK, selectedOpId]);

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

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: { arr: [] } };
  const st = curStepData.state || { arr: [] };
  const isLastStep = currentStep === trace.length - 1;

  const themeColor = selectedOpId === 'slidingWindowEdges' ? 'emerald' : 'rose';

  // --- Rendering Helpers ---

  const renderCardArray = () => {
      if (!st.arr || st.arr.length === 0) return <span className="text-slate-400 italic">empty</span>;

      return (
          <div className="flex flex-col items-center w-full mt-4">
              <div className="flex gap-2 p-4 border-[3px] border-slate-200 bg-white/90 rounded-[2rem] shadow-xl backdrop-blur-sm flex-wrap justify-center items-center">
                  
                  {st.arr.map((val, idx) => {
                      let color = 'slate';
                      let isHl = false;
                      let labels = [];

                      // --- Sliding Window Edges Visuals ---
                      if (selectedOpId === 'slidingWindowEdges') {
                          if (st.picked && st.picked.has(idx)) {
                              color = 'emerald';
                              isHl = true;
                          }
                          if (st.hlIdx === idx) {
                              color = 'amber';
                              isHl = true;
                          }
                          if (st.removeTarget === idx) {
                              color = 'rose';
                              labels.push({ text: 'Removing', color: 'rose', pos: 'bottom' });
                          }
                          if (st.hlRemove === idx) {
                              color = 'rose';
                              isHl = true;
                          }
                          if (st.addTarget === idx) {
                              color = 'sky';
                              labels.push({ text: 'Adding Next', color: 'sky', pos: 'top' });
                          }
                          if (st.hlAdd === idx) {
                              color = 'sky';
                              isHl = true;
                          }
                      } 
                      // --- Min Subarray Visuals ---
                      else if (selectedOpId === 'minSubarray') {
                          // The "picked" cards are EVERYTHING OUTSIDE the window
                          let inWindow = (st.left !== undefined && st.right !== undefined && idx >= st.left && idx <= st.right);
                          
                          if (st.windowSize > 0) {
                              if (inWindow) {
                                  color = 'rose'; // The unpicked/ignored window
                                  if (st.left === idx) labels.push({ text: 'L', color: 'rose', pos: 'bottom' });
                                  if (st.right === idx) labels.push({ text: 'R', color: 'rose', pos: 'top' });
                                  if (st.hlSlide) isHl = true;
                              } else {
                                  color = 'emerald'; // The picked cards
                              }
                          } else if (st.isSuccess) {
                              color = 'emerald'; // Picked everything
                          }

                          if (st.isExpanding && inWindow) {
                              isHl = true;
                              color = 'amber';
                          }
                      }

                      return (
                          <div key={`char-${idx}`} className={`relative transition-all duration-300 ${isHl ? 'scale-110 z-20 mx-1 md:mx-2' : 'scale-100 z-10 m-0.5 md:m-1'}`}>
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                                {labels.filter(l => l.pos === 'top').map((l, j) => (
                                    <React.Fragment key={j}>
                                        <PointerLabel label={l.text} color={l.color} position="top" />
                                    </React.Fragment>
                                ))}
                              </div>
                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                                {labels.filter(l => l.pos === 'bottom').map((l, j) => (
                                    <React.Fragment key={j}>
                                        <PointerLabel label={l.text} color={l.color} position="bottom" />
                                    </React.Fragment>
                                ))}
                              </div>
                              <NodeBlock val={val} idx={idx} themeColor={color} isTarget={isHl} />
                          </div>
                      )
                  })}
              </div>

              {/* Data Overlay */}
              {!st.isSuccess && selectedOpId === 'slidingWindowEdges' && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Score</span>
                        <span className="font-mono text-3xl font-black text-slate-700">{st.currentScore !== undefined ? st.currentScore : 0}</span>
                        <span className="text-[9px] text-slate-400 mt-2 font-mono text-center leading-tight">Sum of green selected cards</span>
                    </div>

                    <div className={`bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-all ${st.hlUpdate ? 'ring-4 ring-emerald-500 scale-105' : ''}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Max Score (Best)</span>
                        <span className="font-mono text-3xl font-black text-emerald-400">{st.maxScore !== undefined ? st.maxScore : 0}</span>
                    </div>
                </div>
              )}

              {!st.isSuccess && selectedOpId === 'minSubarray' && (
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
                    <div className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Array Sum</span>
                        <span className="font-mono text-2xl font-black text-slate-700">{st.totalSum !== undefined ? st.totalSum : 0}</span>
                    </div>
                    
                    <div className={`border-2 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-colors duration-300 bg-rose-50 border-rose-200`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">Current Ignored Window</span>
                        <div className="flex items-center gap-2 font-mono text-2xl font-bold text-rose-700">
                            <span>{st.currentWindowSum !== undefined ? st.currentWindowSum : 0}</span>
                        </div>
                        <span className="text-[9px] text-rose-400/80 mt-1 font-mono text-center leading-tight">Sum of red unpicked cards</span>
                    </div>

                    <div className={`bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 shadow-md flex flex-col items-center justify-center transition-all ${st.hlUpdate ? 'ring-4 ring-rose-500 scale-105' : ''}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Min Window Found</span>
                        <span className="font-mono text-3xl font-black text-rose-400">{st.minWindowSum !== undefined ? st.minWindowSum : 0}</span>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center ${themeColor === 'emerald' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
                <Focus className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Max Points from Cards</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded ${themeColor === 'emerald' ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                      LC 1423 • Sliding Window
                  </span>
                  <span>•</span>
                  <span>O(K) / O(N) Time</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Problem" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Visualizer" />
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-8 flex flex-col">
                <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}><AlignLeft size={28}/> Problem Statement</div>
                
                <p className="text-base leading-relaxed">
                  There are several cards arranged in a row, and each card has an associated number of points. The points are given in the integer array <code>cardPoints</code>.<br/><br/>
                  In one step, you can take one card from the <strong>beginning</strong> or from the <strong>end</strong> of the row. You have to take exactly <code>k</code> cards.<br/><br/>
                  Your score is the sum of the points of the cards you have taken. Given the array and integer <code>k</code>, return the <strong>maximum score</strong> you can obtain.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 border-l-4 border-emerald-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-emerald-400 font-black uppercase tracking-widest text-[10px]">Example 1</span>
                        <div><span className="text-white font-bold">Input:</span> cardPoints = [1,2,3,4,5,6,1], k = 3</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 12</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>After the first step, your score will always be 1. However, choosing the rightmost card first will maximize your total score. The optimal strategy is to take the three cards on the right, giving a final score of 1 + 6 + 5 = 12.</div>
                    </div>
                    <div className="bg-slate-900 border-l-4 border-amber-500 p-5 rounded-r-xl font-mono text-xs shadow-md text-slate-300 space-y-2 flex flex-col">
                        <span className="text-amber-400 font-black uppercase tracking-widest text-[10px]">Example 2</span>
                        <div><span className="text-white font-bold">Input:</span> cardPoints = [2,2,2], k = 2</div>
                        <div><span className="text-emerald-400 font-bold">Output:</span> 4</div>
                        <div className="text-slate-500 mt-2 flex-1">Explanation:<br/>Regardless of which two cards you take, your score will always be 4.</div>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-inner">
                    <h4 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-3">Constraints & Traps</h4>
                    <ul className="list-disc list-inside text-xs font-mono text-slate-600 space-y-2">
                        <li>1 &lt;= cardPoints.length &lt;= 10⁵</li>
                        <li>1 &lt;= cardPoints[i] &lt;= 10⁴</li>
                        <li>1 &lt;= k &lt;= cardPoints.length</li>
                        <li className={`font-bold mt-2 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            Trap: A naive recursive / DP approach trying to pick left or right at each step takes O(2^k) or O(K^2) time, which will result in a Time Limit Exceeded error. This problem must be solved using a Sliding Window.
                        </li>
                    </ul>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white border-emerald-600 scale-[1.02]' : 'bg-rose-600 text-white border-rose-600 scale-[1.02]') : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'text-emerald-200' : 'text-rose-200') : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden relative">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <React.Fragment key={idx}>
                          <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
                        <div className="flex-1 w-full space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>Array 'cardPoints' (Comma separated)</span>
                            </label>
                            <input 
                                type="text"
                                value={cardsInput} 
                                onChange={(e) => setCardsInput(e.target.value)} 
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} 
                                spellCheck={false}
                                placeholder="1,2,3,4,5,6,1"
                            />
                        </div>
                        <div className="w-32 shrink-0 space-y-1.5 group">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono pl-1 flex justify-between ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                <span>Picks 'k'</span>
                            </label>
                            <input 
                                type="number"
                                value={kInput} 
                                onChange={(e) => setKInput(e.target.value)} 
                                min={1}
                                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} 
                            />
                        </div>
                        <div className="flex gap-2 shrink-0 justify-end items-center mt-2 xl:mt-0">
                            <button onClick={handleReset} className="p-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 shadow-sm transition-colors"><RotateCcw size={18}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors"><ChevronLeft size={18}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-6 py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2 group disabled:opacity-30 ${themeColor === 'emerald' ? 'bg-emerald-600 shadow-emerald-200 hover:bg-emerald-700' : 'bg-rose-600 shadow-rose-200 hover:bg-rose-700'}`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
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
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-2 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 min-h-[440px] relative flex flex-col shadow-inner overflow-hidden">
                   <div className="absolute top-4 left-4 z-30 pointer-events-none"><span className={`text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur ${themeColor === 'emerald' ? 'text-emerald-500' : 'text-rose-500'}`}><Layout size={14}/> Array Tracker</span></div>
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-1.5 rounded-xl shadow-lg border border-slate-200 backdrop-blur gap-1">
                            <button onClick={zoomIn} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><ZoomIn size={16}/></button>
                            <button onClick={zoomOut} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><ZoomOut size={16}/></button>
                            <button onClick={toggleFullscreen} className={`p-1.5 text-slate-600 rounded-lg transition-colors ${themeColor === 'emerald' ? 'hover:text-emerald-600' : 'hover:text-rose-600'}`}><Maximize2 size={16}/></button>
                        </div>
                   </div>

                   <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                       <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-300 flex flex-col p-8 pt-20 pb-16 gap-4 items-center overflow-x-auto overflow-y-hidden scrollbar-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                           {renderCardArray()}
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
                        <h3 className="font-black text-emerald-400 text-lg uppercase tracking-widest mb-6">The "Wrap-Around" Sliding Window</h3>
                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-medium z-10 relative">
                            <p>Because you can pick from either the left edge or the right edge, the optimal combination of cards is essentially a contiguous subarray that "wraps around" the edges of the array.</p>
                            <p>Instead of doing complex DP, we can simplify this: assume we take ALL <code>k</code> cards from the left. This is our initial "window" score.</p>
                            <p>Then, we iterate backwards. We drop the rightmost card from our left-selection, and we add the rightmost card from the array's right edge. We keep sliding this window over the gap, updating our max score at each swap!</p>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-3xl bg-rose-50 border border-rose-100 relative overflow-hidden shadow-inner">
                        <h3 className="font-black text-rose-700 text-lg uppercase tracking-widest mb-6">The "Inverse Problem" Logic</h3>
                        <div className="space-y-4 text-sm text-rose-900/80 leading-relaxed font-medium">
                            <p>There is a completely different way to think about this problem that maps perfectly to standard Sliding Window techniques.</p>
                            <p>If there are <code>N</code> total cards, and you MUST pick exactly <code>K</code> cards from the edges, that means you are forced to <strong>leave exactly <code>N - K</code> contiguous cards behind in the middle.</strong></p>
                            <p>Therefore, to <strong>maximize</strong> the sum of the cards you pick, you just need to <strong>minimize</strong> the sum of the <code>N - K</code> contiguous cards you leave behind. Find the minimum subarray of size <code>N - K</code>, and subtract it from the Total Sum!</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className="bg-emerald-600 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-emerald-700">
                    <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight">O(K) vs O(N) Time Complexity</h3>
                    <p className="text-sm text-emerald-50 leading-relaxed italic max-w-2xl font-mono">"While both the Edges Sliding Window and the Min Subarray approaches are optimal O(1) space, the Edges approach is strictly better in Time Complexity when K is very small compared to N. Interviewers want to see if you can spot this subtle optimization difference."</p>
                </div>
                
                <div className="space-y-6">
                    <h5 className="font-black uppercase tracking-widest text-[11px] text-slate-400 border-b border-slate-200 pb-3 flex items-center gap-2">
                        <Activity size={14} className="text-emerald-500"/> The Perfect Interview Script
                    </h5>
                    <div className="grid md:grid-cols-2 gap-6">
                        
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><SearchCode size={16}/></div>
                               1. Acknowledge Recursion / DP
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "The naive approach is recursion: at each step we choose either the left or right card. We could memoize this with DP, but that would take O(K^2) time and space. Since k can be up to 10^5, this will definitely Time Limit Exceed (TLE) and run out of memory."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ArrowRightLeft size={16}/></div>
                               2. Discuss the Inverse Problem
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "A better way is treating it as an inverse problem. Maximizing the edges means minimizing the contiguous N-K cards in the middle. We can use a standard sliding window of size N-K to find the minimum sum. This takes O(N) time and O(1) space."
                            </p>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-3 md:col-span-2">
                            <div className="flex items-center gap-3 font-bold text-emerald-800 text-sm uppercase tracking-widest">
                               <div className="bg-emerald-200 p-2 rounded-lg text-emerald-700"><ShieldAlert size={16}/></div>
                               3. Pivot to the Optimal O(K) Edges Window
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed font-mono italic bg-white p-4 rounded-xl border border-emerald-100 shadow-inner flex-1">
                                "However, if K is much smaller than N, O(N) is unnecessary. I can optimize the time to strictly O(K) by sliding the window directly across the edges. I will sum the first K cards. Then, in a loop running exactly K times, I'll subtract one card from the right of my prefix window and add one card from the right edge of the array, updating my max score. This achieves O(K) time and O(1) space, which is the absolute theoretical optimal."
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
                          <div className={`p-2 rounded-lg text-white shadow-lg ${themeColor === 'emerald' ? 'bg-emerald-500 shadow-emerald-900/50' : 'bg-rose-500 shadow-rose-900/50'}`}><Code2 size={20}/></div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                      <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all shadow-md"><Minimize size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 whitespace-pre-wrap flex flex-col">
                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4 overflow-hidden shrink-0">
                        <div className="w-full">
                            {selectedOp.code.split('\n').map((line, idx) => (
                                <React.Fragment key={idx}>
                                    <CodeLineRenderer num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} />
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? (themeColor === 'emerald' ? 'bg-emerald-900/40 border-emerald-800' : 'bg-rose-900/40 border-rose-800') : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-wrap">{String(curStepData.description || "")}</p>
                    </div>
                  </div>
              </div>
              <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  {/* Floating Controls for Fullscreen */}
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? (themeColor === 'emerald' ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white shadow-md') : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="w-60 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>Array 'cardPoints' (Comma separated)</label>
                              <input type="text" value={cardsInput} onChange={(e) => setCardsInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
                          </div>
                          <div className="w-20 space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 ${themeColor === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`}>'k'</label>
                              <input type="number" min={1} value={kInput} onChange={(e) => setKInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs uppercase focus:ring-2 outline-none transition-all shadow-inner ${themeColor === 'emerald' ? 'focus:ring-emerald-500' : 'focus:ring-rose-500'}`} />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 rounded-xl transition-all ${themeColor === 'emerald' ? 'hover:bg-emerald-50 hover:text-emerald-600' : 'hover:bg-rose-50 hover:text-rose-600'}`}><RotateCcw size={24}/></button>
                        </div>
                  </div>
                  
                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-[110] flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 text-white rounded-[2rem] hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border shadow-2xl ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-400 shadow-emerald-900/30' : 'bg-rose-600 hover:bg-rose-700 border-rose-400 shadow-rose-900/30'}`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  {/* Drag Canvas */}
                  <div ref={canvasContainerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="absolute top-0 left-0 min-w-full w-max min-h-full origin-top-left transition-transform duration-500 flex flex-col p-16 md:p-32 pt-40 gap-16 items-center overflow-visible" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.3})` }}>
                           {renderCardArray()}
                      </div>
                  </div>
                  
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(0,0,0,0.5)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden ${themeColor === 'emerald' ? 'border-emerald-500 shadow-emerald-500/30' : 'border-rose-500 shadow-rose-500/30'}`}>
                                <div className={`absolute top-0 left-0 w-full h-2 ${themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ${themeColor === 'emerald' ? 'bg-emerald-500/20 text-emerald-500 ring-emerald-500/10' : 'bg-rose-500/20 text-rose-500 ring-rose-500/10'}`}>
                                    <PartyPopper size={48}/>
                                </div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">
                                    COMPLETED
                                </h2>
                                <p className={`font-mono text-xl uppercase mb-8 tracking-widest ${themeColor === 'emerald' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    Maximum Score: <span className="font-black text-3xl text-white ml-2">{st.finalAns || st.maxScore}</span>
                                </p>
                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg ${themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-900/20'}`}>
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