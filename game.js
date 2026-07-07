// ============================================
// SHADOWS OF THE BAKURA - PHASE 2
// CORE GAME ENGINE
// ============================================


// THREE SETUP

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2(
    0x050505,
    0.035
);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);


const renderer = new THREE.WebGLRenderer({
    antialias:true
});


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(window.devicePixelRatio,2)
);


document
.getElementById("canvas")
.appendChild(renderer.domElement);





// ============================================
// GAME STATE
// ============================================


const GAME = {

    health:100,

    ammo:12,

    flashlight:false,

    sprint:false,

    crouch:false,

};






// ============================================
// LIGHTING
// ============================================


const ambient = new THREE.AmbientLight(
    0x111111,
    1
);

scene.add(ambient);



const moon = new THREE.DirectionalLight(
    0x667799,
    .4
);


moon.position.set(
    50,
    100,
    20
);


scene.add(moon);



// FLASHLIGHT


const flashlight = new THREE.SpotLight(
    0xffffff,
    0,
    80,
    Math.PI/7,
    .5
);


flashlight.position.set(
    0,
    0,
    0
);


camera.add(flashlight);

scene.add(camera);






// ============================================
// WORLD
// ============================================


function createWorld(){


    // ground

    const ground = new THREE.Mesh(

        new THREE.PlaneGeometry(
            500,
            500
        ),

        new THREE.MeshStandardMaterial({

            color:0x080b08

        })

    );


    ground.rotation.x =
    -Math.PI/2;


    scene.add(ground);




    // trees

    for(let i=0;i<300;i++){


        let tree = new THREE.Mesh(

            new THREE.ConeGeometry(
                2,
                10,
                6
            ),

            new THREE.MeshStandardMaterial({

                color:0x101810

            })

        );


        tree.position.set(

            (Math.random()-0.5)*300,

            5,

            (Math.random()-0.5)*300

        );


        scene.add(tree);


    }




    // CULT BASE WALL


    const wall = new THREE.Mesh(

        new THREE.BoxGeometry(
            100,
            15,
            3
        ),

        new THREE.MeshStandardMaterial({

            color:0x202020

        })

    );


    wall.position.set(
        0,
        7.5,
        -70
    );


    scene.add(wall);




    // towers


    for(let x of [-45,45]){


        const tower = new THREE.Mesh(

            new THREE.CylinderGeometry(
                4,
                5,
                30
            ),

            new THREE.MeshStandardMaterial({

                color:0x151515

            })

        );


        tower.position.set(
            x,
            15,
            -70
        );


        scene.add(tower);


    }


}


createWorld();







// ============================================
// RAIN SYSTEM
// ============================================


const rainGeo =
new THREE.BufferGeometry();


let rain =
new Float32Array(
    3000
);


for(let i=0;i<3000;i+=3){


    rain[i]=
    (Math.random()-0.5)*200;


    rain[i+1]=
    Math.random()*100;


    rain[i+2]=
    (Math.random()-0.5)*200;


}


rainGeo.setAttribute(

    "position",

    new THREE.BufferAttribute(
        rain,
        3
    )

);



const rainSystem =
new THREE.Points(

    rainGeo,

    new THREE.PointsMaterial({

        color:0xaaaaaa,

        size:.15

    })

);


scene.add(rainSystem);









// ============================================
// PLAYER
// ============================================


const player = {


    position:new THREE.Vector3(
        0,
        2,
        30
    ),


    speed:0.12,


    height:2,


};



camera.position.copy(
    player.position
);






// ============================================
// CONTROLS
// ============================================


const keys={};


document.addEventListener(
"keydown",
e=>{


keys[e.key.toLowerCase()]=true;



if(e.key==="Shift")
GAME.sprint=true;



if(e.key==="f"){

GAME.flashlight =
!GAME.flashlight;


flashlight.intensity =
GAME.flashlight?3:0;


}


});


document.addEventListener(
"keyup",
e=>{


keys[e.key.toLowerCase()]=false;


if(e.key==="Shift")
GAME.sprint=false;


});







// MOBILE INPUT


const mobile={

forward:false,
back:false,
left:false,
right:false

};



function button(id,key){


document
.getElementById(id)
.addEventListener(
"touchstart",
()=>mobile[key]=true
);


document
.getElementById(id)
.addEventListener(
"touchend",
()=>mobile[key]=false
);


}



button("up","forward");
button("down","back");
button("left","left");
button("right","right");



document
.getElementById("flashlight")
.onclick=()=>{


GAME.flashlight =
!GAME.flashlight;


flashlight.intensity =
GAME.flashlight?3:0;


};









// ============================================
// MOUSE LOOK
// ============================================


let yaw=0;


document.addEventListener(
"mousemove",
e=>{


if(
document.pointerLockElement
){


yaw -= e.movementX*.002;


camera.rotation.y=yaw;


}


});


renderer.domElement.onclick=()=>{


renderer.domElement.requestPointerLock();


};







// ============================================
// PLAYER UPDATE
// ============================================


function updatePlayer(){


let speed =
GAME.sprint?
player.speed*2:
player.speed;



let move =
new THREE.Vector3();



if(keys.w || mobile.forward)
move.z-=1;


if(keys.s || mobile.back)
move.z+=1;


if(keys.a || mobile.left)
move.x-=1;


if(keys.d || mobile.right)
move.x+=1;



if(move.length()>0){

move.normalize();


move.applyAxisAngle(
new THREE.Vector3(0,1,0),
camera.rotation.y
);


player.position.addScaledVector(
move,
speed
);


}



camera.position.copy(
player.position
);



}









// ============================================
// UPDATE
// ============================================


function animate(){


requestAnimationFrame(
animate
);



updatePlayer();




// rain movement


let pos =
rainGeo.attributes.position.array;


for(let i=1;i<pos.length;i+=3){


pos[i]-=.8;


if(pos[i]<0)
pos[i]=100;


}


rainGeo.attributes.position.needsUpdate=true;



renderer.render(
scene,
camera
);


}



animate();








// ============================================
// FADE IN
// ============================================


setTimeout(()=>{


document
.getElementById("fade")
.style.opacity=0;


},500);
