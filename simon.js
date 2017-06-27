class Simon {
	constructor(){
		//private properties
		this.stage = 0;
		this.sequence = [];
    	this.COLORES = ['red', 'blue', 'green', 'yellow'];//debería ser constante para un Simon.
	}

	//public methods
	addNewStep(){
		//suma 1 a stage y agrega uno de los 4 colores a sequence
		//chooseOne(options) //elige un color al azar 
		this.stage++;
		this.sequence.push(chooseOne(this.COLORES));
	}

	getSequence(){
		return this.sequence;
	}

	getStage(){
		return this.stage;
	}
}

//elige al azar una de las opciones y la devuelve
//opciones es un array de cosas, se devuelve algo del tipo cosa
//¿o conviene devolver el índice?
function chooseOne(options){
	var res = Math.floor(Math.random() * options.length);
	return options[res];
}

function checkPlay(seq1, seq2){ //revisar que funcione como supongo
	//compara dos arrays de strings si para cada elemento y posición en uno y en el otro coinciden
	var res = seq1.length === seq2.length;//en principio deberían tener la misma longitud
	var i = 0;
	while(res  && i < seq1.length){ //empieza si al menos tienen la misma longitud
		res = seq1[i] === seq2[i];
		i++;
	}
	//cuando sale, por el motivo que sea, devolvés res.
	return res; 
}

//export default Simon;


function testChooseOne(){
	var opciones = ['rojo', 'verde', 'azul', 'amarillo'];
	console.log("Testeando chooseOne");
	console.log(chooseOne(opciones));
}

function testSimon(){
	var sim = new Simon();
	for (var i = 0; i < 20; i++){
		console.log("Nueva etapa");
		sim.addNewStep();
		console.log(sim.getSequence());
		console.log(sim.getStage());
	}
}

function game(){
	var mode = 'normal'; //o estricto
	var player = [];
	var restart = false;
	var jugadaOk = true; //cuando empieza el juego el jugador no se equivocó.
	var sim;

	//pedir input al usuario para saber qué modo quiere
	//el modo lo vamos a usar cuando el jugador se equivoque.

	//crear el objeto simon
	sim = new Simon();
	//mientras restart sea false y la etapa sea menor que 20
		//agregaretapa
		//mostrar secuencia
		//pedir input al usuario 
		//mientras el usuario no se equivoque y restart sea false
			//agregaretapa
			//mostrar secuencia
			//pedir input
		//saliste del loop interno, entonces
		//si el usuario se equivocó
			//si el modo es estricto, mostrar mensaje de error y reiniciar el juego, podría ponerse restart en true
		//si restart es true
			//resetear el juego, eso va a hacer que entre en el loop	


	while (sim.getStage() < 5 && !restart ){//5 vueltas para testear
		sim.addNewStep();
		console.log("Etapa: " + sim.getStage());
		console.log(sim.getSequence());
		mostrarSecuencia(sim);
		player = sim.getSequence();//prompt("Secuencia: ");
		jugadaOk = checkPlay(sim.getSequence(), player);
		//restart = prompt("Restart?: ");
		while (!jugadaOk && !restart){
			mostrarMsgError();
			if (mode = 'strict'){
				restart = true;
			} else {
				console.log("Etapa: " + sim.getStage());
				console.log(sim.getSequence());
				mostrarSecuencia(sim);
				player = sim.getSequence();//prompt("Secuencia: ");
				jugadaOk = checkPlay(sim.getSequence(), player);
				//restart = prompt("Restart?: ");		
			}
		}
	}
	//saliste o porque llegaste a 20 etapas o pusiste restart
	if (!restart){
		mostrarMsgGano();
	}
}

function mostrarMsg(msg){
	console.log(msg);
    $('#msg').css('display', 'block');
    $('#msg').text(msg);
    setTimeout(function(){
        $('#msg').css('display', 'none');
    }, 3000);
    
}

function mostrarMsgGano(){
   mostrarMsg('¡Ganaste!');
}

function mostrarMsgError(){
	mostrarMsg("Te equivocaste. Volvé a intentar.");    
}

function jugar(){
	var i = 0;
	while(i < 5){ //para testear 5 restarts
		game();
		i++;
	}

}

function testCheckPlay(){
	var a1 = ['rojo', 'azul', 'azul'];
	var a2 = ['rojo', 'azul', 'azul'];
	console.log("true: " + checkPlay(a1,a2));
}

//testChooseOne();
//testSimon();
//testCheckPlay();
//jugar();
//game();
//export {chooseOne};

/*
*/
/* FALTA
-después de mostrar el mensaje de error durante unos instantes y cuando empieza a mostrar de nuevo la secuencia borrar el mensaje de error.
-después de mostrar el mensaje que ganaste, antes de volver a empezar también debería borrarse el msg
- antes de volver a empezar que haya unos segundos de espera.
- que también haya una pausa si te equivocaste antes de que te vuelva a mostrar la secuencia
- también antes de que muestre la etapa debería pausar unos segundos
- los colores con los que se muestran los clicks para la secuencia del simon, hacer que sean como los de un click y no los que puse yo.
- una vez que estén resueltos todos los demás problemas setear la meta en 20 etapas en lugar de 4 o 5 como es ahora.

-revisar todo el código javascript, tal vez algunas de las cosas que están acá sueltas podrían ser parte de la clase simon

- ubicar todo este script js en un archivo aparte
- mejorar el aspecto de la página web
- limpiar el código

en el ejemplo que se muestra en fcc hay un tiempo para que el jugador responda, pasado ese período se da por equivocada la jugada
*/

//tenés varios estados:
//el de mostrar secuencia
//el de input
//el de configuración del modo

var sonido = document.getElementById('audio');
var COLORESmap = {'red': 'pink', 'blue': 'skyblue', 'green': 'lime', 'yellow': 'black'};
    
var SOUNDmap = {'red': 'simonSound1.mp3', 'blue': 'simonSound2.mp3', 'green': 'simonSound3.mp3', 'yellow': 'simonSound4.mp3'};

var sim;
var estricto = false;
var restart = false;
var input = true;
var jugadaOK = true;
var jugador;
var chequeados = 0;
var on = false; //esto para cuando haya un botón de encendido y si on es false se puede cambiar el modo del juego y después clickear en start.

//podría haber un botón con un evento toggle que cuando lo clickeás una vez pone on en true

function start(){
	//ok, pero cómo interrumpís una vez que empezó un juego? con el botón de on/off
	if(on){
		setTimeout(function(){
			console.log("start");
			$('#msg').css('display', 'none');//"resetea" el mensaje. 
			sim = new Simon();
			//console.log("Etapa: " + sim.getStage());
			siguienteEtapa();
			mostrarSecuencia();
        }, 2000);	
	}
}

function siguienteEtapa(){
	//si ya se llegó a las 20 entonces mostrar el mensaje que ganó y volver a llamar a restart
	//si no agregar nuevo paso
	console.log("siguiente etapa");

	//resetear chequeados
	chequeados = 0;

	console.log("antes de agregar etapa");
	//console.log(sim.getStage());
	sim.addNewStep();
	console.log("agregué nuevo paso");
	
	//mostrar la etapa en la página
	$('#etapa').text(sim.getStage());
}
 
//cuando se llama a mostrarSecuencia se supone que ya se empezó a jugar y que hay un simon y al menos se agregó 1 paso
function mostrarSecuencia(){
    input = false;
    console.log(sim.getSequence());
    
    //analizar mejor para comprender bien cómo funciona lo siguiente:
    (function theLoop(count, len, sec){
      var elem = sec[count];//el primer carácter
      setTimeout(function(){
	clickButton(elem);
	if(--len){
	  theLoop(++count,len,sec);
	}
      }, 2000);
    })(0, sim.getSequence().length, sim.getSequence());
    
    //también tendría que resetear la jugadaOK, si no si te equivocás siempre queda false    
    jugadaOK = true;
    input = true;
}

function clickButton(elem){
    $('#' + elem).css('background-color', COLORESmap[elem]);
    playSound(elem);
    setTimeout(function(){
        $('#' + elem).css('background-color', elem);
    }, 300);
}

function manejarJugadaErronea(){
	input = false;
	mostrarMsgError();
	//si el modo es normal, volver a mostrar la secuencia del sim, y al final habilitar el input
	//si el modo es estricto, ir a start 
	(estricto === false )? mostrarSecuencia() : start();
}

function changeMode(){
	if(!on){
		if (!estricto){
			estricto = true;
			console.log('Cambio modo a Estricto');
			$('#modo').text('Estricto');
		} else {
			estricto = false;
			$('#modo').text('Normal');
		}
	}
}

function playSound(snd){
    //¿de dónde salió sonido?
    sonido.setAttribute('src', SOUNDmap[snd]);
	sonido.play();
}
    
$(document).ready(function(){

	$('#etapa').text("--");

	/* setear eventos */
	$('.colores').on('click', function(){
		if(on){
		    var color = $(this).attr('id');

		    /* efecto de sonido al clickear */
            playSound(color);

		    console.log(color);
			console.log("input: ", input);

			if (input){//también podría chequear si on está en true
				jugador = color;

                //console.log(sim.getSequence());
				//console.log("Stage:" + sim.getStage());
				//console.log(sim.getSequence()[chequeados]);

				jugadaOK = sim.getSequence()[chequeados] == jugador;

				console.log("jugadaOK" + jugadaOK);
				
				if(!jugadaOK){
					//desactivás el input
					//llamás a una función que te indica el error y que luego si el modo es normal te vuelve a mostrar la secuencia y después rehabilita el input para que el usuario pueda ingresar su secuencia
					manejarJugadaErronea();
				} else {
					chequeados++;
				}
			}
			//cómo llegás acá? una vez que hiciste bien la secuencia completa

			console.log("chequeados: " + chequeados);
			console.log('stage: ', sim.getStage());
			console.log(sim.getSequence().length);
			console.log("¿etapa igual que longitud de la secuencia?: ", sim.getStage() === sim.getSequence().length);

			if (chequeados >= sim.getSequence().length){//si ya chequeaste todo lo que tenías para clickear y estaba bien, pasá a la próxima etapa
                setTimeout(function(){
                	//antes de pasar a la siguiente etapa fijate si llegaste a la última
                	if (sim.getStage() > 3){//3 para testear, reemplazar por 20.
						mostrarMsgGano();
						start();
					} 
					else {
						siguienteEtapa();
				    	mostrarSecuencia(); //¿debería estar mostrarSecuencia dentro de siguienteEtapa?
					}
                    
                }, 3000);
			}
		}
	});

	$('#modo').on('click', changeMode);

	$('#restart').on('click', start);

	$('#interruptor').on('click', function(){
		//(on === true)? on = false : true;
		if (on === true){
			$('#etapa').text("--");
			on = false;
			//resetear el display de la etapa

			//y podría sacarles la clase colores a los colores
		} else {
			on = true;
			//y acá le vuelve a poner la clase colores a los colores
		}
		console.log("on? " + on);
	});

});