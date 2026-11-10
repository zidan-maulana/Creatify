export type DivisionId =
  | "ketua-wakil"
  | "visual-creative"
  | "executive-committee"
  | "talent-content"
  | "research-development";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  divisionId: DivisionId;
  photo: string;
  avatar?: string;
  quoteText?: string;
  instagramUrl?: string;
  isLeader?: boolean;
}

export interface DivisionFilterOption {
  id: DivisionId;
  badge: string;
}

export const DIVISION_OPTIONS: DivisionFilterOption[] = [
  { id: "ketua-wakil", badge: "Ketua & Wakil" },
  { id: "visual-creative", badge: "Visual & Creative" },
  { id: "executive-committee", badge: "Executive Committee" },
  { id: "talent-content", badge: "Talent & Content" },
  { id: "research-development", badge: "Research Development" },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
  // 1. Ketua & Wakil Ketua
  {
    id: "rafi-alfarisyi",
    name: "Rafi Al-Farisyi",
    role: "Ketua Umum Creatify",
    divisionId: "ketua-wakil",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&crop=face&w=300&h=300&q=80",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=80",
    quoteText:
      "Misi utama Creatify adalah membuka ruang eksplorasi di mana setiap mahasiswa Fasilkom dapat bereksperimen, berkolaborasi, dan menghasilkan karya visual berkualitas tinggi.",
    isLeader: true,
  },
  {
    id: "syifa-azzahra",
    name: "Syifa Azzahra",
    role: "Wakil Ketua Umum Creatify",
    divisionId: "ketua-wakil",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&crop=face&w=300&h=300&q=80",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=80",
    quoteText:
      "Sinergi antar divisi adalah pondasi utama terwujudnya ekosistem karya yang solid. Mengkoordinasikan kebutuhan lintas divisi dari pra-produksi hingga rilis akhir.",
    isLeader: true,
  },

  // 2. Divisi Visual & Creative
  {
    id: "aditya-pratama",
    name: "Aditya Pratama",
    role: "Head of Visual & Creative",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=80",
    isLeader: true,
  },
  {
    id: "dinda-maharani",
    name: "Dinda Maharani",
    role: "Staff Illustration & Digital Asset",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "bagas-perkasa",
    name: "Bagas Perkasa",
    role: "Staff Print & Publication Design",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "farhan-maulana",
    name: "Farhan Maulana",
    role: "Staff Typography & Editorial Layout",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "nabila-putri",
    name: "Nabila Putri",
    role: "Staff Social Media Graphic Design",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "rizky-ramadhan",
    name: "Rizky Ramadhan",
    role: "Staff Merchandise & Apparel Design",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "annisa-larasati",
    name: "Annisa Larasati",
    role: "Staff Visual Kit & Iconography",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "dimas-wicaksono",
    name: "Dimas Wicaksono",
    role: "Staff 3D Visual & Key Visual",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "tiara-safitri",
    name: "Tiara Safitri",
    role: "Staff Stage Kit & Virtual Backdrop",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "fajar-nugraha",
    name: "Fajar Nugraha",
    role: "Staff Infographics & Data Visualization",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "zahra-aulia",
    name: "Zahra Aulia",
    role: "Staff UI Visual & Digital Asset",
    divisionId: "visual-creative",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=1000&q=80",
  },

  // 3. Divisi Talent & Content
  {
    id: "kevin-hendrawan",
    name: "Kevin Hendrawan",
    role: "Head of Talent & Content",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=80",
    isLeader: true,
  },
  {
    id: "ahmad-fauzi",
    name: "Ahmad Fauzi",
    role: "Staff Video Editor & Colorist",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "maya-anggraini",
    name: "Maya Anggraini",
    role: "Staff Motion Graphic Designer",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "gilang-ramadhan",
    name: "Gilang Ramadhan",
    role: "Staff Director of Photography",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "rian-pratama",
    name: "Rian Pratama",
    role: "Staff Audio Engineer & Sound Designer",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "sarah-oktavia",
    name: "Sarah Oktavia",
    role: "Staff Aerial Videography & Drone Pilot",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "ilham-hidayat",
    name: "Ilham Hidayat",
    role: "Staff 3D Animation & Visual FX",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "bella-claudia",
    name: "Bella Claudia",
    role: "Staff Short-Form & Vertical Video",
    divisionId: "talent-content",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=80",
  },

  // 4. Divisi Research Development
  {
    id: "clarissa-valery",
    name: "Clarissa Valery",
    role: "Head of Research Development",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=80",
    isLeader: true,
  },
  {
    id: "rehan-saputra",
    name: "Rehan Saputra",
    role: "Staff Content Creator & Talent Host",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "tasya-kamila",
    name: "Tasya Kamila",
    role: "Staff Copywriting & Storyteller",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "wahyu-hidayat",
    name: "Wahyu Hidayat",
    role: "Staff Trend & Platform Research",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "nadya-rahma",
    name: "Nadya Rahma",
    role: "Staff Community Engagement",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "alifian-kurnia",
    name: "Alifian Kurnia",
    role: "Staff Visual Trend Researcher",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=80",
  },
  {
    id: "salma-sabrina",
    name: "Salma Sabrina",
    role: "Staff Analytics & Performance Insights",
    divisionId: "research-development",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=1000&q=80",
  },
];
