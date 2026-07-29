export type RewardStatus = "won" | "not_started" | "free";

export type BingoColumn = "B" | "I" | "N" | "G" | "O";

export type BingoReward = {
  id: string;
  col: BingoColumn;
  row: number;
  title: string;
  description: string;
  amount: number;
  status: RewardStatus;
};

export const AMBASSADOR_CODE = "MJ-4821";
export const CREDIT_CAP = 147;
export const BOARD_COMPLETE_BONUS = 25;
export const PROGRESS_TRACK_LENGTH = 12;

export const BINGO_COLUMNS: BingoColumn[] = ["B", "I", "N", "G", "O"];

export const BINGO_REWARDS: BingoReward[] = [
  { id: "B1", col: "B", row: 1, title: "Order from Castle Hill", description: "Any order placed by a Castle Hill neighbor", amount: 2, status: "won" },
  { id: "I1", col: "I", row: 1, title: "5 orders this month", description: "Five total orders driven this month", amount: 4, status: "not_started" },
  { id: "N1", col: "N", row: 1, title: "$25+ single order", description: "One order of $25 or more", amount: 4, status: "not_started" },
  { id: "G1", col: "G", row: 1, title: "Order from Foxhurst", description: "Any order placed by a Foxhurst neighbor", amount: 2, status: "not_started" },
  { id: "O1", col: "O", row: 1, title: "Order from Parkchester", description: "Any order placed by a Parkchester neighbor", amount: 2, status: "not_started" },

  { id: "B2", col: "B", row: 2, title: "$50+ single order", description: "One order of $50 or more", amount: 4, status: "won" },
  { id: "I2", col: "I", row: 2, title: "$100 single order", description: "One order of $100 or more", amount: 8, status: "won" },
  { id: "N2", col: "N", row: 2, title: "Bring on a new ambassador", description: "Refer someone who joins as an ambassador", amount: 8, status: "won" },
  { id: "G2", col: "G", row: 2, title: "Order from Hunts Point", description: "Any order placed by a Hunts Point neighbor", amount: 2, status: "won" },
  { id: "O2", col: "O", row: 2, title: "5 orders in one week", description: "Five orders driven in a single week", amount: 4, status: "not_started" },

  { id: "B3", col: "B", row: 3, title: "$75+ single order", description: "One order of $75 or more", amount: 4, status: "not_started" },
  { id: "I3", col: "I", row: 3, title: "New ambassador referral", description: "Refer someone who joins as an ambassador", amount: 8, status: "not_started" },
  { id: "N3", col: "N", row: 3, title: "Free point", description: "Your head start on Groupr", amount: 0, status: "free" },
  { id: "G3", col: "G", row: 3, title: "New ambassador referral", description: "Refer someone who joins as an ambassador", amount: 8, status: "not_started" },
  { id: "O3", col: "O", row: 3, title: "Order from a building you don't live in", description: "Reach a neighbor outside your own building", amount: 2, status: "not_started" },

  { id: "B4", col: "B", row: 4, title: "Order from Soundview", description: "Any order placed by a Soundview neighbor", amount: 2, status: "not_started" },
  { id: "I4", col: "I", row: 4, title: "Order from Clason Point", description: "Any order placed by a Clason Point neighbor", amount: 2, status: "not_started" },
  { id: "N4", col: "N", row: 4, title: "Order from Longwood", description: "Any order placed by a Longwood neighbor", amount: 2, status: "not_started" },
  { id: "G4", col: "G", row: 4, title: "Order from a NYCHA building", description: "Any order placed by a public housing resident", amount: 2, status: "not_started" },
  { id: "O4", col: "O", row: 4, title: "Order from Bronx River Houses", description: "Any order placed by a Bronx River Houses neighbor", amount: 2, status: "not_started" },

  { id: "B5", col: "B", row: 5, title: "Neighbor orders, same week", description: "Two neighbors in your building order in one week", amount: 4, status: "not_started" },
  { id: "I5", col: "I", row: 5, title: "Order from a lobby drop", description: "Order picked up from a lobby drop point", amount: 2, status: "not_started" },
  { id: "N5", col: "N", row: 5, title: "Bring on a new ambassador", description: "Refer someone who joins as an ambassador", amount: 8, status: "not_started" },
  { id: "G5", col: "G", row: 5, title: "10 orders total", description: "Ten total orders driven since joining", amount: 4, status: "not_started" },
  { id: "O5", col: "O", row: 5, title: "$150 single order", description: "One order of $150 or more", amount: 8, status: "not_started" },
];

/** Reward rows in the order the board reads: row by row, B/I/N/G/O across each row. */
export function rewardsInBoardOrder(): BingoReward[] {
  const byId = new Map(BINGO_REWARDS.map((r) => [r.id, r]));
  const ordered: BingoReward[] = [];
  for (let row = 1; row <= 5; row++) {
    for (const col of BINGO_COLUMNS) {
      const reward = byId.get(`${col}${row}`);
      if (reward) ordered.push(reward);
    }
  }
  return ordered;
}

export function totalEarned(): number {
  return BINGO_REWARDS.reduce((sum, r) => (r.status === "won" ? sum + r.amount : sum), 0);
}
