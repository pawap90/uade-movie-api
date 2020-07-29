![Continous Integration](https://github.com/mauro-codes/uade-gym-api/workflows/Continous%20Integration/badge.svg)

# uade-gym-api
UADE | 2020 | Aplicaciones Interactivas | Grupo 7 | Gym backend API

**Site**: [uade-gym-api-g7-dev.herokuapp.com](https://uade-gym-api-g7-dev.herokuapp.com/swagger)

REST API powering the best UADE Gym app ever.

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
JWT_SIGNKEY=<jwt-sign-key>
CRYPTO_KEY=<crypto-key>
CRYPTO_ALG=<crypto-algoritm>
CREDITEX_URL=<creditex-url>
CREDITEXT_MERCHANT_ID=<creditex-merchant-id>
```
