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
const routes         = require('./routes');

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(expressLayouts) 
app.use(routes)

app.listen(port, function () {
    console.log('Servidor iniciado na porta: ' + port);
    console.log('Para derrubar o servidor: ctrl + c');
})