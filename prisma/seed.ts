import 'dotenv/config';
import { PostType, PublishStatus } from '@prisma/client';
import prisma from '../src/lib/prisma';

async function main() {
  // Očisti bazu podataka prije seadanja
  await prisma.prediction.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Baza podataka očišćena.');

  // 1. Kreiraj autore (Korisnike)
  const marko = await prisma.user.create({
    data: {
      name: 'Marko Horvat',
      email: 'marko.horvat@combatportal.hr',
      role: 'ADMIN',
      bio: 'Dugogodišnji borilački novinar i analitičar, bivši amaterski kickboksač. Specijaliziran za MMA i UFC analize.',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    },
  });

  const ivan = await prisma.user.create({
    data: {
      name: 'Ivan Kovačević',
      email: 'ivan.kovacevic@combatportal.hr',
      role: 'EDITOR',
      bio: 'Stručnjak za boks i povijest plemenite vještine. Piše kolumne i tjedne preglede zbivanja u teškoj kategoriji.',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150&q=80',
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

  const tagFnc = await prisma.tag.create({
    data: { name: 'FNC', slug: 'fnc' },
  });

  const tagKsw = await prisma.tag.create({
    data: { name: 'KSW', slug: 'ksw' },
  });

  console.log('Tagovi kreirani.');

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
      winner: 'Jon Jones',
      method: 'Tehnički nokaut (TKO - Ground and Pound)',
      predictedRound: '3. runda',
      confidenceScore: 75,
      keyReasoning: 'Jonesova sposobnost kontrole distance i korištenje laktova u klinču postupno će umoriti Miočića. Očekujemo rušenje u trećoj rundi i završetak borbe na tlu.',
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
      winner: 'Rico Verhoeven',
      method: 'Jednoglasna odluka sudaca (UD)',
      predictedRound: '5. runda',
      confidenceScore: 85,
      keyReasoning: 'Hari će krenuti iznimno eksplozivno u prve dvije runde, no Rico će preživjeti početni pritisak te zahvaljujući konstantnom ritmu i "low kickovima" dominirati u kasnijim rundama za sigurnu sudačku odluku.',
    },
  });

  console.log('Predikcije kreirane.');
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
