// Variabel Game
let skor = 0;
let streak = 0;
let nyawa = 3;
let level = 1; // 1 = Kelas 1-2, 2 = Kelas 3-4, 3 = Kelas 5-6
let jawabanBenar = 0;

// Daftar Emoji untuk Ilustrasi Visual
const daftarEmoji = ["🍎", "🍌", "⭐", "🎈", "🚗", "🐱", "🍩", "🚀", "⚽", "🍓"];

// Elemen DOM
const elSkor = document.getElementById("skor");
const elStreak = document.getElementById("streak");
const elNyawa = document.getElementById("nyawa");
const elIlustrasi = document.getElementById("ilustrasi-box");
const elSoal = document.getElementById("soal");
const inputJawaban = document.getElementById("jawaban");
const btnCek = document.getElementById("btn-cek");
const elHasil = document.getElementById("hasil");
const quizArea = document.getElementById("quiz-area");
const gameOverArea = document.getElementById("game-over-area");
const elSkorAkhir = document.getElementById("skor-akhir");
const btnRestart = document.getElementById("btn-restart");
const lvlButtons = document.querySelectorAll(".lvl-btn");

// Efek Suara Sintetis (Tanpa perlu file audio eksternal)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function mainkanSuara(tipe) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (tipe === "benar") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // Nada C5
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // Nada E5
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
    } else if (tipe === "salah") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    }
}

// Pilih Level Kelas
lvlButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        lvlButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        level = parseInt(btn.getAttribute("data-level"));
        buatSoal();
    });
});

// Fungsi Membuat Soal & Ilustrasi
function buatSoal() {
    let a, b, op;
    const emojiAcak = daftarEmoji[Math.floor(Math.random() * daftarEmoji.length)];
    elIlustrasi.innerHTML = ""; // Bersihkan ilustrasi lama

    if (level === 1) {
        // KELAS 1-2: Penjumlahan & Pengurangan (Angka 1 - 10) + Ilustrasi Emoji
        const isTambah = Math.random() > 0.4;
        if (isTambah) {
            a = Math.floor(Math.random() * 8) + 1;
            b = Math.floor(Math.random() * 8) + 1;
            op = "+";
            jawabanBenar = a + b;
            elIlustrasi.innerHTML = `
                <div class="grup-emoji">${emojiAcak.repeat(a)}</div>
                <div>➕</div>
                <div class="grup-emoji">${emojiAcak.repeat(b)}</div>
            `;
        } else {
            a = Math.floor(Math.random() * 8) + 5;
            b = Math.floor(Math.random() * 4) + 1;
            op = "-";
            jawabanBenar = a - b;
            elIlustrasi.innerHTML = `
                <div class="grup-emoji">${emojiAcak.repeat(a)}</div>
                <div>➖ ${b} diambil</div>
            `;
        }
    } else if (level === 2) {
        // KELAS 3-4: Perkalian dasar & Tambah/Kurang puluhan
        const jenis = Math.floor(Math.random() * 3);
        if (jenis === 0) {
            a = Math.floor(Math.random() * 9) + 2;
            b = Math.floor(Math.random() * 9) + 2;
            op = "×";
            jawabanBenar = a * b;
            elIlustrasi.innerHTML = `<span style="font-size:16px;">💡 Tips: Hitung ${a} kelompok berisi masing-masing ${b} ${emojiAcak}</span>`;
        } else if (jenis === 1) {
            a = Math.floor(Math.random() * 40) + 15;
            b = Math.floor(Math.random() * 40) + 10;
            op = "+";
            jawabanBenar = a + b;
            elIlustrasi.innerHTML = `<span style="font-size:16px;">💡 Jumlahkan puluhannya dulu, baru satuannya!</span>`;
        } else {
            a = Math.floor(Math.random() * 50) + 30;
            b = Math.floor(Math.random() * 25) + 5;
            op = "-";
            jawabanBenar = a - b;
            elIlustrasi.innerHTML = `<span style="font-size:16px;">💡 Kurangkan perlahan dari angka belakang ya!</span>`;
        }
    } else {
        // KELAS 5-6: Pembagian, Perkalian besar, & Campuran
        const jenis = Math.floor(Math.random() * 2);
        if (jenis === 0) {
            b = Math.floor(Math.random() * 10) + 3;
            jawabanBenar = Math.floor(Math.random() * 12) + 2;
            a = b * jawabanBenar; // Memastikan hasil bagi selalu bulat
            op = "÷";
            elIlustrasi.innerHTML = `<span style="font-size:16px;">💡 Ada ${a} ${emojiAcak} dibagi rata ke ${b} kotak. Isi per kotak?</span>`;
        } else {
            a = Math.floor(Math.random() * 15) + 11;
            b = Math.floor(Math.random() * 12) + 4;
            op = "×";
            jawabanBenar = a * b;
            elIlustrasi.innerHTML = `<span style="font-size:16px;">💡 Tantangan Perkalian Cepat!</span>`;
        }
    }

    elSoal.textContent = `${a} ${op} ${b} = ?`;
    inputJawaban.value = "";
    inputJawaban.focus();
}

// Update Tampilan Status Bar
function updateStatus() {
    elSkor.textContent = skor;
    elStreak.textContent = streak;
    elNyawa.textContent = "❤️".repeat(nyawa) + "🖤".repeat(3 - nyawa);
}

// Cek Jawaban
function cekJawaban() {
    const val = parseInt(inputJawaban.value);
    if (isNaN(val)) {
        elHasil.textContent = "Ketik angkanya dulu ya! 😅";
        elHasil.style.color = "#e67e22";
        return;
    }

    if (val === jawabanBenar) {
        mainkanSuara("benar");
        streak++;
        // Bonus poin kalau streak tinggi & level tinggi
        const poinDapat = (10 * level) + (streak * 2);
        skor += poinDapat;
        
        elHasil.textContent = `Benar! +${poinDapat} Poin 🎉`;
        elHasil.style.color = "#0ca86c";
        updateStatus();

        // Otomatis lanjut ke soal berikutnya setelah 0.8 detik
        setTimeout(() => {
            elHasil.textContent = "";
            buatSoal();
        }, 800);

    } else {
        mainkanSuara("salah");
        streak = 0;
        nyawa--;
        updateStatus();

        // Efek getar pada kotak kuis
        const container = document.getElementById("app-container");
        container.classList.add("shake");
        setTimeout(() => container.classList.remove("shake"), 400);

        if (nyawa <= 0) {
            // Game Over
            quizArea.style.display = "none";
            gameOverArea.style.display = "block";
            elSkorAkhir.textContent = skor;
        } else {
            elHasil.textContent = `Kurang tepat! Coba lagi ya 💪`;
            elHasil.style.color = "#e74c3c";
            inputJawaban.value = "";
            inputJawaban.focus();
        }
    }
}

// Restart Game
btnRestart.addEventListener("click", () => {
    skor = 0;
    streak = 0;
    nyawa = 3;
    updateStatus();
    elHasil.textContent = "";
    gameOverArea.style.display = "none";
    quizArea.style.display = "block";
    buatSoal();
});

btnCek.addEventListener("click", cekJawaban);
inputJawaban.addEventListener("keypress", (e) => {
    if (e.key === "Enter") cekJawaban();
});

// Mulai Game Pertama Kali
updateStatus();
buatSoal();