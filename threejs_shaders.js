import * as THREE from 'three';

function main() {

	let container;
	let camera, scene, renderer;

	init();
	animate();

	function init() {

		container = document.getElementById('container');

		camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
		camera.position.z = 1;
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );

		const plane = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);

		const material = new THREE.ShaderMaterial({
			uniforms: {
				u_time: { value: 1.0 },
				u_resolution: new THREE.Uniform( new THREE.Vector2() ),
				u_mouse: new THREE.Uniform( new THREE.Vector2() )
			},
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
			transparent: true,
		});

		const mesh = new THREE.Mesh( plane, material );
		scene.add( mesh );

		const canvas = document.querySelector('#glCanvas');

		renderer = new THREE.WebGLRenderer({canvas});
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		
		container.appendChild( renderer.domElement );

		const object = scene.children[ 0 ];
		object.material.uniforms.u_mouse.value.x = (window.innerHeight) * 2 + 1;
	    object.material.uniforms.u_mouse.value.y = (window.innerHeight) * 2 + 2;

		window.addEventListener( 'resize', onWindowResize );
		document.addEventListener('mousemove', onPointerMove, false);
	};

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	};

	function onPointerMove(event) {
		event.preventDefault();
		const mouseX = (event.clientX) * 2 - 1,
			mouseY = (event.clientY) * 2 + 1,
	    	object = scene.children[ 0 ];
	    object.material.uniforms.u_mouse.value.x = mouseX;
	    object.material.uniforms.u_mouse.value.y = mouseY;
	};

	function render() {
		const object = scene.children[ 0 ];
		object.material.uniforms.u_resolution.value.x = window.innerWidth;
		object.material.uniforms.u_resolution.value.y = window.innerHeight;  
		renderer.render( scene, camera );
	};

	function animate() {
		requestAnimationFrame( animate );
		render();
	};
};

main();
