class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }
//modifying prexisting phaser stuff. needs to be exact name and order.
    // init(){}
    preload(){
        this.music = this.sound.add('demSpaceMuse','./assets/demented_space_music.wav')
        this.backSwitch = false;
        //use PNG over jpg
        this.load.image("rocket", "./assets/rocket2.png");
        this.load.image("spaceship", "./assets/spaceship.png");
        this.load.image("altSpace", "./assets/altSpace3.png");
        this.load.image("left_and_right", "./assets/lAr.png");
        this.load.image("botAtop", "./assets/botAtop.png");
        //load spritesheet
        this.load.spritesheet('explosion','./assets/explosion.png',{frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.atlas('pyr','./assets/spritesheet.png','./assets/sprites.json');
    }

    create(){
        //animation config
        this.anims.create({
            key: 'explode', 
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end:9, first:0}), 
            frameRate: 30
        });
        this.anims.create({
            key: 'fly', 
            frames: this.anims.generateFrameNames('pyr', {  
            prefix: 'Pyramid',
            start: 0,
            end: 7,
            suffix: '',
            zeroPad: 4,
            }),
            frameRate: 5,
            repeat: -1,
        });

        let musConig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        };
        this.music.play(musConig);
        this.explodeList = ['altFire','altFire2','altFire3','altFire4'];
        //place tile sprite big
        this.starfield = this.add.tileSprite(0, 0, 640,480, 'altSpace').setOrigin(0,0);
        //ship declarations
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'pyr','Pyramid0001',30).setOrigin(0,0).anims.play('fly');
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'pyr','Pyramid0001',30).setOrigin(0,0).anims.play('fly');
        this.ship03 = new Spaceship(this, game.config.width, 260, 'pyr','Pyramid0001',30).setOrigin(0,0).anims.play('fly');
        //white rectangle Rectangle(x, y, width, height);
            //top
        this.add.tileSprite(0, 0, 640, 32, "botAtop").setOrigin(0,0);
            //bottem
        this.add.tileSprite(0, 455, 640, 32, "botAtop").setOrigin(0,0);
            //left
        this.add.tileSprite(0, 32, 32, 455, "left_and_right").setOrigin(0,0);
            //right
        this.add.tileSprite(608, 0, 32, 457, "left_and_right").setOrigin(0,0);
        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);
        //add rocket(p1)
        this.p1Rocket = new Rocket(this, game.config.width/2,431,'rocket',0).setScale(1.5,1.5).setOrigin(0,0);
        //define Keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        //score
        this.p1Score = 0;
        this.speedUpSwitch = false;
        //score display
        let scoreConfig = {
            fontFamily: 'Courier',
            frontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding:{
                top: 5,
                bottem: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69,54, this.p1Score, scoreConfig);
        
        //game over flag
        this.gameOver = false;
        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER',
        scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or left arrow for menu', 
        scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        },null,this);
        this.timerUi = this.add.text(455,54, ((game.settings.gameTimer/1000) - this.clock.getElapsedSeconds()), scoreConfig);
    }
    update(){
        this.timerUi.text = (game.settings.gameTimer/1000) - Math.round(this.clock.getElapsedSeconds());
        if( Math.round(this.clock.getElapsedSeconds()) >= 30 && this.speedUpSwitch == false){
            game.settings.spaceshipSpeed *= 2;
            this.speedUpSwitch = true;
            console.log("Speed increased");
        }
        if(this.backSwitch == false && !this.gameOver){
            this.music.resume();
            this.backSwitch = true;
        }
        if(this.gameOver == true){
            this.speedUpSwitch = false;
            this.music.pause();
            this.backSwitch = false;
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)){
            this.scene.restart(this.p1Score);
        }
        //scroll tile sprite
        this.starfield.tilePositionX -= 1;
        if(!this.gameOver){
            //update rocket
            this.p1Rocket.update();
            //update spaceships
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
        }
        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start('menuScene');
        }
    }
    checkCollision(rocket,ship){
        //simple AABB checking
        if(rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true;
            } else {
                return false;
            }
    }
    shipExplode(ship){
        ship.alpha = 0;  //temporarily hide ship
        //create explosion sprite at ship's position.
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');   //play explode animation
        boom.on('animationcomplete', () => {  //callback after animation completes
            ship.reset();                //reset  ship position
            ship.alpha = 1;              //make shipvisible again
            boom.destroy();             //remove explosion;
        });
        //score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        //code below from https://www.w3schools.com/jsref/jsref_random.asp
        this.sound.play(this.explodeList[Math.floor(Math.random() * 4)]);
    }
    
}