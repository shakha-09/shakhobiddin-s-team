import React, { useState } from 'react';
import { Database, RotateCcw, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSettings: React.FC = () => {
  const { resetToDemoData, listings, bookings, reviews } = useStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm("Barcha ma'lumotlarni dastlabki demo holatiga qaytarishni xohlaysizmi?")) {
      resetToDemoData();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 4000);
    }
  };

  const handleExportJson = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      listings,
      bookings,
      reviews
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `toymakoni-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">
          Tizim Sozlamalari va Baza Nazorati
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Ma'lumotlar bazasi, zaxira nusxa olish va demo ma'lumotlarni qayta tiklash
        </p>
      </div>

      <div className="space-y-6">
        {/* Reset Database to Seed Data */}
        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Dastlabki Demo Ma'lumotlarni Qayta Tiklash</h3>
              <p className="text-xs text-gray-500">
                To'yxonalar, ZAGS mashinalari va xonandalar ro'yxatini standart boyitilgan holatiga qaytaradi.
              </p>
            </div>
          </div>

          {resetSuccess && (
            <div className="rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700 flex items-center gap-2 border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Ma'lumotlar muvaffaqiyatli dastlabki holatga qaytarildi!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition-colors shadow-xs"
          >
            Dastlabki ma'lumotlarni tiklash
          </button>
        </div>

        {/* JSON Backup Export */}
        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Zaxira Nusxa Yuklab Olish (JSON Export)</h3>
              <p className="text-xs text-gray-500">
                Barcha e'lonlar, bandlik holatlari va kelib tushgan buyurtmalarni JSON fayl sifatida yuklang.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportJson}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            Zaxira nusxani yuklab olish (.json)
          </button>
        </div>

        {/* System Information */}
        <div className="rounded-3xl bg-white p-6 border border-gray-200 shadow-xs space-y-3 text-xs text-gray-600">
          <h3 className="text-sm font-bold text-gray-900">Tizim holati</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-gray-400">Jami xizmatlar:</div>
              <div className="text-sm font-bold text-gray-900">{listings.length} ta</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-gray-400">Jami arizalar:</div>
              <div className="text-sm font-bold text-gray-900">{bookings.length} ta</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-gray-400">Sharhlar soni:</div>
              <div className="text-sm font-bold text-gray-900">{reviews.length} ta</div>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <div className="text-gray-400">Saqlash formati:</div>
              <div className="text-sm font-bold text-emerald-600">LocalStorage Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
