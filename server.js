
var http = require('http'),
	express  = require('express'),
    bodyParser   = require('body-parser');

const pg    = require('pg');
pg.defaults.ssl = true;
var conString = "postgres://postgres:postgres@localhost:5432/prueba";

function crossDomain(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); 
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.use(crossDomain);

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

console.log("iniciado");
    app.listen(process.env.PORT || 8080, function(){console.log("server is running");});

app.get('/leerusuarios', (req, res, next) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('error con postgres', err);
            return res.status(500).json({success: false, data: err});
        }
    
        client.query('SELECT * FROM usuarios', function(err, result) {
            if(err) {
                return console.error('error query', err);
            }
    
            client.end();
            return res.json(result.rows);
            
        });
    });
});
    
app.get('/leerusuario/:id',(req,res)=>{
    var client = new pg.Client(conString);
    var id=req.params.id;

    client.connect(function(err) {
        if(err) {
            return console.error('error con postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query('SELECT * FROM usuarios WHERE id=' + id + ';', function(err, result) {
            if(err) {
                return console.error('error query', err);
            }
            
                client.end();
            return res.json(result.rows);
        
        });
        
    });
});

app.put('/actualizarusuario',(req,res)=>{
    var client = new pg.Client(conString);
    var id=req.body.id;
    client.connect(function(err) {
        if(err) {
            return console.error('error en postgres', err);
            return res.status(500).json({success: false, data: err});
        }

        client.query("UPDATE usuarios SET nombre='"+req.body.nombre+"', clave='"+req.body.clave+"', nacimiento='"+req.body.nacimiento+"',avatar='"+req.body.avatar+"' WHERE id='" + id + "';", function(err, result) {
            
            if(err) {
                return console.error('error query', err);
            }
            
                client.end();
            return res.json(result);
        });
    });
});


app.delete('/eliminarusuario',(req,res)=>{
    var client = new pg.Client(conString);
    var id=req.body.id;

    client.connect(function(err) {
        if(err) {
            return console.error('error con postgres', err);
            return res.status(500).json({success: false, data: err});
        }
    
        client.query('DELETE FROM usuarios WHERE id=' + id + ';', function(err, result) {
            
            if(err) {
                return console.error('error query', err);
            }
                client.end();
            return res.json(result);
        });
    });


});

app.post('/guardarusuario', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('error con postgres', err);
            return res.status(500).json({success: false, data: err});
        }
                
        client.query("INSERT INTO  usuarios (nombre,clave,nacimiento,avatar) VALUES ('"+req.body.nombre+"', '"+req.body.clave+"','"+req.body.nacimiento+"','"+req.body.avatar+"');", function(err, result) {
            if(err) {
                return console.error('error query', err);
            }
            client.end();
            return res.json(result.rows);
            
        });
        
    });
});


app.get('/ultimoidusuario',(req,res)=>{
    var client = new pg.Client(conString);
  
    client.connect(function(err) {
       if(err) {
           return console.error('error con postgres', err);
           return res.status(500).json({success: false, data: err});
       }

       client.query('SELECT id from usuarios order by id desc LIMIT 1', function(err, result) {
           if(err) {
               return console.error('error query', err);
           }
          
            client.end();
           return res.json(result.rows);
      
       });
      
   });
    
});

app.post('/guardaractividad', (req, res) => {
    var client = new pg.Client(conString);
    client.connect(function(err) {
        if(err) {
            return console.error('error con postgres', err);
            return res.status(500).json({success: false, data: err});
        }
                
        client.query("INSERT INTO  actividades (idusuario,aciertos,errores) VALUES ("+req.body.idusuario+", '"+req.body.aciertos+"','"+req.body.errores+"');", function(err, result) {
            if(err) {
                return console.error('error query', err);
            }
            client.end();
            return res.json(result.rows);
            
        });
        
    });
});

app.get('/mostraractividades/:idusuario',(req,res)=>{
    var client = new pg.Client(conString);
    var idusuario=req.params.idusuario;
  
    client.connect(function(err) {
       if(err) {
           return console.error('error con postgres', err);
           return res.status(500).json({success: false, data: err});
       }

       client.query('SELECT * FROM actividades WHERE idusuario=' + idusuario + ';', function(err, result) {
           if(err) {
               return console.error('error query', err);
           }
            client.end();
           return res.json(result.rows);
      
       });
      
   });
    
});
