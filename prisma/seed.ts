import 'dotenv/config';
import { PostType, PublishStatus } from '@prisma/client';
import prisma, { prisma as prismaClient } from '../src/lib/prisma';
import { saltAndHashPassword } from '../src/lib/auth-utils';

async function main() {
  const db = prismaClient || prisma;
  if (!db) {
    throw new Error("Prisma client not found in default or named exports");
  }
  const prismaInstance = db;

  // Očisti bazu podataka prije seadanja
  await prismaInstance.session.deleteMany({});
  await prisma.prediction.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.subscriber.deleteMany({});
  await prisma.fighter.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Baza podataka očišćena.');

  // 1. Kreiraj autore (Korisnike) s lozinkama
  await prisma.user.create({
    data: {
      name: 'Mislav Vukušić',
      email: 'mvukusic67@gmail.com',
      role: 'ADMIN',
      bio: 'Glavni administrator i osnivač CombatPortal HR portala.',
      passwordHash: saltAndHashPassword('Passwod2026!'),
    },
  });

  const marko = await prisma.user.create({
    data: {
      name: 'Marko Horvat',
      email: 'marko.horvat@combatportal.hr',
      role: 'ADMIN',
      bio: 'Dugogodišnji borilački novinar i analitičar, bivši amaterski kickboksač. Specijaliziran za MMA i UFC analize.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      passwordHash: saltAndHashPassword('marko1234'),
    },
  });

  const ivan = await prisma.user.create({
    data: {
      name: 'Ivan Kovačević',
      email: 'ivan.kovacevic@combatportal.hr',
      role: 'EDITOR',
      bio: 'Stručnjak za boks i povijest plemenite vještine. Piše kolumne i tjedne preglede zbivanja u teškoj kategoriji.',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80',
      passwordHash: saltAndHashPassword('ivan1234'),
    },
  });

  console.log('Autori kreirani.');

  // 2. Kreiraj kategorije
  const mmaCat = await prisma.category.create({
    data: { name: 'MMA', slug: 'mma' },
  });

  const boksCat = await prisma.category.create({
    data: { name: 'Boks', slug: 'boks' },
  });

  const kickCat = await prisma.category.create({
    data: { name: 'Kickboks', slug: 'kickboks' },
  });

  console.log('Kategorije kreirane.');

  // 3. Kreiraj tagove
  const tagUfc = await prisma.tag.create({
    data: { name: 'UFC', slug: 'ufc' },
  });

  const tagMiocic = await prisma.tag.create({
    data: { name: 'Stipe Miočić', slug: 'stipe-miocic' },
  });

  const tagJones = await prisma.tag.create({
    data: { name: 'Jon Jones', slug: 'jon-jones' },
  });

  await prisma.tag.create({
    data: { name: 'FNC', slug: 'fnc' },
  });

  const tagKsw = await prisma.tag.create({
    data: { name: 'KSW', slug: 'ksw' },
  });

  console.log('Tagovi kreirani.');

  // 3.5 Kreiraj borce (FIGHTERS)
  const jones = await prisma.fighter.create({
    data: {
      name: 'Jon Jones',
      slug: 'jon-jones',
      weightClass: 'Teška (Heavyweight)',
      record: '27-1-0 (1 NC)',
      stance: 'Orthodox',
      team: 'Jackson Wink MMA',
      imageUrl: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Jon Jones se smatra jednim od najvećih MMA boraca svih vremena, bivši dugogodišnji prvak poluteške kategorije i trenutni UFC prvak teške kategorije.'
    }
  });

  const miocic = await prisma.fighter.create({
    data: {
      name: 'Stipe Miočić',
      slug: 'stipe-miocic',
      weightClass: 'Teška (Heavyweight)',
      record: '20-4-0',
      stance: 'Orthodox',
      team: 'Strong Style Fight Team',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Stipe Miočić je najuspješniji prvak teške kategorije u povijesti UFC-a s najviše uzastopnih obrana naslova.'
    }
  });

  const rico = await prisma.fighter.create({
    data: {
      name: 'Rico Verhoeven',
      slug: 'rico-verhoeven',
      weightClass: 'Teška (Super Heavyweight)',
      record: '60-10-0',
      stance: 'Orthodox',
      team: 'Superpro Sportcenter',
      imageUrl: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Rico Verhoeven je nizozemski kickboksač i trenutni Glory prvak u teškoj kategoriji, poznat kao Kralj Kickboksa.'
    }
  });

  const badr = await prisma.fighter.create({
    data: {
      name: 'Badr Hari',
      slug: 'badr-hari',
      weightClass: 'Teška (Heavyweight)',
      record: '106-16-0',
      stance: 'Orthodox',
      team: "Mike's Gym",
      imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Badr Hari je marokansko-nizozemski kickboksač i bivši K-1 teškaški prvak, poznat po izrazito agresivnom stilu borbe.'
    }
  });

  const joshua = await prisma.fighter.create({
    data: {
      name: 'Anthony Joshua',
      slug: 'anthony-joshua',
      weightClass: 'Teška (Heavyweight)',
      record: '28-3-0',
      stance: 'Orthodox',
      team: 'Ben Davison Academy',
      imageUrl: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Anthony Joshua je britanski profesionalni boksač i dvostruki bivši ujedinjeni svjetski prvak u teškoj kategoriji.'
    }
  });

  const prenga = await prisma.fighter.create({
    data: {
      name: 'Kristian Prenga',
      slug: 'kristian-prenga',
      weightClass: 'Teška (Heavyweight)',
      record: '15-1-0',
      stance: 'Orthodox',
      team: 'Albanian Boxing',
      imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Kristian Prenga je brzorastući albanski teškaški boksač s impresivnim omjerom nokauta.'
    }
  });

  const makhachev = await prisma.fighter.create({
    data: {
      name: 'Islam Makhachev',
      slug: 'islam-makhachev',
      weightClass: 'Laka (Lightweight)',
      record: '26-1-0',
      stance: 'Southpaw',
      team: 'Eagles MMA',
      imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Islam Makhachev je ruski MMA borac i trenutni UFC prvak u lakoj kategoriji.'
    }
  });

  const garry = await prisma.fighter.create({
    data: {
      name: 'Ian Garry',
      slug: 'ian-garry',
      weightClass: 'Velter (Welterweight)',
      record: '15-0-0',
      stance: 'Orthodox',
      team: 'Kill Cliff FC',
      imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Ian Garry je irski neporaženi UFC borac velter kategorije.'
    }
  });

  const hrgovic = await prisma.fighter.create({
    data: {
      name: 'Filip Hrgović',
      slug: 'filip-hrgovic',
      weightClass: 'Teška (Heavyweight)',
      record: '17-1-0',
      stance: 'Orthodox',
      imageUrl: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Filip Hrgović je hrvatski teškaški boksač i osvajač brončane medalje na Olimpijskim igrama 2016.'
    }
  });

  const itauma = await prisma.fighter.create({
    data: {
      name: 'Moses Itauma',
      slug: 'moses-itauma',
      weightClass: 'Teška (Heavyweight)',
      record: '9-0-0',
      stance: 'Southpaw',
      imageUrl: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Moses Itauma je iznimno perspektivni britanski teškaški boksač.'
    }
  });

  const vitasovic = await prisma.fighter.create({
    data: {
      name: 'Ivan Vitasović',
      slug: 'ivan-vitasovic',
      weightClass: 'Teška (Heavyweight)',
      record: '13-6-1',
      stance: 'Orthodox',
      team: 'Trojan Pula',
      imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=400&q=80',
      bio: 'Ivan Vitasović je hrvatski teškaški MMA borac i bivši FNC prvak teške kategorije.'
    }
  });

  console.log('Borci kreirani.');

  // 4. Kreiraj Vijesti (NEWS)
  await prisma.post.create({
    data: {
      title: 'Službeno: Otkazan nastup hrvatskog borca na KSW-u zbog ozljede ramena',
      slug: 'sluzbeno-otkazan-nastup-hrvatskog-borca-na-ksw-u',
      excerpt: 'Nažalost, domaći fanovi morat će pričekati na povratak našeg teškaša u KSW kavez zbog teške ozljede na sparingu.',
      content: `Hrvatski borilački sport doživio je težak udarac uoči nadolazećeg KSW turnira. Prema službenom priopćenju poljske organizacije, naš istaknuti borac morao je otkazati svoj nastup zbog ozbiljne ozljede ramena zadobivene tijekom sparinga prošlog četvrtka.\n\nLiječnički tim potvrdio je da se radi o parcijalnoj rupturi tetive koja zahtijeva hitnu fizikalnu terapiju i minimalno tri mjeseca pauze od bilo kakvog hrvačkog i udaračkog treninga.\n\n"Izuzetno mi je žao što moram razočarati svoje navijače. Pripreme su išle savršeno, nikad se nisam osjećao spremnije, ali ovo je dio sporta. Vratit ću se jači nego ikad", izjavio je naš borac putem svojih društvenih mreža.\n\nKombatPortal doznaje kako KSW već traži zamjenu u zadnji čas kako bi se održala planirana borba u teškoj kategoriji.`,
      featuredImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      authorId: marko.id,
      categoryId: mmaCat.id,
      tags: { connect: [{ id: tagKsw.id }] },
      publishedAt: new Date(Date.now() - 2 * 3600 * 1000), // prije 2 sata
    },
  });

  await prisma.post.create({
    data: {
      title: 'Dana White najavio povijesni UFC 315 s tri borbe za naslov prvaka!',
      slug: 'dana-white-najavio-povijesni-ufc-315',
      excerpt: 'Predsjednik UFC-a ponovno je šokirao borilački svijet najavom megaspektakla u Las Vegasu koji donosi tri borbe za pojas.',
      content: `Sveopće ludilo zavladalo je društvenim mrežama nakon što je Dana White objavio cijeli 'fight card' za predstojeći UFC 315 koji će se održati u Las Vegasu.\n\nNa konferenciji za medije White je potvrdio da će se na istom eventu braniti tri različita pojasa prvaka, što se nije dogodilo već nekoliko godina.\n\nU glavnoj borbi večeri gledat ćemo revanš u poluteškoj kategoriji, dok će se u sunaglavnoj borbi odlučivati o privremenom prvaku srednje kategorije.\n\n"Ovo je card koji smo spremali mjesecima. Svaki borac na ovoj listi je u samom vrhu svoje kategorije. Nemojte treptati jer će ovo biti povijesna noć", izjavio je uzbuđeni predsjednik UFC-a.`,
      featuredImage: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      authorId: marko.id,
      categoryId: mmaCat.id,
      tags: { connect: [{ id: tagUfc.id }] },
      publishedAt: new Date(Date.now() - 5 * 3600 * 1000), // prije 5 sati
    },
  });

  console.log('Vijesti kreirane.');

  // 5. Kreiraj Blogove (BLOG)
  await prisma.post.create({
    data: {
      title: 'Zašto je hrvanje postalo najdominantniji temelj u modernom MMA-u?',
      slug: 'zasto-je-hrvanje-najdominantniji-temelj-u-modernom-mma-u',
      excerpt: 'Stojka privlači publiku i prodaje PPV, ali elitno hrvanje je ono što osvaja i drži šampionske pojaseve.',
      content: `Ako pogledate trenutačne prvake u gotovo svim težinskim kategorijama UFC-a, primijetit ćete jedan zajednički nazivnik: većina njih ima elitnu hrvačku podlogu ili su sposobni diktirati gdje će se borba odvijati zahvaljujući vrhunskoj obrani od rušenja.\n\nTijekom ranih faza Ultimate Fighting Championshipa, brazilski Jiu-Jitsu bio je neprikosnoven. Kasnije je uslijedila era vrhunskih udarača, no danas svjedočimo apsolutnoj dominaciji hrvača koji su prilagodili svoje vještine kavezu.\n\nHrvači posjeduju izuzetnu fizičku spremu, mentalnu čvrstoću i, što je najvažnije, sposobnost kontrole tempa i pozicije borbe. Ako udarač ne može zadržati borbu na nogama, njegova snaga i tehnika postaju beskorisne.\n\nU ovom blogu analiziramo kako se hrvanje razvijalo i zašto borci koji ne posvete dovoljno vremena obrani od rušenja nemaju šanse za dugoročan uspjeh u vrhu modernog MMA-a.`,
      featuredImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.BLOG,
      status: PublishStatus.PUBLISHED,
      authorId: marko.id,
      categoryId: mmaCat.id,
      tags: { connect: [{ id: tagUfc.id }] },
      publishedAt: new Date(Date.now() - 24 * 3600 * 1000), // prije 1 dan
    },
  });

  await prisma.post.create({
    data: {
      title: 'Može li teška kategorija boksa preživjeti odlazak trenutnih zvijezda?',
      slug: 'moze-li-teska-kategorija-boksa-prezivjeti-odlazak-zvijezda',
      excerpt: 'Tyson Fury, Oleksandr Usyk i Anthony Joshua su u poznim boksačkim godinama. Tko su nasljednici?',
      content: `Svjedočimo jednoj od zlatnih era teške kategorije profesionalnog boksa. Posljednjih nekoliko godina donijelo nam je ujedinjenje titula, epske trilogije i stadionske spektakle. No, iza ovog sjaja krije se neizbježno pitanje: što nakon njih?\n\nTyson Fury, Oleksandr Usyk i Anthony Joshua već su prešli trideset i petu godinu života. Iako i dalje pružaju vrhunske predstave, realnost je da im je preostalo još svega nekoliko mečeva prije zaslužene mirovine.\n\nMladi talenti poput Jareda Andersona i nekolicine europskih prospekata pokazuju potencijal, ali nedostatak karizme i sporiji razvoj karijere stvaraju zabrinutost među promotorima.\n\nBoks se nalazi na raskrižju. Hoće li teška kategorija ponovno utonuti u monotoniju ili će se pojaviti novi karizmatični teškaš koji će nositi cijeli sport na svojim leđima?`,
      featuredImage: 'https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.BLOG,
      status: PublishStatus.PUBLISHED,
      authorId: ivan.id,
      categoryId: boksCat.id,
      publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000), // prije 3 dana
    },
  });

  console.log('Blogovi kreirani.');

  // 6. Kreiraj Predikcije (PREDICTION) uz pripadajući Post
  const predictionPost1 = await prisma.post.create({
    data: {
      title: 'Predikcija borbe: Jon Jones vs. Stipe Miočić - Tko odlazi kao kralj teške kategorije?',
      slug: 'predikcija-borbe-jon-jones-vs-stipe-miocic',
      excerpt: 'Analiziramo povijesni sraz dvojice najvećih svih vremena. Tko drži prednost u kavezu i koja je metoda pobjede najizglednija?',
      content: `Došao je trenutak koji smo čekali godinama. Jon Jones brani titulu teške kategorije protiv najuspješnijeg teškaša u povijesti UFC-a, našeg Stipe Miočića.\n\nJones ulazi u ovu borbu kao favorit kladionica, najviše zbog svoje nevjerojatne svestranosti i nepobijeđenog statusa u poluteškoj i teškoj kategoriji. S druge strane, Miočić donosi boksačku elitu, nevjerojatnu izdržljivost i dokazano hrvanje koje je slomilo borce poput Francisa Ngannoua.\n\nKljuč borbe ležat će u distanci. Ako Miočić uspije skratiti distancu i nametnuti svoj boks u prljavom klinču, Jones će biti u problemu. Ipak, Jonesova sposobnost udaranja s distance (kicks) i vrhunski 'fight IQ' trebali bi raditi razliku u kasnijim rundama.`,
      featuredImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.PREDICTION,
      status: PublishStatus.PUBLISHED,
      authorId: marko.id,
      categoryId: mmaCat.id,
      tags: { connect: [{ id: tagUfc.id }, { id: tagMiocic.id }, { id: tagJones.id }] },
      publishedAt: new Date(Date.now() - 12 * 3600 * 1000), // prije 12 sati
    },
  });

  await prisma.prediction.create({
    data: {
      postId: predictionPost1.id,
      fighterA: 'Jon Jones',
      fighterB: 'Stipe Miočić',
      fighterAId: jones.id,
      fighterBId: miocic.id,
      winner: 'Jon Jones',
      method: 'Tehnički nokaut (TKO - Ground and Pound)',
      predictedRound: '3. runda',
      confidenceScore: 75,
      keyReasoning: 'Jonesova sposobnost kontrole distance i korištenje laktova u klinču postupno će umoriti Miočića. Očekujemo rušenje u trećoj rundi i završetak borbe na tlu.',
      votesFighterA: 45,
      votesFighterB: 15,
    },
  });

  const predictionPost2 = await prisma.post.create({
    data: {
      title: 'Predikcija borbe: Badr Hari vs. Rico Verhoeven - Revanš teškaških legendi Kickboksa',
      slug: 'predikcija-borbe-badr-hari-vs-rico-verhoeven',
      excerpt: 'Glory Collision donosi nam treći susret dvojice ljutih rivala. Može li Badr Hari napokon srušiti kralja kickboksa?',
      content: `Rivalstvo koje je obilježilo modernu eru kickboksa dobiva svoje novo poglavlje. Badr Hari, ikona agresivnog stila, ponovno izaziva neprikosnovenog prvaka Rica Verhoevena.\n\nHari je u prethodnim borbama pokazao da ima snagu poslati Rica u nokdaun, ali Ricova kondicijska priprema i taktička disciplina uvijek su prevagnuli kada bi borba ušla u kasniji stadij.\n\nOvo je vjerojatno posljednja šansa za Harija da osvoji pojas, što jamči bespoštednu borbu od prve sekunde.`,
      featuredImage: 'https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=800&h=450&q=80',
      type: PostType.PREDICTION,
      status: PublishStatus.PUBLISHED,
      authorId: ivan.id,
      categoryId: kickCat.id,
      publishedAt: new Date(Date.now() - 48 * 3600 * 1000), // prije 2 dana
    },
  });

  await prisma.prediction.create({
    data: {
      postId: predictionPost2.id,
      fighterA: 'Rico Verhoeven',
      fighterB: 'Badr Hari',
      fighterAId: rico.id,
      fighterBId: badr.id,
      winner: 'Rico Verhoeven',
      method: 'Jednoglasna odluka sudaca (UD)',
      predictedRound: '5. runda',
      confidenceScore: 85,
      keyReasoning: 'Hari će krenuti iznimno eksplozivno u prve dvije runde, no Rico će preživjeti početni pritisak te zahvaljujući konstantnom ritmu i "low kickovima" dominirati u kasnijim rundama za sigurnu sudačku odluku.',
      votesFighterA: 45,
      votesFighterB: 15,
    },
  });
  console.log('Predikcije kreirane.');

  // 7. Kreiraj Nadolazeće Borbe (EVENTS)
  await prisma.event.create({
    data: { fighterA: "Anthony Joshua", fighterB: "Kristian Prenga", fighterAId: joshua.id, fighterBId: prenga.id, event: "Boks: Riyadh Season", date: "25. srpnja" }
  });
  await prisma.event.create({
    data: { fighterA: "Islam Makhachev", fighterB: "Ian Garry", fighterAId: makhachev.id, fighterBId: garry.id, event: "UFC 330", date: "15. kolovoza" }
  });
  await prisma.event.create({
    data: { fighterA: "Filip Hrgović", fighterB: "Moses Itauma", fighterAId: hrgovic.id, fighterBId: itauma.id, event: "Boks: London", date: "29. kolovoza" }
  });
  await prisma.event.create({
    data: { fighterA: "Ivan Vitasović", fighterB: "TBA", fighterAId: vitasovic.id, event: "FNC 33: Zagreb", date: "12. rujna" }
  });
  console.log('Nadolazeće borbe kreirane.');

  // 8. Kreiraj testne pretplatnike (SUBSCRIBERS)
  await prisma.subscriber.create({
    data: { email: "test.pretplatnik@combatportal.hr" }
  });
  console.log('Pretplatnici kreirani.');

  console.log('Uspješno obavljeno seadanje baze podataka!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
