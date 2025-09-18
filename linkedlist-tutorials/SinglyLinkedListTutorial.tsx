import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity, BookOpen, Code2, Check, Copy, Trophy, Target, 
  AlertCircle, Layers, FileText, ArrowRight, ArrowDown, ArrowUp,
  Link, GitCommit, Search, Plus, Trash2, Cpu, RotateCcw, 
  MonitorPlay, ChevronLeft, ChevronRight, Network, Database, X, 
  LayoutGrid, Grid, Hash, FolderTree, History, Image as ImageIcon, 
  CalendarClock, Calculator, Undo, Type, Smartphone, Terminal,
  ZoomIn, ZoomOut, Maximize, Minimize
} from 'lucide-react';

// Component interfaces
interface PointerLabelProps {
  label: string;
  color: string;
  position: string;
  active?: boolean;
  offset?: number;
  strikethrough?: boolean;
}

interface StatCardProps {
  label: string;
  val: string;
  color: string;
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface CodeLineRendererProps {
  num: number;
  code: string;
  active: boolean;
  theme?: string;
}

const OPERATIONS = {
  manualCreate: {
    id: 'manualCreate',
    title: 'Manual Create (Java)',
    icon: <Code2 size={16} />,
    complexity: 'Time: O(N)',
    code: `class Node {
    int data;
    Node next;

    Node(int new_data) {
        this.data = new_data;
        this.next = null;
    }
}

public class Main {
    public static void main(String[] args) {
        // 1. Allocate & head pointer
        Node head = new Node(10);
        
        // 2. Link second node
        head.next = new Node(20);
        
        // 3. Link third node
        head.next.next = new Node(30);
        
        // 4. Print list
        Node temp = head;
        while (temp != null) {
            System.out.print(temp.data + " ");
            temp = temp.next;
        }
    }
}`,
    desc: "Line-by-line creation of a linked list. Notice how memory is allocated for each node individually and explicitly chained together using the precise memory address of the next node."
  },
  insertHead: {
    id: 'insertHead',
    title: 'Insert at Head',
    icon: <Plus size={16} />,
    complexity: 'Time: O(1)',
    code: `public void insertHead(int val) {
    // 1. Create the new node
    Node newNode = new Node(val);
    
    // 2. Point new node's next to current head
    newNode.next = head;
    
    // 3. Update head to be the new node
    head = newNode;
}`,
    desc: "Adding a node to the front is O(1) because we immediately know where the head is. We simply create a node, link it to the current head, and update the head pointer."
  },
  insertTail: {
    id: 'insertTail',
    title: 'Insert at Tail',
    icon: <Link size={16} />,
    complexity: 'Time: O(N)',
    code: `public void insertTail(int val) {
    Node newNode = new Node(val);
    
    // 1. If list is empty, make it the head
    if (head == null) {
        head = newNode;
        return;
    }
    
    // 2. Traverse to the last node
    Node curr = head;
    while (curr.next != null) {
        curr = curr.next;
    }
    
    // 3. Link the last node to the new node
    curr.next = newNode;
}`,
    desc: "To insert at the end of a standard singly linked list, we must traverse from the head to the very last node (where next is null), taking O(N) time."
  },
  deleteNode: {
    id: 'deleteNode',
    title: 'Delete by Value',
    icon: <Trash2 size={16} />,
    complexity: 'Time: O(N)',
    code: `public void deleteNode(int key) {
    if (head == null) return;
    
    // 1. If head holds the key, move head
    if (head.data == key) {
        head = head.next;
        return;
    }
    
    // 2. Search for the key
    Node prev = null;
    Node curr = head;
    while (curr != null && curr.data != key) {
        prev = curr;
        curr = curr.next;
    }
    
    // 3. If key was not present
    if (curr == null) return;
    
    // 4. Unlink the node (Bypass)
    prev.next = curr.next;
}`,
    desc: "Deletion requires a 'prev' pointer so that once we find the node to delete ('curr'), we can bypass it by linking 'prev.next' to 'curr.next'. The Garbage Collector handles the rest."
  },
  search: {
    id: 'search',
    title: 'Search Value',
    icon: <Search size={16} />,
    complexity: 'Time: O(N)',
    code: `public boolean search(int key) {
    // 1. Start from the head
    Node curr = head;
    
    // 2. Traverse until end of list
    while (curr != null) {
        // 3. If found, return true
        if (curr.data == key) return true;
        curr = curr.next;
    }
    
    // 4. Not found
    return false;
}`,
    desc: "Unlike arrays which allow O(1) random access, linked lists require sequential access. We must traverse node by node to find a specific value."
  }
};

const APPLICATIONS = [
  { category: 'Polynomial Arithmetic', desc: 'Used to represent and evaluate polynomials (each node stores coefficient and exponent)', icon: <Activity size={28}/>, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200' },
  { category: 'Sparse Matrices', desc: 'Efficiently represent sparse matrices (linked lists store only non-zero values).', icon: <Grid size={28}/>, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { category: 'Memory Management in OS', desc: 'Free blocks of memory (heap management) are often tracked using linked lists.', icon: <Cpu size={28}/>, color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  { category: 'Hash Chaining in Hash Tables', desc: 'Used to handle collisions in hash maps (each bucket is a linked list).', icon: <Hash size={28}/>, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  { category: 'File System Management', desc: 'Directory structures and file allocation tables can use linked lists.', icon: <FolderTree size={28}/>, color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300' },
  { category: 'Browser History Navigation', desc: '"Back" and "Forward" buttons use a doubly linked list.', icon: <History size={28}/>, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { category: 'Image Slideshow / Carousel', desc: 'Next and previous navigation is naturally implemented with circular linked lists.', icon: <ImageIcon size={28}/>, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  { category: 'Job Scheduling / CPU Scheduling', desc: 'Processes waiting for CPU time are often maintained in queues implemented via linked lists.', icon: <CalendarClock size={28}/>, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200' },
  { category: 'Big Integer Arithmetic', desc: 'Very large numbers (beyond primitive data types) can be stored digit-by-digit in linked lists.', icon: <Calculator size={28}/>, color: 'text-fuchsia-500', bg: 'bg-fuchsia-100', border: 'border-fuchsia-300' },
  { category: 'Undo/Redo in Editors', desc: 'Each state of the document can be stored as a linked list node.', icon: <Undo size={28}/>, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { category: 'Text Editors', desc: 'Sometimes implement text as a linked structure (rope / gap buffer, variations).', icon: <Type size={28}/>, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { category: 'Social Media Feeds', desc: 'Linked structures help in representing "next post" relationships dynamically.', icon: <Smartphone size={28}/>, color: 'text-sky-500', bg: 'bg-sky-100', border: 'border-sky-300' },
];

const OverviewTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6 text-emerald-600">
        <Cpu size={28} />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Singly Linked List Data Structure</h2>
      </div>
      
      <div className="prose prose-slate max-w-none text-slate-600 space-y-6">
        <p className="text-lg leading-relaxed">
          A <strong>Linked List</strong> is a linear data structure, in which elements are not stored at contiguous memory locations. 
          Instead, the elements are linked using pointers. It forms a chain of nodes where each node contains data and a reference (or link) to the next node in the sequence.
        </p>
        
        <div className="bg-slate-900 text-slate-300 p-8 rounded-3xl border border-slate-800 shadow-xl my-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <GitCommit size={200} />
          </div>
          <h3 className="text-emerald-400 font-black uppercase tracking-widest text-sm mb-4">Anatomy of a Node</h3>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex items-stretch h-24 border-2 border-emerald-500/30 rounded-xl overflow-hidden shadow-lg shadow-emerald-900/20 bg-slate-800">
              <div className="w-24 flex items-center justify-center border-r-2 border-emerald-500/30 font-mono text-2xl font-black text-white">42</div>
              <div className="w-24 flex flex-col items-center justify-center relative bg-emerald-900/20 px-2 text-center">
                <span className="text-[8px] font-black uppercase text-emerald-500 mb-1">Next Addr</span>
                <span className="font-mono text-xs text-emerald-300">0x2F4</span>
                <ArrowRight size={24} className="text-emerald-400 absolute -right-4 translate-x-full" />
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-white rounded-full block"/> 
                <strong>Data (42):</strong> The actual value stored.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-400 rounded-full block"/> 
                <strong>Next Pointer:</strong> The exact memory address (e.g. 0x2F4) of the next node.
              </p>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 border-b-2 border-emerald-100 pb-2 inline-block">Advantages over Arrays</h3>
            <ul className="space-y-3 list-none m-0 p-0 text-sm">
              <li className="flex items-start gap-2">
                <Check size={18} className="text-emerald-500 shrink-0 mt-0.5"/> 
                <strong>Dynamic Size:</strong> Can grow or shrink at runtime. No need to pre-allocate memory.
              </li>
              <li className="flex items-start gap-2">
                <Check size={18} className="text-emerald-500 shrink-0 mt-0.5"/> 
                <strong>Efficient Insert/Delete:</strong> Operations at the head (or if a pointer to the node is known) are O(1). No shifting elements required.
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 border-b-2 border-rose-100 pb-2 inline-block">Disadvantages</h3>
            <ul className="space-y-3 list-none m-0 p-0 text-sm">
              <li className="flex items-start gap-2">
                <X size={18} className="text-rose-500 shrink-0 mt-0.5"/> 
                <strong>No Random Access:</strong> You cannot access the i-th element in O(1) time. You must traverse from the head.
              </li>
              <li className="flex items-start gap-2">
                <X size={18} className="text-rose-500 shrink-0 mt-0.5"/> 
                <strong>Extra Memory:</strong> Every node requires extra memory for the pointer/reference.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ApplicationsTab = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-in fade-in duration-500 min-h-[600px]">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-6 text-indigo-600">
        <LayoutGrid size={28} />
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Real World Applications</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {APPLICATIONS.map((app, idx) => (
          <div key={idx} className={`p-6 rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${app.bg} ${app.border} flex flex-col gap-4`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border ${app.border} ${app.color}`}>
              {app.icon}
            </div>
            <div>
              <h3 className={`font-black text-lg mb-2 text-slate-800 tracking-tight leading-tight`}>{app.category}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{app.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Advanced Coordinate Math for 2D Memory Grid (Scattered Memory look)
const generateNode = (val, id, nextId = null) => {
    // We space nodes out significantly to emphasize non-contiguous memory
    // and make use of the infinite pan/zoom canvas.
    const col = id % 3;
    const row = Math.floor(id / 3);
    
    // Scattered layout with wide gaps
    const x = 120 + col * 260; 
    const y = 100 + row * 180 + (col % 2 === 1 ? 40 : 0); // slight stagger

    return {
        id: id,
        val: val,
        addr: '0x' + (100 + (id * 32)).toString(16).toUpperCase().padStart(3, '0'),
        nextId: nextId,
        x, y
    };
};

const SinglyLinkedListTutorial = () => {
  const [activeTab, setActiveTab] = useState('visualizer');
  const [selectedOpId, setSelectedOpId] = useState('manualCreate');
  const [inputValue, setInputValue] = useState('99');
  
  // Base State Configuration
  const [baseList, setBaseList] = useState([]);
  const [baseHead, setBaseHead] = useState(null);
  const [nodeCounter, setNodeCounter] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pan and Zoom State for Infinite Canvas
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const selectedOp = OPERATIONS[selectedOpId];

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Initialization
  useEffect(() => {
      if (selectedOpId === 'manualCreate') {
          setBaseList([]);
          setBaseHead(null);
          setNodeCounter(0);
      } else {
          setBaseList([
              generateNode(10, 0, 1),
              generateNode(20, 1, 2),
              generateNode(30, 2, null)
          ]);
          setBaseHead(0);
          setNodeCounter(3);
      }
      setCurrentStep(0);
      setPan({ x: 0, y: 0 });
      setZoom(1);
  }, [selectedOpId]);

  const trace = useMemo(() => {
    const steps = [];
    let list = baseList.map(n => ({...n}));
    let headId = baseHead;
    let nextIdAlloc = nodeCounter;
    let deletedSet = new Set();
    
    let val = parseInt(inputValue);
    if (isNaN(val)) val = 99;

    const updateNextId = (targetId, newNextId) => {
        let node = list.find(n => n.id === targetId);
        if(node) node.nextId = newNextId;
    };

    const addStep = (phase, desc, line, stateProps) => {
      steps.push({
        phase, 
        description: desc, 
        line, 
        state: { 
            list: list.map(n=>({...n})), 
            headId, 
            deletedSet: new Set(deletedSet),
            ...stateProps 
        }
      });
    };

    if (selectedOpId === 'manualCreate') {
      addStep("Main execution", "Entering main method. No memory allocated yet.", 11, { activeLinkId: null });
      
      let n1 = generateNode(10, nextIdAlloc++);
      list.push(n1);
      headId = n1.id;
      addStep("Allocate Head", `Node head = new Node(10); Allocated memory at ${n1.addr}.`, 13, { activeNode: n1.id });
      
      let n2 = generateNode(20, nextIdAlloc++);
      list.push(n2);
      addStep("Allocate Node 2", `new Node(20); Allocated memory at ${n2.addr}.`, 16, { activeNode: n2.id });
      updateNextId(n1.id, n2.id);
      addStep("Link Node 2", `head.next = Node(20); Linked head to the new node.`, 16, { activeLinkId: n1.id });
      
      let n3 = generateNode(30, nextIdAlloc++);
      list.push(n3);
      addStep("Allocate Node 3", `new Node(30); Allocated memory at ${n3.addr}.`, 19, { activeNode: n3.id });
      updateNextId(n2.id, n3.id);
      addStep("Link Node 3", `head.next.next = Node(30); Linked chain forward.`, 19, { activeLinkId: n2.id });
      
      let n4 = generateNode(40, nextIdAlloc++);
      list.push(n4);
      addStep("Allocate Node 4", `new Node(40); Allocated memory at ${n4.addr}.`, 22, { activeNode: n4.id });
      updateNextId(n3.id, n4.id);
      addStep("Link Node 4", `head.next.next.next = Node(40); Chain complete.`, 22, { activeLinkId: n3.id });
      
      let tempId = headId;
      addStep("Initialize Temp", `Node temp = head; Starting traversal.`, 25, { tempId });
      
      let out = [];
      while (tempId !== null) {
          let node = list.find(n=>n.id===tempId);
          addStep("Loop Condition", `temp != null. Evaluates to true.`, 26, { tempId, output: [...out] });
          out.push(node.val);
          addStep("Print Value", `System.out.print(temp.data); Printing ${node.val}.`, 27, { tempId, output: [...out] });
          
          tempId = node.nextId;
          addStep("Advance Temp", `temp = temp.next; Moving pointer to ${tempId !== null ? list.find(n=>n.id===tempId).addr : 'null'}.`, 28, { tempId, output: [...out] });
      }
      
      addStep("End Traversal", "temp is now null. Loop terminates.", 26, { tempId: null, output: [...out], isSuccess: true });
    }
    else if (selectedOpId === 'insertHead') {
      addStep("Method Call", `insertHead(${val}) called.`, 1, { });
      
      let newNode = generateNode(val, nextIdAlloc++);
      list.push(newNode);
      addStep("Create Node", `Node newNode = new Node(${val}); Allocated block at ${newNode.addr}.`, 3, { activeNode: newNode.id });
      
      updateNextId(newNode.id, headId);
      addStep("Link Node", `newNode.next = head; Pointed new node to the old head.`, 6, { activeNode: newNode.id, activeLinkId: newNode.id });
      
      headId = newNode.id;
      addStep("Update Head", `head = newNode; Officially shifted list entry point!`, 9, { isSuccess: true });
    } 
    else if (selectedOpId === 'insertTail') {
      addStep("Method Call", `insertTail(${val}) called.`, 1, {});
      
      let newNode = generateNode(val, nextIdAlloc++);
      list.push(newNode);
      addStep("Create Node", `Node newNode = new Node(${val}); Allocated block at ${newNode.addr}.`, 2, { activeNode: newNode.id });
      
      addStep("Empty Check", `if (head == null)`, 5, { activeNode: newNode.id });
      if (headId === null) {
        headId = newNode.id;
        addStep("Set Head", `List was empty. Made new node the head.`, 6, { isSuccess: true });
        return steps;
      } 
      
      let currId = headId;
      addStep("Initialize Traversal", `Node curr = head; Starting at ${list.find(n=>n.id===currId).addr}.`, 11, { currId, activeNode: newNode.id });
        
      while (true) {
         let currNode = list.find(n=>n.id===currId);
         addStep("Check Next", `while (curr.next != null)`, 12, { currId, activeNode: newNode.id });
         if (currNode.nextId === null) break;
         
         currId = currNode.nextId;
         addStep("Advance Pointer", `curr = curr.next; Moving forward.`, 13, { currId, activeNode: newNode.id });
      }
        
      addStep("Found Tail", `curr.next is null! We found the last node.`, 12, { currId, activeNode: newNode.id });
      
      updateNextId(currId, newNode.id);
      addStep("Link Node", `curr.next = newNode; Spliced the new node onto the end!`, 17, { currId, activeNode: newNode.id, activeLinkId: currId, isSuccess: true });
    }
    else if (selectedOpId === 'deleteNode') {
      addStep("Method Call", `deleteNode(${val}) called.`, 1, {});
      addStep("Empty Check", `if (head == null)`, 2, {});
      
      if (headId === null) {
        addStep("Empty List", `List is empty. Nothing to delete.`, 2, { isSuccess: true });
        return steps;
      } 

      addStep("Check Head", `if (head.data == key)`, 5, { currId: headId });
      let headNode = list.find(n=>n.id===headId);
      
      if (headNode.val === val) {
        deletedSet.add(headId);
        headId = headNode.nextId;
        addStep("Delete Head", `head = head.next; Removed head node.`, 6, { isSuccess: true });
        return steps;
      } 

      let prevId = null;
      let currId = headId;
      addStep("Initialize Pointers", `Node prev = null; Node curr = head;`, 11, { prevId, currId });
        
      while (currId !== null) {
          let currNode = list.find(n=>n.id===currId);
          addStep("Loop Condition", `curr != null && curr.data != key. Checking if ${currNode.val} == ${val}.`, 13, { prevId, currId, isComparing: true });
          
          if (currNode.val === val) break;
          
          prevId = currId;
          currId = currNode.nextId;
          addStep("Advance", `prev = curr; curr = curr.next;`, 14, { prevId, currId });
      }
        
      addStep("Null Check", `if (curr == null)`, 19, { prevId, currId });
      if (currId === null) {
          addStep("Not Found", `Key not present in list. Return.`, 19, { prevId, currId, isSuccess: true, notFound: true });
          return steps;
      }

      let targetNode = list.find(n=>n.id===currId);
      updateNextId(prevId, targetNode.nextId);
      deletedSet.add(currId);
      
      addStep("Bypass Node", `prev.next = curr.next; Successfully unlinked the target node from the list!`, 22, { prevId, currId, activeLinkId: prevId, isSuccess: true });
    }
    else if (selectedOpId === 'search') {
      addStep("Method Call", `search(${val}) called.`, 1, {});
      
      let currId = headId;
      addStep("Initialize Pointer", `Node curr = head;`, 3, { currId });
      
      while (currId !== null) {
        let currNode = list.find(n=>n.id===currId);
        addStep("Loop Condition", `while (curr != null) -> true`, 6, { currId });
        addStep("Check Data", `if (curr.data == key) -> (${currNode.val} == ${val}?)`, 8, { currId, isComparing: true });
        
        if (currNode.val === val) {
            addStep("Match Found!", `Return true.`, 8, { currId, isSuccess: true });
            return steps;
        }
        
        currId = currNode.nextId;
        addStep("Advance", `curr = curr.next;`, 9, { currId });
      }
      
      addStep("End of List", `curr is null. Loop terminates.`, 6, { currId: null });
      addStep("Not Found", `return false;`, 13, { currId: null, notFound: true, isSuccess: true });
    }

    if (steps.length === 0) steps.push({ phase: 'Ready', description: 'Click play to simulate.', line: 1, state: { list: baseList, headId: baseHead } });
    return steps;
  }, [baseList, baseHead, selectedOpId, inputValue, nodeCounter]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, trace.length - 1));
  const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
  
  const handleApply = () => {
    const finalState = trace[trace.length - 1].state;
    if (finalState && finalState.list && finalState.isSuccess && !finalState.notFound) {
      setBaseList([...finalState.list]);
      setBaseHead(finalState.headId);
      const maxId = finalState.list.reduce((max, node) => Math.max(max, node.id), -1);
      setNodeCounter(maxId + 1);
    }
    setCurrentStep(0);
  };

  const handleReset = () => {
    if (selectedOpId === 'manualCreate') {
        setBaseList([]);
        setBaseHead(null);
        setNodeCounter(0);
    } else {
        setBaseList([
            generateNode(10, 0, 1),
            generateNode(20, 1, 2),
            generateNode(30, 2, null)
        ]);
        setBaseHead(0);
        setNodeCounter(3);
    }
    setCurrentStep(0);
    setPan({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleCopy = () => { 
    navigator.clipboard.writeText(selectedOp.code); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  };

  // Pan & Zoom Event Handlers
  const handlePointerDown = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return; // ignore controls
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = () => setIsDragging(false);

  const zoomIn = () => setZoom(z => Math.min(z + 0.2, 2));
  const zoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const resetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  
  const cur = trace[currentStep] || trace[0] || { state: { list: baseList, headId: baseHead, deletedSet: new Set() } };
  const state = cur.state || { list: baseList, headId: baseHead, deletedSet: new Set() };
  
  const { isSuccess, isComparing, headId, currId, prevId, tempId, activeNode, activeLinkId, notFound, deletedSet } = state;

  // SVG Drawing function tailored for physically spaced out nodes
  const renderSvgArrows = () => {
    return state.list.map((node) => {
        if (node.nextId === null) return null;
        
        const target = state.list.find(n => n.id === node.nextId);
        if (!target) return null;
        
        // Don't draw arrows originating FROM a deleted node
        if (deletedSet && deletedSet.has(node.id)) return null;

        // Start from NEXT box (Node width: 112px w-28. NEXT box rightmost 40%. Center is approx ~90px).
        const startX = node.x + 92; 
        const startY = node.y + 28; // height is 56 (h-14)

        // End at left middle of the target Node
        const endX = target.x - 6;
        const endY = target.y + 28;

        const isActive = activeLinkId === node.id;
        const strokeColor = isActive ? '#10b981' : '#cbd5e1'; // emerald-500 or slate-300
        const strokeWidth = isActive ? 3 : 2;
        const strokeOpacity = isActive ? 1 : 0.6;
        const marker = isActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-default)';

        let pathD = '';
        const diffX = endX - startX;
        const diffY = endY - startY;

        if (Math.abs(diffY) > 30) {
            // Target is on a different row (Wrap around logic - smooth S-Curve)
            pathD = `M ${startX},${startY} C ${startX + 80},${startY + 40} ${endX - 80},${endY - 40} ${endX},${endY}`;
        } else {
            // Target is on the SAME row
            if (diffX < 0) {
                 // Strictly backward (Arc UP over nodes)
                 pathD = `M ${startX},${startY} C ${startX + 30},${startY - 80} ${endX - 30},${endY - 80} ${endX},${endY}`;
            } else if (diffX > 200) {
                 // Forward jump over a node (Arc DOWN under nodes)
                 pathD = `M ${startX},${startY} C ${startX + 50},${startY + 80} ${endX - 50},${endY + 80} ${endX},${endY}`;
            } else {
                 // Adjacent Right (Direct link)
                 pathD = `M ${startX},${startY} C ${startX + 40},${startY} ${endX - 40},${endY} ${endX},${endY}`;
            }
        }

        return (
            <path 
                key={`link-${node.id}-${target.id}`}
                d={pathD} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeOpacity={strokeOpacity}
                markerEnd={marker} 
                className="transition-all duration-500 ease-in-out" 
            />
        );
    });
  };

  return (
    <div className={`bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen ${isFullscreen ? 'overflow-hidden' : ''}`}>
      <div className={`max-w-7xl w-full space-y-6 ${isFullscreen ? 'hidden' : ''}`}>
        {/* Header Component */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Layers size={100} />
          </div>
          
          <div className="flex items-center gap-5 z-10">
            <div className="bg-emerald-600 p-4 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center">
              <GitCommit className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Singly Linked List</h1>
              <div className="flex items-center gap-2 text-slate-500 text-xs mt-1.5 font-mono">
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded tracking-widest uppercase">Memory Simulator</span>
                <span className="opacity-60">•</span>
                <span className="font-bold uppercase">Data Structures</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto w-full md:w-auto z-10">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<FileText size={16}/>} label="Overview" />
            <TabButton active={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<LayoutGrid size={16}/>} label="Applications" />
            <TabButton active={activeTab === 'visualizer'} onClick={() => setActiveTab('visualizer')} icon={<MonitorPlay size={16}/>} label="Simulator" />
            <TabButton active={activeTab === 'learn'} onClick={() => setActiveTab('learn')} icon={<BookOpen size={16}/>} label="Memory Layout" />
            <TabButton active={activeTab === 'interview'} onClick={() => setActiveTab('interview')} icon={<Trophy size={16}/>} label="Interview" />
          </div>
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'applications' && <ApplicationsTab />}
        
        {activeTab === 'visualizer' && (
          <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Col: Approaches & Code (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Operations Selector */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {Object.values(OPERATIONS).map((op) => {
                    const isSelected = selectedOpId === op.id;
                    return (
                      <button 
                        key={op.id}
                        onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }}
                        className={`px-2 py-3 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center gap-2 shadow-sm ${
                          isSelected 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-emerald-200 scale-[1.02]' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-full gap-2">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {op.icon}
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-tight leading-none truncate flex-1 text-left">{op.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="bg-[#0f172a] rounded-3xl h-[440px] overflow-hidden flex flex-col relative shadow-2xl border border-slate-800">
                  <div className="bg-[#1e293b] px-5 py-3 border-b border-slate-700 text-xs text-slate-400 font-mono flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Code2 size={14} className="text-emerald-400" />
                      <span className="font-bold uppercase text-[10px] text-white">
                        {selectedOpId === 'manualCreate' ? 'Main.java' : 'LinkedList.java'}
                      </span>
                    </div>
                    <button onClick={handleCopy} className="hover:text-white transition-colors">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  <div className="p-4 font-mono text-[11px] leading-relaxed overflow-auto relative scrollbar-thin scrollbar-thumb-slate-700">
                    {/* Highlighter Bar */}
                    {cur.line && (
                      <div 
                        className={`absolute left-0 right-0 border-l-4 transition-all duration-300 z-0 ${
                          isSuccess ? 'bg-emerald-500/20 border-emerald-500' : 
                          isComparing ? 'bg-amber-500/15 border-amber-500' : 
                          'bg-emerald-500/15 border-emerald-500'
                        }`} 
                        style={{ 
                          top: `${((cur.line - 1) * 16.5) + 16}px`, 
                          height: '16.5px' 
                        }} 
                      />
                    )}
                    
                    {selectedOp.code.split('\n').map((line, idx) => (
                      <CodeLineRenderer 
                        key={idx} 
                        num={idx + 1} 
                        code={line} 
                        active={cur.line === idx + 1} 
                        theme="emerald" 
                      />
                    ))}
                  </div>
                </div>
                
                {/* Method Description */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2">
                    <BookOpen size={14} className="text-emerald-600"/> Concept
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed italic">{selectedOp.desc}</p>
                </div>
              </div>

              {/* Right Col: Simulation Arena & Controls (7/12) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col">
                {/* Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6 items-end">
                  <div className="flex-1 space-y-1.5 w-full">
                    <label className="text-[10px] font-black text-emerald-600 uppercase block pl-1 tracking-widest font-mono">Input Value</label>
                    <input 
                      type="number" 
                      disabled={selectedOpId === 'manualCreate'}
                      value={selectedOpId === 'manualCreate' ? '' : inputValue} 
                      onChange={(e) => { setInputValue(e.target.value); setCurrentStep(0); }} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-inner disabled:opacity-50" 
                      placeholder={selectedOpId === 'manualCreate' ? "Fixed Example" : "e.g. 99"} 
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto mt-2 md:mt-0">
                    <button 
                      onClick={handleReset} 
                      title="Reset state" 
                      className="px-4 py-3 bg-slate-100 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm"
                    >
                      <RotateCcw size={16}/>
                    </button>
                    <button 
                      onClick={handlePrev} 
                      disabled={currentStep === 0} 
                      className="px-5 py-3 bg-slate-100 rounded-xl text-slate-700 disabled:opacity-30 hover:bg-slate-200 transition-colors flex items-center justify-center shadow-sm"
                    >
                      <ChevronLeft size={16}/>
                    </button>
                    <button 
                      onClick={handleNext} 
                      disabled={currentStep === trace.length - 1} 
                      className="flex-1 sm:w-32 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-30 shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      Step <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>

                {/* Action Log / Status */}
                <div className={`rounded-3xl p-7 shadow-2xl border transition-all duration-300 min-h-[140px] relative overflow-hidden group shrink-0 ${
                  isComparing ? 'bg-amber-900 border-amber-800' : 
                  isSuccess ? (notFound ? 'bg-rose-900 border-rose-800' : 'bg-emerald-900 border-emerald-800') : 
                  'bg-slate-900 border-slate-800'
                }`}>
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                    <Activity size={100}/>
                  </div>
                  
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <Activity size={14} className={
                        isComparing ? "text-amber-400" : 
                        isSuccess ? (notFound ? "text-rose-400" : "text-emerald-400") : 
                        "text-emerald-400"
                      }/>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Execution Log</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase font-mono tracking-tighter ${
                      isComparing ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 
                      isSuccess ? (notFound ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30') : 
                      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    } border`}>
                      Line {cur.line}
                    </div>
                  </div>
                  
                  <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white flex items-center gap-3 relative z-10">
                    {cur.phase}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-300 border-t border-slate-800/50 pt-3 italic font-mono whitespace-pre-line relative z-10">
                    {cur.description}
                  </p>
                </div>

                {/* INTERACTIVE INFINITE CANVAS WRAPPER */}
                <div className="relative flex-1 min-h-[460px] rounded-[2.5rem] border border-slate-200 shadow-inner overflow-hidden group">
                  
                  {/* Fixed Canvas Header */}
                  <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start pointer-events-none z-40">
                     <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl backdrop-blur shadow-sm border border-slate-200">
                        <Network size={16} className="text-emerald-500"/>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest font-mono">Interactive Memory Canvas</span>
                            <span className="text-[9px] text-slate-500 font-mono">Drag to pan • Use buttons to zoom</span>
                        </div>
                     </div>
                     
                     {currentStep === trace.length - 1 && isSuccess && selectedOpId !== 'manualCreate' && !notFound && (
                        <button 
                          onClick={handleApply} 
                          className="text-[10px] font-black bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 uppercase tracking-widest flex items-center gap-2 transition-colors shadow-lg pointer-events-auto"
                        >
                          <Check size={14}/> Confirm Mutation
                        </button>
                     )}
                  </div>

                  {/* Fixed Console Output (No longer overlapping randomly) */}
                  {state.output && (
                    <div className="absolute top-20 right-6 bg-slate-900 text-emerald-400 font-mono text-[10px] p-4 rounded-2xl border border-slate-700 w-48 shadow-2xl z-40 pointer-events-auto animate-in slide-in-from-right-8">
                      <div className="text-slate-500 mb-3 border-b border-slate-700 pb-2 flex items-center justify-between">
                        <span className="uppercase tracking-widest font-black text-[9px]">Console Output</span>
                        <Terminal size={12}/>
                      </div>
                      <div className="break-words font-black text-sm tracking-widest leading-relaxed">
                        {state.output.join(' ')}
                        <span className="animate-pulse ml-1 text-emerald-600">_</span>
                      </div>
                    </div>
                  )}

                  {/* Fixed Zoom Controls */}
                  <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-40 pointer-events-auto bg-white/90 p-2 rounded-2xl shadow-lg border border-slate-200 backdrop-blur">
                      <button onClick={zoomIn} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomIn size={18}/></button>
                      <button onClick={zoomOut} className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><ZoomOut size={18}/></button>
                      <button onClick={toggleFullscreen} title="Fullscreen Mode" className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Maximize size={18}/></button>
                  </div>

                  {/* Panning Container */}
                  <div 
                    className="absolute inset-0 w-full h-full bg-slate-50 cursor-grab active:cursor-grabbing"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    style={{
                        backgroundImage: `linear-gradient(to right, #cbd5e130 1px, transparent 1px), linear-gradient(to bottom, #cbd5e130 1px, transparent 1px)`,
                        backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
                        backgroundPosition: `${pan.x}px ${pan.y}px`
                    }}
                  >
                      {/* Scaled and Translated Inner Canvas */}
                      <div 
                          className="absolute top-0 left-0 w-full h-full origin-top-left pointer-events-none"
                          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                      >
                           
                           {/* SVG Layer (overflow-visible allows drawing beyond initial bounds) */}
                           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                               <defs>
                                   <marker id="arrowhead-default" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /> {/* slate-400 */}
                                   </marker>
                                   <marker id="arrowhead-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                       <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" /> {/* emerald-500 */}
                                   </marker>
                               </defs>
                               {renderSvgArrows()}
                           </svg>

                           {/* HTML Nodes */}
                           {state.list && state.list.map((nodeObj) => {
                              
                              const isHead = headId === nodeObj.id;
                              const isCurr = currId === nodeObj.id;
                              const isPrev = prevId === nodeObj.id;
                              const isTemp = tempId === nodeObj.id;
                              const isActiveAlloc = activeNode === nodeObj.id;
                              
                              const isDeleted = deletedSet && deletedSet.has(nodeObj.id);

                              const isTarget = isHead || isCurr || isPrev || isTemp || isActiveAlloc || (isComparing && isCurr);
                              
                              let themeColor = 'slate';
                              if (isActiveAlloc) themeColor = 'violet';
                              else if (isComparing && isCurr) themeColor = 'amber';
                              else if (isDeleted) themeColor = 'rose';
                              else if (isCurr) themeColor = 'sky';
                              else if (isPrev) themeColor = 'amber';

                              const labels = [];
                              if (isHead && !isDeleted) labels.push({ text: "head", color: "emerald", position: "top" });
                              if (isCurr && !isDeleted) labels.push({ text: "curr", color: "sky", position: "bottom" });
                              if (isPrev && !isDeleted) labels.push({ text: "prev", color: "amber", position: "bottom" });
                              if (isTemp && !isDeleted) labels.push({ text: "temp", color: "fuchsia", position: "top" });

                              return (
                                  <div key={nodeObj.id} className={`absolute transition-all duration-700 z-10 ${isDeleted ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                                      
                                      {/* Top Labels */}
                                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'top').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                                          ))}
                                      </div>

                                      {/* Bottom Labels */}
                                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center z-20">
                                          {labels.filter(l => l.position === 'bottom').map((l, i) => (
                                              <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                                          ))}
                                      </div>

                                      {/* The Node Itself */}
                                      <div className="relative group">
                                          <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                                          <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-300 scale-105` : ''} bg-white border-${themeColor}-400`}>
                                              <div className={`flex-1 flex justify-center font-mono font-black text-2xl text-${themeColor}-800`}>
                                                  {nodeObj.val}
                                              </div>
                                              <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                                                  <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                                              </div>
                                          </div>
                                          
                                          {/* Deletion Cross */}
                                          {isDeleted && (
                                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                  <div className="w-full h-1.5 bg-rose-500 -rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                                  <div className="w-full h-1.5 bg-rose-500 rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                                              </div>
                                          )}

                                          {/* Null indicator embedded below if pointer is null */}
                                          {nodeObj.nextId === null && !isDeleted && (
                                              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                                          )}
                                      </div>
                                  </div>
                              )
                          })}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Learn/Theory Tab */}
        {activeTab === 'learn' && (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm min-h-[600px] animate-in fade-in space-y-10 font-mono">
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Database className="text-emerald-600"/> Memory Layout: Arrays vs Linked Lists
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-emerald-100 pl-6">
                Understanding <em>how</em> data is stored in RAM is the key to understanding <em>why</em> linked lists exist and when to use them.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-8 bg-sky-50 border border-sky-100 rounded-3xl shadow-sm">
                  <h3 className="font-black text-sky-900 flex items-center gap-2 uppercase tracking-tighter text-sm mb-4">Arrays: Contiguous Memory</h3>
                  <div className="flex gap-1 mb-4">
                    {[100, 104, 108, 112].map((addr, i) => (
                      <div key={addr} className="flex-1 border-2 border-sky-300 bg-white rounded-md flex flex-col items-center p-2 shadow-sm">
                        <span className="text-[9px] text-sky-400 mb-1">0x{addr}</span>
                        <span className="font-black text-sky-800">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-sky-800 leading-relaxed">
                    Arrays allocate a single block of memory. If you want an array of 4 integers, the OS finds a contiguous 16-byte chunk. 
                    <strong>Pro:</strong> Instant random access via math <code>address = base + (index * size)</code>. 
                    <strong>Con:</strong> Resizing is expensive (must find a new larger block and copy elements).
                  </p>
                </div>
                <div className="p-8 bg-emerald-50 border border-emerald-100 rounded-3xl shadow-sm">
                  <h3 className="font-black text-emerald-900 flex items-center gap-2 uppercase tracking-tighter text-sm mb-4">Linked Lists: Scattered Memory</h3>
                  <div className="flex flex-col gap-3 mb-4 relative">
                    <div className="w-1/2 border-2 border-emerald-300 bg-white rounded-md p-2 flex justify-between shadow-sm ml-4">
                      <div>
                        <span className="text-[9px] text-emerald-400 block">0x200</span>
                        <span className="font-black text-emerald-800">Val: 1</span>
                      </div>
                      <span className="text-[9px] text-slate-400 self-end">Next: 0x504</span>
                    </div>
                    <div className="w-1/2 border-2 border-emerald-300 bg-white rounded-md p-2 flex justify-between shadow-sm self-end mr-4">
                      <div>
                        <span className="text-[9px] text-emerald-400 block">0x504</span>
                        <span className="font-black text-emerald-800">Val: 2</span>
                      </div>
                      <span className="text-[9px] text-slate-400 self-end">Next: null</span>
                    </div>
                    <svg className="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{zIndex:0}}>
                      <path d="M10,0 Q50,20 80,40" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="4"/>
                    </svg>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Nodes are scattered randomly in the heap. They are linked purely by storing the exact memory address of the next node.
                    <strong>Pro:</strong> Easily add/remove nodes without shifting contiguous memory. 
                    <strong>Con:</strong> Sequential access only, and extra memory overhead for the pointer.
                  </p>
                </div>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none">
                  <Search size={200} />
                </div>
                <h4 className="font-black uppercase tracking-widest text-emerald-400 text-sm mb-6 flex items-center gap-2">
                  <AlertCircle size={16}/> The "NullPointerException" Danger
                </h4>
                <div className="space-y-4 relative z-10 text-sm text-slate-300 leading-relaxed">
                  <p>The most common bug when writing Linked List code is trying to access <code>curr.next</code> when <code>curr</code> is already <code>null</code>.</p>
                  <div className="bg-rose-900/30 border border-rose-500/30 p-4 rounded-xl font-mono text-xs text-rose-300">
                    // DANGEROUS<br/>
                    while (curr.data != val) &#123;<br/>
                    &nbsp;&nbsp;curr = curr.next;<br/>
                    &#125;
                  </div>
                  <p>If <code>val</code> is not in the list, <code>curr</code> eventually becomes <code>null</code>. The next loop iteration throws an exception.</p>
                  <div className="bg-emerald-900/30 border border-emerald-500/30 p-4 rounded-xl font-mono text-xs text-emerald-300">
                    // SAFE<br/>
                    while (curr != null && curr.data != val) &#123;<br/>
                    &nbsp;&nbsp;curr = curr.next;<br/>
                    &#125;
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
                <Trophy size={24} /> Cheat Sheet
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <StatCard label="Access/Search" val="O(N)" color="rose" />
                <StatCard label="Insert Head" val="O(1)" color="emerald" />
                <StatCard label="Insert Tail" val="O(N)" color="rose" />
                <StatCard label="Delete Node" val="O(N)" color="rose" />
              </div>
              <p className="text-xs text-slate-400 mt-4 italic text-center relative z-10">
                Note: Insert/Delete at tail is O(1) ONLY if you maintain a 'tail' pointer in your class.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <MonitorPlay size={14} className="text-emerald-500"/> Popular Patterns
                </h4>
                <ul className="space-y-4 text-xs text-slate-600 leading-relaxed">
                  <li>
                    <strong className="text-slate-800 block text-sm">Two Pointers (Fast/Slow)</strong>
                    Used heavily to find the middle of a list, or detect cycles (Floyd's Cycle-Finding Algorithm). Slow moves 1 step, Fast moves 2.
                  </li>
                  <li>
                    <strong className="text-slate-800 block text-sm">Dummy Head</strong>
                    Create a temporary <code>new Node(-1)</code> and attach your list to it. Solves edge cases where the head itself needs to be deleted or modified.
                  </li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h4 className="font-black text-slate-800 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                  <Target size={14} className="text-sky-500"/> Must-Know Interview Questions
                </h4>
                <ul className="space-y-3 list-decimal pl-4 text-sm font-bold text-slate-700">
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">Reverse a Linked List</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">Linked List Cycle Detection</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">Merge Two Sorted Lists</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">Remove Nth Node From End</li>
                  <li className="hover:text-emerald-600 cursor-pointer transition-colors">Find the Middle of the List</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- True Fullscreen Desktop Experience --- */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-row overflow-hidden animate-in fade-in zoom-in duration-300">
          
          {/* LEFT SIDEBAR: Code & Operations */}
          <div className="w-[450px] bg-[#0f172a] border-r border-slate-800 flex flex-col shadow-2xl relative z-[110]">
            <div className="bg-[#1e293b] p-6 flex justify-between items-center border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-lg"><GitCommit size={20}/></div>
                <span className="text-white font-black text-sm uppercase tracking-[0.2em]">Linked List Tutorial</span>
              </div>
              <button onClick={toggleFullscreen} className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
                <Minimize size={20}/>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
              {/* Operations Selector */}
              <div className="mb-6">
                <h3 className="text-white font-black text-lg mb-4">Operations</h3>
                <div className="space-y-2">
                  {Object.values(OPERATIONS).map((op) => (
                    <button
                      key={op.id}
                      onClick={() => { setSelectedOpId(op.id); setCurrentStep(0); }}
                      className={`w-full p-4 rounded-xl text-left transition-all ${
                        selectedOpId === op.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {op.icon}
                        <span className="font-bold">{op.title}</span>
                      </div>
                      <div className="text-xs opacity-75">{op.complexity}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Display */}
              <div className="bg-black/20 rounded-2xl border border-white/5 p-4 mb-4">
                {selectedOp.code.split('\n').map((line, idx) => (
                  <CodeLineRenderer key={idx} num={idx + 1} code={line} active={cur.line === idx + 1} />
                ))}
              </div>

              {/* Execution Log */}
              <div className={`p-6 rounded-3xl border transition-all duration-300 min-h-[140px] relative overflow-hidden flex-1 ${
                isSuccess ? 'bg-emerald-900/40 border-emerald-800' : 'bg-slate-800/40 border-slate-700'
              }`}>
                <div className="flex items-center justify-between mb-4 relative z-10 text-white opacity-40 uppercase font-black text-[10px] font-mono tracking-widest">
                  <div className="flex items-center gap-2"><Activity size={14}/> <span>Memory Operations</span></div>
                  <span>Line {String(cur.line || 0)}</span>
                </div>
                <div className="text-xl font-black tracking-tight mb-2 uppercase font-mono text-white leading-tight">{String(cur.phase || "")}</div>
                <p className="text-sm leading-relaxed text-slate-300 border-t border-white/5 pt-3 italic font-mono relative z-10">{String(cur.description || "")}</p>
              </div>
            </div>
          </div>

          {/* RIGHT ARENA: The Canvas */}
          <div className="flex-1 relative bg-white overflow-hidden bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]">
            
            {/* Floating Tool Corner */}
            <div className="absolute top-8 right-8 z-50 flex flex-col gap-3 pointer-events-auto">
              <div className="flex flex-col bg-white/90 p-2 rounded-2xl shadow-2xl border border-slate-200 backdrop-blur-md gap-2">
                <button onClick={zoomIn} title="Zoom In" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomIn size={24}/></button>
                <button onClick={zoomOut} title="Zoom Out" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><ZoomOut size={24}/></button>
                <button onClick={resetZoom} title="Reset View" className="p-3 text-slate-600 hover:text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all"><RotateCcw size={24}/></button>
              </div>
            </div>

            {/* FS Corner Next Button */}
            {!isSuccess && (
              <div className="absolute bottom-10 right-10 z-[110] flex gap-4 animate-in slide-in-from-bottom-10">
                <button 
                  onClick={handlePrev} 
                  disabled={currentStep === 0}
                  className="px-12 py-6 bg-slate-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(71,85,105,0.3)] hover:bg-slate-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-slate-500 disabled:opacity-50"
                >
                  <ChevronLeft size={32}/> PREV STEP
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={currentStep === trace.length - 1}
                  className="px-12 py-6 bg-emerald-600 text-white rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all font-black text-xl uppercase tracking-widest flex items-center gap-4 border border-emerald-500 disabled:opacity-50"
                >
                  NEXT STEP <ChevronRight size={32}/>
                </button>
              </div>
            )}

            {/* Large Scale Canvas */}
            <div 
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" 
              onPointerDown={handlePointerDown} 
              onPointerMove={handlePointerMove} 
              onPointerUp={handlePointerUp} 
              onPointerLeave={handlePointerUp}
            >
              <div className="absolute top-0 left-0 w-full h-full origin-top-left transition-transform duration-75" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * 1.5})` }}>
                
                {/* SVG Layer for Pointer Arrows */}
                <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
                  <defs>
                    <marker id="arrowhead-default-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#cbd5e1" />
                    </marker>
                    <marker id="arrowhead-active-fs" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                    </marker>
                  </defs>
                  {renderSvgArrows()}
                </svg>

                {/* HTML Layer for Node Blocks & Labels */}
                {state.list && state.list.map((nodeObj) => {
                  const isHead = headId === nodeObj.id;
                  const isCurr = currId === nodeObj.id;
                  const isPrev = prevId === nodeObj.id;
                  const isTemp = tempId === nodeObj.id;
                  const isActiveAlloc = activeNode === nodeObj.id;
                  const isDeleted = deletedSet && deletedSet.has(nodeObj.id);

                  const isTarget = isHead || isCurr || isPrev || isTemp || isActiveAlloc || (isComparing && isCurr);
                  
                  let themeColor = 'slate';
                  if (isActiveAlloc) themeColor = 'violet';
                  else if (isComparing && isCurr) themeColor = 'amber';
                  else if (isDeleted) themeColor = 'rose';
                  else if (isCurr) themeColor = 'sky';
                  else if (isPrev) themeColor = 'amber';

                  const labels = [];
                  if (isHead && !isDeleted) labels.push({ text: "head", color: "emerald", position: "top" });
                  if (isCurr && !isDeleted) labels.push({ text: "curr", color: "sky", position: "bottom" });
                  if (isPrev && !isDeleted) labels.push({ text: "prev", color: "amber", position: "bottom" });
                  if (isTemp && !isDeleted) labels.push({ text: "temp", color: "fuchsia", position: "top" });

                  return (
                    <div key={nodeObj.id} className={`absolute transition-all duration-300 z-10 ${isDeleted ? 'opacity-30 grayscale scale-95' : ''}`} style={{ left: nodeObj.x, top: nodeObj.y }}>
                      
                      {/* Top Labels */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1 items-center">
                        {labels.filter(l => l.position === 'top').map((l, i) => (
                          <PointerLabel key={i} label={l.text} color={l.color} position="top" active={true} />
                        ))}
                      </div>

                      {/* Bottom Labels */}
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col gap-1 items-center">
                        {labels.filter(l => l.position === 'bottom').map((l, i) => (
                          <PointerLabel key={i} label={l.text} color={l.color} position="bottom" active={true} />
                        ))}
                      </div>

                      {/* The Node Itself */}
                      <div className="relative group">
                        <span className="absolute -top-6 left-0 text-xs text-slate-400 font-mono font-bold opacity-80">{nodeObj.addr}</span>
                        <div className={`flex items-center w-28 h-14 border-2 rounded-2xl transition-all duration-300 shadow-sm ${isTarget ? `ring-4 ring-${themeColor}-300 scale-105` : ''} bg-white border-${themeColor}-400`}>
                          <div className={`flex-1 flex justify-center font-mono font-black text-2xl text-${themeColor}-800`}>
                            {nodeObj.val}
                          </div>
                          <div className={`w-10 h-full border-l-2 flex flex-col items-center justify-center rounded-r-xl border-${themeColor}-400 bg-${themeColor}-50`}>
                            <span className="text-[7px] font-black uppercase tracking-widest opacity-60 transform -rotate-90">NEXT</span>
                          </div>
                        </div>
                        
                        {/* Deletion Cross */}
                        {isDeleted && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-full h-1.5 bg-rose-500 -rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                            <div className="w-full h-1.5 bg-rose-500 rotate-12 absolute scale-125 rounded-full shadow-sm"></div>
                          </div>
                        )}

                        {/* Null indicator */}
                        {nodeObj.nextId === null && !isDeleted && (
                          <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-xs font-black font-mono text-slate-400">null</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FS Result Overlay */}
            {isSuccess && (
              <div className="absolute inset-0 z-[120] flex items-center justify-center p-8 backdrop-blur-md pointer-events-none">
                <div className="bg-[#0f172a] border-4 border-emerald-500 rounded-[4rem] p-16 shadow-[0_0_150px_rgba(16,185,129,0.3)] animate-in zoom-in duration-500 pointer-events-auto max-w-2xl w-full text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
                  <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-lg ring-4 ring-emerald-500/10"><Trophy size={48}/></div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">OPERATION COMPLETE</h2>
                  <p className="text-emerald-400 font-mono text-xs uppercase mb-8 tracking-widest opacity-60">{selectedOp.title} executed successfully</p>
                  <div className="flex gap-4">
                    <button onClick={handleReset} className="flex-1 py-6 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all shadow-xl flex items-center justify-center gap-4 text-lg">
                      <RotateCcw size={24}/> RESTART VIZ
                    </button>
                    <button onClick={toggleFullscreen} className="py-6 px-10 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest rounded-3xl transition-all border border-slate-700">
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
};

// Sub-components
const PointerLabel: React.FC<PointerLabelProps> = ({ label, color, position, active, offset = 0, strikethrough = false }) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    sky: 'bg-sky-100 text-sky-700 border-sky-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    violet: 'bg-violet-100 text-violet-700 border-violet-200'
  }[color] || 'bg-slate-100 text-slate-700 border-slate-200';
  
  const topPos = position === 'top' ? '-top-12' : '-bottom-12';
  const alignClass = position === 'top' ? 'flex-col-reverse' : 'flex-col';
  
  return (
    <div className={`absolute ${topPos} h-10 flex ${alignClass} items-center justify-center animate-in zoom-in duration-300 z-10`} style={{ transform: `translateX(${offset}px)`}}>
      <span className={`text-[10px] font-black font-mono tracking-widest px-2 py-0.5 rounded shadow-sm border ${colorClasses} ${strikethrough ? 'line-through opacity-50' : ''}`}>
        {label}
      </span>
      {position === 'top' ? 
        <ArrowDown size={16} className={`text-${color}-500`} strokeWidth={3}/> : 
        <ArrowUp size={16} className={`text-${color}-500`} strokeWidth={3}/>
      }
    </div>
  );
};

const StatCard: React.FC<StatCardProps> = ({ label, val, color }) => {
  const colorClasses = {
    emerald: 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30',
    rose: 'bg-rose-900/40 text-rose-400 border-rose-500/30'
  }[color];
  
  return (
    <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${colorClasses}`}>
      <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
      <div className="text-xl font-black font-mono leading-none">{val}</div>
    </div>
  );
};

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-black transition-all duration-300 whitespace-nowrap ${
      active ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
    }`}
  >
    {icon} {label}
  </button>
);

const CodeLineRenderer: React.FC<CodeLineRendererProps> = ({ num, code, active, theme = 'emerald' }) => {
  const parts = code.split(/(\/\/.*|#.*|\".*?\"|\b(?:public|private|class|return|if|else|while|int|long|void|String|boolean|new|this|for|break|Node|true|false|System|out|print|static)\b|\b\d+\b)/g).filter(Boolean);
  
  const themeMap = {
    emerald: { bg: 'bg-emerald-500/10', border: 'bg-emerald-500', text: 'text-emerald-400' },
  };
  
  const activeStyles = themeMap[theme];
  
  return (
    <div className={`flex relative z-10 min-h-[16.5px] transition-colors duration-200 ${active ? activeStyles.bg : ''}`}>
      {active && <div className={`absolute left-0 top-0 bottom-0 w-1 ${activeStyles.border}`} />}
      <span className={`w-8 select-none text-right pr-4 border-r border-slate-800/50 mr-4 shrink-0 font-mono text-[10px] ${active ? `${activeStyles.text} font-bold` : 'text-slate-700'}`}>
        {num}
      </span>
      <pre className={`font-mono text-slate-300 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
        {parts.map((part, i) => {
          if (part.startsWith('//') || part.startsWith('#')) return <span key={i} className="text-slate-500 italic">{part}</span>;
          if (part.startsWith('"') || part.startsWith("'")) return <span key={i} className="text-amber-300">{part}</span>;
          if (['public', 'private', 'class', 'return', 'if', 'else', 'while', 'new', 'this', 'void', 'for', 'break', 'static'].includes(part)) return <span key={i} className="text-pink-400 font-bold">{part}</span>;
          if (['int', 'long', 'boolean', 'String', 'Node', 'System', 'out', 'print'].includes(part)) return <span key={i} className="text-sky-400 font-bold">{part}</span>;
          if (['true', 'false', 'null', 'None'].includes(part)) return <span key={i} className="text-rose-400 font-bold">{part}</span>;
          if (!isNaN(parseInt(part)) && part.trim() !== '') return <span key={i} className="text-amber-400">{part}</span>; // Numbers
          return <span key={i}>{part}</span>;
        })}
      </pre>
    </div>
  );
};

export default SinglyLinkedListTutorial;