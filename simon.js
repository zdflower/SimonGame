var sim;
var jugador;

var on = false; 
var estricto = false;
var restart = false;
var input = false;//tiene que empezar en false para que no puedas clickear ni bien clickeaste on, antes de cualquier cosa

var sonido = document.getElementById('audio');
var SOUNDmap = {'red': 'https://s3.amazonaws.com/freecodecamp/simonSound1.mp3', 'blue': 'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3', 'green': 'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3', 'yellow': 'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'};
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
function chooseOne(options){
	//podría estar adentro y no recibir parámetro sino usar directamente this.COLORES
	var res = Math.floor(Math.random() * options.length);
	return options[res];
}

function start(){
	if(on){
		setTimeout(function(){
			console.log("start");
			$('#msg').text(" ");
			sim = new Simon();

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

	sim.addNewStep();
	
	//mostrar la etapa en la página
	$('#etapa').text(sim.getStage());
}
 
//cuando se llama a mostrarSecuencia se supone que ya se empezó a jugar y que hay un simon y al menos se agregó 1 paso
function mostrarSecuencia(){
    input = false;
    console.log(sim.getSequence());

	// recurso indispensable para resolver este problema: 
	// https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/    
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
        $('#msg').text(" ");
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
		console.log("input? ", input);
		if(on && input){
		    var color = $(this).attr('id');

			clickButton(color);
    
 		    console.log(color);
		
				jugador = color;
                
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
		
			//una vez que hiciste bien la secuencia completa...

			if (chequeados >= sim.getSequence().length){//si ya chequeaste todo lo que tenías para clickear y estaba bien, pasá a la próxima etapa
                   	setTimeout(function(){
             	   		//antes de pasar a la siguiente etapa fijate si la actual es la última
                		if (sim.getStage() > 4){//reemplazar por 20.
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

	$('#restart').on('click', function(){
		if(on){
			start();
		}
	});

	$('#interruptor').on('click', function(){
		if (on === true){
			$('#etapa').text("--");
			on = false;
			restart = false;
			input = false;
			$("#interruptor").text("OFF");
			//resetear el display de la etapa
			//y podría sacarles la clase colores a los colores
		} else {
			on = true;
			$("#interruptor").text("ON");
			//y acá le vuelve a poner la clase colores a los colores
		}
		console.log("on? " + on);
		console.log("input? ", input);
	});

});