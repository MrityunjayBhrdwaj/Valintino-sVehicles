// Behivours of the vehicles
// Steering force = desired velocity- current Velocity

var Vehicle = {
    location    : 0,
    velocity    : 0,
    accleration : 0,
    max_force   : 0,
    max_speed   : 0,
    radius      : 0,
    target      : 0,
    color       : 0,
    angle       : 0,
    create : function (locVec,Velvec,accVec,_mforce,_mspeed,_radius,_mass){
        // Do something...
        var obj = Object.create(this);
        obj.location    = locVec;
        obj.velocity    = (Velvec);
        obj.accleration = accVec;
        obj.max_force   = _mforce;
        obj.max_speed   = _mspeed;
        obj.radius      = _radius; 
        obj.target      = createVector(10,010);
        obj.mass        = _mass | 1;
        obj.color       = [Math.random()*255,Math.random()*255,Math.random()*255]
        obj.angle       = PI/3;
        return obj;
    },
    addforce : function (new_force){
        new_force.mult(1/this.mass);// divide by mass
        this.accleration.add(new_force);
        
        
    },
    update : function (){
        this.velocity.add(this.accleration);
        // this.velocity.limit(this.max_speed);
        this.location.add(this.velocity);
        // reinit   ializing it to 0
        this.accleration.mult(0)

        // Edge cases
       

            if (this.location.x > width){
                this.location.x = 30
            }
             if (this.location.x < 0){
                this.location.x = width-20
            }
             if (this.location.y < 0){
                this.location.y = height-30

            }
             if (this.location.y > height){
                this.location.y = 20

            }
        
        },
    seek : function (_target,_factor=1){
        // seeking the target;
        desired = p5.Vector.sub(_target,this.location);
        // desired.normalize();
        if (desired.mag() < width/2){
        if (desired.mag() < 100){
            let new_mag = map(desired.mag(),0,100,0,this.max_speed);
            
            desired.setMag(new_mag)
        }
        // desired.mult(0.05)
        desired.limit(this.max_speed*2);
        
        
        // desired.mult(-1); // repelling effect
        
        
        this.target = _target;
        // turning towards the target
        steer = p5.Vector.sub(desired,this.velocity);
        // steer = this.velocity.sub(desired);
        steer.limit(this.max_force);
        steer.mult(_factor);
        this.addforce(steer);
        // console.log("desired ",desired," steer",
        // steer);
    }
    },
    Behivours : function (threshold,vehicle_arr){
        // appling stearing = desired - curr
        
        // saperate from all the birds
        let sep = createVector(0,0);
        let count = 0;
        let tvel = createVector(0,0);
        let tloc = createVector(0,0);

        for (let i = 0; i< vehicle_arr.length; i++){
            let curr_vehicle = vehicle_arr[i];
            let dist = p5.Vector.dist(this.location,curr_vehicle.location)
        //    console.log("dist: ",dist);
           
           if (dist > 0 && dist < threshold){
                // then get away from him
                // console.log("inside")
                
                // alignment
                tvel.add(curr_vehicle.velocity); 
                tloc.add(curr_vehicle.location);

                // aggration

                // sepration
                let sub = p5.Vector.sub(this.location,curr_vehicle.location);
                sub.normalize();
                sub.div(dist);// Weight by distance
                sep.add( sub )
                count ++ ;
            }
        }
        if(count > 0){
            // console.log("its working")
            sep.div(count);
            sep.normalize();
            sep.mult(this.max_speed)        
            
            tvel.div(count);
            tloc.div(count);

            // Ants  : .7 .8 1
            // Birds : .9 .8 .6
            this.Seprate(sep,.7);
            this.Align(tvel,0.8);
            this.Cohesion(tloc,0.8);
        }
        

    },
    Seprate : function(_avg_vel,_fac=1){
    // Seprate  = maintaining distance b/w neighbours

        let seprate = p5.Vector.sub(_avg_vel,this.velocity);
            seprate.limit(this.max_force);
        seprate.mult(_fac)
        this.addforce(seprate);
    },
    Align  : function(_totalVelocity,_fac){
    // Alignment = align the vector to all the neighbours
    
        align_vec = _totalVelocity;
        align_vec.normalize();
        align_vec.mult(this.max_speed);
        align_vec = p5.Vector.sub(align_vec,this.velocity);
        align_vec.limit(this.max_force)

        align_vec.mult(_fac);

        this.addforce(align_vec);

    },
    Cohesion : function(_locVec,_fac){
         // Cohesion   = towards the avg. center

         this.seek(_locVec,_fac)

    }
    ,

    display : function (_switch){
        // Vehicle is a tringular object pointing towards the dir(velocity) vector 
        head_angle = this.velocity.heading() + PI/2; 
        stroke(200,10,100);
        // console.log("head_angle",head_angle);
        // console.log("location: ",this.location)
        strokeWeight(20)
        stroke(0,300,0)
        shape = p5.Vector.fromAngle(head_angle);
        // displaying the target
        strokeWeight(2);
        stroke(100)
        size = 30;
        
        this.angle = head_angle;
          
        
        if(!_switch){
            // Switching to test plane mode

            push();
            translate(this.location.x,this.location.y);
            rotate(head_angle);
            beginShape();
            vertex(0,-this.radius*2*size*.13)
            vertex(-this.radius*size*.13,this.radius*2*size*.13)
            vertex(this.radius*size*.13,this.radius*2*size*.13)
            endShape(CLOSE);
            pop();
        }
        else{
            // Ants mode

            console.log("before");     
            push();
            translate(this.location.x,this.location.y);
            rotate(PI/180*90 +this.angle);
            imageMode(CENTER)
            image(character,0,0,this.radius*size,this.radius*size);     
            // image(character,0,0);
            console.log("after");     
            pop();  
        }
        // ellipse(this.location.x,this.location.y,this.radius*10,this.radius*10);
        strokeWeight(4)
        // point(this.location.x,this.location.y);
        }
        
        
    }
    var flowField = {
        divSize    : 0,
        resolution : {x : 0, y: 0},
        flowVector : [],
        create     : function(){
            var flowObj = Object.create(this);
            flowObj.divSize = _divSize;
            flowObj.resolution.x = _width/divSize
            flowObj.resolution.y = _height/divSize
            
            // Creating the flowVector
            for (let i = 0; i<flowObj.divSIze;i++){
                for (let j = 0; j<flowObj.divSIze;j++){
                
                }   
            }
            
        }

    }
    // Now Creating the Flow Field

