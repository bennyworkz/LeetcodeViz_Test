import React, { useState } from 'react';
import { 
  BookOpen, BrainCircuit, Hash, Calculator, 
  Lightbulb, Zap, Target, Layers, Eye, EyeOff, 
  Plus, FunctionSquare, DivideCircle, Clock, 
  Ruler, Flag
} from 'lucide-react';

// --- UI Components ---

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-xs font-black transition-all duration-300 whitespace-nowrap min-w-0 ${
      active 
        ? 'bg-slate-900 text-white shadow-lg shadow-purple-900/20 scale-105' 
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
      <div className="absolute left-0 top-0 bottom-0 w-2 bg-purple-500"></div>
      <h4 className="font-black text-slate-800 text-lg mb-3 flex justify-between">
        <span>{qNum}</span>
        <span className="bg-slate-100 text-slate-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
          {badge}
        </span>
      </h4>
      <p className="text-slate-700 font-medium mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap flex-1">
        {question}
      </p>
      
      {options.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((opt, i) => (
            <div 
              key={i} 
              className={`p-3 rounded-xl border font-mono text-sm font-bold flex items-center gap-2 ${
                showSol && ans && opt.startsWith(ans) 
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                showSol && ans && opt.startsWith(ans) ? 'bg-emerald-200' : 'bg-slate-100'
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
          className="flex items-center gap-2 text-sm font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest transition-colors"
        >
          {showSol ? (
            <><EyeOff size={16}/> Hide Solution</>
          ) : (
            <><Eye size={16}/> Show Solution</>
          )}
        </button>
        
        {showSol && (
          <div className="mt-4 bg-slate-800 text-white p-5 rounded-2xl text-sm leading-relaxed animate-in slide-in-from-top-2">
            <div className="text-purple-400 font-bold mb-2 uppercase tracking-widest text-xs">
              Step-by-Step Solution
            </div>
            <div className="font-mono whitespace-pre-wrap text-slate-300">
              {solution}
            </div>
            {ans && (
              <div className="mt-3 inline-block bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg font-bold">
                Correct Option: {ans}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Application ---
export default function HCFandLCMNotes() {
  const [activeTab, setActiveTab] = useState('theory');
  
  return (
    <div className="bg-[#f8fafc] text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center min-h-screen">
      <div className="max-w-7xl w-full space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5 z-10 w-full xl:w-auto">
            <div className="p-4 rounded-[1.5rem] shadow-lg flex items-center justify-center bg-gradient-to-br from-purple-600 to-fuchsia-600">
              <DivideCircle className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                LCM & HCF Master Notes
              </h1>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                <span className="font-bold px-2 py-0.5 rounded text-purple-700 bg-purple-50 border border-purple-100">
                  Complete Module
                </span>
                <span>•</span>
                <span>Numerical Ability</span>
              </div>
            </div>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-200 shadow-inner z-10 w-full overflow-x-auto scrollbar-hide">
            <TabButton 
              active={activeTab === 'theory'} 
              onClick={() => setActiveTab('theory')} 
              icon={<BookOpen size={16}/>} 
              label="Theory & Rules" 
            />
            <TabButton 
              active={activeTab === 'methods'} 
              onClick={() => setActiveTab('methods')} 
              icon={<Layers size={16}/>} 
              label="Finding Methods" 
            />
            <TabButton 
              active={activeTab === 'types'} 
              onClick={() => setActiveTab('types')} 
              icon={<Zap size={16}/>} 
              label="Tricks & Exam Types" 
            />
            <TabButton 
              active={activeTab === 'practice'} 
              onClick={() => setActiveTab('practice')} 
              icon={<Target size={16}/>} 
              label="Practice Vault" 
            />
          </div>
        </div>

        {/* --- TAB 1: THEORY & FORMULAS --- */}
        {activeTab === 'theory' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle 
              icon={<BookOpen size={28}/>} 
              title="Basic Formulas & Definitions" 
              colorClass="text-purple-600" 
            />
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* LCM Definition */}
              <div className="bg-fuchsia-50 border-2 border-fuchsia-200 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5"><Hash size={150}/></div>
                <h3 className="font-black text-xl text-fuchsia-800 mb-2 relative z-10">LCM (Least Common Multiple)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  LCM stands for Least Common Multiple (or Smallest Common Multiple). LCM or least common multiple of two numbers 4, 6 is denoted as LCM(4, 6). 
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-fuchsia-900 border border-fuchsia-100 relative z-10">
                  And the LCM is the smallest positive integer that is divisible by both 4 and 6, which is <strong>12</strong>.
                </div>
              </div>

              {/* HCF Definition */}
              <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-3xl relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-5"><DivideCircle size={150}/></div>
                <h3 className="font-black text-xl text-purple-800 mb-2 relative z-10">HCF (Highest Common Factor)</h3>
                <p className="text-slate-700 text-sm mb-3 relative z-10 font-medium">
                  HCF stands for Highest Common Factor. Greatest Common Divisor (GCD) or gcd of two or more positive integers is defined as the largest positive integer that divides the numbers without leaving the remainder.
                </p>
                <div className="bg-white p-4 rounded-xl shadow-sm text-sm font-mono text-purple-900 border border-purple-100 relative z-10">
                  <strong>Rule:</strong> HCF of the given numbers cannot be greater than any one of them.
                </div>
              </div>
            </div>

            {/* Core Formulas */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <FunctionSquare size={20} className="text-purple-500"/> Core Formulas
              </h3>
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-4 font-mono w-full">
                  <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                    <span className="text-purple-400 font-bold block mb-1 uppercase tracking-widest text-[10px]">Master Formula</span>
                    Product of Two numbers = (HCF of the two numbers) × (LCM of the two numbers)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-sm">
                      <span className="text-fuchsia-400 font-bold block mb-1 uppercase tracking-widest text-[10px]">To find HCF</span>
                      H.C.F = (Product of Two numbers) / L.C.M
                    </div>
                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 text-sm">
                      <span className="text-emerald-400 font-bold block mb-1 uppercase tracking-widest text-[10px]">To find LCM</span>
                      L.C.M = (Product of Two numbers) / H.C.F
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Rules / Shortcuts List */}
            <div>
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-500"/> Golden Rules & Shortcuts
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
                   <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0"><Hash size={16}/></div>
                   <p className="text-sm font-medium text-slate-700">The <strong>H.C.F</strong> of two or more numbers is smaller than or equal to the smallest number of given numbers.</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
                   <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0"><Hash size={16}/></div>
                   <p className="text-sm font-medium text-slate-700">The <strong>L.C.M</strong> of two or more numbers is greater than or equal to the greatest number of given numbers.</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0"><Target size={16}/></div>
                   <p className="text-sm font-medium text-slate-700">If 1 is the HCF of 2 numbers, then their LCM will be their <strong>product</strong>.</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-start gap-3">
                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0"><Target size={16}/></div>
                   <p className="text-sm font-medium text-slate-700">For two co-prime numbers, the HCF is <strong>always 1</strong>.</p>
                 </div>
              </div>

              <div className="mt-6 bg-amber-50 border border-amber-200 p-5 rounded-2xl">
                 <h4 className="font-black text-amber-800 uppercase tracking-widest text-xs mb-3">Remainder Shortcuts</h4>
                 <ul className="space-y-3 font-mono text-sm text-amber-900">
                   <li>• Smallest number exactly divisible by a, b, c = <strong>L.C.M of a, b, c</strong></li>
                   <li>• Smallest number divided by a, b, c leaves remainder R = <strong>(L.C.M of a, b, c) + R</strong></li>
                   <li>• Greatest number dividing a, b, c leaves remainder R = <strong>H.C.F of (a-R), (b-R) and (c-R)</strong></li>
                   <li>• Greatest number dividing x, y, z leaves remainders a, b, c = <strong>H.C.F of (x-a), (y-b) and (z-c)</strong></li>
                   <li>• Smallest number divided by x, y, z leaves remainders a, b, c where (x-a)=(y-b)=(z-c)=M = <strong>(L.C.M of x, y, z) - M</strong></li>
                 </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: METHODS --- */}
        {activeTab === 'methods' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle 
              icon={<Layers size={28}/>} 
              title="Methods to Find HCF & LCM" 
              colorClass="text-fuchsia-600" 
            />

            {/* HCF Methods */}
            <div className="space-y-6">
                <div className="inline-block bg-purple-600 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl text-sm shadow-md">
                    1. Methods for HCF
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h4 className="font-black text-slate-800 mb-3 uppercase tracking-widest text-sm">HCF by Prime Factorization</h4>
                        <p className="text-sm text-slate-600 mb-4">Example: Find HCF of 100, 125, and 180.</p>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 space-y-2 shadow-inner">
                            <div>100 = 2 × 2 × <strong className="text-purple-600">5</strong> × 5</div>
                            <div>125 = <strong className="text-purple-600">5</strong> × 5 × 5</div>
                            <div>180 = 3 × 3 × 2 × 2 × <strong className="text-purple-600">5</strong></div>
                            <div className="pt-2 border-t border-slate-100 text-purple-700 font-bold">
                                The common factor is 5.<br/>Therefore, HCF (100, 125, 180) = 5
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h4 className="font-black text-slate-800 mb-3 uppercase tracking-widest text-sm">HCF by Division Method</h4>
                        <p className="text-sm text-slate-600 mb-4">Steps: Divide larger by smaller. Divide divisor by remainder. Repeat till Remainder is 0. Last divisor = HCF.</p>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-sm text-emerald-400 space-y-1 shadow-inner whitespace-pre">
{`Example: 120 and 180

120 ) 180 ( 1
      120
    -------
       60 ) 120 ( 2
            120
          -------
            000`}
                        </div>
                        <div className="mt-3 font-bold text-sm text-slate-700">Last divisor is 60, so HCF = 60.</div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-slate-200 my-8"></div>

            {/* LCM Methods */}
            <div className="space-y-6">
                <div className="inline-block bg-fuchsia-600 text-white font-black uppercase tracking-widest px-4 py-2 rounded-xl text-sm shadow-md">
                    2. Methods for LCM
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h4 className="font-black text-slate-800 mb-3 uppercase tracking-widest text-sm">LCM by Prime Factorization</h4>
                        <p className="text-sm text-slate-600 mb-4">Multiply each prime factor the most number of times it occurs in any number.</p>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 font-mono text-sm text-slate-800 space-y-2 shadow-inner">
                            <div>Example: 25 and 35</div>
                            <div>25 = <strong>5 × 5</strong> (occurrence: two times)</div>
                            <div>35 = <strong>7</strong> × 5 (occurrence: one time)</div>
                            <div className="pt-2 border-t border-slate-100 text-fuchsia-700 font-bold">
                                LCM = 7 × 5 × 5 = 175
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl">
                        <h4 className="font-black text-slate-800 mb-3 uppercase tracking-widest text-sm">LCM by Division Method</h4>
                        <p className="text-sm text-slate-600 mb-4">Example: Solve LCM of (25,35) by division method.</p>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 font-mono text-sm text-emerald-400 space-y-1 shadow-inner whitespace-pre">
{` 5 | 25, 35
   ----------
 5 |  5,  7
   ---------
 7 |  1,  7
   ---------
   |  1,  1`}
                        </div>
                        <div className="mt-3 font-bold text-sm text-slate-700 font-mono">LCM = 5 × 5 × 7 = 175</div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: TRICKS & EXAM TYPES --- */}
        {activeTab === 'types' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-10">
            <SectionTitle 
              icon={<Zap size={28}/>} 
              title="Exam Types & Tricks" 
              colorClass="text-amber-500" 
            />

            {/* Quick Math Tricks */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white">
                <h3 className="font-black text-amber-400 text-lg uppercase tracking-widest mb-6 flex items-center gap-2"><Zap size={20}/> Speed Math Tricks</h3>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-bold text-emerald-400 mb-2 border-b border-slate-700 pb-2">Trick: Find HCF Easily</h4>
                        <p className="text-sm text-slate-300 mb-3">Find the difference between numbers. Check if numbers are divisible by the difference. If not, check its factors. (Use least difference if &gt;2 numbers).</p>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <strong>Ex 1: HCF of 12 & 16</strong><br/>
                                Diff = 4. Both 12 and 16 div by 4. ➔ <span className="text-emerald-300">HCF = 4</span>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <strong>Ex 2: HCF of 18 & 22</strong><br/>
                                Diff = 4. 18, 22 NOT div by 4.<br/>
                                Factors of 4 = 2×2×1.<br/>
                                18, 22 div by 2. ➔ <span className="text-emerald-300">HCF = 2</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-fuchsia-400 mb-2 border-b border-slate-700 pb-2">Trick: Find LCM Easily</h4>
                        <p className="text-sm text-slate-300 mb-3">Choose largest number. Check if divisible by others. If not, multiply it by 2, 3, etc., until it is divisible by all.</p>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <strong>Ex 1: LCM of 2, 4, 8, 16</strong><br/>
                                Largest = 16. It is div by 2, 4, 8. ➔ <span className="text-fuchsia-300">LCM = 16</span>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <strong>Ex 2: LCM of 2, 3, 7, 21</strong><br/>
                                Largest = 21. Div by 3,7 but not 2.<br/>
                                21 × 2 = 42.<br/>
                                42 div by 2,3,7. ➔ <span className="text-fuchsia-300">LCM = 42</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Standard Exam Types */}
            <div>
                <h3 className="font-black text-slate-800 text-lg uppercase tracking-widest border-b pb-2 mb-6 flex items-center gap-2">
                    <Target size={20} className="text-rose-500"/> 6 Standard Exam Patterns
                </h3>
                
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Type 1 */}
                    <QuestionCard 
                        qNum="Type 1" badge="Greatest/Smallest No."
                        question="Find the greatest 5 digit number divisible by 5, 15, 20, and 25"
                        options={["A. 99900", "B. 99000", "C. 99990", "D. 90990"]}
                        ans="A"
                        solution={`LCM of 5, 15, 20, and 25 is 300.
The greatest 5 digit number is 99999.
99999 / 300 = 333.33
Therefore, the highest 5 digit number divisible by 300 would be 333 * 300 = 99900.`}
                    />

                    {/* Type 2 */}
                    <QuestionCard 
                        qNum="Type 2" badge="Ratio & Product"
                        question="The product of two numbers is 3888. If the H.C.F. of these numbers is 36, then the greater number is:"
                        options={["A. 110", "B. 108", "C. 36", "D. 120"]}
                        ans="B"
                        solution={`Let the two numbers be 36x and 36y.
36x * 36y = 3888
xy = 3888 / (36*36)
xy = 3

Co-primes with product 3 are (1, 3).
Therefore, required numbers are 36*1 = 36 and 36*3 = 108.
The greatest number is 108.`}
                    />

                    {/* Type 3 */}
                    <QuestionCard 
                        qNum="Type 3" badge="Sum of Reciprocals"
                        question="Sum of two numbers is 60 and the H.C.F. and L.C.M. of these numbers are 5 and 100 respectively, then the sum of the reciprocals of the numbers is equals to:"
                        options={["A. 3/25", "B. 11/220", "C. 21/120", "D. 11/320"]}
                        ans="A"
                        solution={`Let numbers be a and b.
Given: a + b = 60
a × b = HCF × LCM = 5 × 100 = 500

Sum of reciprocals:
1/a + 1/b = (a + b) / (a × b)
= 60 / 500
= 3/25`}
                    />

                    {/* Type 4 */}
                    <QuestionCard 
                        qNum="Type 4" badge="Biggest Container"
                        question="Three different containers contain different quantities of a mixture of Sugar and rice whose measurements are 403 grams, 434 grams and 465 grams. What biggest measure must be there to measure all the different quantities exactly?"
                        options={["A. 31 grams", "B. 21 grams", "C. 41 grams", "D. 30 litres"]}
                        ans="A"
                        solution={`Biggest measure = HCF of the quantities.
Prime factorization:
403 = 13 × 31
434 = 2 × 7 × 31
465 = 3 × 5 × 31

H.C.F of 403, 434 and 465 = 31`}
                    />

                    {/* Type 5 */}
                    <QuestionCard 
                        qNum="Type 5" badge="Tolling Bells"
                        question="Six bells commence tolling together and toll at intervals of 2, 4, 6, 8, 10 and 12 seconds respectively. In 30 minutes, how many times do they toll together?"
                        options={["A. 8", "B. 16", "C. 9", "D. 10"]}
                        ans="B"
                        solution={`L.C.M. of 2, 4, 6, 8, 10, 12 is 120 seconds.
Hence, the bells toll together after every 120 seconds (2 minutes).
In 30 minutes, number of times they toll together = (30 / 2) + 1 = 16.
(Added 1 for the initial toll at 0 minutes).`}
                    />

                    {/* Type 6 */}
                    <QuestionCard 
                        qNum="Type 6" badge="Circular Runner"
                        question="Two people P and Q start running towards a circular track of length 400m in opposite directions with initial speeds of 10m/s and 40m/s respectively. Whenever they meet, P's speed doubles and Q's speed halves. After what time from start will they meet for 3rd time?"
                        options={["A. 30 seconds", "B. 26 seconds", "C. 10 seconds", "D. 20 seconds"]}
                        ans="B"
                        solution={`Opposite directions -> Relative speed = S1 + S2
Time 1st meet = 400 / (40+10) = 8 sec.
Now P=20m/s, Q=20m/s.
Time 2nd meet = 400 / (20+20) = 10 sec.
Now P=40m/s, Q=10m/s.
Time 3rd meet = 400 / (10+40) = 8 sec.
Total time = 8 + 10 + 8 = 26 seconds.`}
                    />
                </div>
            </div>
          </div>
        )}

        {/* --- TAB 4: PRACTICE VAULT --- */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-200 shadow-sm animate-in fade-in duration-500 space-y-8">
            <SectionTitle 
              icon={<Target size={28}/>} 
              title="Practice Vault" 
              colorClass="text-emerald-600" 
            />
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-800 flex gap-4 items-center shadow-sm">
              <BrainCircuit size={40} className="shrink-0 text-emerald-500"/>
              <div>
                <h3 className="font-black text-lg uppercase tracking-widest">Comprehensive Practice</h3>
                <p className="text-sm font-medium mt-1">
                  13 complete questions covering all LCM and HCF patterns.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* 3 Standalone Questions from Prompt */}
                <QuestionCard 
                    qNum="Q1" badge="MCQ"
                    question="Calculate the highest number that will divide 43, 91 and 183 and leaves the same remainder in each case."
                    options={["A. 4", "B. 7", "C. 9", "D. 13"]}
                    ans="A"
                    solution={`Trick: Find the differences between numbers and get their HCF.
Differences:
183 - 91 = 92
183 - 43 = 140
91 - 43 = 48

HCF (48, 92, 140):
48 = 2×2×2×2×3
92 = 2×2×23
140 = 2×2×5×7
HCF = 2×2 = 4.`}
                />

                <QuestionCard 
                    qNum="Q2" badge="MCQ"
                    question="Which of the following is greatest number of four digits which is divisible by 15, 25, 40 and 75?"
                    options={["A. 9700", "B. 9600", "C. 9800", "D. 9650"]}
                    ans="B"
                    solution={`Greatest number of 4-digits is 9999.
LCM of 15, 25, 40, 75 = 600.
On dividing 9999 by 600, remainder is 399.
Required number = 9999 - 399 = 9600.

Alt: 9999/600 = 16.66. Ignore decimal, 16 * 600 = 9600.`}
                />

                <QuestionCard 
                    qNum="Q3" badge="MCQ"
                    question="The greatest possible length which can be used to measure exactly the lengths 7m, 3m 85cm, 12m 95cm is:"
                    options={["A. 25 cm", "B. 15 cm", "C. 35 cm", "D. 55 cm"]}
                    ans="C"
                    solution={`Convert to cm: 700 cm, 385 cm, 1295 cm.
Required length = H.C.F. of 700, 385 and 1295.
HCF = 35 cm.`}
                />

                {/* 10 Practice Questions from Prompt */}
                <QuestionCard 
                    qNum="Practice 1" badge="Direct Math"
                    question="Find the L.C.M of 15, 30, 45"
                    solution={`2 | 15, 30, 45
3 | 15, 15, 45
3 | 5, 5, 15
5 | 5, 5, 5
  | 1, 1, 1
L.C.M = 2 * 3 * 3 * 5 = 90`}
                />

                <QuestionCard 
                    qNum="Practice 2" badge="Direct Math"
                    question="The given ratio of two numbers is 3:2. If the L.C.M of them is 30, then calculate their sum."
                    solution={`Let numbers be 3x and 2x.
Product = LCM × HCF
HCF of 3x, 2x is x.
(3x)(2x) = 30(x)
6x² = 30x
6x = 30 ➔ x = 5

Numbers: 3(5)=15, 2(5)=10
Sum = 15 + 10 = 25.`}
                />

                <QuestionCard 
                    qNum="Practice 3" badge="Direct Math"
                    question="Find the L.C.M of 25, 35, and 55"
                    solution={`5 | 25, 35, 55
5 |  5,  7, 11
7 |  1,  7, 11
11|  1,  1, 11
  |  1,  1,  1
L.C.M = 5 * 5 * 7 * 11 = 1925`}
                />

                <QuestionCard 
                    qNum="Practice 4" badge="Direct Math"
                    question="Calculate the HCF of 22 and 33"
                    solution={`22 = 2 * 11
33 = 3 * 11
So the HCF will be 11.`}
                />

                <QuestionCard 
                    qNum="Practice 5" badge="Direct Math"
                    question="If 20 is the HCF of two particular numbers and the other two factors of their LCM are 10 and 12, find the larger number?"
                    solution={`HCF = 20.
Other factors are 10 and 12.
First number = 20 * 10 = 200.
Second number = 20 * 12 = 240.
The larger number is 240.`}
                />

                <QuestionCard 
                    qNum="Practice 6" badge="Direct Math"
                    question="The HCF of three specific numbers 6, 12, and 18 is 24 , find the LCM?"
                    solution={`(6 * 12 * 18) / 24
The next number will be = 54`}
                />

                <QuestionCard 
                    qNum="Practice 7" badge="Direct Math"
                    question="The two specific numbers are in the ratio 6:7, if the HCF of the given numbers is 30, what will be the numbers?"
                    solution={`Let numbers be 6y and 7y.
HCF = 30.
Numbers will be:
6 * 30 = 180
7 * 30 = 210`}
                />

                <QuestionCard 
                    qNum="Practice 8" badge="Direct Math"
                    question="Determine the largest length of the tape, which can measure tape of 5 cm, 7cm, and 13 cm?"
                    solution={`As all these numbers have no factors and are considered as prime numbers, so their HCF will be 1.`}
                />

                <QuestionCard 
                    qNum="Practice 9" badge="Direct Math"
                    question="The HCF of two numbers is 45, and their LCM is 90, if one specific number is 9, find the other number."
                    solution={`HCF * LCM = Product of Numbers
45 * 90 = 9 * x
x = (45 * 90) / 9 = 450`}
                />

                <QuestionCard 
                    qNum="Practice 10" badge="Direct Math"
                    question="Street lamps start at the interval of 5, 10, 15, 20, and 25 seconds, calculate the number in which the street lamps began together in 40 minutes."
                    solution={`Convert 40 mins to seconds: 40 * 60 = 2400 seconds.
LCM of 5, 10, 15, 20, 25 = 300 seconds.
Divide total interval by LCM:
2400 / 300 = 8.
They will start together 8 times within a 40-minute interval.`}
                />

            </div>
          </div>
        )}
      </div>
    </div>
  );
}