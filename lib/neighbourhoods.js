// Atlantic Canada area center coordinates
// Each entry: { name, lat, lng, city, province }
export const NEIGHBOURHOODS = [
  // ── New Brunswick ──────────────────────────────────────────
  // Fredericton
  { name: "Silverwood",               city: "Fredericton",           province: "NB", lat: 45.9402, lng: -66.6066 },
  { name: "Skyline Acres",            city: "Fredericton",           province: "NB", lat: 45.9524, lng: -66.5791 },
  { name: "Sunshine Gardens",         city: "Fredericton",           province: "NB", lat: 45.9505, lng: -66.5905 },
  { name: "Pepper Creek",             city: "Fredericton",           province: "NB", lat: 45.9440, lng: -66.6030 },
  { name: "Barkers Point",            city: "Fredericton",           province: "NB", lat: 45.9612, lng: -66.6838 },
  { name: "Devon",                    city: "Fredericton",           province: "NB", lat: 45.9734, lng: -66.6532 },
  { name: "Northside",                city: "Fredericton",           province: "NB", lat: 45.9788, lng: -66.6341 },
  { name: "Downtown",                 city: "Fredericton",           province: "NB", lat: 45.9636, lng: -66.6431 },
  { name: "Brookside",                city: "Fredericton",           province: "NB", lat: 45.9312, lng: -66.6244 },
  { name: "Lincoln",                  city: "Fredericton",           province: "NB", lat: 45.8933, lng: -66.5949 },
  // Moncton
  { name: "Downtown Moncton",         city: "Moncton",               province: "NB", lat: 46.0878, lng: -64.7782 },
  { name: "Dieppe",                   city: "Moncton",               province: "NB", lat: 46.0831, lng: -64.7187 },
  { name: "Riverview",                city: "Moncton",               province: "NB", lat: 46.0594, lng: -64.7897 },
  { name: "Magnetic Hill",            city: "Moncton",               province: "NB", lat: 46.1238, lng: -64.8553 },
  // Saint John
  { name: "Uptown Saint John",        city: "Saint John",            province: "NB", lat: 45.2733, lng: -66.0633 },
  { name: "East Saint John",          city: "Saint John",            province: "NB", lat: 45.2580, lng: -65.9996 },
  { name: "West Saint John",          city: "Saint John",            province: "NB", lat: 45.2660, lng: -66.0925 },
  { name: "South End (Saint John)",   city: "Saint John",            province: "NB", lat: 45.2612, lng: -66.0714 },
  // Other NB
  { name: "Miramichi",                city: "Miramichi",             province: "NB", lat: 47.0196, lng: -65.4969 },
  { name: "Bathurst",                 city: "Bathurst",              province: "NB", lat: 47.6197, lng: -65.6506 },
  { name: "Edmundston",               city: "Edmundston",            province: "NB", lat: 47.3769, lng: -68.3253 },
  { name: "Campbellton",              city: "Campbellton",           province: "NB", lat: 47.9948, lng: -66.6728 },
  { name: "Sussex",                   city: "Sussex",                province: "NB", lat: 45.7270, lng: -65.5113 },
  { name: "Woodstock",                city: "Woodstock",             province: "NB", lat: 46.1520, lng: -67.5706 },
  { name: "Sackville",                city: "Sackville",             province: "NB", lat: 45.8978, lng: -64.3728 },

  // ── Nova Scotia ────────────────────────────────────────────
  // Halifax Regional Municipality
  { name: "Downtown Halifax",         city: "Halifax",               province: "NS", lat: 44.6488, lng: -63.5752 },
  { name: "Dartmouth",                city: "Halifax",               province: "NS", lat: 44.6658, lng: -63.5669 },
  { name: "Bedford",                  city: "Halifax",               province: "NS", lat: 44.7327, lng: -63.6566 },
  { name: "Cole Harbour",             city: "Halifax",               province: "NS", lat: 44.6805, lng: -63.5097 },
  { name: "Sackville (NS)",           city: "Halifax",               province: "NS", lat: 44.7716, lng: -63.6930 },
  { name: "Spryfield",                city: "Halifax",               province: "NS", lat: 44.6062, lng: -63.6200 },
  { name: "Clayton Park",             city: "Halifax",               province: "NS", lat: 44.6800, lng: -63.6600 },
  // Cape Breton
  { name: "Sydney",                   city: "Cape Breton",           province: "NS", lat: 46.1368, lng: -60.1942 },
  { name: "Glace Bay",                city: "Cape Breton",           province: "NS", lat: 46.1985, lng: -59.9573 },
  { name: "New Waterford",            city: "Cape Breton",           province: "NS", lat: 46.2419, lng: -60.0711 },
  // Other NS
  { name: "Truro",                    city: "Truro",                 province: "NS", lat: 45.3647, lng: -63.2579 },
  { name: "New Glasgow",              city: "New Glasgow",           province: "NS", lat: 45.5924, lng: -62.6468 },
  { name: "Amherst",                  city: "Amherst",               province: "NS", lat: 45.8291, lng: -64.2107 },
  { name: "Yarmouth",                 city: "Yarmouth",              province: "NS", lat: 43.8367, lng: -66.1175 },
  { name: "Kentville",                city: "Kentville",             province: "NS", lat: 45.0773, lng: -64.4950 },
  { name: "Bridgewater",              city: "Bridgewater",           province: "NS", lat: 44.3767, lng: -64.5208 },
  { name: "Antigonish",               city: "Antigonish",            province: "NS", lat: 45.6239, lng: -61.9958 },
  { name: "Windsor (NS)",             city: "Windsor",               province: "NS", lat: 44.9966, lng: -64.1317 },

  // ── Prince Edward Island ───────────────────────────────────
  { name: "Downtown Charlottetown",   city: "Charlottetown",         province: "PE", lat: 46.2382, lng: -63.1311 },
  { name: "Stratford",                city: "Charlottetown",         province: "PE", lat: 46.2244, lng: -63.0877 },
  { name: "Sherwood",                 city: "Charlottetown",         province: "PE", lat: 46.2644, lng: -63.1272 },
  { name: "Summerside",               city: "Summerside",            province: "PE", lat: 46.3936, lng: -63.7898 },
  { name: "Cornwall (PEI)",           city: "Cornwall",              province: "PE", lat: 46.2211, lng: -63.2044 },
  { name: "Montague",                 city: "Montague",              province: "PE", lat: 46.1670, lng: -62.6478 },

  // ── Newfoundland & Labrador ────────────────────────────────
  // St. John's area
  { name: "Downtown St. John's",      city: "St. John's",            province: "NL", lat: 47.5615, lng: -52.7126 },
  { name: "Mount Pearl",              city: "St. John's",            province: "NL", lat: 47.5193, lng: -52.8058 },
  { name: "Conception Bay South",     city: "St. John's",            province: "NL", lat: 47.5127, lng: -52.9972 },
  { name: "Paradise",                 city: "St. John's",            province: "NL", lat: 47.5335, lng: -52.8780 },
  { name: "Torbay",                   city: "St. John's",            province: "NL", lat: 47.6629, lng: -52.7378 },
  // Other NL
  { name: "Gander",                   city: "Gander",                province: "NL", lat: 48.9569, lng: -54.6089 },
  { name: "Corner Brook",             city: "Corner Brook",          province: "NL", lat: 48.9500, lng: -57.9500 },
  { name: "Grand Falls-Windsor",      city: "Grand Falls-Windsor",   province: "NL", lat: 48.9311, lng: -55.6648 },
  { name: "Labrador City",            city: "Labrador City",         province: "NL", lat: 52.9428, lng: -66.9177 },
  { name: "Happy Valley-Goose Bay",   city: "Happy Valley-Goose Bay",province: "NL", lat: 53.3037, lng: -60.3311 },
];

// Lookup map: area name → { lat, lng }
export const NEIGHBOURHOOD_COORDS = Object.fromEntries(
  NEIGHBOURHOODS.map(({ name, lat, lng }) => [name, { lat, lng }])
);

// Province groupings for optgroup rendering in dropdowns
export const PROVINCE_GROUPS = [
  { label: "New Brunswick",              code: "NB" },
  { label: "Nova Scotia",                code: "NS" },
  { label: "Prince Edward Island",       code: "PE" },
  { label: "Newfoundland & Labrador",    code: "NL" },
];
