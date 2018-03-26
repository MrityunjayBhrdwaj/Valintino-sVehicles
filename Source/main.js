// Vechicles: Synthetic Psychology
let vehicle_1  = 0;
let vehicle_arr = [];
let flow_field  = [];

var img;
var character;

// Controlls:-
let blockSize   = 15;// for flow Field

let maxSpeed    = 4.5   // multiplyer for the random values assigned
let maxForce    = 1;    // multiplyer for the random values assigned
let Antnum      = 200;  // population number of ants;

function setup(){
    createCanvas(innerWidth,innerHeight);

    // Loading Gif of the ant
    character = loadGif("Assets/antwalk.gif")
    
    // Create "X" no of ants and assign different properties to them
    let pos = createVector(100,100);
    for(let i =0 ;i < Antnum; i++){

    let vehicle_tmp = Vehicle.create(
        createVector(Math.random()*width,Math.random()*height),
        createVector(0,0),
        createVector(.5,.0),
        Math.random()*maxForce,(1+Math.random()*maxSpeed/2)*2,2+Math.random()*2,1
    )
    
    vehicle_arr.push(vehicle_tmp)
}
let xoff = 0,yoff = 0;
    for(let i = 0; i< blockSize; i++ ){
        for (let j = 0;j < blockSize;j++){
            // adding the flow field values
            
            let newVector = map(noise(xoff,yoff),0,1,0,PI*2);
            // newVector = Math.random()*xoff + yoff;
          
          
            flow_field.push([cos(newVector),sin(newVector),floor(i*(width/blockSize)*1),floor(j*(height/blockSize)*1),p5.Vector.fromAngle(newVector)])
            yoff +=.01
        
        }
        xoff +=.01
    }
    // noLoop();
    fill(240);
}
/*
    800/10 = 80 -> (800/(80/10))
*/ 

let Weight = .995;  // Weight for seeking the target (Will Power)
let show_Field = 0;  // Showing Flow Fields
let ants = 1; // Switch for Ants and planes

function draw(){
    // console.log("its_Working");
    background(250);

    strokeWeight(2)
    for(let i = 0 ; i < flow_field.length*show_Field; i++){
        let Curr_flow_field = flow_field[i];
        line(Curr_flow_field[2],Curr_flow_field[3],
            Curr_flow_field[2]-Curr_flow_field[4].x*50,Curr_flow_field[3]-Curr_flow_field[4].y*50)
    }   
        // get the location and its underineth dirVector
            for (let k = 0; k< vehicle_arr.length*1;k++){
                let vehicle_tmp = vehicle_arr[k];
                let index = [Math.floor(vehicle_tmp.location.x/(width/blockSize)),Math.floor(vehicle_tmp.location.y/(height/blockSize))] 
                let flowVector = flow_field[index[0]*blockSize + index[1]];

                if (flowVector){
                    // flowVector = [noise(vehicle_tmp.location.x,vehicle_tmp.location.y)]
                    if(keyIsPressed){
                    fill(250,250,0);
                    noStroke();
                    // ellipse(mouseX,mouseY,200,200)
                    fill(255)
                    // Weight = map(sin(k),-1,1,0.65,1)*keyIsPressed;
                    vehicle_tmp.seek(createVector((flowVector[0]*width)*(1-Weight) + mouseX*(Weight),(flowVector[1]*height)*(1-Weight) +mouseY*(Weight)))
                    }
                    // vehicle_tmp.seek(createVector(flowVector[0]*width,flowVector[1]*height))
                    vehicle_tmp.Behivours(100,vehicle_arr);
                    vehicle_tmp.update();
                    vehicle_tmp.display(ants);
                   
                }
            }
        
}   

// ADD EVENT LISTINER;

function mouseClicked(){
    if (ants)
        ants = false;
    else ants = true;
}

function keyPressed(){
    console.log("inside")

}


/*
TODO: Make it organic(Natural):-

    1. properties of Ants:
        - Size ( smaller the faster and need less food to survive) 
        - health meter
        - life span /growth (Child -> teen -> adult -> old)
        - emotion (Color represent it more red == angry guy)
        - speed
        - love meter ( if > 0.5 then its ready for reproduction find the mate)
        - survivability meter ( with mutation its not all ablout the survival of the fittest)
    2. Behivours:-
        Size :-
            smaller it is the faster it will jump onto its food aswell as being able to get out of the 
            trouble (preditors)
        Health meter :-
            help us to tract the health of an entity
            as the health decreases everything decreeses i.e, speed ajility and emotion : "hopeless"
        life span :
            everything changes according to the life span
        Emotion :-
            Extremely important property
            type: happy , sad , hungry , excited , angry , love , scare; 
            happy :
                size == same 
                speed ++
                more friendly (cohesion)
                and easily turned
            sad  :
                speed == normal--
                less friendly (cohesion)
                not easily turned with groups
            hungry :
                speed += a little bit
                no cohesion
                no groups
                (searching for food desperatiely)
            excited :
                speed ++
                full group
                proactive
            angry   : 
                speed = normal 
                no group 
                active
            love    :
                ready for reproduction
                speed ++
                proactive
                color change 
            scare   :
                anti group 
                anti attraction
                speed ++
                proactive
    3. Mutation
        add a little mutation inwhich ant becomes blue and they are smaller , faster , and posizonous 
        to eat by preditors so they cant eat them which make there survivability % very high!!! 
*/


/*
    Priority : reproduction!!
*/