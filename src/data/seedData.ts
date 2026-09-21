import { ListingItem, BookingRequest, ReviewItem } from '../types';

export const INITIAL_LISTINGS: ListingItem[] = [
  // 1. WEDDING HALLS
  {
    id: 'hall-1',
    category: 'wedding-hall',
    title: 'Versal Grand Hall',
    subtitle: 'Hashamatli interyer va 600 kishilik premium to\'yxona',
    slug: 'versal-grand-hall',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 48,
    price: 25000000,
    priceType: 'per_day',
    priceLabel: '25 000 000 so\'mdan (yoki 220 000 so\'m/kishi)',
    capacity: { min: 250, max: 650 },
    location: {
      region: 'Toshkent shahri',
      district: 'Chilonzor',
      address: 'Chilonzor tumani, Bunyodkor shox ko\'chasi, 42-uy',
      coordinates: { lat: 41.275, lng: 69.208 }
    },
    coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf68fe9b1af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Versal Grand Hall — Toshkentning Chilonzor tumanida joylashgan eng zamonaviy va hashamatli to\'yxonalardan biri. Yevropa klassikasi va sharqona mehmondo\'stlik uyg\'unligi. Katta kristall qandillar, eng so\'nggi modeldagi audio tizim va professional yorug\'lik uskunalari to\'yingizni unutilmas qiladi.',
    amenities: [
      '600 kishilik keng zal',
      'Konditsioner & iqlim nazorati',
      'Professional konsert ovoz tizimi',
      'Ulkan LED ekranlar (4K)',
      '200+ avtomashina uchun bepul turargoh',
      'Kelin-kuyov alohida hashamatli xonasi',
      'Maxsus fotozona va shourum',
      'Generator (elektr uzilmasligi kafolati)'
    ],
    facilities: ['Konditsioner', 'LED Ekran', 'Avtoturargoh', 'Saxna', 'Wi-Fi', 'VIP Xona', 'Bolalar xonasi'],
    availability: {
      '2026-09-21': 'available',
      '2026-09-22': 'booked',
      '2026-09-23': 'available',
      '2026-09-24': 'booked',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked',
      '2026-09-28': 'available',
      '2026-10-02': 'booked',
      '2026-10-03': 'booked',
      '2026-10-04': 'available',
      '2026-10-10': 'booked'
    },
    contact: {
      phone: '+998 71 200 45 45',
      secondaryPhone: '+998 90 123 45 67',
      telegram: 'versal_grand_tashkent',
      instagram: 'versal_grand_hall'
    },
    status: 'published',
    createdAt: '2026-01-15',
    updatedAt: '2026-09-18',
    viewsCount: 1420
  },
  {
    id: 'hall-2',
    category: 'wedding-hall',
    title: 'Yakkasaroy Palace',
    subtitle: 'Poytaxt markazida saroy uslubidagi to\'y maskani',
    slug: 'yakkasaroy-palace',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 39,
    price: 22000000,
    priceType: 'per_day',
    priceLabel: '22 000 000 so\'mdan',
    capacity: { min: 200, max: 500 },
    location: {
      region: 'Toshkent shahri',
      district: 'Yakkasaroy',
      address: 'Yakkasaroy tumani, Shota Rustaveli ko\'chasi, 88',
      coordinates: { lat: 41.285, lng: 69.245 }
    },
    coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Yakkasaroy Palace to\'yxonasi o\'zining muhtasham zali, yuqori darajadagi xizmati va saroyona muhiti bilan mashhur. Bizning tajribali oshpazlarimiz milliy va yevropacha tansiq taomlarni tayyorlashadi.',
    amenities: [
      '500 o\'rinli asosiy tantanalar zali',
      'Markaziy konditsioner tizimi',
      'Jonli ijro uchun keng saxna',
      'Qo\'riqlanadigan keng avtoturargoh',
      'Oliy toifali servis va ofitsiantlar'
    ],
    facilities: ['Konditsioner', 'LED Ekran', 'Avtoturargoh', 'Saxna', 'VIP Xona'],
    availability: {
      '2026-09-22': 'available',
      '2026-09-23': 'booked',
      '2026-09-24': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked',
      '2026-09-27': 'available'
    },
    contact: {
      phone: '+998 71 255 12 34',
      telegram: 'yakkasaroy_palace',
      instagram: 'yakkasaroy_palace'
    },
    status: 'published',
    createdAt: '2026-02-10',
    updatedAt: '2026-09-17',
    viewsCount: 980
  },
  {
    id: 'hall-3',
    category: 'wedding-hall',
    title: 'Mumtoz Tantana Zali',
    subtitle: 'Shayxontohur tumanida fayzli va qulay to\'yxona',
    slug: 'mumtoz-tantana-zali',
    featured: false,
    isDemo: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 31,
    price: 18000000,
    priceType: 'per_day',
    priceLabel: '18 000 000 so\'mdan',
    capacity: { min: 150, max: 450 },
    location: {
      region: 'Toshkent shahri',
      district: 'Shayxontohur',
      address: 'Shayxontohur tumani, Ko\'kcha darvoza ko\'chasi, 15',
      coordinates: { lat: 41.325, lng: 69.215 }
    },
    coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Mumtoz to\'yxonasi — milliy an\'analarga sodiq holda o\'tkaziladigan to\'y va tantanalar uchun ajoyib maskan. Milliy taomlar, samimiy xizmat va qulay narxlar.',
    amenities: [
      '450 o\'rinli zal',
      'Yaxshi ventilyatsiya va sovitish',
      'Milliy va zamonaviy bezaklar',
      'Katta avtoturargoh'
    ],
    facilities: ['Konditsioner', 'Avtoturargoh', 'Saxna', 'VIP Xona'],
    availability: {
      '2026-09-23': 'available',
      '2026-09-24': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked'
    },
    contact: {
      phone: '+998 90 987 65 43',
      telegram: 'mumtoz_toshkent'
    },
    status: 'published',
    createdAt: '2026-03-01',
    updatedAt: '2026-09-15',
    viewsCount: 750
  },
  {
    id: 'hall-4',
    category: 'wedding-hall',
    title: 'Afrosiyob Palace Samarqand',
    subtitle: 'Samarqandning eng nufuzli 650 kishilik to\'yxonasi',
    slug: 'afrosiyob-palace-samarqand',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 52,
    price: 24000000,
    priceType: 'per_day',
    priceLabel: '24 000 000 so\'mdan',
    capacity: { min: 200, max: 650 },
    location: {
      region: 'Samarqand viloyati',
      district: 'Samarqand shahri',
      address: 'Samarqand shahri, Registon shox ko\'chasi, 112',
      coordinates: { lat: 39.654, lng: 66.975 }
    },
    coverImage: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Qadimiy va navqiron Samarqand shahrida eng zamonaviy to\'y saroyi. Katta xoll, bejirim gullar bilan bezatilgan arka va eng yuqori darajadagi xizmat.',
    amenities: [
      '650 o\'rinli shohona zal',
      'Kuchli iqlim nazorati',
      '250 mashinalik turargoh',
      'Samarqand palovi va tansiq taomlar'
    ],
    facilities: ['Konditsioner', 'LED Ekran', 'Avtoturargoh', 'Saxna'],
    availability: {
      '2026-09-24': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 66 233 44 55',
      telegram: 'afrosiyob_palace_sam',
      instagram: 'afrosiyob_palace'
    },
    status: 'published',
    createdAt: '2026-02-20',
    updatedAt: '2026-09-14',
    viewsCount: 1100
  },

  // 2. WEDDING CARS (ZAGS CARS)
  {
    id: 'car-1',
    category: 'car',
    title: 'Mercedes-Benz S-Class W223 Maybach Style',
    subtitle: 'Oq rangli, hashamatli to\'y korteji yetakchisi',
    slug: 'mercedes-s-class-w223',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 42,
    price: 3200000,
    priceType: 'per_day',
    priceLabel: '3 200 000 so\'m / kun (haydovchisi bilan)',
    carDetails: {
      brand: 'Mercedes-Benz',
      model: 'S-Class W223 Maybach Package',
      year: 2024,
      vehicleClass: 'luxury',
      withDriver: true,
      durationHours: 8
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Chilonzor',
      address: 'Toshkent shahri bo\'ylab xizmat ko\'rsatiladi'
    },
    coverImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Eng so\'nggi modeldagi Mercedes-Benz S-Class W223. Maybach bodykit, oppoq marvarid rang, bejirim teri salon, Burmester 4D akustikasi va massajli o\'rindiqlar. Tajribali kostyum-shimdagi shaxsiy haydovchi xizmati kiritilgan.',
    amenities: [
      'Professional xushmuomala haydovchi',
      'To\'y bezaklari kiritilgan',
      'Konditsioner va parfyumerizatsiya',
      'Muzlatgich va salqin ichimliklar',
      '8 soatlik to\'liq xizmat'
    ],
    availability: {
      '2026-09-21': 'available',
      '2026-09-22': 'available',
      '2026-09-23': 'booked',
      '2026-09-24': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 97 700 88 99',
      telegram: 'zags_mercedes_uz',
      instagram: 'tashkent_wedding_cars'
    },
    status: 'published',
    createdAt: '2026-01-20',
    updatedAt: '2026-09-18',
    viewsCount: 1650
  },
  {
    id: 'car-2',
    category: 'car',
    title: 'Rolls-Royce Ghost White Luxury',
    subtitle: 'VIP to\'ylar uchun oliy toifali shohona avtomobil',
    slug: 'rolls-royce-ghost-white',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 29,
    price: 8500000,
    priceType: 'per_day',
    priceLabel: '8 500 000 so\'m / kun',
    carDetails: {
      brand: 'Rolls-Royce',
      model: 'Ghost Series II',
      year: 2023,
      vehicleClass: 'luxury',
      withDriver: true,
      durationHours: 8
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Mirobod',
      address: 'Mirobod tumani, butun O\'zbekiston bo\'ylab buyurtma asosida'
    },
    coverImage: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Rolls-Royce Ghost — to\'yingizni haqiqiy afsonaga aylantiruvchi avtomobil. Yulduzli osmon shifti, qalin tabiiy jun gilamlar va jimjitlik. Kelin va kuyov uchun oliy darajadagi qulaylik.',
    amenities: [
      'Yulduzli shift (Starlight headliner)',
      'Oliy toifadagi shaxsiy haydovchi',
      'Bepul to\'y bezagi (premium gullar)',
      'Cheksiz shahar ichi masofa'
    ],
    availability: {
      '2026-09-24': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 99 888 77 66',
      telegram: 'vip_rolls_tashkent'
    },
    status: 'published',
    createdAt: '2026-02-05',
    updatedAt: '2026-09-17',
    viewsCount: 2200
  },
  {
    id: 'car-3',
    category: 'car',
    title: 'Cadillac Escalade ESV Sport Edition',
    subtitle: 'Qora rangli ulkan va dabdabali premium SUV',
    slug: 'cadillac-escalade-esv',
    featured: false,
    isDemo: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 24,
    price: 3500000,
    priceType: 'per_day',
    priceLabel: '3 500 000 so\'m / kun',
    carDetails: {
      brand: 'Cadillac',
      model: 'Escalade ESV 6.2L',
      year: 2023,
      vehicleClass: 'suv',
      withDriver: true,
      durationHours: 8
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Yunusobod',
      address: 'Yunusobod tumani'
    },
    coverImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Cadillac Escalade ESV — kortej uchun ajoyib qudrat va ko\'rinish. Katta o\'lcham, qora rang, to\'liq qora paket va qulay 7 o\'rindiqli salon.',
    amenities: ['Ovoz tizimi AKG Studio', 'Haydovchi xizmati', 'OLED monitorlar'],
    availability: {
      '2026-09-22': 'available',
      '2026-09-23': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked'
    },
    contact: {
      phone: '+998 90 333 22 11',
      telegram: 'cadillac_zags_uz'
    },
    status: 'published',
    createdAt: '2026-02-15',
    updatedAt: '2026-09-12',
    viewsCount: 940
  },

  // 3. SINGERS / ARTISTS
  {
    id: 'artist-1',
    category: 'artist',
    title: 'Xurshid Rasulov (Xalq sevgan xonanda)',
    subtitle: 'Milliy qo\'shiqlar, to\'ybop terma va quvnoq taronalar',
    slug: 'xurshid-rasulov-demo',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 65,
    price: 12000000,
    priceType: 'per_event',
    priceLabel: '12 000 000 so\'m (1 soatlik to\'liq xizmat)',
    artistDetails: {
      genre: 'Milliy va estrada taronalari',
      repertoire: 'Yor-yor, Yoshligim, Qizalog\'im va to\'ybop xitlar',
      performanceDuration: '45-60 daqiqa jonli ijro'
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Shayxontohur',
      address: 'O\'zbekiston bo\'ylab barcha to\'ylarga xizmat'
    },
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'To\'y va el xizmatlarining chinakam fayzi. Jonli ijro, professional sozandalar guruhi va eng mashhur taronalar bilan to\'yingizni unutilmas shodiyonaga aylantiring. (Eslatma: Namuna/Demo profil — narx va bandlik ma\'murlar tomonidan kelishiladi).',
    amenities: [
      'Jonli sozandalar guruhi (Dutor, Doira, Klaveshin)',
      'O\'zining ovoz rejissyori',
      'Maxsus tabrik qo\'shig\'i',
      'Davra qizitish kafolati'
    ],
    availability: {
      '2026-09-22': 'available',
      '2026-09-23': 'booked',
      '2026-09-24': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 90 111 00 22',
      telegram: 'art_booking_uz',
      instagram: 'art_uzbekistan'
    },
    status: 'published',
    createdAt: '2026-01-10',
    updatedAt: '2026-09-17',
    viewsCount: 3100
  },
  {
    id: 'artist-2',
    category: 'artist',
    title: 'Shohruhxon (Zamonaviy estrada yulduzi)',
    subtitle: 'Zamonaviy romantik va jo\'shqin estrada qo\'shiqlari',
    slug: 'shohruhxon-demo',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 78,
    price: 18000000,
    priceType: 'per_event',
    priceLabel: '18 000 000 so\'mdan (Kelishuv asosida)',
    artistDetails: {
      genre: 'Estrada & Zamonaviy pop',
      repertoire: 'Kelin-kuyov valsi, Qorako\'z, Yurak va barcha xitlar',
      performanceDuration: '45 daqiqa'
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Yakkasaroy',
      address: 'Toshkent va viloyatlar'
    },
    coverImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Yoshlar sevgan estrada xonandasi. Kelin va kuyovning ilk raqsi (valsi) va quvnoq to\'y raqslari uchun eng sara qo\'shiqlar to\'plami. (Namuna ma\'lumot).',
    amenities: ['Vals qo\'shig\'i jonli ijrosi', 'Raqs guruhi hamrohligi', 'Fotozona esdalik suratga tushish'],
    availability: {
      '2026-09-21': 'booked',
      '2026-09-24': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked',
      '2026-09-27': 'available'
    },
    contact: {
      phone: '+998 97 123 45 67',
      telegram: 'concert_admin_uz',
      instagram: 'shohruhxon_fan'
    },
    status: 'published',
    createdAt: '2026-02-01',
    updatedAt: '2026-09-18',
    viewsCount: 4200
  },

  // 4. FAMOUS ARTISTS (Yulduzlar)
  {
    id: 'famous-1',
    category: 'famous-artist',
    title: 'Munisa Rizayeva',
    subtitle: 'O\'zbek estradasining eng yorqin primadonnasi',
    slug: 'munisa-rizayeva-demo',
    featured: true,
    isFamous: true,
    isDemo: true,
    isVerified: true,
    rating: 5.0,
    reviewCount: 94,
    price: 30000000,
    priceType: 'per_event',
    priceLabel: '30 000 000 so\'mdan (Administrator orqali aniqlashtiriladi)',
    artistDetails: {
      genre: 'Shou estrada & Raqs taronalari',
      repertoire: 'Sakson, Bir narsa de, Yonar va to\'y xitlari',
      performanceDuration: '40 daqiqa jonli shou',
      famousRank: 1
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Mirobod',
      address: 'O\'zbekiston va xalqaro gastrollar'
    },
    coverImage: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Munisa Rizayeva to\'y tantanasiga kelishi bilan butun zalni jo\'shqin energiyaga to\'ldiradi. Professional raqqosalar jamoasi va xit qo\'shiqlar. DIQQAT: San\'atkor ma\'lumotlari va narxlari faqat ma\'muriyat orqali tasdiqlanadigan ko\'rgazmali demo profildir.',
    amenities: [
      'Katta professional shou-balet jamoasi',
      'Jonli ovoz kafolati',
      'Eksklyuziv to\'y tabrigi va esdalik suratlar'
    ],
    availability: {
      '2026-09-22': 'booked',
      '2026-09-24': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked',
      '2026-09-27': 'available',
      '2026-10-03': 'booked'
    },
    contact: {
      phone: '+998 71 200 90 90',
      telegram: 'vip_booking_tashkent',
      instagram: 'munisarizayeva_official'
    },
    status: 'published',
    createdAt: '2026-01-05',
    updatedAt: '2026-09-18',
    viewsCount: 7800
  },
  {
    id: 'famous-2',
    category: 'famous-artist',
    title: 'Jahongir Otajonov',
    subtitle: 'Haqiqiy xorazmcha jo\'shqinlik va milliy estrada',
    slug: 'jahongir-otajonov-demo',
    featured: true,
    isFamous: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 68,
    price: 25000000,
    priceType: 'per_event',
    priceLabel: '25 000 000 so\'mdan (Kelishuv asosida)',
    artistDetails: {
      genre: 'Jonli milliy va zamonaviy taronalar',
      repertoire: 'Qaddi baland, Biri bor, O\'rgandim va lazgi taronalari',
      performanceDuration: '50 daqiqa jonli orkestr',
      famousRank: 2
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Yashnobod',
      address: 'O\'zbekiston bo\'ylab'
    },
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Jahongir Otajonov — betakror ovoz, xorazmcha olovli raqslar va to\'xtovsiz to\'y zavqi. Jonli sozandalar jo\'rligida davra hech qachon bo\'sh qolmaydi. (Namuna ma\'lumot).',
    amenities: ['To\'liq jonli ansambl', 'Olovli lazgi raqsi'],
    availability: {
      '2026-09-23': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 90 222 33 44',
      telegram: 'famous_admin_uz'
    },
    status: 'published',
    createdAt: '2026-01-08',
    updatedAt: '2026-09-16',
    viewsCount: 5600
  },

  // 5. WEDDING HOSTS / MC / DAVRA RAISI
  {
    id: 'host-1',
    category: 'host',
    title: 'Otabek Mahkamov (Davra Raisi & Shoumen)',
    subtitle: 'Nafis madaniyat, odob va zamonaviy to\'y boshqaruvi',
    slug: 'otabek-mahkamov-demo',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 54,
    price: 6000000,
    priceType: 'per_event',
    priceLabel: '6 000 000 so\'m (To\'y boshidan oxirigacha)',
    hostDetails: {
      languages: ['O\'zbek tili', 'Rus tili', 'Ingliz tili'],
      style: 'Klassik, madaniy, samimiy va bayramona',
      experienceYears: 12
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Mirzo Ulug‘bek',
      address: 'Toshkent va viloyatlar'
    },
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'To\'y dasturini intizomli, mazmunli va har bir mehmon uchun qiziqarli qilib olib boruvchi tajribali davra raisi. Qaynona-qaynota, ota-onalar va yoshlar uchun alohida ehtiromli yondashuv. Noo\'rin hazillarsiz, yuksak madaniyatli boshqaruv.',
    amenities: [
      'To\'liq ssenariy va ketma-ketlikni muvofiqlashtirish',
      '3 ta tilda erkin olib borish',
      'Artislarni to\'g\'ri taqdim etish',
      'Kelin-kuyov shou dasturlari'
    ],
    availability: {
      '2026-09-22': 'available',
      '2026-09-24': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 90 777 55 44',
      telegram: 'mc_otabek_uz',
      instagram: 'otabek_host'
    },
    status: 'published',
    createdAt: '2026-01-25',
    updatedAt: '2026-09-17',
    viewsCount: 2450
  },
  {
    id: 'host-2',
    category: 'host',
    title: 'Farhod Alimov (Professional MC)',
    subtitle: 'Zamonaviy interaktiv to\'ylar va quvnoq kayfiyat',
    slug: 'farhod-alimov-demo',
    featured: false,
    isDemo: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 37,
    price: 5000000,
    priceType: 'per_event',
    priceLabel: '5 000 000 so\'m',
    hostDetails: {
      languages: ['O\'zbek tili', 'Rus tili'],
      style: 'Interaktiv, yoshlarbop, hazilga boy',
      experienceYears: 9
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Yakkasaroy',
      address: 'Toshkent shahri'
    },
    coverImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Farhod Alimov — to\'y mehmonlarini o\'ziga jalb qiluvchi ajoyib diktsiya va qiziqarli o\'yinlar ustasi. Mehmonlarni zeriktirmasdan tantanani bayramona o\'tkazadi.',
    amenities: ['Mehmonlar bilan interaktiv tanishuv', 'Musiqiy viktorinalar'],
    availability: {
      '2026-09-23': 'available',
      '2026-09-25': 'booked',
      '2026-09-26': 'booked',
      '2026-09-27': 'available'
    },
    contact: {
      phone: '+998 93 555 44 33',
      telegram: 'farhod_alimov_mc'
    },
    status: 'published',
    createdAt: '2026-02-12',
    updatedAt: '2026-09-14',
    viewsCount: 1890
  },

  // 6. ENTERTAINERS / COMEDIANS
  {
    id: 'ent-1',
    category: 'entertainer',
    title: 'Bravo Jamoasi (To\'y parodiya va kulgi shousi)',
    subtitle: 'To\'y mehmonlari uchun 30 daqiqalik dildan kulgi va intermediya',
    slug: 'bravo-jamoasi-demo',
    featured: true,
    isDemo: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 46,
    price: 8000000,
    priceType: 'per_event',
    priceLabel: '8 000 000 so\'m (Maxsus to\'y dasturi)',
    artistDetails: {
      genre: 'Yumor, parodiya va miniatyuralar',
      repertoire: 'Qaynona va kuyov, To\'y hangomalari, Estrada parodiyalari',
      performanceDuration: '30-40 daqiqa'
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Olmazor',
      address: 'Toshkent va barcha viloyatlar'
    },
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Bravo jamoasi a\'zolarining eng sara to\'y intermediyalari. To\'y davrasini samimiy kulgi va ko\'tarinki kayfiyat bilan qizitadi. (Namuna ma\'lumot).',
    amenities: ['Eksklyuziv to\'y hazillari', 'Kelin-kuyov bilan hazil suhbat'],
    availability: {
      '2026-09-24': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked',
      '2026-09-27': 'booked'
    },
    contact: {
      phone: '+998 90 444 33 22',
      telegram: 'bravo_shou_uz'
    },
    status: 'published',
    createdAt: '2026-01-30',
    updatedAt: '2026-09-17',
    viewsCount: 2950
  },
  {
    id: 'ent-2',
    category: 'entertainer',
    title: 'Shukurullo Isroilov (El suygan so\'z ustasi)',
    subtitle: 'Samimiy askiyalar, monologlar va hayotiy qiziqchiliklar',
    slug: 'shukurullo-isroilov-demo',
    featured: false,
    isDemo: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 33,
    price: 5500000,
    priceType: 'per_event',
    priceLabel: '5 500 000 so\'m',
    artistDetails: {
      genre: 'Askiya va milliy hangomalar',
      repertoire: 'To\'y odatlari va xalqona hikoyalar',
      performanceDuration: '30 daqiqa'
    },
    location: {
      region: 'Toshkent shahri',
      district: 'Uchtepa',
      address: 'O\'zbekiston bo\'ylab'
    },
    coverImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'O\'zbekiston san\'atida o\'z o\'rniga ega qiziqchi. Yoshi ulug\' mehmonlar va yoshlarga birdek yoqadigan xalqona hazillar.',
    amenities: ['Jonli muloqot', 'Esdalik tabrik'],
    availability: {
      '2026-09-22': 'available',
      '2026-09-25': 'available',
      '2026-09-26': 'booked'
    },
    contact: {
      phone: '+998 91 333 44 55',
      telegram: 'askiya_shou_uz'
    },
    status: 'published',
    createdAt: '2026-02-18',
    updatedAt: '2026-09-15',
    viewsCount: 1620
  }
];

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: 'req-101',
    listingId: 'hall-1',
    listingTitle: 'Versal Grand Hall',
    category: 'wedding-hall',
    customerName: 'Jahongir Qodirov',
    customerPhone: '+998 90 123 45 67',
    requestedDate: '2026-09-28',
    guestCount: 350,
    message: 'To\'yimizga 350 kishi mehmon kutayapmiz. Menyu va zal bezatilishi haqida maslahat kerak.',
    status: 'new',
    createdAt: '2026-09-19 14:30'
  },
  {
    id: 'req-102',
    listingId: 'car-1',
    listingTitle: 'Mercedes-Benz S-Class W223 Maybach Style',
    category: 'car',
    customerName: 'Sardorbek Alimov',
    customerPhone: '+998 93 543 21 00',
    requestedDate: '2026-09-24',
    guestCount: 2,
    message: 'Ertalab soat 10:00 dan kechki 18:00 gacha ZAGS korteji uchun kerak.',
    status: 'contacted',
    createdAt: '2026-09-18 10:15'
  },
  {
    id: 'req-103',
    listingId: 'famous-1',
    listingTitle: 'Munisa Rizayeva',
    category: 'famous-artist',
    customerName: 'Nilufar Rahimova',
    customerPhone: '+998 99 876 54 32',
    requestedDate: '2026-09-27',
    guestCount: 400,
    message: 'Kelin-kuyov tabrigi va 40 daqiqalik shou uchun band qilmoqchimiz.',
    status: 'confirmed',
    createdAt: '2026-09-17 18:40'
  }
];

export const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    listingId: 'hall-1',
    userName: 'Bobur & Madina',
    userCity: 'Toshkent',
    rating: 5,
    comment: 'To\'yimiz Versal Grand Hallda a\'lo darajada o\'tdi! Oshpazlarga, ofitsiantlarga va administratorlarga katta rahmat. Ovoz tizimi va yoritish juda kuchli!',
    date: '2026-08-25',
    approved: true
  },
  {
    id: 'rev-2',
    listingId: 'hall-1',
    userName: 'Rustamjon Aliyev',
    userCity: 'Toshkent',
    rating: 5,
    comment: 'Avtoturargohi juda keng, 200 tadan ortiq mashinaga bemalol joy yetdi. Mehmonlarimiz rozi bo\'lishdi.',
    date: '2026-09-02',
    approved: true
  },
  {
    id: 'rev-3',
    listingId: 'car-1',
    userName: 'Sherzodbek',
    userCity: 'Toshkent',
    rating: 5,
    comment: 'Mercedes W223 Maybach mashinasi toza, yangi va juda qulay edi. Haydovchi juda madaniyatli yigit ekan.',
    date: '2026-09-10',
    approved: true
  },
  {
    id: 'rev-4',
    listingId: 'host-1',
    userName: 'Davron va Dilnoza',
    userCity: 'Toshkent',
    rating: 5,
    comment: 'Otabek Mahkamov to\'yimizni shunday chiroyli va madaniyatli olib bordiki, kattalar ham, yoshlar ham qoyil qolishdi.',
    date: '2026-09-08',
    approved: true
  }
];
