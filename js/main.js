function inicio()
{
	dibujo = document.getElementById("miCanvas");
	ctx = dibujo.getContext("2d");
	cargarImagenes();
	agregarEventosTeclado();
	intervalo = window.setInterval(function(){
		frameLoop();
	}, 1000/80);

}

//Variables
var dibujo, ctx, fondo, intervalo, pared, bola;
var juego = {estado : 'iniciando'};
var teclado = {};
var muros = [];
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
		//Muro superior
		for(var i = 0; i <= 13; i++)
		{
			muros.push({
				x: 50 + (i * 50),
				y: 50,
				width: 50,
				height: 50
			})
		}
		//Muro inferior
		for(var i = 0; i <= 13; i++)
		{
			muros.push({
				x: 50 + (i * 50),
				y: dibujo.height - 100,
				width: 50,
				height: 50
			})
		}
		//Muro vertical izquierdo
		for(var i = 0; i <= 9; i++)
		{
			muros.push({
				x: 50,
				y: 50 + (i * 50),
				width: 50,
				height: 50
			})
		}
		//Muro vertical derecho
		for(var i = 0; i <= 9; i++)
		{
			muros.push({
				x: dibujo.width - 100,
				y: 50 + (i * 50),
				width: 50,
				height: 50
			})
		}
		//Muro vertical central
		for(var i = 0; i <= 9; i++)
		{
			muros.push({
				x: 375,
				y: 50 + (i * 50),
				width: 50,
				height: 50
			})
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
		pelota.x -=15;
		if(pelota.x < 100)
		{
			pelota.x = 100;
		}
	}
	if(teclado[39])//Flecha derecha
	{
		//Movimiento a la derecha
		var limite = dibujo.width - 150;
		pelota.x +=15;
		if(pelota.x > limite)
		{
			pelota.x = limite;
		}
	}
	if(teclado[38])//Flecha arriba
	{
		//Movimiento arriba
		pelota.y -=15;
		if(pelota.y < 100)
		{
			pelota.y = 100;
		}
	}
	if(teclado[40])//Flecha abajo
	{
		//Movimiento abajo
		var limite = dibujo.height - 150;
		pelota.y +=15;
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
function verificarContacto()
{
	for( var i in muros)
	{
		var muro = muros[i];
		if(hit(pelota,muro))
		{
			//pelota.x = muro.x;
			//pelota.y = muro.y;
		}
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
	verificarContacto();
}