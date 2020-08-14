const axios = require('axios')
const { dialog } = require('electron').remote
var moment = require('moment');
const fs = require('fs')
alert = function(str){
    var options = {
      buttons: ["Ok"],
      message: str,
    }
    dialog.showMessageBoxSync(null,options)
  }

async function Renomer(Token , listefichier, Prefixe , SaisonDebut, SaisonFin , Inter , NumeroDebut, Numerofin , Suffixe ,ex) {
    for (i in listefichier){
      try {
        console.log(`lien n°${i}`)
        oldinfo = await axios({
            method: 'GET',
            url: `https://uptobox.com/api/link/info?fileCodes=${listefichier[i].replace("https://uptobox.com/", "")}`,  
        })
        console.log(`lien n°${i + 1}`)
        console.log(oldinfo.data.data.list[0].file_name)
        AncienNom1 = oldinfo.data.data.list[0].file_name
        ex === true ? extension = AncienNom1.substring(AncienNom1.lastIndexOf(".")) : extension = ""
        Numero = AncienNom1.substring(NumeroDebut, Numerofin)
        console.log(Numero)
        SaisonDebut === "" ? Saison = "" : Saison = AncienNom1.substring(SaisonDebut, SaisonFin)
        rename = await axios({
            method: 'patch',
            url: 'https://uptobox.com/api/user/files',
            data: {
              token: Token,
              file_code: listefichier[i].replace("https://uptobox.com/", ""),
              new_name: `${Prefixe}${Saison}${Inter}${Numero}${Suffixe}${extension}`,
            }
          })
      } catch (error) {
        console.log(error)
      }
        
    }
    alert("fini")
}

async function Remplacer (Token, listefichier, Anciencaractere, Nouveaucaractere) {
  for (i in listefichier){
    try {
      oldinfo = await axios({
        method: 'GET',
        url: `https://uptobox.com/api/link/info?fileCodes=${listefichier[i].replace("https://uptobox.com/", "")}`,  
    })
    AncienNom1 = oldinfo.data.data.list[0].file_name
    extension = AncienNom1.substring(AncienNom1.lastIndexOf("."))
    AncienNom = AncienNom1.substring(0 , AncienNom1.length - extension.length)
    rename = await axios({
        method: 'patch',
        url: 'https://uptobox.com/api/user/files',
        data: {
          token: Token,
          file_code: listefichier[i].replace("https://uptobox.com/", ""),
          new_name: AncienNom.split(Anciencaractere).join(Nouveaucaractere) + extension
        }
      })
    } catch (error) {
      console.error(error);
    }

  }
  alert("fini")
}

async function dossier(LienDossier, Textarea) {
  if (!fs.existsSync("./Result")){
      fs.mkdirSync("./Result")
  }
  if (!fs.existsSync("./Result/" + `${moment().format("DD-MM-YYYY")}`)){
      fs.mkdirSync("./Result/" + `${moment().format("DD-MM-YYYY")}`)
  }
  console.log(LienDossier)
  DossierXhash = LienDossier.replace("https://uptobox.com/user_public?", "")
  console.log(DossierXhash)
  lien = []
  folder = await axios({
      method: 'GET',
      url: `https://uptobox.com/api/user/public?${DossierXhash}&limit=100&offset=0`,
  })
  for (let i = 1; i <= folder.data.data.pageCount ; i++) {
      const offset1 = i - 1 ;
      page = await axios({
          method: 'GET',
          url: `https://uptobox.com/api/user/public?${DossierXhash}&limit=100&offset=${offset1}00`, 
      })
      await page.data.data.list.forEach(e => {
          lien.push("https://uptobox.com/" + e.file_code)
      })
  }
  fs.writeFile(`./Result/${moment().format("DD-MM-YYYY")}/${folder.data.data.folderName}.txt`, await lien.join("\n"), function (err) {
      if (err) return console.log(err);
      alert('Saved');
    });
    console.log("\n")
  Textarea.value = lien.join('\n')
}

module.exports = { Renomer, Remplacer, dossier }