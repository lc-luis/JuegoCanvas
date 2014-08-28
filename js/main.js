function inicio()
{
	dibujo = document.getElementById("miCanvas");
	ctx = dibujo.getContext("2d");
	cargarImagenes();
	agregarEventosTeclado();
	intervalo = window.setInterval(function(){
		frameLoop();
	}, 60);

}

//Variables
var dibujo, ctx, fondo, intervalo, pared, bola, direccion, hayContacto = false;
var muros_dibujados = false;
var juego = {estado : 'iniciando'};
var teclado = {};
var muros = [];
var murosInternos = [];
var texto =
{
	titulo: '',
	subtitulo: ''
};
var pelota = 
{
	x: 100,
	y: 400,
	width: 50,
	height: 50
};
//Funciones

function cargarImagenes()
{
	fondo = new Image();
	fondo.src = 'img/fondo.png';
	pared = new Image();
	pared.src = 'img/muro.png';
	bola = new Image();
	bola.src = 'img/bola.png';
}
function dibujarFondo()
{
	ctx.drawImage(fondo,0,0,dibujo.width,dibujo.height);
}
function dibujarTexto()
{
	if(juego.estado == 'iniciando')
	{
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle = 'Red';
		ctx.font = 'Bold 40pt Arial';
		ctx.strokeStyle = 'Black';
		ctx.fillText(texto.titulo, 90, 200);
		ctx.strokeText(texto.titulo, 90, 200);
		ctx.font = '14pt Arial';
		ctx.fillStyle = 'black';
		ctx.fillText(texto.subtitulo, 275, 250);
		ctx.restore();
	}
}
function dibujarMuro()
{
	if(juego.estado == 'nivel 1')
	{
		//Muro superior limite
		if(muros_dibujados == false)
		{
			for(var i = 0; i <= 13; i++)
			{
				muros.push({
					x: 50 + (i * 50),
					y: 50,
					width: 50,
					height: 50,
					limite: true
				})
			}
			//Muro inferior limite
			for(var i = 0; i <= 13; i++)
			{
				muros.push({
					x: 50 + (i * 50),
					y: dibujo.height - 100,
					width: 50,
					height: 50,
					limite: true
				})
			}
			//Muro vertical izquierdo limite
			for(var i = 0; i <= 9; i++)
			{
				muros.push({
					x: 50,
					y: 50 + (i * 50),
					width: 50,
					height: 50,
					limite: true
				})
			}
			//Muro vertical derecho limite
			for(var i = 0; i <= 9; i++)
			{
				muros.push({
					x: dibujo.width - 100,
					y: 50 + (i * 50),
					width: 50,
					height: 50,
					limite: true
				})
			}
			//Muro vertical central
			for(var i = 0; i <= 1; i++)
			{
				muros.push({
					x: 350,
					y: 50 + (i * 50),
					width: 50,
					height: 50,
					limite: false
				})
			}
			//Muro vertical central
			for(var i = 0; i <= 4; i++)
			{
				muros.push({
					x: 350,
					y: 250 + (i * 50),
					width: 50,
					height: 50,
					limite: false
				})
			}
			murosInternos = muros.filter(function(muros)
			{
				return muros.limite == false;
			});
			muros_dibujados = true;
		}
	}
	for(var i in muros)
	{
		var muro = muros[i];
		ctx.save();
		ctx.drawImage(pared, muro.x, muro.y, muro.width, muro.height);
		ctx.restore();
	}
}
function dibujarBola()
{
	if(juego.estado == 'nivel 1')
	{
		ctx.save();
		ctx.drawImage(bola, pelota.x, pelota.y, pelota.width, pelota.height);
		ctx.restore();
	}
}
function moverBola()
{
	if(teclado[37])//Flecha izquierda
	{
		//Movimiento a la izquierda
		direccion = "izquierda";
		pelota.x -=15;
		verificarContacto();
		if(hayContacto)
		{
			pelota.x +=15;
			//hayContacto = false;
		}
		if(pelota.x < 100)
		{
			pelota.x = 100;
		}
	}
	if(teclado[39])//Flecha derecha
	{
		//Movimiento a la derecha
		direccion = "derecha";
		var limite = dibujo.width - 150;
		pelota.x +=15;
		verificarContacto();
		if(hayContacto)
		{
			pelota.x -=15;
			//hayContacto = false;
		}
		if(pelota.x > limite)
		{
			pelota.x = limite;
		}
	}
	if(teclado[38])//Flecha arriba
	{
		//Movimiento arriba
		direccion = "arriba";
		pelota.y -=15;
		verificarContacto();
		if(hayContacto)
		{
			pelota.y +=15;
			//hayContacto = false;
		}
		if(pelota.y < 100)
		{
			pelota.y = 100;
		}
	}
	if(teclado[40])//Flecha abajo
	{
		//Movimiento abajo
		direccion = "abajo";
		var limite = dibujo.height - 150;
		pelota.y +=15;
		verificarContacto();
		if(hayContacto)
		{
			pelota.y -=15;
			//hayContacto = false;
		}
		if(pelota.y > limite)
		{
			pelota.y = limite;
		}
	}
}
function estadoJuego()
{
	if(juego.estado == 'iniciando')
	{
		texto.titulo = 'Juego de Luis en Canvas';
		texto.subtitulo = 'Presiona Enter para Empezar';
	}
	if(teclado[13])//Enter
	{
		juego.estado = 'nivel 1';
	}
}
function agregarEventosTeclado()
{	
	agregarEventos(document, "keydown", function(e)
	{
		//Ponemos en true la tecla presionada
		teclado[e.keyCode] = true;
		console.log(e.keyCode);
	});
	agregarEventos(document, "keyup", function(e)
	{
		//Ponemos en falso la tecla soltada
		teclado[e.keyCode] = false;
	});

	function agregarEventos(elemento, nombreEvento, funcion)
	{
		if (elemento.addEventListener) 
		{
			//Navegadores de verdad
			elemento.addEventListener(nombreEvento, funcion, false);
		} 
		else if(elemento.attachEvent)
		{
			//IExplorer
			elemento.attachEvent(nombreEvento, funcion);
		};
	}
}
function hit(a,b)
{
	var hit = false;
	if(b.x + b.width >= a.x && b.x < a.x + a.width)
	{
		if(b.y + b.height >= a.y && b.y < a.y + a.height)
		{
			hit = true;
		}
	}
	if(b.x <= a.x && b.x + b.width >= a.x + a.width)
	{
		if(b.y <= a.y && b.y + b.height >= a.y + a.height)
		{
			hit = true;
		}
	}
	if(a.x <= b.x && a.x + a.width >= b.x + b.width)
	{
		if(a.y <= b.y && a.y + a.height >= b.y + b.height)
		{
			hit = true;
		}
	}

	return hit;
}

function cruce(obj1, obj2) {
        if (obj1.x + obj1.width < obj2.x) {
            return false;
        }
        if (obj1.y + obj1.height < obj2.y) {
            return false;
        }
        if (obj1.x > obj2.x + obj2.width) {
            return false;
        }
        if (obj1.y > obj2.y + obj2.height) {
            return false;
        }
        return true;
}

function verificarContacto()
{
	for( var i in murosInternos )
	{
		var muro = murosInternos[i];

		if(cruce(muro,pelota))
		{
			hayContacto = true;
		}
		else
		{
			hayContacto = false;		
		}
		console.log(hayContacto);		
	}
}
//Funciones en frameLoop
function frameLoop()
{
	dibujarFondo();
	estadoJuego();
	dibujarTexto();
	dibujarMuro();
	dibujarBola();
	moverBola();
}