export interface RegionData {
  id: string;
  name: string;
  districts: string[];
}

export const UZBEKISTAN_REGIONS: RegionData[] = [
  {
    id: 'toshkent-shahar',
    name: 'Toshkent shahri',
    districts: [
      'Chilonzor',
      'Yunusobod',
      'Mirzo Ulug‘bek',
      'Shayxontohur',
      'Yakkasaroy',
      'Yashnobod',
      'Mirobod',
      'Olmazor',
      'Uchtepa',
      'Bektemir',
      'Sergeli',
      'Yangihayot'
    ]
  },
  {
    id: 'toshkent-viloyati',
    name: 'Toshkent viloyati',
    districts: [
      'Chirchiq',
      'Olmaliq',
      'Angren',
      'Bo‘stonliq',
      'Qibray',
      'Zangiota',
      'Yangiyo‘l',
      'Bekobod',
      'Toshkent tumani'
    ]
  },
  {
    id: 'samarqand',
    name: 'Samarqand viloyati',
    districts: [
      'Samarqand shahri',
      'Kattaqo‘rg‘on',
      'Urgut',
      'Pastdarg‘om',
      'Samarqand tumani',
      'Jomboy',
      'Payariq'
    ]
  },
  {
    id: 'buxoro',
    name: 'Buxoro viloyati',
    districts: [
      'Buxoro shahri',
      'G‘ijduvon',
      'Kogon',
      'Vobkent',
      'Shofirkon',
      'Qorako‘l'
    ]
  },
  {
    id: 'fargona',
    name: 'Farg‘ona viloyati',
    districts: [
      'Farg‘ona shahri',
      'Marg‘ilon',
      'Qo‘qon',
      'Quva',
      'Oltiariq',
      'Rishton'
    ]
  },
  {
    id: 'andijon',
    name: 'Andijon viloyati',
    districts: [
      'Andijon shahri',
      'Asaka',
      'Xonobod',
      'Shahrixon',
      'Baliqchi',
      'Qo‘rg‘ontepa'
    ]
  },
  {
    id: 'namangan',
    name: 'Namangan viloyati',
    districts: [
      'Namangan shahri',
      'Chust',
      'Kosonsoy',
      'Pop',
      'To‘raqo‘rg‘on',
      'Uychi'
    ]
  },
  {
    id: 'qashqadaryo',
    name: 'Qashqadaryo viloyati',
    districts: [
      'Qarshi shahri',
      'Shahrisabz',
      'Kitob',
      'G‘uzor',
      'Koson',
      'Yakkabog‘'
    ]
  },
  {
    id: 'surxondaryo',
    name: 'Surxondaryo viloyati',
    districts: [
      'Termiz shahri',
      'Denov',
      'Sherobod',
      'Boysun',
      'Sho‘rchi',
      'Jarqo‘rg‘on'
    ]
  },
  {
    id: 'xorazm',
    name: 'Xorazm viloyati',
    districts: [
      'Urganch shahri',
      'Xiva shahri',
      'Gurlan',
      'Xonqa',
      'Shovot',
      'Hazorasp'
    ]
  },
  {
    id: 'navoiy',
    name: 'Navoiy viloyati',
    districts: [
      'Navoiy shahri',
      'Zarafshon',
      'Karmana',
      'Qiziltepa',
      'Xatirchi'
    ]
  },
  {
    id: 'jizzax',
    name: 'Jizzax viloyati',
    districts: [
      'Jizzax shahri',
      'Zomin',
      'G‘allaorol',
      'Do‘stlik',
      'Paxtakor'
    ]
  },
  {
    id: 'sirdaryo',
    name: 'Sirdaryo viloyati',
    districts: [
      'Guliston shahri',
      'Shirin',
      'Yangiyer',
      'Boyovut',
      'Sardoba'
    ]
  },
  {
    id: 'qoraqalpogiston',
    name: 'Qoraqalpog‘iston Respublikasi',
    districts: [
      'Nukus shahri',
      'Beruniy',
      'To‘rtko‘l',
      'Xo‘jayli',
      'Qo‘ng‘irot'
    ]
  }
];

export const getDistrictsByRegion = (regionName: string): string[] => {
  const reg = UZBEKISTAN_REGIONS.find(
    r => r.name.toLowerCase() === regionName.toLowerCase() || r.id === regionName.toLowerCase()
  );
  return reg ? reg.districts : [];
};

export interface LatLngCoords {
  lat: number;
  lng: number;
}

export const REGION_DEFAULT_COORDINATES: Record<string, LatLngCoords> = {
  'toshkent shahri': { lat: 41.2995, lng: 69.2401 },
  'toshkent viloyati': { lat: 41.4689, lng: 69.5822 },
  'samarqand viloyati': { lat: 39.6542, lng: 66.9597 },
  'buxoro viloyati': { lat: 39.7681, lng: 64.4556 },
  'farg‘ona viloyati': { lat: 40.3842, lng: 71.7843 },
  'farg\'ona viloyati': { lat: 40.3842, lng: 71.7843 },
  'andijon viloyati': { lat: 40.7821, lng: 72.3442 },
  'namangan viloyati': { lat: 40.9983, lng: 71.6726 },
  'qashqadaryo viloyati': { lat: 38.8606, lng: 65.7891 },
  'surxondaryo viloyati': { lat: 37.2242, lng: 67.2783 },
  'xorazm viloyati': { lat: 41.5500, lng: 60.6333 },
  'navoiy viloyati': { lat: 40.0844, lng: 65.3792 },
  'jizzax viloyati': { lat: 40.1158, lng: 67.8422 },
  'sirdaryo viloyati': { lat: 40.4897, lng: 68.7842 },
  'qoraqalpog‘iston respublikasi': { lat: 42.4602, lng: 59.6166 },
  'qoraqalpog\'iston respublikasi': { lat: 42.4602, lng: 59.6166 },
};

export const DISTRICT_COORDINATES: Record<string, LatLngCoords> = {
  'chilonzor': { lat: 41.2750, lng: 69.2080 },
  'yunusobod': { lat: 41.3644, lng: 69.2882 },
  'mirzo ulug‘bek': { lat: 41.3385, lng: 69.3345 },
  'mirzo ulug\'bek': { lat: 41.3385, lng: 69.3345 },
  'shayxontohur': { lat: 41.3250, lng: 69.2150 },
  'yakkasaroy': { lat: 41.2850, lng: 69.2450 },
  'yashnobod': { lat: 41.2950, lng: 69.3250 },
  'mirobod': { lat: 41.2950, lng: 69.2750 },
  'olmazor': { lat: 41.3500, lng: 69.2250 },
  'uchtepa': { lat: 41.2900, lng: 69.1700 },
  'bektemir': { lat: 41.2100, lng: 69.3300 },
  'sergeli': { lat: 41.2200, lng: 69.2200 },
  'yangihayot': { lat: 41.1900, lng: 69.2000 },
  'samarqand shahri': { lat: 39.6542, lng: 66.9597 },
  'buxoro shahri': { lat: 39.7681, lng: 64.4556 },
  'andijon shahri': { lat: 40.7821, lng: 72.3442 },
  'namangan shahri': { lat: 40.9983, lng: 71.6726 },
  'farg‘ona shahri': { lat: 40.3842, lng: 71.7843 },
  'farg\'ona shahri': { lat: 40.3842, lng: 71.7843 },
  'qarshi shahri': { lat: 38.8606, lng: 65.7891 },
  'termiz shahri': { lat: 37.2242, lng: 67.2783 },
  'urganch shahri': { lat: 41.5500, lng: 60.6333 },
  'xiva shahri': { lat: 41.3783, lng: 60.3639 },
  'nukus shahri': { lat: 42.4602, lng: 59.6166 },
};

export const getCoordinatesForLocation = (region?: string, district?: string): LatLngCoords => {
  if (district) {
    const cleanDist = district.toLowerCase().trim();
    if (DISTRICT_COORDINATES[cleanDist]) {
      return DISTRICT_COORDINATES[cleanDist];
    }
  }

  if (region) {
    const cleanReg = region.toLowerCase().trim();
    if (REGION_DEFAULT_COORDINATES[cleanReg]) {
      return REGION_DEFAULT_COORDINATES[cleanReg];
    }
    for (const key of Object.keys(REGION_DEFAULT_COORDINATES)) {
      if (cleanReg.includes(key) || key.includes(cleanReg)) {
        return REGION_DEFAULT_COORDINATES[key];
      }
    }
  }

  // Default fallback to Tashkent center
  return { lat: 41.2995, lng: 69.2401 };
};

