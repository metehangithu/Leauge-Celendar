let ligler = JSON.parse(localStorage.getItem('ligler')) || [];
let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];

const ligSecimi = document.getElementById('fiksturLigSecimi');
const macKurmaAlani = document.getElementById('macKurmaAlani');
const evSahibiSelect = document.getElementById('evSahibiSelect');
const deplasmanSelect = document.getElementById('deplasmanSelect');
const evSkorInput = document.getElementById('evSkorInput');
const depSkorInput = document.getElementById('depSkorInput');
const macEkleBtn = document.getElementById('macEkleBtn');
const eklenenMaclarListesi = document.getElementById('eklenenMaclarListesi');
const kaydetBtn = document.getElementById('sonuclariKaydetBtn');

let eklenenMaclar = [];

// 1. Ligleri açılır kutuya doldur
ligler.forEach(lig => {
    let option = document.createElement('option');
    let ligIsmi = typeof lig === 'object' ? lig.isim : lig;
    option.value = ligIsmi;
    option.textContent = ligIsmi;
    ligSecimi.appendChild(option);
});

// 2. Lig değiştiğinde kontrol et ve sıfırla
ligSecimi.addEventListener('change', function() {
    eklenenMaclar = [];
    dropdownlariGuncelle();
});

// KRİTİK FONKSİYON: Çift Sayı Kontrolü & Maç Yapan Takımları Düşme
function dropdownlariGuncelle() {
    const secilenLig = ligSecimi.value;
    if(!secilenLig) return;

    const tumLigTakimlari = takimlar.filter(t => t.lig === secilenLig);

    // 1. KONTROL: En az 2 takım olmalı
    if(tumLigTakimlari.length < 2) {
        alert("Fikstür oluşturabilmek için bu lige en az 2 takım eklemiş olmalısınız!");
        macKurmaAlani.style.display = "none";
        return;
    }

    // 2. KONTROL (Senin İstediğin Kural): Takım sayısı ÇİFT olmak zorunda!
    if(tumLigTakimlari.length % 2 !== 0) {
        alert(`Sistemde Aksam Eşleşme Olmaması İçin Takım Sayısı ÇİFT Olmalıdır!\n\nSeçilen ligdeki mevcut takım sayısı: ${tumLigTakimlari.length}\nLütfen Takım Ekleme sayfasına dönüp 1 takım daha ekleyin veya çıkarın.`);
        macKurmaAlani.style.display = "none";
        // Takım ekleme sayfasına geri yönlendiriyoruz
        window.location.href = "takim.html";
        return;
    }

    // O anki listede maçı olan takımların isimlerini topluyoruz
    const maciOlanTakimlar = [];
    eklenenMaclar.forEach(m => {
        maciOlanTakimlar.push(m.ev);
        maciOlanTakimlar.push(m.dep);
    });

    // Sadece henüz maçı olmayan takımları filtreliyoruz
    const musaitTakimlar = tumLigTakimlari.filter(t => !maciOlanTakimlar.includes(t.ad));

    // Dropdownları temizle
    evSahibiSelect.innerHTML = "";
    deplasmanSelect.innerHTML = "";

    // Müsait takım kalmadığında (Tüm eşleşmeler bittiğinde)
    if(musaitTakimlar.length === 0) {
        evSahibiSelect.innerHTML = "<option>Tüm takımlar eşleşti</option>";
        deplasmanSelect.innerHTML = "<option>Tüm takımlar eşleşti</option>";
        evSahibiSelect.disabled = true;
        deplasmanSelect.disabled = true;
        macEkleBtn.disabled = true;
    } else {
        evSahibiSelect.disabled = false;
        deplasmanSelect.disabled = false;
        macEkleBtn.disabled = false;

        musaitTakimlar.forEach(takim => {
            let opt1 = document.createElement('option');
            opt1.value = takim.ad;
            opt1.textContent = takim.ad;
            evSahibiSelect.appendChild(opt1);

            let opt2 = document.createElement('option');
            opt2.value = takim.ad;
            opt2.textContent = takim.ad;
            deplasmanSelect.appendChild(opt2);
        });

        // İkinci seçenekte varsayılan olarak farklı bir takım seçili gelsin
        if(deplasmanSelect.options.length > 1) {
            deplasmanSelect.selectedIndex = 1;
        }
    }

    macKurmaAlani.style.display = "block";
    listeyiGuncelle();
}

// 3. Kullanıcı "Maçı Fikstüre Ekle" butonuna bastığında
macEkleBtn.addEventListener('click', function() {
    const evTakim = evSahibiSelect.value;
    const depTakim = deplasmanSelect.value;
    const evSkor = parseInt(evSkorInput.value) || 0;
    const depSkor = parseInt(depSkorInput.value) || 0;

    if(evTakim === depTakim) {
        alert("Bir takım kendisiyle maç yapamaz! Lütfen farklı takımlar seçin.");
        return;
    }

    eklenenMaclar.push({
        lig: ligSecimi.value,
        ev: evTakim,
        dep: depTakim,
        evSkor: evSkor,
        depSkor: depSkor
    });

    evSkorInput.value = 0;
    depSkorInput.value = 0;

    // Seçilen takımları dropdown'dan düşürmek için tekrar çağırıyoruz
    dropdownlariGuncelle();
});

// 4. Eklenen maçları ekranda listeleme
function listeyiGuncelle() {
    eklenenMaclarListesi.innerHTML = "";

    if(eklenenMaclar.length === 0) {
        kaydetBtn.style.display = "none";
        return;
    }

    eklenenMaclar.forEach((mac, index) => {
        const div = document.createElement('div');
        div.style.cssText = "display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; margin-bottom:5px; border-radius:5px; color:white; font-size:14px;";
        
        div.innerHTML = `
            <span><strong>${mac.ev}</strong> ${mac.evSkor} - ${mac.depSkor} <strong>${mac.dep}</strong></span>
            <button onclick="macSil(${index})" style="background:#d9534f; color:white; border:none; padding:3px 8px; border-radius:3px; cursor:pointer;">Sil</button>
        `;
        eklenenMaclarListesi.appendChild(div);
    });

    kaydetBtn.style.display = "block";
}

// Listeden maç silindiğinde takımları tekrar havuza katma
window.macSil = function(index) {
    eklenenMaclar.splice(index, 1);
    dropdownlariGuncelle();
}

// 5. Sonuçları veritabanına işleme ve Tabloya fırlatma
kaydetBtn.addEventListener('click', function() {
    eklenenMaclar.forEach(mac => {
        let evObj = takimlar.find(t => t.ad === mac.ev && t.lig === mac.lig);
        let depObj = takimlar.find(t => t.ad === mac.dep && t.lig === mac.lig);

        if(evObj && depObj) {
            evObj.attigi += mac.evSkor;
            evObj.yedigi += mac.depSkor;
            evObj.averaj = evObj.attigi - evObj.yedigi;

            depObj.attigi += mac.depSkor;
            depObj.yedigi += mac.evSkor;
            depObj.averaj = depObj.attigi - depObj.yedigi;

            if(mac.evSkor > mac.depSkor) {
                evObj.puan += 3;
            } else if(mac.depSkor > mac.evSkor) {
                depObj.puan += 3;
            } else {
                evObj.puan += 1;
                depObj.puan += 1;
            }
        }
    });

    localStorage.setItem('takimlar', JSON.stringify(takimlar));
    alert("Oynanan tüm maçlar işlendi! Puan durumuna aktarılıyorsunuz.");
    window.location.href = "tablo.html";
});