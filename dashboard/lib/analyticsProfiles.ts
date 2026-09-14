export interface DemographicData {
  ageData: { name: string; value: number; color: string }[]
  dominantAge: string
  femalePct: number
  malePct: number
  regions: { name: string; pct: number; hub: string }[]
}

export interface BrandAwarenessData {
  brandsRecognized: { name: string; share: number; color: string }[]
  customerLoyalty: { name: string; loyalty: number; color: string }[]
  discoveryChannels: { name: string; value: number; color: string }[]
  emotionalScores: {
    practical: number
    durable: number
    guarantee: number
    budget: number
    design: number
  }
}

export interface BrandImageData {
  perceptions: {
    key: string
    totallyAgree: number
    agree: number
    maybe: number
    disagree: number
    totallyDisagree: number
  }[]
  netAgreement: number
  positiveIndex: number
}

export const CATEGORY_DEMOGRAPHICS: Record<string, DemographicData> = {
  all: {
    ageData: [
      { name: '<25', value: 14, color: '#dfbfa8' },
      { name: '25-34', value: 28, color: '#245366' },
      { name: '35-44', value: 24, color: '#387388' },
      { name: '45-54', value: 18, color: '#528fa3' },
      { name: '55-64', value: 11, color: '#7bb0c0' },
      { name: '>64', value: 5, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (28%)',
    femalePct: 54,
    malePct: 46,
    regions: [
      { name: 'Jabodetabek', pct: 44, hub: 'Jakarta, Tangerang, Bekasi' },
      { name: 'Jawa Barat', pct: 22, hub: 'Bandung, Bogor, Depok' },
      { name: 'Jawa Timur & Tengah', pct: 18, hub: 'Surabaya, Semarang, Malang' },
      { name: 'Luar Jawa', pct: 16, hub: 'Medan, Makassar, Padang' },
    ],
  },
  'Elektronik & Gadget': {
    ageData: [
      { name: '<25', value: 34, color: '#dfbfa8' },
      { name: '25-34', value: 42, color: '#245366' },
      { name: '35-44', value: 14, color: '#387388' },
      { name: '45-54', value: 7, color: '#528fa3' },
      { name: '55-64', value: 2, color: '#7bb0c0' },
      { name: '>64', value: 1, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (42%)',
    femalePct: 35,
    malePct: 65,
    regions: [
      { name: 'Jabodetabek', pct: 52, hub: 'Sentra Gadget Roxy & Mangga Dua' },
      { name: 'Jawa Barat', pct: 20, hub: 'Bandung & Bekasi Urban' },
      { name: 'Jawa Timur & Tengah', pct: 16, hub: 'Surabaya & Semarang Hub' },
      { name: 'Luar Jawa', pct: 12, hub: 'Batam, Medan, Makassar' },
    ],
  },
  'Dapur & Makanan': {
    ageData: [
      { name: '<25', value: 8, color: '#dfbfa8' },
      { name: '25-34', value: 31, color: '#245366' },
      { name: '35-44', value: 38, color: '#387388' },
      { name: '45-54', value: 16, color: '#528fa3' },
      { name: '55-64', value: 5, color: '#7bb0c0' },
      { name: '>64', value: 2, color: '#a6cfda' },
    ],
    dominantAge: '35–44 (38%)',
    femalePct: 74,
    malePct: 26,
    regions: [
      { name: 'Jabodetabek', pct: 38, hub: 'Konsumen Rumah Tangga Urban' },
      { name: 'Jawa Barat', pct: 24, hub: 'Bandung & Priangan Kuliner' },
      { name: 'Jawa Timur & Tengah', pct: 26, hub: 'Sentra Bumbu Sidoarjo & Solo' },
      { name: 'Luar Jawa', pct: 12, hub: 'Padang, Palembang, Bali' },
    ],
  },
  'Ibu & Kebutuhan Bayi': {
    ageData: [
      { name: '<25', value: 22, color: '#dfbfa8' },
      { name: '25-34', value: 58, color: '#245366' },
      { name: '35-44', value: 16, color: '#387388' },
      { name: '45-54', value: 3, color: '#528fa3' },
      { name: '55-64', value: 1, color: '#7bb0c0' },
      { name: '>64', value: 0, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (58%)',
    femalePct: 82,
    malePct: 18,
    regions: [
      { name: 'Jabodetabek', pct: 48, hub: 'Ibu Muda Jabodetabek' },
      { name: 'Jawa Barat', pct: 23, hub: 'Bandung & Bogor Reseller' },
      { name: 'Jawa Timur & Tengah', pct: 17, hub: 'Surabaya Baby Hub' },
      { name: 'Luar Jawa', pct: 12, hub: 'Medan, Pekanbaru, Denpasar' },
    ],
  },
  'Otomotif & Pengendara': {
    ageData: [
      { name: '<25', value: 25, color: '#dfbfa8' },
      { name: '25-34', value: 44, color: '#245366' },
      { name: '35-44', value: 20, color: '#387388' },
      { name: '45-54', value: 8, color: '#528fa3' },
      { name: '55-64', value: 2, color: '#7bb0c0' },
      { name: '>64', value: 1, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (44%)',
    femalePct: 21,
    malePct: 79,
    regions: [
      { name: 'Jabodetabek', pct: 42, hub: 'Komuter Harian & Ojol Jabodetabek' },
      { name: 'Jawa Barat', pct: 25, hub: 'Bandung & Jalur Pantura' },
      { name: 'Jawa Timur & Tengah', pct: 20, hub: 'Surabaya & Semarang Rider' },
      { name: 'Luar Jawa', pct: 13, hub: 'Lampung, Palembang, Pontianak' },
    ],
  },
  'Perlengkapan Rumah & Dapur': {
    ageData: [
      { name: '<25', value: 12, color: '#dfbfa8' },
      { name: '25-34', value: 36, color: '#245366' },
      { name: '35-44', value: 32, color: '#387388' },
      { name: '45-54', value: 14, color: '#528fa3' },
      { name: '55-64', value: 4, color: '#7bb0c0' },
      { name: '>64', value: 2, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (36%)',
    femalePct: 68,
    malePct: 32,
    regions: [
      { name: 'Jabodetabek', pct: 42, hub: 'Apartemen & Perumahan Baru' },
      { name: 'Jawa Barat', pct: 24, hub: 'Bogor & Bandung Home Living' },
      { name: 'Jawa Timur & Tengah', pct: 20, hub: 'Jepara & Surabaya Cluster' },
      { name: 'Luar Jawa', pct: 14, hub: 'Makassar, Manado, Balikpapan' },
    ],
  },
  'Kecantikan & Skincare': {
    ageData: [
      { name: '<25', value: 38, color: '#dfbfa8' },
      { name: '25-34', value: 45, color: '#245366' },
      { name: '35-44', value: 12, color: '#387388' },
      { name: '45-54', value: 4, color: '#528fa3' },
      { name: '55-64', value: 1, color: '#7bb0c0' },
      { name: '>64', value: 0, color: '#a6cfda' },
    ],
    dominantAge: '25–34 (45%)',
    femalePct: 78,
    malePct: 22,
    regions: [
      { name: 'Jabodetabek', pct: 46, hub: 'Beauty Enthusiast Urban' },
      { name: 'Jawa Barat', pct: 25, hub: 'Bandung & Sukabumi Maklon' },
      { name: 'Jawa Timur & Tengah', pct: 18, hub: 'Surabaya & Yogyakarta' },
      { name: 'Luar Jawa', pct: 11, hub: 'Medan, Samarinda, Denpasar' },
    ],
  },
}

export const CATEGORY_AWARENESS: Record<string, BrandAwarenessData> = {
  all: {
    brandsRecognized: [
      { name: 'MotoGadget Official', share: 45, color: '#245366' },
      { name: 'Bintang Aksesoris', share: 36, color: '#2e6378' },
      { name: 'Dapur Cantik ID', share: 27, color: '#48879e' },
      { name: 'Anker Style Store', share: 19, color: '#62a0b3' },
      { name: 'Dapur Minang', share: 12, color: '#82bdcb' },
      { name: 'Toko Kabel Murah', share: 10, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'MotoGadget Official', loyalty: 52, color: '#1b4352' },
      { name: 'Bintang Aksesoris', loyalty: 41, color: '#245366' },
      { name: 'Dapur Cantik ID', loyalty: 29, color: '#357288' },
      { name: 'Anker Style Store', loyalty: 21, color: '#5091a7' },
      { name: 'Dapur Minang', loyalty: 14, color: '#75b1c5' },
      { name: 'Toko Kabel Murah', loyalty: 12, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'TikTok Live & Affiliate', value: 41, color: '#245366' },
      { name: 'Shopee & Tokopedia Video', value: 34, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 25, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.6,
      durable: 4.1,
      guarantee: 3.7,
      budget: 3.4,
      design: 2.9,
    },
  },
  'Elektronik & Gadget': {
    brandsRecognized: [
      { name: 'Robot Official Store', share: 54, color: '#245366' },
      { name: 'Baseus Indonesia', share: 48, color: '#2e6378' },
      { name: 'Ugreen Direct ID', share: 41, color: '#48879e' },
      { name: 'Anker Power Store', share: 33, color: '#62a0b3' },
      { name: 'Vention Gadget', share: 26, color: '#82bdcb' },
      { name: 'Usams Accessories', share: 18, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'Baseus Indonesia', loyalty: 58, color: '#1b4352' },
      { name: 'Robot Official Store', loyalty: 51, color: '#245366' },
      { name: 'Ugreen Direct ID', loyalty: 45, color: '#357288' },
      { name: 'Anker Power Store', loyalty: 38, color: '#5091a7' },
      { name: 'Vention Gadget', loyalty: 25, color: '#75b1c5' },
      { name: 'Usams Accessories', loyalty: 17, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'Organic Search & Ads', value: 42, color: '#245366' },
      { name: 'Shopee & Tokopedia Video', value: 35, color: '#5c9eaf' },
      { name: 'TikTok Live & Affiliate', value: 23, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.8,
      durable: 4.5,
      guarantee: 4.2,
      budget: 3.7,
      design: 3.4,
    },
  },
  'Dapur & Makanan': {
    brandsRecognized: [
      { name: 'Bamboe Nusantara', share: 52, color: '#245366' },
      { name: 'Bumbu Munik Asli', share: 44, color: '#2e6378' },
      { name: 'Sasa Bumbu Praktis', share: 38, color: '#48879e' },
      { name: 'Kokita Authentic', share: 31, color: '#62a0b3' },
      { name: 'Finna Food Store', share: 22, color: '#82bdcb' },
      { name: 'Dapur Minang Asli', share: 15, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'Bamboe Nusantara', loyalty: 62, color: '#1b4352' },
      { name: 'Bumbu Munik Asli', loyalty: 54, color: '#245366' },
      { name: 'Sasa Bumbu Praktis', loyalty: 42, color: '#357288' },
      { name: 'Kokita Authentic', loyalty: 33, color: '#5091a7' },
      { name: 'Finna Food Store', loyalty: 24, color: '#75b1c5' },
      { name: 'Dapur Minang Asli', loyalty: 19, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'Shopee & Tokopedia Video', value: 44, color: '#245366' },
      { name: 'TikTok Live & Affiliate', value: 36, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 20, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.9,
      durable: 4.3,
      guarantee: 4.4,
      budget: 3.8,
      design: 3.1,
    },
  },
  'Ibu & Kebutuhan Bayi': {
    brandsRecognized: [
      { name: 'Philips Avent ID', share: 61, color: '#245366' },
      { name: 'Pigeon Official Store', share: 56, color: '#2e6378' },
      { name: "Dr. Brown's Indonesia", share: 42, color: '#48879e' },
      { name: 'Hegen Baby Care', share: 35, color: '#62a0b3' },
      { name: 'Momami Baby Store', share: 28, color: '#82bdcb' },
      { name: 'Cussons Baby Shop', share: 20, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'Philips Avent ID', loyalty: 68, color: '#1b4352' },
      { name: 'Pigeon Official Store', loyalty: 64, color: '#245366' },
      { name: "Dr. Brown's Indonesia", loyalty: 49, color: '#357288' },
      { name: 'Hegen Baby Care', loyalty: 39, color: '#5091a7' },
      { name: 'Momami Baby Store', loyalty: 27, color: '#75b1c5' },
      { name: 'Cussons Baby Shop', loyalty: 21, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'Shopee & Tokopedia Video', value: 45, color: '#245366' },
      { name: 'Mom Community & KOLs', value: 34, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 21, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.9,
      durable: 4.8,
      guarantee: 4.7,
      budget: 3.2,
      design: 3.8,
    },
  },
  'Otomotif & Pengendara': {
    brandsRecognized: [
      { name: 'GUB Indonesia Store', share: 58, color: '#245366' },
      { name: 'Motowolf Official', share: 49, color: '#2e6378' },
      { name: 'Otoproject Store', share: 39, color: '#48879e' },
      { name: 'RoboGrip Moto Gear', share: 30, color: '#62a0b3' },
      { name: 'PhoneHolder ID', share: 24, color: '#82bdcb' },
      { name: 'KTC Racing Official', share: 17, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'GUB Indonesia Store', loyalty: 63, color: '#1b4352' },
      { name: 'Motowolf Official', loyalty: 52, color: '#245366' },
      { name: 'Otoproject Store', loyalty: 41, color: '#357288' },
      { name: 'RoboGrip Moto Gear', loyalty: 29, color: '#5091a7' },
      { name: 'PhoneHolder ID', loyalty: 22, color: '#75b1c5' },
      { name: 'KTC Racing Official', loyalty: 18, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'TikTok Live & Community', value: 43, color: '#245366' },
      { name: 'Shopee & Tokopedia Video', value: 35, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 22, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.8,
      durable: 4.9,
      guarantee: 4.3,
      budget: 3.6,
      design: 3.3,
    },
  },
  'Perlengkapan Rumah & Dapur': {
    brandsRecognized: [
      { name: 'Lock&Lock Indonesia', share: 55, color: '#245366' },
      { name: 'Oxone Official Store', share: 47, color: '#2e6378' },
      { name: 'Samono Living ID', share: 38, color: '#48879e' },
      { name: 'Informa Studio', share: 32, color: '#62a0b3' },
      { name: 'Bolde Home Living', share: 25, color: '#82bdcb' },
      { name: 'Freemir Official', share: 19, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'Lock&Lock Indonesia', loyalty: 61, color: '#1b4352' },
      { name: 'Oxone Official Store', loyalty: 53, color: '#245366' },
      { name: 'Samono Living ID', loyalty: 39, color: '#357288' },
      { name: 'Informa Studio', loyalty: 34, color: '#5091a7' },
      { name: 'Bolde Home Living', loyalty: 26, color: '#75b1c5' },
      { name: 'Freemir Official', loyalty: 18, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'Shopee & Tokopedia Video', value: 42, color: '#245366' },
      { name: 'TikTok Live & Affiliate', value: 34, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 24, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.7,
      durable: 4.5,
      guarantee: 4.1,
      budget: 3.9,
      design: 4.2,
    },
  },
  'Kecantikan & Skincare': {
    brandsRecognized: [
      { name: 'Skintific Indonesia', share: 64, color: '#245366' },
      { name: 'Somethinc Official', share: 58, color: '#2e6378' },
      { name: 'Avoskin Beauty Store', share: 46, color: '#48879e' },
      { name: 'Wardah Beauty ID', share: 42, color: '#62a0b3' },
      { name: 'The Originote', share: 35, color: '#82bdcb' },
      { name: 'Glad2Glow Official', share: 29, color: '#a8d8e3' },
    ],
    customerLoyalty: [
      { name: 'Somethinc Official', loyalty: 67, color: '#1b4352' },
      { name: 'Skintific Indonesia', loyalty: 65, color: '#245366' },
      { name: 'Avoskin Beauty Store', loyalty: 48, color: '#357288' },
      { name: 'Wardah Beauty ID', loyalty: 44, color: '#5091a7' },
      { name: 'The Originote', loyalty: 36, color: '#75b1c5' },
      { name: 'Glad2Glow Official', loyalty: 28, color: '#9fcde0' },
    ],
    discoveryChannels: [
      { name: 'TikTok Live & Affiliate', value: 56, color: '#245366' },
      { name: 'Shopee & Tokopedia Video', value: 28, color: '#5c9eaf' },
      { name: 'Organic Search & Ads', value: 16, color: '#dfbfa8' },
    ],
    emotionalScores: {
      practical: 4.9,
      durable: 4.6,
      guarantee: 4.6,
      budget: 3.9,
      design: 4.1,
    },
  },
}

export const CATEGORY_IMAGE: Record<string, BrandImageData> = {
  all: {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 42, agree: 33, maybe: 11, disagree: 10, totallyDisagree: 4 },
      { key: 'attr_durable', totallyAgree: 35, agree: 42, maybe: 17, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_comfortable', totallyAgree: 41, agree: 23, maybe: 18, disagree: 12, totallyDisagree: 6 },
      { key: 'attr_reliable', totallyAgree: 28, agree: 36, maybe: 10, disagree: 14, totallyDisagree: 12 },
      { key: 'attr_value', totallyAgree: 22, agree: 37, maybe: 21, disagree: 12, totallyDisagree: 8 },
      { key: 'attr_trendy', totallyAgree: 13, agree: 38, maybe: 19, disagree: 18, totallyDisagree: 12 },
    ],
    netAgreement: 13,
    positiveIndex: 75,
  },
  'Elektronik & Gadget': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 48, agree: 36, maybe: 8, disagree: 5, totallyDisagree: 3 },
      { key: 'attr_durable', totallyAgree: 31, agree: 38, maybe: 14, disagree: 12, totallyDisagree: 5 },
      { key: 'attr_comfortable', totallyAgree: 37, agree: 32, maybe: 16, disagree: 9, totallyDisagree: 6 },
      { key: 'attr_reliable', totallyAgree: 33, agree: 37, maybe: 12, disagree: 11, totallyDisagree: 7 },
      { key: 'attr_value', totallyAgree: 29, agree: 41, maybe: 15, disagree: 9, totallyDisagree: 6 },
      { key: 'attr_trendy', totallyAgree: 26, agree: 44, maybe: 15, disagree: 10, totallyDisagree: 5 },
    ],
    netAgreement: 19,
    positiveIndex: 78,
  },
  'Dapur & Makanan': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 52, agree: 34, maybe: 7, disagree: 4, totallyDisagree: 3 },
      { key: 'attr_durable', totallyAgree: 38, agree: 41, maybe: 12, disagree: 6, totallyDisagree: 3 },
      { key: 'attr_comfortable', totallyAgree: 44, agree: 31, maybe: 14, disagree: 7, totallyDisagree: 4 },
      { key: 'attr_reliable', totallyAgree: 36, agree: 42, maybe: 11, disagree: 7, totallyDisagree: 4 },
      { key: 'attr_value', totallyAgree: 34, agree: 45, maybe: 12, disagree: 6, totallyDisagree: 3 },
      { key: 'attr_trendy', totallyAgree: 18, agree: 42, maybe: 20, disagree: 12, totallyDisagree: 8 },
    ],
    netAgreement: 22,
    positiveIndex: 84,
  },
  'Ibu & Kebutuhan Bayi': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 56, agree: 33, maybe: 6, disagree: 3, totallyDisagree: 2 },
      { key: 'attr_durable', totallyAgree: 46, agree: 39, maybe: 9, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_comfortable', totallyAgree: 52, agree: 33, maybe: 9, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_reliable', totallyAgree: 45, agree: 41, maybe: 8, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_value', totallyAgree: 27, agree: 43, maybe: 18, disagree: 8, totallyDisagree: 4 },
      { key: 'attr_trendy', totallyAgree: 24, agree: 46, maybe: 16, disagree: 9, totallyDisagree: 5 },
    ],
    netAgreement: 26,
    positiveIndex: 88,
  },
  'Otomotif & Pengendara': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 49, agree: 35, maybe: 8, disagree: 5, totallyDisagree: 3 },
      { key: 'attr_durable', totallyAgree: 44, agree: 36, maybe: 11, disagree: 6, totallyDisagree: 3 },
      { key: 'attr_comfortable', totallyAgree: 36, agree: 34, maybe: 17, disagree: 8, totallyDisagree: 5 },
      { key: 'attr_reliable', totallyAgree: 39, agree: 37, maybe: 12, disagree: 7, totallyDisagree: 5 },
      { key: 'attr_value', totallyAgree: 31, agree: 42, maybe: 15, disagree: 8, totallyDisagree: 4 },
      { key: 'attr_trendy', totallyAgree: 22, agree: 41, maybe: 18, disagree: 12, totallyDisagree: 7 },
    ],
    netAgreement: 18,
    positiveIndex: 76,
  },
  'Perlengkapan Rumah & Dapur': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 46, agree: 38, maybe: 9, disagree: 4, totallyDisagree: 3 },
      { key: 'attr_durable', totallyAgree: 41, agree: 39, maybe: 12, disagree: 5, totallyDisagree: 3 },
      { key: 'attr_comfortable', totallyAgree: 43, agree: 33, maybe: 14, disagree: 6, totallyDisagree: 4 },
      { key: 'attr_reliable', totallyAgree: 38, agree: 40, maybe: 12, disagree: 6, totallyDisagree: 4 },
      { key: 'attr_value', totallyAgree: 33, agree: 44, maybe: 13, disagree: 6, totallyDisagree: 4 },
      { key: 'attr_trendy', totallyAgree: 28, agree: 45, maybe: 15, disagree: 8, totallyDisagree: 4 },
    ],
    netAgreement: 21,
    positiveIndex: 81,
  },
  'Kecantikan & Skincare': {
    perceptions: [
      { key: 'attr_practical', totallyAgree: 54, agree: 34, maybe: 6, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_durable', totallyAgree: 42, agree: 41, maybe: 10, disagree: 5, totallyDisagree: 2 },
      { key: 'attr_comfortable', totallyAgree: 49, agree: 35, maybe: 9, disagree: 5, totallyDisagree: 2 },
      { key: 'attr_reliable', totallyAgree: 44, agree: 42, maybe: 8, disagree: 4, totallyDisagree: 2 },
      { key: 'attr_value', totallyAgree: 32, agree: 45, maybe: 14, disagree: 6, totallyDisagree: 3 },
      { key: 'attr_trendy', totallyAgree: 36, agree: 48, maybe: 10, disagree: 4, totallyDisagree: 2 },
    ],
    netAgreement: 25,
    positiveIndex: 86,
  },
}
