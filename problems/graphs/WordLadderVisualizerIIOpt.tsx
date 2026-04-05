import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  ArrowDownToLine, Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Network, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map, Combine, Hash, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  wordLadderIIOptimized: {
    id: 'wordLadderIIOptimized',
    title: 'Word Ladder II (Optimized BFS+DFS)',
    icon: <Combine size={16} />,
    complexity: 'Time: O(N*L*26 + Paths) | Space: O(N)',
    theme: 'rose',
    code: `class Solution {
    String b;
    HashMap<String, Integer> mpp;
    List<List<String>> ans;
    
    private void dfs(String word, List<String> seq) {
        if(word.equals(b)) {
            // Since java works with reference, create
            // a duplicate and store the reverse of it
            List<String> dup = new ArrayList<>(seq);
            Collections.reverse(dup);
            ans.add(dup);
            return;
        }
        int steps = mpp.get(word);
        int sz = word.length();
        for(int i = 0; i < sz; i++) {
            for(char ch = 'a'; ch <= 'z'; ch++) {
                char replacedCharArray[] = word.toCharArray();
                replacedCharArray[i] = ch;
                String replacedWord = new String(replacedCharArray);
                if(mpp.containsKey(replacedWord) && mpp.get(replacedWord) + 1 == steps) {
                    seq.add(replacedWord);
                    dfs(replacedWord, seq);
                    seq.remove(seq.size() - 1);
                }
            }
        }
    }

    public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {
        Set<String> st = new HashSet<String>();
        int len = wordList.size();
        for(int i = 0; i < len; i++) {
            st.add(wordList.get(i));
        }
        Queue<String> q = new LinkedList<>();
        b = beginWord;
        q.add(beginWord);
        mpp = new HashMap<>();
        mpp.put(beginWord, 1);
        int sizee = beginWord.length();
        st.remove(beginWord);
        
        while(!q.isEmpty()) {
            String word = q.peek();
            int steps = mpp.get(word);
            q.remove();
            if(word.equals(endWord)) break;
            
            for(int i = 0; i < sizee; i++) {
                for(char ch = 'a'; ch <= 'z'; ch++) {
                    char replacedCharArray[] = word.toCharArray();
                    replacedCharArray[i] = ch;
                    String replacedWord = new String(replacedCharArray);
                    if(st.contains(replacedWord) == true) {
                        q.add(replacedWord);
                        st.remove(replacedWord);
                        mpp.put(replacedWord, steps + 1);
                    }
                }
            }
        }
        
        ans = new ArrayList<>();
        if(mpp.containsKey(endWord) == true) {
            List<String> seq = new ArrayList<>();
            seq.add(endWord);
            dfs(endWord, seq);
        }
        return ans;
    }
}`,
    desc: "Storing entire ArrayList paths inside a BFS Queue causes massive Memory Limit Exceeded (MLE) failures on LeetCode. This optimized approach solves Word Ladder II in two distinct phases! Phase 1 uses standard BFS purely to generate a HashMap (`mpp`) that records the exact shortest distance to every valid word. Phase 2 uses DFS Backtracking starting from the target word, recursively stepping backward exactly 1 step at a time (`mpp[replaced] + 1 == mpp[word]`) until it safely reconstructs the optimal paths to the source."
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
}

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme }) => {
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|findLadders|dfs|beginWord|endWord|wordList|word|steps|len|sizee|sz|replacedCharArray|replacedWord|ch|contains|equals|containsKey|put|remove|add|isEmpty|peek|toCharArray|length|HashSet|Set|LinkedList|Queue|ArrayList|List|Integer|String|HashMap|Collections|reverse|ans|seq|dup|mpp|b|it)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
  const activeStyles = { bg: `bg-${theme}-500/20`, border: `border-${theme}-500`, text: `text-${theme}-400` };
  
  const leadingSpaces = code.match(/^\s*/)?.[0]?.length || 0;

  return (
    <div id={`code-line-${num}`} className={`flex relative z-10 min-h-[22px] transition-colors duration-200 ${active ? `active-code-line ${activeStyles.bg}` : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-10 select-none text-right pr-2 border-r border-slate-700/50 mr-4 shrink-0 font-mono text-[10px] pt-[3px] flex items-center justify-between ${active ? `${activeStyles.text} font-black` : 'text-slate-600'}`}>
        <span className="w-3 flex justify-center">{active ? <ArrowRight size={10} className="animate-pulse" /> : ''}</span>
        {num}
      </span>
      <pre 
        className={`font-mono text-slate-300 transition-opacity duration-300 flex-1 pt-[2px] whitespace-pre-wrap break-words ${active ? 'opacity-100' : 'opacity-60'}`}
        style={{ paddingLeft: `${leadingSpaces}ch`, textIndent: `-${leadingSpaces}ch` }}
      >
        {parts.map((part, idx) => {
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'LinkedList', 'Queue', 'ArrayList', 'List', 'HashSet', 'Set', 'HashMap', 'Collections'].includes(part);
            const isPointer = ['beginWord', 'endWord', 'wordList', 'st', 'q', 'word', 'steps', 'replacedCharArray', 'replacedWord', 'ch', 'len', 'i', 'ans', 'seq', 'mpp', 'b', 'dup', 'sz', 'sizee'].includes(part);
            const isMapCall = ['findLadders', 'dfs', 'add', 'remove', 'isEmpty', 'peek', 'get', 'size', 'length', 'equals', 'toCharArray', 'contains', 'containsKey', 'put', 'reverse'].includes(part);
            const isOperator = ['+', '-', '*', '/', '%', '=', '<', '>', '!', '|', '&', '[', ']', '^'].includes(part.trim());
            const isCharLiteral = part.startsWith("'") || part.startsWith('"');
            
            return (
              <span 
                key={idx} 
                className={
                  part.startsWith('//') ? 'text-slate-500 italic' : 
                  isKeyword ? 'text-pink-400 font-bold' : 
                  isObject ? 'text-emerald-400 font-bold' : 
                  isMapCall ? 'text-sky-300' :
                  isOperator ? 'text-slate-400 font-bold' :
                  isPointer ? `text-${theme}-300` : 
                  isCharLiteral ? 'text-amber-300' :
                  isNaN(parseInt(part)) ? '' : 'text-emerald-400'
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

export default function WordLadderIIOptimizedVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId] = useState('wordLadderIIOptimized');
  
  const [startWordInput, setStartWordInput] = useState('der');
  const [targetWordInput, setTargetWordInput] = useState('dfs');
  const [dictInput, setDictInput] = useState('des, der, dfr, dgt, dfs');

  const [baseStart, setBaseStart] = useState('der');
  const [baseTarget, setBaseTarget] = useState('dfs');
  const [baseDict, setBaseDict] = useState<string[]>(['des', 'der', 'dfr', 'dgt', 'dfs']);

  const [currentStep, setCurrentStep] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const selectedOp = OPERATIONS[selectedOpId as keyof typeof OPERATIONS];
  const themeColor = selectedOp.theme;

  // --- Quick Test Case Loaders ---
  const loadTestCase1 = () => {
      setStartWordInput('der');
      setTargetWordInput('dfs');
      setDictInput('des, der, dfr, dgt, dfs');
  };

  const loadTestCase2 = () => {
      setStartWordInput('hit');
      setTargetWordInput('cog');
      setDictInput('hot, dot, dog, lot, log, cog');
  };

  // --- Effects for Data Processing ---
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let start = startWordInput.trim().toLowerCase();
        let target = targetWordInput.trim().toLowerCase();
        let words = dictInput.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
        
        if (start.length === 0) start = 'der';
        if (target.length === 0) target = 'dfs';
        if (words.length === 0) words = ['des', 'der', 'dfr', 'dgt', 'dfs'];

        setBaseStart(start);
        setBaseTarget(target);
        setBaseDict(words);
        setCurrentStep(0);
        setPan({ x: 0, y: 0 });
        setZoom(0.85);
      } catch (e) {
         // Fallback
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [startWordInput, targetWordInput, dictInput]);

  // Auto-scroll effect specifically targeting exact active line
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeLineElements = document.querySelectorAll('.active-code-line');
      activeLineElements.forEach(el => {
         if ((el as HTMLElement).offsetParent !== null) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
         }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [currentStep, isFullscreen, activeTab]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.graph-canvas-area')) return;
        e.preventDefault();
        setZoom(prev => Math.min(Math.max(prev - e.deltaY * 0.005, 0.3), 3));
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const clone1D = (arr: any[]) => [...arr];

  // Generate trace strictly aligned with Java code
  const trace = useMemo(() => {
    const steps: any[] = [];
    const beginWord = baseStart;
    const endWord = baseTarget;
    const wordList = baseDict;
    
    if (beginWord.length !== endWord.length) return steps;

    // Simulation local state
    let stSet = new Set<string>();
    let q: string[] = [];
    let mpp: {[key: string]: number} = {};
    let ans: string[][] = [];
    let seq: string[] = [];
    
    // For rendering the tree
    let treeEdges: {u: string, v: string, phase: string}[] = []; // phase: 'bfs' or 'dfs'
    
    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { 
            beginWord, endWord, wordList, 
            q: [...q], 
            stArray: Array.from(stSet),
            mpp: {...mpp},
            ans: ans.map(arr => [...arr]),
            seq: [...seq],
            treeEdges: [...treeEdges],
            ...stateObj 
        } 
    });

    add("Function Call", `public List<List<String>> findLadders(String beginWord="${beginWord}", ...)\nInitiating Phase 1: BFS Distance Mapping.`, 31, { phase: 'init' });
    
    add("Init Set", `Set<String> st = new HashSet<String>();\nAllocating HashSet.`, 32, { phase: 'init_set' });
    for(let i=0; i<wordList.length; i++) stSet.add(wordList[i]);
    add("Dictionary Loop", `for(int i = 0; i < len; i++) { st.add(wordList.get(i)); }\nLoaded all words into HashSet.`, 34, { phase: 'populate_set' });

    add("Init Path Queue", `Queue<String> q = new LinkedList<>();\nb = beginWord;\nq.add(beginWord);`, 37, { phase: 'init_queue' });
    q.push(beginWord);

    add("Init Distance Map", `mpp = new HashMap<>();\nmpp.put(beginWord, 1);\nCreated Map. Set distance of starting word to 1.`, 40, { phase: 'init_mpp' });
    mpp[beginWord] = 1;

    stSet.delete(beginWord);
    add("Remove Start Word", `st.remove(beginWord);\nRemoved from set to prevent backtracking to start.`, 43, { phase: 'remove_start' });

    // --- BFS PHASE ---
    let bfsTargetFound = false;

    while(q.length > 0) {
        add("While Queue Loop", `while(!q.isEmpty())\nQueue has elements. Expanding BFS layer.`, 45, { phase: 'while_q' });
        
        let word = q[0];
        let stepsCount = mpp[word];
        
        add("Peek Queue", `String word = q.peek();\nint steps = mpp.get(word);\nProcessing '${word}' at mapped distance ${stepsCount}.`, 46, { phase: 'q_peek', activeWord: word });
        
        q.shift();
        add("Dequeue Word", `q.remove();`, 48, { phase: 'q_remove', activeWord: word });

        add("Check End Word", `if(word.equals(endWord)) break;\nDid we successfully hit the target word '${endWord}'?`, 49, { phase: 'check_target', activeWord: word });
        if (word === endWord) {
            bfsTargetFound = true;
            add("Target Found", `break;\nYES! Phase 1 complete. The shortest distance to the target is mapped. Breaking BFS loop.`, 49, { phase: 'bfs_break', activeWord: word });
            break;
        }
        
        add("Character Loop Start", `for(int i = 0; i < sizee; i++)\nPreparing to test 26 possible character mutations.`, 51, { phase: 'for_i', activeWord: word });

        for (let i = 0; i < word.length; i++) {
            let matchFoundForI = false;

            // Fast-forward mutations
            for (let c = 97; c <= 122; c++) {
                let ch = String.fromCharCode(c);
                if (ch === word[i]) continue;

                let replacedWord = word.substring(0, i) + ch + word.substring(i+1);

                if (stSet.has(replacedWord)) {
                    matchFoundForI = true;
                    add("Evaluate Mutation (Match!)", `if(st.contains(replacedWord) == true)\nTested mutation '${replacedWord}'. IT EXISTS IN THE SET!`, 56, { phase: 'eval_mutation_hit', activeWord: word, activeI: i, testCh: ch, replacedWord });
                    
                    q.push(replacedWord);
                    add("Enqueue Word", `q.add(replacedWord);\nEnqueuing '${replacedWord}' for future expansion.`, 57, { phase: 'q_add', activeWord: word, replacedWord });

                    stSet.delete(replacedWord);
                    add("Remove From Set", `st.remove(replacedWord);\nDeleted from Set so we don't process it in later (sub-optimal) paths.`, 58, { phase: 'st_remove', activeWord: word, replacedWord });

                    mpp[replacedWord] = stepsCount + 1;
                    add("Put in Map", `mpp.put(replacedWord, steps + 1);\nRecorded optimal distance for '${replacedWord}': ${stepsCount + 1}.`, 59, { phase: 'mpp_put', activeWord: word, replacedWord, newSteps: stepsCount + 1 });

                    treeEdges.push({u: word, v: replacedWord, phase: 'bfs'});
                }
            }

            if (!matchFoundForI) {
                add("Evaluate Mutations (Miss)", `for(char ch = 'a'; ch <= 'z'; ch++)\nTested replacing index ${i} with all other 25 characters. No hits in Set.`, 52, { phase: 'eval_mutation_miss', activeWord: word, activeI: i });
            }
        }
    }

    if (!bfsTargetFound && mpp[endWord] === undefined) {
        add("BFS Complete (No Target)", `while(!q.isEmpty())\nQueue emptied without reaching target.`, 45, { phase: 'bfs_fail' });
        add("Final Return", `return ans;\nBecause endWord is not in mpp, returning empty array.`, 71, { phase: 'done', isDone: true, isSuccess: false });
        return steps;
    }

    add("Init Ans Array", `ans = new ArrayList<>();\nPhase 2: DFS Backtracking. Initializing answer array.`, 65, { phase: 'init_ans' });

    add("Check Target in Map", `if(mpp.containsKey(endWord) == true)\nDid our BFS map successfully reach '${endWord}'?`, 66, { phase: 'check_mpp_end' });

    // --- DFS BACKTRACKING PHASE ---
    if (mpp[endWord] !== undefined) {
        seq.push(endWord);
        add("Init Sequence", `List<String> seq = new ArrayList<>();\nseq.add(endWord);\nStarting our backtracking sequence with the target word.`, 67, { phase: 'init_seq' });

        add("Trigger DFS", `dfs(endWord, seq);\nLaunching recursive DFS backwards from '${endWord}'!`, 69, { phase: 'trigger_dfs' });

        // Inline Recursive DFS Simulator
        const runDFS = (dfsWord: string) => {
            add("DFS Enter", `private void dfs(String word="${dfsWord}", List<String> seq)\nEntering DFS recursion.`, 6, { phase: 'dfs_enter', activeDfsWord: dfsWord });

            add("Check DFS End", `if(word.equals(b))\nDid we backtrack all the way to the source '${beginWord}'?`, 7, { phase: 'dfs_check_start', activeDfsWord: dfsWord });

            if (dfsWord === beginWord) {
                let dup = [...seq];
                dup.reverse();
                ans.push(dup);
                add("Path Completed!", `ans.add(dup);\nSuccessfully linked a full path back to source! Reversed it and added to answers.`, 12, { phase: 'dfs_success', activeDfsWord: dfsWord });
                return;
            }

            let dfsSteps = mpp[dfsWord];
            add("Get Current Steps", `int steps = mpp.get(word);\nCurrent mapped distance to '${dfsWord}' is ${dfsSteps}. We need to find words with distance ${dfsSteps - 1}.`, 15, { phase: 'dfs_get_steps', activeDfsWord: dfsWord, dfsSteps });

            add("DFS Character Loop", `for(int i = 0; i < sz; i++)\nGenerating predecessor candidates via 1-letter mutations.`, 17, { phase: 'dfs_for_i', activeDfsWord: dfsWord });

            for (let i = 0; i < dfsWord.length; i++) {
                
                let foundDfsMatch = false;

                for (let c = 97; c <= 122; c++) {
                    let ch = String.fromCharCode(c);
                    if (ch === dfsWord[i]) continue;

                    let replacedWord = dfsWord.substring(0, i) + ch + dfsWord.substring(i+1);

                    if (mpp[replacedWord] !== undefined && mpp[replacedWord] + 1 === dfsSteps) {
                        foundDfsMatch = true;
                        
                        add("DFS Match Found", `if(mpp.containsKey(replacedWord) && mpp.get(replacedWord) + 1 == steps)\n'${replacedWord}' is in our map AND its distance (${mpp[replacedWord]}) is exactly 1 less than ${dfsSteps}!`, 22, { phase: 'dfs_match', activeDfsWord: dfsWord, replacedWord });

                        seq.push(replacedWord);
                        treeEdges.push({u: dfsWord, v: replacedWord, phase: 'dfs'});
                        add("DFS Path Append", `seq.add(replacedWord);\nAppended '${replacedWord}' to current backtracking path.`, 23, { phase: 'dfs_seq_add', activeDfsWord: dfsWord, replacedWord });

                        add("DFS Recurse", `dfs(replacedWord, seq);\nStepping backward into '${replacedWord}'.`, 24, { phase: 'dfs_recurse', activeDfsWord: dfsWord, replacedWord });
                        runDFS(replacedWord);

                        seq.pop();
                        add("DFS Backtrack", `seq.remove(seq.size() - 1);\nRecursion returned. Popping '${replacedWord}' off the sequence to test other branches.`, 25, { phase: 'dfs_backtrack', activeDfsWord: dfsWord, replacedWord });
                    }
                }

                if (!foundDfsMatch) {
                   add("DFS Mutation (Miss)", `for(char ch = 'a'; ch <= 'z'; ch++)\nTested replacing index ${i}. No valid map predecessors found.`, 18, { phase: 'dfs_mutation_miss', activeDfsWord: dfsWord, activeI: i }); 
                }
            }
        };

        runDFS(endWord);
    }

    add("Final Return", `return ans;\nAlgorithm complete. Returning all discovered shortest paths.`, 71, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseStart, baseTarget, baseDict]);

  // Derived state
  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  // Dynamic Tree Coordinates Calculation (Topological Layering based on Map!)
  const treePositions = useMemo(() => {
     if(!st.mpp) return {};
     
     const nodesByStep: {[key: number]: string[]} = {};
     
     // Only plot nodes that got evaluated in BFS map
     Object.keys(st.mpp).forEach(word => {
         const depth = st.mpp[word];
         if (!nodesByStep[depth]) nodesByStep[depth] = [];
         nodesByStep[depth].push(word);
     });

     const positions: {[key: string]: {x: number, y: number}} = {};
     Object.keys(nodesByStep).forEach(stepStr => {
         const step = parseInt(stepStr);
         const words = nodesByStep[step];
         // Sort words alphabetically just for clean, predictable rendering
         words.sort();
         const totalHeight = words.length * 80;
         const startY = -(totalHeight / 2) + 40;
         
         words.forEach((w: string, idx: number) => {
             positions[w] = {
                 x: (step - 1) * 200,
                 y: startY + (idx * 80)
             };
         });
     });
     return positions;
  }, [st.mpp]);


  // --- UI Handlers ---
  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({ x: 0, y: 0 }); 
    setZoom(0.85); 
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
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
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

  // --- Segregated Render Blocks for Clean Layout ---

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? (st.isSuccess ? 'bg-emerald-900 border-emerald-800' : 'bg-rose-900 border-rose-800') : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500"><Combine size={100} className="text-white"/></div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 ${st.isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {st.isSuccess ? <CheckCircle2 size={24}/> : <AlertTriangle size={24}/>} 
                    {st.isSuccess ? "ALL SHORTEST PATHS CAPTURED" : "TRANSFORMATION IMPOSSIBLE"}
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    {st.isSuccess ? `Safely collected ${st.ans?.length} valid sequence(s) of length ${st.ans[0]?.length}.` : `The target word could not be reached via 1-letter transformations.`}
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('dfs') ? 'text-fuchsia-400' : (String(st.phase || '').includes('hit') || String(st.phase || '').includes('add') ? 'text-emerald-400' : (String(st.phase || '').includes('miss') ? 'text-amber-400' : (String(st.phase || '').includes('mpp') || String(st.phase || '').includes('set') || String(st.phase || '').includes('for') ? 'text-sky-400' : 'text-white')))}`}>{String(curStepData.phase || "")}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderStateArrays = () => (
      <div className="flex flex-row items-start justify-center gap-4 xl:gap-8 w-full p-4 overflow-x-auto min-h-[140px]">
          
          {/* Phase 1: Distance Mapping */}
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2"><Map size={12}/> HashMap mpp</span>
              <div className="flex flex-wrap justify-center gap-2 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[400px]">
                  {st.mpp === undefined || Object.keys(st.mpp).length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Mapping...</span> : Object.keys(st.mpp).map((word: string, idx: number) => {
                      
                      let distance = st.mpp[word];
                      let isNewlyAdded = st.phase === 'mpp_put' && st.replacedWord === word;
                      let isEvaluatedDFS = st.phase === 'dfs_get_steps' && st.activeDfsWord === word;
                      let isCheckedDFS = st.phase === 'dfs_match' && st.replacedWord === word;
                      
                      let boxBg = "bg-sky-50 text-slate-600 border-sky-200 shadow-sm";
                      
                      if (isNewlyAdded) boxBg = "bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-2 ring-sky-300 animate-in zoom-in";
                      if (isEvaluatedDFS) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300";
                      if (isCheckedDFS) boxBg = "bg-emerald-500 text-white border-emerald-600 scale-110 shadow-lg ring-2 ring-emerald-300";

                      return (
                          <div key={`mpp-${idx}`} className={`px-2 py-1 flex items-center justify-center font-mono font-bold text-xs rounded-lg border transition-all duration-300 ${boxBg}`}>
                              {word} <span className="ml-1 opacity-70">:{distance}</span>
                          </div>
                      )
                  })}
              </div>
          </div>

          <div className="w-px h-16 bg-slate-200 shrink-0"></div>

          {/* Dictionary Set */}
          <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2"><CheckSquare2 size={12}/> Set st</span>
              <div className="flex flex-wrap justify-center gap-1.5 p-3 bg-white border border-slate-200 shadow-md rounded-2xl max-w-[200px]">
                  {st.stArray === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2">Awaiting Init...</span> : (baseDict || []).map((word: string, idx: number) => {
                      
                      let inSet = st.stArray.includes(word);
                      let isNewlyRemoved = st.phase === 'st_remove' && st.replacedWord === word;
                      
                      let boxBg = inSet ? "bg-slate-600 text-white border-slate-700 shadow-sm" : "bg-slate-100 text-slate-300 border-slate-200 line-through opacity-60";
                      if (isNewlyRemoved) boxBg = "bg-rose-500 text-white border-rose-600 scale-110 shadow-lg ring-2 ring-rose-300 animate-in zoom-in";

                      return (
                          <div key={`set-${idx}`} className={`px-2 py-0.5 flex items-center justify-center font-mono font-bold text-[10px] rounded border transition-all duration-300 ${boxBg}`}>
                              {word}
                          </div>
                      )
                  })}
              </div>
          </div>
      </div>
  );

  const renderRightSidebar = () => (
      <div className="flex flex-col gap-5 w-full h-full pb-8">
          
          {/* Answer Array HUD */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Trophy size={12}/> Valid Paths (ans)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 relative items-center min-h-[100px] gap-2 overflow-y-auto scrollbar-thin">
                  {st.ans === undefined || st.ans.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-4 text-center">0 paths found.</span> : (st.ans || []).map((path: string[], idx: number) => {
                      let isNew = String(st.phase || '').includes('dfs_success') && idx === st.ans.length - 1;
                      return (
                          <div key={`ans-${idx}`} className={`w-full p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1 overflow-x-auto scrollbar-none transition-all duration-500 ${isNew ? 'scale-105 shadow-md ring-2 ring-emerald-300 animate-in slide-in-from-right-4' : 'shadow-sm'}`}>
                             {path.map((w, wIdx) => (
                                 <React.Fragment key={`aw-${idx}-${wIdx}`}>
                                     <span className="font-mono font-black text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded">{w}</span>
                                     {wIdx < path.length - 1 && <ArrowRight size={10} className="text-emerald-400 shrink-0"/>}
                                 </React.Fragment>
                             ))}
                          </div>
                      )
                  })}
              </div>
          </div>

          {/* Phase 2: DFS Sequence Tracking */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 px-3 py-1 rounded-lg border border-fuchsia-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Layers size={12}/> Backtrack Path (seq)</span>
              <div className={`flex flex-col w-full bg-white border shadow-md rounded-2xl p-3 transition-all duration-500 min-h-[60px] ${st.phase && st.phase.includes('dfs') ? 'border-fuchsia-400 ring-2 ring-fuchsia-100 bg-fuchsia-50' : 'border-slate-200'}`}>
                  <div className="flex flex-wrap gap-1.5 items-center justify-center">
                     {st.seq === undefined || st.seq.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2">Waiting for Phase 2...</span> : (st.seq || []).map((val: string, idx: number) => {
                         let isNew = st.phase === 'dfs_seq_add' && idx === st.seq.length - 1;
                         let isSuccess = st.phase === 'dfs_success';
                         return (
                             <span key={`seq-${idx}`} className={`font-mono font-black text-[10px] px-2 py-0.5 rounded-lg border transition-all ${isNew ? 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-lg scale-110 animate-in zoom-in' : (isSuccess ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pulse' : 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 shadow-sm')}`}>{val}</span>
                         )
                     })}
                  </div>
              </div>
          </div>

          {/* Queue Component (Simple Strings) */}
          <div className="flex flex-col items-center w-full">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListOrdered size={12}/> Queue&lt;String&gt; q</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[80px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>FRONT (OUT)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 transition-all duration-500">
                      {st.q === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.q || []).map((word: string, i: number) => {
                          let isEntering = String(st.phase || '').includes('q_add') && i === st.q.length - 1;
                          let isTop = i === 0;
                          let isPopping = isTop && (st.phase === 'q_peek' || st.phase === 'q_remove');
                          
                          return (
                              <div key={`qf-${i}-${word}`} className={`px-2 py-1 flex items-center justify-center font-mono font-black rounded border transition-all duration-500 ${isEntering ? 'bg-emerald-500 border-emerald-600 text-white animate-in slide-in-from-right-4 z-10 scale-105' : (isPopping ? 'bg-amber-400 border-amber-500 text-white animate-pulse ring-2 ring-amber-200 scale-105 z-10 relative' : (isTop ? 'bg-sky-500 border-sky-600 text-white' : 'bg-slate-700 border-slate-800 text-white'))}`}>
                                  <span className="text-xs uppercase">{word}</span>
                              </div>
                          )
                      })}
                      {st.q !== undefined && st.q.length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Queue empty</span>}
                  </div>
              </div>
          </div>

          {/* Variables State Panel */}
          <div className="flex flex-col w-full mt-auto">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Database size={12}/> Trace Variables</span>
              <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-400">phase:</span>
                          <span className="font-bold text-slate-700 uppercase">{String(st.phase || '').includes('dfs') ? 'dfs' : 'bfs'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2 mt-1">
                          <span className="text-fuchsia-500">word (Active Node):</span>
                          <span className="font-bold text-fuchsia-700 uppercase tracking-widest">{st.activeWord || st.activeDfsWord || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1 col-span-2">
                          <span className="text-amber-500">replacedWord:</span>
                          <span className="font-bold text-amber-700 uppercase tracking-widest">{st.replacedWord !== undefined ? st.replacedWord : '-'}</span>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderMainGraphCanvas = () => {
      if (st.mpp === undefined) return null;
      
      const getXOffset = () => {
          if (!st.mpp) return 0;
          let maxStep = 1;
          Object.values(st.mpp).forEach((d:any) => { if(d > maxStep) maxStep = d; });
          return -((maxStep * 200) / 2) + 100; // Centering offset based on depth
      };

      const gXOffset = getXOffset();

      return (
          <div className="absolute inset-0 w-full h-full transition-transform duration-300 flex flex-col justify-center items-center" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center' }}>
              
              <div style={{ width: 1000, height: 800 }} className="relative origin-center">
                  
                  {/* Edges Layer */}
                  <svg viewBox={`-500 -400 1000 800`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      {(() => {
                          return (st.treeEdges || []).map((edge: {u: string, v: string, phase: string}, idx: number) => {
                              const p1 = treePositions[edge.u];
                              const p2 = treePositions[edge.v];
                              if (!p1 || !p2) return null;

                              const dx = p2.x - p1.x;
                              const dy = p2.y - p1.y;
                              const angle = Math.atan2(dy, dx);
                              
                              const rOffset = 45; // Node width is ~90px, radius roughly 45px
                              const startX = p1.x + rOffset * Math.cos(angle) + gXOffset;
                              const startY = p1.y + rOffset * Math.sin(angle);
                              const targetX = p2.x - rOffset * Math.cos(angle) + gXOffset;
                              const targetY = p2.y - rOffset * Math.sin(angle);
  
                              // Draw backwards for DFS
                              const isDFS = edge.phase === 'dfs';
                              let isJustInjected = st.phase === 'mpp_put' && st.activeWord === edge.u && st.replacedWord === edge.v;
                              let isDfsTracing = st.phase === 'dfs_seq_add' && st.activeDfsWord === edge.u && st.replacedWord === edge.v;
  
                              let strokeColor = isDFS ? "#10b981" : "#cbd5e1"; // emerald for dfs, slate for bfs
                              let strokeWidth = isDFS ? "4" : "2";
                              let animClass = "";
  
                              if (isJustInjected) {
                                  strokeColor = "#0ea5e9"; // sky-500 injected
                                  strokeWidth = "5";
                                  animClass = "animate-in fade-in zoom-in";
                              } else if (isDfsTracing) {
                                  strokeColor = "#d946ef"; // fuchsia tracing
                                  strokeWidth = "6";
                                  animClass = "animate-pulse";
                              }

                              // Explicit arrow head drawing
                              const arrowSize = isJustInjected || isDfsTracing ? 16 : (isDFS ? 14 : 10);
                              const arrowAngle = Math.PI / 6; // 30 degrees
                              
                              // Flip arrow logic if it's DFS (it points backwards!)
                              const arrX = isDFS ? startX : targetX;
                              const arrY = isDFS ? startY : targetY;
                              const faceAngle = isDFS ? angle + Math.PI : angle;

                              const arrowP1 = `${arrX},${arrY}`;
                              const arrowP2 = `${arrX - arrowSize * Math.cos(faceAngle - arrowAngle)},${arrY - arrowSize * Math.sin(faceAngle - arrowAngle)}`;
                              const arrowP3 = `${arrX - arrowSize * Math.cos(faceAngle + arrowAngle)},${arrY - arrowSize * Math.sin(faceAngle + arrowAngle)}`;
  
                              return (
                                  <g key={`te-${idx}`} className={`transition-all duration-300 ${animClass}`}>
                                      <line 
                                          x1={startX} y1={startY} x2={targetX} y2={targetY}
                                          stroke={strokeColor}
                                          strokeWidth={strokeWidth}
                                          strokeDasharray={isDFS ? "" : "4 2"} // Dashed for BFS mappings
                                      />
                                      <polygon 
                                          points={`${arrowP1} ${arrowP2} ${arrowP3}`} 
                                          fill={strokeColor} 
                                      />
                                  </g>
                              );
                          });
                      })()}
                  </svg>

                  {/* Nodes Layer - Centered exactly on the coordinate space */}
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'translate(50%, 50%)' }}>
                    {Object.keys(treePositions).map((word: string, idx: number) => {
                        let pos = treePositions[word];
                        if (!pos) return null;

                        let depth = st.mpp[word];
                        
                        let isActiveBFS = st.activeWord === word;
                        let isActiveDFS = st.activeDfsWord === word;
                        let isJustAdded = st.phase === 'mpp_put' && st.replacedWord === word;
                        let isTarget = word === st.targetWord;
                        let isStart = word === st.startWord;
                        let inDfsPath = (st.seq || []).includes(word);
                        
                        let bgClass = 'bg-white text-slate-600 border-slate-300 shadow-sm';
                        
                        // State priorities
                        if (isActiveDFS) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-2xl scale-125';
                        } else if (inDfsPath) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-110';
                        } else if (isActiveBFS) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl';
                        } else if (isJustAdded) {
                            bgClass = 'bg-sky-100 text-sky-700 border-sky-400 shadow-md border-dashed';
                        } else if (isTarget || isStart) {
                            bgClass = 'bg-slate-800 text-white border-slate-900 shadow-md';
                        }

                        let ringClass = '';
                        let zIndex = 'z-10';

                        // Highlight strictly using prominent rings
                        if (isActiveDFS) {
                            ringClass = 'ring-4 ring-fuchsia-300 ring-offset-2 border-transparent';
                            zIndex = 'z-50';
                        } else if (inDfsPath) {
                            ringClass = 'ring-4 ring-emerald-300 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActiveBFS) {
                            ringClass = 'ring-4 ring-sky-300 ring-offset-2 border-transparent';
                            zIndex = 'z-30';
                        }

                        return (
                            <div 
                                key={`tnode-${idx}`}
                                className={`absolute px-4 py-2 flex flex-col items-center justify-center font-mono font-black text-xl rounded-xl transition-all duration-500 border-2 select-none uppercase tracking-widest ${bgClass} ${ringClass} ${zIndex}`}
                                style={{ 
                                    left: `${pos.x + gXOffset}px`, 
                                    top: `${pos.y}px`,
                                    transform: 'translate(-50%, -50%)'
                                }}
                            >
                                {word}
                                <span className={`absolute -bottom-6 text-[9px] px-2 py-0.5 rounded-full font-black shadow-sm uppercase tracking-widest whitespace-nowrap transition-colors ${inDfsPath ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    dist: {depth}
                                </span>
                                {isTarget && <span className="absolute -top-6 text-[9px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-black border border-rose-300 shadow-sm uppercase tracking-widest whitespace-nowrap"><Compass size={10} className="inline mr-1"/>Target</span>}
                                {isStart && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded font-black border border-sky-300 shadow-sm uppercase tracking-widest whitespace-nowrap"><MapPin size={10} className="inline mr-1"/>Start</span>}
                            </div>
                        );
                    })}
                  </div>
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
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>
                      Graph Algorithm
                  </span>
                  <span>•</span>
                  <span>BFS + DFS Hybrid Backtracking</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Combine size={28}/> Beating MLE with a Hybrid Engine</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Word Ladder II asks for <strong>all</strong> shortest paths. Putting full <code>ArrayList</code> paths into a BFS Queue causes massive Memory Limit Exceeded (MLE) errors on LeetCode because the queue branches factorially.</p>
                        <p>The optimized solution splits the algorithm into two pristine phases:</p>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600">
                            <li><strong>Phase 1 (Standard BFS):</strong> We push strings (not paths) into a Queue purely to populate a <code>HashMap</code>. This map acts as a topological distance record, storing the absolute shortest step count from the start to every valid dictionary word.</li>
                            <li><strong>Phase 2 (Backtracking DFS):</strong> Once the map is built, we start from the <code>targetWord</code> and run DFS backward! We recursively test mutations, but we <em>only</em> accept mutations if their mapped distance is exactly <code>steps - 1</code>. This guarantees we solely trace optimal shortest paths back to the source!</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Test Cases</h4>
                    
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Test Case 1 */}
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: Multiple Paths</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>start:</strong> "der"<br/><strong>target:</strong> "dfs"<br/><strong>wordList:</strong> ["des", "der", "dfr", "dgt", "dfs"]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[["der","des","dfs"], ["der","dfr","dfs"]]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                BFS maps the distances: der(1), des(2), dfr(2), dfs(3).<br/>
                                DFS starts at dfs(3). It checks mutations and finds both des(2) and dfr(2) are exactly 3 - 1 = 2! It recursively builds both paths!
                            </span>
                        </div>

                        {/* Test Case 2 */}
                        <div className={`bg-slate-900 border-t-4 border-rose-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-rose-500/20`} size={120} />
                            <span className={`text-rose-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Impossible Path</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>start:</strong> "hit"<br/><strong>target:</strong> "cog"<br/><strong>wordList:</strong> ["hot", "dot", "dog", "lot", "log", "cog"]</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">
                                If we intentionally disconnect 'cog', BFS will empty the queue without ever placing 'cog' in the Map. The algorithm detects this immediately and returns `[]` without even triggering DFS.
                            </span>
                        </div>
                    </div>
                </section>
                
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Split Screen Normal Mode */}
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                {renderTraceOperationsBox()}
                
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[300px] max-h-[500px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="flex flex-wrap gap-3 pb-3 border-b border-slate-100 mb-2">
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Load Test Case 1 (Valid)</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><AlertTriangle size={14}/> Load Test Case 2 (Fail)</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Start Word</label>
                            <input type="text" value={startWordInput} onChange={(e) => setStartWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="der" />
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-emerald-600 pl-1`}>Target Word</label>
                            <input type="text" value={targetWordInput} onChange={(e) => setTargetWordInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner font-bold text-emerald-600`} placeholder="dfs" />
                        </div>
                        <div className="space-y-1.5 md:col-span-4">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Dictionary (wordList) | comma separator</label>
                            <input type="text" value={dictInput} onChange={(e) => setDictInput(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} placeholder="des, der, dfr, dgt, dfs" />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={handleReset} title="Reset View" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                {/* Unified Sub-layout for Normal Mode ensuring no overlapping */}
                <div className="flex flex-col xl:flex-row gap-4 h-[700px]">
                    
                    {/* Main Canvas + Bottom Arrays Container */}
                    <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
                        <span className={`absolute top-4 left-4 z-20 text-[10px] font-black uppercase tracking-widest font-mono flex items-center gap-2 bg-white/90 px-3 py-2 rounded-lg shadow-sm border border-slate-200 backdrop-blur text-${themeColor}-600`}><Combine size={14} className={`text-${themeColor}-500`}/> 2-Phase Hybrid Visualizer</span>
                        <div className="absolute top-4 right-4 z-20 flex gap-2">
                            <div className="flex bg-white/90 p-1.5 rounded-xl shadow-md border border-slate-200 backdrop-blur gap-1">
                                <button onClick={zoomIn} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom In"><ZoomIn size={16}/></button>
                                <button onClick={zoomOut} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Zoom Out"><ZoomOut size={16}/></button>
                                <div className="w-px bg-slate-200 mx-1"></div>
                                <button onClick={handleReset} className={`p-1.5 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`} title="Center Graph"><Crosshair size={16}/></button>
                            </div>
                        </div>

                        {/* Unbounded Graph Area */}
                        <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e115_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e115_1px,transparent_1px)] bg-[size:25px_25px] overflow-hidden" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                            {renderMainGraphCanvas()}
                        </div>

                        {/* Safe Bottom Dock for Arrays */}
                        <div className="bg-slate-50 border-t border-slate-200 shadow-inner z-20 shrink-0">
                            {renderStateArrays()}
                        </div>
                    </div>

                    {/* Right Panel for Sidebars */}
                    <div className="w-full xl:w-[320px] bg-slate-50 rounded-3xl border border-slate-200 shadow-inner p-4 overflow-y-auto">
                        {renderRightSidebar()}
                    </div>
                </div>

            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-rose-100 text-rose-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Algorithm Theory &amp; Complexities</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Understanding how combining BFS and DFS completely breaks the Memory limits of standard graph traversal.</p>
                </div>
                
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><ArrowLeftRight size={24} className="text-sky-500"/> Phase 1: BFS Distance Mapping</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">If we store entire paths in the queue, memory explodes factorially (e.g. tracking 50 distinct paths of 20 words each). Instead, Phase 1 only uses a queue of single Strings! It performs standard BFS just to build a <code>HashMap</code> containing <code>{`{word: shortest_distance}`}</code>. This is incredibly memory efficient.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Layers size={24} className="text-fuchsia-500"/> Phase 2: DFS Backtracking</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">Once the map is built, we start from the <code>endWord</code>. We recursively check all 1-letter mutations. If a mutation exists in our map AND its mapped distance is exactly <code>current_distance - 1</code>, we know we are stepping backward along a mathematically optimal shortest path! We push it to our DFS <code>seq</code> and recurse until we hit the <code>beginWord</code>.</p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-emerald-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N*L*26 + Paths)</strong><br/>Phase 1 (BFS) takes $O(N \cdot L \cdot 26)$ where $N$ is dictionary size and $L$ is word length. Phase 2 (DFS) takes time proportional to the total number of optimal paths found. This is drastically faster than maintaining paths during BFS.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N)</strong><br/>The Dictionary Set, the BFS Queue, and the Distance HashMap all store at most $N$ simple Strings. This perfectly solves the Memory Limit Exceeded issue by keeping space strictly linear to the dictionary size.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-rose-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is arguably one of the hardest BFS/DFS crossover problems on LeetCode. An interviewer wants to see you cleanly separate the two conceptual logic phases."</p>
                </div>
                
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Why do we use DFS to backtrack instead of BFS?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because DFS is perfect for generating and printing full sequence paths."</p>
                            <p>BFS is great for finding the shortest distance, but terrible at maintaining sequence history (requires tracking arrays in queues). DFS uses the natural Call Stack to effortlessly build, push, and pop (`seq.remove(seq.size() - 1)`) intermediate sequence paths as it traces backward along the optimal distances map."</p>
                        </div>
                    </div>

                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "Why do we reverse the sequence before adding it to ans?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Because we are backtracking from the end to the start."</p>
                            <p>Our DFS begins at the `targetWord` and traces backward to the `startWord`. Therefore, the `seq` array naturally holds the path backwards (e.g., `["dfs", "dfr", "der"]`). We must explicitly clone the array, reverse it to read source-to-target, and then push it to our final answer list."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              
              {/* FIXED LEFT SIDEBAR: Trace Top, Code Bottom */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {/* Pinned Trace Box */}
                  {renderTraceOperationsBox()}

                  {/* Auto-scrolling Source Code */}
                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* CENTER CANVAS AREA - No Overlaps! */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  
                  {/* Top Bar inside Center */}
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-2xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0`}>start:</label>
                          <input type="text" value={startWordInput} onChange={(e) => setStartWordInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="der" />
                          
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-emerald-600 shrink-0 ml-2`}>target:</label>
                          <input type="text" value={targetWordInput} onChange={(e) => setTargetWordInput(e.target.value)} className={`w-16 bg-slate-100 border border-slate-200 rounded-lg px-2 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-emerald-500 font-bold text-emerald-600`} placeholder="dfs" />

                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 shrink-0 ml-2`}>dict:</label>
                          <input type="text" value={dictInput} onChange={(e) => setDictInput(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} placeholder="des, der, ..." />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomIn size={18}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><ZoomOut size={18}/></button>
                          <button onClick={handleReset} title="Reset View" className={`p-2 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-lg transition-colors`}><RotateCcw size={18}/></button>
                          <div className="w-px bg-slate-300 mx-1"></div>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-2 bg-rose-100 text-rose-600 hover:bg-rose-200 rounded-lg transition-colors`}><Minimize size={18}/></button>
                      </div>
                  </div>

                  {/* Pure Infinite Graph Space */}
                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px]" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      {renderMainGraphCanvas()}
                      
                      {!st.isDone && (
                          <div className="absolute bottom-8 right-8 z-50 flex items-center gap-4 animate-in slide-in-from-bottom-10 pointer-events-none">
                              <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-500 bg-white/80 px-3 py-1 rounded shadow-sm border border-slate-200">Shortcuts: &larr; &rarr;</span>
                              <div className="pointer-events-auto flex gap-3">
                                  <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-4 bg-white text-slate-700 rounded-2xl shadow-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2"><ChevronLeft size={20}/> PREV</button>
                                  <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-4 bg-${themeColor}-500 text-white rounded-2xl shadow-xl border border-${themeColor}-400 hover:bg-${themeColor}-600 active:scale-95 transition-all font-black text-sm uppercase tracking-widest flex items-center gap-2 disabled:opacity-30`}>NEXT <ChevronRight size={20}/></button>
                              </div>
                          </div>
                      )}
                  </div>

                  {/* Safely Docked State Arrays */}
                  <div className="bg-white border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR - Adjacency, Stack & Variables safely separated */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}