# Project Context & Guidelines: fair-pay

## 1. Project Overview
- **Name:** fair-pay
- **Type:** Next.js Web Application (SaaS/Internal Tool)
- **Purpose:** ระบบคำนวณและหารค่าใช้จ่ายสำหรับกิจกรรมกลุ่ม (เช่น ค่าสนามแบดมินตัน, ค่าอาหาร)
- **Key Modules:**
  - `app/badminton/bill/[groupId]`: หน้าจัดการและคำนวณบิลค่าสนาม
  - `app/badminton/history`: ประวัติการเล่นและการจ่ายเงิน
  - `app/badminton/review/[groupId]`: หน้าสรุปยอดและรีวิวบิล

## 2. Tech Stack & Architecture
- **Frontend/Backend:** Next.js 14+ (App Router)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (PostgreSQL)
- **State & Data Fetching:** Server Components by default, Client Components only when interactivity is needed (`'use client'`).

## 3. Critical Coding Constraints & Rules
- **No `any` Keyword:** ห้ามใช้ `any` ใน TypeScript เด็ดขาด ต้องประกาศ Interface หรือ Type ให้ชัดเจนในโฟลเดอร์ `types/`
- **Database Access:** 
  - การเรียกใช้งาน Supabase Client ต้องอ้างอิงจาก `@lib/supabase/supabaseClient.ts` (Client-side) หรือโปรแกรมฝั่ง Server ที่กำหนดไว้ใน `@lib/supabase/server.ts` เท่านั้น
  - ห้ามสร้าง Instance ของ Supabase ใหม่ซ้ำซ้อนในไฟล์อื่น
- **Component Structures:** 
  - คีย์เวิร์ดไฟล์หน้าบ้านต้องอยู่ในรูปแบบโฟลเดอร์ `app/` ยึดหลัก Page-based Routing
  - ไฟล์ Components ย่อยที่ไม่ใช่หน้าหลัก ให้เก็บไว้ในโฟลเดอร์ `components/` แยกต่างหาก
- **Error Handling:** ทุกคำสั่งที่ติดต่อกับ Supabase (เช่น `.select()`, `.insert()`) ต้องมีบล็อก `try-catch` หรือตรวจสอบเงื่อนไข `if (error)` และทำการ Log หรือแสดงผลอย่างปลอดภัยเสมอ

## 4. Security & Environment Rules
- **Environment Variables:** ห้ามเขียน Hardcode ค่า API Keys, Service Role Keys หรือ URL ของ Supabase ลงในโค้ดโดยตรงเด็ดขาด ต้องเรียกใช้ผ่าน `process.env.NEXT_PUBLIC_SUPABASE_URL` และ `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` เท่านั้น
- **Row Level Security (RLS):** ตารางทุกตารางใน Supabase ต้องรองรับ RLS ห้าม Query ข้อมูลข้าม User โดยไม่มีการเช็กสิทธิ์จาก Auth Session
- **Middleware:** การป้องกันหน้าเว็บ (Route Protection) ให้จัดการผ่าน `@/middleware.ts` เพื่อเช็ก JWT Token หรือ Session ก่อนให้ผู้ใช้เข้าถึงหน้าภายในแอป

## 5. Input/Output & Thinking Process Rules
- **Internal Processing (Thinking Loop):** ทุกครั้งที่ได้รับ Input เป็นภาษาไทย ให้ AI แปลข้อความและแนวคิดนั้นเป็นภาษาอังกฤษ (English) ในใจก่อน เพื่อใช้ในการค้นหาโค้ด วิเคราะห์ระบบ และประมวลผลตรรกะภายในกระบวนการคิด (Chain of Thought)
- **Code Commenting:** คอมเมนต์อธิบายตรรกะและชื่อตัวแปรภายในโค้ดที่สร้างขึ้นใหม่ ให้ใช้ภาษาอังกฤษ (English) ตามมาตรฐานสากล
- **Final Output:** เมื่อประมวลผลเสร็จสิ้น ให้แปลผลลัพธ์ สรุปคำแนะนำ และคำอธิบายทั้งหมดกลับมาตอบผู้ใช้เป็น ภาษาไทย (Thai) เสมอ

- **Before Modifying:** หากจำเป็นต้องแก้ไขไฟล์ระบบโครงสร้างหลัก (เช่น `middleware.ts` หรือ `supabaseClient.ts`) ให้แจ้งเตือนและอธิบายผลกระทบก่อนนำเสนอ Code Diff เสมอ
