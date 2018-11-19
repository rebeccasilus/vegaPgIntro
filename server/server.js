// requires
const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const app = express();
const pg = require( 'pg' );


//uses
app.use( express.static( 'server/public/' ) );
app.use( bodyParser.urlencoded( { extended: true } ) );
//globals
const port = process.env.PORT || 5000;
// create our Pool to SQL connections
const Pool = pg.Pool; // this is a class
const pool = new Pool({
    database: 'music_library',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000
}) // end pool

// when connect to db
pool.on('connect', ()=>{
    console.log('connected to DB');
}) // end connect

pool.on('error', (err)=>{
    console.log('error with DB:', err );
}) // end error

// spin up server
app.listen( port, ( req, res )=>{
    console.log( 'server up on:', port );
});

// test route
app.get('/test', (req, res)=>{
    console.log('/test GET hit'); // 1
    // 3 create query
    const queryString = `SELECT * FROM songs`;
    // 4 run the query on the pool
    pool.query( queryString ).then((results)=>{
    // 5 send results back to the client
    res.send(results.rows);
    }).catch((err)=>{
    // 6 handle any errors
console.log('error retrieving data:', err);
    }) // end query
    // res.send('growl'); // 2
}); // end test route

// use the pool and all of its class info