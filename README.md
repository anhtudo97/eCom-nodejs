# Ecommerce backend

## Command gen private key
```
    openssl genrsa -out private_key.pem 2048
```

## Command gen public key
```
    openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## Tech stack & library

- Nodejs (Express)
- Helmet
- Morgan
- Compression