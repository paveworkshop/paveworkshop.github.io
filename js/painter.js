import * as THREE from "three"

const INSTANCE_SCALE = 1

export default class Painter
{
	constructor(count, scale)
	{
		this.scale = scale
		this.count = count

		this.scene = null
		this.mesh = null

		this.matrix = new THREE.Matrix4()
		this.matrix.setPosition(0, 0, 0)

		this.colour = new THREE.Color(`hsl(200, 80%, 70%)`)

	}

	update()
	{

	}

	build(scene)
	{
		this.scene = scene


		//const geometry = new THREE.BoxGeometry(this.scale, this.scale, this.scale)
		//const geometry = new THREE.TetrahedronGeometry( this.scale, 0 )
		const geometry = new THREE.IcosahedronGeometry(this.scale*INSTANCE_SCALE, 0)

		//const material = new THREE.MeshLambertMaterial( {color: 0xffffff} )
		const material = new THREE.MeshBasicMaterial( {color: 0xffffff} )




		const mesh = new THREE.InstancedMesh( geometry, material, this.count )

		for ( let i = 0; i < this.count; i ++) {

			mesh.setMatrixAt( i, this.matrix )
			mesh.setColorAt( i, this.colour )


		}

		this.scene.add( mesh )

		this.mesh = mesh

		this.mesh.traverse(function(obj) { obj.frustumCulled = false })

		
	}

	setInstance(index, position, colour)
	{
		this.mesh.getMatrixAt(index, this.matrix)
		this.matrix.setPosition(position.x, position.z, position.y)

		this.mesh.setMatrixAt(index, this.matrix)
		this.mesh.setColorAt(index, colour)



	}

	update(data)
	{
		let x,y,z = 0


		for (let i = 0; i < data.length/3; i++)
		{
			x = data[i*3]
			y = data[i*3+1] 
			z = data[i*3+2]

			this.mesh.getMatrixAt(i, this.matrix)
			this.matrix.setPosition(x + 50, z + 20, y + 50)
			this.mesh.setMatrixAt(i, this.matrix)

			this.colour.setHSL((x/100 * 0.5 + y/100 * 0.2 + z/100 * 0.1) % 1, 0.5, 0.6)
			this.mesh.setColorAt(i, this.colour)

		}

		this.mesh.instanceColor.needsUpdate = true
        this.mesh.instanceMatrix.needsUpdate = true
	}

	purge()
	{
		const meshes = []

		this.scene.traverse( function ( object ) {

			if ( object.isMesh ) meshes.push( object )

		} )

		for ( let i = 0; i < meshes.length; i ++ ) {

			const mesh = meshes[ i ]
			mesh.material.dispose()
			mesh.geometry.dispose()

			this.scene.remove( mesh )

		}
	}
}



