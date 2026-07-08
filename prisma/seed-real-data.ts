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

  const pereira = await prisma.fighter.create({
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
