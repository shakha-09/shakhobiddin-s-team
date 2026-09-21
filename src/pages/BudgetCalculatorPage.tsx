import React, { useState } from 'react';
import { 
  Calculator, 
  Building2, 
  Car, 
  Music, 
  Mic, 
  Camera, 
  Sparkles, 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatUZS } from '../utils/formatters';

interface BudgetCalculatorPageProps {
  onNavigate: (path: string) => void;
}

interface BudgetItem {
  id: string;
  category: string;
  title: string;
  amount: number;
  icon: any;
  notes?: string;
}

export const BudgetCalculatorPage: React.FC<BudgetCalculatorPageProps> = ({ onNavigate }) => {
  const { listings, updateMyWedding, myWedding } = useStore();

  const weddingHalls = listings.filter(l => l.category === 'wedding-hall');
  const cars = listings.filter(l => l.category === 'car');
  const artists = listings.filter(l => l.category === 'artist' || l.category === 'famous-artist');
  const hosts = listings.filter(l => l.category === 'host');

  // Initial line items
  const [items, setItems] = useState<BudgetItem[]>([
    {
      id: 'item-hall',
      category: 'To\'yxona (Zal)',
      title: 'Versal Grand Hall (Taxminiy narx)',
      amount: 25000000,
      icon: Building2,
      notes: '600 kishilik asosiy zal'
    },
    {
      id: 'item-car',
      category: 'ZAGS Mashinasi',
      title: 'Mercedes-Benz S-Class W223 Maybach',
      amount: 3200000,
      icon: Car,
      notes: 'Haydovchi bilan 8 soat'
    },
    {
      id: 'item-artist',
      category: 'Xonanda / Estrada',
      title: 'Xurshid Rasulov (To\'y dasturi)',
      amount: 12000000,
      icon: Music,
      notes: 'Jonli ijro'
    },
    {
      id: 'item-host',
      category: 'Boshlovchi (Davra raisi)',
      title: 'Otabek Mahkamov',
      amount: 6000000,
      icon: Mic,
      notes: 'To\'y boshidan oxirigacha'
    },
    {
      id: 'item-photo',
      category: 'Foto & Videoga olish',
      title: 'Professional to\'y syomkasi (Love story + To\'y kuni)',
      amount: 5000000,
      icon: Camera,
      notes: '2 operator, kran va montaj'
    },
    {
      id: 'item-decor',
      category: 'Gullar va Bezatish',
      title: 'Kelin-kuyov stoli va fotozona dizayni',
      amount: 4000000,
      icon: Sparkles,
      notes: 'Yangi gullar va neontoshlar'
    },
    {
      id: 'item-cake',
      category: 'To\'y torti va Shirinliklar',
      title: '4 qavatli muhtasham to\'y torti',
      amount: 2500000,
      icon: UtensilsCrossed,
      notes: '300 kishilik mehmonlar uchun'
    }
  ]);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemAmount, setNewItemAmount] = useState<number | ''>('');
  const [newItemCategory, setNewItemCategory] = useState('Boshqa xizmat');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Total budget sum
  const totalBudget = items.reduce((acc, item) => acc + item.amount, 0);

  const handleAmountChange = (id: string, newAmount: number) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, amount: Math.max(0, newAmount) } : it))
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, title: newTitle } : it))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim() || !newItemAmount) return;

    const newItem: BudgetItem = {
      id: `custom-${Date.now()}`,
      category: newItemCategory,
      title: newItemTitle.trim(),
      amount: Number(newItemAmount),
      icon: Sparkles
    };

    setItems(prev => [...prev, newItem]);
    setNewItemTitle('');
    setNewItemAmount('');
  };

  const handleSaveToMyWedding = () => {
    updateMyWedding({
      budgetUZS: totalBudget
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setItems([
      { id: '1', category: 'To\'yxona', title: 'To\'yxona zali', amount: 20000000, icon: Building2 },
      { id: '2', category: 'ZAGS Mashinasi', title: 'Avtomobil korteji', amount: 3000000, icon: Car },
      { id: '3', category: 'Xonanda', title: 'Xonanda chiqishi', amount: 10000000, icon: Music },
      { id: '4', category: 'Boshlovchi', title: 'Davra raisi', amount: 5000000, icon: Mic }
    ]);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>To'y Byudjeti</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            To'y Xarajatlari Kalkulyatori
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
            To'y tantanasi uchun zarur barcha xizmatlarning narxlarini hisoblang, o'zgartiring va 
            taxminiy xarajatlar rejasini tuzing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 cols): Line items list & custom adding */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">
                  Xarajatlar ro'yxati ({items.length} ta modda)
                </h2>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-rose-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Dastlabki holat</span>
                </button>
              </div>

              {/* Items loop */}
              <div className="space-y-3">
                {items.map((item) => {
                  const Icon = item.icon || Sparkles;
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 transition-all hover:bg-white hover:border-rose-200"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 shadow-xs border border-gray-100 shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                            {item.category}
                          </span>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleTitleChange(item.id, e.target.value)}
                            className="w-full text-xs sm:text-sm font-semibold text-gray-900 bg-transparent border-0 border-b border-transparent focus:border-rose-400 focus:outline-hidden py-0.5 truncate"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="relative">
                          <input
                            type="number"
                            step={500000}
                            min={0}
                            value={item.amount}
                            onChange={(e) => handleAmountChange(item.id, Number(e.target.value))}
                            className="w-36 sm:w-40 rounded-xl border border-gray-300 bg-white py-1.5 px-3 text-right text-xs sm:text-sm font-bold text-gray-900 focus:border-rose-500 focus:outline-hidden"
                          />
                          <span className="text-[10px] text-gray-400 block text-right pr-1">so'm</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Item Form */}
              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3">Yangi xarajat qo'shish</h3>
                <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <div className="sm:col-span-4">
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs font-medium text-gray-800"
                    >
                      <option value="To'yxona">To'yxona</option>
                      <option value="ZAGS Mashinasi">ZAGS Mashinasi</option>
                      <option value="Xonanda">Xonanda</option>
                      <option value="Boshlovchi">Boshlovchi</option>
                      <option value="Foto & Video">Foto & Video</option>
                      <option value="Kelin libosi & Kostyum">Kelin libosi & Kostyum</option>
                      <option value="Bezatish">Bezatish</option>
                      <option value="Boshqa xizmat">Boshqa xizmat</option>
                    </select>
                  </div>
                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      required
                      placeholder="Xizmat nomi (masalan: Sarpo xarajatlari)"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs text-gray-900"
                    />
                  </div>
                  <div className="sm:col-span-3 flex gap-2">
                    <input
                      type="number"
                      required
                      placeholder="Narxi (so'm)"
                      value={newItemAmount}
                      onChange={(e) => setNewItemAmount(e.target.value ? Number(e.target.value) : '')}
                      className="w-full rounded-xl border border-gray-300 bg-white p-2 text-xs text-gray-900"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-gray-900 px-3 text-white hover:bg-gray-800 transition-colors"
                      title="Qo'shish"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Total Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
            <div className="rounded-3xl bg-linear-to-br from-rose-900 via-rose-800 to-amber-900 p-6 sm:p-7 text-white shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-rose-200">
                  Umumiy taxminiy budjet:
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {formatUZS(totalBudget)}
                </div>
                <p className="text-[11px] text-rose-200/80 mt-1">
                  {items.length} ta asosiy to'y xizmatlari hisob-kitobiga ko'ra
                </p>
              </div>

              {/* Progress visual */}
              <div className="space-y-2 pt-2 border-t border-rose-700/60">
                <div className="flex justify-between text-xs text-rose-200">
                  <span>Rejalashtirilgan limit:</span>
                  <span className="font-bold text-white">{formatUZS(myWedding.budgetUZS || 75000000)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-rose-950/60 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full"
                    style={{
                      width: `${Math.min(100, (totalBudget / (myWedding.budgetUZS || 75000000)) * 100)}%`
                    }}
                  />
                </div>
              </div>

              {/* Action: Save to My Wedding */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveToMyWedding}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs sm:text-sm font-bold text-gray-900 hover:bg-rose-50 shadow-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ushbu hisobni "Mening to'yim"ga saqlash</span>
                </button>

                {savedSuccess && (
                  <p className="text-center text-xs font-semibold text-emerald-300">
                    ✓ Budjet "Mening to'yim" rejasida yangilandi!
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('/my-wedding')}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-400/40 py-2.5 text-xs font-semibold text-rose-100 hover:bg-rose-700/50 transition-colors"
                >
                  <span>To'liq to'y rejasini ko'rish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
