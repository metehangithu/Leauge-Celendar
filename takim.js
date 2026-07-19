let ligler = JSON.parse(localStorage.getItem('ligler')) || [];
let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];

const ligSecimi = document.getElementById('ligSecimi');
const sayac = document.getElementById('sayac');
const listeKonteyner = document.getElementById('eklenenTakimlarListesi'); // Yeni alan

// 1. Sayfadan gelen ligleri select kutusuna dolduruyoruz
ligler.forEach(lig => {
    let option = document.createElement('option');
    let ligIsmi = typeof lig === 'object' ? lig.isim : lig; 

    option.value = ligIsmi;       
    option.textContent = ligIsmi; 
    ligSecimi.appendChild(option);
});

// EKLEME: Takımları ekranda silme butonuyla birlikte listeleyen fonksiyon
function takimlariListele() {
    sayac.textContent = `Eklenen Takım: ${takimlar.length} / 18`;
    
    if (takimlar.length === 0) {
        listeKonteyner.innerHTML = "<p style='text-align:center; font-size:14px; opacity:0.7;'>Henüz takım eklenmedi.</p>";
        return;
    }

    // Her takımı listelerken yanına silme fonksiyonunu tetikleyen bir buton koyuyoruz
    listeKonteyner.innerHTML = takimlar.map((takim, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 5px; border-radius: 4px; font-size: 14px;">
            <span><strong>${takim.ad}</strong> (${takim.lig})</span>
            <button onclick="takimSil(${index})" style="background: #d9534f; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">Sil</button>
        </div>
    `).join('');
}

// EKLEME: Listeden takım silme fonksiyonu
window.takimSil = function(index) {
    const silinenTakim = takimlar[index].ad;
    takimlar.splice(index, 1); // Seçilen indeksteki takımı diziden çıkarır
    localStorage.setItem('takimlar', JSON.stringify(takimlar)); // Hafızayı güncelle
    takimlariListele(); // Listeyi ekranda yenile
    alert(`${silinenTakim} listeden kaldırıldı.`);
}

// Sayfa ilk açıldığında halihazırda ekli takımlar varsa listelesin
takimlariListele();

document.getElementById('takimForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const secilenLig = ligSecimi.value;
    const takimAdi = document.getElementById('takimAdi').value.trim();

    if(!secilenLig) {
        alert("Lütfen listeden bir lig seçiniz!");
        return;
    }
    
    if(takimlar.length >= 18) {
        alert("Maksimum 18 takım ekleyebilirsiniz!");
        return;
    }

    // Aynı ligde aynı isimde takım olmasın kontrolü (opsiyonel ama iyi olur)
    const takimVarmi = takimlar.some(t => t.ad.toLowerCase() === takimAdi.toLowerCase() && t.lig === secilenLig);
    if(takimVarmi) {
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
    takimlariListele(); // Listeyi güncelle
    alert(`${takimAdi} takımı ${secilenLig} ligine başarıyla eklendi.`);
});