$(function() {
	//creamos un objeto que nos permite acceder a las funcionalidades de Quintus
	var Q = Quintus({
		development : true
	});

	//habilitamos los modulos a utilizar
	Q.include("Sprites, Scenes, Input, 2D, Touch, UI");
	//indicamos la caja en la que va a pintar el juego
	Q.setup("contenedor-juego", {
		maximize : true
	});
	//habilitamos los controles por teclado y touch
	Q.controls();
	Q.touch();

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
				x : 110,
				y : 50,
				jumpSpeed : -380
			});
			this.add("2d, platformerControls");
		},
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
		var fondo = new Q.TileLayer({
			dataAsset : 'nivel1.tmx',
			layerIndex : 0,
			sheet : 'mosaicos',
			tileW : 70,
			tileH : 70,
			type : Q.SPRITE_NONE
		});
		stage.insert(fondo);
		//colisiones
		var colisiones = new Q.TileLayer({
			dataAsset : "nivel1.tmx",
			layerIndex : 1,
			sheet : "mosaicos",
			tileW : 70,
			tileH : 70
		});
		stage.collisionLayer(colisiones);

		//jugador
		var jugador = stage.insert(new Q.Jugador());
		stage.add("viewport").follow(jugador, {
			x : true,
			y : true
		}, {
			minX : 0,
			maxX : fondo.p.w,
			minY : 0,
			maxY : fondo.p.h
		});

		//inserta al enemigo
		stage.insert(new Q.Enemigo());

	});

	//definir al enemigo cambiamos asset y nombre de la clase,  dar velocidad en x
	//cargar la imagen y quitar controles
	Q.Sprite.extend("Enemigo", {
		init : function(p) {
			this._super(p, {
				asset : "enemigo.png",
				x : 600,
				y : 50,
				vx : 150
			});
			this.add("2d, aiBounce");
			//colisiones para matar al enemigo
			this.on("bump.top", function(colision) {
				if (colision.obj.isA("Jugador")) {
					this.destroy();
				}
			});
			//colisiones para matar al jugador
			this.on("bump.left, bump.right", function(colision) {
				if (colision.obj.isA("Jugador")) {
					colision.obj.destroy();
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
	
	//Escena Game Over
	Q.scene("gameOver",function(stage){
		alert("Game Over");
	});

});
