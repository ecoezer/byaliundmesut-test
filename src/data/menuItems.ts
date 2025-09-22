import { MenuItem, WunschPizzaIngredient, PizzaExtra, PastaType, SauceType } from '../types';

// Helper functions to check current day for special offers
const isRippchen = () => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return today === 3; // Wednesday
};

const isSchnitzelTag = () => {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return today === 4; // Thursday
};

// Pizza sizes configuration with new structure
const pizzaSizes = [
  { name: 'Medium', price: 8.90, description: 'Ø ca. 26 cm' },
  { name: 'Large', price: 9.90, description: 'Ø ca. 30 cm' },
  { name: 'Family', price: 17.90, description: 'Ø ca. 40 cm' },
  { name: 'Mega', price: 26.90, description: 'Ø ca. 50 cm' }
];

// Pasta types for pasta dishes
export const pastaTypes: PastaType[] = [
  { name: 'Spaghetti' },
  { name: 'Maccheroni' }
];

// Sauce types for Spezialitäten
export const sauceTypes: SauceType[] = [
  { name: 'Tzatziki' },
  { name: 'Chili-Sauce' },
  { name: 'Kräutersoße' },
  { name: 'Curry Sauce' },
  { name: 'Ketchup' },
  { name: 'Mayonnaise' },
  { name: 'ohne Soße' }
];

// Sauce types for Salads
export const saladSauceTypes: SauceType[] = [
  { name: 'Joghurt' },
  { name: 'French' },
  { name: 'Essig/Öl' }
];

// Beer types for beer selection
export const beerTypes: SauceType[] = [
  { name: 'Becks' },
  { name: 'Herrenhäuser' }
];

// Wunsch Pizza ingredients - Updated with new items and removed "Ei", Rindersalami now available
export const wunschPizzaIngredients: WunschPizzaIngredient[] = [
  { name: 'Ananas' },
  { name: 'Artischocken' },
  { name: 'Barbecuesauce' },
  { name: 'Brokkoli' },
  { name: 'Champignons frisch' },
  { name: 'Chili-Cheese-Soße' },
  { name: 'Edamer' },
  { name: 'Formfleisch-Vorderschinken' },
  { name: 'Gewürzgurken' },
  { name: 'Gorgonzola' },
  { name: 'Gyros' },
  { name: 'Hirtenkäse' },
  { name: 'Hähnchenbrust' },
  { name: 'Jalapeños' },
  { name: 'Knoblauchwurst' },
  { name: 'Mais' },
  { name: 'Milde Peperoni' },
  { name: 'Mozzarella' },
  { name: 'Oliven' },
  { name: 'Paprika' },
  { name: 'Parmaschinken' },
  { name: 'Peperoni, scharf' },
  { name: 'Remoulade' },
  { name: 'Rindermett' },
  { name: 'Rindersalami' },
  { name: 'Rucola' },
  { name: 'Röstzwiebeln' },
  { name: 'Sauce Hollandaise' },
  { name: 'Spiegelei' },
  { name: 'Spinat' },
  { name: 'Tomaten' },
  { name: 'Würstchen' },
  { name: 'Zwiebeln' },
  { name: 'ohne Zutat' }
];

// Pizza extras for all pizzas (each extra costs +€1.50) - Updated to match Wunsch Pizza ingredients
export const pizzaExtras: PizzaExtra[] = [
  { name: 'Ananas', price: 1.00 },
  { name: 'Artischocken', price: 1.00 },
  { name: 'Barbecuesauce', price: 1.00 },
  { name: 'Brokkoli', price: 1.00 },
  { name: 'Champignons frisch', price: 1.00 },
  { name: 'Chili-Cheese-Soße', price: 1.00 },
  { name: 'Edamer', price: 1.00 },
  { name: 'Formfleisch-Vorderschinken', price: 1.00 },
  { name: 'Gewürzgurken', price: 1.00 },
  { name: 'Gorgonzola', price: 1.00 },
  { name: 'Gyros', price: 1.00 },
  { name: 'Hirtenkäse', price: 1.00 },
  { name: 'Hähnchenbrust', price: 1.00 },
  { name: 'Jalapeños', price: 1.00 },
  { name: 'Knoblauchwurst', price: 1.00 },
  { name: 'Mais', price: 1.00 },
  { name: 'Milde Peperoni', price: 1.00 },
  { name: 'Mozzarella', price: 1.00 },
  { name: 'Oliven', price: 1.00 },
  { name: 'Paprika', price: 1.00 },
  { name: 'Parmaschinken', price: 1.00 },
  { name: 'Peperoni, scharf', price: 1.00 },
  { name: 'Remoulade', price: 1.00 },
  { name: 'Rindermett', price: 1.00 },
  { name: 'Rindersalami', price: 1.00 },
  { name: 'Rucola', price: 1.00 },
  { name: 'Röstzwiebeln', price: 1.00 },
  { name: 'Sauce Hollandaise', price: 1.00 },
  { name: 'Spiegelei', price: 1.00 },
  { name: 'Spinat', price: 1.00 },
  { name: 'Tomaten', price: 1.00 },
  { name: 'Würstchen', price: 1.00 },
  { name: 'Zwiebeln', price: 1.00 }
];

// Vegetarische Gerichte (Vegetarian dishes)
export const vegetarischeGerichte: MenuItem[] = [
  {
    id: 519,
    number: 19,
    name: "Zigaretten Börek",
    description: "knusprige Börek-Röllchen, gefüllt mit Käse",
    price: 1.00
  },
  {
    id: 520,
    number: 20,
    name: "Halloumi-Tasche",
    description: "im Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 521,
    number: 21,
    name: "Halloumi-Dürüm",
    description: "im dünnen Fladenbrot mit gegrilltem Halloumi, frischem Salat & Soße",
    price: 8.00,
    isSpezialitaet: true
  },
  {
    id: 522,
    number: 22,
    name: "Halloumi-Teller",
    description: "mit gegrilltem Halloumi, Bulgur oder Pommes, Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 523,
    number: 23,
    name: "Falafel-Tasche",
    description: "im Fladenbrot mit hausgemachten Falafel, gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 524,
    number: 24,
    name: "Falafel-Dürüm",
    description: "im dünnen Fladenbrot mit Falafel, gemischtem Salat & Soße",
    price: 8.00,
    isSpezialitaet: true
  },
  {
    id: 525,
    number: 25,
    name: "Falafel-Teller",
    description: "mit Bulgur oder Pommes frites, gemischtem Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  }
];

// Croques
export const croques: MenuItem[] = [
  {
    id: 548,
    number: 48,
    name: "Brokkoli Croque",
    description: "mit Broccoli, Zwiebeln, Paprika & Spinat",
    price: 8.00
  },
  {
    id: 549,
    number: 49,
    name: "Salami Croque",
    description: "mit Salami",
    price: 8.50
  },
  {
    id: 550,
    number: 50,
    name: "Schinken Croque",
    description: "mit Schinken",
    price: 8.50
  },
  {
    id: 551,
    number: 51,
    name: "Tonno Croque",
    description: "mit Thunfisch & Zwiebeln",
    price: 9.00
  },
  {
    id: 552,
    number: 52,
    name: "Hawaii Croque",
    description: "mit Schinken & Ananas",
    price: 9.00
  },
  {
    id: 553,
    number: 53,
    name: "Feta Croque",
    description: "mit Weichkäse",
    price: 8.50
  },
  {
    id: 554,
    number: 54,
    name: "Mozzarella Croque",
    description: "mit Mozzarella & frischen Tomaten",
    price: 8.50
  },
  {
    id: 555,
    number: 55,
    name: "Sucuk Croque",
    description: "mit Knoblauchwurst",
    price: 9.00
  },
  {
    id: 556,
    number: 56,
    name: "Pute Croque",
    description: "mit gegrilltem Putenfleisch, Zwiebeln & Mozzarella",
    price: 9.00
  },
  {
    id: 557,
    number: 57,
    name: "Funghi Croque",
    description: "mit Champignons, Schinken & Weichkäse",
    price: 9.00
  },
  {
    id: 558,
    number: 58,
    name: "Hamburger Croque",
    description: "mit Hamburger-Patty, Röstzwiebeln",
    price: 9.00
  },
  {
    id: 559,
    number: 59,
    name: "Nuggets Croque",
    description: "mit Chicken-Nuggets & Paprika",
    price: 9.00
  },
  {
    id: 560,
    number: 60,
    name: "Jalapenos Croque",
    description: "mit Schinken, Salami & Peperoni",
    price: 9.00
  },
  {
    id: 561,
    number: 61,
    name: "Drehspieß Croque",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen",
    price: 9.00
  }
];

// Helper function to create drink sizes for soft drinks
const createDrinkSizes = (smallPrice: number, largePrice: number = 3.60) => [
  { name: '0,33 L', price: smallPrice, description: 'Klein' },
  { name: '1,0 L', price: largePrice, description: 'Groß' }
];

// Helper function to create burger patty sizes
const createBurgerSizes = (basePrice: number) => [
  { name: '125g', price: basePrice, description: 'Standard Patty' },
  { name: '250g', price: basePrice + 2.00, description: 'Doppel Patty (+2€)' }
];

// Snacks (New section)
export const snacks: MenuItem[] = [
  {
    id: 580,
    number: 11,
    name: "Hamburger",
    description: "125g Burger-Patty",
    price: 5.50
  },
  {
    id: 581,
    number: 12,
    name: "Cheeseburger",
    description: "125g Burger-Patty mit Schmelzkäse",
    price: 6.00
  },
  {
    id: 582,
    number: 13,
    name: "Currywurst & Pommes",
    description: "mit würziger Currysauce und knusprigen Pommes frites",
    price: 8.50
  },
  {
    id: 583,
    number: 14,
    name: "Hamburger Menü",
    description: "125g Burger-Patty, Pommes frites und Getränk",
    price: 11.00
  },
  {
    id: 584,
    number: 15,
    name: "Cheeseburger Menü",
    description: "125g Burger-Patty mit Schmelzkäse, Pommes frites und Getränk",
    price: 11.50
  },
  {
    id: 585,
    number: 16,
    name: "Chicken-Nuggets Menü",
    description: "6 Stück mit Pommes frites & Getränk",
    price: 10.00
  },
  {
    id: 586,
    number: 17,
    name: "Pommes frites",
    description: "",
    price: 4.00
  },
  {
    id: 587,
    number: 18,
    name: "Chicken-Nuggets 6 Stück",
    description: "",
    price: 6.00
  }
];

// Salate (Updated with new items)
export const salads: MenuItem[] = [
  {
    id: 562,
    number: 62,
    name: "Bauernsalat",
    description: "mit Eisbergsalat, Gurken, Tomaten und Zwiebeln",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 563,
    number: 63,
    name: "Hirtensalat",
    description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Feta-Käse",
    price: 7.50,
    isSpezialitaet: true
  },
  {
    id: 564,
    number: 64,
    name: "Thunfischsalat",
    description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und Thunfisch",
    price: 8.50,
    isSpezialitaet: true
  },
  {
    id: 565,
    number: 65,
    name: "Hähnchenbrust-Salat",
    description: "mit Eisbergsalat, Gurken, Tomaten, Zwiebeln und gegrillter Hähnchenbrust",
    price: 9.00,
    isSpezialitaet: true
  },
  {
    id: 566,
    number: 66,
    name: "Mozzarella-Salat",
    description: "mit Eisbergsalat, Tomaten, frischem Mozzarella und Basilikum",
    price: 8.50,
    isSpezialitaet: true
  }
];

// Dips (Saucen) - Updated with new structure and pricing
export const dips: MenuItem[] = [
  {
    id: 567,
    number: "67",
    name: "Tzatziki",
    description: "",
    price: 2.00
  },
  {
    id: 568,
    number: "68",
    name: "Chili-Sauce",
    description: "",
    price: 2.00
  },
  {
    id: 569,
    number: "69",
    name: "Kräutersoße",
    description: "",
    price: 2.00
  },
  {
    id: 570,
    number: "70",
    name: "Curry Sauce",
    description: "",
    price: 2.00
  },
  {
    id: 571,
    number: "71",
    name: "Ketchup",
    description: "",
    price: 1.00
  },
  {
    id: 572,
    number: "72",
    name: "Mayonnaise",
    description: "",
    price: 1.00
  }
];

// Getränke (Drinks) - Updated with size options for soft drinks
export const drinks: MenuItem[] = [
  // Soft drinks - all 0,33 L
  {
    id: 100,
    number: "",
    name: "Coca-Cola",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 101,
    number: "",
    name: "Coca-Cola Zero",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 102,
    number: "",
    name: "Fanta Orange",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 103,
    number: "",
    name: "Fanta Exotic",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 104,
    number: "",
    name: "Sprite",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 105,
    number: "",
    name: "Mezzo-mix",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 106,
    number: "",
    name: "Apfelschorle",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 107,
    number: "",
    name: "Eistee Pfirsich",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 108,
    number: "",
    name: "Capri-Sonne",
    description: "0,20 L",
    price: 1.50
  },
  {
    id: 109,
    number: "",
    name: "Ayran",
    description: "0,25 L",
    price: 1.50
  },
  {
    id: 110,
    number: "",
    name: "Wasser",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 111,
    number: "",
    name: "Bier",
    description: "0,33 L",
    price: 2.00
  },
  {
    id: 112,
    number: "",
    name: "Alkoholfreies Bier",
    description: "0,33 L",
    price: 2.00
  }
];

// Hamburger (Burgers) - Completely updated with new items and patty size options
export const fleischgerichte: MenuItem[] = [
  {
    id: 529,
    number: 1,
    name: "Fleischgericht Tasche",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen im Fladenbrot, gemischtem Salat & Soße",
    price: 7.50,
    isSpezialitaet: true
  },
  {
    id: 530,
    number: 2,
    name: "Fleischgericht Dürüm",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, gemischtem Salat & Soße",
    price: 8.50,
    isSpezialitaet: true
  },
  {
    id: 531,
    number: 3,
    name: "Fleischgericht Box",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Pommes frites & Soße",
    price: 7.50,
    isSpezialitaet: true
  },
  {
    id: 532,
    number: 4,
    name: "Fleischgericht Teller (mit Pommes)",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Pommes frites oder Bulgur & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 533,
    number: 5,
    name: "Fleischgericht (mit Salat)",
    description: "mit Fleischgericht nach Wahl: Kalb oder Hähnchen, Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 534,
    number: 6,
    name: "Sucuk Tasche",
    description: "mit türkischer Knoblauchwurst im Fladenbrot, mit gemischtem Salat & Soße",
    price: 9.00,
    isSpezialitaet: true
  },
  {
    id: 535,
    number: 7,
    name: "Sucuk Teller",
    description: "mit türkischer Knoblauchwurst mit Bulgur oder Pommes, mit gemischtem Salat & Soße",
    price: 13.50,
    isSpezialitaet: true
  },
  {
    id: 536,
    number: 8,
    name: "Lahmacun Salat",
    description: "mit gemischtem Salat & Soße",
    price: 6.00,
    isSpezialitaet: true
  },
  {
    id: 537,
    number: 9,
    name: "Lahmacun Kalb oder Hähnchen",
    description: "Fleischgericht nach Wahl: Kalb oder Hähnchen mit gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  },
  {
    id: 538,
    number: 10,
    name: "Lahmacun Weichkäse",
    description: "mit Weichkäse, gemischtem Salat & Soße",
    price: 7.00,
    isSpezialitaet: true
  }
];

// Helper function to create pizza sizes with individual prices
const createPizzaSizes = (prices: { medium: number; large: number; family: number; mega: number }) => [
  { name: 'Medium', price: prices.medium, description: 'Ø ca. 26 cm' },
  { name: 'Large', price: prices.large, description: 'Ø ca. 30 cm' },
  { name: 'Family', price: prices.family, description: 'Ø ca. 40 cm' },
  { name: 'Mega', price: prices.mega, description: 'Ø ca. 50 cm' }
];

// Pizza - Updated with new Döner Pizza and updated Wunsch Pizza ingredients
export const pizzas: MenuItem[] = [
  {
    id: 526,
    number: 26,
    name: "Pizza Margherita",
    description: "",
    price: 9.00,
    isPizza: true
  },
  {
    id: 527,
    number: 27,
    name: "Pizza Salami",
    description: "mit Salami",
    price: 10.00,
    isPizza: true
  },
  {
    id: 528,
    number: 28,
    name: "Pizza Schinken",
    description: "mit Schinken",
    price: 10.00,
    isPizza: true
  },
  {
    id: 529,
    number: 29,
    name: "Pizza Funghi",
    description: "mit Champignons",
    price: 10.00,
    isPizza: true
  },
  {
    id: 530,
    number: 30,
    name: "Pizza Tonno",
    description: "mit Thunfisch & Zwiebeln",
    price: 11.00,
    isPizza: true
  },
  {
    id: 531,
    number: 31,
    name: "Pizza Sucuk",
    description: "mit Knoblauchwurst",
    price: 11.00,
    isPizza: true
  },
  {
    id: 532,
    number: 32,
    name: "Pizza Hollandaise",
    description: "mit Hähnchenbrusfilet, Broccoli, Tomaten, Hollandaise-Soße",
    price: 12.00,
    isPizza: true
  },
  {
    id: 533,
    number: 33,
    name: "Pizza Hawaii",
    description: "mit Ananas & Schinken",
    price: 12.00,
    isPizza: true
  },
  {
    id: 534,
    number: 34,
    name: "Pizza Athen",
    description: "mit Spinat & Weichkäse",
    price: 12.00,
    isPizza: true
  },
  {
    id: 535,
    number: 35,
    name: "Pizza Rio",
    description: "mit Sucuk, Weichkäse, Zwiebeln & Peperoni",
    price: 12.50,
    isPizza: true
  },
  {
    id: 536,
    number: 36,
    name: "Calzone",
    description: "mit 3 Zutaten nach Wahl, jede extra Zutat +1 €",
    price: 12.00,
    isPizza: true
  },
  {
    id: 537,
    number: 37,
    name: "Pizza Art Drehspieß",
    description: "mit Fleischgericht nach Wahl & Zwiebeln",
    price: 12.50,
    isPizza: true
  },
  {
    id: 538,
    number: 38,
    name: "Pizza Hamburger",
    description: "mit Hamburger-Patty, Salat, jede extra Zutat +1 €, Burgersoße",
    price: 12.00,
    isPizza: true
  },
  {
    id: 539,
    number: 39,
    name: "Pizza Mozzarella",
    description: "mit frischem Mozzarella & Tomaten",
    price: 12.00,
    isPizza: true
  },
  {
    id: 540,
    number: 40,
    name: "Pizza Italia",
    description: "mit Salami, Mozzarella & frischem Basilikum",
    price: 11.00,
    isPizza: true
  },
  {
    id: 541,
    number: 41,
    name: "Pizza Rustica",
    description: "mit Schinken, Salami & frischen Champignons",
    price: 11.00,
    isPizza: true
  },
  {
    id: 542,
    number: 42,
    name: "Pizza Grüne Oase",
    description: "mit Paprika, Tomaten, Broccoli & Champignons",
    price: 12.00,
    isPizza: true
  },
  {
    id: 543,
    number: 43,
    name: "Pizza Mexico",
    description: "mit Jalapenos, Hähnchenfleisch, Mais, Paprika & Champignons",
    price: 12.00,
    isPizza: true
  },
  {
    id: 544,
    number: 44,
    name: "Pizza Quattro Stagioni",
    description: "mit Schinken, Salami, Champignons & Artischocken",
    price: 12.00,
    isPizza: true
  },
  {
    id: 545,
    number: 45,
    name: "Pizza India",
    description: "mit Schinken, Hähnchenbrusfilet, Ananas & Currysauce",
    price: 12.00,
    isPizza: true
  },
  {
    id: 546,
    number: 46,
    name: "Pizza Diavolo",
    description: "mit Salami, Champignons & Peperoni",
    price: 12.50,
    isPizza: true
  },
  {
    id: 547,
    number: 47,
    name: "Pizza Brötchen",
    description: "jede extra Zutat +1 €",
    price: 5.00,
    isPizza: true
  }
];