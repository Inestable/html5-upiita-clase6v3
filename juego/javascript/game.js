$(function() {
	//creamos un objeto que nos permite acceder a las funcionalidades de Quintus
	var Q = Quintus({
		development : true
	});

	//habilitamos los modulos a utilizar
	Q.include("Sprites, Scenes, Input, 2D, Touch, UI");
	//indicamos la caja en la que va a pintar el juego
	Q.setup("contenedor-juego", {

	});
	//habilitamos los controles por teclado y touch
	Q.controls();
	Q.touch();
    
   Q.scene("game_over", function(stage){
    	alert("Perdiste Pendejo(a)");
    });
    
    Q.scene("ganar", function(stage){
    	alert("Ganaste Campeon(a)");
    });
    
	//una vez que los recursos se han cargado se ejecuta el juego
	Q.load("tiles_map.png,  player.png, enemigo.png, nivel1.tmx", function() {
		Q.sheet("mosaicos", "tiles_map.png", {
			tilew : 70,
			tileh : 70
		});
		Q.stageScene("nivel1");
	});

	//definimos la clase del jugador
	Q.Sprite.extend("Jugador", {
		init : function(p) {
			this._super(p, {
				asset : "player.png",
				x : 70,
				y : 70,
				jumpSpeed : -900
			});
			this.add("2d, platformerControls");
		},
		
		//que se mueva dependiendo si va a la derecha o izquierda
		step : function() {
			if (Q.inputs['left'] && this.p.direction == 'right') {
				this.p.flip = 'x';
			}
			if (Q.inputs['right'] && this.p.direction == 'left') {
				this.p.flip = false;
			}

		}
	});

	//definimos la escena con sus capas
	Q.scene("nivel1", function(stage) {
		//fondo
		var background = new Q.TileLayer({
			dataAsset : 'nivel1.tmx',
			layerIndex : 0,
			sheet : 'mosaicos',
			tileW : 70,
			tileH : 70,
			type : Q.SPRITE_NONE
		});
		stage.insert(background);
		//colisiones
		var colisiones = new Q.TileLayer({
			dataAsset : "nivel1.tmx",
			layerIndex : 1,
			sheet : "mosaicos",
			tileW : 70,
			tileH : 70
		});
		stage.collisionLayer(colisiones);

		//jugador hacemos que la camara lo siga
		var jugador = stage.insert(new Q.Jugador());
		stage.add("viewport").follow(jugador, {
			x : true,
			y : true
		}, {
			minX : 0,
			maxX : background.p.w,
			minY : 0,
			maxY : background.p.h
		});
		
		//Poner más mounstros
		var mounstro = stage.insert(new Q.Enemigo());
		var mounstro2 = stage.insert(new Q.Enemigo({ x: 300, y: 400}));

		//inserta al enemigo
		stage.insert(new Q.Enemigo());

	});
	

	//definir al enemigo cambiamos asset y nombre de la clase,  dar velocidad en x
	//cargar la imagen y quitar controles
	Q.Sprite.extend("Enemigo", {
		init : function(p) {
			this._super(p, {
				x: 800,
				y: 150,
				asset: "enemigo.png",
				vx: 300
			});
			this.add("2d, aiBounce");
			//colisiones para matar al enemigo
				this.on("bump.top", function(colision) {
				if (colision.obj.isA("Jugador")) {
					this.destroy();
					Q.stageScene("ganar");
				}
			});
			//colisiones para matar al jugador
			this.on("bump.left, bump.right", function(colision) {
				if (colision.obj.isA("Jugador")) {
					colision.obj.destroy();
					Q.stageScene("game_over");
				}
			});

		},
		step : function() {
			if (this.p.vx > 0) {
				this.p.flip = 'x';
			}
			if (this.p.vx < 0) {
				this.p.flip = false;
			}
		}
	});
	

	//Escena Game Over, alert y despues inicia el nivel 1 de nuevo

	//Escena Ganar, alert y despues inicia el nivel 1 de nuevo
});
