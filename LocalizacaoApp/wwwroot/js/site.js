$(document).ready(function () {

    $("#latitude, #longitude").bind('keypress', verificarInputLatitudeLongitude);
    chamarApi(null, 'GET', 'http://localhost:50209/api/Localizacao/Listar', callbackCarregarListaLocalizacoes);
});

$("#btnSalvar").click(function () {
    var url = "http://localhost:50209/api/Localizacao/Salvar";
    var localizacao = {
        id: 0,
        nome: $("#amigo").val(),
        latitude: $("#latitude").val(),
        longitude: $("#longitude").val()
    };

    if (validarCampos(localizacao)) {
        chamarApi(localizacao, "POST", url, alimentarTabelaLocalizacao);
    }
});

$("#btnObterToken").click(function () {
    var url = "http://localhost:50209/api/Token/GetToken";
    var usuarioApi = {
        UserID: "1",
        AccessKey: "123"
    };

    chamarApi(usuarioApi, "POST", url, callbackArmazenarTokenLocalStorage);
});

var verificarProximidade = function (obj) {

    var localizacao = { id: $(obj).attr("data-id") };
    chamarApi(localizacao, 'POST', 'http://localhost:50209/api/Localizacao/VerificarProximidade', callbackMostrarProximidade);
};

var verificarInputLatitudeLongitude = function (e) {
    if (e.which != 8 && e.which != 0 && e.which != 45 && e.which != 46 && (e.which < 48 || e.which > 57))
        return false;
}

var verificarBotaoToken = function () {
    if (localStorage.length == 0)
        $('#btnObterToken').attr('style', 'display:block;');
    else
        $('#btnObterToken').attr('style', 'display:none;');
};

var callbackMostrarProximidade = function (data) {

    var msg = '<b>Seus Amigos mais próximos são: </b></br></br>';

    $.each(data.response, function (i, item) {
        msg += item.item1 + '</br>'
    });

    msg += '</br>';
    msg += '<b>Clique no ícone do Mapa para ver o endereço de cada um.</b>';

    mostrarMensagem(msg);
}

var callbackCarregarListaLocalizacoes = function (data) {
    alimentarTabelaLocalizacao(data);
};

var callbackArmazenarTokenLocalStorage = function (data) {

    var acesso = {
        "tokenStatus": data.message,
        "tokenExpira": data.expiration,
        "tokenAcesso": data.accessToken
    };

    localStorage.clear();
    localStorage.setItem("tokenAcesso", JSON.stringify(acesso));

    msg = '';
    msg = "Autenticação Token: " + data.message + '</br>';
    msg += "Token expira em: " + data.expiration.substr(0, 10).split('-').reverse().join('/') + ' ' + data.expiration.substr(11, 16);

    verificarBotaoToken();
    mostrarMensagem(msg, 1);
};

var callbackMarcarLocalizacaoMap = function (data) {

    if (data.action && data.action == 'Salvar')
        mostrarMensagem('Localização cadastrada com sucesso!', 1);

    var map = carregarMapa();
    posicionarMapaGoogle(data, map);
};

var alimentarTabelaLocalizacao = function (data) {

    $('#tableLocalizacoes tr').remove();

    var html = '';
    $.each(data.response, function (i, item) {
        html +=
            '<tr id=' + item.id + '>' +
            '<td>' + item.id + '</td>' +
            '<td>' + item.nome + '</td>' +
            '<td>' + item.latitude + '</td>' +
            '<td>' + item.longitude + '</td>' +
            '<td><input type="button" id="btn_' + item.id + '" data-id="' + item.id + '" value="Verificar Amigos Próximos" class="btn-danger btn-xs" onclick="verificarProximidade(this)"></td>' +
            '</tr>';

        callbackMarcarLocalizacaoMap(data);
    });

    $('#tableLocalizacoes').append(html);
}

var chamarApi = function (data, type, url, callback) {

    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        crossDomain: true,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + (localStorage.length > 0 ? JSON.parse(localStorage.getItem("tokenAcesso")).tokenAcesso : ""),
        },
        success: function (data) {

            switch (data.status) {
                case 200:
                    callback(data);
                    break;
                case 500:
                    mostrarMensagem(data.response.Message, 3);
                    break;
            }
        },
        beforeSend: function () {
            $("body").append(
                '<div id="loadingDiv" class="loader">Aguarde...</div>'
            );
        },
        complete: function () {
            $(".loader").remove();
        },
        error: function (xhr, textStatus, errorThrown) {

            if (errorThrown == "Unauthorized") {

                $("#btnObterToken").attr("style", "display:block;");

                if (localStorage.length <= 0)
                    mostrarMensagem("(401) - Não autorizado! Solicite um token de acesso a API.", 2);
                else
                    mostrarMensagem("(401) - Token de acesso a API expirado! Solicite um novo Token.", 2);
            } else {
                mostrarMensagem(errorThrown.message, 3);
            }
        }
    });
};

var mostrarMensagem = function (msg, type) {
    switch (type) {
        case 1: $("#divErros").html('<div id="msgErros" class="alert alert-success" role="alert">' + msg + "</div>").delay(6000).show().fadeOut('slow'); break;
        case 2: $("#divErros").html('<div id="msgErros" class="alert alert-warning" role="alert">' + msg + "</div>").delay(6000).show().fadeOut('slow'); break;
        case 3: $("#divErros").html('<div id="msgErros" class="alert alert-danger" role="alert">' + msg + "</div>").delay(6000).show().fadeOut('slow'); break;
        default: $("#divErros").html('<div id="msgErros" class="alert alert-info" role="alert">' + msg + "</div>").delay(6000).show().fadeOut('slow'); break;
    }
};

var validarCampos = function (data) {

    var validacao = $("<div></div>");
    var erros = [];

    var latitudeInicialPermitida = -23.568924;
    var latitudeFinalPermitida = -22.568924;
    var longitudeInicialPermitida = -46.651657;
    var longitudeFinalPermitida = -45.651657;

    if (data.nome == "") validacao.append("Informe o Nome!</br>");
    if (data.latitude == "") validacao.append("Informe a Latitude!</br>");
    if (data.longitude == "") validacao.append("Informe a Longitude!</br>");

    if (isNaN(data.latitude)) validacao.append("Latitude é inválida!</br>");
    if (isNaN(data.longitude)) validacao.append("Longitude é inválida!</br>");

    if (data.latitude != "" && (data.latitude < latitudeInicialPermitida || data.latitude > latitudeFinalPermitida))
        validacao.append("Latitude deve estar entre " + latitudeInicialPermitida + " e " + latitudeFinalPermitida + "</br>");

    if (data.longitude != "" && (data.longitude < longitudeInicialPermitida || data.longitude > longitudeFinalPermitida))
        validacao.append("Longitude deve estar entre " + longitudeInicialPermitida + " e " + longitudeFinalPermitida);

    if (validacao.html() != "") erros.push(validacao.html());

    if (erros.length > 0) {
        mostrarMensagem(erros, 3);
        return false;
    } else {
        $("#msgErros").remove();
    }

    return true;
};

var carregarMapa = function () {

    var latlng = new google.maps.LatLng(-23.568924, -46.651657);
    var myOptions = {
        zoom: 17,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(
        document.getElementById("divGoogleMap"),
        myOptions
    );

    map.setCenter(new google.maps.LatLng(-23.568924, -46.651657));

    return map;
};

var posicionarMapaGoogle = function (data, map) {

    $.each(data.response, function (i, item) {

        var endereco = '';
        var posicao = new google.maps.LatLng(item.latitude, item.longitude);

        $.getJSON('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + item.latitude + ',' + item.longitude + '&sensor=true/false', function (data) {

            if (data.results[0])
                endereco = '<b>' + item.nome + '</b>' + '</br>' + data.results[0].formatted_address;

            var infowindow = new google.maps.InfoWindow({
                content: endereco,
                maxWidth: 500,
            });

            var marker = new google.maps.Marker({
                position: posicao,
                map: map,
                animation: google.maps.Animation.DROP,
                title: item.nome
            });

            marker.addListener('click', function () {
                infowindow.open(map, marker);
            });
        });

    });
};
