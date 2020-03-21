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

    async findByUsername(nome, cb){
        let sql    = `SELECT * FROM USUARIO WHERE upper(USERNAME) LIKE upper('%${nome}%')`
        let record = await this.sequelize.query(sql, { type: QueryTypes.SELECT })
        record     = record[0]
        
        if (!record){ // Se não encontrar o registro
            return cb(null,null)
        }

        if (record.username != nome){
            return cb(null, null)
        }

        return cb(null, record)
    }

    async findById(id,cb){
        let sql    = `SELECT * FROM USUARIO WHERE ID = ${id}`
        let record = await this.sequelize.query(sql, { type: QueryTypes.SELECT })
        record     = record[0]

        if (!record){ // Se não encontrar o registro
            //return cb(null,null)
            return cb(new Error('Usuario ' + id + ' não encontrado'))
        }

        if (record.id != id){
            //return cb(null, null)
            return cb(new Error('Usuario ' + id + ' não encontrado'))
        }

        return cb(null, record)
    }
}

module.exports = new BancoDeDados()