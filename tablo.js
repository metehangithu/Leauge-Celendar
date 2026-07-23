let ligler = JSON.parse(localStorage.getItem('ligler')) || [];
let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];

const ligFiltre = document.getElementById('tabloLigFiltre');
const tbody = document.getElementById('puanTablosuBody');

// 1. Ligleri açılır kutuya doldur
ligler.forEach(lig => {
    let option = document.createElement('option');
    let ligIsmi = typeof lig === 'object' ? lig.isim : lig;
    option.value = ligIsmi;
    option.textContent = ligIsmi;
    ligFiltre.appendChild(option);
});

// Varsayılan olarak ilk lig seçili gelsin (varsa)
if (ligler.length > 0) {
    let ilkLig = typeof ligler[0] === 'object' ? ligler[0].isim : ligler[0];
    ligFiltre.value = ilkLig;
}

// 2. Tabloyu Seçili Lige Göre Çizen Fonksiyon
function tabloyuCiz() {
    const secilenLig = ligFiltre.value;

    if (!secilenLig) {
        tbody.innerHTML = `<tr><td colspan="6">Lütfen bir lig seçiniz.</td></tr>`;
        return;
    }

    // Sadece seçilen lige ait takımları filtrelere alıyoruz
    let ligTakimlari = takimlar.filter(t => t.lig === secilenLig);

    // Seçili ligin takımlarını Puan -> Averaj -> Attığı Gol sırasına göre diziyoruz
    ligTakimlari.sort((a, b) => {
        if (b.puan !== a.puan) return b.puan - a.puan;
        if (b.averaj !== a.averaj) return b.averaj - a.averaj;
        return b.attigi - a.attigi;
    });

    if (ligTakimlari.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6">Bu lige henüz takım eklenmedi.</td></tr>`;
    } else {
        tbody.innerHTML = ligTakimlari.map((takim, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${takim.ad}</strong></td>
                <td>${takim.attigi}</td>
                <td>${takim.yedigi}</td>
                <td>${takim.averaj}</td>
                <td><strong>${takim.puan}</strong></td>
            </tr>
        `).join('');
    }
}

// Lig seçimi değiştiğinde tabloyu anında yenile
ligFiltre.addEventListener('change', tabloyuCiz);

// Sayfa ilk açıldığında çalıştır
tabloyuCiz();
