let ligler = JSON.parse(localStorage.getItem('ligler')) || [];
let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];

const ligSecimi = document.getElementById('ligSecimi');
const sayac = document.getElementById('sayac');
const listeKonteyner = document.getElementById('eklenenTakimlarListesi');

// Ligleri dropdown'a dolduruyoruz
ligler.forEach(lig => {
    let option = document.createElement('option');
    let ligIsmi = typeof lig === 'object' ? lig.isim : lig; 
    option.value = ligIsmi;       
    option.textContent = ligIsmi; 
    ligSecimi.appendChild(option);
});

// Seçilen lige ait takımları filtreleyip listeleme
function takimlariListele() {
    const secilenLig = ligSecimi.value;
    
    if(!secilenLig) {
        sayac.textContent = "Lütfen bir lig seçiniz";
        listeKonteyner.innerHTML = "";
        return;
    }

    // Sadece seçili lige ait takımları filtresini alıyoruz
    const ilgiliTakimlar = takimlar.filter(t => t.lig === secilenLig);
    
    sayac.textContent = `${secilenLig} Takım Sayısı: ${ilgiliTakimlar.length} / 20`;
    
    if (ilgiliTakimlar.length === 0) {
        listeKonteyner.innerHTML = "<p style='text-align:center; font-size:14px; opacity:0.7;'>Bu lige henüz takım eklenmedi.</p>";
        return;
    }

    listeKonteyner.innerHTML = ilgiliTakimlar.map((takim) => {
        // Ana dizideki gerçek indeksini buluyoruz (doğru takımı silebilmek için)
        const gercekIndex = takimlar.findIndex(t => t.ad === takim.ad && t.lig === takim.lig);
        
        return `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 8px; margin-bottom: 5px; border-radius: 4px; font-size: 14px;">
                <span><strong>${takim.ad}</strong></span>
                <button onclick="takimSil(${gercekIndex})" style="background: #d9534f; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer; font-size: 12px;">Sil</button>
            </div>
        `;
    }).join('');
}

// Lig seçimi değiştiğinde listeyi ve sayacı anında güncelle
ligSecimi.addEventListener('change', takimlariListele);

window.takimSil = function(index) {
    const silinenTakim = takimlar[index].ad;
    takimlar.splice(index, 1);
    localStorage.setItem('takimlar', JSON.stringify(takimlar));
    takimlariListele();
    alert(`${silinenTakim} listeden kaldırıldı.`);
}

document.getElementById('takimForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const secilenLig = ligSecimi.value;
    
    // Takım adını otomatik Türkçe BÜYÜK HARFE çeviriyoruz
    const takimAdi = document.getElementById('takimAdi').value.trim().toLocaleUpperCase('tr-TR');

    if(!secilenLig) {
        alert("Lütfen listeden bir lig seçiniz!");
        return;
    }

    if(!takimAdi) {
        alert("Lütfen bir takım adı giriniz!");
        return;
    }

    const ligdekiTakimSayisi = takimlar.filter(t => t.lig === secilenLig).length;
    if(ligdekiTakimSayisi >= 20) {
        alert("Bu lige maksimum 20 takım ekleyebilirsiniz!");
        return;
    }

    // Aynı takım var mı kontrolü
    const takimVarmi = takimlar.some(t => t.ad === takimAdi && t.lig === secilenLig);
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
    takimlariListele();
    alert(`${takimAdi} takımı ${secilenLig} ligine eklendi.`);
});
