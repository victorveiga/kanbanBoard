const fs         = require('fs')
const Quadro     = require('../quadro')
const db         = require('../database')
const ejs        = require('ejs')

let Main = function() {

    // Leyouts
    let ltFormulario     = null
    let ltBarraNavegacao = null
    let ltColunas        = null
    let ltFilaChamado    = null

    let diretorioView    = __dirname+'/../views/'

    // Renderiza Tudo
    let renderizar = (res) => {
        res.status(200).render('main', {
            barraNavegacao: ltBarraNavegacao, 
            principal: ltColunas, 
            form_cad_chamado: ltFormulario,
            fila_chamado: ltFilaChamado
        })
    }

    let getBarraNavegacao = ()=>{
        return new Promise(resolve => {
            fs.readFile(diretorioView+'barra-navegacao.ejs', 'utf-8',(erro, data) => {
                resolve(data)
            })
        })
    }

    let getFormularioCadastroProtocolo = () => {
        return new Promise(resolve => {
            fs.readFile(diretorioView+'form_cad_chamado.ejs', 'utf-8',(erro, data) => {
                resolve(data)
            })
        })
    }

    let getFilaChamado = (user) => {
        return new Promise(resolve => {
            let id       = user.id
            let username = user.username 
            db.ExecSQL(`SELECT * FROM CHAMADO WHERE ID_USUARIO = ${id} ORDER BY ID`).then(registros => {
                ejs.renderFile(diretorioView+'fila_chamado_usuario.ejs', { id, registros, username}).then(resultado=>{
                    resolve(resultado)
                })
            })
            
        })
    }

    // Funções públicas
    this.home = async (req, res) => {

        // Carregar módulos
        ltBarraNavegacao = await getBarraNavegacao()
        ltFormulario     = await getFormularioCadastroProtocolo()
        ltColunas        = await Quadro.getQuadro()
        ltFilaChamado    = null
        renderizar(res)
    }

    this.fila = async (req, res) => {
        ltColunas        = null
        ltFilaChamado    = await getFilaChamado(req.user)
        renderizar(res)
    }
}

module.exports = new Main()