"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { calculateBadmintonBill } from "@/lib/badmintonBill";
import { BadmintonBillData, BadmintonHistory } from "@/types/badminton";
import promptpay from "promptpay-qr";
import QRCode from "qrcode";

export default function BadmintonBillPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const [billData, setBillData] = useState<BadmintonBillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [promptpayNumber, setPromptpayNumber] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    const loadBill = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/badminton/api/fetch?id=${groupId}`);
        const result: { data?: BadmintonHistory | null; error?: string } =
          await response.json();

        if (response.ok && result.data?.bill_data) {
          setBillData(result.data.bill_data);
          localStorage.setItem(
            "fairpay_badminton_data",
            JSON.stringify(result.data.bill_data),
          );
          return;
        }

        const savedData = localStorage.getItem("fairpay_badminton_data");
        if (savedData) {
          const parsed: BadmintonBillData = JSON.parse(savedData);
          if (parsed.id === groupId || parsed.groupId === groupId) {
            setBillData(parsed);
            return;
          }
        }

        setErrorMessage("ไม่พบบิลนี้ในประวัติ");
      } catch (error) {
        console.error("Failed to load bill", error);
        setErrorMessage("โหลดข้อมูลบิลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    const loadProfile = async () => {
      try {
        const response = await fetch("/profile/api");
        const result = await response.json();

        if (response.ok && result.promptpay_number) {
          setPromptpayNumber(result.promptpay_number);

          const payload = promptpay(result.promptpay_number, {});
          const dataUrl = await QRCode.toDataURL(payload, {
            margin: 2,
            width: 300,
            color: { dark: "#1e293b", light: "#ffffff" },
          });
          setQrDataUrl(dataUrl);
        }
      } catch {
        // silently ignore — profile may not exist
      }
    };

    loadBill();
    loadProfile();
  }, [groupId]);

  const summary = billData
    ? billData.summary || calculateBadmintonBill(billData)
    : null;

  const copyToClipboard = () => {
    if (!summary) return;

    const promptpayText = promptpayNumber
      ? `PromptPay: ${promptpayNumber}`
      : "โอนที่: [ใส่เลขบัญชีของคุณ]";

    const message = `สรุปบิลแบดมินตัน
ยอดรวมทั้งก๊วน: ${summary.grandTotal} บาท
------------------
${summary.billRows.map((row) => `${row.name}: ${row.totalToPay} บาท`).join("\n")}
------------------
${promptpayText}`;

    navigator.clipboard.writeText(message);
    alert("คัดลอกลงคลิปบอร์ดเรียบร้อยแล้ว");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white rounded-xl border border-slate-100 p-6 text-center text-slate-500">
          กำลังโหลดบิล...
        </div>
      </main>
    );
  }

  if (!summary) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white rounded-xl border border-slate-100 p-6">
          <Link href="/badminton/history" className="text-slate-500 hover:text-slate-800">
            กลับไปประวัติ
          </Link>
          <p className="mt-6 text-center text-slate-600">{errorMessage}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/badminton/history" className="text-slate-400 hover:text-slate-600">
            ย้อนกลับ
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">ใบเสร็จ</h1>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 text-white mb-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3 text-xs text-slate-400">
            <span>รายละเอียดภาพรวม</span>
            <span>จำนวนเงิน (บาท)</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-300 mb-1">
            <span>ค่าคอร์ททั้งหมด:</span>
            <span className="font-semibold">{summary.totalCourt.toLocaleString()}.-</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-300 mb-3">
            <span>ค่าลูกแบดทั้งหมด:</span>
            <span className="font-semibold">{summary.totalShuttle.toLocaleString()}.-</span>
          </div>
          <div className="flex justify-between items-center text-xl font-black text-emerald-400 pt-3 border-t border-dashed border-slate-700">
            <span>ยอดรวมสุทธิ:</span>
            <span>{summary.grandTotal.toLocaleString()}.-</span>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-bold text-slate-700 text-sm">รายคน</h2>

          <div className="space-y-3">
            {summary.billRows.map((row) => (
              <div
                key={row.id}
                className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm flex flex-col gap-2"
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-bold text-slate-800 text-base">{row.name}</span>
                  <span className="text-sm font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    ต้องโอน: {row.totalToPay.toLocaleString()}.-
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-slate-500 pt-1">
                  <div>
                    เวลาเล่น: <b>{row.playedHours}</b> ชม.
                  </div>
                  <div className="text-right">
                    ค่าน้ำ: <b>{row.personalDrink.toLocaleString()}</b>.-
                  </div>
                  <div className="border-t border-slate-50 pt-1">
                    ค่าคอร์ท: <b>{row.courtShare.toLocaleString()}</b>.-
                  </div>
                  <div className="text-right border-t border-slate-50 pt-1">
                    ค่าลูกแบด: <b>{row.shuttleShare.toLocaleString()}</b>.-
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {qrDataUrl && (
          <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2">
              <span>💳</span> ชำระเงินผ่าน PromptPay
            </h2>
            <div className="flex flex-col items-center gap-3">
              <img
                src={qrDataUrl}
                alt="PromptPay QR"
                className="w-full max-w-[240px] h-auto rounded-lg shadow-sm"
              />
              <p className="text-sm text-slate-500 font-mono tracking-wide">
                PromptPay: {promptpayNumber}
              </p>
              <p className="text-xs text-slate-400 text-center">
                เพื่อนสแกน QR เพื่อโอนเงินตามยอดที่ต้องจ่าย
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={copyToClipboard}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.97] text-white py-3.5 rounded-xl font-bold transition-all duration-150 shadow-md shadow-emerald-200"
          >
            คัดลอกบิลไปวางในกลุ่ม Line
          </button>

          <Link
            href="/badminton"
            className="block text-center w-full bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-semibold transition text-sm"
          >
            เริ่มคำนวณรอบใหม่
          </Link>
        </div>
      </div>
    </main>
  );
}
