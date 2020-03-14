const {user, host, database, password, port} = require('./config-database')
const { Sequelize, Op, Model, DataTypes, QueryTypes } = require("sequelize");

class BancoDeDados {

    constructor(){
        this.sequelize = new Sequelize(`postgres://${user}:${password}@${host}:${port}/${database}`)

        try {
            this.sequelize.authenticate();
            console.log('A conexão com a base de dados foi estabelecida com sucesso!');
        } catch (error) {
            console.error('Falha ao conectar a base de dados.', error);
        }
    }

    async ExecSQL(pSQL){
        return await this.sequelize.query(pSQL, { type: QueryTypes.SELECT });
    }
}

module.exports = new BancoDeDados()