let takimlar = JSON.parse(localStorage.getItem('takimlar')) || [];

    // Takımları önce Puana, sonra Averaja göre büyükten küçüğe sıralıyoruz
    takimlar.sort((a, b) => {
        if (b.puan !== a.puan) {
            return b.puan - a.puan;
        }
        return b.averaj - a.averaj;
    });

    const tbody = document.getElementById('puanTablosuBody');
    
    if(takimlar.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7">Henüz hiç takım eklenmedi.</td></tr>`;
    } else {
        tbody.innerHTML = takimlar.map((takim, index) => `
            <tr>
                <td>${index + 1}</td>
                <td><strong>${takim.ad}</strong></td>
                <td>${takim.lig}</td>
                <td>${takim.attigi}</td>
                <td>${takim.yedigi}</td>
                <td>${takim.averaj}</td>
                <td><strong>${takim.puan}</strong></td>
            </tr>
        `).join('');
    }