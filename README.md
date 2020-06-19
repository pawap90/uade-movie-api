![Continous Integration](https://github.com/pawap90/uade-movie-api/workflows/Continous%20Integration/badge.svg)

# uade-movie-api
UADE | 2020 | Distribuidas | Movie backend API

**Site**: [uade-movieapp-g5-api-dev.herokuapp.com](https://uade-movieapp-g5-api-dev.herokuapp.com/swagger)

API powering the best UADE Movie Mobile app ever.

# Main scripts

## Run the app
```sh
node app.js
```

## Automatic Lint fixes
```sh
npm run lint-fix
```

## Display Lint errors 
```sh
npm run lint
```

# Local setup
Add a .env file on the root folder with the following content:

```
DB_CONNECTIONSTRING=<mongodb-connection-string>
PORT=<port>
ERRORS_DETAILED=true
JWT_EXPIRATION=<expiration-in-seconds>
JWT_SIGNKEY=<jwt-sign-key>
CRYPTO_KEY=<crypto-key>
CRYPTO_ALG=<crypto-algoritm>
```
