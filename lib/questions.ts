export type IntroQuestion = {
  id: string;
  label: string;
  options: string[];
};

export type QuestionItem = {
  id: string;
  label: string;
  /** Options considered the "obviously correct" home for this item, if any. */
  expected?: string[];
  /** The specific options worth watching for a split, per the interpretation key. */
  watch?: string[];
  /** Human-readable note from the results interpretation key. */
  note?: string;
};

export type Section = {
  id: string;
  part: 1 | 2;
  title: string;
  description: string;
  options: string[];
  shuffle?: boolean;
  items: QuestionItem[];
};

export const INTRO_QUESTION: IntroQuestion = {
  id: "q0",
  label: "Have you ordered groceries online before?",
  options: [
    "Yes, including with Groupr",
    "Yes, but not with Groupr",
    "No, this would be new to me",
  ],
};

const MAIN_SECTION_OPTIONS = [
  "Produce",
  "Dairy & Eggs",
  "Meat & Seafood",
  "Bread & Bakery",
  "Beverages",
  "Frozen",
  "Pantry",
  "Snacks",
  "Somewhere else",
  "I'm not sure",
];

export const SECTIONS: Section[] = [
  {
    id: "main",
    part: 1,
    title: "Where would you look?",
    description: "For each item, pick the ONE section where you'd look for it first.",
    options: MAIN_SECTION_OPTIONS,
    shuffle: true,
    items: [
      {
        id: "q1",
        label: "Frozen shrimp",
        watch: ["Frozen", "Meat & Seafood"],
        note: "Frozen vs Meat & Seafood",
      },
      {
        id: "q2",
        label: "Almond milk",
        watch: ["Dairy & Eggs", "Beverages"],
        note: "Dairy & Eggs (Plant-Based) vs Beverages",
      },
      {
        id: "q3",
        label: "Peanut butter",
        watch: ["Pantry", "Snacks"],
        note: "Pantry vs Snacks",
      },
      {
        id: "q4",
        label: "Coffee creamer",
        watch: ["Dairy & Eggs", "Beverages"],
        note: "Dairy & Eggs vs Beverages",
      },
      {
        id: "q5",
        label: "Canned tuna",
        watch: ["Pantry", "Meat & Seafood"],
        note: "Pantry vs Meat & Seafood",
      },
      {
        id: "q6",
        label: "Flour tortillas",
        watch: ["Bread & Bakery", "Pantry"],
        note: "Bread & Bakery vs Pantry",
      },
      {
        id: "q7",
        label: "Salsa",
        watch: ["Pantry", "Snacks"],
        note: "Pantry (Condiments) vs Snacks (Dips)",
      },
      {
        id: "q8",
        label: "Trail mix",
        watch: ["Snacks", "Pantry"],
        note: "Snacks vs Pantry",
      },
      {
        id: "q9",
        label: "String cheese",
        watch: ["Dairy & Eggs", "Snacks"],
        note: "Dairy & Eggs vs Snacks",
      },
      {
        id: "q10",
        label: "Orange juice",
        expected: ["Beverages"],
        note: "Should be Beverages",
      },
      {
        id: "q11",
        label: "A dozen eggs",
        expected: ["Dairy & Eggs"],
        note: "Should be Dairy & Eggs",
      },
      {
        id: "q12",
        label: "Frozen pizza",
        expected: ["Frozen"],
        note: "Should be Frozen",
      },
    ],
  },
  {
    id: "pantry",
    part: 2,
    title: "On the Pantry shelf",
    description:
      "Everything below is in the Pantry section. If you were looking on the Pantry shelf, where would you check?",
    options: [
      "Baking",
      "Beans & Lentils",
      "Canned Goods",
      "Canned Meat & Seafood",
      "Cereal & Breakfast",
      "Condiments & Dressings",
      "Cooking Oil & Vinegar",
      "Mac & Cheese",
      "Pasta",
      "Pasta & Cooking Sauces",
      "Quick Meals & Sides",
      "Ramen & Noodles",
      "Rice & Grains",
      "Salad Toppings",
      "Soup & Broth",
      "Spices & Seasonings",
      "Spreads, Jam & Nut Butters",
      "I'm not sure",
    ],
    items: [
      {
        id: "q13",
        label: "A box of spaghetti",
        watch: ["Pasta", "Pasta & Cooking Sauces"],
        note: 'Does "Pasta" vs "Pasta & Cooking Sauces" confuse people?',
      },
      {
        id: "q14",
        label: "A jar of marinara sauce",
        watch: ["Pasta", "Pasta & Cooking Sauces"],
        note: 'Does "Pasta" vs "Pasta & Cooking Sauces" confuse people?',
      },
      {
        id: "q15",
        label: "A can of black beans",
        watch: ["Beans & Lentils", "Canned Goods"],
        note: '"Beans & Lentils" vs "Canned Goods" overlap',
      },
    ],
  },
  {
    id: "frozen",
    part: 2,
    title: "On the Frozen shelf",
    description:
      "Everything below is in the Frozen section. Which shelf would you check?",
    options: [
      "Frozen Appetizers & Sides",
      "Frozen Bread & Bakery",
      "Frozen Breakfast",
      "Frozen Fruit",
      "Frozen Meals & Entrees",
      "Frozen Meat & Seafood",
      "Frozen Vegetables",
      "Ice Cream & Desserts",
      "I'm not sure",
    ],
    items: [
      {
        id: "q16",
        label: "Frozen salmon fillets",
        expected: ["Frozen Meat & Seafood"],
      },
      {
        id: "q17",
        label: "Frozen waffles",
        watch: ["Frozen Breakfast", "Frozen Bread & Bakery"],
        note: 'Is "Frozen Breakfast" vs "Frozen Bread & Bakery" clear?',
      },
      {
        id: "q18",
        label: "A bag of frozen blueberries",
        expected: ["Frozen Fruit"],
        note: 'Is "Frozen Breakfast" vs "Frozen Bread & Bakery" clear? (control item)',
      },
    ],
  },
  {
    id: "dairy",
    part: 2,
    title: "On the Dairy & Eggs shelf",
    description:
      "Everything below is in the Dairy & Eggs section. Which shelf would you check?",
    options: [
      "Butter & Spreads",
      "Cheese",
      "Cream & Creamers",
      "Eggs",
      "Milk",
      "Plant-Based Dairy",
      "Sour Cream & Cottage Cheese",
      "Yogurt",
      "I'm not sure",
    ],
    items: [
      {
        id: "q19",
        label: "Oat milk",
        watch: ["Plant-Based Dairy", "Milk"],
        note: '"Plant-Based Dairy" vs "Milk"',
      },
      {
        id: "q20",
        label: "A tub of cream cheese",
        watch: ["Cheese", "Cream & Creamers", "Butter & Spreads"],
        note: '"Cheese" vs "Cream & Creamers" vs "Butter & Spreads"',
      },
      {
        id: "q21",
        label: "Greek yogurt",
        expected: ["Yogurt"],
      },
    ],
  },
  {
    id: "meat",
    part: 2,
    title: "On the Meat & Seafood shelf",
    description:
      "Everything below is in the Meat & Seafood section. Which shelf would you check?",
    options: [
      "Beef",
      "Chicken",
      "Deli Meat",
      "Hot Dogs & Sausages",
      "Lamb",
      "Meat Alternatives",
      "Pork",
      "Seafood",
      "Turkey",
      "I'm not sure",
    ],
    items: [
      {
        id: "q22",
        label: "Sliced deli turkey",
        watch: ["Deli Meat", "Turkey"],
        note: '"Deli Meat" vs "Turkey"',
      },
      {
        id: "q23",
        label: "A pound of ground beef",
        expected: ["Beef"],
      },
      {
        id: "q24",
        label: "A veggie burger patty",
        expected: ["Meat Alternatives"],
        note: 'Should be "Meat Alternatives"',
      },
    ],
  },
  {
    id: "bread",
    part: 2,
    title: "On the Bread & Bakery shelf",
    description:
      "Everything below is in the Bread & Bakery section. Which shelf would you check?",
    options: [
      "Breakfast Bakery",
      "Desserts",
      "Rolls & Buns",
      "Sandwich Bread",
      "Tortillas, Wraps & Flatbreads",
      "I'm not sure",
    ],
    items: [
      {
        id: "q25",
        label: "A pack of hamburger buns",
        expected: ["Rolls & Buns"],
        note: "Should be Rolls & Buns",
      },
      {
        id: "q26",
        label: "A pack of flour tortillas",
        expected: ["Tortillas, Wraps & Flatbreads"],
        note: 'Does "Tortillas, Wraps & Flatbreads" read clearly once inside Bread & Bakery?',
      },
      {
        id: "q27",
        label: "A box of blueberry muffins",
        watch: ["Breakfast Bakery", "Desserts"],
        note: "Breakfast Bakery vs Desserts",
      },
    ],
  },
];

export const ALL_ITEM_IDS = [
  INTRO_QUESTION.id,
  ...SECTIONS.flatMap((s) => s.items.map((i) => i.id)),
];

export function findItem(itemId: string): { section: Section; item: QuestionItem } | null {
  for (const section of SECTIONS) {
    const item = section.items.find((i) => i.id === itemId);
    if (item) return { section, item };
  }
  return null;
}
