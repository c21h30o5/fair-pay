# Fair Pay ⚖️

แอปหารค่ากิจกรรมกีฬาตามจริง — สร้างบิล, คำนวณส่วนแบ่งตามเวลาเล่น, แชร์ให้เพื่อนใน Line

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Payment:** PromptPay QR (client-side generation)

## ฟีเจอร์

- **Auth:** Sign Up / Sign In / Logout ด้วย email + password
- **Route Protection:** ทุกหน้ายกเว้น `/login`, `/signup` ต้องล็อกอินก่อน
- **Badminton Bill Calculator:** กรอกข้อมูลผู้เล่น, ค่าคอร์ท, ลูกแบด, ค่าน้ำ → คำนวณส่วนแบ่งตามชั่วโมงเล่น
- **Review Page:** ทบทวนยอด + เพิ่มค่าน้ำดื่มส่วนตัว
- **Bill Page:** แสดงใบเสร็จ + PromptPay QR สำหรับให้เพื่อนสแกนจ่าย
- **History:** ดูประวัติบิลทั้งหมด (แยกตามผู้ใช้)
- **Profile:** ตั้งค่าเบอร์ PromptPay
- **Responsive:** Desktop + Mobile (Hamburger menu)
- **Security:** Error messages แบบ generic, middleware route protection

## เริ่มต้นใช้งาน

```bash
# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## Environment Variables

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

### ตาราง `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  promptpay_number TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);
```

## Deploy

เหมาะกับ [Vercel](https://vercel.com) เพราะเป็น Next.js native:

1. Push repo ไป GitHub
2. Import project ใน Vercel
3. ตั้งค่า Environment Variables (Supabase keys)
4. Deploy
