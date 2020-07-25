# kanbanBoard
#### Central de chamados com quadro Kanban  
O projeto foi meu primeiro desafio utilizando ferramentas web. O intuito era criar uma aplicação web tradicional, aplicando conceitos básicos que aprendi inicialmente. 

A home page da aplicação possui um quadro com colunas que representam status de um chamado. As colunas recebem pequenas caixas que são os próprios chamados. Para trocar o status de uma chamado, basta arrastar com o mouse o respectivo item para a coluna desejada. A cada troca o usuário que realizou a movimentação fica como responsável pelo chamado. As movimentações são realizadas e atualizados para todos os usuários em tempo real utilizando a biblioteca javascript Socket.IO.  

Developer: Victor Veiga  
Data: 25/07/2020  

## Home

![Imagem da home page](https://github.com/victorveiga/kanbanBoard/blob/master/tutorial/home_2.png)

## Entrada

![Imagem da tela de autenticação](https://github.com/victorveiga/kanbanBoard/blob/master/tutorial/login.png)

## Registro de Usuários

![Imagem do cadastro de usuários](https://github.com/victorveiga/kanbanBoard/blob/master/tutorial/sigin.png)

## Formulário de Cadastro

![Imagem do cadastro de usuários](https://github.com/victorveiga/kanbanBoard/blob/master/tutorial/new_issue.png)

## Chamados vinculados

![Imagem do cadastro de usuários](https://github.com/victorveiga/kanbanBoard/blob/master/tutorial/user_issues.png)

# Primeiros passos...

Requisitos: 
  * Node.Js na versão 12.18.3 LTS | https://nodejs.org/en/
  
1 - Clonar o repositório e instalar as dependências:
  * git clone https://github.com/victorveiga/kanbanBoard.git
  * cd kanbanBoard
  * npm install
  
2 - Aplicar as migrations:
  
3 - Executar o serviço:
  * npm start
  * acessar a homepage através do link: http://localhost:7070/
