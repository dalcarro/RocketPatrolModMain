//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y,texture,frame, pointValue){
        super(scene,x,y,texture,frame);
        //add object to existing scene
        scene.add.existing(this);
        //track rocket's firing status
        this.points = pointValue;
    }
    update(){
        //move spaceship left
        this.x -= game.settings.spaceshipSpeed;
        // wraparound from the left to right edge
        if(this.x <= 0 - this.width){
            this.reset();
            //this.x = game.config.width;
        }
        
    }
    reset(){
        this.x = game.config.width;
    }
}