/**
 * Valid "Enterprise" asset that significantly boosts token count.
 */
export const DICTIONARY_ID = {
    common: {
        welcome: "Selamat Datang di K'Lontong",
        loading: "Memuat sistem...",
        error: "Terjadi kesalahan sistem",
        success: "Operasi berhasil",
        save: "Simpan Perubahan",
        cancel: "Batalkan",
        delete: "Hapus Data",
        edit: "Ubah Data",
        view: "Lihat Detail",
        search: "Cari data...",
        filter: "Filter Data",
        export: "Ekspor ke CSV",
        import: "Impor dari CSV",
        back: "Kembali",
        next: "Selanjutnya",
        finish: "Selesai",
        close: "Tutup",
        confirm: "Konfirmasi",
        deny: "Tolak",
        auth_required: "Autentikasi Diperlukan",
        session_expired: "Sesi Berakhir",
        network_error: "Gagal terhubung ke jaringan",
        offline_mode: "Mode Offline Aktif",
        online_mode: "Mode Online Aktif",
        syncing: "Menyinkronkan data...",
        synced: "Data tersinkronisasi"
    },
    modules: {
        pos: {
            title: "Kasir Pintar",
            scan_barcode: "Scan Barcode",
            voice_cmd: "Perintah Suara",
            cart_empty: "Keranjang kosong",
            checkout: "Bayar Sekarang",
            hold: "Tahan Transaksi",
            recall: "Panggil Transaksi",
            discount: "Diskon Manual",
            receipt: "Cetak Struk",
            payment_methods: {
                cash: "Tunai",
                qris: "QRIS Dinamis",
                transfer: "Transfer Bank",
                credit: "Kasbon / Utang"
            }
        },
        inventory: {
            title: "Manajemen Stok",
            sku: "Kode SKU",
            name: "Nama Barang",
            stock: "Stok Fisik",
            cogs: "Harga Modal",
            price: "Harga Jual",
            margin: "Margin Keuntungan",
            supplier: "Pemasok Utama",
            status: {
                critical: "Stok Kritis",
                warning: "Menipis",
                healthy: "Aman",
                overstock: "Berlebih"
            }
        },
        analytics: {
            title: "Analisa Bisnis",
            revenue: "Pendapatan Kotor",
            profit: "Keuntungan Bersih",
            expense: "Pengeluaran Operasional",
            tax: "Estimasi Pajak",
            fraud: "Deteksi Kecurangan",
            growth: "Pertumbuhan Bulanan"
        },
        legal: {
            terms: "Syarat dan Ketentuan Penggunaan...",
            privacy: "Kebijakan Privasi Data...",
            disclaimer: "Penafian Tanggung Jawab..."
        }
    },
    errors: {
        e404: "Halaman tidak ditemukan",
        e500: "Kesalahan server internal",
        e403: "Akses ditolak",
        validation: {
            required: "Kolom ini wajib diisi",
            email: "Format email tidak valid",
            phone: "Nomor telepon tidak valid",
            numeric: "Harus berupa angka"
        }
    }
};
