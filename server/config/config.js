/*_________________________
      PUERTO
________________________*/

process.env.PORT = process.env.PORT || 3000;
/*_________________________
entorno de programacion local o nuve
________________________*/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
/*_________________________
    caducidad del token
________________________*/
process.env.CAD_TOKEN = "7d";

/*_________________________
     semilla del token
________________________*/

process.env.SEED = process.env.SEED || 'jojeitho';

/* _________________________
        entorno DB
________________________*/

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/login';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URL_DB = urlDB;

/*_________________________
      GOOGLE CLIENT ID
_________________________*/

process.env.CLIENT_ID = process.env.CLIENT_ID || '1013797591310-4gkshed9vilbvg62hudccqakkpf9d7hl.apps.googleusercontent.com';