/* FALTA

**************** 
hay un bug que aparece cuando te equivocás y después de que te vuelven a mostrar la secuencia empezás a clickear los botones.
****************


- podría haber un botón con un evento toggle que cuando lo clickeás una vez pone on en true
- revisar todo el código javascript, tal vez algunas de las cosas que están acá sueltas podrían ser parte de la clase simon
- limpiar el código
- mejorar el aspecto de la página web
- en el ejemplo que se muestra en fcc hay un tiempo para que el jugador responda, pasado ese período se da por equivocada la jugada
- una vez que estén resueltos todos los demás problemas setear la meta en 20 etapas en lugar de 4 o 5 como es ahora.
*/

/* 
	Hay varios estados:
		el de mostrar secuencia
		el de input
		el de configuración del modo
*/

var sim;
var jugador;

var on = false; //esto para cuando haya un botón de encendido y si on es false se puede cambiar el modo del juego y después clickear en start.
var estricto = false;
var restart = false;
var input = true;

var sonido = document.getElementById('audio');
var SOUNDmap = {'red': 'simonSound1.mp3', 'blue': 'simonSound2.mp3', 'green': 'simonSound3.mp3', 'yellow': 'simonSound4.mp3'};
var COLORESmap = {'red': 'rgba(255, 0, 0, 0.5)', 'blue': 'rgba(0,0,255,0.5)', 'green': 'rgba(0,255,0,0.5)', 'yellow': 'rgba(255,255,0,0.2'};

var jugadaOK = true;
var chequeados = 0;


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

//elige al azar una de las opciones (un array) y la devuelve
//opciones es un array de cosas, se devuelve algo del tipo cosa
//¿o conviene devolver el índice?
function chooseOne(options){
	var res = Math.floor(Math.random() * options.length);
	return options[res];
}

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

function playSound(snd){
    sonido.setAttribute('src', SOUNDmap[snd]);
	sonido.play();
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

    
$(document).ready(function(){

	$('#etapa').text("--");

	/* setear eventos */
	$('.colores').on('click', function(){
		if(on){
		    var color = $(this).attr('id');
            
            clickButton(color);

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
					//reseteás chequeados porque vas a volver as empezar
					chequeados = 0;
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