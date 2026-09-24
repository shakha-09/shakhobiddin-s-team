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

export const formatUzbekPhoneNumber = (input: string): string => {
  const digits = input.replace(/\D/g, '');
  let nationalNumber = digits;
  if (digits.startsWith('998')) {
    nationalNumber = digits.slice(3);
  }
  nationalNumber = nationalNumber.slice(0, 9);
  
  if (nationalNumber.length === 0) return '+998 ';
  if (nationalNumber.length <= 2) return `+998 ${nationalNumber}`;
  if (nationalNumber.length <= 5) return `+998 ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2)}`;
  if (nationalNumber.length <= 7) return `+998 ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
  return `+998 ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7, 9)}`;
};

export const isValidUzbekPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('998');
};

export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  return text.trim().replace(/[<>]/g, '');
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
    case 'videographer':
      return {
        label: 'Videochilar & Media',
        singular: 'Videochi',
        description: 'To\'y tantanalari uchun professional 4K video, multikam va dron tasvirga olish xizmatlari',
        color: 'rose',
        path: '/videochilar'
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
