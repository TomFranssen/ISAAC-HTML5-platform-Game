// debug
//me.debug.renderHitBox = true;
//me.debug.displayFPS = true;
//me.debug.renderDirty = true;


// game resources
var g_ressources= 
	[// our level tileset
		 {name : "area01_level_tiles",type : "image",	src : "data/area01_tileset/area01_level_tiles.png"}
		// our levels
		,{name : "area01",type : "tmx",	src : "data/area01.tmx"}
		,{name : "area02",type : "tmx",src : "data/area02.tmx"}
		// the main player spritesheet
		,{name : "gripe_run_right",	type : "image",	src : "data/sprite/gripe_run_right.png"}
		// the parallax background
		,{name : "area01_bkg0",type : "image",src : "data/area01_parallax/area01_bkg0_centrum.png"}
		,{name : "area01_bkg1",type : "image",src : "data/area01_parallax/area01_bkg1.png"}
		,{name : "area01_bkg2",type : "image",src : "data/area01_parallax/area01_bkg2.png"}
		// the spinning coin spritesheet
		,{name : "spinning_coin_gold",type : "image",src : "data/sprite/spinning_coin_gold.png"}
		// the duif spritesheet
		,{name : "duif",type : "image",	src : "data/sprite/duif.png"}
		// pin
		,{name : "pin",type : "image",src : "data/sprite/pin.png"}
		// arnol
		,{name : "wheelie_right_arnold",type : "image",src : "data/sprite/wheelie_right_arnold.png"}	
		// font letters
		,{name : "32x32_font",type : "image",src : "data/sprite/32x32_font.png"}
		,{name : "32x32_font_white",type : "image",src : "data/sprite/32x32_font_white.png"}
		// pickups
		,{name: "lamp",type: "image",src: "data/sprite/lamp.png"}
		,{name: "hud_lamp",type: "image",src: "data/sprite/hud_lamp.png"}
		,{name: "hud_life",type: "image",src: "data/sprite/hud_life.png"}
		,{name: "hud_heart",type: "image",src: "data/sprite/hud_heart.png"}
		,{name: "heart",type: "image",src: "data/sprite/heart.png"}
		//messages
		,{name: "gameover",type: "image",src: "data/sprite/gameover.png"}
		,{name: "lets_go_msg",type: "image",src: "data/sprite/lets_go_msg.png"}
		// audio resources
		,{name : "cling",type : "audio",src : "data/audio/",channel : 2	}
		,{name : "stomp",type : "audio",src : "data/audio/",channel : 1	}
		,{name : "jump",type : "audio",src : "data/audio/",channel : 1}
		,{name : "kirkoid-robots-still-cant-sing",type : "audio",src : "data/audio/",channel : 1	}
		,{name : "arnol1",type : "audio",src : "data/audio/",channel : 0}
		,{name : "arnol2",type : "audio",src : "data/audio/",channel : 0}
		,{name : "duif",type : "audio",src : "data/audio/",	channel : 0	}
		,{name : "duifmeneer",type : "audio",src : "data/audio/", channel : 0	}
		,{name : "wilhelmscream",type : "audio",src : "data/audio/",	channel : 0	}
		// title screen
		,{name : "title_screen",type : "image",	src : "data/GUI/title_screen.png"}
	];

var jsApp	= {
	/* ---
	
		Initialize the jsApp
		
		---			*/
	onload: function(){
		// me.debug.renderHitBox = true;
		// init the video
		if (!me.video.init('jsapp', 640, 480, false, 1.0))
		{
			alert("Sorry but your browser does not support html 5 canvas. Please try with another one!");
         return;
		}
		// initialize the "audio"
		me.audio.init("mp3,ogg");
		// set all ressources to be loaded
		me.loader.onload = this.loaded.bind(this);
		// set all ressources to be loaded
		me.loader.preload(g_ressources);
		// load everything & display a loading screen
		me.state.change(me.state.LOADING);
	},
	
	
	/* ---
	
		callback when everything is loaded
		
		---										*/
	loaded: function ()	{
		// set the "Play/Ingame" Screen Object
	    me.state.set(me.state.MENU, new TitleScreen());
		// set the "Play/Ingame" Screen Object
		me.state.set(me.state.PLAY, new PlayScreen());
	    // set a global fading transition for the screen
	    me.state.transition("fade", "#FFFFFF", 250);
		// add our player entity in the entity pool
		me.entityPool.add("mainPlayer", PlayerEntity);
		me.entityPool.add("CoinEntity", CoinEntity);
        me.entityPool.add("ArnolEnemyEntity", ArnolEnemyEntity);
        me.entityPool.add("DuifEnemyEntity", DuifEnemyEntity);
        me.entityPool.add("Pinentity", PinEntity);
        me.entityPool.add("Lampentity", LampEntity);
        me.entityPool.add("Heartentity", HeartEntity);
        //me.entityPool.add("gameover", gameOverMessage);
        me.entityPool.add("lets_go_msg", LetsGoMessage);
		// enable the keyboard
		me.input.bindKey(me.input.KEY.UP,		"up");
		me.input.bindKey(me.input.KEY.DOWN,		"down");
		me.input.bindKey(me.input.KEY.LEFT,		"left");
		me.input.bindKey(me.input.KEY.RIGHT,	"right");
		me.input.bindKey(me.input.KEY.X,		"jump", true);
      	// start the game 
		me.state.change(me.state.MENU);
        me.state.onPause = function() {
            context = me.video.getScreenFrameBuffer();
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(0, 203, me.video.getWidth(), 50);
            font = new me.BitmapFont("32x32_font_white", 32);
            font.set("left");
            measure = font.measureText("P A U S E");
            font.draw(context, "P A U S E", (me.video.getWidth() / 2) - (measure.width / 2), (me.video.getHeight() / 2) - (measure.height / 2))
        };
	}

}; // jsApp

/* the in game stuff*/
var PlayScreen = me.ScreenObject.extend({
   onResetEvent: function(){	
		// play the audio track
	    me.audio.playTrack("kirkoid-robots-still-cant-sing");
      	// stuff to reset on state change
      	// load a level
		me.levelDirector.loadLevel("area01");
		
        // add a default HUD to the game mngr
        me.game.addHUD(-50, 430, 650, 0);
        // add a new Score HUD item
        me.game.HUD.addItem("score", new HUDScoreObject(620, 10));
        me.game.HUD.addItem("life", new HUDLifeObject(100, 10));
        me.game.HUD.addItem("energy", new HUDEnergyObject(180, 4));

        // make sure everyhting is in the right order
        me.game.sort();
	},
	/* ---
		 action to perform when game is finished (state change)
	---	*/
	onDestroyEvent: function(){
		// remove the HUD
		me.game.disableHUD();
	    // stop the current audio track
	    me.audio.stopTrack();
	},
	onGameOver: function() {
        //this.onGameEnd(); TODO save to highscore
        me.game.add(new gameOverMessage(0, 0, function() {
        	console.log('gameover is nu geweest...');
            me.game.disableHUD();
            me.state.change(me.state.MENU)
        }), 999);
        
        me.game.sort();
        me.audio.stopTrack();
        //me.audio.play("Game_Over")
    }
});

//bootstrap :)
window.onReady(function() 
{
	jsApp.onload();
});


/*****************************/
/*							 */
/*		Main Player Entity   */
/*							 */
/*****************************/

var PlayerEntity = me.ObjectEntity.extend({
	// constructor
	init: function(x, y, settings){
		//call constructor
		this.parent(x, y, settings);
		//set walking en jumping speed
		this.setVelocity(4,15);
		
		this.startX = x;
		this.startY = y;
		
		// adjust bounding box
		this.updateColRect(8,48,-1,0);
		// set the display to allow our position on 2 axes
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	/* -----
	update the player pos
	------ */
	update: function(){
		var doClimb = false;
		
		if(me.input.isKeyPressed('left')){
			this.doWalk(true);
		} else if(me.input.isKeyPressed('right')){
			this.doWalk(false);
		} else{
			this.vel.x = 0
		}
		if (me.input.isKeyPressed('up')){
			doClimb = this.doClimb(true);
		}
		else if (me.input.isKeyPressed('down')){
			doClimb = this.doClimb(false);
		}
		// jump action
		if(me.input.isKeyPressed('jump')){
		    if (this.doJump()) {
		        me.audio.play("jump");
		    }
			this.doJump();
		}
		
		// check & update player movement
		this.updateMovement();
		
		if (this.onladder){
			// cancel residual y vel
			this.vel.y = 0;
		} 
		
	    // check for collision
        var res = me.game.collide(this);
	 
	    if (res && me.game.HUD) {
	        // if we collide with an enemy
	        if (res.obj.type == me.game.ENEMY_OBJECT) {
	            // check if we jumped on it
	            if ((res.y > 0) && ! this.jumping) {
	                // bounce
	                me.audio.play("stomp");
	                this.forceJump();
	            }else if(!this.flickering){
                    this.touch()
	            } 
	        }
	    }
	    
		//fall of cliff
		if (this.pos.y >= 900){
			me.game.viewport.fadeIn("#000", 500);
			this.pos.x = this.startX;
			this.pos.y = this.startY-32;
		}
		
		//update animation if necessary
		if(this.vel.x!=0 || this.vel.y!=0){
			//update object animation
			this.parent(this);
			return true;
		}
		return false;
		
	},die: function() {
        this.alive = false;
        this.forceJump();
        me.game.HUD.updateItemValue("life", -1);
        if (me.game.HUD.getItemValue("life") == 0) {
            this.flicker(30, function() {
                me.game.remove(this)
            });
            me.game.HUD.reset("energy");
            me.state.current().onGameOver()
        } else {
            // me.audio.play("Player_Dies");
            this.flicker(30, function() {
                me.game.HUD.reset("energy");
			    this.pos.x = this.startX;
			    this.pos.y = this.startY;
                me.levelDirector.reloadLevel();
                me.game.viewport.fadeOut("#000", 15);
            })
        }       
    },touch: function() {
        me.audio.play("wilhelmscream");
        me.game.HUD.updateItemValue("energy", -1);
        if (me.game.HUD.getItemValue("energy") == 0) {
            this.die()
        } else {
            //me.audio.play("hurt", false);
            this.flicker(me.sys.fps * 2)
        }
    }
});

/*****************************/
/*							*/
/*		a Coin entity		*/
/*							*/
/*****************************/
var CoinEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
	    // do something when collide
	    me.audio.play("cling");
	    // give some score
	    me.game.HUD.updateItemValue("score", 250);
	    // make sure it cannot be collected "again"
	    this.collidable = false;
	    // remove it
	    me.game.remove(this);
    }
});


/*****************************/
/*							*/
/*		a Duif entity		*/
/*							*/
/*****************************/

/*
var DuifEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function(x, y, settings) {
        // call the parent constructor
        this.parent(x, y, settings);
    },
 
    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function() {
	    // do something when collide
	    me.audio.play("duif");
	    // give some score
	    me.game.HUD.updateItemValue("score", 1);
	    // make sure it cannot be collected "again"
	    this.collidable = false;
	    // remove it
	    me.game.remove(this);
    }
});

*/

/*****************************/
/*							*/
/*		a Pin entity		*/
/*							*/
/*****************************/
var PinEntity = me.CollectableEntity.extend({
	init: function(a, c, b) {
	    b.image = "pin";
	    b.spritewidth = 64;
	    this.parent(a, c, b);
	    //this.updateColRect(8, 48, 8, 48) todo
	},onDestroyEvent: function() {
	    //me.audio.play("heart", false);
	    //me.game.HUD.updateItemValue("energy", 1)
}});

/*****************************/
/*							*/
/*		a Lamp entity		*/
/*							*/
/*****************************/


var LampEntity = me.CollectableEntity.extend({init: function(a, c, b) {
    b.image = "lamp";
    b.spritewidth = 32;
    this.parent(a, c, b);
    this.updateColRect(3, 43, 9, 55);
},onDestroyEvent: function() {
	// todo play audio
	if(me.game.HUD){
	    me.game.HUD.updateItemValue("score", 1);
	}
}});

/*****************************/
/*							*/
/*		a heart entity		*/
/*							*/
/*****************************/


var HeartEntity = me.CollectableEntity.extend({init: function(a, c, b) {
    b.image = "heart";
    b.spritewidth = 45;
    this.parent(a, c, b);
    this.updateColRect(11, 24, 10, 28)
},onDestroyEvent: function() {
    //me.audio.play("heart", false);
	if(me.game.HUD){
    	me.game.HUD.updateItemValue("energy", 1)
    }
}});

/* --------------------------
an enemy Entity -  Arnol
------------------------ */
var isArnolSound1Playing = false
,playArnolSound2 = false
,arnolEnergy = 1;

var ArnolEnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "wheelie_right_arnold";
        settings.spritewidth = 128;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
 
        // make him start from the left
        this.pos.x = x ;
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(4, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
    	if(isArnolSound1Playing !== true){
	 	    isArnolSound1Playing = true;
	 	    me.audio.play("arnol2", false, function(){
		 	    playArnolSound2 = true; // set var after sound has finished
	 	    });
    	}
    	if(playArnolSound2 === true){
    		playArnolSound2 = false;
	 	    me.audio.play("arnol1", false, function(){
		 	    isArnolSound1Playing = false; // set var after sound has finished
	 	    });
    	}
    	
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling && (arnolEnergy === 0)) {
			this.flicker(30, function(){
				this.alive = false;
				me.game.remove(this);
			})
        }else{
			this.flicker(30);
			arnolEnergy = 0;
		}
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        //if (!this.visible)
        //    return false;
 
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.doWalk(this.walkLeft);
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
});


/* --------------------------
an enemy Entity -  Duif
------------------------ */

var DuifEnemyEntity = me.ObjectEntity.extend({
    init: function(x, y, settings) {
        // define this here instead of tiled
        settings.image = "duif";
        settings.spritewidth = 32;
 
        // call the parent constructor
        this.parent(x, y, settings);
 
        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite
        
        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;
        
        this.walkLeft = true;
 
        // walking & jumping speed
        this.setVelocity(1, 6);
 
        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;
 
		// strength
		this.strength = 3;
    },
 
    // call by the engine when colliding with another object
    // obj parameter corresponds to the other object (typically the player) touching this one
    onCollision: function(res, obj) {
    	
    	
		this.strength--;
		if (this.strength <= 1) {
			this.setVelocity(2, 10);
		}
		if (this.strength > 0) {
			me.audio.play("duifmeneer", false);
		} else {
			me.audio.play("duif", false);
		}
    	
        // res.y >0 means touched by something on the bottom
        // which mean at top position for this one
        if (this.alive && (res.y > 0) && obj.falling) {
	 	    me.audio.play("duifmeneer", false);
			this.flicker(10, function(){
 				if (this.strength <= 0) {
					this.alive = false;
 					me.game.remove(this);
				}
			});
        }
    	
    	
    },
 
    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!this.visible)
            return false;
        
        this.vel.x = 0;
        
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
 	        this.doWalk(this.walkLeft);
 			if (this.strength < 3 && Math.random() < 0.01) {
 				this.doJump();
 			}
        } else {
            this.vel.x = 0;
        }
         
        // check and update movement
        this.updateMovement();
         
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update objet animation
            this.parent(this);
            return true;
        }
        return false;
    }
});



/*-------------- 
a score HUD Item
--------------------- */
 
var HUDScoreObject = me.HUD_Item.extend({
    init: function(x, y) {
        // call the parent constructor
        this.parent(x, y);
        // create a font
        this.font = new me.BitmapFont("32x32_font_white", 32);
	    this.lampIcon = me.loader.getImage("hud_lamp")
    },
    /* -----
    draw our score
    ------ */
    draw: function(b, x, y) {
        b.drawImage(this.lampIcon, this.pos.x + x, this.pos.y + y);
        this.font.draw(b, this.value, this.pos.x + x, this.pos.y + y);
    }
 
});

var HUDLifeObject = me.HUD_Item.extend({
	init: function(a, b) {
	    this.parent(a, b, 2);// add 2 lives
        this.font = new me.BitmapFont("32x32_font_white", 32);
	   // this.font.set("left");
	    this.lifeIcon = me.loader.getImage("hud_life")
	}
	,draw: function(b, a, c) {
        b.drawImage(this.lifeIcon, this.pos.x + a, this.pos.y + c);
	    this.font.draw(b, this.value, this.pos.x + a, this.pos.y + c)
}});


/*-------------- 
a score Energy HUD Item
--------------------- */

var HUDEnergyObject = me.HUD_Item.extend({init: function(a, b) {
	    this.parent(a, b, 1);
	    this.heartIcon = me.loader.getImage("heart")
	},update: function(a) {
	    if (this.value + a < 0) {
	        return false
	    }
	    if (this.value + a <= 2) {
	        return this.parent(a)
	    } else {
	        me.game.HUD.updateItemValue("score", 100)
	    }
	    return false
	},draw: function(c, b, d) {
	    var a = this.pos.x + b;
	    for (i = 0; i < this.value; i++) {
	        c.drawImage(this.heartIcon, a, this.pos.y + d);
	        a += this.heartIcon.width
	    }
	}
});





/*-------------- 
Game over mssg
--------------------- */


var gameOverMessage = me.SpriteObject.extend({
	init: function(a, c, b) {
        this.parent(a, c, me.loader.getImage("gameover"));
        this.pos.x = me.game.viewport.pos.x + ((me.game.viewport.width - this.image.width) / 2);
        this.pos.y = 0 - this.image.height;
        this.callback = b;
        this.tween = new me.Tween(this.pos).to({y: 40}, 3000).onComplete(b);
        this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
        this.tween.start()
    }
});

var LetsGoMessage = me.SpriteObject.extend({init: function(a, b) {
        this.parent(a, b, me.loader.getImage("lets_go_msg"));
        this.pos.x = me.game.viewport.pos.x + ((me.game.viewport.width - this.image.width) / 2);
        this.pos.y = me.game.viewport.pos.y - this.image.height;
        this.font = new me.BitmapFont("32x32_font_white", 32);
        this.font.set("left");
        this.leveltitle = me.game.currentLevel.label.toUpperCase();
        this.size = (this.font.measureText(this.leveltitle)).width;
        this.labelx = 0 - this.size;
        this.tween = new me.Tween(this.pos).to({y: 140}, 1500).onComplete(this.AnimStep.bind(this));
        this.tween.easing(me.Tween.Easing.Bounce.EaseOut);
        this.texttween = new me.Tween(this).to({labelx: ((me.game.viewport.width - this.size) / 2)}, 750);
        this.tween.start();
        this.texttween.start()
    },AnimStep: function() {
        this.tween.easing(me.Tween.Easing.Circular.EaseOut);
        this.tween.to({y: me.game.currentLevel.realheight}, 1500).start();
        this.tween.onComplete(this.AnimFinished.bind(this));
        this.texttween.to({labelx: me.game.viewport.width}, 500).start()
    },AnimFinished: function() {
        me.game.remove(this)
    },draw: function(a) {
        this.pos.x = me.game.viewport.pos.x + ((me.game.viewport.width - this.image.width) / 2);
        this.parent(a);
        this.font.draw(a, this.leveltitle, this.labelx, 250)
    }
});


/*----------------------
 
    A title screen
 
    ----------------------*/
 
var TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);
        
        // title screen image
        this.title = null;
 
        this.font = null;
        this.scrollerfont = null;
        this.scrollertween = null;
 
        this.scroller = "HELP DE ISAAC COLLEGA NAAR ZIJN WERK. MAAR KIJK UIT! EINDHOVEN ZIT VOL GEVAREN!";
        this.scrollerpos = 600;
        
    },
 
    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title_screen");
            
            // font to display the menu items
            this.font = new me.BitmapFont("32x32_font", 32);
            this.font.set("left");
 
            // set the scroller
            this.scrollerfont = new me.BitmapFont("32x32_font", 32);
            this.scrollerfont.set("left");
 
        }
 
        // reset to default value
        this.scrollerpos = 640;
 
        // a tween to animate the arrow
        this.scrollertween = new me.Tween(this).to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
 
        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
 
        // play something
        me.audio.play("cling");
    },
 
    // some callback for the tween objects
    scrollover: function() {
        // reset to default value
        this.scrollerpos = 640;
        this.scrollertween.to({
            scrollerpos: -2200
        }, 10000).onComplete(this.scrollover.bind(this)).start();
    },
 
    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },
 
    // draw function
    draw: function(context) {
		context.drawImage(this.title, 0, 0);
        this.font.draw(context, "PRESS ENTER TO PLAY", 20, 240);
        this.scrollerfont.draw(context, this.scroller, this.scrollerpos, 440);
    },
 
    // destroy function
    onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
        //just in case
		this.scrollertween.stop();
    }
 
});




