/* ============================================================
   Web Builders — Business Category Taxonomy & Matcher
   ============================================================
   Exposes window.MWS_BUSINESS_CATEGORIES:
     - sectors: [{ name, styleDefault, paletteDefault, categories:[{name, keywords[]}] }]
     - flat: flattened list of { name, sector, keywords }
     - match(query): returns best-match result for free-typed text
       { category, sector, score, confident }
   No external dependencies, no network calls — everything runs
   client-side so it works instantly and privately in the browser.
   ============================================================ */

(function (global) {

  // Each sector carries a design default (style + palette) pulled from
  // the Web Builders design system, so a client's business
  // category can suggest a sensible starting theme when they haven't
  // picked their own style/palette.
  var SECTORS = [
    {
      name: "Food & Drink",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Full-Service Restaurant", keywords: ["restaurant", "dining", "eatery", "bistro", "diner"] },
        { name: "Quick-Service / Fast Casual", keywords: ["fast food", "quick service", "takeout", "drive thru", "counter service"] },
        { name: "Cafe / Coffee Shop", keywords: ["cafe", "coffee", "espresso", "coffeehouse", "roastery"] },
        { name: "Bakery / Patisserie", keywords: ["bakery", "baker", "pastry", "patisserie", "cupcake"] },
        { name: "Bar / Pub / Brewery", keywords: ["bar", "pub", "tavern", "brewery", "taproom", "beer"] },
        { name: "Winery / Vineyard", keywords: ["winery", "vineyard", "wine"] },
        { name: "Food Truck / Mobile Vendor", keywords: ["food truck", "taco truck", "mobile vendor", "cart"] },
        { name: "Caterer", keywords: ["catering", "caterer", "events food"] },
        { name: "Butcher / Meat Market", keywords: ["butcher", "meat market", "meats"] },
        { name: "Specialty Food / Candy Shop", keywords: ["candy", "chocolate", "sweets", "confectionery", "cottage food", "freeze dried candy"] },
        { name: "Ice Cream / Dessert Shop", keywords: ["ice cream", "gelato", "frozen yogurt", "dessert", "donuts", "doughnut"] },
        { name: "Pizzeria", keywords: ["pizza", "pizzeria"] },
        { name: "Juice Bar / Smoothie Shop", keywords: ["juice bar", "smoothie", "juice"] },
        { name: "Personal Chef", keywords: ["personal chef", "private chef", "meal prep"] }
      ]
    },
    {
      name: "Retail & Shopping",
      styleDefault: "Clean & Modern",
      paletteDefault: "Clean & Modern",
      categories: [
        { name: "Clothing / Apparel Boutique", keywords: ["clothing", "apparel", "boutique", "fashion store"] },
        { name: "Shoe Store", keywords: ["shoe store", "footwear", "shoes"] },
        { name: "Jewelry Store", keywords: ["jewelry", "jeweler", "jewellery"] },
        { name: "Gift Shop", keywords: ["gift shop", "gifts", "novelty store"] },
        { name: "Bookstore", keywords: ["bookstore", "books", "bookshop"] },
        { name: "Furniture Store", keywords: ["furniture", "furniture store"] },
        { name: "Home Decor / Housewares", keywords: ["home decor", "housewares", "home goods"] },
        { name: "Florist", keywords: ["florist", "flower shop", "flowers"] },
        { name: "Hardware Store", keywords: ["hardware store", "hardware"] },
        { name: "Garden Center / Nursery", keywords: ["garden center", "plant nursery", "nursery", "greenhouse"] },
        { name: "Toy Store", keywords: ["toy store", "toys"] },
        { name: "Sporting Goods Store", keywords: ["sporting goods", "sports store"] },
        { name: "Thrift / Consignment Shop", keywords: ["thrift store", "consignment", "secondhand"] },
        { name: "Electronics Store", keywords: ["electronics store", "electronics"] },
        { name: "Convenience Store / Market", keywords: ["convenience store", "corner store", "market", "grocery"] },
        { name: "Liquor Store", keywords: ["liquor store", "wine shop", "spirits"] },
        { name: "Art & Craft Supply Store", keywords: ["craft store", "art supply", "hobby shop"] },
        { name: "Antique Store", keywords: ["antique store", "antiques", "vintage shop"] },
        { name: "Pet Supply Store", keywords: ["pet store", "pet supply"] },
        { name: "Vape / Smoke Shop", keywords: ["vape shop", "smoke shop", "tobacco"] }
      ]
    },
    {
      name: "Health & Wellness",
      styleDefault: "Clean & Modern",
      paletteDefault: "Clean & Modern",
      categories: [
        { name: "Chiropractor", keywords: ["chiropractor", "chiropractic"] },
        { name: "Dentist / Orthodontist", keywords: ["dentist", "dental", "orthodontist", "braces"] },
        { name: "Optometrist", keywords: ["optometrist", "eye doctor", "optical"] },
        { name: "Physical Therapist", keywords: ["physical therapy", "physical therapist", "pt clinic"] },
        { name: "Massage Therapist", keywords: ["massage therapist", "massage"] },
        { name: "Acupuncturist", keywords: ["acupuncture", "acupuncturist"] },
        { name: "Naturopath / Holistic Health", keywords: ["naturopath", "holistic health", "wellness practitioner", "healer", "energy work"] },
        { name: "Mental Health Counselor / Therapist", keywords: ["therapist", "counselor", "counseling", "psychotherapy"] },
        { name: "Nutritionist / Dietitian", keywords: ["nutritionist", "dietitian", "nutrition coach"] },
        { name: "Medical Clinic / Urgent Care", keywords: ["medical clinic", "urgent care", "doctor's office", "physician"] },
        { name: "Home Health Care Agency", keywords: ["home health care", "caregiver agency", "in-home care"] },
        { name: "Midwife / Doula", keywords: ["midwife", "doula", "birth services"] }
      ]
    },
    {
      name: "Beauty & Personal Care",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Hair Salon / Barbershop", keywords: ["hair salon", "barbershop", "barber", "hairstylist", "salon"] },
        { name: "Nail Salon", keywords: ["nail salon", "manicure", "pedicure", "nails"] },
        { name: "Spa / Day Spa", keywords: ["spa", "day spa"] },
        { name: "Esthetician / Skincare Studio", keywords: ["esthetician", "skincare", "facials"] },
        { name: "Tattoo / Piercing Studio", keywords: ["tattoo", "piercing", "tattoo shop", "ink"] },
        { name: "Makeup Artist", keywords: ["makeup artist", "mua"] },
        { name: "Tanning Salon", keywords: ["tanning salon", "tanning"] },
        { name: "Waxing / Lash Studio", keywords: ["waxing", "lash studio", "eyelash extensions", "brow bar"] }
      ]
    },
    {
      name: "Home & Trade Services",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "General Contractor", keywords: ["general contractor", "contractor", "construction company"] },
        { name: "Electrician", keywords: ["electrician", "electrical contractor"] },
        { name: "Plumber", keywords: ["plumber", "plumbing"] },
        { name: "HVAC Technician", keywords: ["hvac", "heating and cooling", "air conditioning", "furnace repair"] },
        { name: "Roofer", keywords: ["roofer", "roofing", "roofing contractor"] },
        { name: "Painter", keywords: ["painter", "painting contractor", "house painter"] },
        { name: "Landscaper / Lawn Care", keywords: ["landscaper", "lawn care", "landscaping", "lawn mowing", "yard work"] },
        { name: "Cleaning Service", keywords: ["cleaning service", "house cleaning", "maid service", "janitorial"] },
        { name: "Pest Control", keywords: ["pest control", "exterminator"] },
        { name: "Handyman", keywords: ["handyman", "handywoman", "home repair"] },
        { name: "Carpenter / Woodworker", keywords: ["carpenter", "woodworker", "custom woodworking", "cabinetmaker", "woodshop"] },
        { name: "Flooring Installer", keywords: ["flooring", "floor installer", "carpet installer"] },
        { name: "Window & Door Installer", keywords: ["window installer", "door installer", "windows and doors"] },
        { name: "Pool Service", keywords: ["pool service", "pool cleaning", "pool contractor"] },
        { name: "Fencing Contractor", keywords: ["fencing contractor", "fence company", "fence installer"] },
        { name: "Solar Installer", keywords: ["solar installer", "solar panels", "solar company"] },
        { name: "Locksmith", keywords: ["locksmith"] },
        { name: "Moving Company", keywords: ["moving company", "movers", "relocation"] },
        { name: "Junk Removal", keywords: ["junk removal", "hauling", "dumpster rental"] },
        { name: "Home Inspector", keywords: ["home inspector", "home inspection"] },
        { name: "Interior Designer", keywords: ["interior designer", "interior design"] }
      ]
    },
    {
      name: "Automotive",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "Auto Repair Shop", keywords: ["auto repair", "mechanic", "car repair shop"] },
        { name: "Auto Body / Collision Shop", keywords: ["auto body shop", "collision repair", "body shop"] },
        { name: "Car Dealership", keywords: ["car dealership", "used car lot", "auto dealer"] },
        { name: "Tire Shop", keywords: ["tire shop", "tires"] },
        { name: "Auto Detailing", keywords: ["auto detailing", "car detailing", "car wash"] },
        { name: "Towing Service", keywords: ["towing", "tow truck"] },
        { name: "Motorcycle Shop", keywords: ["motorcycle shop", "motorcycle repair"] },
        { name: "RV / Boat Dealer & Service", keywords: ["rv dealer", "boat dealer", "rv repair", "marine service"] }
      ]
    },
    {
      name: "Professional Services",
      styleDefault: "Clean & Modern",
      paletteDefault: "Clean & Modern",
      categories: [
        { name: "Accountant / Bookkeeper", keywords: ["accountant", "bookkeeper", "cpa", "accounting firm"] },
        { name: "Financial Advisor", keywords: ["financial advisor", "financial planner", "wealth management"] },
        { name: "Insurance Agency", keywords: ["insurance agency", "insurance agent"] },
        { name: "Real Estate Agent / Brokerage", keywords: ["real estate agent", "realtor", "real estate brokerage"] },
        { name: "Property Management", keywords: ["property management", "property manager"] },
        { name: "Marketing / Advertising Agency", keywords: ["marketing agency", "advertising agency", "digital marketing"] },
        { name: "Graphic Design Studio", keywords: ["graphic design", "design studio", "branding studio"] },
        { name: "Web Design / IT Services", keywords: ["web design", "website builder", "it services", "web developer"] },
        { name: "Business / Management Consultant", keywords: ["business consultant", "management consultant", "consulting firm"] },
        { name: "Notary / Title Services", keywords: ["notary", "title company", "title services"] },
        { name: "Translation Services", keywords: ["translation services", "interpreter"] },
        { name: "Staffing / Recruiting Agency", keywords: ["staffing agency", "recruiting agency", "employment agency"] }
      ]
    },
    {
      name: "Legal Services",
      styleDefault: "Classic & Elegant",
      paletteDefault: "Classic & Elegant",
      categories: [
        { name: "General Law Practice", keywords: ["law firm", "attorney", "lawyer", "legal services"] },
        { name: "Family Law Attorney", keywords: ["family law", "divorce attorney", "custody lawyer"] },
        { name: "Personal Injury Attorney", keywords: ["personal injury attorney", "injury lawyer"] },
        { name: "Criminal Defense Attorney", keywords: ["criminal defense", "defense attorney"] },
        { name: "Estate Planning Attorney", keywords: ["estate planning", "wills and trusts", "probate attorney"] },
        { name: "Business / Corporate Attorney", keywords: ["business attorney", "corporate lawyer"] },
        { name: "Immigration Attorney", keywords: ["immigration attorney", "immigration lawyer"] }
      ]
    },
    {
      name: "Education & Childcare",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Tutoring Service", keywords: ["tutoring", "tutor", "learning center"] },
        { name: "Daycare / Preschool", keywords: ["daycare", "preschool", "child care center"] },
        { name: "Music Lessons / Studio", keywords: ["music lessons", "music school", "piano teacher", "guitar lessons"] },
        { name: "Driving School", keywords: ["driving school", "driving instructor"] },
        { name: "Language School", keywords: ["language school", "language lessons", "esl"] },
        { name: "Test Prep / Academic Coaching", keywords: ["test prep", "sat prep", "academic coaching"] },
        { name: "Vocational / Trade School", keywords: ["trade school", "vocational school"] }
      ]
    },
    {
      name: "Fitness & Recreation",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "Gym / Fitness Studio", keywords: ["gym", "fitness studio", "fitness center"] },
        { name: "Yoga Studio", keywords: ["yoga studio", "yoga"] },
        { name: "Personal Trainer", keywords: ["personal trainer", "personal training"] },
        { name: "CrossFit Box", keywords: ["crossfit", "crossfit gym", "box"] },
        { name: "Martial Arts Academy", keywords: ["martial arts", "karate", "jiu jitsu", "taekwondo", "dojo"] },
        { name: "Dance Studio", keywords: ["dance studio", "dance school", "ballet studio"] },
        { name: "Climbing Gym", keywords: ["climbing gym", "bouldering"] },
        { name: "Golf Course / Driving Range", keywords: ["golf course", "driving range", "golf club"] },
        { name: "Bowling Alley", keywords: ["bowling alley", "bowling"] },
        { name: "Sports Coaching / Camps", keywords: ["sports coaching", "sports camp", "youth sports"] }
      ]
    },
    {
      name: "Pet Services",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Veterinary Clinic", keywords: ["veterinarian", "vet clinic", "animal hospital"] },
        { name: "Pet Groomer", keywords: ["pet groomer", "dog grooming", "pet grooming"] },
        { name: "Dog Trainer", keywords: ["dog trainer", "dog training"] },
        { name: "Pet Boarding / Daycare", keywords: ["pet boarding", "dog daycare", "kennel"] },
        { name: "Pet Sitting / Dog Walking", keywords: ["pet sitting", "dog walking", "pet sitter"] },
        { name: "Pet Breeder", keywords: ["pet breeder", "dog breeder", "cat breeder", "reptile breeder", "exotic pet breeder", "reptile shop", "breeder", "breeding"] }
      ]
    },
    {
      name: "Events & Entertainment",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "Event Planner", keywords: ["event planner", "event planning", "wedding planner"] },
        { name: "Wedding Venue", keywords: ["wedding venue", "event venue", "banquet hall"] },
        { name: "DJ / Live Music", keywords: ["dj", "wedding dj", "live music booking"] },
        { name: "Photographer", keywords: ["photographer", "photography studio", "wedding photographer"] },
        { name: "Videographer", keywords: ["videographer", "video production"] },
        { name: "Party Rental Company", keywords: ["party rental", "tent rental", "event rental"] },
        { name: "Bounce House / Kids Entertainment", keywords: ["bounce house", "kids entertainment", "party rental for kids"] },
        { name: "Band / Performer", keywords: ["band", "performer", "musician for hire"] }
      ]
    },
    {
      name: "Arts, Crafts & Creative",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Artist / Gallery", keywords: ["artist", "art gallery", "fine art"] },
        { name: "Photography Studio", keywords: ["photography studio", "portrait studio"] },
        { name: "Custom Woodworking", keywords: ["custom woodworking", "furniture maker", "cutting boards", "rustic crafts"] },
        { name: "Pottery / Ceramics Studio", keywords: ["pottery studio", "ceramics", "pottery"] },
        { name: "Custom Apparel / Screen Printing", keywords: ["screen printing", "custom apparel", "embroidery shop"] },
        { name: "Sign Maker", keywords: ["sign maker", "sign shop", "signage"] },
        { name: "Framing Shop", keywords: ["framing shop", "custom framing"] },
        { name: "Candle Maker / Home Fragrance", keywords: ["candle maker", "candles", "home fragrance", "wax melts"] },
        { name: "Soap & Bath Product Maker", keywords: ["soap maker", "bath products", "handmade soap", "bath bombs"] },
        { name: "Handmade Jewelry Maker", keywords: ["handmade jewelry", "jewelry maker", "jewelry designer"] },
        { name: "Leatherworker / Leather Goods", keywords: ["leatherworker", "leather goods", "leather crafts"] },
        { name: "Knitting / Fiber Arts Studio", keywords: ["fiber arts", "knitting studio", "yarn shop", "weaving"] }
      ]
    },
    {
      name: "Agriculture & Outdoor",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Fresh & Friendly",
      categories: [
        { name: "Farm / Farm Stand", keywords: ["farm", "farm stand", "family farm"] },
        { name: "CSA / Produce Delivery", keywords: ["csa", "produce delivery", "farm box"] },
        { name: "Orchard / U-Pick", keywords: ["orchard", "u-pick", "apple orchard", "pumpkin patch"] },
        { name: "Apiary / Honey Producer", keywords: ["apiary", "honey producer", "beekeeper"] },
        { name: "Mushroom Cultivator", keywords: ["mushroom cultivator", "mushroom farm", "gourmet mushrooms", "reishi", "lion's mane"] },
        { name: "Nursery / Greenhouse", keywords: ["plant nursery", "greenhouse grower"] },
        { name: "Outfitter / Guide Service", keywords: ["outfitter", "hunting guide", "fishing guide", "tour guide service"] }
      ]
    },
    {
      name: "Hospitality & Lodging",
      styleDefault: "Classic & Elegant",
      paletteDefault: "Classic & Elegant",
      categories: [
        { name: "Hotel / Motel", keywords: ["hotel", "motel", "inn"] },
        { name: "Bed & Breakfast", keywords: ["bed and breakfast", "b&b"] },
        { name: "Vacation Rental", keywords: ["vacation rental", "short term rental", "cabin rental"] },
        { name: "Campground / RV Park", keywords: ["campground", "rv park", "camping"] },
        { name: "Event Space Rental", keywords: ["event space rental", "venue rental"] }
      ]
    },
    {
      name: "Nonprofit, Community & Faith",
      styleDefault: "Classic & Elegant",
      paletteDefault: "Warm & Trustworthy",
      categories: [
        { name: "Nonprofit Organization", keywords: ["nonprofit", "non-profit organization", "charity"] },
        { name: "Church / Religious Organization", keywords: ["church", "religious organization", "ministry", "congregation"] },
        { name: "Community Center", keywords: ["community center", "community organization"] },
        { name: "Charity / Foundation", keywords: ["charity", "foundation", "fundraising organization"] }
      ]
    },
    {
      name: "Transportation & Logistics",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "Trucking / Freight", keywords: ["trucking company", "freight hauling", "logistics company"] },
        { name: "Courier / Delivery Service", keywords: ["courier service", "delivery service", "same-day delivery"] },
        { name: "Limo / Rideshare Service", keywords: ["limo service", "car service", "chauffeur"] },
        { name: "Storage Facility / Self-Storage", keywords: ["self storage", "storage facility", "storage units"] }
      ]
    },
    {
      name: "Manufacturing & Wholesale",
      styleDefault: "Bold & Structured",
      paletteDefault: "Bold & Energetic",
      categories: [
        { name: "Manufacturer", keywords: ["manufacturer", "manufacturing company"] },
        { name: "Wholesaler / Distributor", keywords: ["wholesaler", "distributor", "wholesale supplier"] },
        { name: "Machine Shop", keywords: ["machine shop", "cnc shop", "fabrication shop"] }
      ]
    },
    {
      name: "Technology & Digital",
      styleDefault: "Clean & Modern",
      paletteDefault: "Clean & Modern",
      categories: [
        { name: "Software / App Company", keywords: ["software company", "app developer", "saas"] },
        { name: "IT Support / Managed Services", keywords: ["it support", "managed it services", "tech support company"] },
        { name: "Cybersecurity Firm", keywords: ["cybersecurity firm", "security consulting"] },
        { name: "E-commerce Brand", keywords: ["ecommerce brand", "online store", "e-commerce shop"] }
      ]
    },
    {
      name: "Specialty & Cottage Food",
      styleDefault: "Friendly & Warm",
      paletteDefault: "Warm & Trustworthy",
      categories: [
        { name: "Cottage Food / Home Bakery", keywords: ["cottage food", "home bakery", "cottage bakery"] },
        { name: "Candy Maker", keywords: ["candy maker", "freeze dried candy", "confectioner"] },
        { name: "Meal Prep / Personal Chef Service", keywords: ["meal prep service", "personal chef service"] },
        { name: "Spice / Sauce Maker", keywords: ["spice maker", "hot sauce company", "sauce maker"] }
      ]
    },
    {
      name: "Other / Not Listed",
      styleDefault: "Clean & Modern",
      paletteDefault: "Clean & Modern",
      categories: [
        { name: "Other (describe below)", keywords: ["other", "something else", "not listed"] }
      ]
    }
  ];

  // ---------- Flatten for fast searching ----------

  var FLAT = [];
  SECTORS.forEach(function (sector) {
    sector.categories.forEach(function (cat) {
      FLAT.push({
        name: cat.name,
        sector: sector.name,
        styleDefault: sector.styleDefault,
        paletteDefault: sector.paletteDefault,
        keywords: cat.keywords || []
      });
    });
  });

  // ---------- Matching helpers ----------

  function normalize(str) {
    return String(str || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Dice coefficient over character bigrams — tolerant of typos,
  // plurals, and minor word-order differences without needing a
  // real NLP model.
  function bigrams(str) {
    var s = "  " + str + " ";
    var set = {};
    for (var i = 0; i < s.length - 1; i++) {
      var bg = s.substring(i, i + 2);
      set[bg] = (set[bg] || 0) + 1;
    }
    return set;
  }

  function diceCoefficient(a, b) {
    if (!a.length || !b.length) return 0;
    var bgA = bigrams(a);
    var bgB = bigrams(b);
    var overlap = 0;
    var totalA = 0, totalB = 0;
    var k;
    for (k in bgA) { totalA += bgA[k]; }
    for (k in bgB) { totalB += bgB[k]; }
    for (k in bgA) {
      if (bgB[k]) overlap += Math.min(bgA[k], bgB[k]);
    }
    return (2 * overlap) / (totalA + totalB);
  }

  function scoreEntry(query, entry) {
    var q = normalize(query);
    var nameNorm = normalize(entry.name);
    var best = 0;

    // Exact / substring match on the category name is the strongest signal.
    if (nameNorm === q) return 1;
    if (nameNorm.indexOf(q) !== -1 || q.indexOf(nameNorm) !== -1) {
      best = Math.max(best, 0.9);
    }

    // Keyword substring matches (typed text contains a keyword, or vice versa).
    entry.keywords.forEach(function (kw) {
      var kwNorm = normalize(kw);
      if (!kwNorm) return;
      if (q.indexOf(kwNorm) !== -1 || kwNorm.indexOf(q) !== -1) {
        best = Math.max(best, 0.85);
      }
      best = Math.max(best, diceCoefficient(q, kwNorm) * 0.8);
    });

    // Fuzzy similarity against the category name and sector name, for
    // typos or phrasing that doesn't share an exact keyword.
    best = Math.max(best, diceCoefficient(q, nameNorm) * 0.7);
    best = Math.max(best, diceCoefficient(q, normalize(entry.sector)) * 0.45);

    return best;
  }

  /**
   * Match free-typed text to the closest business category.
   * Returns { category, sector, score, confident, alternates: [...] }
   * confident === true when the match is strong enough to auto-fill
   * without the visitor confirming; otherwise the caller should show
   * it as a suggestion rather than a silent pick.
   */
  function match(query) {
    var q = normalize(query);
    if (!q) return null;

    var scored = FLAT.map(function (entry) {
      return { entry: entry, score: scoreEntry(query, entry) };
    }).sort(function (a, b) { return b.score - a.score; });

    var top = scored[0];
    if (!top || top.score <= 0.2) return null;

    return {
      category: top.entry.name,
      sector: top.entry.sector,
      styleDefault: top.entry.styleDefault,
      paletteDefault: top.entry.paletteDefault,
      score: top.score,
      confident: top.score >= 0.55,
      alternates: scored.slice(1, 4).map(function (s) { return s.entry.name; })
    };
  }

  /**
   * Filter the full list for the live dropdown as the visitor types.
   * Returns categories grouped by sector, ranked within each sector,
   * limited to a reasonable number of results.
   */
  function filter(query, limit) {
    limit = limit || 40;
    var q = normalize(query);
    if (!q) {
      return SECTORS.map(function (sector) {
        return { sector: sector.name, categories: sector.categories.map(function (c) { return c.name; }) };
      });
    }

    var scored = FLAT.map(function (entry) {
      return { entry: entry, score: scoreEntry(query, entry) };
    }).filter(function (s) { return s.score > 0.25; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, limit);

    var bySector = {};
    var order = [];
    scored.forEach(function (s) {
      if (!bySector[s.entry.sector]) {
        bySector[s.entry.sector] = [];
        order.push(s.entry.sector);
      }
      bySector[s.entry.sector].push(s.entry.name);
    });

    return order.map(function (sectorName) {
      return { sector: sectorName, categories: bySector[sectorName] };
    });
  }

  global.MWS_BUSINESS_CATEGORIES = {
    sectors: SECTORS,
    flat: FLAT,
    match: match,
    filter: filter
  };

})(window);
