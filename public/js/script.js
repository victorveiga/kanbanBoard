/* Funções */

function formularioDefault() {
    $('#form_protocolo').removeAttr('action')
    $('#form_protocolo').removeAttr('method')

    $('#form_protocolo').attr('action', '/adicionarProtocolo/')
    $('#form_protocolo').attr('method','POST'  )
}

function AbreCard(id) {

    let obj = null
    getChamado(id).then((obj)=>{
        $('#recipient_name').val(obj.titulo)
        $('#message_text'  ).val(obj.descricao)
        $('#tipo_protocolo').val(obj.tipo_protocolo)
        $('#select_status' ).val(obj.status)
        
        $('#ModalLabel').text(`Protocolo Nº ${id}`)

        $('#form_protocolo').removeAttr('action')
        $('#form_protocolo').removeAttr('method')

        $('#form_protocolo').attr('action', '/atualizarProtocolo/'+id)
        $('#form_protocolo').attr('method','POST'  )

        $('#formProtocolo').modal('show')
    })
}

function removerChamado(id) {
    let http = new XMLHttpRequest()
    http.open('POST','removerChamado')
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    http.onreadystatechange = () => {
        if ((http.readyState == XMLHttpRequest.DONE) && (http.status == 200)){
            window.location.reload()
        }
    }
    http.send(`id=${id.replace('card_','')}`)
}

function getChamado(id){
    return new Promise((resolve, reject)=>{
        let http = new XMLHttpRequest()
        http.open('GET', 'getChamado/'+id)
        http.onreadystatechange = () => {
            if(http.readyState == XMLHttpRequest.DONE){
                
                switch (http.status) {
                    case 200:
                        resolve(JSON.parse(http.response)[0])
                        break;   
                
                    default:
                        reject({status: http.status, statusText: http.statusText})
                        break;
                }
            }
        }
        http.send()
    })
}

function getUsuario(){
    let http = new XMLHttpRequest()
        http.open('GET', 'getIDUsuario/')
        http.onreadystatechange = () => {
            if(http.readyState == XMLHttpRequest.DONE){
                
                switch (http.status) {
                    case 200:
                        let resultado = JSON.parse(http.response)
                        id_usuario = resultado.id
                        nome_usuario = resultado.username
                        break;   
                
                    default:
                        console.log({status: http.status, statusText: http.statusText})
                        break;
                }
            }
        }
        http.send()
}

/* Eventos de drag on drop */

function arrastarInicio(e) {
    e.dataTransfer.setData("elemento_transferido", e.target.id)
    event.target.style.opacity = "0.4"
}

function permiteSoltar(e) {
    e.preventDefault()
}

function soltar(e) {
    e.preventDefault()

    // VERIFICAR colocar para identificar a coluna automaticamente sem utilizar o arrya xColunas
    xColunas.forEach(el => {
        if (el.id_nome == e.target.id) {
            var protocolo = document.getElementById( event.dataTransfer.getData("elemento_transferido") )
            e.target.appendChild(protocolo)
            event.target.style.opacity = "1"
            
            socket.emit('card arrastado', `${protocolo.id.replace('card_','')}=>${el.id}=>${el.id_nome}=>${id_usuario}`)
            $(`#${event.dataTransfer.getData("elemento_transferido")} #nome_usuario`)[0].innerText = '@'+nome_usuario
        }
    })
}

document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "1"
});

// ----------------------------- INICIO ------------------------------------ \\

// variáveis globais
let xColunas = Array( 
    { id: 1 , id_nome: 'caixa_entrada'     , descricao:'Caixa de entrada' },
    { id: 2 , id_nome: 'execucao'          , descricao:'Em execução'      },
    { id: 3 , id_nome: 'aprovacao'         , descricao:'Em aprovação'     },
    { id: 4 , id_nome: 'aguardando_versao' , descricao:'Aguardando versão'}
)

let id_usuario   = null
let nome_usuario = null
getUsuario()

// Comunicação via socket
let socket = io()

socket.on('cards atualizados', (data) => {
    document.getElementById('section_quadro').innerHTML = data
})