(function () {
  "use strict";

  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  function porId(id) {
    return document.getElementById(id);
  }

  function dosDigitos(n) {
    return n < 10 ? "0" + n : String(n);
  }

  // ---------- Menú (hamburguesa en celular) ----------
  function iniciarMenu() {
    var boton = document.querySelector(".menu-boton");
    var menu = porId("menu");
    if (!boton || !menu) return;

    function abrir(si) {
      boton.setAttribute("aria-expanded", si ? "true" : "false");
      boton.setAttribute("aria-label", si ? "Cerrar menú" : "Abrir menú");
      menu.classList.toggle("abierto", si);
    }

    boton.addEventListener("click", function () {
      abrir(boton.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) abrir(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && boton.getAttribute("aria-expanded") === "true") {
        abrir(false);
        boton.focus();
      }
    });

    document.addEventListener("click", function (e) {
      if (boton.getAttribute("aria-expanded") === "true" && !e.target.closest(".cabecera")) {
        abrir(false);
      }
    });
  }

  // ---------- Versículo del día ----------
  function mostrarVersiculo(v) {
    var texto = porId("versiculo-texto");
    var cita = porId("versiculo-cita");
    var caja = porId("versiculo");
    if (!texto || !cita) return;

    if (!v || !v.texto) {
      texto.textContent = "Todavía no hay versículo cargado. Volvé más tarde.";
      texto.className = "versiculo-error";
      cita.textContent = "";
      return;
    }
    texto.textContent = v.texto;
    cita.textContent = v.cita || "";
    if (caja) caja.classList.add("listo");
  }

  function errorVersiculo() {
    var texto = porId("versiculo-texto");
    if (!texto) return;
    texto.textContent = "No se pudo cargar el versículo. Recargá la página para intentar de nuevo.";
    texto.className = "versiculo-error";
  }

  // ---------- Anuncios ----------
  function mostrarAnuncios(lista) {
    var ul = porId("anuncios");
    var vacio = porId("anuncios-vacio");
    if (!ul || !vacio) return;

    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    var items = (Array.isArray(lista) ? lista : [])
      .map(function (a) {
        var p = String(a.fecha || "").split("-");
        var f = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
        return { fecha: f, datos: a };
      })
      .filter(function (x) {
        return !isNaN(x.fecha) && x.fecha >= hoy && x.datos.titulo;
      })
      .sort(function (a, b) {
        return a.fecha - b.fecha;
      });

    ul.textContent = "";
    if (items.length === 0) {
      vacio.hidden = false;
      return;
    }
    vacio.hidden = true;

    items.forEach(function (x) {
      var li = document.createElement("li");
      li.className = "anuncio";

      var t = document.createElement("time");
      t.className = "anuncio-fecha";
      t.setAttribute("datetime", x.datos.fecha);
      var dia = document.createElement("span");
      dia.className = "anuncio-dia";
      dia.textContent = x.fecha.getDate();
      var mes = document.createElement("span");
      mes.className = "anuncio-mes";
      mes.textContent = MESES[x.fecha.getMonth()];
      t.appendChild(dia);
      t.appendChild(mes);

      var cuerpo = document.createElement("div");
      var h = document.createElement("h3");
      h.textContent = x.datos.titulo;
      cuerpo.appendChild(h);

      if (x.datos.hora) {
        var hora = document.createElement("p");
        hora.className = "anuncio-hora";
        hora.textContent = x.datos.hora + " hs";
        cuerpo.appendChild(hora);
      }
      if (x.datos.detalle) {
        var det = document.createElement("p");
        det.className = "anuncio-detalle";
        det.textContent = x.datos.detalle;
        cuerpo.appendChild(det);
      }

      li.appendChild(t);
      li.appendChild(cuerpo);
      ul.appendChild(li);
    });
  }

  function errorAnuncios() {
    var vacio = porId("anuncios-vacio");
    if (!vacio) return;
    vacio.textContent = "No se pudieron cargar los anuncios. Recargá la página para intentar de nuevo.";
    vacio.hidden = false;
  }

  // ---------- Franja "faltan X días" en Home ----------
  function mostrarFaltan(camp) {
    var franja = porId("faltan");
    var texto = porId("faltan-texto");
    if (!franja || !texto || !camp) return;

    var inicio = new Date(camp.fecha);
    var resto = inicio - new Date();
    if (isNaN(inicio) || resto <= 0) return;

    var dias = Math.floor(resto / 86400000);
    if (dias >= 2) texto.textContent = "Faltan " + dias + " días para el campamento";
    else if (dias === 1) texto.textContent = "Falta 1 día para el campamento";
    else texto.textContent = "Falta menos de un día para el campamento";
    franja.hidden = false;
  }

  // ---------- Página Campamento ----------
  function mostrarCampamento(camp) {
    var grilla = porId("cuenta-grilla");
    var aviso = porId("cuenta-aviso");
    var mensaje = porId("cuenta-mensaje");
    var nota = porId("cuenta-nota");
    if (!grilla || !aviso || !mensaje) return;

    camp = camp || {};

    if (camp.nombre) porId("camp-nombre").textContent = camp.nombre;

    var inicio = new Date(camp.fecha);
    var fechaValida = !isNaN(inicio);

    if (fechaValida) {
      var f = porId("camp-fecha");
      var texto = inicio.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      });
      texto = texto.charAt(0).toUpperCase() + texto.slice(1);
      var hora = inicio.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false });
      f.textContent = texto + ", " + hora + " hs";
      f.hidden = false;
    }
    if (camp.lugar) {
      var l = porId("camp-lugar");
      l.textContent = camp.lugar;
      l.hidden = false;
    }
    if (camp.detalle) {
      var d = porId("camp-detalle");
      d.textContent = camp.detalle;
      d.hidden = false;
    }

    if (!fechaValida) {
      mensaje.textContent = "Todavía no hay fecha confirmada para el campamento.";
      nota.textContent = "Cuando la sepamos, la cuenta regresiva empieza acá.";
      nota.hidden = false;
      return;
    }

    var fin = camp.fin ? new Date(camp.fin) : null;
    var intervalo = null;

    function pintar() {
      var ahora = new Date();
      var resto = inicio - ahora;

      if (resto <= 0) {
        grilla.hidden = true;
        aviso.hidden = false;
        if (fin && !isNaN(fin) && ahora >= fin) {
          mensaje.textContent = "El campamento terminó.";
          nota.textContent = "Pronto vas a ver la fecha del próximo.";
          nota.hidden = false;
        } else {
          mensaje.textContent = "¡Llegó el campamento!";
          nota.hidden = true;
        }
        if (intervalo) clearInterval(intervalo);
        return;
      }

      var s = Math.floor(resto / 1000);
      porId("c-dias").textContent = dosDigitos(Math.floor(s / 86400));
      porId("c-horas").textContent = dosDigitos(Math.floor((s % 86400) / 3600));
      porId("c-minutos").textContent = dosDigitos(Math.floor((s % 3600) / 60));
      porId("c-segundos").textContent = dosDigitos(s % 60);
      grilla.hidden = false;
      aviso.hidden = true;
    }

    pintar();
    if (inicio - new Date() > 0) intervalo = setInterval(pintar, 1000);
  }

  function errorCampamento() {
    var mensaje = porId("cuenta-mensaje");
    var nota = porId("cuenta-nota");
    if (!mensaje) return;
    mensaje.textContent = "No se pudo cargar la fecha del campamento.";
    if (nota) {
      nota.textContent = "Recargá la página para intentar de nuevo.";
      nota.hidden = false;
    }
  }

  // ---------- Juegos ----------
  function mostrarJuegos(lista) {
    var ul = porId("juegos");
    var vacio = porId("juegos-vacio");
    if (!ul || !vacio) return;

    var items = (Array.isArray(lista) ? lista : []).filter(function (j) {
      return j && j.titulo;
    });
    ul.textContent = "";
    if (items.length === 0) {
      vacio.hidden = false;
      return;
    }
    vacio.hidden = true;

    items.forEach(function (j) {
      var li = document.createElement("li");
      li.className = "juego";
      var a = document.createElement(j.enlace ? "a" : "div");
      if (j.enlace) a.setAttribute("href", j.enlace);
      var h = document.createElement("h3");
      h.textContent = j.titulo;
      a.appendChild(h);
      if (j.descripcion) {
        var p = document.createElement("p");
        p.textContent = j.descripcion;
        a.appendChild(p);
      }
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  function errorJuegos() {
    var vacio = porId("juegos-vacio");
    if (!vacio) return;
    vacio.textContent = "No se pudieron cargar los juegos. Recargá la página para intentar de nuevo.";
    vacio.hidden = false;
  }

  // ---------- Arranque ----------
  iniciarMenu();

  fetch("config.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("config.json: " + r.status);
      return r.json();
    })
    .then(function (config) {
      mostrarVersiculo(config.versiculo);
      mostrarAnuncios(config.anuncios);
      mostrarFaltan(config.campamento);
      mostrarCampamento(config.campamento);
      mostrarJuegos(config.juegos);
    })
    .catch(function () {
      errorVersiculo();
      errorAnuncios();
      errorCampamento();
      errorJuegos();
    });
})();
