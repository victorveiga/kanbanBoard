/* Funções */

function formularioDefault() {
    $('#form_protocolo').removeAttr('action')
    $('#form_protocolo').removeAttr('method')

    $('#form_protocolo').attr('action', '/adicionarProtocolo/')
    $('#form_protocolo').attr('method','POST'  )
}

function AbreCard(id) {

    let obj = null
    let http = new XMLHttpRequest()
    http.open('GET', 'getChamado/'+id)
    http.onreadystatechange = () => {
        if(http.readyState == XMLHttpRequest.DONE && http.status == 200){
            obj = JSON.parse(http.response)[0]
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
        }
    }
    http.send()
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

/* Eventos de drag on drop */

function arrastarInicio(e) {
    e.dataTransfer.setData("elemento_transferido", e.target.id);
    event.target.style.opacity = "0.4";
}

function permiteSoltar(e) {
    e.preventDefault();
}

function soltar(e) {
    e.preventDefault();

    xColunas.forEach(el => {
        if (el.id_nome == e.target.id) {
            var protocolo = document.getElementById( event.dataTransfer.getData("elemento_transferido") )
            e.target.appendChild(protocolo);
            event.target.style.opacity = "1"; 
            
            let xhr = new XMLHttpRequest()
            xhr.open('POST','atualizarStatus')
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = () => {
                if ((xhr.readyState == xhr.DONE) && (xhr.status == 200)){
                    //console.log(xhr.readyState, xhr.status)
                }
            }

            xhr.send(`id=${protocolo.id.replace('card_','')}&select_status=${el.id}`); 
        }
    })
}

document.addEventListener("dragend", function(event) {
    event.target.style.opacity = "1";
});

// ----------------------------- INICIO ------------------------------------ \\

// variáveis globais
let xColunas = Array( 
    { id: 1 , id_nome: 'caixa_entrada'     , descricao:'Caixa de entrada' },
    { id: 2 , id_nome: 'execucao'          , descricao:'Em execução'      },
    { id: 3 , id_nome: 'aprovacao'         , descricao:'Em aprovação'     },
    { id: 4 , id_nome: 'aguardando_versao' , descricao:'Aguardando versão'}
)