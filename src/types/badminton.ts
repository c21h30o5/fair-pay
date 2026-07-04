
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
  courtShare: number;   // 🏟️ สัดส่วนค่าคอร์ท (X)
  shuttleShare: number; // 🏸 สัดส่วนค่าลูกแบด (Y)
  personalDrink: number; // 🥤 ค่าน้ำส่วนตัว
  totalToPay: number;    // 💵 ยอดรวมสุทธิที่ต้องจ่าย
}

export interface PlayerHistorySummary {
  name: string;
  totalToPay: number;
}

export interface BadmintonHistory {
  id: string;        // รหัสไอดีของบิล (ใช้ Timestamp)
  date: string;      // วันที่เคลียร์บิล
  totalCentral: number; // ยอดส่วนกลางรวมของก๊วน
  grandTotal: number;   // ยอดรวมสุทธิทั้งบิล (รวมค่าน้ำทุกคน)
  players: PlayerHistorySummary[]; // รายชื่อเพื่อนแบบย่อและยอดที่แต่ละคนต้องจ่าย
}