const { response, request } = require('express');
var express=require('express');
var ProizvodiServis=require('../proizvodi-moduli/funkcije');
var app=express();
const port=3000;

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.get('/',(request,response)=>
{
    response.send('Server radi!!');
    
});
app.get('/SviProizvodi',function(request,response)
{
    response.send(ProizvodiServis.SviProizvodi())

});
app.post('/DodajProizvod',function(request,response){
    ProizvodiServis.DodajProizvod(request.body);
    response.end('Proizvod je dodat!!');
});
app.get('/FiltrirajPoImenu',function(request,response)
{
    response.send(ProizvodiServis.FiltrirajPoImenu(request.query.ime));
    
});
app.get('/FiltrirajPoKategoriji',function(request,response)
{
    response.send(ProizvodiServis.FiltrirajPoKategoriji(request.query.kategorija));
});
app.get('/SveKategorije',function(request,response)
{
    response.send(ProizvodiServis.VratiKategorije());

});
app.get('/ProizvodiNaAkciji',function(request,response)
{
    response.send(ProizvodiServis.FiltrirajPoAktivnojAkciji());

});
app.delete('/IzbrisiProizvod/:id',(request,response)=>
{
    ProizvodiServis.IzbrisiProizvod(request.params['id']);
    response.end('Proizvod je izbrisan!!');
    
});
app.get('/VratiProizvod/:id',(request,response)=>
{
    response.send(ProizvodiServis.NadjiProizvod(request.params['id']));
    
});
app.post('/SnimiIzmene',(request,response)=>
{
    ProizvodiServis.IzmeniProizvod(request.body);
    response.end('Snimljeno je!!!');
});

<<<<<<< HEAD
=======

>>>>>>> cea151234440ae63953fb91451e9c5c548745f3b
app.listen(port,()=>{console.log(`Startovan server na portu ${port}`)});

