// An object that handles game related logic
class Game {
	constructor() {

		// the target resolution of the application
		this.resolution = new vec2(320);

		// the canvas that everything will be rendered onto
		this.renderTarget = document.createElement("canvas");
		this.renderTarget.width = this.resolution.x;
		this.renderTarget.height = this.resolution.y;
		this.renderContext = this.renderTarget.getContext("2d");
		this.renderContext.imageSmoothingEnabled = false;

		// the webpage canvas to render the game to
		/** @type {HTMLCanvasElement} */
		this.canvasTarget = null;
		/** @type {CanvasRenderingContext2D} */
		this.canvasTargetContext = null;
		/** @type {rect} */
		this.viewport = null;

		/** @type {GUI} */
		this.currentGUI = null;
		/** @type {Number} */
		this.elapsedTime = 0;
		/** @type {Number} */
		this.trueElapsedTime = 0;
		/** @type {Number} */
		this.timescale = 1;
		/** @type {InputHandler} */
		this.inputHandler = null;
		/** @type {Boolean} */
		this._isRunning = false;
		/** @type {Number} */
		this._lastStep = 0;
	}

	/** sets the current GUI of the game */
	SetCurrentGUI(/**@type {GUI}*/gui) {

		gui.parentGame = this;
		this.currentGUI = gui;
		this.currentGUI.Initialize();
	}
	/** attaches an @type {InputHandler} object to the game */
	SetInputHandler(/** @type {InputHandler} */handler) {

		handler.parentGame = this;
		this.inputHandler = handler;
	}
	/** sets the canvas that the game will be rendered onto */
	SetCanvasTarget(canvas) {

		this.canvasTarget = canvas;
		this.canvasTargetContext = this.canvasTarget.getContext("2d");
		this.canvasTargetContext.imageSmoothingEnabled = false;

		var maxSize = Math.max(canvas.width, canvas.height);
		this.viewport = new rect(new vec2(), new vec2(maxSize));
		this.viewport.center = new vec2(canvas.width, canvas.height).Scaled(0.5);
	}

	/** starts running the game */
	StartRunning() {

		this.inputHandler.AttachEvents(this.canvasTarget);

		this._lastStep = performance.now() / 1000;
		this._isRunning = true;

		this.step();
	}
	/** stops running the game */
	StopRunning() {

		this.inputHandler.DetachEvents(this.canvasTarget);
		this._isRunning = false;
	}

	/** @private handles a full game cycle and sets up another to be called */
	step() {

		// calculate the delta time and update the game accordingly
		var now = performance.now() / 1000; // current time in seconds
		var dt = now - this._lastStep;
		this._lastStep = now;
		this.Update(dt);

		// renders the game to the specified painting target
		this.RenderToCanvas(this.canvasTarget, this.canvasTargetContext);

		// sets up the next step to be called if the game is running
		var ths = this;
		if (this._isRunning)
			requestAnimationFrame(function () { ths.step(); });
	}
	/** updates the game world by the specified delta time in seconds */
	Update(/**@type {Number}*/ dt) {

		// increment the elapsed time counters
		this.trueElapsedTime += dt;
		dt *= this.timescale;
		this.elapsedTime += dt;

		// update the current GUI
		if (this.currentGUI)
			this.currentGUI.Update(dt);
	}

	/** clears the canvas to a solid color */
	ClearCanvas(/** @type {Color}*/color = new Color(255, 255, 255)) {

		this.canvasTargetContext.fillStyle = color.ToRGB();
		this.canvasTargetContext.fillRect(0, 0, this.canvasTarget.width, this.canvasTarget.height);

		this.renderContext.fillStyle = color.ToRGB();
		this.renderContext.fillRect(0, 0, this.renderTarget.width, this.renderTarget.height);
	}
	/** paints the renderTarget to the specified canvas */
	RenderToCanvas(/**@type {HTMLCanvasElement}*/canvas, /**@type {CanvasRenderingContext2D}*/ context) {

		this.ClearCanvas();

		if (this.currentGUI)
			this.currentGUI.Draw();

		context.drawImage(this.renderTarget, this.viewport.left, this.viewport.top, this.viewport.width, this.viewport.height);
	}
}