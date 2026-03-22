import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy,
  FileText, ArrowRight, ChevronLeft, ChevronRight, RotateCcw, 
  ListOrdered, ZoomIn, ZoomOut, Maximize, Search,
  Lightbulb, MonitorPlay, PartyPopper, X,
  Minimize, Grid, ArrowRightFromLine, Crosshair, MapPin, 
  Layers, PaintBucket, Palette, PlayCircle, Compass,
  Waves, CheckCircle2, CheckSquare, Scissors,
  Flame, Timer, AlertTriangle, Database, Repeat, ArrowLeftRight, ListTree, Route, Shield, ShieldAlert, ShieldCheck, Map as MapIcon, Combine, SplitSquareHorizontal, CheckSquare2, ListChecks, ArrowUp10, BookOpenCheck, ArrowLeft, SpellCheck, Type, TestTube, Navigation, LayoutGrid, Eye, ArrowUp, ArrowDown, MoveRight, Plane, ArrowDownLeft, Network as NetworkIcon, Hash as HashIcon, PlusSquare, RefreshCw, GitMerge, Settings2, Fingerprint, Scaling, Mail, MailPlus, Inbox
} from 'lucide-react';

// --- Algorithm Configuration ---

const OPERATIONS = {
  accountsMerge: {
    id: 'accountsMerge',
    title: 'Accounts Merge (DSU)',
    icon: <Mail size={16} />,
    complexity: 'Time: O(N log N) | Space: O(N)',
    theme: 'sky',
    code: `class DisjointSet {
    List<Integer> parent = new ArrayList<>();
    List<Integer> size = new ArrayList<>();
    public DisjointSet(int n) {
        for (int i = 0; i <= n; i++) {
            parent.add(i);
            size.add(1);
        }
    }
    public int findUPar(int node) {
        if (node == parent.get(node)) return node;
        int ulp = findUPar(parent.get(node));
        parent.set(node, ulp);
        return parent.get(node);
    }
    public void unionBySize(int u, int v) {
        int ulp_u = findUPar(u);
        int ulp_v = findUPar(v);
        if (ulp_u == ulp_v) return;
        if (size.get(ulp_u) < size.get(ulp_v)) {
            parent.set(ulp_u, ulp_v);
            size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));
        } else {
            parent.set(ulp_v, ulp_u);
            size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));
        }
    }
}

class Solution {
    static List<List<String>> accountsMerge(List<List<String>> details) {
        int n = details.size();
        DisjointSet ds = new DisjointSet(n);
        HashMap<String, Integer> mapMailNode = new HashMap<String, Integer>();
        
        for(int i = 0; i < n; i++) {
            for(int j = 1; j < details.get(i).size(); j++) {
                String mail = details.get(i).get(j);
                if(mapMailNode.containsKey(mail) == false) {
                    mapMailNode.put(mail, i);
                }
                else {
                    ds.unionBySize(mapMailNode.get(mail), i);
                }
            }
        }
        
        ArrayList<String>[] mergedMail = new ArrayList[n];
        for(int i = 0; i < n; i++) {
            mergedMail[i] = new ArrayList<String>();
        }
        
        for(Map.Entry<String, Integer> it : mapMailNode.entrySet()) {
            String mail = it.getKey();
            int node = ds.findUPar(it.getValue());
            mergedMail[node].add(mail);
        }
        
        List<List<String>> ans = new ArrayList<>();
        
        for(int i = 0; i < n; i++) {
            if(mergedMail[i].size() == 0) continue;
            Collections.sort(mergedMail[i]);
            List<String> temp = new ArrayList<>();
            temp.add(details.get(i).get(0));
            for(String it : mergedMail[i]) {
                temp.add(it);
            }
            ans.add(temp);
        }
        return ans;
    }
}`,
    desc: "Given a list of accounts where the first element is a name and the rest are emails, we want to merge accounts belonging to the exact same person. We use a Disjoint Set (DSU) to group account indices (0 to n-1). A HashMap traces 'email -> nodeID'. If we see an email we've seen before, it definitively links the current account to the previous account, so we Union them! Finally, we group the emails by their ultimate root, sort them, append the name, and return."
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
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-black transition-all duration-300 whitespace-nowrap ${active ? `bg-${themeColor}-500 text-white shadow-md scale-105 border border-white/10` : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'}`}>
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
  const parts = code.split(/(\/\/.*|#.*|".*?"|'.'|\b(?:public|private|void|int|long|double|boolean|Boolean|char|class|static|return|if|else|new|for|while|DisjointSet|rank|size|parent|ArrayList|List|Integer|String|findUPar|unionByRank|unionBySize|node|ulp|ulp_u|ulp_v|u|v|rankU|add|set|get|Main|main|args|accountsMerge|details|HashMap|mapMailNode|containsKey|put|mergedMail|Map|Entry|entrySet|getKey|getValue|ans|Collections|sort|temp|mail|it|length)\b|\b\d+\b|[\+\-\*\/\%\=\<\>!\|&\[\]\^])/g).filter(Boolean);
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
            const isKeyword = ['public', 'private', 'void', 'int', 'char', 'long', 'double', 'boolean', 'Boolean', 'class', 'static', 'return', 'if', 'else', 'new', 'for', 'while', 'continue'].includes(part);
            const isObject = ['String', 'Math', 'Integer', 'DisjointSet', 'List', 'ArrayList', 'Solution', 'HashMap', 'Map', 'Entry', 'Collections'].includes(part);
            const isPointer = ['rank', 'size', 'parent', 'node', 'ulp', 'ulp_u', 'ulp_v', 'u', 'v', 'n', 'i', 'j', 'details', 'mapMailNode', 'mail', 'mergedMail', 'it', 'ans', 'temp'].includes(part);
            const isMapCall = ['accountsMerge', 'findUPar', 'unionByRank', 'unionBySize', 'add', 'set', 'get', 'containsKey', 'put', 'entrySet', 'getKey', 'getValue', 'sort'].includes(part);
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

export default function AccountsMergeVisualizer() {
  const [activeTab, setActiveTab] = useState('visualizer');
  const selectedOpId = 'accountsMerge';
  const selectedOp = OPERATIONS[selectedOpId];
  const themeColor = selectedOp.theme;

  const [inputStr, setInputStr] = useState('John, J1@com, J2@com, J3@com | John, J4@com | raj, r1@com, r2@com | John, J1@com, J5@com | raj, r2@com, r3@com | Mary, M1@com');

  const [baseDetails, setBaseDetails] = useState<string[][]>([
      ["John", "J1@com", "J2@com", "J3@com"],
      ["John", "J4@com"],
      ["raj", "r1@com", "r2@com"],
      ["John", "J1@com", "J5@com"],
      ["raj", "r2@com", "r3@com"],
      ["Mary", "M1@com"]
  ]);
  const [baseN, setBaseN] = useState(6);

  const [currentStep, setCurrentStep] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 }); 
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);

  const codeContainerRef = useRef<HTMLDivElement>(null);

  const loadTestCase1 = () => {
      setInputStr('John, J1@com, J2@com, J3@com | John, J4@com | raj, r1@com, r2@com | John, J1@com, J5@com | raj, r2@com, r3@com | Mary, M1@com');
  };

  const loadTestCase2 = () => {
      setInputStr('Gabe, Gabe0@m.co, Gabe3@m.co, Gabe1@m.co | Kevin, Kevin3@m.co, Kevin5@m.co, Kevin0@m.co | Ethan, Ethan5@m.co, Ethan4@m.co, Ethan0@m.co | Hanzo, Hanzo3@m.co, Hanzo1@m.co, Hanzo0@m.co | Fernandez, Hanzo3@m.co, Hanzo1@m.co');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        let accounts = inputStr.split('|').map(a => a.trim()).filter(a => a.length > 0);
        let parsed: string[][] = [];
        for(let acc of accounts) {
            let fields = acc.split(',').map(s => s.trim()).filter(s => s.length > 0);
            if(fields.length > 0) parsed.push(fields);
        }
        if (parsed.length > 0) {
            setBaseDetails(parsed);
            setBaseN(parsed.length);
            setCurrentStep(0);
            setPan({ x: 0, y: 0 });
            setZoom(1);
        }
      } catch (e) {}
    }, 400);
    return () => clearTimeout(timer);
  }, [inputStr]);

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

  const clone1D = (arr: number[]) => [...arr];

  // --- EXACT LINE-BY-LINE TRACE GENERATION (ACCOUNTS MERGE) ---
  const trace = useMemo(() => {
    const steps: any[] = [];
    const n = baseN;
    const details = baseDetails;
    
    if (n === 0) return steps;

    let parent = Array(n).fill(0); 
    let sizeArr = Array(n).fill(1);
    let mapMailNode: Record<string, number> = {};
    let mergedMail: string[][] = Array.from({length: n}, () => []);
    let ans: string[][] = [];

    const add = (ph: string, ds: string, ln: number, stateObj: any = {}) => steps.push({ 
        phase: ph, description: ds, line: ln, state: { parent: clone1D(parent), sizeArr: clone1D(sizeArr), n, details, mapMailNode: {...mapMailNode}, mergedMail: mergedMail.map(m=>[...m]), ans: ans.map(a=>[...a]), ...stateObj } 
    });

    const simulateFind = (node: number, originalCall: string): number => {
        add("Find Ultimate Parent", `public int findUPar(int node)\nExecuting DSU Find for node ${node}. Traversing upwards to find its ultimate root.`, 10, { phase: 'find_start', findNode: node, originalCall });
        
        let isRoot = node === parent[node];
        add("Check Root Condition", `if (node == parent.get(node)) return node;\nIs node ${node} its own parent? ${isRoot ? 'YES, returning it directly.' : 'NO, keep climbing.'}`, 11, { phase: 'find_check', findNode: node, isRoot, originalCall });
        
        if (isRoot) return node;

        add("Recursive Call", `int ulp = findUPar(parent.get(node));\nRecursively calling findUPar() on its immediate parent: ${parent[node]}.`, 12, { phase: 'find_recurse', findNode: node, originalCall });
        let ulp = simulateFind(parent[node], originalCall);

        parent[node] = ulp;
        add("PATH COMPRESSION", `parent.set(node, ulp);\nCRITICAL OPTIMIZATION: Overwriting node ${node}'s parent pointer to skip intermediate nodes and point DIRECTLY to the ultimate root ${ulp}. This flattens the tree!`, 13, { phase: 'path_compression', findNode: node, ulp, originalCall });

        add("Return Root", `return parent.get(node);\nReturning the compressed ultimate root (${ulp}) down the call stack.`, 14, { phase: 'find_ret_comp', findNode: node, ulp, originalCall });
        return ulp;
    };

    add("Init Function", `static List<List<String>> accountsMerge(List<List<String>> details)\nStarting the algorithm to map and merge intersecting accounts.`, 31, { phase: 'init' });
    
    add("Init N", `int n = details.size();\nNumber of total distinct input accounts: ${n}.`, 32, { phase: 'init_vars' });
    
    add("Create Disjoint Set", `DisjointSet ds = new DisjointSet(n);\nAllocating DSU structure to group connected accounts.`, 33, { phase: 'init_dsu_call' });
    add("DSU Constructor", `public DisjointSet(int n)`, 4, { phase: 'init_dsu_cons' });
    
    for(let i=0; i<=n; i++) {
        add("DSU Init Loop", `for (int i = 0; i <= n; i++) -> i=${i}`, 5, { phase: 'init_dsu_loop', i });
        parent[i] = i;
        add("Init Parent", `parent.add(i); // parent[${i}] = ${i}`, 6, { phase: 'init_dsu_parent', i, parent: clone1D(parent) });
        sizeArr[i] = 1;
        add("Init Size", `size.add(1); // size[${i}] = 1`, 7, { phase: 'init_dsu_size', i, sizeArr: clone1D(sizeArr) });
    }

    add("Init HashMap", `HashMap<String, Integer> mapMailNode = new HashMap<String, Integer>();\nCreating a map to strictly bind each unique email to an Account Node ID.`, 34, { phase: 'init_map' });

    for(let i = 0; i < n; i++) {
        add("Traverse Accounts Loop", `for(int i = 0; i < n; i++) -> i=${i}\nProcessing Account ${i} ("${details[i][0]}").`, 36, { phase: 'loop_accounts', i });
        
        for(let j = 1; j < details[i].length; j++) {
            add("Traverse Emails Loop", `for(int j = 1; j < details.get(i).size(); j++) -> j=${j}\nIterating through emails for Account ${i}.`, 37, { phase: 'loop_emails', i, j });
            
            let mail = details[i][j];
            add("Extract Mail", `String mail = details.get(${i}).get(${j});\nExtracted email: "${mail}"`, 38, { phase: 'ext_mail', i, j, mail });

            let isNew = !(mail in mapMailNode);
            add("Check HashMap", `if(mapMailNode.containsKey(mail) == false)\nDoes the Map already contain "${mail}"? ${isNew ? 'NO' : 'YES! It was mapped earlier.'}`, 39, { phase: 'check_map', i, j, mail, isNew });

            if (isNew) {
                mapMailNode[mail] = i;
                add("Add to HashMap", `mapMailNode.put(mail, i);\nRECORDING: We officially map the previously unseen email "${mail}" to Account Index ${i}.`, 40, { phase: 'put_map', i, j, mail });
            } else {
                let target = mapMailNode[mail];
                add("Invoke Union", `ds.unionBySize(mapMailNode.get(mail), i);\nRECORDING: Found "${mail}" already belongs to Account ${target}. This mathematically proves Account ${target} and Account ${i} belong to the exact same person! Executing Union(${target}, ${i}).`, 43, { phase: 'union_call', i, j, mail, mapTarget: target });

                // Simulate DSU union
                add("Union Start", `public void unionBySize(int u, int v)`, 16, { phase: 'union_start', u: target, v: i });
                
                add("Find U Root", `int ulp_u = findUPar(u);`, 17, { phase: 'union_find', u: target, v: i });
                let ulp_u = simulateFind(target, `Union(${target},${i})`);

                add("Find V Root", `int ulp_v = findUPar(v);`, 18, { phase: 'union_find', u: target, v: i, ulp_u });
                let ulp_v = simulateFind(i, `Union(${target},${i})`);

                let isSame = ulp_u === ulp_v;
                add("Verify Disjoint", `if (ulp_u == ulp_v) return;\nAre roots identical? Is ${ulp_u} == ${ulp_v}? ${isSame ? 'YES, already merged! Returning early.' : 'NO, disjoint. Must merge.'}`, 19, { phase: 'union_verify', u: target, v: i, ulp_u, ulp_v, isSame });

                if (!isSame) {
                    let sizeU = sizeArr[ulp_u];
                    let sizeV = sizeArr[ulp_v];

                    add("Evaluate Size Constraints", `if (size.get(ulp_u) < size.get(ulp_v))\nComparing component sizes to maintain a flat tree: Is ${sizeU} < ${sizeV}?`, 20, { phase: 'union_compare', u: target, v: i, ulp_u, ulp_v, sizeU, sizeV });

                    if (sizeU < sizeV) {
                        parent[ulp_u] = ulp_v;
                        add("Attach U under V", `parent.set(ulp_u, ulp_v);\nTree U is smaller. Attaching its root completely UNDER larger tree V.`, 21, { phase: 'union_attach', u: target, v: i, ulp_u, ulp_v, attachedRoot: ulp_u, targetRoot: ulp_v });
                        sizeArr[ulp_v] += sizeArr[ulp_u];
                        add("Update Size of V", `size.set(ulp_v, size.get(ulp_v) + size.get(ulp_u));\nTree V absorbs Tree U's nodes. New size of Root ${ulp_v} is ${sizeArr[ulp_v]}.`, 22, { phase: 'union_add_size', u: target, v: i, targetRoot: ulp_v, newSize: sizeArr[ulp_v] });
                    } else {
                        parent[ulp_v] = ulp_u;
                        add("Attach V under U", `parent.set(ulp_v, ulp_u);\nTree V is smaller or equal. Attaching it under tree U.`, 24, { phase: 'union_attach', u: target, v: i, ulp_u, ulp_v, attachedRoot: ulp_v, targetRoot: ulp_u });
                        sizeArr[ulp_u] += sizeArr[ulp_v];
                        add("Update Size of U", `size.set(ulp_u, size.get(ulp_u) + size.get(ulp_v));\nTree U absorbs Tree V's nodes. New size of Root ${ulp_u} is ${sizeArr[ulp_u]}.`, 25, { phase: 'union_add_size', u: target, v: i, targetRoot: ulp_u, newSize: sizeArr[ulp_u] });
                    }
                }
            }
        }
    }

    add("Init Merged Array", `ArrayList<String>[] mergedMail = new ArrayList[n];\nInitializing an array of Lists to hold the successfully grouped emails for each ultimate root account.`, 48, { phase: 'init_merged' });

    for(let i=0; i<n; i++) {
        add("Instantiate Lists Loop", `for(int i = 0; i < n; i++) -> i=${i}`, 49, { phase: 'init_merged_loop', i });
        mergedMail[i] = [];
        add("Instantiate Lists Inside", `mergedMail[i] = new ArrayList<String>();\nEmpty list allocated for Account ${i}.`, 50, { phase: 'init_merged_in', i });
    }

    for (const [mail, nodeVal] of Object.entries(mapMailNode)) {
        add("Iterate HashMap Entries", `for(Map.Entry<String, Integer> it : mapMailNode.entrySet())\nPulling the next unique email from the HashMap to consolidate it.`, 53, { phase: 'iter_map_start', mail });
        add("Extract Map Email", `String mail = it.getKey();\nProcessing email: "${mail}"`, 54, { phase: 'iter_map_key', mail, nodeVal });
        add("Find Ultimate Root", `int node = ds.findUPar(it.getValue());\nFinding where Account ${nodeVal} finally belongs in the resolved DSU...`, 55, { phase: 'iter_map_find', mail, nodeVal });
        
        let root = simulateFind(nodeVal, `Mapping "${mail}"`);

        mergedMail[root].push(mail);
        add("Push to Merged Mail", `mergedMail[node].add(mail);\nPushed "${mail}" directly into mergedMail[${root}] (The master bucket for Root ${root}).`, 56, { phase: 'push_merged', mail, root, nodeVal });
    }

    add("Init Final Answer Array", `List<List<String>> ans = new ArrayList<>();\nCreating the final 2D array to format the results.`, 59, { phase: 'init_ans' });

    for(let i = 0; i < n; i++) {
        add("Final Build Loop", `for(int i = 0; i < n; i++) -> i=${i}`, 61, { phase: 'ans_loop_start', i });
        let isEmpty = mergedMail[i].length === 0;
        add("Check Empty Array", `if(mergedMail[i].size() == 0) continue;\nDoes Account ${i} hold any merged emails? ${isEmpty ? 'NO, it was absorbed by another root. Skipping.' : 'YES, this is a master root! Processing.'}`, 62, { phase: 'check_empty', i, isEmpty });
        
        if (isEmpty) continue;

        mergedMail[i].sort();
        add("Sort Emails", `Collections.sort(mergedMail[i]);\nAlphabetically sorting the extracted emails for Account ${i}.`, 63, { phase: 'sort_mails', i });

        let temp: string[] = [];
        add("Init Temp Row", `List<String> temp = new ArrayList<>();`, 64, { phase: 'init_temp', i });
        
        temp.push(details[i][0]);
        add("Add Account Name", `temp.add(details.get(i).get(0));\nPrepended the account name "${details[i][0]}" to the final row.`, 65, { phase: 'add_name', i, name: details[i][0], currentTemp: [...temp] });

        for(let mail of mergedMail[i]) {
            add("Iterate Sorted Emails", `for(String it : mergedMail[i]) -> it="${mail}"`, 66, { phase: 'iter_sorted', i, currentTemp: [...temp] });
            temp.push(mail);
            add("Add Email to Temp", `temp.add(it);\nAdded "${mail}" to the row array being built.`, 67, { phase: 'add_mail_temp', i, mail, currentTemp: [...temp] });
        }

        ans.push(temp);
        add("Push Row to Answer", `ans.add(temp);\nSuccessfully merged account complete! Pushing the fully assembled row into the Final Answer array.`, 69, { phase: 'push_ans', i });
    }

    add("Return Answer", `return ans;\nAlgorithm successfully merged all interconnected accounts! The DSU flawlessly flattened the relationships.`, 71, { phase: 'done', isDone: true, isSuccess: true });

    return steps;
  }, [baseN, baseDetails]);

  const curStepData = trace[currentStep] || trace[0] || { phase: '', description: '', line: 0, state: {} };
  const st = curStepData.state || {};
  const isLastStep = currentStep === trace.length - 1;

  const handleReset = () => { 
    setCurrentStep(0); 
    setPan({x: 0, y: 0}); 
    setZoom(1); 
  }; 
  const handleNext = () => { if (currentStep < trace.length - 1) setCurrentStep(prev => prev + 1); };
  const handlePrev = () => { if (currentStep > 0) setCurrentStep(prev => prev - 1); };
  const toggleFullscreen = () => setIsFullscreen(prev => !prev);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handlePointerMove = (e: React.PointerEvent) => { 
    if (isDragging) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handlePointerUp = () => setIsDragging(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedOp.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetPanZoom = () => { setPan({x:0, y:0}); setZoom(1); };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') setCurrentStep(prev => (prev < trace.length - 1 ? prev + 1 : prev));
      else if (e.key === 'ArrowLeft') setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
      else if (e.key === 'Escape') setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace.length]);

  // Dynamic Layout for components
  const svgSize = 600;
  const nodePositions = useMemo(() => {
    if (!st.parent) return [];
    const n = st.n;
    const parent = st.parent;
    
    const nodes = Array.from({length: n}, (_, i) => ({ id: i, root: i, depth: 0 }));
    
    for (let i = 0; i < n; i++) {
        let curr = i;
        let d = 0;
        let safety = 0;
        while (parent[curr] !== curr && safety < 100) {
            curr = parent[curr];
            d++;
            safety++;
        }
        nodes[i].root = curr;
        nodes[i].depth = d;
    }

    const roots = [...new Set(nodes.map(n => n.root))].sort((a,b) => a-b);
    const canvasWidth = 600;
    const componentWidth = canvasWidth / Math.max(1, roots.length);

    const pos = new Array(n).fill({x: 0, y: 0});
    
    roots.forEach((rootId, rIdx) => {
        const cx = (rIdx + 0.5) * componentWidth;
        const compNodes = nodes.filter(n => n.root === rootId);
        
        const byDepth: Record<number, number[]> = {};
        compNodes.forEach(n => {
            if (!byDepth[n.depth]) byDepth[n.depth] = [];
            byDepth[n.depth].push(n.id);
        });

        Object.keys(byDepth).forEach(depthStr => {
            const d = parseInt(depthStr);
            const nodesAtDepth = byDepth[d].sort((a,b) => a-b);
            const spacing = componentWidth / Math.max(1, nodesAtDepth.length);
            
            nodesAtDepth.forEach((nodeId, i) => {
                let nx = cx;
                if (nodesAtDepth.length > 1) {
                    nx = cx + (i - (nodesAtDepth.length - 1) / 2) * Math.min(spacing * 0.8, 60);
                }
                let ny = 80 + d * 70; // Adjusted for neatness
                pos[nodeId] = { x: nx, y: ny };
            });
        });
    });

    return pos;
  }, [st.parent, st.n]);

  const renderTraceOperationsBox = () => (
    <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-sky-900 border-sky-800` : 'bg-[#0f172a]'}`}>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
        <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
            <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
            <div className="flex items-center gap-2">
               <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
            </div>
        </div>
        {st.isDone ? (
             <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                    <CheckCircle2 size={24}/> ACCOUNTS MERGED SUCCESSFULLY
                </div>
                <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                    Algorithm concluded. The DSU accurately resolved the intersecting emails and grouped them under their absolute root accounts!
                </p>
             </div>
        ) : (
            <>
                <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('push') ? 'text-sky-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('map') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
            </>
        )}
    </div>
  );

  const renderMainCanvas = () => {
      if (st.parent === undefined) return <div className="w-full h-full flex items-center justify-center text-slate-300 font-mono italic">Awaiting Initialization...</div>;
      
      return (
          <div className="w-full h-full flex flex-row items-center justify-center relative p-8 gap-8">
              
              {/* Dynamic Graph Visualization */}
              <div style={{ width: svgSize, height: svgSize }} className="relative shrink-0 flex items-center justify-center">
                  <svg viewBox={`0 0 ${svgSize} ${svgSize}`} className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{ overflow: 'visible' }}>
                      <defs>
                          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                          </marker>
                          <marker id="arrowhead-compress" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#d946ef" />
                          </marker>
                          <marker id="arrowhead-union" markerWidth="10" markerHeight="7" refX="22" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
                          </marker>
                      </defs>

                      {(() => {
                          const edgesToDraw: React.ReactNode[] = [];
                          
                          // Draw explicit parent compression lines (arcs if jumping)
                          for (let i = 0; i < st.n; i++) {
                              const p = st.parent[i];
                              if (p === i) continue; // Root, no outgoing parent line
                              
                              const p1 = nodePositions[i];
                              const p2 = nodePositions[p];
                              if (!p1 || !p2) continue;

                              let isCompressing = st.phase === 'path_compression' && st.findNode === i;
                              let isUnionAttach = st.phase?.includes('union_attach') && st.attachedRoot === i;
                              
                              let strokeColor = "#64748b"; // Slate-500
                              let strokeWidth = "3";
                              let marker = "url(#arrowhead)";
                              let animClass = "transition-all duration-300";

                              if (isCompressing) {
                                  strokeColor = "#d946ef"; // Fuchsia
                                  strokeWidth = "6";
                                  marker = "url(#arrowhead-compress)";
                                  animClass = "transition-all duration-500 animate-pulse";
                              } else if (isUnionAttach) {
                                  strokeColor = "#0ea5e9"; // Sky blue
                                  strokeWidth = "6";
                                  marker = "url(#arrowhead-union)";
                                  animClass = "transition-all duration-500 animate-pulse";
                              }

                              edgesToDraw.push(
                                  <line 
                                      key={`edge-p-${i}-${p}`}
                                      x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                                      stroke={strokeColor}
                                      strokeWidth={strokeWidth}
                                      markerEnd={marker}
                                      className={animClass}
                                  />
                              );
                          }

                          return edgesToDraw;
                      })()}
                  </svg>

                  <div className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodePositions.map((pos, idx) => {
                        let isRoot = st.parent && st.parent[idx] === idx && st.phase !== 'init' && st.phase !== 'init_dsu_call' && st.phase !== 'init_dsu_cons';
                        
                        let isActiveI = st.phase?.includes('emails') && st.i === idx;
                        let isActiveU = st.phase?.includes('union') && (st.u === idx || st.ulp_u === idx);
                        let isActiveV = st.phase?.includes('union') && (st.v === idx || st.ulp_v === idx);
                        let isFind = st.phase?.includes('find') && st.findNode === idx;
                        let isAnsLoop = (st.phase?.includes('ans') || st.phase?.includes('sort') || st.phase?.includes('temp') || st.phase?.includes('add_name')) && st.i === idx;

                        let bgClass = 'bg-slate-100 text-slate-500 border-slate-300 shadow-sm opacity-90';
                        let ringClass = '';
                        let zIndex = 'z-10';

                        if (isAnsLoop) {
                            bgClass = 'bg-emerald-500 text-white border-emerald-600 shadow-2xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-emerald-300 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        } else if (isFind) {
                            bgClass = 'bg-fuchsia-500 text-white border-fuchsia-600 shadow-xl opacity-100 scale-125 font-black';
                            ringClass = 'ring-4 ring-fuchsia-200 ring-offset-2 border-transparent animate-pulse';
                            zIndex = 'z-50';
                        } else if (isActiveI || isActiveU) {
                            bgClass = 'bg-sky-500 text-white border-sky-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-sky-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isActiveV) {
                            bgClass = 'bg-indigo-500 text-white border-indigo-600 shadow-xl opacity-100 scale-110 font-black';
                            ringClass = 'ring-2 ring-indigo-200 ring-offset-2 border-transparent';
                            zIndex = 'z-40';
                        } else if (isRoot) {
                            bgClass = 'bg-slate-800 text-white border-slate-900 shadow-md font-black';
                            zIndex = 'z-20';
                        }

                        let name = st.details && st.details[idx] && st.details[idx].length > 0 ? st.details[idx][0] : `Acc ${idx}`;

                        return (
                            <div key={`node-${idx}`} className={`absolute w-[44px] h-[44px] flex flex-col items-center justify-center font-mono text-xl rounded-full transition-all duration-300 border-2 select-none pointer-events-auto ${bgClass} ${ringClass} ${zIndex}`} style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}>
                                <span>{idx}</span>
                                {isRoot && !isAnsLoop && !isActiveI && !isActiveU && !isActiveV && !isFind && <span className="absolute -top-6 text-[9px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-black border border-sky-200 shadow-sm uppercase tracking-widest whitespace-nowrap">Root (s:{st.sizeArr[idx]})</span>}
                                <span className={`absolute -bottom-6 text-[9px] font-black uppercase tracking-widest whitespace-nowrap px-1.5 py-0.5 rounded shadow-sm border ${isRoot ? 'bg-slate-800 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'}`}>
                                    {name}
                                </span>
                            </div>
                        );
                    })}
                  </div>
              </div>

          </div>
      );
  };

  const renderStateArrays = () => {
    if (!st.parent) return null;
    return (
        <div className="flex flex-col items-center justify-center gap-1 w-full p-4 overflow-x-auto min-h-[160px] relative z-30 bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] shrink-0">
            <div className="flex flex-col items-center shrink-0 w-full mb-4">
                <div className="flex gap-4 items-center">
                    
                    <div className="flex flex-col gap-4 items-end justify-center pr-4">
                        <span className={`text-[12px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 h-12 flex items-center shadow-sm`}>DSU parent[]</span>
                        <span className="text-[12px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded border border-indigo-200 h-12 flex items-center shadow-sm">DSU size[]</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {/* PARENT ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.parent.map((val: number, idx: number) => {
                                if (idx >= st.n) return null; // Only show 0 to n-1 visually based on input
                                let isEval = st.phase?.includes('check_root') && st.i === idx;
                                let isUpdated = st.phase?.includes('union_attach') && (st.attachedRoot === idx);
                                let isPathComp = st.phase === 'path_compression' && st.findNode === idx;
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-sky-500 text-white border-sky-600 scale-110 shadow-lg ring-2 ring-sky-300 animate-in zoom-in font-black z-20";
                                else if (isPathComp) boxBg = "bg-fuchsia-500 text-white border-fuchsia-600 scale-110 shadow-lg ring-2 ring-fuchsia-300 animate-in zoom-in font-black z-20";
                                else if (isEval || (st.phase?.includes('find') && st.findNode === idx)) boxBg = "bg-amber-100 text-amber-700 border-amber-300 scale-105 ring-2 ring-amber-200 z-10 font-bold";

                                return (
                                    <div key={`p-${idx}`} className="flex flex-col items-center relative group">
                                        <span className={`absolute bottom-full mb-2 text-[9px] font-mono font-black ${isEval || isPathComp ? 'text-amber-500' : 'text-slate-400'}`}>{idx}</span>
                                        <div className={`w-14 h-12 flex items-center justify-center font-mono text-xl rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* SIZE ARRAY */}
                        <div className="flex gap-1.5 items-end">
                            {st.sizeArr.map((val: number, idx: number) => {
                                if (idx >= st.n) return null;
                                let isUpdated = st.phase?.includes('union_add_size') && (st.targetRoot === idx);
                                
                                let boxBg = "bg-white text-slate-600 border-slate-300 shadow-sm";
                                if (isUpdated) boxBg = "bg-indigo-500 text-white border-indigo-600 scale-110 shadow-lg ring-2 ring-indigo-300 animate-in zoom-in font-black z-20";

                                return (
                                    <div key={`s-${idx}`} className="flex flex-col items-center relative group">
                                        <div className={`w-14 h-12 flex items-center justify-center font-mono text-base rounded border-2 transition-all duration-300 ${boxBg}`}>
                                            {val}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderRightSidebar = () => {
      return (
      <div className="flex flex-col gap-4 w-full h-full pb-8">
          
          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><ListTree size={12}/> Input Accounts (details)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-2 relative min-h-[100px] max-h-[170px] overflow-y-auto scrollbar-thin">
                  {(st.details || []).map((acc: string[], rowIdx: number) => {
                      let isActiveRow = st.phase?.includes('loop_accounts') || st.phase?.includes('loop_emails') || st.phase?.includes('ext_mail') || st.phase?.includes('check_map') || st.phase?.includes('put_map') || st.phase?.includes('union_') || st.phase?.includes('found_map');
                      isActiveRow = isActiveRow && st.i === rowIdx && !st.phase?.includes('ans_loop');

                      return (
                          <div key={`acc-${rowIdx}`} className={`flex items-center justify-between transition-all duration-300 ${isActiveRow ? 'bg-emerald-50/70 p-2 -m-2 rounded-xl border border-emerald-200 shadow-sm' : ''}`}>
                              <div className="flex flex-wrap gap-x-1 gap-y-2 items-center font-mono text-[10px] leading-tight flex-1">
                                  <span className="text-slate-400 font-sans text-sm">{"{"}</span>
                                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">"{acc[0]}"</span>
                                  {acc.slice(1).map((mail, colIdx) => {
                                      let j = colIdx + 1;
                                      let isProcessing = isActiveRow && st.j === j;
                                      let isProcessed = st.i > rowIdx || (st.i === rowIdx && st.j > j) || st.phase?.includes('merged') || st.phase?.includes('map_start') || st.phase?.includes('ans_loop');
                                      
                                      return (
                                          <React.Fragment key={`acc-m-${rowIdx}-${j}`}>
                                              <span className="text-slate-400">,</span>
                                              <span className={`relative transition-all ${isProcessing ? 'text-amber-500 font-black scale-110 bg-amber-400/20 px-1.5 py-0.5 rounded shadow-sm z-10' : (isProcessed ? 'text-emerald-600 opacity-90 font-bold' : 'text-slate-400')}`}>
                                                  "{mail}"
                                                  {isProcessed && <Check size={14} className="absolute -top-3 left-1/2 -translate-x-1/2 text-amber-500 stroke-[4] drop-shadow-md z-20 animate-in zoom-in" />}
                                              </span>
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 font-sans text-sm">{"}"}</span>
                              </div>
                              <ArrowRight size={16} className={`shrink-0 mx-2 ${isActiveRow ? 'text-emerald-500 animate-pulse' : 'text-slate-300'}`} />
                              <div className={`w-8 h-8 shrink-0 flex items-center justify-center font-bold font-mono text-sm rounded-lg transition-colors ${isActiveRow ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                  {rowIdx}
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded-lg border border-sky-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Activity size={12}/> HashMap (mapMailNode)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-3 gap-2 relative min-h-[100px] max-h-[160px] overflow-y-auto scrollbar-thin">
                  <div className="sticky top-0 left-0 right-0 flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest px-2 pb-2 pt-1 border-b border-slate-100 bg-white z-10 mb-2">
                      <span>KEY (EMAIL)</span>
                      <span>VAL (NODE)</span>
                  </div>
                  <div className="flex flex-col gap-1.5 transition-all duration-500 relative">
                      {st.mapMailNode === undefined ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : Object.entries(st.mapMailNode).map(([mail, nodeVal]: [string, any], i: number) => {
                          let isNewArrival = st.phase === 'put_map' && mail === st.mail;
                          let isEvaluating = (st.phase === 'check_map' || st.phase === 'found_map' || st.phase === 'iter_map_key' || st.phase === 'iter_map_find' || st.phase === 'union_call') && mail === st.mail;

                          let bgClass = 'bg-slate-50 border-slate-200 text-slate-600';
                          if (isNewArrival) bgClass = 'bg-emerald-500 border-emerald-600 text-white animate-in slide-in-from-right-8 z-10 scale-105 shadow-md';
                          else if (isEvaluating) bgClass = 'bg-amber-400 border-amber-500 text-white animate-pulse ring-4 ring-amber-200 scale-105 z-10 relative shadow-md font-black';

                          return (
                              <div key={`map-${i}-${mail}`} className={`px-3 py-2 flex items-center justify-between font-mono rounded-lg border shadow-sm transition-all duration-500 ${bgClass}`}>
                                  <span className={`text-xs ${isNewArrival || isEvaluating ? 'font-black' : ''}`}>{mail}</span>
                                  <span className="text-sm tracking-widest font-black bg-black/10 px-2 py-0.5 rounded shadow-inner">{nodeVal}</span>
                              </div>
                          )
                      })}
                      {st.mapMailNode !== undefined && Object.keys(st.mapMailNode).length === 0 && <span className="text-slate-300 font-mono italic text-sm w-full text-center mt-2">Map is empty</span>}
                  </div>
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><Inbox size={12}/> Merged Mail Array</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  {st.mergedMail === undefined || st.mergedMail.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Init...</span> : (st.mergedMail || []).map((mails: string[], nodeIdx: number) => {
                      let isActiveRow = st.phase?.includes('push_merged') && st.root === nodeIdx;

                      return (
                          <div key={`mmail-${nodeIdx}`} className={`flex items-start gap-3 transition-all duration-300 ${isActiveRow ? 'bg-indigo-50/50 p-2 -m-2 rounded-xl border border-indigo-100' : ''}`}>
                              <div className={`w-7 h-7 shrink-0 flex items-center justify-center font-bold font-mono text-xs rounded-lg transition-colors ${isActiveRow ? 'bg-indigo-500 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                                  {nodeIdx}
                              </div>
                              <ArrowRight size={14} className={`mt-1.5 shrink-0 ${isActiveRow ? 'text-indigo-400' : 'text-slate-300'}`} />
                              <div className="flex flex-wrap gap-x-2 gap-y-1.5 items-center font-mono text-[11px] leading-tight pt-1.5">
                                  <span className="text-slate-400 text-sm">[</span>
                                  {mails.length === 0 && <span className="text-slate-400 italic text-[10px]">empty</span>}
                                  {mails.map((mailObj, mIdx) => {
                                      let isNew = isActiveRow && mailObj === st.mail;
                                      return (
                                          <React.Fragment key={`mmail-m-${nodeIdx}-${mIdx}`}>
                                              <span className={`flex items-center gap-1 transition-all ${isNew ? 'text-indigo-700 font-black bg-indigo-100 px-1.5 py-0.5 rounded shadow-sm scale-110 animate-pulse' : 'text-slate-600'}`}>
                                                  {mailObj}
                                              </span>
                                              {mIdx < mails.length - 1 && <span className="text-slate-300 font-sans">,</span>}
                                          </React.Fragment>
                                      );
                                  })}
                                  <span className="text-slate-400 text-sm">]</span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>

          <div className="flex flex-col items-center w-full mt-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 mb-2 shadow-sm flex items-center gap-2 w-fit"><CheckCircle2 size={12}/> Final Answer (ans)</span>
              <div className="flex flex-col w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-4 gap-3 relative min-h-[100px] max-h-[140px] overflow-y-auto scrollbar-thin">
                  {st.ans === undefined || st.ans.length === 0 ? <span className="text-slate-300 font-mono italic text-xs py-2 text-center w-full">Awaiting Consolidation...</span> : (
                      st.ans.map((row: string[], idx: number) => {
                          let isNewlyPushed = (st.phase === 'push_ans' || st.phase === 'done') && idx === st.ans.length - 1;

                          return (
                              <div key={`ans-${idx}`} className={`flex flex-wrap gap-1.5 items-center font-mono text-[10px] leading-tight p-2.5 rounded-xl border transition-all duration-500 ${isNewlyPushed ? 'bg-emerald-50 border-emerald-300 shadow-md scale-[1.02] animate-in zoom-in' : 'bg-slate-50 border-slate-200'}`}>
                                  <span className="text-slate-400 font-sans text-sm">[</span>
                                  <span className="text-emerald-600 font-bold px-1 py-0.5 bg-emerald-100/50 rounded">"{row[0]}"</span>
                                  {row.slice(1).map((mail, mIdx) => (
                                      <React.Fragment key={`ans-m-${idx}-${mIdx}`}>
                                          <span className="text-slate-400">,</span>
                                          <span className="text-slate-600">"{mail}"</span>
                                      </React.Fragment>
                                  ))}
                                  <span className="text-slate-400 font-sans text-sm">]</span>
                              </div>
                          )
                      })
                  )}
              </div>
          </div>

      </div>
  );
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10">
            <div className={`p-4 rounded-2xl shadow-lg flex items-center justify-center bg-${themeColor}-500`}>
                {selectedOp.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">{selectedOp.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-2 font-mono uppercase tracking-widest">
                  <span className={`font-bold px-2 py-0.5 rounded bg-${themeColor}-50 text-${themeColor}-600`}>Graph Algorithm</span>
                  <span>•</span>
                  <span>HashMap Grouping & DSU</span>
              </div>
            </div>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner z-10 overflow-x-auto scrollbar-none items-center gap-2">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" themeColor={themeColor}/>
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" themeColor={themeColor}/>
            <TabButton active={activeTab === 'theory'} onClick={() => setActiveTab('theory')} icon={<Lightbulb size={16}/>} label="Theory" themeColor={themeColor}/>
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" themeColor={themeColor}/>
          </div>
        </div>

        {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                <section className="space-y-4">
                    <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter text-${themeColor}-600`}><Mail size={28}/> Accounts Merge</div>
                    <div className="text-sm md:text-base leading-relaxed max-w-4xl space-y-4 text-slate-700">
                        <p>Given a list of user accounts where the first element is their Name, followed by a list of emails, our goal is to merge accounts that definitively belong to the same person. If two accounts share <strong>even one</strong> identical email address, they are the same person!</p>
                        <p>This is beautifully solved using a <strong>Disjoint Set (Union-Find)</strong> combined with a <strong>HashMap</strong>. The HashMap maps <code>"email" &rarr; NodeID (Account Index)</code>.</p>
                        <p>As we scan the emails, if we see an email that isn't in our Map, we record it. But if we see an email that IS already in our Map, we know the current Account index and the mapped Account index are the exact same person. We instantly execute <code>ds.unionBySize(currentIndex, mappedIndex)</code>. Finally, we scoop up all emails, toss them into their ultimate parent's bucket, sort them alphabetically, and format the output!</p>
                    </div>
                </section>
                <section className="space-y-6">
                    <h4 className="font-black text-slate-800 text-xl tracking-tight mb-2">Sample Configurations</h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        <div className={`bg-slate-900 border-t-4 border-${themeColor}-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <TestTube className={`absolute -right-4 -bottom-4 text-${themeColor}-500/20`} size={120} />
                            <span className={`text-${themeColor}-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 1: The John Paradox</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Input:</strong><br/>John, J1@com, J2@com, J3@com<br/>John, J4@com<br/>raj, r1@com, r2@com<br/>John, J1@com, J5@com<br/>raj, r2@com, r3@com<br/>Mary, M1@com</span>
                            <span className="text-emerald-400 block mt-4 mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Output:</span>
                            <span className="text-slate-300 block mb-4 font-black relative z-10">[John, J1@com, J2@com, J3@com, J5@com]<br/>[John, J4@com]<br/>[raj, r1@com, r2@com, r3@com]<br/>[Mary, M1@com]</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Accounts 0 and 3 share "J1@com". They are merged. Accounts 2 and 4 share "r2@com", they are merged. John (Account 1) and Mary (Account 5) are isolated.</span>
                        </div>
                        <div className={`bg-slate-900 border-t-4 border-amber-500 p-6 rounded-2xl font-mono text-sm shadow-xl text-white flex flex-col relative overflow-hidden`}>
                            <AlertTriangle className={`absolute -right-4 -bottom-4 text-amber-500/20`} size={120} />
                            <span className={`text-amber-400 block mb-1 uppercase text-[10px] font-black tracking-widest relative z-10`}>Test Case 2: Chain Reaction</span>
                            <span className="text-slate-300 block mb-2 break-all relative z-10"><strong>Input:</strong><br/>Gabe, Gabe0, Gabe3, Gabe1<br/>Kevin, Kevin3, Kevin5, Kevin0<br/>Ethan, Ethan5, Ethan4, Ethan0<br/>Hanzo, Hanzo3, Hanzo1, Hanzo0<br/>Fernandez, Hanzo3, Hanzo1</span>
                            <span className="text-sky-400 block mt-auto mb-1 uppercase text-[10px] font-black tracking-widest relative z-10">Explanation:</span>
                            <span className="text-slate-400 text-xs relative z-10">Hanzo and Fernandez (Account 3 &amp; 4) share Hanzo3 and Hanzo1. They are secretly the same person! The algorithm will merge them into a single sorted account under the name of the ultimate root (Hanzo).</span>
                        </div>
                    </div>
                </section>
            </div>
        )}

        {activeTab === 'visualizer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-5 flex flex-col gap-0 bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden">
                <div className={`p-5 lg:p-7 shadow-xl border-b border-slate-700 transition-all duration-300 relative overflow-hidden shrink-0 ${st.isDone ? `bg-sky-900 border-sky-800` : 'bg-[#0f172a]'}`}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transition-transform group-hover:scale-110 duration-500">{selectedOp.icon}</div>
                    <div className="flex items-center justify-between mb-3 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                        <div className="flex items-center gap-2"><Activity size={14}/> <span>Trace Operations</span></div>
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-widest">Line {String(curStepData.line || 0)}</span>
                        </div>
                    </div>
                    {st.isDone ? (
                         <div className="animate-in zoom-in slide-in-from-left-4 duration-500">
                            <div className={`text-2xl font-black tracking-tight uppercase font-mono flex items-center gap-3 text-sky-400`}>
                                <CheckCircle2 size={24}/> ACCOUNTS MERGED SUCCESSFULLY
                            </div>
                            <p className="text-md leading-relaxed text-white mt-2 font-mono font-bold tracking-tight">
                                Algorithm concluded. The DSU accurately resolved the intersecting emails and grouped them under their absolute root accounts!
                            </p>
                         </div>
                    ) : (
                        <>
                            <div className={`text-lg md:text-xl font-black tracking-tight mb-2 uppercase font-mono leading-tight ${String(st.phase || '').includes('union') || String(st.phase || '').includes('push') ? 'text-sky-400' : (String(st.phase || '').includes('check') || String(st.phase || '').includes('eval') || String(st.phase || '').includes('map') ? 'text-amber-400' : (String(st.phase || '').includes('path_comp') || String(st.phase || '').includes('find') ? 'text-fuchsia-400' : 'text-white'))}`}>{String(curStepData.phase || "").replace(/_/g, ' ')}</div>
                            <p className="text-xs md:text-sm leading-relaxed text-slate-300 italic font-mono relative z-10 whitespace-pre-line border-t border-slate-700/50 pt-3">{String(curStepData.description || "")}</p>
                        </>
                    )}
                </div>
                <div className="bg-[#1e293b] px-5 py-3 border-y border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                  <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Solution.java</span>
                  <button onClick={handleCopy} className="hover:text-white transition-colors">{copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}</button>
                </div>
                <div ref={codeContainerRef} className="flex-1 p-4 font-mono text-[11px] leading-relaxed overflow-x-hidden overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pb-10 min-h-[400px] max-h-[600px]">
                  {selectedOp.code.split('\n').map((line, idx) => (
                    <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                  ))}
                </div>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4 z-20">
                    <div className="flex flex-wrap gap-3 pb-3 border-b border-slate-100 mb-2">
                        <button onClick={loadTestCase1} className={`px-4 py-2 bg-${themeColor}-50 text-${themeColor}-700 border border-${themeColor}-200 hover:bg-${themeColor}-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 1</button>
                        <button onClick={loadTestCase2} className={`px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2`}><TestTube size={14}/> Test Case 2</button>
                    </div>
                    <div className="grid grid-cols-1 items-end">
                        <div className="space-y-1.5 w-full">
                            <label className={`text-[9px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Accounts [Name, email1, email2...] (Rows by |)</label>
                            <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-${themeColor}-500 outline-none transition-all shadow-inner font-bold`} />
                        </div>
                    </div>
                    <div className="flex gap-4 shrink-0 justify-end items-center pt-2 border-t border-slate-100 mt-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 hidden md:inline-block">Shortcuts: &larr; &rarr;</span>
                        <div className="flex gap-2">
                            <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                            <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                            <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                            <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                            <button onClick={handlePrev} disabled={currentStep === 0} className="p-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 shadow-sm transition-colors ml-2"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} disabled={isLastStep || st.isDone} className={`px-8 py-3 bg-${themeColor}-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-${themeColor}-200 hover:bg-${themeColor}-600 transition-all flex items-center gap-2 group disabled:opacity-30`}>STEP <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 h-[650px] w-full">
                    <div className="flex-1 flex flex-col bg-slate-50 rounded-3xl border border-slate-200 shadow-inner overflow-hidden relative graph-canvas-area" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                        <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
                            {renderMainCanvas()}
                        </div>
                        
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
                    
                    <div className="bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                        {renderStateArrays()}
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-800 space-y-12">
                <div className="text-center space-y-4 max-w-3xl mx-auto mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-sky-100 text-sky-600 rounded-2xl mb-2">
                        <BookOpen size={40} />
                    </div>
                    <h3 className="font-black text-slate-800 text-3xl tracking-tight">Theory &amp; Intuition</h3>
                    <p className="text-slate-500 text-lg leading-relaxed">Bridging unstructured strings into structured graphs using HashMaps and DSU.</p>
                </div>
                <div className="space-y-8 relative z-10 max-w-4xl mx-auto">
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><MailPlus size={24} className="text-sky-500"/> Phase 1: Mapping &amp; Merging</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">The problem gives us accounts, but DSU only understands integers (node indices). We iterate through every email. If it's a new email, we store it in a <code>HashMap</code> as <code>"email" &rarr; currentAccountIndex</code>. If we encounter that exact email later in a <em>different</em> account, we know these two accounts are the same person! We immediately fire <code>ds.unionBySize(currentIndex, mapIndex)</code> to physically link the two components together.</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Inbox size={24} className="text-emerald-500"/> Phase 2: Consolidation</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed">After traversing everything, the DSU is fully structured. But we need to group the strings. We iterate through the keys in our <code>HashMap</code>. For each email, we find the <strong>Ultimate Root</strong> of the account it originally belonged to using <code>ds.findUPar(nodeIndex)</code>. We then push that email into a staging array <code>mergedMail[rootNode]</code>. This brilliantly collapses all scattered emails into a few master buckets!</p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-3"><Activity size={24} className="text-fuchsia-500"/> Complexity Analysis</h4>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Time Complexity: O(N log N)</strong><br/>Let N be the total number of emails across all accounts. Building the DSU and mapping takes $O(N \cdot \alpha(N))$. The consolidation phase takes $O(N \cdot \alpha(N))$. The final phase requires sorting the grouped emails alphabetically, which dominates the runtime at $O(N \log N)$. Overall, the time complexity is tightly bounded by sorting: $O(N \log N)$.</p>
                        <p className="mb-4 text-slate-600 leading-relaxed"><strong>Space Complexity: O(N)</strong><br/>The DSU arrays, the HashMap, and the intermediate <code>mergedMail</code> arrays all scale strictly linearly with the number of inputs. Therefore, it requires $O(N)$ auxiliary space.</p>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'interview' && (
            <div className="bg-white rounded-3xl p-10 md:p-12 border border-slate-200 shadow-sm animate-in fade-in duration-500 min-h-[600px] text-slate-700 space-y-12">
                 <div className={`bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group border border-slate-800`}>
                    <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none"><Trophy size={160} /></div>
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-widest text-white tracking-tight leading-tight flex items-center gap-4"><CheckSquare className="text-sky-400"/> Mock Interview Q&amp;A</h3>
                    <p className={`text-base text-slate-400 leading-relaxed italic max-w-3xl font-mono`}>"This is a quintessential system design translation problem. Expect questions on why you didn't just use strings directly inside the DSU."</p>
                </div>
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div className="bg-white border-2 border-slate-100 hover:border-emerald-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-emerald-500 mt-0.5"><Lightbulb size={24}/></span>
                            <span>Q1: "Could we build the Disjoint Set using the String emails directly instead of Account Integers?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "Technically yes, but it is highly inefficient."</p>
                            <p>If we made a `Map&lt;String, String&gt; parent`, every single `findUPar` operation would require string hashing and lookup, adding massive overhead. By mapping emails to integer indices ONCE, we allow the DSU to operate purely on raw integer arrays. Array lookups are absolute $O(1)$ constant time, making our path compression and unions infinitely faster!"</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-slate-100 hover:border-sky-200 transition-colors rounded-2xl p-8 shadow-sm">
                        <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-start gap-3 leading-tight">
                            <span className="text-sky-500 mt-0.5"><Scissors size={24}/></span>
                            <span>Q2: "What if two distinct people have the same name?"</span>
                        </h4>
                        <div className="pl-9 text-slate-600 space-y-3">
                            <p><strong>Answer:</strong> "The algorithm elegantly ignores the names entirely during processing."</p>
                            <p>The entire DSU logic runs exclusively on the actual email strings. The `Name` is purely cosmetic and retrieved only at the very end `temp.add(details.get(i).get(0))`. Because we pull the name from the Ultimate Root's index, it guarantees the correct name is bound to the correct merged bucket of emails, regardless of whether a totally isolated account shares that same cosmetic name."</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>

      {/* --- Theater Mode Portal --- */}
      {isFullscreen && (
          <div className="fixed inset-0 z-50 bg-[#0f172a] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
              {/* FIXED LEFT SIDEBAR */}
              <div className="w-[450px] lg:w-[500px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-50 shrink-0">
                  <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800 shadow-md shrink-0">
                      <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg text-white shadow-lg bg-${themeColor}-600 shadow-${themeColor}-900/50`}>
                              {selectedOp.icon}
                          </div>
                          <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Logic Analysis</span>
                      </div>
                  </div>
                  
                  {renderTraceOperationsBox()}

                  <div className="bg-[#1e293b] px-5 py-2 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center shrink-0">
                    <span className="font-bold uppercase text-[10px] text-white flex items-center gap-2"><Code2 size={12}/> Source Code</span>
                  </div>
                  <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 relative pb-32" id="fullscreen-code-container">
                        {selectedOp.code.split('\n').map((line, idx) => (
                            <CodeLineRenderer key={idx} num={idx + 1} code={line} active={curStepData.line === idx + 1} theme={themeColor}/>
                        ))}
                  </div>
              </div>

              {/* CENTER CANVAS AREA */}
              <div className="flex-1 relative bg-slate-50 flex flex-col overflow-hidden shadow-2xl z-30">
                  <div className="p-4 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm flex items-center justify-between z-20 shrink-0">
                      <div className="flex items-center gap-4 w-full max-w-3xl">
                          <label className={`text-[10px] font-black uppercase tracking-widest font-mono text-${themeColor}-600 pl-1`}>Accounts:</label>
                          <input type="text" value={inputStr} onChange={(e) => setInputStr(e.target.value)} className={`flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs focus:ring-2 outline-none transition-all shadow-inner focus:ring-${themeColor}-500 font-bold`} />
                      </div>
                      <div className="flex gap-2 shrink-0 ml-4">
                          <button onClick={zoomIn} title="Zoom In" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomIn size={20}/></button>
                          <button onClick={zoomOut} title="Zoom Out" className={`p-3 bg-slate-100 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-colors`}><ZoomOut size={20}/></button>
                          <button onClick={handleReset} title="Restart Simulation" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><RotateCcw size={20}/></button>
                          <button onClick={toggleFullscreen} title="Close Full Screen" className={`p-3 text-slate-600 hover:text-${themeColor}-600 rounded-xl hover:bg-${themeColor}-50 transition-all`}><Maximize size={20}/></button>
                      </div>
                  </div>

                  <div className="graph-canvas-area flex-1 relative cursor-grab active:cursor-grabbing bg-[linear-gradient(to_right,#cbd5e120_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e120_1px,transparent_1px)] bg-[size:30px_30px] overflow-hidden flex items-center justify-center" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                      <div className="transition-transform duration-300 w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'top left' }}>
                          {renderMainCanvas()}
                      </div>
                      
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
                  
                  <div className="bg-slate-50 border-t border-slate-200 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.1)] z-20 shrink-0">
                      {renderStateArrays()}
                  </div>
              </div>

              {/* RIGHT SIDEBAR */}
              <div className="w-[320px] bg-slate-50 border-l border-slate-200 p-5 flex flex-col overflow-y-auto shadow-2xl z-40 shrink-0">
                  {renderRightSidebar()}
              </div>

          </div>
      )}
    </div>
  );
}