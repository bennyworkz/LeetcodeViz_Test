import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  CheckCircle2, Users, Clock, History, FastForward, Sigma
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-emerald-400 shadow-lg shadow-emerald-900/20 scale-105' 
        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
    }`}
  >
    {icon} 
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden text-[10px]">{label.split(' ')[0]}</span>
  </button>
);

const SectionTitle = ({ icon, title, colorClass }) => (
  <div className={`flex items-center gap-3 font-black text-2xl uppercase tracking-tighter mb-8 ${colorClass}`}>
    {icon} {title}
  </div>
);

const QuestionCard = ({ qNum, badge = "Practice", question, options = [], solution, ans = "" }) => {
  const [showSol, setShowSol] = useState(false);
  
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col h-full">
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <div className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 flex-1 overflow-x-auto whitespace-pre-wrap">
        {question}
      </div>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-green-50 border-green-300 text-green-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-green-200' : 'bg-slate-100'
              }`}>
                {opt.charAt(0)}
              </span>
              {opt.slice(2)}
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t border-slate-100 pt-4 mt-auto">
        <button 
          onClick={() => setShowSol(!showSol)} 
          className="flex items-center gap-2 text-sm font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors outline-none"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-5 bg-[#0f172a] text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-4 uppercase tracking-widest text-[10px] border-b border-slate-700/80 pb-2">
              <BookOpen size={14} /> Step-by-Step Notebook
            </div>
            
            <div className="font-mono text-slate-300 leading-relaxed overflow-x-auto flex flex-col gap-2">
              {typeof solution === 'string' ? solution.split('\n').map((line, idx) => {
                const trimmedLine = line.trim();
                
                if (!trimmedLine) return <div key={idx} className="h-3"></div>;
                
                const isEquation = trimmedLine.startsWith('=') || trimmedLine.startsWith('=>') || trimmedLine.startsWith('➔');
                const isFinalLine = idx === solution.split('\n').length - 1;

                let lineClass = "text-slate-300";
                let prefix = null;

                if (isEquation) {
                   lineClass = "text-green-300 font-bold ml-4";
                   prefix = <span className="mr-3 text-green-500/70 select-none">↳</span>;
                } else if (isFinalLine && !trimmedLine.endsWith('?')) {
                   lineClass = "text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-lg inline-block w-max border border-emerald-500/20";
                }

                return (
                  <div key={idx} className={`flex items-start ${lineClass}`}>
                    {prefix}
                    <span className="flex-1">{line}</span>
                  </div>
                );
              }) : solution}
            </div>
            
            {ans && (
              <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center gap-2">
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={16} /> Correct Option: {ans}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function AgesMasterNotes() {
  const [activeTab, setActiveTab] = useState('concepts');
  
  return (
    <div className="bg-[#f0fdf4] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600">
              <Users className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                Problem on Ages
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-emerald-800 bg-emerald-100 border border-emerald-200">
                  Master Notes
                </span>
                <span>•</span>
                <span>Quantitative Aptitude</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={<BookOpen size={16}/>} label="Core Concepts" />
            <TabButton active={activeTab === 'formulas'} onClick={() => setActiveTab('formulas')} icon={<Sigma size={16}/>} label="Master Formulas" />
            <TabButton active={activeTab === 'patterns'} onClick={() => setActiveTab('patterns')} icon={<Zap size={16}/>} label="Exam Patterns" />
            <TabButton active={activeTab === 'mcq'} onClick={() => setActiveTab('mcq')} icon={<BrainCircuit size={16}/>} label="MCQ Vault" />
            <TabButton active={activeTab === 'practice'} onClick={() => setActiveTab('practice')} icon={<Target size={16}/>} label="Practice Vault" />
          </div>
        </div>

        {/* --- TAB 1: CORE CONCEPTS --- */}
        {activeTab === 'concepts' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<BookOpen size={28}/>} title="Concepts & Strategies" colorClass="text-emerald-600" />
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-emerald-50 border-2 border-emerald-200 p-6 rounded-3xl relative overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute right-0 top-0 opacity-5"><Users size={150}/></div>
                <h3 className="font-black text-xl text-emerald-800 mb-3 relative z-10">What are Age Problems?</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  Problems On Ages are a type of word problem based on linear algebra, which deals with the current, past, and future age of people. The concept explores mathematical puzzles involving relationships between people’s ages over time.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-emerald-900 border border-emerald-100 relative z-10 mt-4 space-y-2">
                  <strong>Categorized into 4 forms:</strong>
                  <div>1. Age of an individual</div>
                  <div>2. Age ratio problems</div>
                  <div>3. Age difference problems</div>
                  <div>4. Family age problems (Averages/Sums)</div>
                </div>
              </div>

              <div className="bg-slate-800 text-white border-2 border-slate-700 p-6 rounded-3xl relative overflow-hidden md:col-span-2 lg:col-span-1">
                <div className="absolute right-0 top-0 opacity-5"><Lightbulb size={150}/></div>
                <h3 className="font-black text-xl text-green-400 mb-4 relative z-10">Golden Solving Strategies</h3>
                <ul className="space-y-3 text-sm text-slate-300 relative z-10">
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-green-400 shrink-0" size={18}/> <span><strong>Decide the timeline:</strong> Identify if the given age is present, past, or future.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-green-400 shrink-0" size={18}/> <span><strong>Set the Base:</strong> In most cases, take the <strong>present age as 'x'</strong>. It works as the best base year.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-green-400 shrink-0" size={18}/> <span><strong>One Variable:</strong> Try to select only ONE variable (x) to solve the problem to avoid complex substitution.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-green-400 shrink-0" size={18}/> <span><strong>Read carefully:</strong> The phrase <em>'n times more than'</em> is different from <em>'n times'</em>. Understand it correctly.</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="text-green-400 shrink-0" size={18}/> <span><strong>Back Calculation:</strong> Sometimes when nothing works, just look at the options and back-calculate!</span></li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-emerald-500"/> The Timeline Equations
                </h3>
                <div className="grid md:grid-cols-3 gap-4 font-mono text-sm">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                        <History className="mx-auto mb-2 text-rose-500"/>
                        <div className="text-xs font-bold mb-2 text-rose-600 uppercase">Past (Ago)</div>
                        If present age is x,<br/>age n years ago = <strong className="text-lg text-slate-800 block mt-1">x - n</strong>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-400 text-center scale-105 z-10">
                        <Users className="mx-auto mb-2 text-emerald-500"/>
                        <div className="text-xs font-bold mb-2 text-emerald-600 uppercase">Present (Now)</div>
                        Current Base Year<br/> <strong className="text-2xl text-emerald-600 block mt-1">x</strong>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-center">
                        <FastForward className="mx-auto mb-2 text-blue-500"/>
                        <div className="text-xs font-bold mb-2 text-blue-600 uppercase">Future (Hence)</div>
                        If present age is x,<br/>age n years hence = <strong className="text-lg text-slate-800 block mt-1">x + n</strong>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: MASTER FORMULAS --- */}
        {activeTab === 'formulas' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle icon={<Sigma size={28}/>} title="Master Formulas & Short Tricks" colorClass="text-green-600" />

            <div className="bg-green-50 border border-green-200 p-6 rounded-3xl shadow-sm mb-8">
                <h4 className="font-black text-green-800 uppercase tracking-widest text-sm mb-4">Basic Expression Translations</h4>
                <div className="grid md:grid-cols-2 gap-3 font-mono text-sm">
                    <div className="bg-white p-3 rounded-lg border border-green-100 flex justify-between">
                        <span>n times the present age</span> <strong className="text-green-700">nx</strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-100 flex justify-between">
                        <span>1/n of the present age</span> <strong className="text-green-700">x/n</strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-100 flex justify-between">
                        <span>Ages in a ratio a : b</span> <strong className="text-green-700">ax and bx</strong>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-100 flex justify-between">
                        <span>Man's age 6 years ago</span> <strong className="text-green-700">(x - 6)</strong>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-black text-slate-800 text-xl uppercase tracking-widest border-b pb-2 flex items-center gap-2">
                    <Zap size={24} className="text-amber-500"/> The 6 Direct Shortcut Formulas
                </h3>
                <p className="text-sm text-slate-600">While you can solve these with linear equations, these 6 direct formulas can save you minutes during the exam.</p>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Concept 1 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">1</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> <em>x</em> years ago, A's age was <em>n₁</em> times B's age. At present, A is <em>n₂</em> times B's age.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ (n₁ - 1)n₂x ] / (n₁ - n₂)</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ (n₁ - 1)x ] / (n₁ - n₂)</span>
                        </div>
                    </div>

                    {/* Concept 2 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">2</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> Present age of A is <em>n₁</em> times B. After <em>x</em> years, A becomes <em>n₂</em> times B.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ (n₂ - 1)n₁x ] / (n₁ - n₂)</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ (n₂ - 1)x ] / (n₁ - n₂)</span>
                        </div>
                    </div>

                    {/* Concept 3 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">3</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> <em>t₁</em> years ago, A was <em>X</em> times B. After <em>t₂</em> years, A becomes <em>Y</em> times B.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ X(t₁ + t₂)(Y - 1) / (X - Y) ] + t₁</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ t₂(Y - 1) + t₁(X - 1) ] / (X - Y)</span>
                        </div>
                    </div>

                    {/* Concept 4 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">4</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> Sum of present ages of A & B is <em>X</em>. <em>t</em> years after, A becomes <em>Y</em> times B.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ XY + t(Y - 1) ] / (Y + 1)</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ X - t(Y - 1) ] / (Y + 1)</span>
                        </div>
                    </div>

                    {/* Concept 5 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">5</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> Ratio of present ages is <em>p:q</em>. After <em>t</em> years, ratio becomes <em>r:s</em>.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ pt(r - s) ] / (ps - qr)</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ qt(r - s) ] / (ps - qr)</span>
                        </div>
                    </div>

                    {/* Concept 6 */}
                    <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-lg border border-slate-700 relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-10 font-black text-9xl">6</div>
                        <p className="text-sm text-slate-300 mb-4 relative z-10"><strong className="text-amber-400">Condition:</strong> Sum of present ages is <em>X</em>. <em>t</em> years ago, A was <em>Y</em> times B.</p>
                        <div className="font-mono bg-black/40 p-3 rounded-xl border border-slate-600 text-sm relative z-10">
                            A's Present = <span className="text-emerald-400">[ XY + t(Y - 1) ] / (Y + 1)</span>
                            <br/>
                            B's Present = <span className="text-emerald-400">[ X + t(Y - 1) ] / (Y + 1)</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        )}

        {/* --- TAB 3: EXAM PATTERNS --- */}
        {activeTab === 'patterns' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle icon={<Zap size={28}/>} title="5 Core Exam Archetypes" colorClass="text-emerald-600" />
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-emerald-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Mastering the Archetypes</h3>
                <p className="text-sm font-medium mt-1">
                  Instead of randomly guessing, recognize which of these 5 standard archetypes the question belongs to.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Pattern 1" badge="Past & Future Mix"
                    question={`In the next 6 years, C will be double the age of D 6 years back. If at present C is 5 years elder to D, then find D's present age.`}
                    options={["A. 32", "B. 25", "C. 23", "D. 20"]}
                    ans="C"
                    solution={`Let D's present age be x.
Given, C is 5 years elder to D.
So, C's present age = x + 5.

Condition: In the next 6 years, C will be double the age of D 6 years back.
C's age in 6 yrs = (x + 5) + 6 = x + 11
D's age 6 yrs back = x - 6

Equation:
(x + 11) = 2(x - 6)
x + 11 = 2x - 12
2x - x = 11 + 12
x = 23

D's present age is 23.`}
                />

                <QuestionCard 
                    qNum="Pattern 2" badge="Relative Birth Logic"
                    question={`Vikram said to his daughter, "I was as old as you are today when you were born." If Vikram's age is 45 today, then his daughter's age 3 years ago was?`}
                    options={["A. 22", "B. 19.5", "C. 23.5", "D. 21.5"]}
                    ans="B"
                    solution={`Let Vikram's daughter's age today = z.
When the daughter was born, Vikram's age was (45 - z).

Vikram says he was as old as she is today (z) at that time.
So, 45 - z = z.
2z = 45
z = 22.5 (Daughter's present age).

Daughter's age 3 years ago:
22.5 - 3 = 19.5 years.`}
                />

                <QuestionCard 
                    qNum="Pattern 3" badge="Digit Reversal"
                    question={`Amitabh said to his friend "If you subtract 18 from my age the two digits of my age will reverse their positions. Also my age is six less than 8 times the sum of digits of my age". Find Amitabh's age.`}
                    options={["A. 46 years", "B. 37 years", "C. 56 years", "D. 42 years"]}
                    ans="D"
                    solution={`Let the digits be x and y. Age = (10x + y).
Reversed age = (10y + x).

Condition 1: Subtract 18 to reverse digits.
(10x + y) - 18 = (10y + x)
9x - 9y = 18
x - y = 2  -------- (Eq 1)

Condition 2: Age is 6 less than 8 times sum of digits.
(10x + y) = 8(x + y) - 6
10x + y = 8x + 8y - 6
2x - 7y = -6  -------- (Eq 2)

From Eq 1, x = y + 2. Substitute into Eq 2:
2(y + 2) - 7y = -6
2y + 4 - 7y = -6
-5y = -10
y = 2

Substitute y=2 in x = y+2:
x = 2 + 2 = 4
Age = 10(4) + 2 = 42 years.`}
                />

                <QuestionCard 
                    qNum="Pattern 4" badge="Ratios & Family"
                    question={`Saina Nehwal is 8 years older than her cousin. Her cousin is 24 years younger than his mother. If the ratio between the ages of Saina and her cousin's mother is 7 : 11. What will be the age of Saina's cousin after 3 years?`}
                    options={["A. 21 years", "B. 20 years", "C. 26 years", "D. 23 years"]}
                    ans="D"
                    solution={`Let the age of Saina = x.
Saina is 8 years older than cousin ➔ Cousin's age = x - 8.
Cousin is 24 years younger than his mother ➔ Mother's age = (x - 8) + 24 = x + 16.

Ratio of Saina to Mother is 7:11.
x / (x + 16) = 7 / 11

Cross-multiply:
11x = 7(x + 16)
11x = 7x + 112
4x = 112
x = 28 (Saina's age)

Cousin's present age = 28 - 8 = 20.
After 3 years, Cousin's age = 20 + 3 = 23 years.`}
                />

                <QuestionCard 
                    qNum="Pattern 5" badge="Squares & Century"
                    question={`A boy asks his father, "what is the age of grandfather?". Father replied "He is x years old in x² years", and also said, "we are talking about the 20th century". What is the year of birth of grandfather?`}
                    options={["A. 1995", "B. 1892", "C. 1895", "D. 1893"]}
                    ans="B"
                    solution={`20th century means the years 1901 to 2000.
The father says he is x years old in x² years.
This means x² must be a year in the 20th century.

Find a perfect square between 1901 and 2000.
43² = 1849 (19th century)
44² = 1936 (20th century)
45² = 2025 (21st century)

So, x² = 1936, which means x = 44.
The grandfather was 44 years old in the year 1936.

Year of birth = 1936 - 44 = 1892.`}
                />
            </div>
          </div>
        )}

        {/* --- TAB 4: MCQ VAULT --- */}
        {activeTab === 'mcq' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<BrainCircuit size={28}/>} 
              title="MCQ Solved Vault" 
              colorClass="text-green-600" 
            />
            
            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-green-800 flex gap-4 items-center shadow-sm">
              <Target size={40} className="shrink-0 text-green-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">10 Standard Word Problems</h3>
                <p className="text-sm font-medium mt-1">
                  These cover ratios, averages, and multi-variable age calculations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Q1" badge="Substitution"
                    question={`Tiger's present age is acquired, if we subtract 9 years from Arav's present age and divide the remainder by 14. If Mohan's age is 8 years and he is 3 years elder to Arav, then find Tiger's present age.`}
                    options={["A. 42", "B. 79", "C. 77", "D. 85"]}
                    ans="B"
                    solution={`Let Tiger's present age be x.
Mohan's present age = 8 years.
Mohan is 3 years elder to Arav ➔ Arav's present age = 8 - 3 = 5 years.

Condition: Subtract 9 from Arav's age and divide by 14 to get Tiger's age.
Wait, if Arav is 5, (5-9)/14 is negative. Let's re-read the text's solution logic carefully:
Text solution says: "Arav's present age = 5... x - 9 / 14 = 5... x - 9 = 70 => x = 79"

Ah! The wording meant: "Arav's age is acquired if we subtract 9 from Tiger's age and divide by 14."
Equation: (x - 9) / 14 = 5
x - 9 = 70
x = 79 years.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="Past/Future Ratio"
                    question={`Erika was five times older than Gigi ten years ago. The age of Erika will be twice that of Gigi in five years. How old were Erika compared to Gigi five years ago?`}
                    options={["A. 5:1", "B. 3:1", "C. 2:1", "D. 4:1"]}
                    ans="B"
                    solution={`Let Gigi's age 10 years ago be x.
Erika's age 10 years ago = 5x.

Present ages: Gigi = x + 10, Erika = 5x + 10.
Ages in 5 years: Gigi = x + 15, Erika = 5x + 15.

Condition in 5 yrs: Erika will be twice Gigi.
5x + 15 = 2(x + 15)
5x + 15 = 2x + 30
3x = 15 ➔ x = 5.

10 yrs ago: Gigi=5, Erika=25.
Present: Gigi=15, Erika=35.
5 yrs ago: Gigi=10, Erika=30.

Ratio 5 yrs ago = 30 : 10 = 3:1.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="Sum & Difference"
                    question={`Sum of the ages of Tendulkar and Dravid 16 years hence will be equal to 3 times their present age. If at present Tendulkar is 10 years elder to Dravid, then what are their present ages?`}
                    options={["A. 22, 8", "B. 29, 12", "C. 13, 3", "D. 13, 6"]}
                    ans="C"
                    solution={`Let Tendulkar = x, Dravid = y.
Condition 1: (x + 16) + (y + 16) = 3(x + y)
x + y + 32 = 3x + 3y
32 = 2x + 2y
x + y = 16  ----- (Eq 1)

Condition 2: Tendulkar is 10 yrs elder.
x - y = 10  ----- (Eq 2)

Add Eq 1 and Eq 2:
2x = 26 ➔ x = 13.
y = 16 - 13 = 3.

Ages are 13 and 3.`}
                />

                <QuestionCard 
                    qNum="Q4" badge="Multi-Condition"
                    question={`Lalita is four times the age of Om. If after 3 years, she would be three times of Om, then additional after 3 years, how many times would be her age of Om?`}
                    options={["A. 2.5", "B. 3.5", "C. 2", "D. 3"]}
                    ans="A"
                    solution={`Let Om's present age = s.
Lalita's present age = 4s.

After 3 years:
4s + 3 = 3(s + 3)
4s + 3 = 3s + 9
s = 6.

Present ages: Om = 6, Lalita = 24.
After 3 years: Om = 9, Lalita = 27.
Additional 3 yrs (Total 6 yrs from present):
Om = 6 + 6 = 12.
Lalita = 24 + 6 = 30.

Ratio = 30 / 12 = 2.5 times.`}
                />

                <QuestionCard 
                    qNum="Q5" badge="Ratios & Diff"
                    question={`Present ages of Shikhar and Hardik are in the ratio 3:4. The ratio of Bhuvan's age after 5 years to Hardik's age 1 year ago is 4:3. Four times the diff in ages of Hardik & Shikhar is 1 more than Bhuvan's age. Find average of present ages of Shikhar and Hardik.`}
                    options={["A. 20 years", "B. 10 years", "C. 14 years", "D. 15 years"]}
                    ans="C"
                    solution={`Shikhar(A), Bhuvan(B), Hardik(C).
1) A/C = 3/4 ➔ A = 3C/4
2) (B + 5)/(C - 1) = 4/3
3) 4(C - A) = B + 1

Sub A into Eq 3:
4(C - 3C/4) = B + 1
4(C/4) = B + 1
C = B + 1 ➔ B = C - 1

Sub B into Eq 2:
(C - 1 + 5) / (C - 1) = 4/3
(C + 4) / (C - 1) = 4/3
3C + 12 = 4C - 4
C = 16.

If C = 16, A = 3(16)/4 = 12.
Average of A and C = (12 + 16) / 2 = 14.`}
                />

                <QuestionCard 
                    qNum="Q6" badge="Past/Future"
                    question={`Vidyut Jamwal was three times Tiger's age ten years ago, but he will be only twice as old in ten years. What is Vidyut's present age?`}
                    options={["A. 60 years", "B. 70 years", "C. 80 years", "D. 90 years"]}
                    ans="B"
                    solution={`Let Vidyut = x, Tiger = y.
10 yrs ago:
(x - 10) = 3(y - 10)
x - 3y = -20  ------ (Eq 1)

10 yrs hence:
(x + 10) = 2(y + 10)
x + 10 = 2y + 20
x - 2y = 10   ------ (Eq 2)

Subtract Eq 1 from Eq 2:
(x - 2y) - (x - 3y) = 10 - (-20)
y = 30

Sub y=30 into Eq 2:
x - 2(30) = 10
x - 60 = 10
x = 70.`}
                />

                <QuestionCard 
                    qNum="Q7" badge="Age Sums"
                    question={`Seven years ago, the combined ages of Amir and Akshay was twice that of Saif. If the sum of the ages of Akshay and Amir, fifteen years hence, is 98 years, what is the present age of Saif?`}
                    options={["A. 27 yrs", "B. 35 yrs", "C. 34 yrs", "D. 49 yrs"]}
                    ans="C"
                    solution={`Let present ages be M, K, S.
7 yrs ago: (M - 7) + (K - 7) = 2(S - 7)
M + K - 14 = 2S - 14
M + K = 2S   ------ (Eq 1)

15 yrs hence: (M + 15) + (K + 15) = 98
M + K + 30 = 98
M + K = 68

Substitute M+K=68 into Eq 1:
68 = 2S
S = 34 years.`}
                />

                <QuestionCard 
                    qNum="Q8" badge="Multipliers"
                    question={`Father's age is 5 times his son's age. 4 years back the father was 9 times older than son. Find the father's present age.`}
                    options={["A. 36 yrs", "B. 40 yrs", "C. 50 yrs", "D. 43 yrs"]}
                    ans="B"
                    solution={`Let son = x. Father = 5x.
4 years back:
(5x - 4) = 9(x - 4)
5x - 4 = 9x - 36
36 - 4 = 9x - 5x
32 = 4x
x = 8.

Father's present age = 5x = 5(8) = 40 years.`}
                />

                <QuestionCard 
                    qNum="Q9" badge="Averages"
                    question={`In a shopping mall with a staff of 5 members, the average age is 45 years. After 5 years a person joined them and the average age is again 45 years. What is the age of 6th person?`}
                    options={["A. 35", "B. 23", "C. 20", "D. 21"]}
                    ans="C"
                    solution={`Present total age of 5 members = 5 * 45 = 225.
After 5 years, their total age will increase by 5*5 = 25.
Total age of 5 members after 5 yrs = 225 + 25 = 250.

Now 6th person joins, and average of 6 people is 45.
Total age of 6 people = 6 * 45 = 270.

Age of 6th person = 270 - 250 = 20 years.`}
                />

                <QuestionCard 
                    qNum="Q10" badge="Averages Queue"
                    question={`Persons standing in the queue with different age groups, after two years their average age will be 43 and the seventh person joined with them. Hence the current average age has become 45. Find the age of the seventh person?`}
                    options={["A. 69", "B. 70", "C. 40", "D. 45"]}
                    ans="A"
                    solution={`Let sum of present ages of 6 persons = S.
After 2 years, average of these 6 is 43.
So, sum of their ages in 2 yrs = 6 * 43 = 258.
Present sum (S) = 258 - (6 * 2) = 246.

Now 7th person joins. Current average of 7 people is 45.
(S + 7th person) / 7 = 45
246 + 7th person = 7 * 45
246 + 7th person = 315
7th person = 315 - 246 = 69 years.`}
                />

            </div>
          </div>
        )}

        {/* --- TAB 5: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Quiz Vault" 
              colorClass="text-emerald-600" 
            />
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-emerald-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Test Your Speed</h3>
                <p className="text-sm font-medium mt-1">
                  10 Rapid-fire questions to solidify your understanding of age equations.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                <QuestionCard 
                    qNum="Quiz 1" badge="Fractions"
                    question="Max is one-third of Nick's age. After 12 years, Max would be half the age of Nick. What would be Nick's age after 6 years?"
                    options={["A. 35", "B. 25", "C. 21", "D. 42"]}
                    ans="D"
                    solution={`Let Max = m. Nick = 3m.
After 12 years:
(m + 12) = (3m + 12) / 2
2(m + 12) = 3m + 12
2m + 24 = 3m + 12
m = 12.

Nick's present age = 3m = 36.
Nick's age after 6 years = 36 + 6 = 42.`}
                />

                <QuestionCard 
                    qNum="Quiz 2" badge="Intervals"
                    question="4 children are born at intervals of 2 years. On adding their ages, we get the sum 40 years. How old is the eldest child?"
                    options={["A. 11", "B. 13", "C. 16.5", "D. 21"]}
                    ans="B"
                    solution={`Let youngest be a.
Children: a, a+2, a+4, a+6.
Sum = a + a+2 + a+4 + a+6 = 40
4a + 12 = 40
4a = 28
a = 7.

Eldest child = a + 6 = 7 + 6 = 13 years.`}
                />

                <QuestionCard 
                    qNum="Quiz 3" badge="Decimals"
                    question="6 children are born, each at an interval of 1.5 years. On adding the ages of all the 6 children, we get the sum as 60. How old is the youngest child?"
                    options={["A. 7", "B. 8.5", "C. 5", "D. 6.25"]}
                    ans="D"
                    solution={`Let youngest be p.
Children: p, p+1.5, p+3, p+4.5, p+6, p+7.5
Sum = 6p + (1.5+3+4.5+6+7.5) = 60
6p + 22.5 = 60
6p = 37.5
p = 37.5 / 6
p = 6.25 years.`}
                />

                <QuestionCard 
                    qNum="Quiz 4" badge="Multi-Equation"
                    question="Ross's age is 2 years more than his friend Sam's age. 12 years hence, his age will be 16 years less than twice the age of Sam at that time. Determine the age of Ross after 12 years."
                    options={["A. 20", "B. 18", "C. 22", "D. 16"]}
                    ans="A"
                    solution={`Let Sam = s. Ross (r) = s + 2.
12 years hence:
r + 12 = 2(s + 12) - 16
Substitute r:
(s + 2) + 12 = 2s + 24 - 16
s + 14 = 2s + 8
s = 6.

Ross present = s + 2 = 8.
Ross after 12 years = 8 + 12 = 20.`}
                />

                <QuestionCard 
                    qNum="Quiz 5" badge="Relative Logic"
                    question="Samantha told her office colleague Monika 'when Monika was born, Samantha was as old as Monika's present age.' If Samantha's current age is 36, how old was Monika 4 years ago?"
                    options={["A. 14", "B. 12", "C. 18", "D. 21"]}
                    ans="A"
                    solution={`Let Monika's present age = a.
When Monika was born (a years ago), Samantha's age was 36 - a.
Samantha says she was 'a' years old then.
36 - a = a
2a = 36
a = 18. (Monika's present age)

Monika's age 4 years ago = 18 - 4 = 14.`}
                />

                <QuestionCard 
                    qNum="Quiz 6" badge="Relative Logic"
                    question="A father said to his daughter Amma, 'At the time of your birth, I was double your present age.' If the daughter's age at present is 15 years, identify What the father's age 5 years later?"
                    options={["A. 41", "B. 48", "C. 51", "D. 50"]}
                    ans="D"
                    solution={`Amma's present age = 15.
Father's age at Amma's birth (15 yrs ago) = 2 * 15 = 30.
Father's present age = 30 + 15 = 45.

Father's age 5 years later = 45 + 5 = 50.`}
                />

                <QuestionCard 
                    qNum="Quiz 7" badge="Dual Ratio"
                    question="Six years ago, the ratio of the ages of Kohli and Rohit was 6 : 5. Four years hence, the ratio of their ages will be 11 : 10. What is Rohit's age at present?"
                    options={["A. 16 years", "B. 18 years", "C. 20 years", "D. Cannot be determined"]}
                    ans="A"
                    solution={`Let ages 6 years ago be 6x and 5x.
Present ages: (6x + 6) and (5x + 6).
4 years hence: (6x + 10) and (5x + 10).

Ratio:
(6x + 10) / (5x + 10) = 11 / 10
10(6x + 10) = 11(5x + 10)
60x + 100 = 55x + 110
5x = 10
x = 2.

Rohit's present age = 5x + 6 = 5(2) + 6 = 16 years.`}
                />

                <QuestionCard 
                    qNum="Quiz 8" badge="Ratios"
                    question="Ross is 8 years younger than Luke. Their ages are in the proportion of 4:6. Calculate the present age of Ross?"
                    options={["A. 18", "B. 24", "C. 20", "D. 16"]}
                    ans="D"
                    solution={`Let Luke's age = a.
Ross's age = a - 8.

Ratio:
(a - 8) / a = 4 / 6
6a - 48 = 4a
2a = 48
a = 24. (Luke)

Ross's age = 24 - 8 = 16.`}
                />

                <QuestionCard 
                    qNum="Quiz 9" badge="Complex Ratio"
                    question="Ashley and Dennis's present age is in the proportion of 5:3. If the proportion of Ashley's age 3 years back and Dennis's age 3 years later would be 1:1. Calculate the proportion of Ashley's age after 3 years and Dennis's age three years before."
                    options={["A. 3:1", "B. 2:1", "C. 22:11", "D. 13:6"]}
                    ans="A"
                    solution={`Present ages: 5x and 3x.
Condition: Ashley 3 yrs back : Dennis 3 yrs later = 1:1
(5x - 3) / (3x + 3) = 1/1
5x - 3 = 3x + 3
2x = 6
x = 3.

Ashley present = 15, Dennis present = 9.
Required Ratio: (Ashley + 3) / (Dennis - 3)
= (15 + 3) / (9 - 3)
= 18 / 6
= 3:1`}
                />

                <QuestionCard 
                    qNum="Quiz 10" badge="Fractions"
                    question="Saif is one-fifth years old than his mother. After three years, his mother's age will be four times that of Saif. How old would Saif's mother be 3 years hence?"
                    options={["A. 22", "B. 32", "C. 33", "D. 48"]}
                    ans="D"
                    solution={`Let Saif = a, Mother = 5a.
(Note: 'One-fifth years old than' means Saif = 1/5 of Mother).

After 3 years:
(5a + 3) = 4(a + 3)
5a + 3 = 4a + 12
a = 9.

Mother's present age = 5 * 9 = 45.
Mother's age 3 years hence = 45 + 3 = 48.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}