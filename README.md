# Introdução

Aplicação simples que verifica a distancia entre uma pessoa e seus amigos mais próximos com base em GeoLocalização.

# Detalhes

Ao iniciar a aplicação, o usuário deve criar uma Localização com base no Nome, Latitude e Longitude.
Ao tentar criar Localização a aplicação tentará invokar a API de Localizações e será barrada com um HttpResponseMessage 401 (Not Authorized) pois a API necessita de um token de Acesso.

Para acessar a WEB API será necessário um token JWT do tipo Bearer que deverá ser solicitado pelo usuário na aplicação através do botão "Clique aqui para obter um Token de Acesso".

Uma vez obtido um token válido, o mesmo será armazenado no localstorage do usuário com período de expiração de 1h.
Ao salvar uma nova localização, o sistema executará o callback da chamada AJAX POST carregando o mapa (Google Maps API) junto com a lista de localizações salvas e marcando a localização no google maps. 
Ao clicar na marcação do mapa é possível visualizar o endereço da localização.

Após criada as localizações, o google maps marcará todas as localizações e o botão "Verificar Amigos Próximos" te permitirá visualizar através de um cálculo (Angulo x Raio Equador) quais os 3 amigos mais próximos da referencia clicada.

Observações:
- A Aplicação é integração com Google Maps API.
- A Arquitetura é baseada em DDD respeitando as responsabilidades de cada camada, interfaces e respositórios.
- Para construção da aplicação foi utilizado o template (scaffold) padrão do ASP.NET Core Web App.
- Todos os cálculos são armazenados na tabela CalculoHistoricoLog.
- Para integração com WEB API foi utilizado AJAX Jquery.
- Para comunicação com banco de dados foi utilizado Entity Framework Core 6.0 com Fluent Mapping.
- O banco de dados escolhido foi o SQL Express.

# Frameworks e Tecnologias utilizadas

- ASP.NET Core 2.0 Web App
- ASP.NET Core 2.0 Web Api
- JWT Authorization Web Tokens (Bearer)
- Entity Framework Core 6.0
- Dependency Injection
- DDD (Domain Driven Design)
- Integração Google Maps API
- SQL Server Express 2017
- Bootstrap

# Pré Requisitos para rodar o App

- Instalar o suporte IIS para rodar aplicaçoes ASP.NET CORE (pode ser obtido através do VS Installer).
- Instalar o SQL SERVER EXPRESS EDITION.
- Rodar os scrips de criação do DataBase e Tabelas (/Scripts.rar).

# Conclusão

Este App foi criado para fins de estudo mas serve também como base de programação para desenvolvedores.
