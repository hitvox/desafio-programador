## Teste Programador PHP LogManager

O projeto contém docker-compose com PHP 8 e MySQL, tendo a API sido desenvolvida em Laravel 10 estando na pasta "/api" e o frontend em React localizado na pasta "/app".


## Instalação
Para começar a utilizar o projeto, execute o comando abaixo no terminal para clonar o repositório:<br>
``git clone <url do repositório>``<br>

Navegue até a pasta /api e execute os comandos para rodar as dependências e migrações do Laravel:<br>
``composer install``<br>
``php artisan migrate``

Navegue até a pasta /app e execute o comando para instalar as dependências:<br>
``npm install``

Em seguida, execute o comando abaixo para iniciar os containers Docker:<br>
``docker-compose up --build -d``<br><br>

Aguarde até que todos os serviços estejam iniciados.<br><br>

Caso necessário, utilize algum serviço de tunnel ou SSL para HTTPS para facilitar o cadastro da URL no Mercado Livre.

## Limitações
As categorias são muito extensas, portanto limitei na API em 25 categorias apenas para otimização e exemplo simples para a lista direta no campo select.
<br><br>

Em um projeto real poderia ser definido outra forma mais otimizada com busca por exemplo, para facilitar o carregamento.
<br><br>

Observação: Devido a problemas com a minha conta utilizada para a publicação de produtos, não foi possível validar a cadastro de produtos. Além disso, a listagem de produtos está estática e apenas um produto está sendo exibido.
<br><br>

Desde já, agradeço pela atenção e análise. Qualquer dúvida, estou à disposição!
