import {
  BadmintonBillData,
  BadmintonBillSummary,
  BillRow,
} from "@/types/badminton";

const roundMoney = (value: number) => Math.round(value * 100) / 100;

export function calculateBadmintonBill(
  data: BadmintonBillData,
): BadmintonBillSummary {
  const players = data.players || [];
  const courts = data.courts || [];
  const drinks = data.drinks || {};

  const totalCourtHours = courts.reduce((sum, court) => sum + court.hours, 0);
  const totalCourt = totalCourtHours * (data.courtRate || 0);
  const totalShuttle = (data.shuttleCount || 0) * (data.shuttlePrice || 0);
  const totalCentral = totalCourt + totalShuttle;
  const totalPlayersHours = players.reduce(
    (sum, player) => sum + player.hours,
    0,
  );

  let calculatedGrandTotal = 0;

  const billRows: BillRow[] = players.map((player) => {
    const personalDrink = drinks[player.id] || 0;
    const courtShare =
      totalPlayersHours > 0
        ? (player.hours / totalPlayersHours) * totalCourt
        : 0;
    const shuttleShare =
      totalPlayersHours > 0
        ? (player.hours / totalPlayersHours) * totalShuttle
        : 0;
    const totalToPay = courtShare + shuttleShare + personalDrink;

    calculatedGrandTotal += totalToPay;

    return {
      id: player.id,
      name: player.name,
      playedHours: player.hours,
      courtShare: roundMoney(courtShare),
      shuttleShare: roundMoney(shuttleShare),
      personalDrink,
      totalToPay: roundMoney(totalToPay),
    };
  });

  return {
    totalCourt: roundMoney(totalCourt),
    totalShuttle: roundMoney(totalShuttle),
    totalCentral: roundMoney(totalCentral),
    grandTotal: roundMoney(calculatedGrandTotal),
    billRows,
  };
}
