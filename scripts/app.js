$(function () {    
    var jsonObj = [];
    var id=1;
    var App = {
        Init: function () {
            $('#btnDownloadAll').on('click', function(){
                App.JSONDownloadAll();
            });      
            
            $('#btnDownloadSingle').on('click', function(){
                App.JSONDownloadSingle();
            }); 
        },
        ImageDownloader: function (){
            for(var i = 1; i <= 721; i++){
                var ruta = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/'+i+'.png';
                var enlace = document.createElement('a');
                enlace.href = ruta;
                enlace.download = ruta;
                document.body.appendChild(enlace);
                enlace.click();                
                enlace.parentNode.removeChild(enlace);                
            }
        },
        JSONDownloadAll: function(){              
            for(var i = 1; i <= 721; i++){
                var _url = "http://pokeapi.co/api/v2/pokemon/"+i;

                $.get({
                    method: "GET",
                    url: _url,
                    type: "JSON",
                    async: true,
                    success: function(data){
                        delete data.forms;
                        delete data.moves;
                        delete data.game_indices;                        
                        jsonObj.push(data);                    
    
                        if(jsonObj.length == 721){
                            jsonObj.sort(function(a, b){
                                return (a.id - b.id);
                            });

                            jsonObj.forEach(function(item){
                                App.Insert(item);
                            });
                        }
                    },
                    error: function(xhr){
                        alert("An error occured: " + xhr.status + " " + xhr.statusText);
                    }
                });
            }            
        },
        JSONDownloadSingle: function(){
            var _url = "http://pokeapi.co/api/v2/pokemon/"+id;
            
            $.ajax({
                method: "GET",
                url: _url,
                type: "JSON",
                async: true,
                success: function(data){
                    id++;
                    delete data.forms;
                    delete data.moves;
                    delete data.game_indices;

                    App.Insert(data);
                },
                error: function(xhr){
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        },
        Insert: function(_data){
            $.ajax({
                method: "POST",
                url: "http://127.0.0.1:3000/Insert",
                dataType: "JSON",
                async: false,
                data: _data,
                success: function(res){
                    console.log(res.message);
                },
                error: function(xhr){
                    alert("An error occured: " + xhr.status + " " + xhr.statusText);
                }
            });
        }
    };
    App.Init();
});