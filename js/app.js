fetch("config.json", { cache: "no-store" })
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (config) {
    // Palabra del día
    document.getElementById("palabra").textContent = config.palabra;

    // Contador de días (solo se muestra si "activo" es true)
    var contador = document.getElementById("contador");
    if (config.contador && config.contador.activo) {
      var dias = Math.ceil((new Date(config.contador.fecha) - new Date()) / 86400000);
      contador.textContent = config.contador.titulo + ": " + dias + " días";
      contador.hidden = false;
    } else {
      contador.hidden = true;
    }

    // Tema visual (por ejemplo "navidad"); si no hay, queda "normal"
    document.body.dataset.tema = config.tema || "normal";
  })
  .catch(function () {
    document.getElementById("palabra").textContent =
      "No se pudo cargar config.json (abrí la página desde el hosting o un servidor local)";
  });
