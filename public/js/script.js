/* Funções */

function formularioDefault() {
    $('#form_protocolo').removeAttr('action')
    $('#form_protocolo').removeAttr('method')

    $('#form_protocolo').attr('action', '/adicionarProtocolo/')
    $('#form_protocolo').attr('method','POST'  )
}

function AbreCard(id) {

    let obj = null
    Array.from(xObjetos).forEach(element => {
        if (element.id == id){
            obj = element
        }
    });
    

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

function montaColunas() {

    if (xColunas.length <= 0){
        return false
    }

    xColunas.forEach(element => {
        let coluna = `<div id="${element.id_nome}" 
                        class="col-md-2 m-2 text-center aColuna" 
                        ondragover="permiteSoltar(event)" 
                        ondrop="soltar(event)">
                        <span style="display: block; border-bottom: 1px solid #ccc; margin-bottom: 5px;">${element.descricao}</span>
                    </div>`

        // remove a coluna se já existir
        $('#'+element.id_nome).remove()            

        // Adiciona a coluna
        $('#colunas').append(coluna)
    }) 

    return true
}

function montarCards(objeto) {

    xObjetos = objeto    

    $.each(xObjetos, function(index, obj){

        let coluna                   = ''
        let descricao_tipo_protocolo = ''
        let cor                      = ''
        let id_protocolo             = obj.id

        // busca a identificacao da coluna
        xColunas.forEach(e => {
            if (e.id == obj.status) {
                coluna = '#' + e.id_nome
            }
        });

        // seta o tipo de protocolo
        xTipo_Protocolo.forEach(e => {
            if (e.id == obj.tipo_protocolo) {
                descricao_tipo_protocolo = e.descricao
                cor                      = e.cor
            }
        });

        let card = `<div id="${id_protocolo}" 
                         draggable="true"
                         ondragstart="arrastarInicio(event)" 
                         class="card bg-${cor} text-white mb-2" 
                         style="cursor: pointer;"
                         >
                            <div class="card-header">
                                ${descricao_tipo_protocolo}
                                <button style="display:inline" class="close" aria-label="Close" onClick="removerChamado(${id_protocolo})">&times;</button>
                            </div>
                            <div class="card-body">
                                <h4 class="card-title">${obj.titulo.trim().substring(0,15)}</h4>
                                <h6 class="card-subtitle">Nº: ${id_protocolo}</h6>
                              <!--  <p class="card-text">${obj.descricao.trim().substring(0,15)}...</p> -->
                                <button id="btn_protocolo_${id_protocolo}" class="btn btn-outline-light mt-3">Abrir</button>
                            </div>
                    </div>`

        // remove o protocolo se já existir
        $('#'+id_protocolo).remove()            

        $(coluna).append(card);
        $(`#btn_protocolo_${id_protocolo}`).on('click', function () {
            AbreCard(this.id.replace('btn_protocolo_',''))
        })
        
    })
} 

function montarChamados() {
    let http = new XMLHttpRequest()
    http.open('GET','getChamado')
    http.onreadystatechange = () => {
        if ((http.readyState == XMLHttpRequest.DONE) && (http.status == 200)){
            montarCards(JSON.parse(http.response))
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
    http.send(`id=${id}`)
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

            xhr.send(`id=${protocolo.id}&select_status=${el.id}`); 
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

let xTipo_Protocolo = Array(
    { id: 'i' , cor: 'danger'  , descricao: 'Inconsistência' },
    { id: 'n' , cor: 'success' , descricao: 'Novo recurso'   },
    { id: 'm' , cor: 'info'    , descricao: 'Melhoria'       }
)

let xObjetos = null

montaColunas()
montarChamados()