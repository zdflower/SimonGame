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


function mostrarSecuencia0(simon){
	//necesito los ids de los elementos de la página y necesito los colores claros
	//inicialmente los pongo acá adentro, no sé bien dónde corresponde que estén.
	var COLORESmap = {'red' : 'pink', 'blue' : 'skyblue', 'green':'lime', 'yellow':'purple'}; //les pongo cualquier cosa, después veo cuál es el código para colores más claros
	//para cada elemento de la secuencia, cambiarle el color a el correspondiente color claro y esperar un segundo más o menos y volver al color anterior
	var color;
	//lo que tiene de malo esto es que requiere que los ids tengan los nombres de los colores de css
	//pienso que debería ser independiente...

	for (var c of simon.getSequence()){
		color = document.getElementById(c);
		color.style.background = COLORESmap[c];//lo pasa al clarito
		//acá debería ir un delay y después volver al color original
		//color.style.background = c;//el que tenía

		//NO SÉ CÓMO PONER UN DELAY, SÓLO QUIERO QUE ESPERE UN POCO ANTES DE VOLVER AL COLOR ORIGINAL
		setTimeout(function(){
			console.log("vuelvo al color original");
			color.style.background = c;
		}, 3000);
	}
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

function mostrarMsgGano(){
	console.log("¡Ganaste!");
}

function mostrarMsgError(){
	console.log("Te equivocaste. Volvé a intentar.");
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