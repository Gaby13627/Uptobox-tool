const axios = require('axios')
const fs = require('fs');
axios.defaults.adapter = require('axios/lib/adapters/http');
Onglet1 = fs.readFileSync(__dirname + '/src/Ong1.html').toString()
Onglet2 = fs.readFileSync(__dirname + '/src/Ong2.html').toString()
Onglet3 = fs.readFileSync(__dirname + '/src/Ong3.html').toString()
ong1 = document.getElementById('a1');
ong2 = document.getElementById('a2');
ong3 = document.getElementById('a3');
contenu = document.getElementById('content-img');
const { Renomer, Remplacer, dossier } = require(__dirname + '/src/function')
const { dialog } = require('electron').remote
alert = function(str){
    var options = {
      buttons: ["Ok"],
      message: str,
    }
    dialog.showMessageBoxSync(null,options)
  }

contenu.innerHTML = Onglet1;

Onglet1function()

function nonactive() {
    ong1.className = null;
    ong2.className = null;
    ong3.className = null;
}

function active(moi) {
    nonactive(); // nettoyage
    moi.className = "active"; // je deviens active
}

ong1.addEventListener("click", function () {
    contenu.innerHTML = Onglet1;
    active(this);
    BoutonCheckToken = document.getElementById("BToken")
    BoutonCheckToken.addEventListener('click', event => {
        tokencheck()
    })
    Onglet1function()
})

ong2.addEventListener("click", function () {
    contenu.innerHTML = Onglet2;
    console.log('test')
    active(this);
    Boutonvaliderdossier = document.getElementById('DossierValider')
    Zonedetextedossier = document.getElementById('Dossier')
    Resultdossier = document.getElementById('result')
    console.log("test2")
    Boutonvaliderdossier.addEventListener('click', function (){
        if (Zonedetextedossier.value === "") return alert('Veuiller rentrer un lien de dossier correcte')
        LienDossier = Zonedetextedossier.value
        dossier(LienDossier, Resultdossier)
    })
})

ong3.addEventListener("click", function () {
    contenu.innerHTML = Onglet3;
    active(this);
})

BoutonCheckToken.addEventListener('click', function () {
    tokencheck()
})

async function tokencheck() {
    Tokentt = document.getElementById("Token")
    console.log(Tokentt.value)
    tokenVerif = await axios({
        method: 'get',
        url: `https://uptobox.com/api/user/me?token=${Tokentt.value}`,
    });
    tokenVerif.data.message === "Success" ? document.getElementById('Token').style.backgroundColor = '#c6efce' : document.getElementById('Token').style.backgroundColor = '#ffc7ce'
}

function Onglet1function() {
    Tokentt = document.getElementById("Token")
    textarea = document.getElementById('textarea')
    linkcount = document.getElementById('linkcount')
    Clearbutton = document.getElementById('ClearB')
    Saisonbutton = document.getElementById('SaiB')
    AncienSai = document.getElementById('Ancien-Nom-Sa')
    TypeSai = document.getElementById('Type-Sa')
    Saisoncheck = document.getElementById('Saisoncheck')
    rad = document.getElementsByName("fichier");
    AncienNomEp = document.getElementById('Ancien-Nom-Ep')
    AncienTypeNum = document.getElementById('Type-Num')
    Anciencaractere = document.getElementById('Ancien-caractere')
    Nouveaucaractere = document.getElementById('Nouveau-caractere')
    BoutonCheckToken = document.getElementById("BToken")
    BoutonValider = document.getElementById("Valider")
    Extensioncheck = document.getElementById("Extension")
    Prefixezone = document.getElementById("Prefix")
    Interzone = document.getElementById('Inter')
    Suffixezone = document.getElementById('Suffixe')

    textarea.addEventListener("keyup", function () {
        var nbligne = textarea.value.split("\n").filter(item => item);
        nbligne.length > 1 ? linkcount.innerText = nbligne.length + " Liens" : linkcount.innerText = nbligne.length + " Lien"
    })

    Clearbutton.addEventListener("click", function () {
        textarea.value = ""
        linkcount.innerText = "0 Lien"
    })
    Saisonbutton.addEventListener("change", function () {
        if (this.checked) {
            AncienSai.disabled = false
            TypeSai.disabled = false
            Saisoncheck.checked = true
        } else {
            AncienSai.disabled = true
            TypeSai.disabled = true
            Saisoncheck.checked = false
        }
    })
    VarRemplacer = true
    var prev = null;
    for (var i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', function () {
            if (this !== prev) prev = this
            if (this.value === "Renomer") {
                VarRemplacer = true
                AncienNomEp.disabled = false
                AncienTypeNum.disabled = false
                Anciencaractere.disabled = true
                Nouveaucaractere.disabled = true
            } else {
                VarRemplacer = false
                AncienNomEp.disabled = true
                AncienTypeNum.disabled = true
                Anciencaractere.disabled = false
                Nouveaucaractere.disabled = false
            }
        });
    }

    BoutonValider.addEventListener("click", function () {
        console.log("Cliquer")
        if (Tokentt.value === "") return alert("Veuillez spécifier Un Token")
        if (textarea.value === "") return alert("Veuillez Inserer des liens")
        Token = Tokentt.value
        listelien = textarea.value.split("\n").filter(item => item);
        if (VarRemplacer === true)  {
            if (AncienNomEp.value === "" || AncienTypeNum.value === '') return alert("Veuiller Renseigner tous les champs")
            PositionNumeroDebut = AncienNomEp.value.length - AncienTypeNum.value.length
            PositionNumeroFin = AncienNomEp.value.length

            if (Saisonbutton.checked){
                if (AncienSai.value === '' || TypeSai.value === '') return alert("Veuiller Renseigner tous les champs")
                PositionSaisonDebut = AncienSai.value.length - TypeSai.value.length
                PositionSaisonFin = AncienSai.value.length
            }else{
                PositionSaisonDebut = ""
                PositionSaisonFin = ""
            }
            Extensioncheck.checked ? extension = true : extension = false
            Prefixezone.value !== "" ? Prefixe = Prefixezone.value : Prefixe = ""
            Interzone.value !== "" ? Inter = Interzone.value : Inter = ""
            Suffixezone.value !== "" ? Suffixe = Suffixezone.value : Suffixe = "" 
            console.log("Avant fonction")
            Renomer(Token, listelien, Prefixe, PositionSaisonDebut, PositionSaisonFin, Inter, PositionNumeroDebut, PositionNumeroFin, Suffixe, extension)

        }else{
            if (Anciencaractere.value === "") return alert("Veuiller Renseigner uun caractère a remplacer")
            Remplacer(Token, listelien, Anciencaractere.value, Nouveaucaractere.value)
        }
        

    })

}

function Onglet2Function(){
    console.log("test1")
    
}
