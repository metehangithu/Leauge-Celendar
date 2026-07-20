const form = document.querySelector(".form");
const ligInput = document.querySelector("#ligAdi");

let ligler = JSON.parse(localStorage.getItem("ligler")) || [];

form.addEventListener("submit" ,function(e){
    e.preventDefault();
    
    // `.toLocaleUpperCase('tr-TR')` ile girilen lig adını otomatik Türkçe BÜYÜK HARFE çeviriyoruz
    const ligAdi = ligInput.value.trim().toLocaleUpperCase('tr-TR');

    if(ligAdi === ""){
        alert("Lütfen bir lig adı giriniz.");
        ligInput.focus();
        return;
    }

    // Aynı lig var mı kontrolü (Artık hepsi büyük harf olduğu için direkt eşitlik kontrolü yeterli)
    const ligVarmi = ligler.some(function(lig){
        const mevcutIsim = typeof lig === 'object' ? lig.isim : lig;
        return mevcutIsim === ligAdi;
    });

    if(ligVarmi){
        alert("Aynı Ligi girmeyiniz");
        ligInput.value = "";
        ligInput.focus();
        return;
    }

    const yeniLig = {
        id: ligler.length + 1,
        isim: ligAdi
    };

    ligler.push(yeniLig);
    localStorage.setItem("ligler", JSON.stringify(ligler));

    alert("Lig başarıyla eklendi.");
    ligInput.value = "";
    ligInput.focus(); 
});
