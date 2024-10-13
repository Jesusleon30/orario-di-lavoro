// Datos de ejemplo para las categorías
const clienti = [
  {
    name: "--",
    commesse: ["--"],
  },
  {
    name: "Nuova Engineering",
    commesse: ["--",11324, 11624],
  },
  {
    name: "Salumificio Riva - ABB",
    commesse: ["--", 11224, 11524],
  },
  {
    name: "Ancor",
    commesse: ["--",11724],
  },
  {
    name: "Cortenova - officina",
    commesse: ["--",11924],
  },
  {
    name: "Sitem",
    commesse: ["--",12024, 12324],
  },
  {
    name: "ABB - Piastra Adattamento",
    commesse: ["--",12124],
  },
  {
    name: "Cannon Ergos",
    commesse: ["--",12224],
  },
  {
    name: "Radiatori 2000",
    commesse: ["--",12424],
  },
  {
    name: "Electrolux",
    commesse: ["--",12524],
  },
  {
    name: "Ruspa",
    commesse: ["--",11424],
  },
  {
    name: "Ertek",
    commesse: ["--", 7123],
  },
  {
    name: "ABA",
    commesse: ["--"],
  },
  {
    name: "Rofin - ABB",
    commesse: ["--"],
  },
  {
    name: "Ruspa - ABB",
    commesse: ["--"],
  },
  {
    name: "Abor - ABB",
    commesse: ["--"],
  },
  {
    name: "Afros Cannon - ABB",
    commesse: ["--"],
  },
  {
    name: "Avio Rivalta Cemastir - ABB",
    commesse: ["--"],
  },
  {
    name: "C.T.F mobili -ABB",
    commesse: ["--"],
  },
  {
    name: "Cordivari - ABB",
    commesse: ["--"],
  },
  {
    name: "Dana italcardani vercelli - ABB",
    commesse: ["--"],
  },
  {
    name: "Endurance Foa - ABB",
    commesse: ["--"],
  },
  {
    name: "Fomt - ABB",
    commesse: ["--"],
  },
  {
    name: "Fonder Metal - ABB",
    commesse: ["--"],
  },
  {
    name: "Geomag - ABB",
    commesse: ["--"],
  },
  {
    name: "Imer - ABB",
    commesse: ["--"],
  },
  {
    name: "Kuehne-Nagel - ABB",
    commesse: ["--"],
  },
  {
    name: "Montek - ABB",
    commesse: ["--"],
  },
  {
    name: "Olvan - ABB",
    commesse: ["--"],
  },
  {
    name: "Pasticio Lensi - ABB",
    commesse: ["--"],
  },
  {
    name: "Sanac - ABB",
    commesse: ["--"],
  },
  {
    name: "Scarpa-Colombo - ABB",
    commesse: ["--"],
  },
  {
    name: "Spica - ABB",
    commesse: ["--"],
  },
  {
    name: "Tecno Didattica Mappamondi - ABB",
    commesse: ["--"],
  },
  {
    name: "Zeus-Iba - ABB",
    commesse: ["--"],
  },
  {
    name: "Sace - ABB",
    commesse: ["--"],
  },
  {
    name: "Agricola 3 valli - ABB",
    commesse: ["--"],
  },
  {
    name: "ACS Dobfar tribiano - ABB",
    commesse: ["--"],
  },
  {
    name: "Cestaro - ABB",
    commesse: ["--"],
  },
  {
    name: "Elcograf Pozzoni - ABB",
    commesse: ["--"],
  },
  {
    name: "Panificio San Francesco -ABB",
    commesse: ["--"],
  },
  {
    name: "Piaggia - ABB",
    commesse: ["--"],
  },
  {
    name: "Valeo lighting (torino) - ABB",
    commesse: ["--"],
  },
  {
    name: "Agrati AEE Pressofusione",
    commesse: ["--"],
  },
  {
    name: "Amisco",
    commesse: ["--"],
  },
  {
    name: "Aresi",
    commesse: ["--"],
  },
  {
    name: "Artemide",
    commesse: ["--"],
  },
  {
    name: "Artleva pressofusione s4",
    commesse: ["--"],
  },
  {
    name: "Artsana",
    commesse: ["--"],
  },
  {
    name: "Arvin Meritor",
    commesse: ["--"],
  },
  {
    name: "Asitech",
    commesse: ["--"],
  },
  {
    name: "ATS",
    commesse: ["--"],
  },
  {
    name: "Autotest Fortezza",
    commesse: ["--"],
  },
  {
    name: "AVM angelini",
    commesse: ["--"],
  },
  {
    name: "B & B italia schiumatura",
    commesse: ["--"],
  },
  {
    name: "Baruffaldi",
    commesse: ["--"],
  },
  {
    name: "Beretta",
    commesse: ["--"],
  },
  {
    name: "Bernareggi",
    commesse: ["--"],
  },
  {
    name: "Best Sider Lecco",
    commesse: ["--"],
  },
  {
    name: "Bielle Bi Ima componentistica",
    commesse: ["--"],
  },
  {
    name: "Borsani",
    commesse: ["--"],
  },
  {
    name: "BRC - Acquiterme",
    commesse: ["--"],
  },
  {
    name: "Brixia (ex Evolut ora Goffi)",
    commesse: ["--"],
  },
  {
    name: "Brusadelli",
    commesse: ["--"],
  },
  {
    name: "CAE ",
    commesse: ["--"],
  },
  {
    name: "Camit",
    commesse: ["--"],
  },
  {
    name: "Cap Mac",
    commesse: ["--"],
  },
  {
    name: "Casartelli",
    commesse: ["--"],
  },
  {
    name: "Castigioni Robotica",
    commesse: ["--"],
  },
  {
    name: "Cereria Ceratina",
    commesse: ["--"],
  },
  {
    name: "Cetra",
    commesse: ["--"],
  },
  {
    name: "CLA",
    commesse: ["--"],
  },
  {
    name: "Colombo New Scal",
    commesse: ["--"],
  },
  {
    name: "Colosio Presse",
    commesse: ["--"],
  },
  {
    name: "Costan",
    commesse: ["--"],
  },
  {
    name: "Cosveco srl - Agrati AEE",
    commesse: ["--"],
  },
  {
    name: "Cresimecc",
    commesse: ["--"],
  },
  {
    name: "Cromatura Moderna",
    commesse: ["--"],
  },
  {
    name: "Davighi",
    commesse: ["--"],
  },
  {
    name: "Delifrance italia-Panitaly",
    commesse: ["--"],
  },
  {
    name: "Delta_Calor",
    commesse: ["--"],
  },
  {
    name: "Design Venture Partner",
    commesse: ["--"],
  },
  {
    name: "DeTomi",
    commesse: ["--"],
  },
  {
    name: "DiEllelDi",
    commesse: ["--"],
  },
  {
    name: "Dimostrazione 140",
    commesse: ["--"],
  },
  {
    name: "Dmg Meccanica",
    commesse: ["--"],
  },
  {
    name: "Dva de vecchi",
    commesse: ["--"],
  },
  {
    name: "Dynacast",
    commesse: ["--"],
  },
  {
    name: "Ecie",
    commesse: ["--"],
  },
  {
    name: "Ecomp Solaro",
    commesse: ["--"],
  },
  {
    name: "Effebi Imbutitura",
    commesse: ["--"],
  },
  {
    name: "Electrolux",
    commesse: ["--"],
  },
  {
    name: "Enolgas",
    commesse: ["--"],
  },
  {
    name: "Euro Tranciatura",
    commesse: ["--"],
  },
  {
    name: "F.G.C. di Zoni Matteo torneria",
    commesse: ["--"],
  },
  {
    name: "F.lli Rizzi",
    commesse: ["--"],
  },
  {
    name: "Fae",
    commesse: ["--"],
  },
  {
    name: "Faeber",
    commesse: ["--"],
  },
  {
    name: "Falt pressofusione",
    commesse: ["--"],
  },
  {
    name: "Fantauzzi",
    commesse: ["--"],
  },
  {
    name: "FAR",
    commesse: ["--"],
  },
  {
    name: "Feragame",
    commesse: ["--"],
  },
  {
    name: "Ferro Bulloni - France",
    commesse: ["--"],
  },
  {
    name: "Films 1400",
    commesse: ["--"],
  },
  {
    name: "Fiorenzato Padova",
    commesse: ["--"],
  },
  {
    name: "FOA Endurance",
    commesse: ["--"],
  },
  {
    name: "FOMA",
    commesse: ["--"],
  },
  {
    name: "Fonderia Maestri",
    commesse: ["--"],
  },
  {
    name: "Fonderia Mapelli",
    commesse: ["--"],
  },
  {
    name: "Fonderia San Fermo",
    commesse: ["--"],
  },
  {
    name: "Tapparo",
    commesse: ["--"],
  },
  {
    name: "Fusion Press pressofusione",
    commesse: ["--"],
  },
  {
    name: "G & G Compositi",
    commesse: ["--"],
  },
  {
    name: "Galperti",
    commesse: ["--"],
  },
  {
    name: "Garmetal",
    commesse: ["--"],
  },
  {
    name: "GBC",
    commesse: ["--"],
  },
  {
    name: "Genta",
    commesse: ["--"],
  }, 
  {
    name: "Getragh Bari",
    commesse: ["--"],
  },
  {
    name: "Gheos",
    commesse: ["--"],
  },
  {
    name: "Ghioni & Valaperta",
    commesse: ["--"],
  },
  {
    name: "Giussani Stampi (Sigillatura)",
    commesse: ["--"],
  },
  {
    name: "Global Casting",
    commesse: ["--"],
  },
  {
    name: "Goffi Robotica",
    commesse: ["--"],
  },
  {
    name: "GPM",
    commesse: ["--"],
  },
  {
    name: "HardItalia",
    commesse: ["--"],
  },
  {
    name: "Hubo",
    commesse: ["--"],
  },
  {
    name: "Idane forni monete",
    commesse: ["--"],
  },
  {
    name: "Ielpo",
    commesse: ["--"],
  },
  {
    name: "ILC",
    commesse: ["--"],
  },
  {
    name: "ILMA",
    commesse: ["--"],
  },
  {
    name: "ILME",
    commesse: ["--"],
  },
  {
    name: "IMA",
    commesse: ["--"],
  },
  {
    name: "In alfa",
    commesse: ["--"],
  },
  {
    name: "Inge",
    commesse: ["--"],
  },
  {
    name: "Inoxprodotti",
    commesse: ["--"],
  },
  {
    name: "Intec Robotics",
    commesse: ["--"],
  },
  {
    name: "ISA",
    commesse: ["--"],
  },
  {
    name: "Isma Controlli",
    commesse: ["--"],
  },
  {
    name: "ISS ex-politecnico",
    commesse: ["--"],
  },
  {
    name: "IVA Pallet secchi",
    commesse: ["--"],
  },
  {
    name: "JC",
    commesse: ["--"],
  },
  {
    name: "Klain Utensili ROM",
    commesse: ["--"],
  },
  {
    name: "Kone",
    commesse: ["--"],
  },
  {
    name: "I.P. Italiana",
    commesse: ["--"],
  },
  {
    name: "Laboratorio Elettrofisico",
    commesse: ["--"],
  },
  {
    name: "Limonta Parati",
    commesse: ["--"],
  },
  {
    name: "LMP saronno",
    commesse: ["--"],
  },
  {
    name: "M.M.T",
    commesse: ["--"],
  },
  {
    name: "Magistris & Wetzel",
    commesse: ["--"],
  },
  {
    name: "Mahjoubi srl",
    commesse: ["--"],
  },
  {
    name: "MAI - piegatura Lamiera",
    commesse: ["--"],
  },
  {
    name: "Malgorani Rubinetterie",
    commesse: ["--"],
  },
  {
    name: "Manipolazione Pannelli Xtratherm",
    commesse: ["--"],
  },
  {
    name: "Mappy",
    commesse: ["--"],
  },
  {
    name: "Mares",
    commesse: ["--"],
  },
  {
    name: "Maroni torneria",
    commesse: ["--"],
  },
  {
    name: "Mazzucchelli",
    commesse: ["--"],
  },
  {
    name: "MCE meccanica Verona",
    commesse: ["--"],
  },
  {
    name: "Melesi",
    commesse: ["--"],
  },
  {
    name: "Me - Sar",
    commesse: ["--"],
  },
  {
    name: "Metalcorp",
    commesse: ["--"],
  },
  {
    name: "Metalfonder",
    commesse: ["--"],
  },
  {
    name: "Metalgroup - Vignati",
    commesse: ["--"],
  },
  {
    name: "MetalPress",
    commesse: ["--"],
  },
  {
    name: "Milani Enrico",
    commesse: ["--"],
  },
  {
    name: "Mime",
    commesse: ["--"],
  },
  {
    name: "Mondialpol - Asti",
    commesse: ["--"],
  },
  {
    name: "Mondialpol - Como",
    commesse: ["--"],
  },
  {
    name: "Munters",
    commesse: ["--"],
  },
  {
    name: "NCN pressofusione",
    commesse: ["--"],
  },
  {
    name: "NewMec",
    commesse: ["--"],
  },
  {
    name: "Norblast-Avio",
    commesse: ["--"],
  },
  {
    name: "Normalien",
    commesse: ["--"],
  },
  {
    name: "Nuo",
    commesse: ["--"],
  },
  {
    name: "Nuova Termostampi",
    commesse: ["--"],
  },
  {
    name: "OET",
    commesse: ["--"],
  },
  {
    name: "Officine Ambrogio Melesi",
    commesse: ["--"],
  },
  {
    name: "Officine Celsi",
    commesse: ["--"],
  },
  {
    name: "Officine Ponte Nossa MGM",
    commesse: ["--"],
  },
  {
    name: "Olmatic",
    commesse: ["--"],
  },
  {
    name: "OMAT",
    commesse: ["--"],
  },
  {
    name: "OMC",
    commesse: ["--"],
  },
  {
    name: "OMNIA Plastica",
    commesse: ["--"],
  },
  {
    name: "OMS - Metalgroup",
    commesse: ["--"],
  },
  {
    name: "OMS presse MpFiltri",
    commesse: ["--"],
  },
  {
    name: "OMS presse (fassi)",
    commesse: ["--"],
  },
  {
    name: "OMS Asservimento Fresatrice",
    commesse: ["--"],
  },
  {
    name: "Catra 2 P&C Automotive",
    commesse: ["--"],
  },
  {
    name: "P.A System",
    commesse: ["--"],
  },
  {
    name: "PangBorn Sabbiatrici",
    commesse: ["--"],
  },
  {
    name: "Parametri Track",
    commesse: ["--"],
  },
  {
    name: "Patrini",
    commesse: ["--"],
  },
  {
    name: "PetrolCoatings",
    commesse: ["--"],
  },
  {
    name: "Piazza",
    commesse: ["--"],
  },
  {
    name: "Pielle Pressofusione",
    commesse: ["--"],
  },
  {
    name: "Plastal",
    commesse: ["--"],
  },
  {
    name: "Praxair",
    commesse: ["--"],
  },
  {
    name: "Pressbolt",
    commesse: ["--"],
  },
  {
    name: "Priolinox",
    commesse: ["--"],
  },
  {
    name: "PZ-Fonderia",
    commesse: ["--"],
  },
  {
    name: "RAEL Motori",
    commesse: ["--"],
  },
  {
    name: "Rain",
    commesse: ["--"],
  },
  {
    name: "RE-LUIGI",
    commesse: ["--"],
  },
  {
    name: "Resen Galperti",
    commesse: ["--"],
  },
  {
    name: "RGS Odolo",
    commesse: ["--"],
  },
  {
    name: "Rieter",
    commesse: ["--"],
  },
  {
    name: "RM Manfredi Antincendio",
    commesse: ["--"],
  },
  {
    name: "Sacma Biella",
    commesse: ["--"],
  },
  {
    name: "Salumificio Vismara",
    commesse: ["--"],
  },
  {
    name: "Sanac Gattinara",
    commesse: ["--"],
  },
  {
    name: "Sicav",
    commesse: ["--"],
  },
  {
    name: "Sirai",
    commesse: ["--"],
  },
  {
    name: "Sircatene",
    commesse: ["--"],
  },
  {
    name: "SIRP - Cuneo",
    commesse: ["--"],
  },
  {
    name: "Sixteam Pontevico",
    commesse: ["--"],
  },
  {
    name: "SMB Medical",
    commesse: ["--"],
  },
  {
    name: "SME",
    commesse: ["--"],
  },
  {
    name: "Somai",
    commesse: ["--"],
  },
  {
    name: "Soro",
    commesse: ["--"],
  },
  {
    name: "Sottani e Milanesi",
    commesse: ["--"],
  },
  {
    name: "Stamet",
    commesse: ["--"],
  },
  {
    name: "SteelForm",
    commesse: ["--"],
  },
  {
    name: "SteelTecnica Salda Laser",
    commesse: ["--"],
  },
  {
    name: "Stocklin",
    commesse: ["--"],
  },
  {
    name: "Stuani",
    commesse: ["--"],
  },
  {
    name: "SuceTool",
    commesse: ["--"],
  },
  {
    name: "Target",
    commesse: ["--"],
  },
  {
    name: "TCS",
    commesse: ["--"],
  },
  {
    name: "Tecno Delta",
    commesse: ["--"],
  },
  {
    name: "TecnoGamma Afros",
    commesse: ["--"],
  },
  {
    name: "TecnoVielle (Goffi)",
    commesse: ["--"],
  },
  {
    name: "Tender piegatura Lamiera",
    commesse: ["--"],
  },
  {
    name: "Termoplastica Tecno",
    commesse: ["--"],
  },
  {
    name: "Termosthal",
    commesse: ["--"],
  },
  {
    name: "Terry",
    commesse: ["--"],
  },
  {
    name: "Torneria DoppiaGi",
    commesse: ["--"],
  },
  {
    name: "UGP",
    commesse: ["--"],
  },
  {
    name: "V2 Components",
    commesse: ["--"],
  },
  {
    name: "Valsecchi",
    commesse: ["--"],
  },
  {
    name: "Vecchi prg Paolo",
    commesse: ["--"],
  },
  {
    name: "Vigano",
    commesse: ["--"],
  },
  {
    name: "Watts",
    commesse: ["--"],
  },
  {
    name: "Welding",
    commesse: ["--"],
  },
  {
    name: "Whirpool",
    commesse: ["--"],
  },
  {
    name: "Zullino Rocco Pulitura",
    commesse: ["--"],
  },

];

export default clienti;
