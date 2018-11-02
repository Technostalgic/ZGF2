// An object that handles game related logic
class Game {
	constructor() {

		// the target resolution of the application
		this.resolution = new vec2(600, 600);

		// the canvas that everything will be rendered onto
		this.renderTarget = document.createElement("canvas");
		this.renderTarget.width = this.resolution.x;
		this.renderTarget.height = this.resolution.y;
		this.renderContext = this.renderTarget.getContext("2d");

		// the webpage canvas to render the game to
		this.paintTarget = null;
		this.paintContext = null;

		this.elapsedTime;
		this.trueElapsedTime;
		this.timescale = 1;
		this.inputHandler = null;
		this._isRunning = false;
		this._lastStep = 0;
	}
	
	/** attaches an @type {InputHandler} object to the game */
	AttachInputHandler(/** @type {InputHandler} */handler){
		this.inputHandler = handler;
	}

	/** sets the canvas that the game will be rendered onto */
	SetPaintingTarget(canvas) {
		
		this.paintTarget = canvas;
		this.paintContext = this.paintTarget.getContext("2d");
	}

	/** starts running the game */
	StartRunning(){

		this.inputHandler.AttachEvents(this.paintTarget);

		this._lastStep = performance.now();
		this._isRunning = true;
		
		this.step();
	}
	/** stops running the game */
	StopRunning(){

		this.inputHandler.DetachEvents(this.paintTarget);
		this._isRunning = false;
	}

	/** @private handles a full game cycle and sets up another to be called */
	step() {

		// calculate the delta time and update the game accordingly
		var now = performance.now();
		var dt = now - this._lastStep();
		this._lastStep = now;
		this.Update(dt);

		// renders the game to the specified painting target
		this.RenderToCanvas(this.paintTarget, this.paintContext);

		// sets up the next step to be called if the game is running
		if (this._isRunning)
			requestAnimationFrame(this.step);
	}
	/** updates the game world by the specified delta time in seconds */
	Update(/**@type {Number}*/ dt) {

		// increment the elapsed time counters
		trueElapsedTime += dt;
		dt *= this.timescale;
		elapsedTime += dt;
	}
	
	/** clears the canvas to a solid color */
	ClearCanvas(/** @type {Color}*/color = new Color(255, 255, 255)){
		
		this.paintContext.fillStyle = color.ToRGB();
		this.paintContext.fillRect(0, 0, this.paintTarget.width, this.paintTarget.height);
	}
	/** paints the renderTarget to the specified canvas */
	RenderToCanvas(/**@type {HTMLCanvasElement}*/canvas, /**@type {CanvasRenderingContext2D}*/ context) {

		this.ClearCanvas();
		var drawTarget = new rect(vec2.zero, this.resolution.clone);
		context.drawImage(this.renderTarget, drawTarget.left, drawTarget.top, drawTarget.width, drawTarget.height);
	}
}