# How to clone 
git clone https://github.com/kkkkhxx/OrganicNow.git
cd organicnow
npm install 
npm run dev 


_____________________________________________________
## 🔹 Workflow การทำงานกับ Branch
### 1. Clone & สร้าง Branch ใหม่
```bash
git clone https://github.com/kkkkhxx/OrganicNow.git
cd OrganicNow
git checkout -b my-new-branch
git push -u origin my-new-branch


2. ทำงานใน Branch ของเรา


3. บันทึกงาน (Commit)
git add .
git commit -m "เพิ่มหน้า login"


4. ส่งขึ้น GitHub (Push)
git push
📌 รอบแรกใช้ git push -u origin my-new-branch
📌 หลังจากนั้น push ครั้งต่อ ๆ ไป แค่ git push ก็พอ



5. ทำงานต่อ – Commit/Push ได้เรื่อย ๆ
ทุกครั้งที่ทำงานเสร็จเป็นส่วน ๆ ให้ commit แล้ว push ขึ้นไป
ไม่จำเป็นต้องรอ “เสร็จทั้งโปรเจค” ค่อย push
ใช้ commit/push เป็น checkpoint บันทึกการทำงาน
