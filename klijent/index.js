const express=require('express');
const axios=require('axios');
const path=require('path');
const { request } = require('express');
const fs=require('fs');
const port = 5000;
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let ProcitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+'/views/'+naziv+'.html'),'utf-8')
}
app.get("/",function(req,res){
    res.send(ProcitajPogledZaNaziv("index"));
});
function VratiProizvode(){
    return axios.get("http://127.0.0.1:3000/Sviproizvodi");
}
function VratiKategorije(){
    return axios.get("http://127.0.0.1:3000/SveKategorije");
}
function PrikaziProizvode(proizvodi){
    let prikaz="";
    for(let i=0;i<proizvodi.length;i++){
        prikaz+=`<tr>
        <td>${proizvodi[i].id}</td>
        <td>${proizvodi[i].naziv}</td>
        <td>${proizvodi[i].kategorija}</td>
        <td>${proizvodi[i].cena}</td>
        <td>${proizvodi[i].tekst}</td>           
         <td><table>`;
        
             prikaz+=`<tr><td>${proizvodi[i].oznake}</td> </tr>`
          
        prikaz+=`</table></td><td><table>`;

        if(proizvodi[i].akcije!=undefined){
        for(let j=0;j<proizvodi[i].akcije.length;j++)
            {
             prikaz+=`<tr>
             <td>Cena:${proizvodi[i].akcije[j].drugacena}
            Datum isteka:${proizvodi[i].akcije[j].datum}</td> </tr>`; 
            }  
        }
        prikaz+=`</table></td>
        <td><a href="/Obrisi/${proizvodi[i].id}">Obrisi</a></td>
        <td><a href="/Izmeni/${proizvodi[i].id}">Izmeni</a></td>
        </tr>`;    
        }
        return prikaz;
}
function PrikaziKategorije(kategorije){
    prikaz="";
    for(let i=0;i<kategorije.length;i++){
        prikaz+=`<option value='${kategorije[i]}'>${kategorije[i]}</option>`;
      }
      return prikaz;
}
app.get("/SviProizvodi",(req,res)=>{   
    Promise.all([VratiProizvode(), VratiKategorije()])
    .then(function (results) {
        res.send(ProcitajPogledZaNaziv("sviproizvodi").replace("#{kat}",PrikaziKategorije(results[1].data)).replace("#{data}",PrikaziProizvode(results[0].data)));
        }).catch(error => {
        console.log(error);
        });
        
        //res.end();
      });

    app.post("/FiltrirajPoImenu",(req,res)=>{
        Promise.all([axios.get(`http://127.0.0.1:3000/FiltrirajPoImenu?ime=${req.body.ime}`), VratiKategorije()])
        .then(function (results) {
              res.send(ProcitajPogledZaNaziv("sviproizvodi").replace("#{kat}",PrikaziKategorije(results[1].data)).replace("#{data}",PrikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
        });
            
    });
    app.post("/FiltrirajPoKategoriji",(req,res)=>{    
        Promise.all([axios.get(`http://127.0.0.1:3000/FiltrirajPoKategoriji?kategorija=${req.body.kategorija}`), VratiKategorije()])
        .then(function (results) {
              res.send(ProcitajPogledZaNaziv("sviproizvodi").replace("#{kat}",PrikaziKategorije(results[1].data)).replace("#{data}",PrikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
    });
});
    app.get("/ProizvodiNaAkciji",(req,res)=>{
        Promise.all([axios.get(`http://127.0.0.1:3000/ProizvodiNaAkciji`), VratiKategorije()])
        .then(function (results) {
              res.send(ProcitajPogledZaNaziv("sviproizvodi").replace("#{kat}",PrikaziKategorije(results[1].data)).replace("#{data}",PrikaziProizvode(results[0].data)));
        }).catch(error => {
            console.log(error);
    });
    });

    app.get("/DodajProizvod",function(req,res){
       VratiKategorije().then(response=>{
          res.send(ProcitajPogledZaNaziv("dodaj").replace("${kat}",PrikaziKategorije(response.data)));
       }).catch(error => {
        console.log(error);
});
       
    });
    app.post("/SnimiProizvod",(req,res)=>{
        axios.post("http://localhost:3000/DodajProizvod",{
            kategorija:req.body.kategorija,
            naziv:req.body.naziv,
            cena:req.body.cena,
            tekst:req.body.tekst,
            oznake:req.body.oznake,
            drugacena:req.body.drugacena,
            datum:req.body.datum
            
        }).catch(error => {
            console.log(error);        
    });
    res.redirect("/SviProizvodi"); 
    });
    app.get("/Obrisi/:id",(req,res)=>{
        axios.delete(`http://localhost:3000/IzbrisiProizvod/${req.params["id"]}`)
        res.redirect("/SviProizvodi");
    });
    app.get("/Izmeni/:id",function(req,res){
        
        Promise.all([axios.get(`http://localhost:3000/VratiProizvod/${req.params.id}`),VratiKategorije()])
        .then(function (results) {
            let akcije="";
            for(let i=0;i<results[0].data.length;i++){
                if(results[0].data[i].akcije!=undefined){
                for(let j=0;j<results[0].data[i].akcije.length;j++){
                    akcije+=`Nova cena:<input type="number" name="drugacena" value="${results[0].data[i].akcije[j].drugacena}"><br><br>
                    Datum isteka:<input type="text" name="datum" value="${results[0].data[i].akcije[j].datum}"> `
                }
            }
            }
              res.send(ProcitajPogledZaNaziv("izmeni").replace("${kat}",PrikaziKategorije(results[1].data)).replace("${id}",results[0].data[0].id).replace("${naziv}",results[0].data[0].naziv).replace("${cena}",parseFloat(results[0].data[0].cena)).replace("${tekst}",results[0].data[0].tekst).replace("${oznake}",results[0].data[0].oznake).replace("${akcije}",akcije));
        }).catch(error => {
            console.log(error);
    });
    });
app.post("/SnimiIzmene",function(req,res){
axios.post("http://localhost:3000/SnimiIzmene",{
    id:req.body.id,
    kategorija:req.body.kategorija,
    naziv:req.body.naziv,
    cena:req.body.cena,
    tekst:req.body.tekst,
    oznake:req.body.oznake,
    drugacena:req.body.drugacena,
    datum:req.body.datum
}).catch(error => {
    console.log(error);        
});
res.redirect("/SviProizvodi"); 
});


app.listen(port,()=>{console.log(`Klijent startovan na portu ${port}`)});




