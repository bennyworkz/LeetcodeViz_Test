import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, 
  RotateCcw, ListOrdered, Lightbulb, MonitorPlay, PartyPopper,
  XCircle, Minimize, Layers as LayersIcon, ZoomIn, ZoomOut, Maximize, 
  SortAsc, AlertTriangle, Clock, Cpu, HelpCircle, Target, Coins, Network, Grid, CheckCircle2, GitBranch,
  Goal, Workflow, CheckSquare, ShieldAlert, ArrowUp
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  dpTabulation: {
    id: 'dpTabulation',
    title: '1. Bottom-Up DP (Tabulation)',
    icon: <Grid size={16} />,
    complexity: 'Time: O(S * n) | Space: O(S)',
    theme: 'emerald',
    code: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int max = amount + 1;
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, max);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int j = 0; j < coins.length; j++) {
                if (coins[j] <= i) {
                    dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);
                }
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
    desc: "The standard Dynamic Programming approach. We build an array `dp` where `dp[i]` stores the minimum number of coins needed to make amount `i`. We initialize the array with a 'MAX' value (amount + 1). For every amount from 1 to `amount`, we try subtracting each coin we have. If the coin fits, the minimum coins needed is `1 + dp[amount - coin]`. We take the minimum across all possible coins!"
  },
  bfsGraph: {
    id: 'bfsGraph',
    title: '2. BFS (Shortest Path)',
    icon: <Network size={16} />,
    complexity: 'Time: O(S * n) | Space: O(S)',
    theme: 'sky',
    code: `class Solution {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0;
        Queue<Integer> q = new LinkedList<>();
        boolean[] visited = new boolean[amount + 1];
        
        q.offer(0);
        visited[0] = true;
        int coinsCount = 0;
        
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                int curr = q.poll();
                if (curr == amount) return coinsCount;
                
                for (int coin : coins) {
                    int next = curr + coin;
                    if (next <= amount && !visited[next]) {
                        visited[next] = true;
                        q.offer(next);
                    }
                }
            }
            coinsCount++;
        }
        return -1;
    }
}`,
    desc: "A Breadth-First Search (Graph) approach. Imagine the amounts are nodes (from 0 to `amount`) and each coin is a directed edge jumping forward by that coin's value. Finding the minimum number of coins is exactly identical to finding the shortest path from node 0 to node `amount` in an unweighted graph! We use a Queue to explore layer by layer, returning the depth (`coinsCount`) as soon as we hit the target."
  }
};

// --- Helper UI Components ---

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  themeColor: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, themeColor }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-600 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
  idPrefix?: string;
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald', idPrefix = '' }) => {
  const parts = code.split(/(\/\/.*|\/\*.*|\*.*|".*?"|'.'|\b(?:public|private|void|int|long|boolean|class|return|if|else|while|for|new|String|coinChange|Arrays|fill|Math|min|length|coins|amount|dp|max|Queue|LinkedList|visited|offer|poll|isEmpty|size|curr|next|coin|coinsCount|Solution)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^\{\}\(\)])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`${idPrefix}code-line-${num}`} className={`flex relative z-10 min-h-[18px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[2px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-600'}`}>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const trimmed = part.trim();
            if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
                return <span key={idx} className="text-slate-500 italic">{part}</span>;
            }
            
            const isKeyword = ['public', 'private', 'void', 'int', 'long', 'boolean', 'class', 'return', 'if', 'else', 'while', 'for', 'new'].includes(part);
            const isObject = ['Solution', 'Arrays', 'Math', 'Queue', 'LinkedList'].includes(part);
            const isPointer = ['coins', 'amount', 'dp', 'max', 'i', 'j', 'visited', 'curr', 'next', 'coin', 'coinsCount', 'size', 'length'].includes(part);
            const isMapCall = ['coinChange', 'fill', 'min', 'offer', 'poll', 'isEmpty'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^', '{', '}', '(', ')'].includes(trimmed);
            
            return (
              <span 
                key={idx} 
                className={
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isNaN(parseInt(part)) ? (part.startsWith('"') || part.startsWith("'") ? 'text-emerald-300' : '') : 'text-emerald-400'
                }
              >
                {part}
              </span>
            );
        })}
      </pre>
    </div>
  );
};

// --- Main Application ---

export default function CoinChangeVisualizer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOpId, setSelectedOpId] = useState('dpTabulation');
  
  const [coinsInput, setCoinsInput] = useState('1, 2, 5');
  const [amountInput, setAmountInput] = useState('11');
  
  const [coinsArr, setCoinsArr] = useState([1, 2, 5]);
  const [amount, setAmount] = useState(11);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1); 
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerMainRef = useRef<HTMLDivElement>(null);
  const codeContainerFullscreenRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Effects for Data Processing ---

  const parseArrayInput = (inputStr: string, fallback: number[]) => {
      let rawTokens = inputStr.split(',');
      let parsedArr: number[] = [];
      for (let token of rawTokens) {
          let t = token.trim();
          let num = parseInt(t, 10);
          if (!isNaN(num) && num > 0) parsedArr.push(num);
      }
      if (parsedArr.length === 0) parsedArr = fallback;
      if (parsedArr.length > 10) parsedArr = parsedArr.slice(0, 10); // Cap for visualization
      return parsedArr;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoinsArr(parseArrayInput(coinsInput, [1, 2, 5]));
      let parsedAmount = parseInt(amountInput, 10);
      if (isNaN(parsedAmount) || parsedAmount < 0) parsedAmount = 11;
      if (parsedAmount > 25) parsedAmount = 25; // Cap amount for rendering sanity
      setAmount(parsedAmount);
      
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [coinsInput, amountInput, selectedOpId]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        if (!canvasContainerRef.current?.contains(e.target as Node)) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.4), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Generate trace strictly aligned with the exact Java code lines
  const trace = useMemo(() => {
    const steps: any[] = [];
    
    const INF = amount + 1;
    let coins = [...coinsArr].sort((a,b) => a-b); // sorted for cleaner visualization, though not strictly required

    const add = (ph: string, ds: string, ln: number, st: any) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { ...st } 
    });

    if (selectedOpId === 'dpTabulation') {
        let dp = new Array(amount + 1).fill(INF);
        const cloneDP = () => [...dp];

        add("Init", `public int coinChange(int[] coins, int amount)`, 2, { dpState: cloneDP(), hlPhase: 'init' });
        
        add("Set Max/INF", `int max = amount + 1;\nUsing ${INF} to represent Infinity.`, 3, { dpState: cloneDP(), hlPhase: 'initData' });
        
        add("Init DP Array", `int[] dp = new int[amount + 1];\nArrays.fill(dp, max);`, 5, { dpState: cloneDP(), hlPhase: 'initData' });

        dp[0] = 0;
        add("Base Case", `dp[0] = 0;\nIt takes 0 coins to make amount 0.`, 6, { dpState: cloneDP(), hlPhase: 'baseCase' });

        for (let i = 1; i <= amount; i++) {
            if (steps.length > 2000) break;
            
            add("Outer Loop (Target Amount)", `for (int i = 1; i <= amount; i++)\nFinding the minimum coins required to make amount ${i}.`, 8, { dpState: cloneDP(), hlPhase: 'outerLoop', curI: i });

            for (let j = 0; j < coins.length; j++) {
                let coin = coins[j];
                
                add("Inner Loop (Try Coin)", `for (int j = 0; j < coins.length; j++)\nTrying to use coin with value ${coin}.`, 9, { dpState: cloneDP(), hlPhase: 'innerLoop', curI: i, curCoin: coin, curJ: j });

                add("Check Coin Fit", `if (coins[j] <= i)\nDoes coin ${coin} fit into amount ${i}? (${coin <= i ? 'Yes' : 'No'})`, 10, { dpState: cloneDP(), hlPhase: 'checkFit', curI: i, curCoin: coin, curJ: j, fits: coin <= i });

                if (coin <= i) {
                    let prevAmount = i - coin;
                    let prevCoins = dp[prevAmount];
                    let potentialNewCoins = prevCoins === INF ? INF : prevCoins + 1;
                    
                    add("Calculate Min", `dp[i] = Math.min(dp[i], dp[i - coins[j]] + 1);\nLooking back at amount ${prevAmount}. It takes ${prevCoins === INF ? 'INF' : prevCoins} coins to make ${prevAmount}.\nNew potential path: ${prevCoins === INF ? 'INF' : prevCoins} + 1 coin = ${potentialNewCoins === INF ? 'INF' : potentialNewCoins}.`, 11, { dpState: cloneDP(), hlPhase: 'calcMin', curI: i, curCoin: coin, curJ: j, prevAmount, prevCoins, potentialNewCoins });

                    if (potentialNewCoins < dp[i]) {
                        dp[i] = potentialNewCoins;
                        add("Update DP", `dp[i] updated to ${dp[i]}!`, 11, { dpState: cloneDP(), hlPhase: 'updateDp', curI: i, curCoin: coin, curJ: j, prevAmount, prevCoins, potentialNewCoins, updated: true });
                    } else {
                        add("Keep Existing DP", `Current dp[i] is ${dp[i] === INF ? 'INF' : dp[i]}, which is better (or equal) to ${potentialNewCoins === INF ? 'INF' : potentialNewCoins}. No update.`, 11, { dpState: cloneDP(), hlPhase: 'updateDp', curI: i, curCoin: coin, curJ: j, prevAmount, prevCoins, potentialNewCoins, updated: false });
                    }
                }
            }
        }

        let finalAns = dp[amount] > amount ? -1 : dp[amount];
        add("Done", `return dp[amount] > amount ? -1 : dp[amount];\nDP Array complete! Final answer is ${finalAns}.`, 16, { dpState: cloneDP(), hlPhase: 'success', isSuccess: true, finalAns });

    } else if (selectedOpId === 'bfsGraph') {
        let q: number[] = [];
        let visited = new Array(amount + 1).fill(false);
        let coinsCount = 0;
        
        const cloneQ = () => [...q];
        const cloneVis = () => [...visited];

        add("Init", `public int coinChange(int[] coins, int amount)`, 2, { hlPhase: 'init' });

        if (amount === 0) {
            add("Base Case", `if (amount == 0) return 0;`, 3, { hlPhase: 'success', isSuccess: true, finalAns: 0, qState: [], visState: [] });
            return steps;
        }

        add("Init Structures", `Queue<Integer> q = new LinkedList<>();\nboolean[] visited = new boolean[amount + 1];`, 4, { hlPhase: 'initStruct', qState: cloneQ(), visState: cloneVis() });

        q.push(0);
        visited[0] = true;
        add("Enqueue Start Node", `q.offer(0);\nvisited[0] = true;\nStarting search from amount 0.`, 7, { hlPhase: 'enqueueStart', qState: cloneQ(), visState: cloneVis() });

        let found = false;

        while (q.length > 0 && !found) {
            if (steps.length > 2000) break;

            add("While Loop", `while (!q.isEmpty()) {\nQueue has elements, moving to depth level ${coinsCount}.`, 11, { hlPhase: 'while', qState: cloneQ(), visState: cloneVis(), coinsCount });

            let size = q.length;
            add("Level Size", `int size = q.size();\nProcessing ${size} nodes at the current depth (coins used so far: ${coinsCount}).`, 12, { hlPhase: 'size', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size });

            for (let i = 0; i < size; i++) {
                if (found) break;

                let curr = q.shift()!;
                add("Poll Node", `int curr = q.poll();\nExtracted amount ${curr} from the queue.`, 14, { hlPhase: 'poll', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size, curr });

                add("Check Target", `if (curr == amount) return coinsCount;\nIs ${curr} equal to target ${amount}?`, 15, { hlPhase: 'checkTarget', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size, curr });

                if (curr === amount) {
                    add("Target Reached!", `Returning ${coinsCount}!`, 15, { hlPhase: 'success', isSuccess: true, finalAns: coinsCount, qState: cloneQ(), visState: cloneVis(), curr });
                    found = true;
                    break;
                }

                for (let j = 0; j < coins.length; j++) {
                    let coin = coins[j];
                    let next = curr + coin;
                    
                    add("Try Edge", `for (int coin : coins) { ... int next = curr + coin;\nTrying to add coin ${coin} to current amount ${curr}. Next possible amount: ${next}.`, 17, { hlPhase: 'tryEdge', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size, curr, coin, next });

                    let isValid = next <= amount && !visited[next];
                    add("Validate Edge", `if (next <= amount && !visited[next])\nIs ${next} <= target (${amount}) AND unvisited? (${isValid ? 'Yes' : 'No'})`, 19, { hlPhase: 'validateEdge', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size, curr, coin, next, isValid });

                    if (isValid) {
                        visited[next] = true;
                        q.push(next);
                        add("Enqueue Next", `visited[next] = true;\nq.offer(next);\nMarking ${next} as visited and adding to queue.`, 20, { hlPhase: 'enqueueEdge', qState: cloneQ(), visState: cloneVis(), coinsCount, levelSize: size, curr, coin, next, isValid });
                    }
                }
            }
            if (!found) {
                coinsCount++;
                add("Increment Depth", `coinsCount++;\nFinished processing level. Depth (coins used) increments to ${coinsCount}.`, 25, { hlPhase: 'incDepth', qState: cloneQ(), visState: cloneVis(), coinsCount });
            }
        }

        if (!found) {
            add("Queue Empty", `return -1;\nQueue is empty and we never reached target ${amount}. Impossible to make change!`, 27, { hlPhase: 'success', isSuccess: true, finalAns: -1, qState: cloneQ(), visState: cloneVis() });
        }
    }

    return steps;
  }, [coinsArr, amount, selectedOpId]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Auto-scroll code view to active line
  useEffect(() => {
    const prefix = isFullscreen ? 'fs-' : 'main-';
    const container = isFullscreen ? codeContainerFullscreenRef.current : codeContainerMainRef.current;
    
    if (!container) return;
    
    const activeLineEl = document.getElementById(`${prefix}code-line-${curStepData.line}`);
    if (activeLineEl) {
        const offsetTop = activeLineEl.offsetTop;
        container.scrollTo({ top: offsetTop - 60, behavior: 'smooth' });
    }
  }, [currentStep, curStepData.line, isFullscreen]);

  // --- UI Handlers ---
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.scrollbar-thin')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => { 
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

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

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

  const renderActiveDashboard = () => {
      if ((selectedOpId === 'dpTabulation' && !st.dpState) || (selectedOpId === 'bfsGraph' && !st.qState)) return null;

      if (selectedOpId === 'dpTabulation') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'calcMin' || st.hlPhase === 'updateDp' ? 'border-emerald-400 ring-4 ring-emerald-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> DP Subproblem State</span>
                  
                  {st.hlPhase === 'init' || st.hlPhase === 'initData' || st.hlPhase === 'baseCase' ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex items-center gap-4 text-slate-600 font-mono font-black text-xl bg-slate-50 px-6 py-3 rounded-2xl border-2 border-slate-300 shadow-md">
                              <span>Pre-computation Phase</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">Array Init &amp; Base Case</span>
                          </div>
                      </div>
                  ) : st.isSuccess ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex items-center gap-4 text-emerald-600 font-mono font-black text-xl bg-emerald-50 px-6 py-3 rounded-2xl border-2 border-emerald-300 shadow-md">
                              <span>Tabulation Complete</span> <ArrowRight size={24} /> <span className="bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-200">Ans: {st.finalAns}</span>
                          </div>
                      </div>
                  ) : st.curI !== undefined && st.curCoin !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex flex-col items-center w-[110px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Target amt (i)</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl bg-slate-100 border-slate-400 text-slate-800 shadow-inner`}>
                                  {st.curI}
                              </div>
                          </div>
                          <div className="flex flex-col items-center justify-center text-slate-400 font-black text-xl">
                              <span>-</span>
                          </div>
                          <div className="flex flex-col items-center w-[110px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Coin Val</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl bg-amber-50 border-amber-400 text-amber-800`}>
                                  {st.curCoin}
                              </div>
                          </div>
                          <div className="flex flex-col items-center justify-center text-slate-400 font-black text-xl">
                              <span>=</span>
                          </div>
                          <div className="flex flex-col items-center w-[110px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-indigo-500`}>Prev amt</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl transition-colors duration-300 ${st.fits ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md' : 'bg-rose-50 border-rose-300 text-rose-500 opacity-60'}`}>
                                  {st.fits ? st.curI - st.curCoin : 'N/A'}
                              </div>
                          </div>
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          <div className="flex flex-col items-center min-w-[160px]">
                              <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Transition Evaluated</span>
                              {st.fits && (st.hlPhase === 'calcMin' || st.hlPhase === 'updateDp') ? (
                                  <div className={`flex flex-col items-center gap-1 w-full bg-emerald-50 p-2 rounded-xl border border-emerald-200 shadow-sm transition-all ${st.updated ? 'scale-110 ring-2 ring-emerald-400' : ''}`}>
                                      <span className="text-[10px] font-black uppercase text-emerald-700">dp[i] = min(dp[i], dp[prev] + 1)</span>
                                      <span className="text-sm font-mono font-bold text-emerald-900">{st.dpState[st.curI] === amount + 1 ? 'INF' : st.dpState[st.curI]} vs {st.potentialNewCoins === amount + 1 ? 'INF' : st.potentialNewCoins}</span>
                                  </div>
                              ) : st.fits === false ? (
                                  <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                      Coin &gt; Target
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-center h-full w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-400 font-bold text-xs uppercase tracking-widest">
                                      Validating...
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Tracing loops...</span>
                      </div>
                  )}
              </div>
          );
      } else if (selectedOpId === 'bfsGraph') {
          return (
              <div className={`bg-white p-6 rounded-[2rem] border-4 shadow-xl w-full max-w-4xl flex flex-col items-center transition-colors duration-300 ${st.hlPhase === 'validateEdge' || st.hlPhase === 'enqueueEdge' ? 'border-sky-400 ring-4 ring-sky-100 scale-105' : 'border-slate-200'}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-1"><Activity size={14}/> BFS Graph Exploration State</span>
                  
                  {st.isSuccess ? (
                      <div className="flex flex-wrap items-center justify-center gap-6 font-mono min-h-[80px] py-2 w-full">
                          <div className={`flex items-center gap-4 ${st.finalAns !== -1 ? 'text-sky-600 bg-sky-50 border-sky-300' : 'text-rose-600 bg-rose-50 border-rose-300'} font-mono font-black text-xl px-6 py-3 rounded-2xl border-2 shadow-md`}>
                              <span>Search Terminated</span> <ArrowRight size={24} /> <span className={`bg-white px-4 py-2 rounded-xl shadow-sm border ${st.finalAns !== -1 ? 'border-sky-200' : 'border-rose-200'}`}>Depth Found: {st.finalAns}</span>
                          </div>
                      </div>
                  ) : st.curr !== undefined ? (
                      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 font-mono min-h-[80px] py-2 w-full">
                          <div className="flex flex-col items-center w-[110px]">
                              <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-slate-500`}>Polled Amount</span>
                              <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl bg-slate-100 border-slate-400 text-slate-800 shadow-inner`}>
                                  {st.curr}
                              </div>
                          </div>
                          
                          {st.coin !== undefined && (
                              <>
                                  <div className="flex flex-col items-center justify-center text-slate-400 font-black text-xl">
                                      <span>+</span>
                                  </div>
                                  <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-amber-500`}>Try Coin</span>
                                      <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl bg-amber-50 border-amber-400 text-amber-800`}>
                                          {st.coin}
                                      </div>
                                  </div>
                                  <div className="flex flex-col items-center justify-center text-slate-400 font-black text-xl">
                                      <span>=</span>
                                  </div>
                                  <div className="flex flex-col items-center w-[110px] animate-in zoom-in">
                                      <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 text-indigo-500`}>Next Amt</span>
                                      <div className={`border-2 text-2xl font-black px-4 py-2 w-full text-center rounded-xl transition-colors duration-300 ${st.isValid ? 'bg-indigo-100 border-indigo-400 text-indigo-900 shadow-md' : 'bg-rose-50 border-rose-300 text-rose-500 opacity-60'}`}>
                                          {st.next}
                                      </div>
                                  </div>
                              </>
                          )}
                          
                          <div className="w-px h-12 bg-slate-200 hidden md:block mx-2"></div>
                          
                          <div className="flex flex-col items-center min-w-[120px]">
                              <span className={`text-[9px] font-bold uppercase text-slate-400 mb-1`}>Status</span>
                              {st.hlPhase === 'checkTarget' ? (
                                  <div className="flex items-center justify-center h-10 px-4 w-full bg-slate-100 rounded-xl border border-slate-200 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                      Checking Target
                                  </div>
                              ) : st.isValid === true ? (
                                  <div className="flex items-center justify-center h-10 px-4 w-full bg-sky-100 rounded-xl border border-sky-300 text-sky-800 font-bold text-xs uppercase tracking-widest shadow-sm">
                                      ENQUEUE
                                  </div>
                              ) : st.isValid === false ? (
                                  <div className="flex items-center justify-center h-10 px-4 w-full bg-rose-50 rounded-xl border border-rose-200 text-rose-500 font-bold text-[10px] uppercase tracking-widest opacity-80">
                                      OOB / VISITED
                                  </div>
                              ) : (
                                  <div className="flex items-center justify-center h-10 px-4 w-full bg-slate-50 rounded-xl border border-slate-200 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                      Waiting
                                  </div>
                              )}
                          </div>
                      </div>
                  ) : (
                      <div className="flex items-center justify-center w-full min-h-[80px]">
                          <span className="text-slate-400 italic text-sm font-mono">Evaluating Queue Logic...</span>
                      </div>
                  )}
              </div>
          );
      }
      return null;
  };

  const renderVisuals = () => {
      if ((selectedOpId === 'dpTabulation' && !st.dpState) || (selectedOpId === 'bfsGraph' && !st.qState)) return <span className="text-slate-400 italic mt-10">Initializing State...</span>;

      const nodeWidth = 50;
      const nodeGap = 16;
      const totalColWidth = nodeWidth + nodeGap;
      const containerWidth = (amount + 1) * totalColWidth;
      const startX = -(containerWidth / 2) + (totalColWidth / 2);

      return (
          <div className="flex flex-col items-center w-full gap-8 pointer-events-none relative pt-4 px-4 pb-12">
              
              {/* Dynamic State Dashboard */}
              <div className="flex flex-col items-center w-full pointer-events-auto z-40">
                  {renderActiveDashboard()}
              </div>

              {/* Free-floating Interactive Arrays / Graphs */}
              <div className="flex flex-col items-center justify-center relative w-full mt-4 max-w-6xl">
                  
                  <div className={`relative w-full transition-all duration-700 flex flex-col items-center justify-start mt-8 bg-slate-50 rounded-[3rem] border border-slate-200 shadow-inner`} style={{ minHeight: '300px', paddingBottom: '60px' }}>
                      
                      {selectedOpId === 'dpTabulation' && st.dpState && (
                          <div className="relative w-full h-full flex flex-col items-center justify-center mt-16 pb-12 overflow-x-auto scrollbar-thin px-8">
                              <span className="text-emerald-500 font-black font-mono tracking-widest uppercase text-sm mb-4">DP Array (1D Tabulation)</span>
                              
                              {/* The DP Array Container */}
                              <div className="flex relative">
                                  
                                  {/* Draw Arc (if calculating transition) */}
                                  {st.hlPhase === 'calcMin' || st.hlPhase === 'updateDp' ? (
                                      <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none">
                                          <defs>
                                              <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                  <path d="M 0 0 L 6 3 L 0 6 Z" fill="#10b981" />
                                              </marker>
                                          </defs>
                                          {st.fits && st.prevAmount >= 0 && (
                                              <path 
                                                  d={`M ${st.prevAmount * totalColWidth + nodeWidth/2} -10 Q ${((st.prevAmount + st.curI) / 2) * totalColWidth + nodeWidth/2} -60 ${st.curI * totalColWidth + nodeWidth/2} -15`}
                                                  fill="none" 
                                                  stroke="#10b981" 
                                                  strokeWidth="3" 
                                                  strokeDasharray="4 4"
                                                  markerEnd="url(#arrowhead)"
                                                  className="animate-pulse"
                                              />
                                          )}
                                      </svg>
                                  ) : null}

                                  {/* DP Nodes */}
                                  {st.dpState.map((val: any, idx: number) => {
                                      let isCurrent = st.curI === idx && !st.isSuccess;
                                      let isPrev = st.fits && st.prevAmount === idx && (st.hlPhase === 'calcMin' || st.hlPhase === 'updateDp') && !st.isSuccess;
                                      
                                      let boxClass = "bg-white border-slate-300 text-slate-600 shadow-sm";
                                      let textClass = "text-slate-600";
                                      let scaleClass = "scale-100";
                                      
                                      if (isCurrent) {
                                          boxClass = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 shadow-xl z-20";
                                          textClass = "text-emerald-900";
                                          scaleClass = "scale-110";
                                      } else if (isPrev) {
                                          boxClass = "bg-indigo-100 border-indigo-400 shadow-md z-10";
                                          textClass = "text-indigo-900";
                                          scaleClass = "scale-105";
                                      } else if (val !== amount + 1) {
                                          // Computed values
                                          boxClass = "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm opacity-80";
                                      } else {
                                          // Default INF values
                                          boxClass = "bg-slate-100 border-slate-200 text-slate-400 opacity-50";
                                      }

                                      if (st.isSuccess) {
                                          if (idx === amount) {
                                              boxClass = val > amount ? "bg-rose-500 border-rose-600 text-white shadow-xl scale-125 z-30" : "bg-emerald-500 border-emerald-600 text-white shadow-xl scale-125 z-30";
                                          } else {
                                              boxClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-40 scale-95";
                                          }
                                      }

                                      let displayVal = val === amount + 1 ? '∞' : val;

                                      return (
                                          <div key={`dp-${idx}`} className="flex flex-col items-center" style={{ width: `${totalColWidth}px` }}>
                                              {/* Index Label */}
                                              <span className={`text-[10px] font-black font-mono mb-2 ${isCurrent ? 'text-emerald-600' : (isPrev ? 'text-indigo-500' : 'text-slate-400')} transition-colors`}>{idx}</span>
                                              
                                              {/* Value Box */}
                                              <div className={`w-[${nodeWidth}px] h-[50px] flex items-center justify-center border-4 rounded-xl transition-all duration-300 ${boxClass} ${scaleClass}`}>
                                                  <span className={`font-mono font-black text-lg ${textClass}`}>{displayVal}</span>
                                              </div>

                                              {/* Role Badge */}
                                              {isCurrent && <span className="absolute -bottom-6 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-bounce">Target</span>}
                                              {isPrev && <span className="absolute -bottom-6 bg-indigo-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded animate-pulse">Lookup</span>}
                                              {st.isSuccess && idx === amount && <span className={`absolute -bottom-8 ${val > amount ? 'bg-rose-500' : 'bg-emerald-500'} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-lg`}>Final Ans</span>}
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}

                      {selectedOpId === 'bfsGraph' && st.visState && (
                          <div className="relative w-full h-full flex flex-col items-center justify-center mt-8 pb-12 overflow-x-auto scrollbar-thin px-8">
                              
                              <div className="flex w-full items-center justify-between px-10 mb-4 pointer-events-auto">
                                  <span className="text-sky-500 font-black font-mono tracking-widest uppercase text-sm">Number Line Graph (0 to Amount)</span>
                                  
                                  {/* Live Queue Visualizer */}
                                  <div className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                      <span className="text-[10px] font-black uppercase text-slate-400 mr-2"><LayersIcon size={12} className="inline mr-1 mb-0.5"/> Queue</span>
                                      <div className="flex gap-1 overflow-x-auto max-w-[200px] scrollbar-none">
                                          {st.qState && st.qState.length > 0 ? st.qState.map((val: any, idx: number) => (
                                              <div key={`q-${idx}`} className={`shrink-0 w-8 h-8 flex items-center justify-center rounded border-2 font-mono font-bold text-xs ${idx === 0 && st.hlPhase === 'poll' ? 'bg-amber-400 border-amber-500 text-amber-900 scale-110 shadow-md' : 'bg-sky-50 border-sky-300 text-sky-800'}`}>
                                                  {val}
                                              </div>
                                          )) : <span className="text-xs text-slate-400 italic my-auto">Empty</span>}
                                      </div>
                                  </div>
                              </div>

                              {/* Number Line Graph Container */}
                              <div className="flex relative mt-6 border-b-[4px] border-slate-200 w-fit pt-10 pb-8 px-4 mx-auto rounded-3xl bg-white shadow-inner">
                                  
                                  {/* BFS Jump Arc */}
                                  {(st.hlPhase === 'tryEdge' || st.hlPhase === 'validateEdge' || st.hlPhase === 'enqueueEdge') && st.curr !== undefined && st.next !== undefined && st.next <= amount ? (
                                      <svg className="absolute top-0 left-0 w-full h-full overflow-visible z-10 pointer-events-none">
                                          <defs>
                                              <marker id="arrowheadBfs" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                                                  <path d="M 0 0 L 6 3 L 0 6 Z" fill={st.isValid ? '#0ea5e9' : '#f43f5e'} />
                                              </marker>
                                          </defs>
                                          <path 
                                              d={`M ${st.curr * totalColWidth + nodeWidth/2 + 16} 30 Q ${((st.curr + st.next) / 2) * totalColWidth + nodeWidth/2 + 16} -30 ${st.next * totalColWidth + nodeWidth/2 + 16} 20`}
                                              fill="none" 
                                              stroke={st.isValid ? '#0ea5e9' : '#f43f5e'} 
                                              strokeWidth="3" 
                                              strokeDasharray="4 4"
                                              markerEnd="url(#arrowheadBfs)"
                                              className={st.isValid ? "animate-pulse" : "opacity-50"}
                                          />
                                          {/* Edge Label (Coin value) */}
                                          <rect x={((st.curr + st.next) / 2) * totalColWidth + nodeWidth/2 + 16 - 15} y={-10} width="30" height="16" rx="4" fill={st.isValid ? '#e0f2fe' : '#ffe4e6'} stroke={st.isValid ? '#0ea5e9' : '#f43f5e'} strokeWidth="1"/>
                                          <text x={((st.curr + st.next) / 2) * totalColWidth + nodeWidth/2 + 16} y={2} fontSize="10" fontWeight="bold" textAnchor="middle" fill={st.isValid ? '#0284c7' : '#e11d48'}>+{st.coin}</text>
                                      </svg>
                                  ) : null}

                                  {/* Nodes (Amounts) */}
                                  {Array.from({length: amount + 1}).map((_, idx) => {
                                      let isVisited = st.visState[idx];
                                      let isCurrent = st.curr === idx && !st.isSuccess;
                                      let isNextValid = st.next === idx && st.isValid && !st.isSuccess;
                                      let isNextInvalid = st.next === idx && !st.isValid && !st.isSuccess;

                                      let boxClass = "bg-white border-slate-300 text-slate-400 opacity-60";
                                      let textClass = "text-slate-400";
                                      let scaleClass = "scale-100";

                                      if (isCurrent) {
                                          boxClass = "bg-amber-100 border-amber-500 ring-4 ring-amber-200 shadow-xl z-20";
                                          textClass = "text-amber-900";
                                          scaleClass = "scale-110";
                                      } else if (isNextValid) {
                                          boxClass = "bg-sky-100 border-sky-400 shadow-lg z-10 ring-4 ring-sky-100";
                                          textClass = "text-sky-900";
                                          scaleClass = "scale-110";
                                      } else if (isNextInvalid) {
                                          boxClass = "bg-rose-50 border-rose-300 shadow-inner z-10 border-dashed";
                                          textClass = "text-rose-500";
                                      } else if (isVisited) {
                                          boxClass = "bg-sky-500 border-sky-600 text-white shadow-md opacity-90";
                                          textClass = "text-white";
                                      }

                                      if (st.isSuccess) {
                                          if (idx === amount && st.finalAns !== -1) {
                                              boxClass = "bg-emerald-500 border-emerald-600 text-white shadow-2xl scale-125 z-30 ring-4 ring-emerald-200";
                                              textClass = "text-white";
                                          } else if (isVisited) {
                                              boxClass = "bg-sky-100 border-sky-300 text-sky-700 opacity-50 scale-95";
                                              textClass = "text-sky-700";
                                          } else {
                                              boxClass = "bg-slate-50 border-slate-200 text-slate-300 opacity-30 scale-90";
                                          }
                                      }

                                      return (
                                          <div key={`bfs-${idx}`} className="flex flex-col items-center justify-end relative" style={{ width: `${totalColWidth}px`, height: '60px' }}>
                                              
                                              {isCurrent && <span className="absolute -top-6 bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Curr</span>}
                                              {isNextValid && <span className="absolute -top-6 bg-sky-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm animate-pulse">Enqueue</span>}
                                              {isNextInvalid && <span className="absolute -top-6 bg-rose-400 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm opacity-80">Skip</span>}
                                              
                                              {/* Value Box */}
                                              <div className={`w-[40px] h-[40px] flex items-center justify-center border-[3px] rounded-full transition-all duration-300 ${boxClass} ${scaleClass}`}>
                                                  <span className={`font-mono font-black text-sm ${textClass}`}>{idx}</span>
                                              </div>
                                              
                                              {idx === amount && <span className="absolute -bottom-8 text-emerald-600 font-black uppercase text-[9px] tracking-widest bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded">Target</span>}
                                              {idx === 0 && <span className="absolute -bottom-8 text-sky-600 font-black uppercase text-[9px] tracking-widest bg-sky-50 px-2 py-0.5 border border-sky-200 rounded">Start</span>}
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}
                  </div>

              </div>

          </div>
      );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-600`}>
                <Coins className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Coin Change</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Dynamic Programming
                  </span>
                  <span>•</span>
                  <span>LeetCode 322</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none w-full xl:w-auto">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<BookOpen size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-6">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><FileText size={28}/> Problem Statement</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>You are given an integer array <code>coins</code> representing coins of different denominations and an integer <code>amount</code> representing a total amount of money.</p>
                        <p>Return the <strong>fewest number of coins</strong> that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return <code>-1</code>.</p>
                        <p>You may assume that you have an infinite number of each kind of coin.</p>
                    </div>
                    
                    {/* Example 1 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 1: The Standard Case</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> coins = [1,2,5], amount = 11</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">3</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                11 = 5 + 5 + 1. We used 3 coins to reach the target amount.
                            </span>
                        </div>
                    </div>

                    {/* Example 2 */}
                    <div className={`bg-slate-900 border-l-4 border-${themeColor}-500 p-6 rounded-r-2xl font-mono text-sm shadow-xl text-white flex flex-col md:flex-row gap-6 items-center`}>
                        <div className="flex-1 w-full">
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest`}>Example 2: Impossible Case</span>
                            <span className="text-slate-300 block mb-2 break-all"><strong>Input:</strong> coins = [2], amount = 3</span>
                            <span className="text-rose-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Output:</span>
                            <span className="text-slate-300 block mb-4">-1</span>
                            <span className="text-sky-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest">Explanation:</span>
                            <span className="text-slate-400 text-xs">
                                We only have coins of value 2. It is mathematically impossible to sum to exactly 3. Return -1.
                            </span>
                        </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl mt-4 max-w-2xl">
                        <span className="text-rose-700 font-bold text-xs uppercase tracking-widest mb-2 block">Constraints:</span>
                        <ul className="list-disc pl-6 text-sm text-rose-600 space-y-1 font-mono">
                            <li><code>1 &le; coins.length &le; 12</code></li>
                            <li><code>1 &le; coins[i] &le; 2^31 - 1</code></li>
                            <li><code>0 &le; amount &le; 10^4</code></li>
                        </ul>
                    </div>
                </section>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><Goal size={16} className="text-emerald-500"/> DP Tabulation Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">The core idea is to solve every smaller amount from 1 up to `amount`. For any amount `i`, if we use a coin `c`, the remaining amount we need to make is `i - c`. Because we solve bottom-up, we already know the minimum coins needed for `i - c`! So, `dp[i] = min(dp[i], dp[i - c] + 1)`.</p>
                    </div>
                    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-inner">
                        <h5 className="font-bold flex items-center gap-2 mb-3 text-slate-800"><GitBranch size={16} className={`text-sky-500`}/> Graph Traversal Concept</h5>
                        <p className="text-sm leading-relaxed text-slate-600">Alternatively, view this as finding the shortest path in an unweighted graph. Start at node `0`. Each coin represents a directed edge pointing to `curr + coin`. The first time we reach the node `amount`, the depth of our BFS search is mathematically guaranteed to be the minimum number of coins used!</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-3">
                    {Object.values(OPERATIONS).map((op) => (
                        <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-3 rounded-2xl border text-left flex flex-col gap-1 transition-all shadow-sm ${selectedOpId === op.id ? `bg-${op.theme}-600 text-white border-${op.theme}-600 scale-[1.02]` : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                            <div className="flex items-center gap-2">{op.icon}<span className="text-[10px] font-black uppercase tracking-tight truncate">{op.title}</span></div>
                            <div className={`text-[9px] font-mono ${selectedOpId === op.id ? `text-${op.theme}-100` : 'text-slate-400'}`}>{op.complexity}</div>
                        </button>
                    ))}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[480px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                  </div>
                  <div ref={codeContainerMainRef} className="p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-700 pb-10 flex-1 scroll-smooth">
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="main-"/>
                    ))}
                  </div>
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4 relative">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-end">
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1`}>Coins Array</label>
                            <input type="text" value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} className={`w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold text-emerald-900`} placeholder="1, 2, 5" />
                        </div>
                        <div className="flex-[1] w-full space-y-1.5">
                            <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-rose-500 pl-1`}>Target Amount</label>
                            <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className={`w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-rose-500 outline-none transition-all shadow-inner font-bold text-rose-900`} placeholder="11" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-8 py-3 bg-${themeColor}-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-700 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-slate-900 border-slate-800'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Activity size={100} className="text-white"/></div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Execution Trace</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isSuccess ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className="text-2xl font-black tracking-tight uppercase font-mono text-emerald-400 flex items-center gap-3"><PartyPopper size={24}/> COMPUTATION COMPLETE</div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">Minimum coins calculated successfully.</p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'updateDp' || st.hlPhase === 'enqueueEdge' ? 'text-emerald-400' : (st.hlPhase === 'calcMin' || st.hlPhase === 'tryEdge' || st.hlPhase === 'validateEdge' ? 'text-amber-400' : (st.hlPhase === 'outerLoop' || st.hlPhase === 'poll' ? `text-sky-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                            <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-100 rounded-[2.5rem] border border-slate-300 p-2 h-[450px] relative flex flex-col shadow-inner overflow-hidden">
                   
                   <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur gap-2">
                            <button onClick={zoomIn} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                            <button onClick={zoomOut} className={`p-2 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                        </div>
                   </div>

                   <div ref={!isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10 bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                       <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-300 flex flex-col justify-start items-center pt-8" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                   </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className={`inline-flex items-center justify-center p-4 bg-${themeColor}-100 text-${themeColor}-600 rounded-2xl mb-2`}>
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory & Complexity Analysis</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding 1D Dynamic Programming Tabulation.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    {/* Section 1 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Grid size={24} className={`text-emerald-500`}/> 1. Overlapping Subproblems</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">To make change for an amount like <code>11</code> with coins <code>[1, 2, 5]</code>, we might choose the coin <code>5</code>. This leaves us with an amount of <code>6</code>. The subproblem "minimum coins to make 6" is identical no matter how we reached 6.</p>
                        <p className="text-slate-600 leading-relaxed">Instead of computing "how to make 6" repeatedly, we build up answers from the bottom. We compute how to make 1, then 2, then 3... storing the optimal answer in a 1D array <code>dp</code>. When calculating for 11, the answer for 6 is already sitting instantly available at <code>dp[6]</code>!</p>
                    </div>

                    {/* Section 2 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Code2 size={24} className="text-emerald-500"/> 2. The State Transition Equation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">For any given amount <code>i</code>, we check every available coin. If the coin fits (<code>coin &le; i</code>), we look back at the array: <code>dp[i - coin]</code>.</p>
                        <div className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-sm shadow-inner mb-4">
                            dp[i] = Math.min(dp[i], dp[i - coin] + 1)
                        </div>
                        <p className="text-slate-600 leading-relaxed">The <code>+ 1</code> represents the single coin we just selected. We take the minimum across all coin choices to guarantee the optimal sub-solution is stored at <code>dp[i]</code>.</p>
                    </div>

                    {/* Section 3 */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-sky-500"/> 3. Time & Space Complexity</h4>
                        <ul className="list-disc pl-6 space-y-3 text-slate-600">
                            <li><strong>Time Complexity: O(S * n).</strong> Let $S$ be the total target <code>amount</code> and $n$ be the number of coins. The outer loop runs $S$ times. The inner loop runs $n$ times. Inside the loops, array lookup and <code>Math.min</code> take constant $O(1)$ time. Thus, the total time is strictly $O(S \times n)$.</li>
                            <li><strong>Space Complexity: O(S).</strong> The auxiliary space used is the 1-dimensional <code>dp</code> integer array, which is exactly of size $S + 1$. In the BFS approach, the visited array also takes $O(S)$ space, and the queue takes at most $O(S)$ space. Both are inherently $O(S)$ in space complexity.</li>
                        </ul>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className={`text-${themeColor}-400`}/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"Coin Change is perhaps the most heavily tested Dynamic Programming problem in FAANG interviews. Interviewers use it specifically to see if you fall for the 'Greedy' trap."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    {/* Q1 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-rose-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-rose-500 mt-0.5"><AlertTriangle size={24}/></span>
                            <span>Q1: "Why can't we just sort the coins and use a Greedy Algorithm (taking the largest coin possible first)?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because the coin denominations are arbitrary, Greedy is not mathematically guaranteed to find the minimum."</p>
                            <p>Consider the coins <code>[1, 3, 4]</code> and target amount <code>6</code>. A greedy algorithm sorts descending and takes the <code>4</code>. It has <code>2</code> remaining, so it takes <code>1</code> and <code>1</code>. Total: 3 coins. However, the optimal answer is <code>3 + 3</code>, which uses only 2 coins! Greedy only works for specific coin systems (like US currency denominations) where each coin is at least twice the value of the previous, preventing overlap inefficiencies.</p>
                        </div>
                    </div>

                    {/* Q2 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Code2 size={24}/></span>
                            <span>Q2: "In the DP setup, why do we initialize the array with `amount + 1` instead of `Integer.MAX_VALUE`?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "To prevent integer overflow during the transition."</p>
                            <p>When evaluating the transition equation <code>dp[i - coin] + 1</code>, if the previous state was unreachable, it would be set to our 'Infinity' value. If we used <code>Integer.MAX_VALUE</code>, adding 1 to it would cause a signed integer overflow, resulting in <code>Integer.MIN_VALUE</code>! Since the absolute maximum number of coins we could ever use is <code>amount</code> (all 1s), using <code>amount + 1</code> acts as a perfectly safe, overflow-proof Infinity.</p>
                        </div>
                    </div>

                    {/* Q3 */}
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Network size={24}/></span>
                            <span>Q3: "Between DP Tabulation and the BFS Graph approach, which is better?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "DP is generally standard, but BFS can be faster in specific edge cases."</p>
                            <p>The time complexity $O(S \times n)$ is identical asymptotically. DP will blindly calculate the optimal answer for EVERY amount up to the target. BFS stops immediately as soon as it hits the target node. If a large target can be hit very quickly with massive coins, BFS will terminate early, skipping the calculation of thousands of smaller, irrelevant sub-amounts.</p>
                        </div>
                    </div>

                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  <div ref={codeContainerFullscreenRef} className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 pb-10 relative scroll-smooth">
                    
                    <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 mb-4 ${st.isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'}`}>
                        <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                            <div className="flex gap-2 items-center">
                                <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                            </div>
                        </div>
                        <div className={`text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${st.hlPhase === 'calcMin' || st.hlPhase === 'updateDp' || st.hlPhase === 'enqueueEdge' ? 'text-emerald-400' : (st.hlPhase === 'checkFit' || st.hlPhase === 'tryEdge' || st.hlPhase === 'validateEdge' ? 'text-amber-400' : (st.hlPhase === 'outerLoop' || st.hlPhase === 'poll' ? `text-sky-400` : 'text-white'))}`}>{String(curStepData.phase || "")}</div>
                        <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-700/50 pt-3 italic font-mono relative z-10 whitespace-pre-line">{String(curStepData.description || "")}</p>
                    </div>

                    <div className="bg-black/20 rounded-2xl border border-white/5 p-4">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor} idPrefix="fs-"/>
                        ))}
                    </div>

                  </div>
              </div>
              <div className="flex-1 relative bg-slate-100 overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
                  
                  <div className="absolute top-8 left-8 z-50 flex flex-col xl:flex-row gap-4 pointer-events-auto">
                      <div className="flex bg-white/90 p-1.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          {Object.values(OPERATIONS).map((op) => (
                              <button key={op.id} onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }} className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider transition-all ${selectedOpId === op.id ? `bg-${themeColor}-600 text-white shadow-md` : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>
                                  {op.icon} <span>{op.title.split('.')[1].trim()}</span>
                              </button>
                          ))}
                      </div>

                      <div className="flex gap-4 items-end bg-white/90 p-2.5 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md">
                          <div className="flex w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-emerald-600 block`}>Coins Array</label>
                              <input type="text" value={coinsInput} onChange={(e) => setCoinsInput(e.target.value)} className={`w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500 font-bold text-emerald-900`} placeholder="1, 2, 5" />
                          </div>
                          <div className="flex w-full space-y-1">
                              <label className={`text-[9px] font-black uppercase tracking-widest font-mono pl-1 text-rose-600 block`}>Target Amount</label>
                              <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className={`w-32 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-rose-500 font-bold text-rose-900`} placeholder="11" />
                          </div>
                      </div>
                  </div>

                  <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
                        <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={24}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={24}/></button>
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={24}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-rose-600 rounded-lg transition-colors`}><Minimize size={24}/></button>
                        </div>
                  </div>
                  
                  {/* Live Scoreboard */}
                  {!st.isSuccess && (
                      <div className="absolute top-8 right-24 z-30 pointer-events-auto">
                          <div className="flex flex-col bg-white/90 p-4 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur gap-1 animate-in zoom-in items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Min Coins</span>
                              <span className={`text-4xl font-mono font-black text-${themeColor}-600`}>
                                  {st.finalAns !== undefined ? st.finalAns : (selectedOpId === 'bfsGraph' ? (st.coinsCount || 0) : "?")}
                              </span>
                          </div>
                      </div>
                  )}

                  {!st.isSuccess && (
                      <div className="absolute bottom-10 right-10 z-50 flex flex-col items-end gap-3 animate-in slide-in-from-bottom-10">
                          <div className="flex items-center gap-2 text-slate-400 bg-slate-900/60 px-4 py-2 rounded-full backdrop-blur-md border border-slate-700/50 shadow-lg mr-2">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Shortcuts: &larr; Prev | &rarr; Next | ESC Close</span>
                          </div>
                          <div className="flex gap-6">
                              <button onClick={handlePrev} disabled={currentStep === 0} className="px-10 py-6 bg-slate-800 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-slate-700 disabled:opacity-30 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-700"><ChevronLeft size={32}/> PREV</button>
                              <button onClick={handleNext} disabled={isLastStep || st.isSuccess} className={`px-12 py-6 bg-${themeColor}-600 text-white rounded-[2rem] hover:bg-${themeColor}-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-${themeColor}-500 shadow-xl`}>NEXT <ChevronRight size={32}/></button>
                          </div>
                      </div>
                  )}

                  <div ref={isFullscreen ? canvasContainerRef : null} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} tabIndex={0}>
                      <div className="absolute top-0 left-1/2 w-full h-full transition-transform duration-500 flex flex-col justify-start items-center pt-24" style={{ transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`, transformOrigin: 'top center' }}>
                           {renderVisuals()}
                       </div>
                  </div>
                  {st.isSuccess && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                            <div className={`bg-[#0f172a] border-4 rounded-[4rem] p-16 animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden border-emerald-500 shadow-[0_0_150px_rgba(16,185,129,0.3)]`}>
                                <div className={`absolute top-0 left-0 w-full h-2 bg-emerald-500`}></div>
                                
                                <div className={`w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10`}><PartyPopper size={48}/></div>
                                <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4 tracking-widest leading-tight text-center">COMPUTATION COMPLETE</h2>
                                <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">Execution complete</p>
                                
                                <div className="bg-slate-800/80 rounded-[2rem] p-6 border border-slate-700 shadow-2xl mb-10 flex flex-col items-center justify-center">
                                    <div className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-2">Minimum Coins Needed</div>
                                    <div className="font-mono text-white text-5xl font-black leading-relaxed flex items-center gap-2">{st.finalAns}</div>
                                </div>

                                <div className="flex gap-4">
                                    <button onClick={handleReset} className={`flex-1 py-6 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg bg-${themeColor}-600 hover:bg-${themeColor}-700 shadow-${themeColor}-900/20`}>
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