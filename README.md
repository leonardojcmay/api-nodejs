**<h1>API NodeJS + Express + Mongo</h1>**

**Estrutura e cadastro:**
<br>**Body-parser:** ajuda que o node entenda as requisições enviadas por JSON e por URL.
```
yarn init -y

yarn add express

yarn add body-parser
```

Utilizando banco de dados **Mongoodb:**
```
yarn add mongoose
```

**Encryptando** password:
```
yarn add bcryptjs
```

**Autenticação:**
<br>**JWT:** gerando token para utilizar na autenticação
```
yarn add jsonwebtoken
```

Arquivo config/auth.json: hash unica para o sistema. Utilizado o md5 para gera-la.

**Middleware:** é possivel interceptar o usuario para que ele não consiga prosseguir na aplicação. Feito validação se realmente o token esta correto. 

**Envio de e-mail / Recuperação de senha:**
<br>**fs:** utilização de arquivos
<br>**path:** utilização de caminhos de pastas
```
yarn add fs path
```

**Recuperação de senha:** foi utilizado mailtrap(uma caixa de e-mail fake)
<br>https://mailtrap.io/
<br>Criado conta no mailtrap, ir no demo, integration selecionar nodemailer

```
yarn add nodemailer
```

Pacote que permite trabalhar com template de e-mail:
```
yarn add nodemailer-express-handlebars
```

Utilizado crypto para gerar um token para validação da função "esqueci minha senha"

**Relacionamentos entre as tabelas**
<br>- user
<br>- project
<br>- task

**CRUD:**
<br>- Listagem de projetos 
<br>- Listagem de projetos por id
<br>- Criar um novo projeto
<br>- Deletar um projeto


