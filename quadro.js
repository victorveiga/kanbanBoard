const db  = require('./database')
const ejs = require('ejs')

class Quadro {
    constructor(){
        this.tipoProtocolo = Array(
            { id: 'i' , cor: 'danger'  , descricao: 'Inconsistência' },
            { id: 'n' , cor: 'success' , descricao: 'Novo recurso'   },
            { id: 'm' , cor: 'info'    , descricao: 'Melhoria'       }
        )
    }

    // Retorna o HTML tratado do quadro kanban
    async getQuadro(){
        return new Promise(resolve => {
            db.ExecSQL('SELECT * FROM COLUNA').then( resColunas =>{
                let sqlChamado = 'SELECT C.*, U.USERNAME AS NOME_USUARIO FROM CHAMADO C LEFT JOIN USUARIO U ON (U.ID = C.ID_USUARIO)'
                db.ExecSQL(sqlChamado).then( resChamados => {
                    ejs.renderFile(__dirname+'/views/colunas.ejs', { colunas: resColunas, 
                                                                     chamados: resChamados, 
                                                                     tipos_chamado: this.tipoProtocolo }).then(resultado=>{
                                                                        resolve(resultado)
                                                                     })
                    
                } )
            })
        })
    }
}

module.exports = new Quadro()