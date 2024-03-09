
## Menjalankan Aplikasi

1. Pastikan MongoDB sudah berjalan di komputer Anda.
2. Buka terminal, arahkan ke direktori repositori, dan jalankan perintah `npm run dev` untuk menjalankan server.

Server akan berjalan di http://localhost:3000 secara default.

### Endpoints

- **POST /api/auth/v1/register**: Mendaftarkan pengguna baru.
- **POST /api/auth/v1/login**: Masuk dengan username dan password.
- **POST /api/auth/v1/oauth**: Masuk dengan akun Google.
- **GET /api/auth/v1/refresh**: Memperbarui token akses.
- **GET /api/auth/v1/logout**: Keluar dari sistem.

Silakan gunakan API ini sesuai dengan kebutuhan Anda.
