//*http://localhost:8000*//
console.log("hello World!");
config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu,Play]

}
//creates main game object
let game = new Phaser.Game(config);

// define game settings
game.settings = {
    spaceshipSpeed: 3, gameTimer:6000
}

//reserve some keyboard bindings
let keyF, keyLEFT, keyRIGHT;
