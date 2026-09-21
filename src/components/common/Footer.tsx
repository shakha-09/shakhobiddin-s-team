import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Send, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-gray-200 bg-white text-gray-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-950 text-amber-300 shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight text-gray-950">
                  To'y<span className="text-amber-700 italic font-normal">Makoni</span>
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
                  O'zbekiston To'y Xizmatlari Portali
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed max-w-sm tracking-normal">
              O'zbekistonda to'y va tantanalarni nafis, qulay va tejamkor tashkillashtirish uchun yagona portal. 
              To'yxonalar, mashinalar kortejlari, xonandalar, davra raislari va barcha tantana xizmatlari bitta joyda.
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-800 bg-gray-50 p-3 rounded-2xl border border-gray-200 w-fit shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ma'lumotlar tekshiriladi va to'y xizmatlari bilan muvofiqlashtiriladi</span>
            </div>
          </div>

          {/* Col 2: To'y xizmatlari */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">
              To'y Xizmatlari
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm tracking-normal">
              <li>
                <button 
                  onClick={() => onNavigate('/wedding-halls')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  To'yxonalar (Zallar)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/cars')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Mashinalar korteji
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/artists')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Xonandalar va Guruhlar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/famous-artists')}
                  className="hover:text-amber-700 transition-colors text-left flex items-center gap-1.5 cursor-pointer text-gray-700"
                >
                  <span>Mashhur Estrada Yulduzlari</span>
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] px-1.5 py-0.2 rounded-full font-bold">VIP</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/hosts')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Boshlovchilar / Davra Raisi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/entertainers')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Qiziqchilar va Shou Dasturlar
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Rejalashtirish */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">
              Rejalashtirish
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm tracking-normal">
              <li>
                <button 
                  onClick={() => onNavigate('/budget-calculator')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  To'y Budjetini Hisoblagich
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/my-wedding')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Mening To'yim (Reja)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/favorites')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Saqlangan Xizmatlar
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('/search')}
                  className="hover:text-amber-700 transition-colors text-left cursor-pointer text-gray-700"
                >
                  Kengaytirilgan Qidiruv
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Bog'lanish & Ma'muriyat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-950 mb-4">
              Aloqa va Ma'muriyat
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600 tracking-normal">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-700 shrink-0" />
                <span>O'zbekiston, Toshkent shahri</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-700 shrink-0" />
                <a href="tel:+998712000000" className="hover:text-amber-700 transition-colors">
                  +998 71 200 00 00
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-700 shrink-0" />
                <span>info@toymakoni.uz</span>
              </li>
              <li className="pt-2">
                <button
                  onClick={() => onNavigate('/admin')}
                  className="text-xs text-gray-500 hover:text-gray-900 underline font-medium cursor-pointer"
                >
                  Platforma Administrator Paneli
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer on demo data & Copyright */}
        <div id="footer-copyright-section" className="mt-12 pt-8 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4 tracking-normal">
          <div>
            <p>
              © {new Date().getFullYear()} To'yMakoni.uz. Barcha huquqlar himoyalangan. 
              <span className="block sm:inline sm:ml-2 text-gray-500">
                * Ko'rgazmali profillar narxlari va xizmatlari platforma orqali kelishiladi.
              </span>
            </p>
            <p id="site-owner-credit" className="mt-1.5 text-gray-700 font-medium">
              Owner: <span className="text-gray-950 font-bold">Shaxobiddin Sharipov</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              To'yingiz muborak bo'lsin!
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
