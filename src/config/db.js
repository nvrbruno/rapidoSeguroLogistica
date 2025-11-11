const sql = require("mssql");

const config = {
    user: 'daniRodrigues_SQLLogin_1', 
    password: 'fu73a8wf1y',
    server: 'rapidoSeguroLogistica.mssql.somee.com',
    database: 'rapidoSeguroLogistica',
    options: {
        encrypt: true ,
        trustServerCertificate: true
    }
}

async function getConnection(){
    try {
        
        const pool = await sql.connect(config);
        return pool;

    } catch (error) {
        console.error('Erro na conexão do SQL Server:', error);
    }
}

module.exports = {sql, getConnection};