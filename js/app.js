import Painter from "./painter.js"


import * as THREE from "three"

import Stats from "three/addons/libs/stats.module.js"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"

const SHOW_STATS = false
const SHOW_GRID = false
const AUTO_ROTATE = true


let renderer, scene, camera, stats, controls, raycaster

const pointer = new THREE.Vector2()

const painter = new Painter(10000, 0.2)
const worker = new Worker("./js/worker.js")

worker.postMessage({ count:painter.count })

worker.onmessage = (e) => {

	painter.update(e.data.update)

}

const makeAxes = (scene) => {

	const size = 100
	const divisions = 50

	const xyPlane = new THREE.GridHelper( size, divisions )
	xyPlane.position.x = size / 2
	xyPlane.position.z = size / 2

	scene.add( xyPlane )

	const xzPlane = new THREE.GridHelper( size, divisions )
	xzPlane.rotateX(Math.PI/2)
	xzPlane.position.x = size / 2
	xzPlane.position.y = size / 2
	xzPlane.position.z = size
	scene.add( xzPlane )

	const yzPlane = new THREE.GridHelper( size, divisions )
	yzPlane.rotateZ(Math.PI/2)
	yzPlane.position.x = size
	yzPlane.position.y = size / 2
	yzPlane.position.z = size / 2

	scene.add( yzPlane )

}

const init = () => {

	const container = document.getElementById( "container" )

	scene = new THREE.Scene()

	painter.build(scene)

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 400 )
	camera.position.set( 0, 50, 0 )

	controls = new OrbitControls(camera, container)
	controls.enableDamping = true

	const target = new THREE.Vector3(50, 50, 50)
	camera.lookAt(target)
	controls.target.set(...target)

	camera.updateMatrix()
	controls.update()


	if (AUTO_ROTATE)
	{
		controls.autoRotate = true
		controls.autoRotateSpeed = -1	
	}

	renderer = new THREE.WebGLRenderer( { antialias: true } )
	renderer.setPixelRatio( window.devicePixelRatio )
	renderer.setSize( window.innerWidth, window.innerHeight )
	container.appendChild( renderer.domElement )


	//const lightA = new THREE.AmbientLight( 0xffaa99 )
	//scene.add( lightA )

	if (SHOW_GRID) makeAxes(scene)


	if (SHOW_STATS)
	{
		stats = new Stats()
		container.appendChild( stats.dom )	
	}

	window.addEventListener( "resize", onResize )
	document.addEventListener( "pointermove", onPointerMove )



}

const onPointerMove = ( event ) => {

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1

}

const onResize = () => {

	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize( window.innerWidth, window.innerHeight )

}

const animate = () => {

	requestAnimationFrame( animate )



	render()

	controls.update()


	if (SHOW_STATS)
	{
		stats.update()
	}

}

const render = () => {


	renderer.render( scene, camera )

}

init()
animate()

