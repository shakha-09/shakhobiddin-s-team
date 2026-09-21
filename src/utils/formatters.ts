import { CategoryType } from '../types';

export const formatUZS = (amount: number): string => {
  if (isNaN(amount)) return "0 so'm";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " so'm";
};

export const formatUzbekDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const months = [
    'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
    'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'
  ];
  try {
    const [year, month, day] = dateStr.split('-');
    const monthIndex = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)}-${months[monthIndex]} ${year}-yil`;
  } catch {
    return dateStr;
  }
};

export const getCategoryMeta = (category: CategoryType) => {
  switch (category) {
    case 'wedding-hall':
      return {
        label: "To'yxonalar",
        singular: "To'yxona",
        description: "Eng saralangan muhtasham to'y va tantanalar zallari",
        color: 'rose',
        path: '/wedding-halls'
      };
    case 'car':
      return {
        label: 'Mashinalar korteji',
        singular: 'Kortej avtomobili',
        description: 'To\'y kortejlari uchun lyuks va zamonaviy avtomobillar',
        color: 'blue',
        path: '/cars'
      };
    case 'artist':
      return {
        label: 'Xonandalar',
        singular: 'Xonanda',
        description: 'Estrada va milliy yo\'nalishdagi sevimli san\'atkorlar',
        color: 'emerald',
        path: '/artists'
      };
    case 'famous-artist':
      return {
        label: 'Mashhur Yulduzlar',
        singular: 'Yulduz',
        description: 'O\'zbek estradasining eng mashhur to\'ybop yulduzlari',
        color: 'amber',
        path: '/famous-artists'
      };
    case 'host':
      return {
        label: 'Boshlovchilar / Davra raislari',
        singular: 'Boshlovchi',
        description: 'To\'yingizni yuksak madaniyat bilan boshqaruvchi boshlovchilar',
        color: 'purple',
        path: '/hosts'
      };
    case 'entertainer':
      return {
        label: 'Qiziqchilar & Shou',
        singular: 'Qiziqchi',
        description: 'To\'y davrasiga samimiy kulgi va ko\'tarinki kayfiyat baxsh etuvchilar',
        color: 'indigo',
        path: '/entertainers'
      };
    default:
      return {
        label: 'Xizmatlar',
        singular: 'Xizmat',
        description: 'Barcha to\'y xizmatlari',
        color: 'gray',
        path: '/search'
      };
  }
};
