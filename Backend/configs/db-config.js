const DBConfig = {
    host		    : "aws-0-us-east-2.pooler.supabase.com" , 
    database		: "postgres"                            ,
    user    		: "postgres.qhtjlctnsoajgouinjaq"       , 
    password		: "MEDUPmedup2025"               ,
    port            : 6543
}

//???pool mode???

//???ABAJO??? 

/*
const DBConfigBest = {
    host        : process.env.DB_HOST       ?? '',
    database    : process.env.DB_DATABASE   ?? '',
    user        : process.env.DB_USER       ?? '',
    password    : process.env.DB_PASSWORD   ?? '',
    port        : process.env.DB_PORT       ?? 6543
    //max                     : 20,       //maximum number of clients the pool should contain by default this is set to 10.
    //idleTimeoutMillis       : 30000,
    //connectionTimeoutMillis : 2000
}
*/
export default DBConfig;