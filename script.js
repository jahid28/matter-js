// const { Vertices } = require("matter-js");

var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  Common = Matter.Common,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Body=Matter.Body,
  Svg=Matter.Svg,
  Vector=Matter.Vector,
  Vertices=Matter.Vertices,
  Bodies = Matter.Bodies;

// create engine
var engine = Engine.create(),
  world = engine.world;

  engine.gravity.y = 1;
// create renderer
var render = Render.create({
  element: document.getElementById("canvas"),
  engine: engine,
  options: {
    background: "none",
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    // showVelocity: true,
    // showAngleIndicator: true,
  },
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var boxA = Bodies.rectangle(400, 200, 80, 80, {
  render: {
    // sprite: {
      // texture: "test.jpg",
    // },
    fillStyle:"gray"
  },
});
var boxB = Bodies.rectangle(400, 200, 80, 80);
var stack = [boxA, boxB];
boxA.collisionFilter = {
  category: 0x1110,
  mask: 0xfffffff,
  group: 1,
};
let pp = document.getElementById("pp");

// setInterval(() => {
//     // console.log(boxA.position)
//     pp.style.left=`${boxA.position.x}px`
//     pp.style.top=`${boxA.position.y}px`
// }, 10);

// var stack = Composites.stack(20, 20, 10, 5, 0, 0, function (x, y) {
//   var sides = Math.round(Common.random(1, 8));

//   // round the edges of some bodies
//   var chamfer = null;
//   if (sides > 2 && Common.random() > 0.7) {
//     chamfer = {
//       radius: 10,
//     };
//   }

//   switch (Math.round(Common.random(0, 1))) {
//     case 0:
//       if (Common.random() < 0.8) {
//         return Bodies.rectangle(
//           x,
//           y,
//           Common.random(25, 50),
//           Common.random(25, 50),
//           { chamfer: chamfer }
//         );
//       } else {
//         return Bodies.rectangle(
//           x,
//           y,
//           Common.random(80, 120),
//           Common.random(25, 30),
//           { chamfer: chamfer }
//         );
//       }
//     case 1:
//       return Bodies.polygon(x, y, sides, Common.random(25, 50), {
//         chamfer: chamfer,
//       });
//   }
// });

function svg() {
  const paths = document.querySelectorAll(".svg");
  paths.forEach((path, i) => {
    let vertices=Svg.pathToVertices(path)
    // let vertices = svg.pathToVertices(path);
    let scaleFactor = (document.getElementById("canvas").clientWidth * .3)/100;

    vertices=Vertices.scale(vertices,scaleFactor,scaleFactor)
    let svgBody=Bodies.fromVertices(
      i*100 + 200,
      0,
      [vertices], {
        render: {
          // sprite: {
          //   texture: "test.jpg",
          // },
          fillStyle:"gray"
        },
      }
    )
   
    // console.log(path.id)

    Composite.add(world,svgBody)
  });

}

svg()

Composite.add(world, stack);

Composite.add(world, [
  // walls
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 50, {
    isStatic: true,
  }),
  Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
  Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
  Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
]);

// add mouse control
var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
  min: { x: 0, y: 0 },
  max: { x: 800, y: 600 },
});
