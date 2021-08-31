const fs=require('fs');
const file='proizvodi.json';
const dateandtime=require('date-and-time');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG}=require('constants');
var kategorije=["Stolice","Stolovi","Laptopovi","Monitori"];

let ProcitajPodatkeIzFajla=()=>{
    let proizvodi=fs.readFileSync(file,(error,data) =>
    {
        if(error) throw error;
        return data;


    });
    return JSON.parse(proizvodi);
}
let SnimiProizvode=(data)=>
{
    fs.writeFileSync(file,JSON.stringify(data));

}
exports.SviProizvodi=()=>{
    return ProcitajPodatkeIzFajla();
};

exports.DodajProizvod=(NoviProizvod)=>{
let id=1;
let proizvodi=this.SviProizvodi();
let proizvod={};
let oznake=NoviProizvod.oznake.split(',');
if(proizvodi.length>0){
    id=proizvodi.length+1;
}

if(kategorije.find(x=>x.startsWith(NoviProizvod.kategorija)))
{
<<<<<<< HEAD
    if(NoviProizvod.drugacena!=""&&NoviProizvod.datum!="")
=======
    if(NoviProizvod.drugacena!="" &&   NoviProizvod.datum!="")
>>>>>>> cea151234440ae63953fb91451e9c5c548745f3b
    {
        let akcije=[];
        let akcija={'id_akcije':1,'drugacena':parseFloat(NoviProizvod.drugacena),'datum':NoviProizvod.datum};
        akcije.push(akcija);

        proizvod={

            'id':id,
            "naziv":NoviProizvod.naziv,
            "kategorija":NoviProizvod.kategorija,
            "cena":parseFloat(NoviProizvod.cena),
            "tekst":NoviProizvod.tekst,
            "oznake":oznake,
            "akcije":akcije
};
    }
    else
    {
        proizvod={
            "id":id,
            "naziv":NoviProizvod.naziv,
            "kategorija":NoviProizvod.kategorija,
            "cena":parseFloat(NoviProizvod.cena),
            "tekst":NoviProizvod.tekst,
            "oznake":oznake

        };
    }
    proizvodi.push(proizvod);
    SnimiProizvode(proizvodi);

    }

}

<<<<<<< HEAD
=======

>>>>>>> cea151234440ae63953fb91451e9c5c548745f3b
exports.IzbrisiProizvod=(id)=>
{
    if(this.SviProizvodi().find(x=>x.id==id))
    {
        SnimiProizvode(this.SviProizvodi().filter(proizvod=>proizvod.id!=id));


    }

}
exports.FiltrirajPoImenu=(ime)=>
{
    let filtrirano=this.SviProizvodi().filter(p=>p.naziv.startsWith(ime));
    return filtrirano;
}
exports.FiltrirajPoKategoriji=(kategorija)=>
{
    return this.SviProizvodi().filter(p=>p.kategorija==kategorija);
    
}

exports.FiltrirajPoAktivnojAkciji=()=>
{
    let proizvodi=ProcitajPodatkeIzFajla();
    let filtriani=[];
    let DANAS=Date.now();
    
    for(let i=0;i<proizvodi.length;i++)
    {
        if(proizvodi[i].akcije!=undefined)
        {
            for(let j=0;j<proizvodi[i].akcije.length;j++)
            {
                let datum2=Date.parse(proizvodi[i].akcije[j].datum);
                if(datum2>DANAS)
                filtriani.push(proizvodi[i]);

            }

        }

    }
    return filtriani;
}
exports.VratiKategorije=()=>
{
    return kategorije;
    
}
exports.NadjiProizvod=(id)=>
{
    let broj=parseInt(id);
    let proizvodi=this.SviProizvodi();
    let proizvod=proizvodi.filter(p=>p.id==broj);
    return proizvod;
}
exports.IzmeniProizvod=(izmenaProizvoda)=>
{
    let proizvodi=this.SviProizvodi();
    for(let i=0;i<proizvodi.length;i++)
    {
        if(izmenaProizvoda.id==proizvodi[i].id)
        {
            proizvodi[i].naziv=izmenaProizvoda.naziv;
            proizvodi[i].kategorija=izmenaProizvoda.kategorija;
            proizvodi[i].cena=izmenaProizvoda.cena;
            proizvodi[i].tekst=izmenaProizvoda.tekst;
            proizvodi[i].oznake=izmenaProizvoda.oznake;

            if(proizvodi[i].akcije!=undefined)
            {
                for(let j=0;j<proizvodi[i].akcije.length;j++)
                {
                    proizvodi[i].akcije[j].drugacena=izmenaProizvoda.drugacena;
                    proizvodi[i].akcije[j].datum=izmenaProizvoda.datum;

                }

            }

        }

    }
    SnimiProizvode(proizvodi);

}



