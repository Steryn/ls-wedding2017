// / <reference path="../../vendor/playcanvas-stable.js" />

// playcanvas --------------------------------------------------------------------------------
// create a PlayCanvas application
function init3D() {
    var canvas = document.getElementById('application');
    var app = new pc.Application(canvas, {});
    app.start();
    sc.app = app;

    // fill the available space at full resolution
    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);

    // ensure canvas is resized when window changes size
    window.addEventListener('resize', function() {
        app.resizeCanvas();
    });

    var particleTexture = new pc.Entity('test');
    particleTexture.addComponent('model', {
        type: 'sphere',
    });

    var cube = new pc.Entity('cube');
    cube.addComponent('model', {
        type: 'box'
    });

    // var mode = new pc.Assets('a', '/assets/a/a.json');
    sc.asset = new pc.Asset("a texture", "texture", {
        url: "/assets/b.png"
    });

    sc.a = new pc.Entity('a');
    sc.a.addComponent('model', {
        enabled: true,
        isStatic: false,
        type: 'asset',
        asset: sc.asset,
        materialAsset: null,
        castShadows: true,
        castShadowsLightmap: true,
        receiveShadows: true,
        lightMapped: false,
        lightMapSizeMultiplier: 1.0
    })
    sc.a.setPosition(0, 0, 0);

    sc.colorMap = new pc.Texture(app.graphicsDevice, {
        width: 32,
        height: 32,
        format: pc.PIXELFORMAT_R8_G8_B8_A8
    });

    sc.colorMap.anisotropy = 16;
    sc.colorMap.addressU = pc.ADDRESS_CLAMP_TO_EDGE;
    sc.colorMap.addressV = pc.ADDRESS_CLAMP_TO_EDGE;

    sc.img = new Image();
    sc.img.onload = function() {
        sc.colorMap.setSource(sc.img);
    };
    sc.img.src = 'assets/b.png';
    sc.img.onload();

    sc.particlesystem.default.colorMap = sc.colorMap;

    sc.particleTexture = new pc.Entity('par');
    sc.part = sc.particleTexture.addComponent('particlesystem', sc.particlesystem.default);

    // create camera entity
    var camera = new pc.Entity('camera');
    sc.camera = camera;
    camera.addComponent('camera', {
        clearColor: new pc.Color(0, 0, 0, 0)
    });

    // create directional light entity
    var light = new pc.Entity('light');
    light.addComponent('light');

    // add to hierarchy
    app.root.addChild(camera);
    app.root.addChild(light);
    app.root.addChild(sc.particleTexture);
    app.root.addChild(sc.a);
    //app.root.addChild(cube);

    // set up initial positions and orientations
    camera.setPosition(0, 0, 8);
    light.setEulerAngles(45, 0, 0);
    cube.setPosition(0, 0, -2);


    // register a global update event
    var t = 0;
    app.on('update', function(deltaTime) {
        //cube.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
        //sc.particleTexture.rotate(10 * deltaTime, 20 * deltaTime, 30 * deltaTime);
        // camera.setRotation(0, 0, t*0.01, 1);

        //sc.part.colorGraph = new pc.CurveSet([0, 0.5], [0, 0.5], [0, 0.5]);
    });

    sc.gamma = 0;
    sc.beta = 0;
    sc.alpha = 0;
    sc.orient = {
        alpha: 0,
        beta: 0,
        gamma: 0
    }
    sc.initOrientation3D = function() {
        var A = this;
        window.addEventListener("deviceorientation", function(i) {
            i.gamma > 90 ? A.orient.gamma = i.gamma - 180 : A.orient.gamma = i.gamma,
                A.orient.gamma *= 1,
                A.orient.gamma = Math.min(10, Math.max(-10, Math.floor(A.orient.gamma)));

            sc.gamma = Math.floor(i.gamma);
            sc.beta = Math.floor(i.beta);
            sc.alpha = Math.floor(i.alpha);

            sc.part.velocityGraph = new pc.CurveSet([0, A.orient.gamma], [0, 3], [0, 0]);
        });
    };
    //sc.initOrientation3D();
};