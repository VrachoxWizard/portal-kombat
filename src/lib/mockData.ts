import { PostType, PublishStatus } from "@prisma/client";

export interface MockAuthor {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MockTag {
  id: string;
  name: string;
  slug: string;
}

export interface MockPrediction {
  id: string;
  postId: string;
  fighterA: string;
  fighterB: string;
  winner: string;
  method: string;
  predictedRound: string | null;
  confidenceScore: number;
  keyReasoning: string;
}

export interface MockPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  type: PostType;
  status: PublishStatus;
  authorId: string;
  author: MockAuthor;
  categoryId: string | null;
  category: MockCategory | null;
  tags: MockTag[];
  prediction: MockPrediction | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// 1. Mock Autori
export const MOCK_AUTHORS: Record<string, MockAuthor> = {
  marko: {
    id: "author-marko",
    name: "Marko Horvat",
    email: "marko.horvat@combatportal.hr",
    role: "ADMIN",
    bio: "Dugogodišnji borilački novinar i analitičar, bivši amaterski kickboksač. Specijaliziran za MMA i UFC analize.",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  },
  ivan: {
    id: "author-ivan",
    name: "Ivan Kovačević",
    email: "ivan.kovacevic@combatportal.hr",
    role: "EDITOR",
    bio: "Stručnjak za boks i povijest plemenite vještine. Piše kolumne i tjedne preglede zbivanja u teškoj kategoriji.",
    avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80",
  },
};

// 2. Mock Kategorije
export const MOCK_CATEGORIES: Record<string, MockCategory> = {
  mma: { id: "cat-mma", name: "MMA", slug: "mma" },
  boks: { id: "cat-boks", name: "Boks", slug: "boks" },
  kickboks: { id: "cat-kickboks", name: "Kickboks", slug: "kickboks" },
};

// 3. Mock Tagovi
export const MOCK_TAGS: Record<string, MockTag> = {
  ufc: { id: "tag-ufc", name: "UFC", slug: "ufc" },
  miocic: { id: "tag-miocic", name: "Stipe Miočić", slug: "stipe-miocic" },
  jones: { id: "tag-jones", name: "Jon Jones", slug: "jon-jones" },
  fnc: { id: "tag-fnc", name: "FNC", slug: "fnc" },
  ksw: { id: "tag-ksw", name: "KSW", slug: "ksw" },
};

// 4. Mock Objave (Posts) i Predikcije
export const MOCK_POSTS: MockPost[] = [
  {
    id: "post-jones-miocic",
    title: "Predikcija borbe: Jon Jones vs. Stipe Miočić - Tko odlazi kao kralj teške kategorije?",
    slug: "predikcija-borbe-jon-jones-vs-stipe-miocic",
    excerpt: "Analiziramo povijesni sraz dvojice najvećih svih vremena. Tko drži prednost u kavezu i koja je metoda pobjede najizglednija?",
    content: `Došao je trenutak koji smo čekali godinama. Jon Jones brani titulu teške kategorije protiv najuspješnijeg teškaša u povijesti UFC-a, našeg Stipe Miočića.

Jones ulazi u ovu borbu kao favorit kladionica, najviše zbog svoje nevrieve svestranosti i nepobijeđenog statusa u poluteškoj i teškoj kategoriji. S druge strane, Miočić donosi boksačku elitu, nevjerojatnu izdržljivost i dokazano hrvanje koje je slomilo borce poput Francisa Ngannoua.

Ključ borbe ležat će u distanci. Ako Miočić uspije skratiti distancu i nametnuti svoj boks u prljavom klinču, Jones će biti u problemu. Ipak, Jonesova sposobnost udaranja s distance (kicks) i vrhunski 'fight IQ' trebali bi raditi razliku u kasnijim rundama.

Jonesova hrvačka podloga iz juniora i kreativni grappling u UFC-u predstavljat će golem test za Miočića, pogotovo ako se borba preseli na tlo u kasnijim rundama. Očekuje nas taktičko nadmudrivanje na najvišoj mogućoj razini.`,
    featuredImage: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=1200&h=600&q=80",
    type: PostType.PREDICTION,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.marko.id,
    author: MOCK_AUTHORS.marko,
    categoryId: MOCK_CATEGORIES.mma.id,
    category: MOCK_CATEGORIES.mma,
    tags: [MOCK_TAGS.ufc, MOCK_TAGS.miocic, MOCK_TAGS.jones],
    createdAt: new Date(Date.now() - 12 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 12 * 3600 * 1000),
    prediction: {
      id: "pred-jones-miocic",
      postId: "post-jones-miocic",
      fighterA: "Jon Jones",
      fighterB: "Stipe Miočić",
      winner: "Jon Jones",
      method: "Tehnički nokaut (TKO - Ground and Pound)",
      predictedRound: "3. runda",
      confidenceScore: 75,
      keyReasoning: "Jonesova sposobnost kontrole distance i korištenje laktova u klinču postupno će umoriti Miočića. Očekujemo rušenje u trećoj rundi i završetak borbe na tlu.",
    },
  },
  {
    id: "post-ksw-otkazivanje",
    title: "Službeno: Otkazan nastup hrvatskog borca na KSW-u zbog ozljede ramena",
    slug: "sluzbeno-otkazan-nastup-hrvatskog-borca-na-ksw-u",
    excerpt: "Nažalost, domaći fanovi morat će pričekati na povratak našeg teškaša u KSW kavez zbog teške ozljede na sparingu.",
    content: `Hrvatski borilački sport doživio je težak udarac uoči nadolazećeg KSW turnira. Prema službenom priopćenju poljske organizacije, naš istaknuti borac morao je otkazati svoj nastup zbog ozbiljne ozljede ramena zadobivene tijekom sparinga prošlog četvrtka.

Liječnički tim potvrdio je da se radi o parcijalnoj rupturi tetive koja zahtijeva hitnu fizikalnu terapiju i minimalno tri mjeseca pauze od bilo kakvog hrvačkog i udaračkog treninga.

"Izuzetno mi je žao što moram razočarati svoje navijače. Pripreme su išle savršeno, nikad se nisam osjećao spremnije, ali ovo je dio sporta. Vratit ću se jači nego ikad", izjavio je naš borac putem svojih društvenih mreža.

KombatPortal doznaje kako KSW već traži zamjenu u zadnji čas kako bi se održala planirana borba u teškoj kategoriji. Očekuje se da će zamjenski borac biti objavljen u narednim danima.`,
    featuredImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&h=450&q=80",
    type: PostType.NEWS,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.marko.id,
    author: MOCK_AUTHORS.marko,
    categoryId: MOCK_CATEGORIES.mma.id,
    category: MOCK_CATEGORIES.mma,
    tags: [MOCK_TAGS.ksw],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000),
    prediction: null,
  },
  {
    id: "post-ufc-315-najava",
    title: "Dana White najavio povijesni UFC 315 s tri borbe za naslov prvaka!",
    slug: "dana-white-najavio-povijesni-ufc-315",
    excerpt: "Predsjednik UFC-a ponovno je šokirao borilački svijet najavom megaspektakla u Las Vegasu koji donosi tri borbe za pojas.",
    content: `Sveopće ludilo zavladalo je društvenim mrežama nakon što je Dana White objavio cijeli 'fight card' za predstojeći UFC 315 koji će se održati u Las Vegasu.

Na konferenciji za medije White je potvrdio da će se na istom eventu braniti tri različita pojasa prvaka, što se nije dogodilo već nekoliko godina.

U glavnoj borbi večeri gledat ćemo revanš u poluteškoj kategoriji, dok će se u sunaglavnoj borbi odlučivati o privremenom prvaku srednje kategorije.

"Ovo je card koji smo spremali mjesecima. Svaki borac na ovoj listi je u samom vrhu svoje kategorije. Nemojte treptati jer će ovo biti povijesna noć", izjavio je uzbuđeni predsjednik UFC-a.

Karte kreću u prodaju već krajem ovog tjedna, a očekuje se da će T-Mobile Arena biti rasprodana u rekordnom roku.`,
    featuredImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=450&q=80",
    type: PostType.NEWS,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.marko.id,
    author: MOCK_AUTHORS.marko,
    categoryId: MOCK_CATEGORIES.mma.id,
    category: MOCK_CATEGORIES.mma,
    tags: [MOCK_TAGS.ufc],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 5 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000),
    prediction: null,
  },
  {
    id: "post-hrvanje-mma",
    title: "Zašto je hrvanje postalo najdominantniji temelj u modernom MMA-u?",
    slug: "zasto-je-hrvanje-najdominantniji-temelj-u-modernom-mma-u",
    excerpt: "Stojka privlači publiku i prodaje PPV, ali elitno hrvanje je ono što osvaja i drži šampionske pojaseve.",
    content: `Ako pogledate trenutačne prvake u gotovo svim težinskim kategorijama UFC-a, primijetit ćete jedan zajednički nazivnik: većina njih ima elitnu hrvačku podlogu ili su sposobni diktirati gdje će se borba odvijati zahvaljujući vrhunskoj obrani od rušenja.

Tijekom ranih faza Ultimate Fighting Championshipa, brazilski Jiu-Jitsu bio je neprikosnoven. Kasnije je uslijedila era vrhunskih udarača, no danas svjedočimo apsolutnoj dominaciji hrvača koji su prilagodili svoje vještine kavezu.

Hrvači posjeduju izuzetnu fizičku spremu, mentalnu čvrstoću i, što je najvažnije, sposobnost kontrole tempa i pozicije borbe. Ako udarač ne može zadržati borbu na nogama, njegova snaga i tehnika postaju beskorisne.

U ovom blogu analiziramo kako se hrvanje razvijalo i zašto borci koji ne posvete dovoljno vremena obrani od rušenja nemaju šanse za dugoročan uspjeh u vrhu modernog MMA-a.`,
    featuredImage: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=450&q=80",
    type: PostType.BLOG,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.marko.id,
    author: MOCK_AUTHORS.marko,
    categoryId: MOCK_CATEGORIES.mma.id,
    category: MOCK_CATEGORIES.mma,
    tags: [MOCK_TAGS.ufc],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 24 * 3600 * 1000),
    prediction: null,
  },
  {
    id: "post-boks-buducnost",
    title: "Može li teška kategorija boksa preživjeti odlazak trenutnih zvijezda?",
    slug: "moze-li-teska-kategorija-boksa-prezivjeti-odlazak-zvijezda",
    excerpt: "Tyson Fury, Oleksandr Usyk i Anthony Joshua su u poznim boksačkim godinama. Tko su nasljednici?",
    content: `Svjedočimo jednoj od zlatnih era teške kategorije profesionalnog boksa. Posljednjih nekoliko godina donijelo nam je ujedinjenje titula, epske trilogije i stadionske spektakle. No, iza ovog sjaja krije se neizbježno pitanje: što nakon njih?

Tyson Fury, Oleksandr Usyk i Anthony Joshua već su prešli trideset i petu godinu života. Iako i dalje pružaju vrhunske predstave, realnost je da im je preostalo još svega nekoliko mečeva prije zaslužene mirovine.

Mladi talenti poput Jareda Andersona i nekolicine europskih prospekata pokazuju potencijal, ali nedostatak karizme i sporiji razvoj karijere stvaraju zabrinutost među promotorima.

Boks se nalazi na raskrižju. Hoće li teška kategorija ponovno utonuti u monotoniju ili će se pojaviti novi karizmatični teškaš koji će nositi cijeli sport na svojim leđima?`,
    featuredImage: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=800&h=450&q=80",
    type: PostType.BLOG,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.ivan.id,
    author: MOCK_AUTHORS.ivan,
    categoryId: MOCK_CATEGORIES.boks.id,
    category: MOCK_CATEGORIES.boks,
    tags: [],
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
    prediction: null,
  },
  {
    id: "post-hari-verhoeven",
    title: "Predikcija borbe: Badr Hari vs. Rico Verhoeven - Revanš teškaških legendi Kickboksa",
    slug: "predikcija-borbe-badr-hari-vs-rico-verhoeven",
    excerpt: "Glory Collision donosi nam treći susret dvojice ljutih rivala. Može li Badr Hari napokon srušiti kralja kickboksa?",
    content: `Rivalstvo koje je obilježilo modernu eru kickboksa dobiva svoje novo poglavlje. Badr Hari, ikona agresivnog stila, ponovno izaziva neprikosnovenog prvaka Rica Verhoevena.

Hari je u prethodnim borbama pokazao da ima snagu poslati Rica u nokdaun, ali Ricova kondicijska priprema i taktička disciplina uvijek su prevagnuli kada bi borba ušla u kasniji stadij.

Ovo je vjerojatno posljednja šansa za Harija da osvoji pojas, što jamči bespoštednu borbu od prve sekunde.`,
    featuredImage: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=800&h=450&q=80",
    type: PostType.PREDICTION,
    status: PublishStatus.PUBLISHED,
    authorId: MOCK_AUTHORS.ivan.id,
    author: MOCK_AUTHORS.ivan,
    categoryId: MOCK_CATEGORIES.kickboks.id,
    category: MOCK_CATEGORIES.kickboks,
    tags: [MOCK_TAGS.ksw], // seeded with ksw tags
    createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    prediction: {
      id: "pred-hari-verhoeven",
      postId: "post-hari-verhoeven",
      fighterA: "Rico Verhoeven",
      fighterB: "Badr Hari",
      winner: "Rico Verhoeven",
      method: "Jednoglasna odluka sudaca (UD)",
      predictedRound: "5. runda",
      confidenceScore: 85,
      keyReasoning: "Hari će krenuti iznimno eksplozivno u prve dvije runde, no Rico će preživjeti početni pritisak te zahvaljujući konstantnom ritmu i 'low kickovima' dominirati u kasnijim rundama za sigurnu sudačku odluku.",
    },
  },
];

// 5. Nadolazeće borbe za Sidebar
export interface UpcomingFight {
  id: string;
  fighterA: string;
  fighterB: string;
  event: string;
  date: string;
}

export const MOCK_UPCOMING_FIGHTS: UpcomingFight[] = [
  { id: "1", fighterA: "Anthony Joshua", fighterB: "Kristian Prenga", event: "Boks: Riyadh Season", date: "25. srpnja" },
  { id: "2", fighterA: "Islam Makhachev", fighterB: "Ian Garry", event: "UFC 330", date: "15. kolovoza" },
  { id: "3", fighterA: "Filip Hrgović", fighterB: "Moses Itauma", event: "Boks: London", date: "29. kolovoza" },
  { id: "4", fighterA: "Ivan Vitasović", fighterB: "TBA", event: "FNC 33: Zagreb", date: "12. rujna" },
];

// 6. Helperi za upite
export function getMockPosts(filters?: {
  type?: PostType;
  category?: string;
  tag?: string;
  search?: string;
}) {
  let result = [...MOCK_POSTS];

  if (filters) {
    if (filters.type) {
      result = result.filter((p) => p.type === filters.type);
    }
    if (filters.category) {
      result = result.filter(
        (p) => p.category?.slug.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    if (filters.tag) {
      result = result.filter((p) =>
        p.tags.some((t) => t.slug.toLowerCase() === filters.tag?.toLowerCase())
      );
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q)
      );
    }
  }

  // Uvijek sortiraj najnovije objave prve
  return result.sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });
}

export function getMockArticleBySlug(slug: string) {
  return MOCK_POSTS.find((p) => p.slug === slug) || null;
}

export function getMockPopularTags() {
  const counts: Record<string, { tag: MockTag; count: number }> = {};
  
  MOCK_POSTS.forEach((post) => {
    post.tags.forEach((tag) => {
      if (!counts[tag.slug]) {
        counts[tag.slug] = { tag, count: 0 };
      }
      counts[tag.slug].count++;
    });
  });

  return Object.values(counts)
    .map((item) => ({
      name: item.tag.name,
      slug: item.tag.slug,
      count: item.count + 4, // Add baseline padding to simulate active database stats
    }))
    .sort((a, b) => b.count - a.count);
}

export function getMockUpcomingFights() {
  return MOCK_UPCOMING_FIGHTS;
}
