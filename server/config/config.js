///////////
/////
//////// PUERTO
//////
//////

process.env.PORT = process.env.PORT || 3000;



/////
//////// entorno de programacion local o nuve
//////
//////


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/////
//////// caducidad TOKEN
//////
//////
process.env.CAD_TOKEN = "7d";
/////
//////// SEMILLA DEL TOKEN
//////
//////

process.env.SEED = process.env.SEED || 'jojeitho';

/////
//////// entorno de base de datos
//////
//////


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/login';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URL_DB = urlDB;


/////
/////
////GOOGLE CLIENT ID
//////
//////


process.env.CLIENT_ID = process.env.CLIENT_ID || '1013797591310-4gkshed9vilbvg62hudccqakkpf9d7hl.apps.googleusercontent.com';