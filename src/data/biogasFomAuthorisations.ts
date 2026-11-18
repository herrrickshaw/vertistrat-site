/**
 * Biogas and compressed biogas (CBG) plants that the Ministry of Agriculture and Farmers Welfare
 * (Department of Agriculture and Farmers Welfare) has authorised, under clause 22(c) of the Fertiliser
 * (Inorganic, Organic or Mixed) (Control) Order, 1985, to sell Fermented Organic Manure (FOM) and
 * Liquid Fermented Organic Manure (LFOM) in bulk directly to farmers.
 *
 * Source: the Gazette of India (Extraordinary, Part II, Section 3(ii)) notifications listed in NOTIFICATIONS,
 * read on 18 November 2026. Each authorisation runs for three years from publication.
 * Plant addresses are shortened to village, block and district; the gazette link carries the full address.
 */

export type FomNotification = {
  id: string;
  /** Statutory order number as printed in the gazette. */
  so: string;
  /** Gazette publication date (YYYY-MM-DD); the three-year period runs from here. */
  published: string;
  /** Number of entries in the table of the notification. */
  entries: number;
  url: string;
  /** Later orders that changed entries of this one. */
  amendedBy?: string;
};

export const NOTIFICATIONS: FomNotification[] = [
  {
    id: "n1",
    so: "S.O. 4918(E)",
    published: "2023-11-14",
    entries: 27,
    url: "https://egazette.gov.in/WriteReadData/2023/250080.pdf",
  },
  {
    id: "n2",
    so: "S.O. 1366(E)",
    published: "2024-03-15",
    entries: 14,
    url: "https://egazette.gov.in/WriteReadData/2024/253091.pdf",
  },
  {
    id: "n3",
    so: "S.O. 3723(E)",
    published: "2024-09-02",
    entries: 21,
    url: "https://egazette.gov.in/WriteReadData/2024/256842.pdf",
    amendedBy: "S.O. 1101(E), 6 March 2025 (entry 19)",
  },
  {
    id: "n4",
    so: "S.O. 1102(E)",
    published: "2025-03-06",
    entries: 7,
    url: "https://egazette.gov.in/WriteReadData/2025/261489.pdf",
  },
  {
    id: "n5",
    so: "S.O. 3042(E)",
    published: "2025-07-08",
    entries: 17,
    url: "https://egazette.gov.in/WriteReadData/2025/264469.pdf",
  },
  {
    id: "n6",
    so: "S.O. 5836(E)",
    published: "2025-12-17",
    entries: 20,
    url: "https://egazette.gov.in/WriteReadData/2025/268601.pdf",
    amendedBy: "S.O. 3665(E), 6 July 2026 (entries 12 to 15)",
  },
  {
    id: "n7",
    so: "S.O. 1018(E)",
    published: "2026-02-25",
    entries: 13,
    url: "https://egazette.gov.in/WriteReadData/2026/270500.pdf",
    amendedBy: "S.O. 3666(E), 6 July 2026 (entries 5 and 6)",
  },
  {
    id: "n8",
    so: "S.O. 3345(E)",
    published: "2026-06-23",
    entries: 13,
    url: "https://egazette.gov.in/WriteReadData/2026/273761.pdf",
  },
  {
    id: "n9",
    so: "S.O. 3356(E)",
    published: "2026-06-23",
    entries: 9,
    url: "https://egazette.gov.in/WriteReadData/2026/273815.pdf",
  },
  {
    id: "n10",
    so: "S.O. 4123(E)",
    published: "2026-07-27",
    entries: 8,
    url: "https://egazette.gov.in/WriteReadData/2026/274927.pdf",
  },
];

/** Listed company whose name the entry carries (a reading of the name, not a check of the registered entity). */
export type Parent = "Reliance Industries" | "GAIL" | "HPCL" | "Indian Oil" | "DCM Shriram";

export type FomPlant = {
  name: string;
  state: string;
  /** Village or locality, block or town, district. */
  place: string;
  notification: string;
  parent?: Parent;
};

type Row = [name: string, state: string, place: string, parent?: Parent];

const AP = "Andhra Pradesh",
  GJ = "Gujarat",
  HR = "Haryana",
  JH = "Jharkhand",
  KA = "Karnataka",
  MP = "Madhya Pradesh";
const MH = "Maharashtra",
  PB = "Punjab",
  RJ = "Rajasthan",
  TN = "Tamil Nadu",
  TS = "Telangana",
  UP = "Uttar Pradesh",
  UK = "Uttarakhand";
const R: Parent = "Reliance Industries";

const TABLES: Record<string, Row[]> = {
  // 14 November 2023 (a further three years for earlier-authorised plants)
  n1: [
    ["Vyzag Bio Energy Fuels Pvt Ltd", AP, "Kapuluppada, Visakhapatnam"],
    ["Akshar Biotech Pvt Ltd", GJ, "Dumbhal, Surat"],
    ["Bleach Energy", GJ, "Sundalpura, Umreth, Anand"],
    ["Glow Green Biotech", GJ, "Dungra, Kamrej, Surat"],
    ["Green Earth Biogas Pvt Ltd", GJ, "Kukada, Muli, Surendranagar"],
    ["Govardhannathji Energies LLP", GJ, "Pij, Vaso, Nadiad"],
    ["Spectrum Renewable Energy Pvt Ltd", HR, "Marodhi Jattan, Kalanaur, Rohtak"],
    ["Leafiniti Bioenergy Pvt Ltd", KA, "Mygur, Jamkhandi, Bagalkot"],
    ["Hycons Bioenergy Pvt Ltd", KA, "Soluru, Anekal, Bengaluru Urban"],
    [
      "Indore Clean Energy Pvt Ltd (earlier IL&FS Environmental Infrastructure & Services)",
      MP,
      "Devguradia, Indore",
    ],
    ["Clarus Bioenergy Pvt Ltd", MH, "Shirala, Sangli"],
    ["Noble Exchange Environment Solutions Pune LLP", MH, "Talegaon, Pune"],
    ["Spectrum Renewable Energy Pvt Ltd", MH, "Kodoli, Kolhapur"],
    ["United Bioenergy Pvt Ltd", MH, "Dhalewadi, Junnar, Pune"],
    ["T R Mega Foods and Beverages LLP", PB, "Haibowal Dairy Complex, Ludhiana"],
    ["Verbio India Pvt Ltd", PB, "Bhutal Kalan, Lehragaga, Sangrur"],
    ["Energim Sustainable Solutions Cuddalore Pvt Ltd", TN, "Periyapattu, Cuddalore"],
    ["IOT Biogas Pvt Ltd (IAV Biogas Pvt Ltd)", TN, "Puduchatram, Namakkal"],
    ["SLR Energy", TN, "Kuzhandaikuppam, Cuddalore"],
    ["Solika Energy Pvt Ltd", TS, "Edamma Gadda Tanda, Balanagar, Mahabubnagar"],
    ["Solika Energy Pvt Ltd", TS, "Mohammadnagar, Rangareddy"],
    ["Indian Potash Ltd", UP, "Rohana Kalan, Muzaffarnagar"],
    ["P S Greengas", UP, "Bhayangu, Khatauli, Muzaffarnagar"],
    ["Hindustan Petroleum Corporation Ltd", UP, "Sainjani, Dataganj, Budaun", "HPCL"],
    ["Gobardhan Varanasi Foundation (SPV)", UP, "Shahanshahpur, Paniyara, Varanasi"],
    ["Biospark Energy", UP, "Kheri Viran, Jansath, Muzaffarnagar"],
    ["Anarobic Energy Pvt Ltd", UK, "Kankhal, Haridwar"],
  ],
  // 15 March 2024
  n2: [
    ["Amrit Fertilizer", HR, "Kunjpura, Karnal"],
    ["ARC Bio Fuel Pvt Ltd", PB, "Handiaya, Barnala"],
    ["Farm Gas Pvt Ltd", PB, "Ghungrali, Khanna, Ludhiana"],
    ["Transtech Green Power Pvt Ltd", RJ, "Kachela Bagsari, Chitalwana, Sanchore"],
    ["Mahindra Waste to Energy Solutions Ltd", MH, "Waluj MIDC, Aurangabad"],
    ["Mahindra Waste to Energy Solutions Ltd", AP, "Thukivakam, Renigunta, Tirupati"],
    ["Mahindra Waste to Energy Solutions Ltd", MP, "Tejpur Garhbarhi, Indore"],
    ["Mahindra Waste to Energy Solutions Ltd", AP, "Piduguralla, Palnadu"],
    ["Mahindra Waste to Energy Solutions Ltd", RJ, "Balicha trenching ground, Girwa, Udaipur"],
    ["Mahindra Waste to Energy Solutions Ltd", AP, "Adoni, Kurnool"],
    ["Banaskantha District Co-operative Milk Producers' Union Ltd", GJ, "Banaskantha"],
    [
      "Shree Krishnayan Desi Gauraksha Avam Gaulok Dham Sewa Samiti (Bio-CNG plant)",
      UK,
      "Gandi Khata, Bahadrabad, Haridwar",
    ],
    ["Spark Bio Gas Pvt Ltd (Bio-CNG Madhavaram)", TN, "Madhavaram, Chennai"],
    ["Circle CBG India Pvt Ltd", UP, "Bahadurpur, Mawana, Meerut"],
  ],
  // 2 September 2024
  n3: [
    ["Girvar and Sons Bio Energy Pvt Ltd", UP, "Barsu, Khatauli, Muzaffarnagar"],
    ["Anand Mangal Infra Developers Pvt Ltd", UP, "Jeetpur Nangli, Sardhana, Meerut"],
    ["Lakhimpur Kheri RNG Pvt Ltd", UP, "Kumbhi, Kumbhigola, Lakhimpur Kheri"],
    ["Mittal Enterprises", UP, "Chittora Mahiuddinpur, Garhmukteshwar, Hapur"],
    ["Sainsons Paper Industries Pvt Ltd", HR, "Bakhli, Pehowa, Kurukshetra"],
    ["Shri Godham Pathmeda (gobar gas plant)", RJ, "Pathmeda, Sanchore"],
    ["Spark Bio Gas Pvt Ltd (Madhavaram)", TN, "Madhavaram, Chennai"],
    ["SPS Bio-Chem (Yamunanagar plant)", HR, "Damla, Yamunanagar"],
    ["Phoenix India Compressed Bio Gas Project", "West Bengal", "Gundoba, Dubrajpur, Birbhum"],
    ["Rama Green Energies", HR, "Baragaon, Kunjpura Road, Karnal"],
    ["Envirocare CBG Pvt Ltd", MP, "Karoda-Imlia, Katni Road, Jabalpur"],
    ["Shri Green Agro Energies Pvt Ltd (Khurja)", UP, "Nagalia Takkar, Khurja, Bulandshahr"],
    ["Carbon Masters Biogas Plant (Siddipet)", TS, "Bussapur, Siddipet"],
    ["Sustainable Impacts Biogas Plant", KA, "Harohalli, Kanakapura, Bengaluru"],
    ["CBG plant, Bio-Fuels Complex, IOCL", UP, "Harpur, Gola, Gorakhpur", "Indian Oil"],
    ["SampurnAgri Ventures Pvt Ltd", PB, "Painchawali, Malout Road, Fazilka"],
    ["Carbon Circle Pvt Ltd", UP, "Shahpur Dandi, Baheri, Bareilly"],
    ["LR Energy Karnal Pvt Ltd", HR, "Andhera, Karnal"],
    [
      "LR Energy Vrindavan Pvt Ltd (named LR Energy Karnal Pvt Ltd until the 6 March 2025 amendment)",
      HR,
      "Garh Mirakpur, Rai, Sonipat",
    ],
    ["Hycons Technologies", KA, "Soluru, Anekal, Bengaluru"],
    ["Hycons Renewables Pvt Ltd", KA, "Soluru, Anekal, Bengaluru"],
  ],
  // 6 March 2025
  n4: [
    ["NDDB Mrida Ltd", UP, "Ramnagar Industrial Area, Chandauli"],
    ["Gayathree Innovative Energies Pvt Ltd", AP, "Elakolanu, Rangampeta, East Godavari"],
    ["GAIL (India) Ltd", JH, "Jhiri, Ranchi", "GAIL"],
    ["Baramati Agro Ltd", MH, "Nimbodi, Baramati, Pune"],
    ["Natural Sugar and Allied Industries Ltd", MH, "Ranjani, Kallam, Dharashiv"],
    ["NKJ Biofuel Pvt Ltd", "Chhattisgarh", "Ramhepur, Kawardha, Kabirdham"],
    ["WI Green Ventures LLP", UP, "Maleysia, Mandi Dhanaura, Amroha"],
  ],
  // 8 July 2025
  n5: [
    ["Atmos AJS Fuels Pvt Ltd", GJ, "Dhantej, Savli, Vadodara"],
    ["Reliance Industries Ltd, Barabanki CBG plant", UP, "Dewa Road, Barabanki", R],
    ["DCM Shriram Ltd, CBG unit Ajbapur", UP, "Ajbapur, Lakhimpur Kheri", "DCM Shriram"],
    ["Degna Bioenergy Pvt Ltd", UP, "Sadakpur, Hapur"],
    ["Reliance Chemicals and Materials Ltd, Hoshiarpur CBG plant", PB, "Baroti, Hoshiarpur", R],
    ["Reliance Bioenergy Ltd, Jhajjar CBG plant", HR, "Badli, Jhajjar", R],
    [
      "Reliance New Solar Energy Ltd, Jamnagar CBG plant",
      GJ,
      "Kanachikari Navagam, Lalpur, Jamnagar",
      R,
    ],
    ["Kota Development Authority", RJ, "Devnarayan Nagar, Dharmpura, Kota"],
    ["Lakhimpur Kheri RNG Pvt Ltd", UP, "Sirsiya, Balrampur"],
    ["Reliance Bioenergy Ltd, Nagpur CBG plant", MH, "Dahali, Mouda, Nagpur", R],
    ["Reliance Bioenergy Ltd, Panipat CBG plant", HR, "Atawla, Panipat", R],
    ["Patiala RNG Pvt Ltd", PB, "Jaikhar, Patiala"],
    ["Reliance Industries Ltd, Prayagraj CBG plant", UP, "Karchana, Prayagraj", R],
    ["Sangrur RNG Pvt Ltd", PB, "Fatehgarh Panj Graian, Dhuri, Sangrur"],
    ["Transtech Punjab Compressed Bio Gas LLP", HR, "Hanspur, Fatehabad"],
    [
      "Reliance Chemicals and Materials Ltd, Vadodara CBG plant",
      GJ,
      "Vadodara Manufacturing Division, Vadodara",
      R,
    ],
    ["XEMX Projects Pvt Ltd", MH, "Venunagar-Gursale, Pandharpur, Solapur"],
  ],
  // 16 December 2025 (published 17 December)
  n6: [
    [
      "Barsana Biogas Project (Adani Total Energies Biomass Ltd)",
      UP,
      "Kashung, Govardhan, Mathura",
    ],
    ["Bhadauria Natural Gas and Products Pvt Ltd", UP, "Faguha, Kannauj"],
    [
      "CMIPL Koramangala (Carbon Masters BBMP biogas plant)",
      KA,
      "Koramangala 5th Block, Bengaluru",
    ],
    ["Demeter Agro Energies Pvt Ltd", HR, "Balwanti, Kaithal"],
    ["KDM Business Network Ltd", UP, "Kamar, Chhata, Mathura"],
    ["Lathar Green Energy Pvt Ltd", UP, "Gulariya Chakjhau, Tilhar, Shahjahanpur"],
    ["MEPL Bio-Energy LLP", PB, "Bahadurpur, Batala, Gurdaspur"],
    ["Metero Fuels", HR, "Chaudharywas, Hisar"],
    ["Pilm Biotech Pvt Ltd", GJ, "Vallabhipur, Bhavnagar"],
    ["Paliwal Bio Energy Pvt Ltd", MP, "Pipaliya Dhakad, Bhopal"],
    ["Transtech Green Energy Pvt Ltd", RJ, "Kachela Bagsari, Sanchore, Jalore"],
    ["Reliance Industries Ltd, Satna CBG plant", MP, "Bamhaur, Nagod, Satna", R],
    ["Reliance Industries Ltd, Kakinada CBG plant", AP, "Peddapuram, Kakinada", R],
    ["Reliance Industries Ltd, Nagothane CBG plant", MH, "Nagothane, Roha, Raigad", R],
    ["Reliance Industries Ltd, Kota CBG plant", RJ, "Tather, Ladpura, Kota", R],
    ["Devnics LLP", HR, "Prabhuwala, Uklana Mandi, Hisar"],
    ["Sayaji Bio Energy LLP", GJ, "Bahutha, Savli, Vadodara"],
    ["Satish Sugars Ltd", KA, "Hunshyal PG, Mudalagi, Belagavi"],
    [
      "Sevozone Energies and Fertilizers Pvt Ltd (5 TPD CBG plant)",
      UP,
      "Essapur, Gangoh, Saharanpur",
    ],
    ["Sri Krishna Balram Seva Trust", RJ, "Hingonia, Bassi, Jaipur"],
  ],
  // 25 February 2026
  n7: [
    ["Prayagraj RNG Pvt Ltd", UP, "Jahangirabad, Naini Road, Prayagraj"],
    ["Kakadiya Green Energy Pvt Ltd", GJ, "Ranparda, Palitana, Bhavnagar"],
    ["AnandMangal Infradevelopers Pvt Ltd", UP, "Jeetpur, Sardhana, Meerut"],
    ["Shree Jee Bioenergy", UK, "Jaswawala, Bahadrabad, Haridwar"],
    ["Reliance Industries Ltd, Indore CBG plant", MP, "Dakachya, Sanwer, Indore", R],
    ["Reliance Industries Ltd, Bhopal CBG plant", MP, "Sagoni Kalan, Adampur Chawni, Bhopal", R],
    ["Adani Total Energies Biomass Ltd", UP, "Kashung, Govardhan, Mathura"],
    ["VINP Distilleries and Sugars Pvt Ltd", KA, "Shiggaon, Haveri"],
    ["Enlighten Biofuels and Bio Fertilizers Pvt Ltd", "Delhi", "Najafgarh"],
    ["Carbon Masters India Pvt Ltd (Armane)", KA, "Mattikere, Bengaluru"],
    ["Carbon Masters India Pvt Ltd (Gandhinagara)", KA, "Kalidasa Road, Bengaluru"],
    ["Carbon Masters India Pvt Ltd (Domlur)", KA, "Domlur, Bengaluru"],
    ["Carbon Masters India Pvt Ltd (Pattabirama)", KA, "Jayanagar 1st Block, Bengaluru"],
  ],
  // 22 June 2026
  n8: [
    ["JKSH Green Power Pvt Ltd", PB, "Mughlani Kot, Harsha Chhina, Amritsar"],
    ["Reliance Industries Ltd, Akola CBG plant", MH, "Chandur, Akola", R],
    ["Reliance Industries Ltd, Haidergarh CBG plant", UP, "Haidergarh, Barabanki", R],
    ["Reliance Bio Energy Ltd, Jhajjar 2 CBG plant", HR, "Badli, Jhajjar", R],
    ["Reliance Industries Ltd, Jind 2 CBG plant", HR, "Pindari, Jind", R],
    ["Reliance Industries Ltd, Kakinada 2 CBG plant", AP, "Peddapuram, Samalkot, Kakinada", R],
    ["Reliance Industries Ltd, Kurnool CBG plant", AP, "Ullindakonda, Kallur, Kurnool", R],
    ["Reliance Industries Ltd, Nanded CBG plant", MH, "Kasarkheda, Nanded", R],
    ["Reliance Industries Ltd, Navsari-2 CBG plant", GJ, "Khadsupa, Navsari", R],
    ["UTM Energy Pvt Ltd", UP, "Bhailamau, Bharkhani, Hardoi"],
    ["Naruma Industries Pvt Ltd", UK, "Gordhanpur, Laksar, Haridwar"],
    ["Vyzag Bio-Energy Fuel Pvt Ltd", AP, "Kapuluppada, Bheemunipatnam, Visakhapatnam"],
    ["Jaivik Vikalp Urja LLP", UP, "Hussainpur, Bilari, Moradabad"],
  ],
  // 23 June 2026
  n9: [
    [
      "Reliance Industries Ltd, Bilaspur CBG plant",
      "Chhattisgarh",
      "Bharni, Takhatpur, Bilaspur",
      R,
    ],
    ["Reliance Industries Ltd, Dhenkanal CBG plant", "Odisha", "Baulpur, Dhenkanal", R],
    ["Reliance Industries Ltd, Hapur CBG plant", UP, "Chamri, Hapur", R],
    ["Reliance Industries Ltd, Jabalpur CBG plant", MP, "Khairi, Panagar, Jabalpur", R],
    ["Reliance Industries Ltd, Kurkumbh CBG plant", MH, "Kurkumbh MIDC, Daund, Pune", R],
    ["Reliance Industries Ltd, Malegaon CBG plant", MH, "Chikhalohal, Malegaon, Nashik", R],
    ["Reliance Industries Ltd, Nellore CBG plant", AP, "Peyyalapalem, Kodavalur, Nellore", R],
    ["Reliance Industries Ltd, Raipur CBG plant (Jamgaon)", "Chhattisgarh", "Patan, Durg", R],
    ["Turquoise Bio Natural Energy Pvt Ltd", GJ, "Ochhan, Amod, Bharuch"],
  ],
  // 27 July 2026
  n10: [
    ["CBG Project Coorg", KA, "Elkhil Estates, Virajpet, Kodagu"],
    ["Dev&Gargi Greenenergy LLP", UP, "Naujheel Bangar, Mathura"],
    ["Shivshanaya Biofuels Pvt Ltd", RJ, "Rawatsar, Hanumangarh"],
    ["Melgiri Green Energies Pvt Ltd", KA, "Solur, Anekal, Bengaluru"],
    ["Gangaa Oorja LLP", GJ, "Kamalchhod, Valod, Tapi"],
    ["Anand Energy", PB, "Kala Tibba, Abohar, Fazilka"],
    ["Victory Green Energies Pvt Ltd", GJ, "Dhamrod, Mangrol, Surat"],
    ["Vindhya Green Energy Solutions Pvt Ltd", UP, "Bijurahi, Chunar, Mirzapur"],
  ],
};

export const PLANTS: FomPlant[] = NOTIFICATIONS.flatMap((n) =>
  (TABLES[n.id] ?? []).map(([name, state, place, parent]) => ({
    name,
    state,
    place,
    notification: n.id,
    ...(parent ? { parent } : {}),
  })),
);

/** Three years from the publication date (the gazette says "three years from the date of publication"). */
export function authorisationEnds(published: string): string {
  const d = new Date(`${published}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + 3);
  return d.toISOString().slice(0, 10);
}

export function isCurrent(published: string, now: Date): boolean {
  return now.toISOString().slice(0, 10) < authorisationEnds(published);
}

export const notificationById = (id: string): FomNotification =>
  NOTIFICATIONS.find((n) => n.id === id)!;
