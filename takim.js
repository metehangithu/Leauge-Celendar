let ligler = JSON.parse(localStorage.getItem('ligler')) || [];
let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];
let ligKotalari = JSON.parse(localStorage.getItem('ligKotalari')) || {}; // Her ligin özel takım sayısı saklanır
let sezonBasladi = JSON.parse(localStorage.getItem('sezonBasladi')) || false;

const ligSecimi = document.getElementById('ligSecimi');
const kotaAyarKutusu = document.getElementById('kotaAyarKutusu');
const hedefInput = document.getElementById('hedefInput');
const kotaKaydetBtn = document.getElementById('kotaKaydetBtn');
const sayac = document.getElementById('sayac');
const listeKonteyner = document.getElementById('eklenenTakimlarListesi');
const takimEkleBtn = document.getElementById('takimEkleBtn');

// 1. Ligleri dropdown'a dolduruyoruz
ligler.forEach(lig => {
    let option = document.createElement('option');
    let ligIsmi = typeof lig === 'object' ? lig.isim : lig;
    option.value = ligIsmi;
    option.textContent = ligIsmi;
    ligSecimi.appendChild(option);
});

// 2. Lig değiştiğinde görünümü ve kotayı ayarla
ligSecimi.addEventListener('change', function() {
    const secilenLig = ligSecimi.value;
    
    if (ligKotalari[secilenLig]) {
        // Lige önceden sayı girilmişse inputa yaz ve göster
        hedefInput.value = ligKotalari[secilenLig];
    } else {
        hedefInput.value = "";
    }

    kotaAyarKutusu.style.display = "block";
    takimlariListele();
});

// 3. Kullanıcı sol panelden lige özel Takım Sayısını Kaydettiğinde
kotaKaydetBtn.addEventListener('click', function() {
    if (sezonBasladi) {
        alert("Maçlar başladığı için ligin takım limitini değiştiremezsiniz!");
        return;
    }

    const secilenLig = ligSecimi.value;
    const girilenSayi = parseInt(hedefInput.value);

    if (!secilenLig) {
        alert("Lütfen önce bir lig seçiniz!");
        return;
    }

    if (!girilenSayi || girilenSayi < 2) {
        alert("Lütfen en az 2 olacak şekilde geçerli bir takım sayısı giriniz!");
        return;
    }

    const mevcutTakimSayisi = takimlar.filter(t => t.lig === secilenLig).length;
    if (girilenSayi < mevcutTakimSayisi) {
        alert(`Bu lige zaten ${mevcutTakimSayisi} takım eklediniz. Limiti eklenen takım sayısından daha küçük yapamazsınız!`);
        return;
    }

    // Lige özel kotayı kaydet
    ligKotalari[secilenLig] = girilenSayi;
    localStorage.setItem('ligKotalari', JSON.stringify(ligKotalari));

    alert(`${secilenLig} için takım sayısı ${girilenSayi} olarak belirlendi!`);
    takimlariListele();
});

// 4. Takımları Ekrana Basan ve Limit Kontrolü Yapan Fonksiyon
function takimlariListele() {
    const secilenLig = ligSecimi.value;

    if (!secilenLig) {
        sayac.textContent = "Lütfen sol panelden lig seçiniz";
        listeKonteyner.innerHTML = "";
        takimEkleBtn.disabled = true;
        return;
    }

    const hedefSayi = ligKotalari[secilenLig];
    const ilgiliTakimlar = takimlar.filter(t => t.lig === secilenLig);

    if (!hedefSayi) {
        sayac.textContent = "Lütfen bu ligin kaç takımlı olacağını girip Kaydet'e basın.";
        listeKonteyner.innerHTML = "";
        takimEkleBtn.disabled = true;
        return;
    }

    // Kota belirlendiyse takım ekleme butonunu aktif et
    takimEkleBtn.disabled = false;
    sayac.textContent = `${secilenLig} Takım Sayısı: ${ilgiliTakimlar.length} / ${hedefSayi}`;

    if (ilgiliTakimlar.length === 0) {
        listeKonteyner.innerHTML = "<p style='text-align:center; font-size:14px; opacity:0.7;'>Bu lige henüz takım eklenmedi.</p>";
        return;
    }

    listeKonteyner.innerHTML = ilgiliTakimlar.map((takim) => {
        const gercekIndex = takimlar.findIndex(t => t.ad === takim.ad && t.lig === takim.lig);
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 5px; border-radius: 4px; font-size: 14px;">
                <span><strong>${takim.ad}</strong></span>
                <button onclick="takimSil(${gercekIndex})" style="background: #d9534f; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">Sil</button>
            </div>
        `;
    }).join('');
}

// 5. Takım Silme İşlemi
window.takimSil = function(index) {
    if (sezonBasladi) {
        alert("Maçlar oynanmaya başladığı için takım silemezsiniz!");
        return;
    }

    const silinenTakim = takimlar[index].ad;
    takimlar.splice(index, 1);
    localStorage.setItem('takimlar', JSON.stringify(takimlar));
    takimlariListele();
};

// 6. Takım Ekleme İşlemi
document.getElementById('takimForm').addEventListener('submit', function(e) {
    e.preventDefault();

    if (sezonBasladi) {
        alert("Maçlar oynanmaya başladığı için yeni takım ekleyemezsiniz!");
        return;
    }

    const secilenLig = ligSecimi.value;
    const takimAdi = document.getElementById('takimAdi').value.trim().toLocaleUpperCase('tr-TR');
    const hedefSayi = ligKotalari[secilenLig];

    if (!secilenLig) {
        alert("Lütfen bir lig seçiniz!");
        return;
    }

    if (!hedefSayi) {
        alert("Lütfen önce sol panelden bu ligin kaç takımlı olacağını belirleyin!");
        return;
    }

    const ligdekiTakimSayisi = takimlar.filter(t => t.lig === secilenLig).length;
    if (ligdekiTakimSayisi >= hedefSayi) {
        alert(`Bu lig için belirlenen ${hedefSayi} takım sınırına ulaştınız! Daha fazla takım ekleyemezsiniz.`);
        return;
    }

    const takimVarmi = takimlar.some(t => t.ad === takimAdi && t.lig === secilenLig);
    if (takimVarmi) {
        alert("Bu takım bu lige zaten eklenmiş!");
        return;
    }

    let yeniTakim = {
        lig: secilenLig,
        ad: takimAdi,
        puan: 0,
        attigi: 0,
        yedigi: 0,
        averaj: 0
    };

    takimlar.push(yeniTakim);
    localStorage.setItem('takimlar', JSON.stringify(takimlar));

    document.getElementById('takimAdi').value = "";
    takimlariListele();
});

// 7. Fikstür Oluştur Butonuna Basıldığında Tam Sayı Kontrolü
document.querySelector('.devam-link').addEventListener('click', function(e) {
    const secilenLig = ligSecimi.value;

    if (!secilenLig) {
        e.preventDefault();
        alert("Lütfen bir lig seçiniz!");
        return;
    }

    const hedefSayi = ligKotalari[secilenLig];
    const ligdekiTakimSayisi = takimlar.filter(t => t.lig === secilenLig).length;

    if (!hedefSayi) {
        e.preventDefault();
        alert("Lütfen önce ligin kaç takımlı olacağını belirleyiniz!");
        return;
    }

    if (ligdekiTakimSayisi !== hedefSayi) {
        e.preventDefault();
        alert(`Fikstür oluşturabilmek için ${secilenLig} liginde TAM OLARAK ${hedefSayi} takım olmalıdır!\n\nMevcut Takım Sayısı: ${ligdekiTakimSayisi}\nEksik olan ${hedefSayi - ligdekiTakimSayisi} takımı tamamlamalısınız.`);
    }
});
