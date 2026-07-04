"use client";

import { useState, useEffect, useRef } from "react"; // 🔥 เพิ่ม useRef เข้ามาตรงนี้
import Link from "next/link";
import { useRouter } from "next/navigation";
// 🔥 บรรทัดที่เพิ่มเข้ามา: ดึง Type จากส่วนกลางมาใช้งานแทน
import { Player, Court } from "./types";

// กำหนดประเภทข้อมูล (TypeScript) เพื่อความปลอดภัยตามสไตล์ ERP ย้ายไปไว้ที่ types.ts เพื่อ manage ง่ายขึ้น
/*interface Player {
  id: string;
  name: string;
  hours: number;
}

interface Court {
  id: string;
  hours: number;
}*/

export default function BadmintonPage() {
  const router = useRouter();

  // 🔥 2.1 สร้างกล่องเก็บตัวอ้างอิงสำหรับช่อง Input
  const inputRef = useRef<HTMLInputElement>(null);

  // --- State สำหรับเก็บข้อมูลในฟอร์ม ---
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "นาย A", hours: 2 }, // ค่าเริ่มต้นเผื่อให้เห็นภาพ
  ]);
  const [playerNameInput, setPlayerNameInput] = useState("");

  const [courtRate, setCourtRate] = useState<number>(160); // ราคาต่อชั่วโมงมาตรฐาน
  const [courts, setCourts] = useState<Court[]>([
    { id: "1", hours: 2 }, // คอร์ทแรกเริ่มที่ 2 ชม.
  ]);

  const [shuttleCount, setShuttleCount] = useState<number>(0);
  const [shuttlePrice, setShuttlePrice] = useState<number>(50);

  // 🔥 แก้ไข: เพิ่มระบบ Auto-load ข้อมูลเก่าจากสัปดาห์ก่อนมาใส่ฟอร์มให้อัตโนมัติ
  useEffect(() => {
    const savedData = localStorage.getItem("fairpay_badminton_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.players) setPlayers(parsed.players);
        if (parsed.courtRate) setCourtRate(parsed.courtRate);
        if (parsed.courts) setCourts(parsed.courts);
        if (parsed.shuttleCount) setShuttleCount(parsed.shuttleCount);
        if (parsed.shuttlePrice) setShuttlePrice(parsed.shuttlePrice);
      } catch (error) {
        console.error("Failed to parse saved data from localStorage", error);
      }
    }
  }, []);

  // --- ฟังก์ชันจัดการส่วนที่ 1: รายชื่อสมาชิก ---
  const addPlayer = () => {
    if (!playerNameInput.trim()) return;
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: playerNameInput.trim(),
      hours: 2,
    };
    setPlayers([...players, newPlayer]);
    setPlayerNameInput("");

    // 🔥 2.2 สั่งให้ช่อง Input กลับมา Focus ทันทีหลังจากเพิ่มชื่อเสร็จ
    inputRef.current?.focus();
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter((p) => p.id !== id));
  };

  const updatePlayerHours = (id: string, hours: number) => {
    setPlayers(
      players.map((p) =>
        p.id === id ? { ...p, hours: Math.max(0, hours) } : p,
      ),
    );
  };

  // --- ฟังก์ชันจัดการส่วนที่ 2: จำนวนคอร์ท ---
  const addCourt = () => {
    const newCourt: Court = {
      id: Date.now().toString(),
      hours: 1,
    };
    setCourts([...courts, newCourt]);
  };

  const removeCourt = (id: string) => {
    if (courts.length === 1) return;
    setCourts(courts.filter((c) => c.id !== id));
  };

  const updateCourtHours = (id: string, hours: number) => {
    setCourts(
      courts.map((c) =>
        c.id === id ? { ...c, hours: Math.max(1, hours) } : c,
      ),
    );
  };

  // --- ฟังก์ชันเมื่อกดปุ่ม "ตกลง" เพื่อส่งข้อมูลไปคำนวณ ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ดักจับเคส: ไม่ได้กรอกค่าคอร์ท หรือค่าคอร์ทติดลบ
    if (!courtRate || courtRate <= 0) {
      alert("⚠️ กรุณากรอกอัตราค่าคอร์ท (บาท/ชม.) ให้ถูกต้องก่อนไปต่อครับ");
      return;
    }

    // 2. ดักจับเคส: ไม่ได้ระบุชั่วโมงของคอร์ทเลย หรือชั่วโมงรวมเป็น 0
    const totalCourtHours = courts.reduce((sum, c) => sum + c.hours, 0);
    if (totalCourtHours <= 0) {
      alert("⚠️ กรุณาระบุชั่วโมงที่ใช้เล่นของคอร์ทอย่างน้อย 1 คอร์ทครับ");
      return;
    }

    // 3. ดักจับเคสสำคัญ: ลืมเพิ่มชื่อเพื่อนร่วมก๊วน
    if (players.length === 0) {
      alert(
        "⚠️ ก๊วนนี้ยังไม่มีผู้เล่นเลย! กรุณาเพิ่มชื่อเพื่อนร่วมก๊วนอย่างน้อย 1 คนก่อนครับ",
      );
      return;
    }

    // 4. ดักจับเคส: ชั่วโมงรวมของทุกคนรวมกันแล้วได้ 0 (ไม่มีใครเล่นเลย)
    const totalPlayersHours = players.reduce((sum, p) => sum + p.hours, 0);
    if (totalPlayersHours <= 0) {
      alert(
        "⚠️ เพื่อนทุกคนในกลุ่มมีชั่วโมงเล่นเป็น 0 ชม. ระบบไม่สามารถหารเฉลี่ยได้ กรุณาใส่เวลาเล่นให้เพื่อนๆ ก่อนครับ",
      );
      return;
    }

    // 🎉 ถ้าผ่านด่านตรวจสอบทั้งหมดด้านบน ข้อมูลพร้อมชัวร์ 100% ถึงจะปล่อยให้เซฟและข้ามหน้าได้
    const formData = {
      courtRate,
      courts,
      shuttleCount,
      shuttlePrice,
      players,
    };

    // 2. เปลี่ยนเป็น localStorage เพื่อให้จำยาวๆ แม้ปิดเครื่อง
    localStorage.setItem("fairpay_badminton_data", JSON.stringify(formData));

    // 3. สั่งย้ายหน้าเปลี่ยน Route ไปยังหน้าทบทวน/ค่าน้ำ
    router.push("/badminton/review");
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        {/* ส่วนหัวหน้าฟอร์ม */}
        <div className="flex items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          {/* ฝั่งซ้าย: ปุ่มย้อนกลับ และ ชื่อหัวข้อใหญ่ */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-slate-400 hover:text-slate-600 text-sm md:text-base flex items-center gap-1 transition"
            >
              ⬅️ Back
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-1.5">
              🏸 Badminton Group Setting
            </h1>
          </div>

          {/* ฝั่งขวา: ปุ่มประวัติย้อนหลัง (จัดให้อยู่ตรงกลางแนวตั้งพอดี และขนาดกระชับ) */}
          <Link
            href="/badminton/history"
            className="whitespace-nowrap bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold transition text-xs md:text-sm flex items-center gap-1 shadow-sm border border-slate-200/40"
          >
            📜 History
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ส่วนที่ 1: คนที่มาตี */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span>👤</span> ส่วนที่ 1: รายชื่อคนที่มาตี
            </h2>

            {/* กล่องเพิ่มรายชื่อ */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                ref={inputRef}
                placeholder="พิมพ์ชื่อเพื่อน..."
                value={playerNameInput}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                // 🔥 บรรทัดที่เพิ่มเข้ามา: ดักจับการกดปุ่ม Enter บนมือถือ/คอมพิวเตอร์
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // 1. ดักไม่ให้ฟอร์มใหญ่ Submit เด้งหนีหน้า
                    addPlayer(); // 2. สั่งเรียกฟังก์ชันเพิ่มชื่อแทน
                  }
                }}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-blue-500"
              />
              <button
                type="button" // ระบุว่าเป็นแค่ปุ่มธรรมดา ไม่ใช่ปุ่มส่งฟอร์มใหญ่
                onClick={addPlayer}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                + เพิ่มชื่อ
              </button>
            </div>

            {/* รายชื่อคนที่เพิ่มเข้ามาแล้ว */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-white p-2.5 rounded-lg border text-sm"
                >
                  <span className="font-medium text-slate-700">
                    {player.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <label className="text-xs text-slate-400">ตีไป:</label>
                      <input
                        type="number"
                        step="0.5"
                        value={player.hours}
                        onChange={(e) =>
                          updatePlayerHours(
                            player.id,
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-14 px-1.5 py-0.5 border rounded text-center font-bold text-blue-600"
                      />
                      <span className="text-xs text-slate-500">ชม.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))}
              {players.length === 0 && (
                <p className="text-xs text-center text-slate-400 py-2">
                  ยังไม่มีรายชื่อ กรุณาเพิ่มคนข้างบนครับ
                </p>
              )}
            </div>
          </div>

          {/* ส่วนที่ 2: จำนวนคอร์ท */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span>🏟️</span> ส่วนที่ 2: ข้อมูลคอร์ทและเวลา
            </h2>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  ราคาคอร์ท / ชั่วโมง (บาท)
                </label>
                <input
                  type="number"
                  value={courtRate}
                  onChange={(e) => setCourtRate(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm font-bold text-slate-700"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addCourt}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                >
                  + เพิ่มคอร์ท
                </button>
              </div>
            </div>

            {/* รายการคอร์ทแต่ละตัว */}
            <div className="space-y-2">
              {courts.map((court, index) => (
                <div
                  key={court.id}
                  className="flex items-center justify-between bg-white p-2.5 rounded-lg border text-sm"
                >
                  <span className="font-medium text-slate-600">
                    คอร์ทที่ {index + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={court.hours}
                        onChange={(e) =>
                          updateCourtHours(
                            court.id,
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="w-14 px-1.5 py-0.5 border rounded text-center font-semibold"
                      />
                      <span className="text-xs text-slate-500">ชั่วโมง</span>
                    </div>
                    {courts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCourt(court.id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        ❌
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 3: จำนวนลูกแบด */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
            <h2 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
              <span>🏸</span> ส่วนที่ 3: อุปกรณ์ส่วนกลาง (ลูกแบด)
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  จำนวนลูกที่ใช้ (ลูก)
                </label>
                <input
                  type="number"
                  value={shuttleCount}
                  onChange={(e) =>
                    setShuttleCount(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  ราคาต่อลูก (บาท)
                </label>
                <input
                  type="number"
                  value={shuttlePrice}
                  onChange={(e) =>
                    setShuttlePrice(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* ปุ่มส่งฟอร์ม */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition shadow-md shadow-blue-200"
          >
            Confirm ⚙️
          </button>
        </form>
      </div>
    </main>
  );
}
