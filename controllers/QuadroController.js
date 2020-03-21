const fs         = require('fs')
const Quadro     = require('../quadro')

class QuadroController {

    index(requisicao, resposta){

        let ltFormulario     = null
        let ltBarraNavegacao = null
        let ltColunas        = null

        async function carregar() {

            let diretorioView = __dirname+'/../views/'

            // Carregar módulos
            ltBarraNavegacao = await new Promise(resolve => {
                fs.readFile(diretorioView+'barra-navegacao.ejs', 'utf-8',(erro, data) => {
                    resolve(data)
                })
            })

            ltFormulario = await new Promise(resolve => {
                fs.readFile(diretorioView+'form_cad_chamado.ejs', 'utf-8',(erro, data) => {
                    resolve(data)
                })
            })

            ltColunas = await Quadro.getQuadro()

            // Renderiza Tudo
            resposta.status(200).render('main', {barraNavegacao: ltBarraNavegacao, principal: ltColunas, form_cad_chamado: ltFormulario})
        }

        // Renderiza App
        carregar()
    }
}

module.exports = new QuadroController()