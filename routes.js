const { Router }            = require('express')
const routes                = new Router()
const db                    = require('./database')
const MainController        = require('./controllers/MainController')

// Login
routes.get('/login', (req, res)=>{
    res.render('login')
})

routes.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

// Rota principal
routes.get('/', require('connect-ensure-login').ensureLoggedIn(), MainController.home)

// method GET
routes.get('/getChamado/:id', require('connect-ensure-login').ensureLoggedIn(), (requisicao, resposta)=>{

    let condicao = ''
    if (requisicao.params.id){
        condicao = `WHERE ID = ${requisicao.params.id}`
    }

    db.ExecSQL(`SELECT * FROM CHAMADO ${condicao}`).then(resultado => {
        resposta.status(200).send(resultado)
    })
})

routes.get('/signin', (req,res)=>{
    res.render('signin')
})

routes.post('/signin', (req,res)=>{
    let sql = `INSERT INTO USUARIO ( USERNAME, EMAIL, PASSWORD )
               VALUES
               ('${req.body.username}','${req.body.email}','${req.body.password}')`

    db.ExecSQL(sql).then(resultado => {
        res.status(200).redirect('/')
    })           
})

routes.get('/getIDUsuario/', (req,res)=>{
    let id = null
    let username = null
    if (req.user){
        id = req.user.id
        username = req.user.username
    }
    res.status(200).send({id,username})
})

// method post
routes.post('/adicionarProtocolo/', require('connect-ensure-login').ensureLoggedIn(), (req, res)=> {

    let sql = `INSERT INTO CHAMADO (
                    TITULO,
                    DESCRICAO,
                    TIPO_PROTOCOLO,
                    STATUS,
                    ID_USUARIO
              ) VALUES (
                    '${req.body.recipient_name}',
                    '${req.body.message_text}',
                    '${req.body.tipo_protocolo}',
                     ${req.body.select_status},
                     ${req.user.id}
              )`      

    db.ExecSQL(sql)
    res.redirect('/')
});

// method put
routes.post('/atualizarProtocolo/:id', require('connect-ensure-login').ensureLoggedIn(), (req, res)=> {

    let sql = `UPDATE CHAMADO SET 
                    TITULO = '${req.body.recipient_name}',
                    DESCRICAO = '${req.body.message_text}',
                    TIPO_PROTOCOLO = '${req.body.tipo_protocolo}',
                    STATUS = ${req.body.select_status},
                    ID_USUARIO = ${req.user.id}
               WHERE ID = ${req.params.id}`      
    db.ExecSQL(sql)
    res.redirect('/')
});

routes.post('/atualizarStatus/', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

    let sql = `UPDATE CHAMADO SET 
                    STATUS = ${req.body.select_status},
                    ID_USUARIO = ${req.user.id}
               WHERE ID = ${req.body.id}`              
    db.ExecSQL(sql)
    res.redirect('/')
});

// method delete
routes.post('/removerChamado/', require('connect-ensure-login').ensureLoggedIn(), (req, res) => {

    let sql = `DELETE FROM CHAMADO WHERE ID = ${req.body.id}`      

    db.ExecSQL(sql)
    res.redirect('/')
});

routes.get('/fila_chamado_usuario/', require('connect-ensure-login').ensureLoggedIn(), MainController.fila)

module.exports = routes