## Menjalankan Aplikasi

1. Pastikan MongoDB sudah berjalan di komputer Anda.
2. Buka terminal, arahkan ke direktori repositori, dan jalankan perintah `npm run dev` untuk menjalankan server.

Server akan berjalan di http://localhost:3000 secara default.

Silakan gunakan API ini sesuai dengan kebutuhan Anda.
dan untuk database sudah berada pada model tidak perlu membuat database secara manual.

### struktur directory
```sh
 project-directory
    │
    ├── node_modules
    ├── src
    │   ├── controllers
    │   │   └── authController.ts
    │   │   └── googleAuthController.ts
    │   │   └── userController.ts
    │   ├── middleware
    │   │   └── authMiddleware.ts
    │   ├── models
    │   │   └── dataDiriModel.ts
    │   │   └── otp.ts
    │   │   └── role.ts
    │   │   └── user.ts
    │   ├── routes
    │   │   └── authRoutes.ts
    │   ├── services
    │   │   └── authService.ts
    │   │   └── emailService.ts
    │   ├── strategies
    │   │   └── jwtStrategy.ts
    │   │   └── localStrategy.ts
    │   ├── utils
    │   │   └── roleUtils.ts
    │   │   └── userUtilis.ts
    │   └── app.ts
    ├── .env
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    ├── readme.md
    └── tsconfig.json
```
### Endpoints
```sh
- **POST /api/auth/v1/register**: Mendaftarkan pengguna baru.
- **POST /api/auth/v1/login**: Masuk dengan username dan password.
- **POST /api/auth/v1/oauth**: Masuk dengan akun Google.
- **POST /api/auth/v1/verify-otp**: verifikasi email.
- **POST /api/auth/v1/regenerate-otp**: mengirin ulang OTP.
- **GET /api/auth/v1/refresh**: Memperbarui token akses.
- **GET /api/auth/v1/logout**: Keluar dari sistem.
```
### Format Json
```sh
1. **Register**
   {
   "email": "example@gmail.com",
   "username": "exampsleuser",
   "password": "password123"
   }

2. **Login**
   {
   "email": "example@gmail.com",
   "password": "password123"
   }

3. **verify-otp**
   {
   "email": "example@gmail.com",
   "otp": "123456"
   }

4. **regenerate OTP**
   {
   "email": "example@gmail.com"
   }
```
