export interface Player {
  id: string;
  name: string;
  hours: number;
}

export interface Court {
  id: string;
  hours: number;
}

export interface BillRow {
  id: string;
  name: string;
  playedHours: number;
  courtShare: number;
  shuttleShare: number;
  personalDrink: number;
  totalToPay: number;
}

export interface BadmintonBillSummary {
  totalCourt: number;
  totalShuttle: number;
  totalCentral: number;
  grandTotal: number;
  billRows: BillRow[];
}

export interface BadmintonBillData {
  id?: string;
  groupId?: string;
  courtRate: number;
  courts: Court[];
  shuttleCount: number;
  shuttlePrice: number;
  players: Player[];
  drinks?: Record<string, number>;
  summary?: BadmintonBillSummary;
}

export interface PlayerHistorySummary {
  name: string;
  totalToPay: number;
}

export interface BadmintonHistory {
  id: string;
  created_at: string;
  bill_data: BadmintonBillData;
}
