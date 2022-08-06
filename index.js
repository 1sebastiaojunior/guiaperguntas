const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

connection
.authenticate()
.then(() => {
    console.log("conexão realizada com sucesso!")
})
.catch((msgErro) => {
    console.log(msgErro);
})

app.set('view engine', 'ejs');
app.use(express.static('public'));
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/",(req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        });
    });
});

app.get("/perguntar",(req, res) => {
    res.render("perguntar");
});

app.post("/salvarpergunta",(req, res) => {
    var title = req.body.title;
    var description = req.body.description;

    Pergunta.create({
        title: title,
        description: description
    }).then(() => {
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){
            res.render("pergunta", {
                pergunta: pergunta
            });
        }else{
            res.redirect("/");
        }
    }); 
});

app.listen(8080,() => {
    console.log("App rodando!!!");
});
