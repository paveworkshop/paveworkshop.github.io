const a = 10.0
const b = 28.0
const c = 8.0 / 3.0

const mod = (n, m) => {
  return ((n % m) + m) % m
}

class Walker
{
	constructor(painter)
	{
		this.painter = painter
		this.particles = []

		this.started = Date.now()
		this.lastPolled = Date.now()
		this.lastSent = Date.now()
	
		this.data = new Float64Array(painter.count*3)

		this.step = 0

		const radius = 0.2
		for (let i = 0; i < this.painter.count/3; i++)
		{

			this.data[i*3] = Math.random() * radius * 2
			this.data[i*3+1] = Math.random() * radius * 2
			this.data[i*3+2] = Math.random() * radius * 2

		}

		this.timeStep = 0.0001
	}

	update()
	{
		let sending = false

		const frameElapsed = Date.now() - this.lastPolled
		const totalElapsed = Date.now() - this.started

		if (Date.now() - this.lastSent > 20)
		{
			sending = true
			this.lastSent = Date.now()

		}

		for (let i = 0; i < this.painter.count/3; i++)
		{

			const x = this.data[i*3]
			const y = this.data[i*3+1]
			const z = this.data[i*3+2]

					
			const dx = (a * (y - x)) * this.timeStep
			const dy = (x * (b - z) - y) * this.timeStep
			const dz = (x * y - c * z) * this.timeStep

			this.data[i*3] += dx
			this.data[i*3+1] += dy 
			this.data[i*3+2] += dz


			/**
			if ((Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(x, 2)) < 0.00001)
			{
				this.data[i*3] = 1
				this.data[i*3+1] = 1
				this.data[i*3+2] = 1
			}
			**/

		}



		this.lastPolled = Date.now()
		
		return sending
	}
}

onmessage = (e) => {

	const walker = new Walker(e.data)

	while (true)
	{
		if (walker.update())
		{
			postMessage({update:walker.data})
		}
	}
}
