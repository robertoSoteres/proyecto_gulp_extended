/* MÓDULO FOTOCOPIABLES*/
function Fotocopiables() {

    var DATA_JSON = null;
    var scope_path = ambient.scope_path;



    /**
     * Inicializa el módulo Fotocopiables
     * @function
     */
    function init() {

        // document.getElementById('boton-recursos').className = "modulo_activo";

        $("#modulo-fotocopiables").html('<div class="fotocopiables_container"><h2>' + API.getMessage('recursos_fotocopiables') + ' </h2></div>');

        var fotocopiables_file = "fotocopiables/fotocopiables.json";

        if (DATA_JSON === null) {
            //lee el contenido del json y lo muestra en pantalla
            $.getJSON(scope_path + fotocopiables_file, function (data) {

                DATA_JSON = data;
                iniciarRender(DATA_JSON);
            });
        } else {
            iniciarRender(DATA_JSON);
        }

    }

    function iniciarRender(data) {
        var fotocopiables_path = scope_path + "fotocopiables/";
        var resultado = "";
        resultado += '<div class="contenedor-izq">' +
                '<ul id="lst-fotocopiables">';
        for (var i in data) {
            if (i === "0") {
                resultado += ('<li><img class="img_th seleccion" src="' + fotocopiables_path + data[i] + '"></li>');
            } else {
                resultado += ('<li><img class="img_th" src="' + fotocopiables_path + data[i] + '"></li>');
            }
        }
        resultado += '</ul> ' +
                '<div class="scroller_top icon-arrow_back"></div>' +
                '<div class="scroller_bottom icon-arrow_back"></div></div>';
        //            $(".fotocopiables_container").append(resultado, '<div class="contenedor-der"> <div id="contenedor-imagen"><img src="' + fotocopiables_path + data[0] + '"></div> <a class="btn-imprimir" href="javascript:window.print()">Imprimir</a></div>');

        var print = '';
        if (IsInPlayer()) {
            print = '';
        } else {
            print = '<a class="btn-imprimir" id="imprimirPDF"></a>';
        }

        var download = '';
        var longitudJSON;
        longitudJSON = data.length - 1;
        if (isAndroidApp || isChromebookApp) {
            download = '<a class="btn-descargar" href="/api/download-image?href=' + fotocopiables_path + data[longitudJSON] + '"></a>';
        } else {
            download = '<a class="btn-descargar" id="btn_descarga" download="" href="' + fotocopiables_path + data[longitudJSON] + '"></a>';
        }

        if (isWindowsApp) {

            download = '';
        }

        $(".fotocopiables_container").append(resultado, '<div class="contenedor-der">' +
                '<div id="contenedor-imagen" class="flex_center">' +
                '<img id="imagen_selecionada" src="' + fotocopiables_path + data[0] + '">' +
                '</div>' +
                '<div id="contenedorBtns" class="flex_center">' +
                print +
                download +
                '</div>' +
                '</div>');




        $('.btn-descargar').off().on('click', function (e) {
            if (!isAndroidApp && !isChromebookApp) {
                e.preventDefault();
                if (isIE()) {
                    printPdf(data, false, longitudJSON, fotocopiables_path);
                } else {
                    var save = document.createElement('a');
                    save.href = $(this).attr('href');
                    save.download = $(this).attr('download');
                    save.target = '_blank';
                    document.body.appendChild(save);
                    save.click();
                    document.body.removeChild(save);
                }
                return false;
            }
        });

        $('#imprimirPDF').off().on('click', function (e) {
            e.preventDefault();
            printPdf(data, true, longitudJSON, fotocopiables_path);
            return false;
        });


        iniciarEventos();
        // Scroll - arriba
        $('.scroller_top').unbind('click').click(function () {

            $('#lst-fotocopiables').animate({
                scrollTop: ($('#lst-fotocopiables').scrollTop() - 450)
            }, "slow");

        });

        // Scroll - abajo
        $('.scroller_bottom').unbind('click').click(function () {

            $('#lst-fotocopiables').animate({
                scrollTop: ($('#lst-fotocopiables').scrollTop() + 450)
            }, "slow");

        });

    }

    function printPdf(data, print, longitudJSON, fotocopiables_path) {
        $('#printF').remove();

        var save = document.createElement('iframe');
        save.style.display = "none";
        save.style.position = "absolute";
        save.style.left = '5000px';
        save.setAttribute('id', 'printF');
        save.src = fotocopiables_path + data[longitudJSON];
        document.body.appendChild(save);
        save.focus();
        if (print) {
            save.contentWindow.print();
        }
    }

    function iniciarEventos() {

        $('.img_th').on("click", function (event) {
            //console.log(event);
            //obtener el src de la imagen de la lista
            var ruta_imagen = $(this).attr('src');
            //añadir el src a la imagen del contenedor
            $('#contenedor-imagen > img').attr('src', ruta_imagen);
            //estilos para la imagen seleccionada
            $('.img_th').not(this).removeClass('seleccion');
            $(this).addClass('seleccion');

            //ajuste de scroll automático al seleccionar item
            $('#lst-fotocopiables').animate({scrollTop: ($(this)[0].offsetTop - 350)}, "slow");

        });
    }

    function isIE() {
        return /Trident\/|MSIE/.test(window.navigator.userAgent);
    }


//MÉTODOS PÚBLICOS
    this.iniciarEventos = iniciarEventos;

    init();

}
