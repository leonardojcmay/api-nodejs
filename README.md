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

Envio de e-mail
Recuperação de senha
fs: utilização de arquivos
path: utilização de caminhos de pastas
```
yarn add fs path
```

recuperação de senha
iremos utilizar mailtrap: uma caixa de e-mail fake

https://mailtrap.io/

criado conta no mailtrap
ir no demo, integration coloca nodemailer

```
yarn add nodemailer
```

pacote que permite trabalhar com template de e-mail
```
yarn add nodemailer-express-handlebars
```

utilizando crypto para gerar um token para validação do esqui minha senha