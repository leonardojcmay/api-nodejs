API NodeJS + Express + Mongo

Estrutura e cadastro:

```
npm init -y

yarn add express

yarn add body-parser
```

body-parser: ajuda que o node entenda as requisições enviadas por JSON e por URL

Utilizando banco de dados Mongoodb
```
yarn add mongoose
```

encryptando senha:
```
yarn add bcryptjs
```

Autenticação:

JWT: gerando token para utilizar na autenticação
```
yarn add jsonwebtoken
```

config/auth.json
hash unica para o sistema. Utilizado o md5 para gera-la

middleware: 
validando se realmente o token esta correto
é possivel interceptar o usuario para que ele não consiga prosseguir na aplicação

