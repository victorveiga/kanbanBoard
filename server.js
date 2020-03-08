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

const config         = require('./config')
const parse          = require('url').parse
const rootFolder     = config.rootFolder
const defaultIndex   = config.defaultIndex
const port           = config.port
const express        = require('express')
const app            = express()
const bodyParser     = require('body-parser')
const pool           = new require('./postgresql-database')

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(__dirname));

// Rota principal
app.get('/', (req, res)=>{
    let filename = parse(req.url).pathname, fullPath

    if(filename === '/') {
        filename = defaultIndex;
    }

    fullPath = __dirname + rootFolder + filename;
    res.sendFile(fullPath)
})

// method GET
app.get('/getChamado/', (requisicao, resposta)=>{
    pool.query('SELECT * FROM CHAMADO',(erro,resultado) => {
        if(erro){
            throw erro
        }
        console.log(resultado.rows)
        resposta.status(200).send(resultado.rows)

    })
    console.log('Chegou aqui')
})

// method post
app.post('/adicionarProtocolo/', function (req, res) {

    //response.status(200).send(`User deleted with ID: ${id}`)

    let sql = `INSERT INTO CHAMADO (
                    TITULO,
                    DESCRICAO,
                    TIPO_PROTOCOLO,
                    STATUS
              ) VALUES (
                    '${req.body.recipient_name}',
                    '${req.body.message_text}',
                    '${req.body.tipo_protocolo}',
                    ${req.body.select_status}
              )`      

    pool.query(sql,(erro) => { if (erro){ throw erro } })

    res.redirect('/')
});

// method put
app.post('/atualizarProtocolo/:id', function (req, res) {

    let sql = `UPDATE CHAMADO SET 
                    TITULO = '${req.body.recipient_name}',
                    DESCRICAO = '${req.body.message_text}',
                    TIPO_PROTOCOLO = '${req.body.tipo_protocolo}',
                    STATUS = ${req.body.select_status}
               WHERE ID = ${req.params.id}`      
    pool.query(sql, (erro)=>{if (erro){throw erro}})

    res.redirect('/')
});

app.post('/atualizarStatus/', function (req, res) {

    let sql = `UPDATE CHAMADO SET 
                    STATUS = ${req.body.select_status}
               WHERE ID = ${req.body.id}`      
    pool.query(sql, (erro)=>{if (erro){throw erro}})

    res.redirect('/')

});

// method delete
app.post('/removerChamado/', function (req, res) {

    let sql = `DELETE FROM CHAMADO WHERE ID = ${req.body.id}`      
    pool.query(sql, (erro)=>{if (erro){throw erro}})

    res.status(200).redirect('/')
});

app.listen(port, function () {
    console.log('Servidor iniciado na porta: ' + port);
    console.log('Para derrubar o servidor: ctrl + c');
})