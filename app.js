const form = document.querySelector(".form");
const ligInput = document.querySelector("#ligAdi");

let ligler = JSON.parse(localStorage.getItem("ligler")) || [];

form.addEventListener("submit" ,function(e){
    e.preventDefault();
    const ligAdi = ligInput.value.trim();

    // Boş mu giriliyor diye bir kontrol mekanizması
    if(ligAdi === ""){
        alert("Lütfen bir lig adı giriniz.");
        ligInput.focus();
        return;
    }

    // Aynı ligden var mı yok mu kontrolü
    const ligVarmi = ligler.some(function(lig){
        return lig.isim.toLowerCase() === ligAdi.toLowerCase();
    });

    if(ligVarmi){
        alert("Aynı Ligi girmeyiniz");
        ligInput.value = ""; // Aynı lig girildiğinde kutuyu temizler
        ligInput.focus();
        return;
    }

    const yeniLig = {
        id: ligler.length + 1,
        isim: ligAdi
    };

    ligler.push(yeniLig);

    // Storage'a kaydet
    localStorage.setItem("ligler", JSON.stringify(ligler));

    console.log(ligler);

    alert("Lig başarıyla eklendi.");

    // Başarılı eklemeden sonra kutuyu temizler ve odaklar
    ligInput.value = "";
    ligInput.focus(); 
});