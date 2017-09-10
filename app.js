var fs = require('fs');
var sql = require('sql.js');
var path = require("path");
var express = require("express");
var bodyParser = require("body-parser");

var filebuffer = fs.readFileSync('assets/data/PokemonDB.db');
var db = new SQL.Database(filebuffer);

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));

app.listen(3000, '127.0.0.1', function () {
    console.log("Running at port 3000");
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.get('/', function (req, res) {
    res.render('index');
});

app.post('/Insert', function(req, res, next) {
    const parameters = req.body;    

    var id = parameters.id;
    var name = parameters.name;
    var weight = parameters.weight;
    var height = parameters.height;    
    var baseExp = parameters.base_experience;

    var query = "INSERT INTO Pokemones (Name, Weight, Height, BaseExperience) VALUES ";
    query += "('"+name+"', "+weight+", "+height+", "+baseExp+");";
    db.run(query);

    parameters.abilities.forEach(function(item) {
        var ability = item.ability.name;

        query = "INSERT INTO AbilitiesPokemon (PokemonId, Name) VALUES ";
        query += "("+id+", '"+ability+"');";
        db.run(query);         
    }, this);

    var speed = parameters.stats[0].base_stat;
    var specialDefense = parameters.stats[1].base_stat;
    var specialAttack = parameters.stats[2].base_stat;
    var defense = parameters.stats[3].base_stat;
    var attack = parameters.stats[4].base_stat;
    var hp= parameters.stats[5].base_stat ;

    query = "INSERT INTO StatsPokemon (Speed, SpecialDefense, SpecialAttack, Defense, Attack, Hp) VALUES ";
    query += "("+speed+", "+specialDefense+", "+specialAttack+", "+defense+", "+attack+", "+hp+");";
    db.run(query);

    var backDefault = parameters.sprites.back_default;
    var backFemale = parameters.sprites.back_female;
    var backShiny = parameters.sprites.back_shiny;
    var backShinyFemale = parameters.sprites.back_shiny_female;
    var frontDefault = parameters.sprites.front_default;
    var frontFemale = parameters.sprites.front_female;
    var frontShiny = parameters.sprites.front_shiny;
    var frontShinyFemale = parameters.sprites.front_shiny_female;

    query = "INSERT INTO SpritesPokemon (BackDefault, BackFemale, BackShiny, BackShinyFemale, FrontDefault, FrontFemale, FrontShiny, FrontShinyFemale) VALUES ";
    query += "('"+backDefault+"', '"+backFemale+"', '"+backShiny+"', '"+backShinyFemale+"', '"+frontDefault+"', '"+frontFemale+"', '"+frontShiny+"', '"+frontShinyFemale+"');"
    db.run(query);

    parameters.types.forEach(function(item){
        var type = item.type.name;

        query = "INSERT INTO TypesPokemon (PokemonId, Name) VALUES ";
        query += "("+id+", '"+type+"');";
        db.run(query);
    });

    query = "";

    var data = db.export();
    var buffer = new Buffer(data);
    fs.writeFileSync("assets/data/pokemonDB.db", buffer);

    console.log(id+" - "+name+ " Created");

    res.status(200).json({message: id+" - "+name+ " Created"});
});