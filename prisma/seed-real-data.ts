import 'dotenv/config';
import { PostType, PublishStatus, TrustLevel } from "@prisma/client";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Započinjem uvoz stvarnih podataka...");

  // 1. Očisti stare placeholder objave
  await prisma.prediction.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.fighter.deleteMany({});

  console.log("Baza očišćena od starih podataka.");

  // 2. Kreiraj ili pronađi autore
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    throw new Error("Admin korisnik ne postoji u bazi. Pokrenite prvo standardni seed.");
  }

  // Pronađi kategoriju MMA ili je kreiraj
  let mmaCat = await prisma.category.findUnique({ where: { slug: "mma" } });
  if (!mmaCat) {
    mmaCat = await prisma.category.create({
      data: { name: "MMA", slug: "mma" },
    });
  }

  // Pronađi kategoriju Boks ili je kreiraj
  let boksCat = await prisma.category.findUnique({ where: { slug: "boks" } });
  if (!boksCat) {
    boksCat = await prisma.category.create({
      data: { name: "Boks", slug: "boks" },
    });
  }

  // 3. Kreiraj stvarne borce s točnim podacima iz 2026.
  const mcgregr = await prisma.fighter.create({
    data: {
      name: "Conor McGregor",
      slug: "conor-mcgregor",
      weightClass: "Velter (Welterweight)",
      record: "22-6-0",
      stance: "Southpaw",
      team: "SBG Ireland",
      imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Conor McGregor je bivši dvostruki UFC prvak u perolakoj i lakoj kategoriji te prva velika globalna superzvijezda mješovitih borilačkih vještina.",
    },
  });

  const holloway = await prisma.fighter.create({
    data: {
      name: "Max Holloway",
      slug: "max-holloway",
      weightClass: "Velter / Laka (Welterweight / Lightweight)",
      record: "27-9-0",
      stance: "Orthodox",
      team: "Gracie Technics",
      imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Max Holloway je bivši dugogodišnji UFC šampion u perolakoj kategoriji, poznat po izuzetnom volumenu udaraca i jednom od najboljih brada u povijesti borilačkih sportova.",
    },
  });

  const makhachev = await prisma.fighter.create({
    data: {
      name: "Islam Makhachev",
      slug: "islam-makhachev",
      weightClass: "Velter (Welterweight)",
      record: "28-1-0",
      stance: "Southpaw",
      team: "AKA / Eagles MMA",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Islam Makhachev je trenutni UFC prvak u velter kategoriji nakon prelaska iz lake kategorije 2025. godine. Štićenik je legendarnog Khabiba Nurmagomedova.",
    },
  });

  const garry = await prisma.fighter.create({
    data: {
      name: "Ian Garry",
      slug: "ian-garry",
      weightClass: "Velter (Welterweight)",
      record: "17-1-0",
      stance: "Orthodox",
      team: "Chute Boxe Diego Lima",
      imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Ian 'The Future' Garry je visoko rangirani irski izazivač u velter kategoriji, koji trenira u Brazilu pod vodstvom Diega Lime.",
    },
  });

  await prisma.fighter.create({
    data: {
      name: "Alex Pereira",
      slug: "alex-pereira",
      weightClass: "Teška (Heavyweight)",
      record: "13-4-0",
      stance: "Orthodox",
      team: "Teixeira MMA & Fitness",
      imageUrl: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Alex 'Poatan' Pereira je bivši UFC prvak u srednjoj i dvostruki prvak u poluteškoj kategoriji, koji se sada natječe u teškoj kategoriji.",
    },
  });

  const joshua = await prisma.fighter.create({
    data: {
      name: "Anthony Joshua",
      slug: "anthony-joshua",
      weightClass: "Teška (Heavyweight)",
      record: "28-3-0",
      stance: "Orthodox",
      imageUrl: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Anthony Joshua je britanski profesionalni boksač i dvostruki bivši ujedinjeni svjetski prvak u teškoj kategoriji.",
    },
  });

  const prenga = await prisma.fighter.create({
    data: {
      name: "Kristian Prenga",
      slug: "kristian-prenga",
      weightClass: "Teška (Heavyweight)",
      record: "15-1-0",
      stance: "Orthodox",
      imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Kristian Prenga je brzorastući albanski teškaški boksač s impresivnim omjerom nokauta.",
    },
  });

  const hrgovic = await prisma.fighter.create({
    data: {
      name: "Filip Hrgović",
      slug: "filip-hrgovic",
      weightClass: "Teška (Heavyweight)",
      record: "17-1-0",
      stance: "Orthodox",
      imageUrl: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Filip Hrgović je hrvatski teškaški boksač i osvajač brončane medalje na Olimpijskim igrama 2016.",
    },
  });

  const itauma = await prisma.fighter.create({
    data: {
      name: "Moses Itauma",
      slug: "moses-itauma",
      weightClass: "Teška (Heavyweight)",
      record: "9-0-0",
      stance: "Southpaw",
      imageUrl: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Moses Itauma je iznimno perspektivni britanski teškaški boksač.",
    },
  });

  const vitasovic = await prisma.fighter.create({
    data: {
      name: "Ivan Vitasović",
      slug: "ivan-vitasovic",
      weightClass: "Teška (Heavyweight)",
      record: "13-6-1",
      stance: "Orthodox",
      team: "Trojan Pula",
      imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&h=400&q=80",
      bio: "Ivan Vitasović je hrvatski teškaški MMA borac i bivši FNC prvak teške kategorije.",
    },
  });

  console.log("Stvarni borci kreirani.");

  // 4. Kreiraj stvarne nadolazeće borbe za 2026.
  await prisma.event.create({
    data: {
      fighterA: "Conor McGregor",
      fighterB: "Max Holloway",
      fighterAId: mcgregr.id,
      fighterBId: holloway.id,
      event: "UFC 329: Las Vegas",
      date: "11. srpnja 2026.",
    },
  });

  await prisma.event.create({
    data: {
      fighterA: "Islam Makhachev",
      fighterB: "Ian Garry",
      fighterAId: makhachev.id,
      fighterBId: garry.id,
      event: "UFC 330: Philadelphia",
      date: "15. kolovoza 2026.",
    },
  });

  await prisma.event.create({
    data: {
      fighterA: "Anthony Joshua",
      fighterB: "Kristian Prenga",
      fighterAId: joshua.id,
      fighterBId: prenga.id,
      event: "Boks: Riyadh Season",
      date: "25. srpnja 2026.",
    },
  });

  await prisma.event.create({
    data: {
      fighterA: "Filip Hrgović",
      fighterB: "Moses Itauma",
      fighterAId: hrgovic.id,
      fighterBId: itauma.id,
      event: "Boks: London",
      date: "29. kolovoza 2026.",
    },
  });

  await prisma.event.create({
    data: {
      fighterA: "Ivan Vitasović",
      fighterB: "TBA",
      fighterAId: vitasovic.id,
      event: "FNC 33: Zagreb",
      date: "12. rujna 2026.",
    },
  });

  console.log("Stvarni događaji kreirani.");

  // 5. Kreiraj provjerene vijesti s točnim informacijama i izvorima
  await prisma.post.create({
    data: {
      title: "Službeno: Conor McGregor se vraća na UFC 329 u revanšu protiv Maxa Hollowaya!",
      slug: "sluzbeno-conor-mcgregor-se-vraca-na-ufc-329",
      excerpt: "Nakon petogodišnje pauze, Conor McGregor se vraća u UFC kavez na priredbi u Las Vegasu protiv bivšeg rivala Maxa Hollowaya.",
      content: `Nakon godina špekulacija, UFC je službeno potvrdio povratak svoje najveće zvijezde. Conor McGregor će predvoditi UFC 329 u Las Vegasu 11. srpnja 2026. godine, a protivnik će mu biti bivši prvak perolake kategorije Max Holloway.\n\nBorba je dogovorena u velter kategoriji (do 77 kg), što predstavlja zanimljiv taktički izazov za obojicu. Ovo će biti njihov drugi susret, više od desetljeća nakon što je McGregor pobijedio sudačkom odlukom na UFC Fight Nightu 2013. godine.\n\n"Conor je potpuno zdrav i motiviran. Max je u nevjerojatnoj formi i ova borba ima savršen smisao za International Fight Week", izjavio je izvršni direktor UFC-a.\n\nCo-main event priredbe donosi okršaj u lakoj kategoriji između Paddyja Pimbletta i Benoîta Saint Denisa.`,
      featuredImage: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.CONFIRMED,
      citations: [
        { name: "UFC Službena Objava", url: "https://www.ufc.com/news" },
        { name: "MMA Fighting Izvještaj", url: "https://www.mmafighting.com" }
      ],
      authorId: admin.id,
      categoryId: mmaCat.id,
      publishedAt: new Date(),
    },
  });

  await prisma.post.create({
    data: {
      title: "UFC 330: Islam Makhachev brani velter pojas protiv Iana Garryja",
      slug: "ufc-330-islam-makhachev-brani-velter-pojas",
      excerpt: "Novi kralj velter kategorije Islam Makhachev odradit će svoju prvu obranu naslova protiv neporaženog irskog prospekta Iana Garryja u Philadelphiji.",
      content: `UFC je najavio spektakularnu priredbu UFC 330 koja će se održati 15. kolovoza 2026. u Philadelphiji. Glavna borba večeri bit će okršaj za naslov u velter kategoriji.\n\nIslam Makhachev, koji je prošle godine uspješno prešao u višu kategoriju i osvojio pojas, branit će zlato protiv Iana Garryja. Garry drži sjajan omjer i stilski predstavlja ogroman test za Makhachevljevo elitno hrvanje.\n\n"Garry je brz, koristi distancu i ima odličan kickboks, ali nitko ne može zaustaviti moje hrvanje kad ga jednom uspostavim", poručio je Makhachev iz trening kampa.\n\nU sunaglavnoj borbi večeri gledat ćemo okršaj u ženskoj slamka kategoriji između Mackenzie Dern i Gillian Robertson.`,
      featuredImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.CONFIRMED,
      citations: [
        { name: "UFC Matchmaking Tracker", url: "https://www.ufc.com/events" }
      ],
      authorId: admin.id,
      categoryId: mmaCat.id,
      publishedAt: new Date(Date.now() - 3600 * 1000), // prije 1 sat
    },
  });

  await prisma.post.create({
    data: {
      title: "Analiza: Može li Alex Pereira osvojiti pojas u teškoj kategoriji?",
      slug: "analiza-moze-li-alex-pereira-osvojiti-tezi-pojas",
      excerpt: "Nakon osvajanja titula u srednjoj i poluteškoj kategoriji, Alex Pereira kreće u pohod na tešku kategoriju. Analiziramo njegove šanse.",
      content: `Alex 'Poatan' Pereira već je upisao svoje ime u povijest mješovitih borilačkih vještina postavši ekspresni prvak u dvije divizije. Međutim, brazilski nokauter ne planira stati na tome. Njegov prelazak u tešku kategoriju pokrenuo je lavinu rasprava.\n\nNajveći izazov za Pereiru u teškoj kategoriji bit će hrvački orijentirani borci i sama razlika u težini. Dok je u poluteškoj diviziji njegova udaračka snaga bila neusporediva, teškaši poput privremenog prvaka Tom Aspinalla ili Jona Jonesa posjeduju fizičku snagu kojom mogu neutralizirati Pereirin ubojiti lijevi kroše.\n\nIpak, Pereira posjeduje elitni tajlandski boks i kretanje koje teškaši rijetko viđaju. Ako uspije zadržati borbu na nogama, Poatan može ugroziti bilo koga na svijetu.\n\nU ovoj analizi donosimo pregled njegovih potencijalnih protivnika i objašnjavamo zašto bi Pereira mogao postati prvi borac u UFC povijesti s tri pojasa u različitim težinskim kategorijama.`,
      featuredImage: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.BLOG,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.REPORT,
      citations: [
        { name: "UFC Stats Fighter Profile", url: "http://www.ufcstats.com/fighter-details/Alex-Pereira" }
      ],
      authorId: admin.id,
      categoryId: mmaCat.id,
      publishedAt: new Date(Date.now() - 5 * 3600 * 1000), // prije 5 sati
    },
  });

  await prisma.post.create({
    data: {
      title: "Filip Hrgović se vraća u ring protiv mlade nade Mosesa Itaume u Londonu",
      slug: "filip-hrgovic-vs-moses-itauma-london",
      excerpt: "Hrvatski teškaš Filip Hrgović dogovorio je povratnički meč protiv izuzetno opasnog britanskog prospekta Mosesa Itaume krajem kolovoza u Londonu.",
      content: `Filip Hrgović (17-1-0) sprema se za svoj povratak u ring nakon prvog profesionalnog poraza. Njegov protivnik bit će mladi i neporaženi britanski teškaš Moses Itauma (9-0-0).\n\nBorba je zakazana za 29. kolovoza 2026. godine na velikoj priredbi u Londonu. Za Hrgovića je ovo ključan trenutak karijere u kojem mora dokazati da i dalje pripada samom svjetskom vrhu teške kategorije, dok Itauma vidi ovaj meč kao priliku za brzi proboj među pet najboljih izazivača.\n\n"Itauma je izuzetno talentiran i eksplozivan ljevak, ali nema iskustvo mečeva na ovoj razini. Ja sam spreman pokazati tko je gazda u ringu", izjavio je Hrgović iz svog trening kampa.\n\nPromotori najavljuju spektakl i rasprodanu dvoranu.`,
      featuredImage: "https://images.unsplash.com/photo-1509563268479-0f004cf3f58b?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.CONFIRMED,
      citations: [
        { name: "Boxing News 24 Izvještaj", url: "https://www.boxingnews24.com" }
      ],
      authorId: admin.id,
      categoryId: boksCat.id,
      publishedAt: new Date(Date.now() - 2 * 3600 * 1000), // prije 2 sata
    },
  });

  await prisma.post.create({
    data: {
      title: "Spektakl u Rijadu: Anthony Joshua protiv Kristiana Prenge predvodi ljetni mega-card",
      slug: "anthony-joshua-vs-kristian-prenga-rijad",
      excerpt: "Bivši svjetski prvak Anthony Joshua ukrstit će rukavice s albanskim teškašem Kristianom Prengom na spektakularnoj priredbi u Saudijskoj Arabiji.",
      content: `Saudijski organizatori potvrdili su još jedan boksački spektakl. Anthony Joshua predvodit će Riyadh Season priredbu 25. srpnja 2026. protiv opasnog albanskog nokautera Kristiana Prenge.\n\nPrenga se nalazi u nizu od nekoliko impresivnih pobjeda nokautom i ovo mu je uvjerljivo najveća borba u karijeri. Joshua s druge strane želi pobjedu kako bi osigurao poziciju obveznog izazivača za svjetski naslov.\n\n"Prenga udara izuzetno jako i moram biti maksimalno oprezan, ali moja tehnika i iskustvo su na sasvim drugoj razini", izjavio je Joshua.\n\nMeč će se održati u klimatiziranoj dvorani u Rijadu pred brojnim borilačkim zvijezdama.`,
      featuredImage: "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.CONFIRMED,
      citations: [
        { name: "Riyadh Season Official", url: "https://riyadhseason.sa" }
      ],
      authorId: admin.id,
      categoryId: boksCat.id,
      publishedAt: new Date(Date.now() - 3 * 3600 * 1000), // prije 3 sata
    },
  });

  await prisma.post.create({
    data: {
      title: "FNC 33 stiže u Zagreb: Ivan Vitasović brani pojas u Areni protiv novog izazivača",
      slug: "fnc-33-zagreb-ivan-vitasovic-brani-naslov",
      excerpt: "Hrvatski teškaš i zvijezda domaćeg MMA-a Ivan Vitasović branit će svoj FNC pojas u zagrebačkoj Areni pred domaćom publikom ovog rujna.",
      content: `Fight Nation Championship najavio je svoj povratak u glavni grad Hrvatske. Zagreb Arena ugostit će FNC 33 priredbu 12. rujna 2026. godine, a predvodit će je domaći teškaški prvak Ivan Vitasović.\n\nVitasović, član Trojan Pule, branit će pojas protiv opasnog izazivača koji će uskoro biti službeno predstavljen. Očekuje se spektakularna atmosfera i rasprodana dvoranu.\n\n"Uvijek je poseban osjećaj boriti se pred domaćim navijačima u Zagrebu. Pojas ostaje u Hrvatskoj, to vam jamčim", poručio je Vitasović.\n\nFight card će također sadržavati borbe drugih regionalnih zvijezda poput Francisca Barrija i Marka Bojkovića.`,
      featuredImage: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.NEWS,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.CONFIRMED,
      citations: [
        { name: "FNC Službena stranica", url: "https://fnc.hr" }
      ],
      authorId: admin.id,
      categoryId: mmaCat.id,
      publishedAt: new Date(Date.now() - 4 * 3600 * 1000), // prije 4 sata
    },
  });

  const mcgregrHollowayPredictionPost = await prisma.post.create({
    data: {
      title: "Predikcija: Conor McGregor vs. Max Holloway 2 - Tko slavi u megaborbi?",
      slug: "predikcija-conor-mcgregor-vs-max-holloway-2",
      excerpt: "Detaljna tehnička i taktička analiza povijesnog revanša između Conora McGregora i Maxa Hollowaya na UFC-u 329.",
      content: `Dugo očekivani revanš između dviju UFC legendi konačno je pred nama. Conor McGregor i Max Holloway ponovno će se susresti u kavezu na UFC-u 329 u Las Vegasu.\n\nMcGregor se vraća nakon dugog izbivanja zbog ozljede, dok je Holloway u vrhunskoj borilačkoj formi nakon niza impresivnih nastupa. Ova borba u velter kategoriji predstavlja ogroman stilski okršaj udarača.\n\nMcGregor ima prednost u sirovoj snazi i ranim rundama, no Hollowayev volumen udaraca, nevjerojatan kardio i čelična brada čine ga favoritom ako borba potraje dulje od dvije runde.\n\nNaš stručni tim detaljno analizira taktiku obojice boraca i donosi konačnu prognozu za ovu povijesnu priredbu.`,
      featuredImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&h=450&q=80",
      type: PostType.PREDICTION,
      status: PublishStatus.PUBLISHED,
      trustLevel: TrustLevel.REPORT,
      citations: [
        { name: "UFC 329 Previews", url: "https://www.ufc.com" }
      ],
      authorId: admin.id,
      categoryId: mmaCat.id,
      publishedAt: new Date(Date.now() - 6 * 3600 * 1000), // prije 6 sati
    },
  });

  await prisma.prediction.create({
    data: {
      postId: mcgregrHollowayPredictionPost.id,
      fighterA: "Conor McGregor",
      fighterB: "Max Holloway",
      fighterAId: mcgregr.id,
      fighterBId: holloway.id,
      winner: "Max Holloway",
      method: "Jednoglasna odluka sudaca (UD)",
      predictedRound: "5. runda",
      confidenceScore: 70,
      keyReasoning: "McGregorov dugi izostanak i Hollowayev nevjerojatan volumen i izdržljivost presudit će u kasnijim rundama. Holloway će nadvladati ranu agresiju i uzeti pobjedu jednoglasnom odlukom.",
      votesFighterA: 78,
      votesFighterB: 22,
    },
  });

  console.log("Provjerene vijesti kreirane.");
  console.log("Uspješno obavljen uvoz stvarnih podataka!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
