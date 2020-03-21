/*************************************************************
* DEVELOPER: VICTOR VEIGA                                    *
* EMAIL: victorl.veigapro@gmail.com                          *
* DATA INICIAL: 08/03/2020                                   *
* OBJETIVO: Funcionar como uma central de chamados simples e *
*           objetiva utilizando um quadro kanban             *
*                                                            *
* INFORMAÇÕES:                                               *
*                                                            *
*************************************************************/

const {port}         = require('./config')
const express        = require('express')
const app            = express()
const bodyParser     = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const routes         = require('./routes')
const http           = require('http').createServer(app)
const io             = require('socket.io')(http)
const db             = require('./database')
const Quadro         = require('./quadro')


const passport       = require('passport')
const Strategy       = require('passport-local').Strategy

passport.use(new Strategy(
    function(username, password, cb) {
      db.findByUsername(username, (err, user) => {
        if (err) { return cb(err) }
        if (!user) { return cb(null, false) }
        if (user.password != password) { return cb(null, false) }
        return cb(null, user)
      })
}))

passport.serializeUser( (user, cb) => {
    cb(null, user.id)
})
  
passport.deserializeUser((id, cb) => {
    db.findById(id, (err, user) => {
        if (err) { return cb(err) }
        cb(null, user)
    })
})

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(expressLayouts) 
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes)

app.post('/login', 
    passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' })
)

http.listen(port, function () {
    console.log('Servidor iniciado na porta: ' + port);
    console.log('Para derrubar o servidor: ctrl + c');
})

// Comunicação via Socket
io.on('connection', (socket) => {

    socket.on('card arrastado', (data) => {

        let [id,coluna,id_coluna,id_usuario] = data.split('=>')

        let sql = `UPDATE CHAMADO SET 
                     STATUS = ${coluna},
                     ID_USUARIO = ${id_usuario}
                   WHERE ID = ${id}`
        db.ExecSQL(sql).then(()=>{

            async function exec() {
                socket.broadcast.emit('cards atualizados', await Quadro.getQuadro())
            }
            exec()
            
        })
    });  
})
