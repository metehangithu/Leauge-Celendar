const HAZIR_LIGLER = [
    { isim: "SUPER LIG" , bayrak : "https://flagcdn.com/w40/tr.png" },
     { isim: "PREMIER LIG" , bayrak : "https://flagcdn.com/w40/gb-eng.png" },
    { isim: "LA LIGA" , bayrak : "https://flagcdn.com/w40/es.png" },
    { isim: "SERI A" , bayrak : "https://flagcdn.com/w40/it.png" },
   { isim: "BUNDESLIGA" , bayrak : "https://flagcdn.com/w40/de.png" },
    { isim: "LIGUE 1" , bayrak : "https://flagcdn.com/w40/fr.png" },
     { isim: "EREDIVISIE" , bayrak : "https://flagcdn.com/w40/nl.png" },
      { isim: "PRIMEIRA LIGA" , bayrak : "https://flagcdn.com/w40/pt.png" },
       { isim: "MLS" , bayrak : "https://flagcdn.com/w40/us.png" },
          { isim: "SAUDI PRO LEAGUE" , bayrak : "https://flagcdn.com/w40/sa.png" }
];

let ligler = JSON.parse(localStorage.getItem(`ligler`)) || [];

const form = document.getElementById(`ligForm`);
const hazirligSelect = document.getElementById(`hazirLiglerSelect`);
const eklenenLiglerlistesi = document.getElementById(`eklenenLiglerListesi`);

//Dropdown'ı ilk açılışta doldurmak için
function selectDoldur(){
  hazirLiglerSelect.innerHTML = `<option value=""disabled selected>Bir Lig Seçiniz</option>`;
  HAZIR_LIGLER.forEach(lig=>{
    let option = document.createElement(`option`);
    option.value = lig.isim;
    const eklendiMi = ligler.some(l => l.isim ===lig.isim);
    if(eklendiMi){
        option.disabled = true;
        option.textContent = `${lig.isim} (Eklendi)`;
    }else{
        option.textContent = lig.isim;
    }
    hazirLiglerSelect.appendChild(option);
  });
}

function ligleriListele() {
    eklenenLiglerListesi.innerHTML = "";

    if (ligler.length === 0) {
        eklenenLiglerListesi.innerHTML = "<p style='color: white; opacity: 0.7; text-align: center; font-size: 14px;'>Henüz bir lig seçilmedi.</p>";
    } else {
        ligler.forEach((lig, index) => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 8px 12px; margin-bottom: 8px; border-radius: 6px; color: white; font-size: 14px;";
            
            div.innerHTML = `
                <span style="display: flex; align-items: center; gap: 10px;">
                    <img src="${lig.bayrak}" alt="bayrak" style="width: 24px; height: 16px; border-radius: 2px; object-fit: cover;">
                    <strong>${lig.isim}</strong>
                </span>
                <button onclick="ligSil(${index})" style="background: #d9534f; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px;">Sil</button>
            `;
            eklenenLiglerListesi.appendChild(div);
        });
    }

    selectDoldur();
}

//Form gönderildiğinde 
form.addEventListener(`submit`, function(e){
    e.preventDefault();
    const secilenIsim = hazirLiglerSelect.value;
    if(!secilenIsim){
        alert("Lütfen geçerli bir lig seçiniz!!!");
        return;
    }
const ligObjesi = HAZIR_LIGLER.find(l => l.isim === secilenIsim);

const yeniLig = {
id : Date.now(),
isim: ligObjesi.isim,
bayrak: ligObjesi.bayrak
};
ligler.push(yeniLig);
localStorage.setItem(`ligler`,JSON.stringify(ligler));
ligleriListele();
});

//Silme Fonksiyonu 
window.ligSil = function(index){
    const silinen = ligler[index];
    ligler.splice(index,1);
    localStorage.setItem(`ligler`,JSON.stringify(ligler))


// O lige ait takımları da temizle
    let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];
    takimlar = takimlar.filter(t => t.lig !== silinen.isim);
    localStorage.setItem('takimlar', JSON.stringify(takimlar));

    ligleriListele();
};
// İlk Açılış
ligleriListele();

let sezonBasladi = JSON.parse(localStorage.getItem('sezonBasladi')) || false;

// Eğer sezon başladıysa yeni lig eklenmesini engelle
if (sezonBasladi) {
    document.getElementById('ligForm').querySelector('button').disabled = true;
    document.getElementById('ligForm').querySelector('button').textContent = "Sezon Başladı (Ligler Kilitli)";
}

// Lig Silme Fonksiyonunda Kilit Kontrolü
window.ligSil = function(index) {
    if (sezonBasladi) {
        alert("Maçlar oynanmaya başladığı için lig silemezsiniz!");
        return;
    }

    const silinen = ligler[index];
    ligler.splice(index, 1);
    localStorage.setItem('ligler', JSON.stringify(ligler));
    
    let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];
    takimlar = takimlar.filter(t => t.lig !== silinen.isim);
    localStorage.setItem('takimlar', JSON.stringify(takimlar));

    ligleriListele();
};
