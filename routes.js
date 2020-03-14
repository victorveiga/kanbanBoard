const { Router } = require('express')
const routes     = new Router();;
const db         = require('./database')
const fs         = require('fs');

// Rota principal
routes.get('/', (req, res)=>{

    let xTipo_Protocolo = Array(
        { id: 'i' , cor: 'danger'  , descricao: 'Inconsistência' },
        { id: 'n' , cor: 'success' , descricao: 'Novo recurso'   },
        { id: 'm' , cor: 'info'    , descricao: 'Melhoria'       }
    )

    let formulario = null

    fs.readFile(__dirname+'/views/form_cad_chamado.ejs', 'utf-8',(erro, data) => {
        formulario = data
    })

    db.ExecSQL('SELECT * FROM COLUNA').then( resColunas =>{
        db.ExecSQL('SELECT * FROM CHAMADO').then( resChamados => {
            res.render('colunas', { colunas: resColunas, 
                                    chamados: resChamados, 
                                    tipos_chamado: xTipo_Protocolo,
                                    form_cad_chamado: formulario
                                })
        } )
    })
})

// method GET
routes.get('/getChamado/:id', (requisicao, resposta)=>{

    let condicao = ''
    if (requisicao.params.id){
        condicao = `WHERE ID = ${requisicao.params.id}`
    }

    db.ExecSQL(`SELECT * FROM CHAMADO ${condicao}`).then(resultado => {
        resposta.status(200).send(resultado)
    })
})

// method post
routes.post('/adicionarProtocolo/', function (req, res) {

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

    db.ExecSQL(sql)
    res.redirect('/')
});

// method put
routes.post('/atualizarProtocolo/:id', function (req, res) {

    let sql = `UPDATE CHAMADO SET 
                    TITULO = '${req.body.recipient_name}',
                    DESCRICAO = '${req.body.message_text}',
                    TIPO_PROTOCOLO = '${req.body.tipo_protocolo}',
                    STATUS = ${req.body.select_status}
               WHERE ID = ${req.params.id}`      
    db.ExecSQL(sql)
    res.redirect('/')
});

routes.post('/atualizarStatus/', function (req, res) {

    let sql = `UPDATE CHAMADO SET 
                    STATUS = ${req.body.select_status}
               WHERE ID = ${req.body.id}`      
    db.ExecSQL(sql)
    res.redirect('/')
});

// method delete
routes.post('/removerChamado/', function (req, res) {

    let sql = `DELETE FROM CHAMADO WHERE ID = ${req.body.id}`      

    db.ExecSQL(sql)
    res.redirect('/')
});

module.exports = routes