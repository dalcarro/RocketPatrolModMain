class Menu extends Phaser.Scene{
    constructor(){
        super("menuScene");
    }
//modifying prexisting phaser stuff. needs to be exact name and order.
    // init(){

    // }
    preload(){
        //load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('demSpaceMuse','./assets/demented_space_music.mp3');
        this.load.audio('altFire','./assets/altFire.mp3');
        this.load.audio('altFire2','./assets/altFire2.mp3');
        this.load.audio('altFire3','./assets/altFire3.mp3');
        this.load.audio('altFire4','./assets/altFire4.mp3');
    }

    create(){
        // menu text
        // this.add.text(20, 20, "test")
        // debug: move to next scene
        //this.scene.start("playScene");
        let menuConfig = {
            fontFamily: 'Courier',
            frontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding:{
                top: 5,
                bottem: 5,
            },
            fixedWidth: 0
        }
        //show menu text
        let centerX = game.config.width/2;
        let centerY = game.config.height/2;
        let textSpacer = 64;

        this.add.text(centerX,centerY - textSpacer, "ROCKET PATROL", menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, "use left and right arrow keys to move and (F) to fire", menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        this.add.text(centerX, centerY + textSpacer, 'Press Left arrow for Easy or Right arrow for Hard', menuConfig).setOrigin(0.5);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

    }
    update(){
        if(Phaser.Input.Keyboard.JustDown(keyLEFT)){
            //easy mode
            game.settings = {
                spaceshipSpeed: 3, gameTimer: 60000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
        if(Phaser.Input.Keyboard.JustDown(keyRIGHT)){
            //hard Mode
            game.settings = {
                spaceshipSpeed: 4, gameTimer: 45000
            }
            this.sound.play('sfx_select');
            this.scene.start('playScene');
        }
    }
}