/*
 *
 *  POCKET ROCKET
 *
 */

(function () {

	/*
	 *
	 *  General variables
	 *
	 */

	var _canvFunc;
	var _doc;
	var _frame;
	var _fps;
	var _hudHeight;
	var _reqFrame;
	var _reqId;
	var _soundPlayer;
	var _sounds;
	var _soundEnabled;
	var _speedCorrection;
	var _storage;
	var _synth;
	var _w;
	var _wrapper;

	/*
	 *
	 *  SCREENS
	 *
	 */

	var _gameOverScreen;
	var _gameOverTitle;
	var _gameOverSubTitle;
	var _gameOverTitleTexts;
	var _gameOverSubTitleTexts;
	var _gameOverRestart;
	var _player1;
	var _player2;
	var _player3;
	var _player4;
	var _startScreen;

	/*
	 *
	 *  HTML HUD related
	 *
	 */

	var _hud;
	var _hudHi;
	var _hudHiContent;
	var _hudScore;
	var _hudScoreContent;
	var _hudBomb;
	var _hudBombContent;
	var _hudCharge;
	var _hudChargeContent;
	var _hudZone;
	var _hudZoneContent;

	/*
	 *
	 *  Canvas related variables
	 *
	 */

	var _bgCanvas;
	var _bgCanvasCtx;
	var _canvasHeight;
	var _canvasWidth;
	var _collisionCanvas;
	var _collisionCanvasCtx;
	var _collisionPathCanvas;
	var _collisionPathCtx;
	var _collisionColor;
	var _gfxCanvas;
	var _gfxCanvasCtx;
	var _mainCanvas;
	var _mainCanvasCtx;
	var _pathCanvas;
	var _path2Canvas;
	var _path3Canvas;
	var _pathCtx;
	var _path2Ctx;
	var _path3Ctx;
	var _preRenderCanvas;
	var _preRenderCtx;
	var _spriteCanvas;
	var _spriteCanvasCtx;
	var _tempCanvas;
	var _tempCanvasCtx;

	/*
	 *
	 *  GFX related variables
	 *
	 */

	var _cloudColors;
	var _gameFrameWidth;
	var _lineColors;
	var _lineWidth;
	var _spriteImage;

	/*
	 *
	 *  Game flow related variables
	 *
	 */

	var _gameOver;
	var _gamePaused;
	var _gameHold;
	var _hi;
	var _isAlive;
	var _level;
	var _levelComplete;
	var _levelCompleteTime;
	var _quality;
	var _score;
	var _startGame;

	/*
	 *
	 *  Player related variables
	 *
	 */

	var _asteroids;
	var _currentPowerUp;
	var _gemCollected;
	var _gems;
	var _particles;
	var _playerPathAlpha;
	var _playerPathX;
	var _playerPathY;
	var _playerPosition;
	var _playerRotation;
	var _playerRotationBefore;
	var _playerSpeed;
	var _playerSpeedOrg;
	var _playerType;
	var _portalsX;
	var _portalsY;
	var _shipConfigs;

	/*
	 *
	 *  Power-up related
	 *
	 */

	var _mines;
	var _powerUps;
	var _powerUpTypes;
	var _powerUpAmount;
	var _powerUpActive;
	var _powerUpActivated;

	/*
	 *
	 *  Initialize variables
	 *
	 */

	_doc = document;
	_w = window;
	_frame = 0;
	_fps = {
		startTime: -1,
		ellapsedTime: -1,
		measureTime: 2000,
		measureCounter: 0,
		measureScore: -1,
		etalon: 60
	};
	_hudHeight = 24;
	_reqFrame = _w.requestAnimationFrame || _w.mozRequestAnimationFrame || _w.webkitRequestAnimationFrame || _w.msRequestAnimationFrame;
	_sounds = [];
	_soundEnabled = 0;
	_speedCorrection = -1;
	_synth = new sfxrSynth();
	_wrapper = id('w');

	/*----------------------------------------------------*/

	_gameOverScreen = id('l');
	_gameOverTitle = _gameOverScreen.children[0];
	_gameOverSubTitle = _gameOverScreen.children[1];
	_gameOverTitleTexts = ["Do you like fireworks?", "Ka-Boom!", "Your rocket exploded.", "Game Over"];
	_gameOverSubTitleTexts = ["Well, next time try not to cross the line ;)", "Now you've learned that glowing lines are dangerous ;)", "...as it was expected ;)", "Better luck next time ;)"];
	_gameOverRestart = _gameOverScreen.children[2];
	_player1 = id('p1');
	_player2 = id('p2');
	_player3 = id('p3');
	_player4 = id('p4');
	_startScreen = id('s');

	/*----------------------------------------------------*/

	_hud = id('h');
	_hudHi = id('hi');
	_hudHiContent = _hudHi.children[0].children[0];
	_hudScore = id('score');
	_hudScoreContent = _hudScore.children[0].children[0];
	_hudBomb = id('bomb');
	_hudBombContent = _hudBomb.children[0].children[0];
	_hudCharge = id('charge');
	_hudChargeContent = _hudCharge.children[0].children[0];
	_hudZone = id('zone');
	_hudZoneContent = _hudZone.children[0].children[0];

	/*----------------------------------------------------*/

	_mainCanvas = _wrapper.children[0];
	_mainCanvasCtx = _mainCanvas.getContext('2d');
	_bgCanvas = _doc.createElement('canvas');
	_bgCanvasCtx = _bgCanvas.getContext('2d');
	_collisionCanvas = _doc.createElement('canvas');
	_collisionCanvasCtx = _collisionCanvas.getContext('2d');
	_collisionPathCanvas = _doc.createElement('canvas');
	_collisionPathCtx = _collisionPathCanvas.getContext('2d');
	_spriteCanvas = _doc.createElement('canvas');
	_spriteCanvasCtx = _spriteCanvas.getContext('2d');
	_gfxCanvas = _doc.createElement('canvas');
	_gfxCanvasCtx = _gfxCanvas.getContext('2d');
	_pathCanvas = _doc.createElement('canvas');
	_path2Canvas = _doc.createElement('canvas');
	_path3Canvas = _doc.createElement('canvas');
	_pathCtx = _pathCanvas.getContext('2d');
	_path2Ctx = _path2Canvas.getContext('2d');
	_path3Ctx = _path3Canvas.getContext('2d');
	_preRenderCanvas = _doc.createElement('canvas');
	_preRenderCtx = _preRenderCanvas.getContext('2d');

	_tempCanvas = _doc.createElement('canvas');
	_tempCanvasCtx = _tempCanvas.getContext('2d');
	_canvasWidth = _preRenderCanvas.width = _collisionPathCanvas.width = _pathCanvas.width = _path2Canvas.width = _path3Canvas.width = _tempCanvas.width = _bgCanvas.width = _collisionCanvas.width = _gfxCanvas.width = _mainCanvas.width;
	_canvasHeight = _preRenderCanvas.height = _collisionPathCanvas.height = _pathCanvas.height = _path2Canvas.height = _path3Canvas.height = _tempCanvas.height = _bgCanvas.height = _collisionCanvas.height = _gfxCanvas.height = _mainCanvas.height;
	_collisionColor = '#fff';

	/*----------------------------------------------------*/

	_cloudColors = ['#380000', '#3a2000', '#3a3d00', '#003f1e', '#003142', '#000447', '#270049'];
	_gameFrameWidth = 16;
	_lineColors = [];
	_lineWidth = 12;
	_spriteImage = new Image();

	/*----------------------------------------------------*/

	_gameOver = 0;
	_gamePaused = 0;
	_gameHold = 0;
	_hi = 0;
	_isAlive = 0;
	_level = 0;
	_levelComplete = 0;
	_levelCompleteTime = 0;
	_quality = 1;
	_score = 0;
	_startGame = 0;

	/*----------------------------------------------------*/

	_asteroids = [];
	_currentPowerUp = 0;
	_gemCollected = 0;
	_gems = [];
	_particles = [];
	_playerPathAlpha = 1;
	_playerPathX = 0;
	_playerPathY = 0;
	_playerPosition = [];
	_playerRotation = 0;
	_playerRotationBefore = 0;
	_playerSpeed = 3;
	_playerSpeedOrg = 3;
	_playerType = 0;
	_portalsX = [];
	_portalsY = [];
	_shipConfigs = {
		0: {
			colorPos: 42,
			bombRadius: 64,
			chargeTime: 3000
		},
		1: {
			colorPos: 58,
			bombRadius: 32,
			chargeTime: 8000
		},
		2: {
			colorPos: 58,
			bombRadius: 32,
			chargeTime: 5000
		},
		3: {
			colorPos: 74,
			bombRadius: 32,
			chargeTime: 5000
		}
	}

	/*----------------------------------------------------*/

	_mines = [];
	_powerUps = [];
	_powerUpTypes = [];
	_powerUpTypes[0] = 'mine';
	_powerUpTypes[1] = 'charge';
	_powerUpAmount = 0;
	_powerUpActive = 0;
	_powerUpActivated = 0;

	/*----------------------------------------------------*/

	/*
	 *
	 *  Set canvas size, styles
	 *
	 */

	_mainCanvas.style.width = _bgCanvas.style.width =_canvasWidth / _w.devicePixelRatio + 'px';
	_mainCanvas.style.height = _bgCanvas.style.height = _canvasHeight / _w.devicePixelRatio + 'px';
	_collisionCanvasCtx.lineJoin = _collisionPathCtx.lineJoin = _gfxCanvasCtx.lineJoin = 'square';
	_collisionCanvasCtx.lineCap = _collisionPathCtx.lineCap = _gfxCanvasCtx.lineCap = 'square';
	_collisionCanvasCtx.lineWidth = _collisionPathCtx.lineWidth = _lineWidth;
	_collisionCanvasCtx.strokeStyle = _collisionPathCtx.strokeStyle = _collisionColor;

	_mainCanvasCtx.globalCompositeOperation = 'copy';

	_mainCanvas.style.position = _bgCanvas.style.position = 'absolute';
	_mainCanvas.style.zIndex = 2;
	_bgCanvas.style.zIndex = 1;

	_wrapper.insertBefore(_bgCanvas, _mainCanvas);

	/*
	 *
	 *  Rename canvas' built-in methods
	 *
	 */

	for (_canvFunc in _mainCanvasCtx) {
		_mainCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _preRenderCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _pathCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _path2Ctx[_canvFunc[0] + (_canvFunc[6] || '')] = _path3Ctx[_canvFunc[0] + (_canvFunc[6] || '')] = _collisionPathCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _bgCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _gfxCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _spriteCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _tempCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _collisionCanvasCtx[_canvFunc[0] + (_canvFunc[6] || '')] = _mainCanvasCtx[_canvFunc];
	}

	/*
	 *
	 *  Load image-sprite
	 *
	 */

	_spriteImage.onload = function () {
		_spriteCanvas.height = _tempCanvas.height = _spriteImage.width;
		_spriteCanvas.width = _tempCanvas.width = _spriteImage.height;
		_tempCanvasCtx.ta(_spriteImage.height / 2, _spriteImage.width / 2);
		_tempCanvasCtx.rotate(-90 * Math.PI/180)
		_tempCanvasCtx.ta(-_spriteImage.width / 2, -_spriteImage.height / 2);
		_tempCanvasCtx.drawImage(_spriteImage, 0, 0);
		_spriteCanvasCtx.drawImage(_tempCanvas, 0, 0);

		initGame();
	}

	/*
	 *
	 *  Sprite image encoded in base64
	 *
	 */

	_spriteImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABUCAMAAAAF8MFhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhQTFRFAOjXrI5grABCq3sA0poAvqd7QYwe49zIeSooRQAa31I587QACwgAcEn90MGWdQAsImExYbgL/9IA4wBXLRuE////AAAA////VEgVLAAAABh0Uk5T//////////////////////////////8AzRMu6gAABGpJREFUeNqk2Iti2yoMAFDFryTdtXF45f//9EqIlww0XUeXzU2ig4QNxoP3h+a9//ZzeP9jgx9kENs/AenoM2BsP4P02wfAWmOtHSYS/v0OsMYQIAQvlJYA0b0x2lpJyMpbAkT3RmvOwXYGscrIt4CN8TpWkQl/PY/9ElK4dnRQJ2Gtp5/hqQDRPQK6CIGI8XYkQN09xjuuoiThfedarA5BdO8CIJLwvk9kQIYzUBM+vS5EOgAZ3hFyu5yMn06mDiGEz4DxxnhBiCI+AhiPM8xgXCP8EKCRwBSMZaKqwveA19ksEKFRIdZ3cpDAeb7O8xwMooljIQUBnK8XAacsIZ1QE65qIXgBnBSvz1MSRgjeX1MA0f1La87hvAJxLH1TBNTdY7yOVWRCG90IeYEsQArXjg7qJEwt1EUEwDOQu6f1oAiBKDPDpOxzCgko4bweiCQqIAk5BfoDovs4Gesk0uS0UaiAYIAMT7O5ELoWGsB7kOGtkJeHmEIZhAh8voE/1VMZs22obb/aH0Tg7As/32AMhL/YoWxhULcPwG4H4adsw/3BPtgfxMuFzw391d8f7PtuB0IBXuHo7O0PMB6u+4MOEJlmf7BTPHAOQlBUcg3gUGYB6u4xHmIVFaEUjj8C21aAIoDoHsDRQZ2EUsq8+AwmIvyWBBDdIwBFsAwYRzHhUj7LNE3nAuruMd5xFSUJYxwDLyK2EE9TKQkguncBEEkUgAdv43gSwlsgwxmoiWcsgTqkGIrHuaVIoIJAhrfC8xkG8V0DtDJkII21mcyEI969jJXhH27dyaTUpCge2zSZ9g5dt/5sZGB4i6erwZjvnhe4dzUEep0LYOJvTFM3D/xkoTZ/BBhpibgP1S0hgSmMIRLXr2k9z/PSI+ASryKhrsCfBQn9pyEaAC9SImrB2jlVsDSFCEAFwBJRCRg/x+ClLQRo84Rp5wr4zlUEmmsELBS6zN5fCJpMUeARCDOtEvBzWGa90Jf0Ej4VBNBcCsl7fnk/CQE/d7oCrLP/RSEQEOYidk+FYzABhgV8kwBcpPSiZ7qWQwYoJICIOJN7AFaFKdDUpuGTAOXDr7gQ0PxW+DIdAJcFzCCPwRWggXAunRSn89Hlrnm7ffP0TvuTNCkTYa0gHrdbn4B0qbo88dLRvjsBrF0CKDgQjvpPR3xPACeBHoEA7bI4zvCSYvQ73uV3qIADGzKrRIBvmzoDKGAR8S5fFYGRFBuY2ggZJEFHQWmIgs0prDGD+yGJAKAgAZcBdwWO2NZbNYhReNOTNw+D430Cl/+4Pa4ZFAEoLAOO9qQBcGGrwfFflPCxHse9BqIw2OZRfBz+x5fGuNvKCYQ83P1+X6MwAKj7PRAY72jMKIMqPgswemJOF9MXAfhVBu4h/rD+SAKMn1f5COMrgBOg/b4j4FhHwIITlpLY3/QcgKHvOgMCQgb41igDNS8oEIDz7Hg8GoAzONZhBnMSfvffgeEOgMAOvwToFqBQ+DWA6/BisIZqRRi0/wUYAMYNllJQswEKAAAAAElFTkSuQmCC';

	/*
	 *
	 *  Init start screen
	 *
	 */

	function initStart() {
		_player1.touchstart = function() { start(0); }
		_player1.onclick = function() { start(0); }
		_player2.touchstart = function() { start(1); }
		_player2.onclick = function() { start(1); }
		_player3.touchstart = function() { start(2); }
		_player3.onclick = function() { start(2); }
		_player4.touchstart = function() { start(3); }
		_player4.onclick = function() { start(3); }
	}

	function start(p) {
		_playerType = p;
		_startGame = 1;
		createPlayer();
		initLevel();
		_doc.addEventListener('touchmove', function (e) { e.preventDefault(); });
		_w.scrollTo(0, 0);
		_startScreen.style.display = 'none';
	}

	/*
	 *
	 *  Initialize game
	 *
	 */

	function initGame() {
		initStart();
		createSounds();
		createGfxElements();
		checkStorage();
		checkHighScore();
		initWindow();
		initHud();
		initSpeedCorrection();
		render();
		setTimeout(function () { _w.scrollTo(0, 1); }, 1000);
		_doc.addEventListener('keydown', keyHandler, true);
		_doc.addEventListener('touchstart', touchHandler, true);
		_gameOverRestart.onclick = initLevel;
	}

	/*
	 *
	 *  Create sounds
	 *
	 */

	function createSounds() {
		try {
			_soundPlayer = new Audio();
			_sounds['portalopen'] = _synth.getWave('2,0.0526,0.7984,0.1785,0.4242,0.3319,0.0535,0.3163,-0.003,0.0116,0.0551,-0.0747,0.005,0.2972,-0.0393,0.0571,0.043,-0.0287,0.9491,-0.0473,,0.0285,0.0183,0.26');
			_sounds['gemcollect'] = _synth.getWave('0,,0.0612,0.4239,0.4036,0.6456,,,,,,0.432,0.6858,,,,,,1,,,,,0.5');
			_sounds['explosion'] = _synth.getWave('3,,0.1847,0.2125,0.4997,0.0971,,-0.0071,,,,,,,,,0.3468,-0.0407,1,,,,,0.5');
			_sounds['mineexplode'] = _synth.getWave('3,0.0212,0.2132,0.6722,0.4957,0.0725,,0.0933,0.0402,0.0327,,-0.0365,0.0411,,-0.0548,,0.0685,-0.3272,1,0.082,0.06,,0.0186,0.5');
			_sounds['mine'] = _synth.getWave('1,,0.1668,,0.4156,0.2101,,0.1847,,0.1579,0.2293,,,,,,,,1,,,,,0.5');
			_sounds['charge'] = _synth.getWave('1,,0.2328,,0.4261,0.4229,,0.2849,,,,,,,,0.4062,,,1,,,,,0.5');
			_soundEnabled = 1;
		} catch (e) {}
	}

	/*
	 *
	 *  Create GFX elements
	 *
	 */

	function createGfxElements(sprite10, sprite32, sprite64) {

		sprite10 = [10, 10, -10, -10, 10, 10];
		sprite32 = [16, 32, -16, -16, 16, 32];
		sprite64 = [32, 32, -32, -32, 32, 32];

		// Green space-ship
		drawSymetricElement(_gfxCanvasCtx, 16, 16, [_spriteCanvas, 32, 0].concat(sprite32));
		// Yellow fighter space-ship
		drawSymetricElement(_gfxCanvasCtx, 48, 16, [_spriteCanvas, 48, 0].concat(sprite32));
		// Red fighter space-ship
		drawSymetricElement(_gfxCanvasCtx, 80, 16, [_spriteCanvas, 48, 32].concat(sprite32));
		// Fatty space-ship
		drawSymetricElement(_gfxCanvasCtx, 112, 16, [_spriteCanvas, 64, 0].concat(sprite32));
		// Blue-gem
		drawSymetricElement(_gfxCanvasCtx, 16, 48, [_spriteCanvas, 0, 32].concat(sprite32), -1);
		// Green-gem
		drawSymetricElement(_gfxCanvasCtx, 48, 48, [_spriteCanvas, 16, 32].concat(sprite32), -1);
		// Red-gem
		drawSymetricElement(_gfxCanvasCtx, 80, 48, [_spriteCanvas, 32, 32].concat(sprite32), -1);
		// Portal
		drawSymetricElement(_gfxCanvasCtx, 160, 32, [_spriteCanvas, 0, 0].concat(sprite64), -1);
		mirrorPortal(192, 0);
		mirrorPortal(128, 64, -1);
		// Draw mine
		drawMine(_gfxCanvasCtx, 208, 48);
		// Draw charge
		drawCharge(_gfxCanvasCtx, 240, 48);
		// Collision gem
		drawCollisionGem(_gfxCanvasCtx, 112, 32);
		// Deployed mines
		drawSymetricElement(_gfxCanvasCtx, 306, 10, [_spriteCanvas, 64, 32].concat(sprite10), 1, -1);
		drawSymetricElement(_gfxCanvasCtx, 286, 10, [_spriteCanvas, 74, 32].concat(sprite10), 1, -1);
		drawSymetricElement(_gfxCanvasCtx, 266, 10, [_spriteCanvas, 64, 42].concat(sprite10), 1, -1);
		drawSymetricElement(_gfxCanvasCtx, 326, 10, [_spriteCanvas, 64, 52].concat(sprite10), 1, -1);
		flipSymetric(_gfxCanvasCtx, _gfxCanvas, 256, 20, 256, 0, 20, 10);
		flipSymetric(_gfxCanvasCtx, _gfxCanvas, 276, 20, 276, 0, 20, 10);
		flipSymetric(_gfxCanvasCtx, _gfxCanvas, 296, 20, 296, 0, 20, 10);
		flipSymetric(_gfxCanvasCtx, _gfxCanvas, 316, 20, 316, 0, 20, 10);
		// Charged ships
		drawChargedShips();
		// Draw mine active states
		drawActiveMines();
		// Draw pock-rock
		drawAsteroid(1);
		_gfxCanvasCtx.drawImage(_tempCanvas, 0, 0, 64, 64, 0, 272, 64, 64);
		drawAsteroid(2);
		_gfxCanvasCtx.drawImage(_tempCanvas, 0, 0, 64, 64, 64, 272, 64, 64);
		drawAsteroid(1, '#fff');
		_gfxCanvasCtx.drawImage(_tempCanvas, 0, 0, 64, 64, 128, 272, 64, 64);
		drawAsteroid(2, '#fff');
		_gfxCanvasCtx.drawImage(_tempCanvas, 0, 0, 64, 64, 192, 272, 64, 64);

	}

	function mirrorPortal(x, y, a) {
		_gfxCanvasCtx.save();
		_gfxCanvasCtx.ta(x, y);
		_gfxCanvasCtx.rotate((a || 1) * 90 * Math.PI / 180);
		_gfxCanvasCtx.drawImage(_spriteCanvas, 0, 0, 32, 32, 0, 0, 32, 32);
		_gfxCanvasCtx.restore();
	}

	/*
	 *
	 *  Create player
	 *
	 */

	function createPlayer(colorPos, pixelData, i) {
		_playerRotation = _playerRotationBefore = randomInterval(0, 1) == 0 ? 0 : randomInterval(0, 1) == 0 ? 90 : randomInterval(0, 1) == 0 ? 180 : 270;
		_playerPosition = [randomInterval(_gameFrameWidth * 8, _canvasWidth - _gameFrameWidth * 8), randomInterval(_gameFrameWidth * 8, _canvasHeight - _gameFrameWidth * 8 - _hudHeight)];
		for (i = _shipConfigs[_playerType].colorPos; i < _shipConfigs[_playerType].colorPos + 6; i += 2) {
			pixelData = _spriteCanvasCtx.gg(i, _playerType ^ 2 ? 31 : 63, 1, 1).data;
			_lineColors.push('rgb(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ')');
		}
	}

	/*
	 *
	 *  Init window position + resize
	 *
	 */

	function initWindow() {
		if (_w.innerWidth > 960) {
			_wrapper.style.left = (_w.innerWidth - 960) / 2 + 'px';
		}
		if (_w.innerHeight > 600) {
			_wrapper.style.top = (_w.innerHeight - 600) / 2 + 'px';
		}
		_w.onresize = initWindow;
	}

	/*
	 *
	 *  Initialize HTML HUD
	 *
	 */

	function initHud() {
		_hud.style.display = 'block';
		resetHud();
	}

	/*
	 *
	 *  Set speed correction
	 *
	 */

	function initSpeedCorrection() {
		_gamePaused = 1;
		_fps.startTime = Date.now();
		_fps.ellapsedTime = _fps.startTime + _fps.measureTime;
		_fps.measureCounter = 0;
		_fps.measureScore = -1;
	}

	/*
	 *
	 *  Reset level
	 *
	 */

	function initLevel() {
		if (_isAlive ^ 1) {
			_level = 0;
			_score = 0;
			_playerPosition = [randomInterval(_gameFrameWidth * 8, _canvasWidth - _gameFrameWidth * 8), randomInterval(_gameFrameWidth * 8, _canvasHeight - _gameFrameWidth * 8 - _hudHeight)];
		}
		_asteroids = [];
		_frame = 0;
		_gameOver = 0;
		_gamePaused = 0;
		_gameHold = 0;
		_gemCollected = 0;
		_gems = [];
		_isAlive = 1;
		_level++;
		_levelComplete = 0;
		_mines = [];
		_particles = [];
		_playerPathX = [];
		_playerPathY = [];
		_portalsX = [];
		_portalsY = [];
		_powerUps = [];
		if (_playerType != 2) {
			_powerUpAmount = 0;
			_powerUpActive = 0;
			_powerUpActivated = -1;
		}
		_playerPathX[0] = _portalsX[0] = _playerPosition[0];
		_playerPathY[0] = _portalsY[0] = _playerPosition[1];
		_portalsX[1] = _canvasWidth - _portalsX[0];
		_portalsY[1] = randomInterval(_gameFrameWidth + 64, _canvasHeight - 64 - _gameFrameWidth - _hudHeight);

		_tempCanvas.width = _tempCanvas.width;
		_pathCanvas.width = _pathCanvas.width;
		_path2Canvas.width = _path2Canvas.width;
		_path3Canvas.width = _path3Canvas.width;
		_collisionPathCanvas.width = _collisionPathCanvas.width;

		_pathCtx.lineJoin = _path2Ctx.lineJoin = _path3Ctx.lineJoin = 'round';
		_pathCtx.lineCap = _path2Ctx.lineCap = _path3Ctx.lineCap = 'round';
		_collisionPathCtx.strokeStyle = _collisionColor;
		_collisionPathCtx.lineWidth = _lineWidth;
		_collisionPathCtx.lineJoin = 'square';
		_collisionPathCtx.lineCap = 'square';

		addLevelGems();
		addAsteroids();
		checkHighScore();
		drawCollisionFrame();
		generateBg();
		generateParticles();
		_gameOverScreen.style.display = 'none';
		updateHud();
		resetHud();
		setPathStyle();
	}

	/*
	 *
	 *  Create game background
	 *
	 */

	function generateBg(color, differency, i, j, x, y, rx, ry) {
		color = _cloudColors[Math.floor(randomInterval(0, _cloudColors.length - 1))];
		_bgCanvasCtx.fillStyle = '#000';
		_bgCanvasCtx.fc(0, 0, _canvasWidth, _canvasHeight - _hudHeight);
		_bgCanvasCtx.ba();
		for (i = randomInterval(75, 300); i--;) {
			_bgCanvasCtx.fillStyle = 'rgba(255, 255, 255, ' + Math.random() + ')';
			x = randomInterval(_gameFrameWidth * 2, _canvasWidth - _gameFrameWidth * 2);
			y = randomInterval(_gameFrameWidth * 2, _canvasHeight - _gameFrameWidth * 2 - _hudHeight);
			_bgCanvasCtx.fc(x, y, 2, 1);
		}
		_bgCanvasCtx.fill();
		_bgCanvasCtx.fillStyle = color;
		for (i = 8; i--;) {
			x = randomInterval(_gameFrameWidth * 4, _canvasWidth - _gameFrameWidth * 4);
			y = randomInterval(_gameFrameWidth * 4, _canvasHeight - _gameFrameWidth * 4 - _hudHeight);
			_bgCanvasCtx.save();
			for (j = 150; j--;) {
				_bgCanvasCtx.globalAlpha = .1;
				differency = Math.floor(j / 20);
				rx = randomInterval(-2 - differency, 2 + differency) * _gameFrameWidth;
				ry = randomInterval(-2 - differency, 2 + differency) * _gameFrameWidth;
				_bgCanvasCtx.fc(x + rx, y + ry, _gameFrameWidth * 2, _gameFrameWidth * 2);
			}
			_bgCanvasCtx.restore();
		}
		_bgCanvasCtx.strokeStyle = '#000';
		_bgCanvasCtx.lineWidth = _gameFrameWidth * 2;
		drawRoundedRectangle(true, 1, _bgCanvasCtx);
		_bgCanvasCtx.strokeStyle = color;
		_bgCanvasCtx.lineWidth = 11;
		drawRoundedRectangle(false, 0.3, _bgCanvasCtx);
		_bgCanvasCtx.strokeStyle = color;
		_bgCanvasCtx.lineWidth = 6;
		drawRoundedRectangle(false, 0.3, _bgCanvasCtx);
		_bgCanvasCtx.strokeStyle = color;
		_bgCanvasCtx.lineWidth = 2;
		drawRoundedRectangle(false, 1, _bgCanvasCtx);
	}

	/*
	 *
	 *  Add gems to the current level
	 *
	 */

	function addLevelGems(tryLimit) {
		tryLimit = 100;
		while (_gems.length < _level && tryLimit > 0) {
			addGem(true);
			tryLimit--;
		}
	}

	/*
	 *
	 *  Add asteroids
	 *
	 */

	function addAsteroids(num, i) {
		if (_level > 3) {
			num = 1;
			if (_level > 5) { num = 2; }
			if (_level > 10) { num = 3; }
			for (i = 0; i < num; i++) {
				_asteroids.push({
					pos: [randomInterval(_gameFrameWidth * 8, _canvasWidth - _gameFrameWidth * 8), randomInterval(_gameFrameWidth * 8, _canvasHeight - _gameFrameWidth * 8 - _hudHeight)],
					vx: randomInterval(10, 15) / 10 * (Math.round() < .5 ? -1 : 1),
					vy: randomInterval(10, 15) / 10 * (Math.round() < .5 ? -1 : 1),
					type: randomInterval(0, 1)
				});
			}
		}
	}

	/*
	 *
	 *  Add gem
	 *
	 */

	function addGem(levelGem, a, free, pixelData, pos, vx, vy, movetype) {
		pos = [randomInterval(64, _canvasWidth - 64), randomInterval(64, _canvasHeight - 64 - _hudHeight)];
		free = 1;

		pixelData = _collisionCanvasCtx.gg(pos[0], pos[1], 32, 32).data;
		for (a = pixelData.length; a--;) {
			if (pixelData[a] != 0) {
				free = 0;
				break;
			}
		}
		if (free) {
			vx = 0;
			vy = 0;
			movetype = -1;

			if (_level > 4 && _gems.length > randomInterval(0, Math.floor(_level / 4))) {
				vx = randomInterval(-10, 10) / 10 * 2;
				vy = randomInterval(-10, 10) / 10 * 2;
				movetype = 0;
			}

			if (_level > 8 &&  _gems.length > randomInterval(4, Math.floor(_level / 2))) {
				vx = randomInterval(0, 1) * 2 * (randomInterval(0, 1) == 0 ? 1 : -1);
				vy = vx == 0 ? 2 * (randomInterval(0, 1) == 0 ? 1 : -1) : 0;
				movetype = 1;
			}

			if (_level > 12 && _gems.length > randomInterval(6, _level / 2)) {
				vx = randomInterval(-10, 10) / 10 * 2;
				vy = randomInterval(-10, 10) / 10 * 2;
				movetype = 3;
			}

			if (movetype < 0) {
				vx = randomInterval(-10, 10) / 10 * 2;
				vy = randomInterval(-10, 10) / 10 * 2;
			}

			_gems.push({
				pos: pos,
				vx: vx,
				vy: vy,
				movetype: movetype,
				type: levelGem ? 0 : Math.floor(randomInterval(1, 2)),
				state: 1
			});
		}
	}

	/*
	 *
	 *  Add power-up
	 *
	 */

	function addPowerUp(a, free, pixelData, pos) {
		pos = [randomInterval(64, _canvasWidth - 64), randomInterval(64, _canvasHeight - 64 - _hudHeight)];
		free = 1;

		pixelData = _collisionCanvasCtx.gg(pos[0], pos[1], 32, 32).data;
		for (a = pixelData.length; a--;) {
			if (pixelData[a] != 0) {
				free = 0;
				break;
			}
		}
		if (free) {
			_powerUps.push({
				type: randomInterval(0, _powerUpTypes.length - 1),
				state: 1,
				pos: pos
			});
		}
	}

	/*
	 *
	 *  Render
	 *
	 */

	function render(fps) {
		if (_startGame && !_gamePaused && (_isAlive || _gameOver)) {

			clearDisplay();

			if (_levelComplete) {
				_score += 500 + (1000 * (_level / 50));
				initLevel();
			}

			if (_powerUpActive) {
				checkTimedPowerUp();
			}

			if (_gameHold) {
				drawWarp();
				drawPlayer(true);
			} else {
				if (_isAlive) {
					updatePositions();
				}
				drawPortals();
				drawPlayerPath();
				drawPowerUps();
				drawGems();
				drawAsteroids();
				if (_isAlive) {
					drawPlayer();
					checkCollision();
				} else {
					explodePlayer();
				}
			}

			_mainCanvasCtx.drawImage(_preRenderCanvas, 0, 0);
			_frame++;

		} else if (_speedCorrection < 0) {
			testRender();
			if ((fps = measureFps()) ^ 0) {
				if (fps != 1) {
					_speedCorrection = fps > 2 ? 2 : fps;
					_quality = _speedCorrection > 1.8 ? 0 : 1;
					_playerSpeed = (.5 + (_playerSpeedOrg * _speedCorrection)) | 0;
					_gamePaused = 0;
				} else {
					_speedCorrection = 1;
					_playerSpeed = _playerSpeedOrg;
					_gamePaused = 0;
				}
			}
		}
		_reqFrame != undefined ? _reqFrame(render) : _reqId = setTimeout(render, 30);
	}

	/*
	 *
	 *  Draw HUD
	 *
	 */

	function updateHud(pre, i, j) {
		updateHudElement(_hudScoreContent, _score + '', '0');
		updateHudElement(_hudZoneContent, _level + '', '0', 3);
		hideHudElement(_hudBomb);
		hideHudElement(_hudCharge);
		if (_powerUpActive) {
			if (_currentPowerUp < 1) {
				pre = '';
				showHudElement(_hudBomb);
				for (i = 0; i < _powerUpAmount; i++) {
					pre += '+';
				}
				updateHudElement(_hudBombContent, pre, '+', 3, 1);
			}
			if (_currentPowerUp == 1) {
				pre = '||||||||||';
				showHudElement(_hudCharge);
				if (_powerUpActivated > 0) {
					pre = '';
					j = Math.ceil(((_powerUpActivated + _powerUpAmount) - Date.now()) / _powerUpAmount * 10);
					for (i = 0; i < j; i++) {
						pre += '|';
					}
					updateHudElement(_hudChargeContent, pre, '|', 10, 1);
				}
				updateHudElement(_hudChargeContent, pre, '|', 10, 1);
			}
		}
	}

	/*
	 *
	 *  Draw collision frame
	 *
	 */

	function drawCollisionFrame() {
		_collisionCanvasCtx.save();
		_collisionCanvasCtx.strokeStyle = _collisionColor;
		_collisionCanvasCtx.lineWidth = _gameFrameWidth * 2;
		_collisionCanvasCtx.strokeRect(0, 0, _canvasWidth, _canvasHeight - _hudHeight);
		_collisionCanvasCtx.restore();
	}

	/*
	 *
	 *  Draw warp (level-change) effect
	 *
	 */

	function drawWarp() {
		if (Date.now() - _levelCompleteTime < 500) {
			_preRenderCtx.save();
			_preRenderCtx.fillStyle = 'rgb(' + randomInterval(0, 255) + ', ' + randomInterval(0, 255) + ', ' + randomInterval(0, 255) + ')';
			_preRenderCtx.fc(0, 0, _canvasWidth, _canvasHeight);
			_preRenderCtx.restore();
		} else {
			_levelComplete = 1;
		}
	}

	/*
	 *
	 *  Draw portals
	 *
	 */

	function drawPortals(i) {
		for (i = 0; i < 2; i++) {
			_preRenderCtx.save();
			_preRenderCtx.globalAlpha = .3;
			_preRenderCtx.ta(_portalsX[i], _portalsY[i]);
			if (i ^ 1 || _gemCollected >= _level) {
				_preRenderCtx.globalAlpha = 1;
				_preRenderCtx.rotate(_frame * -5 * Math.PI / 180);
			}
			if (_gemCollected >= _level) {
				_collisionCanvasCtx.fillStyle = '#00ff00';
				_collisionCanvasCtx.fc(_portalsX[1] - 20, _portalsY[1] - 20, 40, 40);
			}
			_preRenderCtx.drawImage(_gfxCanvas, 128, 0, 64, 64, -32, -32, 64, 64);
			_preRenderCtx.restore();
		}
	}

	/*
	 *
	 *  Draw player-path
	 *
	 */

	function drawPlayerPath(x, y, pathLength, i) {

		x = _playerRotation == 0 || _playerRotation == 180 ? _playerPosition[0] : _playerRotation == 90 ? _playerPosition[0] - _playerSpeed : _playerPosition[0] + _playerSpeed;
		y = _playerRotation == 90 || _playerRotation == 270 ? _playerPosition[1] : _playerRotation == 0 ? _playerPosition[1] + _playerSpeed : _playerPosition[1] - _playerSpeed;

		pathLength = _playerPathX.length;


		//setPathStyle();

		if (_playerRotationBefore != _playerRotation) {

			_playerPathX.push(x);
			_playerPathY.push(y);
			_playerRotationBefore = _playerRotation;

			pathLength = _playerPathX.length;

			setPathStart();
			pathMoveTo(_playerPathX[pathLength - 2], _playerPathY[pathLength - 2]);
			pathLineTo(_playerPathX[pathLength - 1], _playerPathY[pathLength - 1]);
			pathStroke();

			_collisionPathCtx.ba();
			_collisionPathCtx.m(_playerPathX[pathLength - 2], _playerPathY[pathLength - 2]);
			_collisionPathCtx.l(_playerPathX[pathLength - 1], _playerPathY[pathLength - 1]);
			_collisionPathCtx.stroke();

			drawActivePowerUps(false);

		}

		setPathStart();
		pathMoveTo(_playerPathX[pathLength - 1], _playerPathY[pathLength - 1]);
		pathLineTo(x, y);
		pathStroke();

		_collisionPathCtx.ba();
		_collisionPathCtx.m(_playerPathX[pathLength - 1], _playerPathY[pathLength - 1]);
		_collisionPathCtx.l(x, y);
		_collisionPathCtx.stroke();

		if (_quality) {
			_pathCtx.drawImage(_path2Canvas, 0, 0);
			_pathCtx.drawImage(_path3Canvas, 0, 0);
		}

		drawActivePowerUps(true);

		_preRenderCtx.drawImage(_pathCanvas, 0, 0);

		if (_currentPowerUp != 1 || !_powerUpActive || _powerUpActivated < 0) {
			_collisionCanvasCtx.drawImage(_collisionPathCanvas, 0, 0);
		}

	}

	/*
	 *
	 *  Draw gems
	 *
	 */

	function drawGems(i, gem, cx1, cx2, cy1, cy2) {
		if (_frame % 80 == 0 && randomInterval(10, 100) < 40) { addGem(); }

		for (i = _gems.length; i--;) {
			gem = _gems[i];
			_collisionCanvasCtx.save();
			_collisionCanvasCtx.ta(gem.pos[0] - 16, gem.pos[1] - 16);
			_collisionCanvasCtx.drawImage(_gfxCanvas, 96, 32, 32, 32, 0, 0, 32, 32);
			_collisionCanvasCtx.restore();

			if (gem.state == 0) {
				_gems.splice(i, 1);
				if (gem.type == 0) {
					_gemCollected++;
				}
				_score += (gem.type + 1) * 100;
				updateHud();
				if (_gemCollected == _level) {
					playSound(_sounds['portalopen'], 500);
				}
			} else {
				if (_frame % 2 == 0) {

					if (_level > 3 && _frame % 40 == 0 && randomInterval(0, 1) == 0 && gem.movetype == 1) {
						gem.vx = gem.vx == 0 ? 2 * (randomInterval(0, 1) == 0 ? 1 : -1) : 0;
						gem.vy = gem.vy == 0 ? 2 * (randomInterval(0, 1) == 0 ? 1 : -1) : 0;
					}

					if (gem.movetype == 3 && _frame % 100 == 0) {
						gem.pos[0] = randomInterval(0, 1) == 0 ? _canvasHeight - gem.pos[0] : gem.pos[0];
						gem.pos[1] = randomInterval(0, 1) == 0 ? _canvasHeight - gem.pos[1] : gem.pos[1];
					}

					gem.pos[0] = (.5 + (gem.pos[0] + gem.vx * _speedCorrection)) | 0;
					gem.pos[1] = (.5 + (gem.pos[1] + gem.vy * _speedCorrection)) | 0;

					cx1 = gem.pos[0] < _gameFrameWidth / 2 + 16;
					cx2 = gem.pos[0] > _canvasWidth - _gameFrameWidth / 2 - 32;

					if (cx1 || cx2) {
						gem.pos[0] = cx1 ? _gameFrameWidth / 2 + 16 : _canvasWidth - _gameFrameWidth / 2 - 32;
						gem.vx *= -1;
					}

					cy1 = gem.pos[1] < _gameFrameWidth + 16;
					cy2 = gem.pos[1] > _canvasHeight - _gameFrameWidth - _hudHeight - 16;

					if (cy1 || cy2) {
						gem.pos[1] = cy1 ? _gameFrameWidth + 16 : _canvasHeight - _gameFrameWidth - _hudHeight - 16;
						gem.vy *= -1;
					}

				}
				_preRenderCtx.drawImage(_gfxCanvas, gem.type * 32, 32, 32, 32, gem.pos[0] - 16, gem.pos[1] - 16, 32, 32);
			}
		}
	}

	/*
	 *
	 *  Draw asteroids
	 *
	 */

	function drawAsteroids(asteroid, i, cx1, cx2, cy1, cy2) {
		for (i = _asteroids.length; i--;) {
			asteroid = _asteroids[i];
			_collisionCanvasCtx.save();
			_collisionCanvasCtx.ta(asteroid.pos[0] - 32, asteroid.pos[1] - 32);
			_collisionCanvasCtx.drawImage(_gfxCanvas, 128 + 64 * asteroid.type, 272, 64, 64, 0, 0, 64, 64);
			_collisionCanvasCtx.restore();

			asteroid.pos[0] = (.5 + (asteroid.pos[0] + asteroid.vx * _speedCorrection)) | 0;
			asteroid.pos[1] = (.5 + (asteroid.pos[1] + asteroid.vy * _speedCorrection)) | 0;

			cx1 = asteroid.pos[0] < _gameFrameWidth / 2 + 32;
			cx2 = asteroid.pos[0] > _canvasWidth - _gameFrameWidth / 2 - 64;

			if (cx1 || cx2) {
				asteroid.pos[0] = cx1 ? _gameFrameWidth / 2 + 32 : _canvasWidth - _gameFrameWidth / 2 - 64;
				asteroid.vx *= -1;
			}

			cy1 = asteroid.pos[1] < _gameFrameWidth + 32;
			cy2 = asteroid.pos[1] > _canvasHeight - _gameFrameWidth - _hudHeight - 32;

			if (cy1 || cy2) {
				asteroid.pos[1] = cy1 ? _gameFrameWidth + 32 : _canvasHeight - _gameFrameWidth - _hudHeight - 32;
				asteroid.vy *= -1;
			}
			_preRenderCtx.drawImage(_gfxCanvas, 64 * asteroid.type, 272, 64, 64, asteroid.pos[0] - 32, asteroid.pos[1] - 32, 64, 64);
		}

	}

	/*
	 *
	 *  Draw power-ups
	 *
	 */

	function drawPowerUps(i) {
		if (_frame % 60 == 0 && (randomInterval(0, 100)) < 35) {
			addPowerUp();
		}

		_collisionCanvasCtx.fillStyle = '#f00';

		for (i = _powerUps.length; i--;) {

			_collisionCanvasCtx.ba();
			_collisionCanvasCtx.a(_powerUps[i].pos[0], _powerUps[i].pos[1], 16, 0, Math.PI * 2);
			_collisionCanvasCtx.ca();
			_collisionCanvasCtx.fill();

			if (_powerUps[i].state == 0) {
				setPowerUp(_powerUps[i].type);
				_powerUps.splice(i, 1);
			} else {
				drawPowerUpType(_powerUps[i].type, _powerUps[i].pos[0], _powerUps[i].pos[1]);
			}
		}

	}

	/*
	 *
	 *  Draw player
	 *
	 */

	function drawPlayer(rotate) {
		_preRenderCtx.save();
		_preRenderCtx.ta(_playerPosition[0], _playerPosition[1]);
		_preRenderCtx.rotate(rotate == true ? _frame * -15 * Math.PI / 180 : _playerRotation * Math.PI / 180);
		if (_powerUpActive && _currentPowerUp == 1 && _powerUpActivated > 0) {
			_preRenderCtx.drawImage(_gfxCanvas, _frame % 18 * 32, 64 + _playerType * 32, 32, 32, -16, -12, 32, 32);
		} else {
			_preRenderCtx.drawImage(_gfxCanvas, _playerType * 32, 0, 32, 32, -16, -12, 32, 32);
		}
		_preRenderCtx.restore();

		if (_powerUpActive && _currentPowerUp == 1 && _powerUpActivated > 0) {
			_preRenderCtx.save();
			_preRenderCtx.ta(_playerPosition[0], _playerPosition[1]);
			_preRenderCtx.fillStyle = '#fff';
			_preRenderCtx.fillRect(24, -24, 64, 6);
			_preRenderCtx.fillStyle = '#4096ee';
			_preRenderCtx.fillRect(25, -23, 62 * ((_powerUpActivated + _powerUpAmount) - Date.now()) / _powerUpAmount, 4);
			_preRenderCtx.restore();
		}


	}

	/*
	 *
	 *  Draw active power-ups
	 *
	 */

	function drawActivePowerUps(onlylast, mine, i, ellapsed) {
		for (i = 0; i < _mines.length; i++) {
			mine = _mines[i];
			if (mine.pathIndex < _playerPathX.length && mine.active) {
				_collisionPathCtx.save();
				_collisionPathCtx.ba();
				if (onlylast == false && mine.pathIndex < _playerPathX.length - 2) {
					if (mine.time + 2000 < Date.now()) {
						explodeMine(mine, _shipConfigs[_playerType].bombRadius, i ,1);
					} else {
						drawActiveMine(mine.pos[0] - 10, mine.pos[1] - 10);
					}
				} else if (onlylast == true && mine.pathIndex > _playerPathX.length - 3 || mine.active) {
					if (mine.time + 2000 < Date.now() && mine.active) {
						explodeMine(mine, _shipConfigs[_playerType].bombRadius, i);
					} else {
						drawActiveMine(mine.pos[0] - 10, mine.pos[1] - 10);
					}
				}
				_collisionPathCtx.ca();
				_collisionPathCtx.fill();
				_collisionPathCtx.restore();
			}
		}
	}

	/*
	 *
	 *  Draw active mine state
	 *
	 */

	function drawActiveMine(x, y) {
		_pathCtx.drawImage(_gfxCanvas, _frame % 10 * 20, 192 + _playerType * 20, 20, 20, x, y, 20, 20);
	}

	/*
	 *
	 *  Draw mine explosion
	 *
	 */

	function explodeMine(mine, blastRad, i, del, ellapsed) {
		pathSave();
		setPathStart();
		pathEraseArc(mine.pos[0], mine.pos[1], blastRad);
		pathClosePath();
		pathFill();
		pathRestore();
		_collisionPathCtx.fillStyle = '#000';
		_collisionPathCtx.a(mine.pos[0], mine.pos[1], blastRad, 0, Math.PI * 2);
		if (mine.sound) {
			playSound(_sounds['mineexplode']);
			mine.sound = 0;
		}
		if (mine.time + 3000 < Date.now()) {
			if (del) {
				mine.active = 0;
				_mines.splice(i, 1);
			}
		} else {
			ellapsed = Date.now() - mine.time;
			if (ellapsed / 2500 < 1) {
				_preRenderCtx.save();
				_preRenderCtx.fillStyle = '#fff';
				_preRenderCtx.globalAlpha = 1 - (ellapsed / 2500);
				_preRenderCtx.ba();
				_preRenderCtx.a(mine.pos[0], mine.pos[1], _shipConfigs[_playerType].bombRadius * .5 * (1 + (ellapsed / 2500)), 0, Math.PI * 2, true);
				_preRenderCtx.ca();
				_preRenderCtx.f();
				_preRenderCtx.restore();
			}
		}
	}

	/*
	 *
	 *  Update player position
	 *
	 */

	function updatePositions() {
		_playerPosition[0] += _playerRotation == 0 || _playerRotation == 180 ? 0 : _playerRotation == 90 ? _playerSpeed : -_playerSpeed;
		_playerPosition[1] += _playerRotation == 90 || _playerRotation == 270 ? 0 : _playerRotation == 0 ? -_playerSpeed : _playerSpeed;
	}

	/*
	 *
	 *  Check collisions
	 *
	 */

	function checkCollision(i, rawData, pixelData, pixelIndex, nx, ny, count, diff, wx, wy, row, column) {

		nx = _playerRotation == 0 || _playerRotation == 180 ? _playerPosition[0] - _lineWidth / 2 : _playerRotation == 90 ? _playerPosition[0] - (_playerSpeed - _lineWidth / 2) : _playerPosition[0] - _playerSpeed - (_lineWidth / 2 - _playerSpeed);
		ny = _playerRotation == 90 || _playerRotation == 270 ? _playerPosition[1] - _lineWidth / 2 : _playerRotation == 0 ? _playerPosition[1] - _playerSpeed - (_lineWidth / 2 - _playerSpeed) : _playerPosition[1] - (_playerSpeed - _lineWidth / 2);
		wx = _playerRotation == 0 || _playerRotation == 180 ? _lineWidth : _playerSpeed;
		wy = _playerRotation == 0 || _playerRotation == 180 ? _playerSpeed : _lineWidth;

		rawData = _collisionCanvasCtx.gg(nx, ny, wx, wy);
		pixelData = rawData.data;
		count = diff = 0;

		for (i = pixelData.length; i--;) {
			if (checkCollisionByColor(pixelData, i, 255, 255, 0)) {
				collectItem(nx, ny, wx, wy, _gems, 'gemcollect');
				break;
			} else if (checkCollisionByColor(pixelData, i, 255, 0, 0)) {
				collectItem(nx, ny, wx, wy, _powerUps, 0);
				break;
			}
		}

		if (_playerRotation == 0) {
			for (pixelIndex = 0; pixelIndex < pixelData.length; pixelIndex = pixelIndex + 4) {
				if (checkCollisionByColor(pixelData, pixelIndex, 255, 255, 255)) {
					_isAlive = 0;
					for (pixelIndex = 0; pixelIndex < pixelData.length; pixelIndex = pixelIndex + 4) {
						if (pixelData[pixelIndex] != 255 || pixelData[pixelIndex + 1] != 255 || pixelData[pixelIndex + 2] != 255) {
							count++;
						}
					}
					diff = Math.floor(count / _lineWidth);
					_playerPosition[1] = _playerPosition[1] - diff;
					break;
				} else if (checkCollisionByColor(pixelData, pixelIndex, 0, 255, 0)) {
					changeLevel();
					break;
				}
			}
		} else if (_playerRotation == 90) {

			for (column = 0; column < _playerSpeed; column++) {
				for (row = 0; row < _lineWidth; row++) {
					pixelIndex = ((_playerSpeed - column) * 4) + (row * _playerSpeed * 4) - 4;
					if (checkCollisionByColor(pixelData, pixelIndex, 255, 255, 255)) {
						_isAlive = 0;
						break;
					} else if (checkCollisionByColor(pixelData, pixelIndex, 0, 255, 0)) {
						changeLevel();
						break;
					}
				}
				if (!_isAlive) {
					for (++column; column < _playerSpeed; column++) {
						for (row = 0; row < _lineWidth; row++) {
							pixelIndex = ((_playerSpeed - column) * 4) + (row * _playerSpeed * 4) - 4;
							if (pixelData[pixelIndex] != 255 || pixelData[pixelIndex + 1] != 255 || pixelData[pixelIndex + 2] != 255) {
								count++;
							}
						}
					}
					diff = Math.floor(count / _lineWidth);
					_playerPosition[0] = _playerPosition[0] + diff;
					break;
				}
			}
		} else if (_playerRotation == 180) {
			for (pixelIndex = pixelData.length - 4; pixelIndex = pixelIndex - 4;) {
				if (checkCollisionByColor(pixelData, pixelIndex, 255, 255, 255)) {
					_isAlive = 0;
					if (!_isAlive) {
						for (pixelIndex = pixelData.length; pixelIndex = pixelIndex - 4;) {
							if (pixelData[pixelIndex] != 255 || pixelData[pixelIndex + 1] != 255 || pixelData[pixelIndex + 2] != 255) {
								count++;
							}
						}
					}
					break;
				} else if (checkCollisionByColor(pixelData, pixelIndex, 0, 255, 0)) {
					changeLevel();
					break;
				}
			}
			diff = Math.ceil(count / _lineWidth);
			_playerPosition[1] = _playerPosition[1] + diff;
		} else if (_playerRotation == 270) {
			for (column = 0; column < _playerSpeed; column++) {
				for (row = 0; row < _lineWidth; row++) {
					pixelIndex = (column * 4) + (row * _playerSpeed * 4);
					if (checkCollisionByColor(pixelData, pixelIndex, 255, 255, 255)) {
						_isAlive = 0;
						break;
					} else if (checkCollisionByColor(pixelData, pixelIndex, 0, 255, 0)) {
						changeLevel();
						break;
					}
				}
				if (!_isAlive) {
					for (++column; column < _playerSpeed; column++) {
						for (row = 0; row < _lineWidth; row++) {
							pixelIndex = (column * 4) + (row * _playerSpeed * 4);
							if (pixelData[pixelIndex] != 255 || pixelData[pixelIndex + 1] != 255 || pixelData[pixelIndex + 2] != 255) {
								count++;
							}
						}
					}
					diff = Math.floor(count / _lineWidth);
					_playerPosition[0] = _playerPosition[0] - diff;
					break;
				}
			}
		}

		if (_isAlive ^ 1) {
			playSound(_sounds['explosion']);
			_levelCompleteTime = Date.now();
			_gameOver = 1;
			showGameOver();
		}
	}

	/*
	 *
	 *  Check collision by color
	 *
	 */

	function checkCollisionByColor(pixelData, pixelIndex, r, g, b) {
		return pixelData[pixelIndex] == r && pixelData[pixelIndex + 1] == g && pixelData[pixelIndex + 2] == b;
	}

	/*
	 *
	 *  Collect item
	 *
	 */

	function collectItem(x, y, wx, wy, itemArr, soundfx, i) {
		for (i = 0; i < itemArr.length; i++) {
			var px = itemArr[i].pos[0],
				py = itemArr[i].pos[1],
				r1, r2;
			r1 = {};
			r2 = {};
			r1.left = x;
			r1.right = x + wx;
			r1.top = y;
			r1.bottom = y + wy;
			r2.left = px - 16;
			r2.right = px + 16;
			r2.top = py - 16;
			r2.bottom = py + 16;
			if (intersectRect(r1, r2)) {
				itemArr[i].state = 0;
				if (soundfx) {
					playSound(_sounds[soundfx]);
				}
			}
		}
	}

	/*
	 *
	 *  Set power up properties
	 *
	 */

	function setPowerUp(type) {
		_currentPowerUp = type;
		_powerUpActive = 1;
		_powerUpActivated = -1;
		switch (_powerUpTypes[type]) {
			case 'mine':
				_powerUpAmount = 3;
				break;
			case 'charge':
				_powerUpAmount = _shipConfigs[_playerType].chargeTime;
				break;
			default:
				break;
		}
		playSound(_sounds[_powerUpTypes[type]]);
		updateHud();
	}

	/*
	 *
	 *  Power up action
	 *
	 */

	function powerUpAction() {
		switch (_powerUpTypes[_currentPowerUp]) {
			case 'mine':
				addMine();
				_powerUpAmount--;
				break;
			case 'charge':
				if (_powerUpActivated < 0) {
					_powerUpActivated = Date.now();
				}
				break;
			default:
				break;
		}
		if (_powerUpAmount < 1) {
			_powerUpActive = 0;
		}
		updateHud();
	}

	/*
	 *
	 *  Add mine (deploy)
	 *
	 */

	function addMine(mine) {
		_mines.push({
			pos: [_playerPosition[0], _playerPosition[1]],
			time: Date.now(),
			pathIndex: _playerPathX.length - 1,
			active: 1,
			sound: 1
		})
	}

	/*
	 *
	 *  Check timed power-up
	 *
	 */

	function checkTimedPowerUp() {
		if (_powerUpActive ^ 0 && _powerUpActivated > 0) {
			if (_powerUpActivated + _powerUpAmount < Date.now() && _powerUpTypes[_currentPowerUp] == 'charge') {
				_powerUpActive = 0;
			}
			updateHud();
		}
	}

	/*
	 *
	 *  Show game over screen & set highscore
	 *
	 */

	function showGameOver() {
		if (_score > _hi && _storage) {
			_storage.setItem('hi', _score);
		}
	}

	/*----------------------------------------------------*/

	/*
	 *
	 *  Event handling
	 *
	 */

	function keyHandler(e, code) {
		code = e.keyCode;
		if (code == 32) {
			e.preventDefault();
			if (_isAlive && _powerUpActive ^ 0) {
				powerUpAction();
			}
		}

		if (_isAlive && !_gameHold && !_gamePaused) {
			_playerRotation = code ^ 37 && code ^ 39 ? _playerRotation : code == 37 ? _playerRotation == 0 ? 270 : _playerRotation - 90 : _playerRotation == 270 ? 0 : _playerRotation + 90;
		}

		if (code == 80) {
			_gamePaused = !_gamePaused;
		}
	}

	function touchHandler(e) {
		var touch = e.changedTouches[0];
		if (_isAlive) {
			if (touch.clientX < (_canvasWidth / 2 - 200) / _w.devicePixelRatio) {
				_playerRotation = _playerRotation == 0 ? 270 : _playerRotation - 90;
			} else if (touch.clientX > (_canvasWidth / 2 + 200) / _w.devicePixelRatio) {
				_playerRotation = _playerRotation == 270 ? 0 : _playerRotation + 90;
			} else {
				if (_powerUpActive ^ 0) {
					powerUpAction();
				}
			}
		}
	}

	/*----------------------------------------------------*/

	/*
	 *
	 *  Utilities
	 *
	 */

	function setPathStyle() {
		_pathCtx.lineWidth = _lineWidth;
		_pathCtx.strokeStyle = _lineColors[0];
		if (_quality) {
			_path2Ctx.lineWidth = _lineWidth - 4;
			_path2Ctx.strokeStyle = _lineColors[1];
			_path3Ctx.lineWidth = _lineWidth - 8;
			_path3Ctx.strokeStyle = _lineColors[2];
		}
	}

	function setPathStart() {
		_pathCtx.ba();
		if (_quality) {
			_path2Ctx.ba();
			_path3Ctx.ba();
		}
	}

	function pathMoveTo(x, y) {
		_pathCtx.m(x, y);
		if (_quality) {
			_path2Ctx.m(x, y);
			_path3Ctx.m(x, y);
		}
	}

	function pathLineTo(x, y) {
		_pathCtx.l(x, y);
		if (_quality) {
			_path2Ctx.l(x, y);
			_path3Ctx.l(x, y);
		}
	}

	function pathStroke() {
		_pathCtx.stroke();
		if (_quality) {
			_path2Ctx.stroke();
			_path3Ctx.stroke();
		}
	}

	function pathClosePath() {
		_pathCtx.ca();
		if (_quality) {
			_path2Ctx.ca();
			_path3Ctx.ca();
		}
	}

	function pathSave() {
		_pathCtx.save();
		if (_quality) {
			_path2Ctx.save();
			_path3Ctx.save();
		}
	}

	function pathRestore() {
		_pathCtx.restore();
		if (_quality) {
			_path2Ctx.restore();
			_path3Ctx.restore();
		}
	}

	function pathFill() {
		_pathCtx.fill();
		if (_quality) {
			_path2Ctx.fill();
			_path3Ctx.fill();
		}
	}

	function pathEraseArc(x, y, radius) {
		_pathCtx.globalCompositeOperation = _path2Ctx.globalCompositeOperation =  _path3Ctx.globalCompositeOperation = 'destination-out';
		_pathCtx.fillStyle = _path2Ctx.fillStyle = _path3Ctx.fillStyle = '#000';
		_pathCtx.a(x, y, radius, 0, Math.PI * 2);
		if (_quality) {
			_path2Ctx.a(x, y, radius, 0, Math.PI * 2);
			_path3Ctx.a(x, y, radius, 0, Math.PI * 2);
		}
	}

	function drawPowerUpBase(ctx, x, y, fill) {
		ctx.ba();
		ctx.fillStyle = fill || '#e30057';
		ctx.a(x, y, 16, 0, Math.PI * 2, true);
		ctx.ca();
		ctx.fill();

		ctx.ba();
		ctx.fillStyle = '#000';
		ctx.a(x, y, 13, 0, Math.PI * 2, true);
		ctx.ca();
		ctx.fill();
	}

	function drawMine(ctx, x, y) {
		drawPowerUpBase(ctx, x, y);

		ctx.ba();
		ctx.fillStyle = '#e30057';
		ctx.a(x, y, 9, 0, Math.PI * 2, true);
		ctx.ca();
		ctx.fill();

		ctx.fillStyle = '#000';

		ctx.ba();
		ctx.a(x, y, 6, 0, Math.PI * 2, true);
		ctx.ca();
		ctx.fill();

		ctx.fillRect(x - 3, y - 13, 6, 26);
		ctx.fillRect(x - 13, y - 3, 26, 6);

		ctx.ba();
		ctx.fillStyle = '#e30057';
		ctx.a(x, y, 3, 0, Math.PI * 2, true);
		ctx.ca();
		ctx.fill();
	}

	function drawCharge(ctx, x, y) {
		drawPowerUpBase(ctx, x, y, '#00fbfb');

		ctx.fillStyle = '#00fbfb';

		ctx.ba();
		ctx.moveTo(x - 1, y + 1);
		ctx.l(x - 6, y + 1);
		ctx.l(x + 3, y - 9);
		ctx.ca();
		ctx.fill();

		ctx.ba();
		ctx.moveTo(x + 1, y - 1);
		ctx.l(x + 6, y - 1);
		ctx.l(x - 3, y + 9);
		ctx.ca();
		ctx.fill();

	}

	function drawSymetricElement(ctx, tx, ty, args, flip) {
		ctx.save();
		ctx.ta(tx, ty);
		ctx.drawImage.apply(ctx, args);
		ctx.scale(-1, flip || 1);
		ctx.drawImage.apply(ctx, args);
		ctx.restore();
	}

	function flipSymetric(ctx, source, x, y, sx, sy, w, h, flip) {
		ctx.save();
		ctx.ta(x, y);
		ctx.scale(1, -1);
		ctx.drawImage(source, sx, sy, w, h, 0, 0, w, h);
		ctx.restore();
	}

	function drawRoundedRectangle(isOuter, alpha, ctx, x, y, delta) {
		x = y = isOuter ? 0 : 8.5;
		delta = isOuter ? 0 : _gameFrameWidth;
		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.ba();
		ctx.m(x + _gameFrameWidth * 2, y);
		ctx.arcTo(x + _canvasWidth - delta, y, x + _canvasWidth - delta, y + _gameFrameWidth * 2, _gameFrameWidth * 2);
		ctx.m(_canvasWidth - delta / 2 + .5, y + 2 * _gameFrameWidth);
		ctx.arcTo(x + _canvasWidth - delta, y + _canvasHeight - delta - (isOuter ? _gameFrameWidth : _hudHeight), x + _canvasWidth - delta - _gameFrameWidth * 2, y + _canvasHeight - delta - (isOuter ? _gameFrameWidth : _hudHeight), _gameFrameWidth * 2);
		ctx.m(_canvasWidth - 2 * _gameFrameWidth - _gameFrameWidth / 2, _canvasHeight - delta / 2 + .5 - (isOuter ? _gameFrameWidth : _hudHeight));
		ctx.arcTo(x, y + _canvasHeight - delta - (isOuter ? _gameFrameWidth : _hudHeight), x, y + _canvasHeight - delta - _gameFrameWidth * 2, _gameFrameWidth * 2);
		ctx.m(x, _canvasHeight - 2 * _gameFrameWidth - _gameFrameWidth / 2 - (isOuter ? _gameFrameWidth : _hudHeight));
		ctx.arcTo(x, y, x + _gameFrameWidth * 2, y, _gameFrameWidth * 2);
		ctx.stroke();
		ctx.restore();
	}

	function drawCollisionGem(ctx, x, y) {
		ctx.save();
		ctx.fillStyle = '#ffff00';
		ctx.ta(x, y);
		ctx.scale(.75, 1);
		ctx.rotate(45 * Math.PI / 180);
		ctx.fc(0, 0, 23, 23);
		ctx.restore();
	}

	function drawChargedShips(grad, i, j) {
		_tempCanvas.width = _tempCanvas.width;
		for (j = 0; j < 4; j++) {
			for (i = 0; i < 9; i += .5) {
				_tempCanvasCtx.drawImage(_gfxCanvas, j * 32, 0, 32, 32, 0, 0, 32, 32);
				_tempCanvasCtx.save();
				grad = _tempCanvasCtx.createLinearGradient(0, 0, 0, 32);
				grad.addColorStop(0, 'rgba(78,169,244,.3)');
				grad.addColorStop(i * 0.1, 'rgba(171,211,238,.9)');
				grad.addColorStop((i * 0.1 + 0.01), 'rgba(137,195,235,.9)');
				grad.addColorStop(.9, 'rgba(54,168,249,.5)');
				grad.addColorStop(1, 'rgba(54,168,249,0)');
				_tempCanvasCtx.globalCompositeOperation = 'source-atop';
				_tempCanvasCtx.fillStyle = grad;
				_tempCanvasCtx.fillRect(0, 0, 32, 32);
				_tempCanvasCtx.restore();
				_gfxCanvasCtx.drawImage(_tempCanvas, 0, 0, 32, 32, ((i * 2) * 32), 64 + (j * 32), 32, 32);
				_tempCanvas.width =	_tempCanvas.width;
			}
		}
	}

	function drawAsteroid(type, collapse) {
		_tempCanvasCtx.save();
		_tempCanvasCtx.clearRect(0, 0, _canvasWidth, _canvasHeight);

		if (type == 1) {

			_tempCanvasCtx.fillStyle = collapse || '#c96c3d';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(32, 0);
			_tempCanvasCtx.l(47, 0);
			_tempCanvasCtx.l(0, 47);
			_tempCanvasCtx.l(0, 32);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();

			_tempCanvasCtx.fillStyle = collapse || '#ad4635';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(46, 0);
			_tempCanvasCtx.l(56, 64);
			_tempCanvasCtx.l(39, 64);
			_tempCanvasCtx.l(0, 46);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();

			_tempCanvasCtx.fillStyle = collapse || '#572a2e';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(46, 0);
			_tempCanvasCtx.l(64, 48);
			_tempCanvasCtx.l(64, 57);
			_tempCanvasCtx.l(56, 64);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();
		} else {
			_tempCanvasCtx.fillStyle = collapse || '#c96c3d';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(35, 0);
			_tempCanvasCtx.l(0, 48);
			_tempCanvasCtx.l(0, 32);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();

			_tempCanvasCtx.fillStyle = collapse || '#ad4635';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(35, 0);
			_tempCanvasCtx.l(64, 12);
			_tempCanvasCtx.l(0, 48);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();

			_tempCanvasCtx.fillStyle = collapse || '#572a2e';
			_tempCanvasCtx.ba();
			_tempCanvasCtx.m(64, 12);
			_tempCanvasCtx.l(48, 64);
			_tempCanvasCtx.l(24, 64);
			_tempCanvasCtx.l(0, 48);
			_tempCanvasCtx.ca();
			_tempCanvasCtx.fill();
		}

		_tempCanvasCtx.restore();
	}

	function drawActiveMines(i, j) {
		_gfxCanvasCtx.save();
		_gfxCanvasCtx.fillStyle = '#e30057';
		_gfxCanvasCtx.ta(0, 192);
		for (j = 0; j < 4; j++) {
			for (i = 0; i < 10; i++) {
				_gfxCanvasCtx.drawImage(_gfxCanvas, 256 + j * 20, 0, 20, 20, i * 20, j * 20, 20, 20);
				_gfxCanvasCtx.save();
				_gfxCanvasCtx.globalAlpha = i * .1;
				_gfxCanvasCtx.ba();
				_gfxCanvasCtx.a(i * 20 + 10, j * 20 + 10, 3, 0, Math.PI * 2);
				_gfxCanvasCtx.f();
				_gfxCanvasCtx.restore();
			}
		}
		_gfxCanvasCtx.restore();
	}

	function drawPowerUpType(type, x, y) {
		_preRenderCtx.save();
		_preRenderCtx.ta(x, y);
		switch (_powerUpTypes[type]) {
			case 'mine':
				_preRenderCtx.drawImage(_gfxCanvas, 192, 32, 32, 32, -16, -16, 32, 32);
				break;
			case 'charge':
				_preRenderCtx.drawImage(_gfxCanvas, 224, 32, 32, 32, -16, -16, 32, 32);
				break;
			default:
				break;
		}
		_preRenderCtx.restore();
	}

	function updateHudElement(elm, val, preVal, max, reverse, pre, i) {
		pre = '';
		for (i = 0; i < (max || 8) - val.length; i++) {
			pre += preVal;
		}
		elm.innerHTML = reverse ? '<i>' + val + '</i>' + pre : pre + '<i>' + val + '</i>';
	}

	function showHudElement(elm) {
		elm.style.visibility = 'visible';
	}

	function hideHudElement(elm) {
		elm.style.visibility = 'hidden';
	}

	function resetHud() {
		if (_powerUpActive ^ 1) {
			hideHudElement(_hudBomb);
			hideHudElement(_hudCharge);
		}
		updateHudElement(_hudScoreContent, '0', '0');
		updateHudElement(_hudZoneContent, '1', '0', 3);
		updateHudElement(_hudHiContent, _hi + '', 0, 8);
	}

	function showGameOverScreen(i) {
		i = randomInterval(0, 3);
		_gameOverTitle.innerHTML = _gameOverTitleTexts[i];
		_gameOverSubTitle.innerHTML = _gameOverSubTitleTexts[i];
		_gameOverScreen.style.display = 'block';
	}

	function clearDisplay() {
		_preRenderCtx.clearRect(0, 0, _canvasWidth, _canvasHeight);
		_collisionCanvasCtx.clearRect(_gameFrameWidth, _gameFrameWidth, _canvasWidth - 2 * _gameFrameWidth, _canvasHeight - _hudHeight - 2 * _gameFrameWidth);
	}

	function changeLevel() {
		_levelCompleteTime = Date.now();
		_gameHold = 1;
		_playerPosition[0] = _portalsX[1];
		_playerPosition[1] = _portalsY[1];
	}

	function generateParticles(particle, i, raw) {
		for (i = 60; i--;) {
			particle = {};
			particle.x = 0;
			particle.y = 0;
			particle.a = 1;
			particle.c = 0;
			particle.d = randomInterval(2, 8);
			particle.vx = randomInterval(-10, 10) * 2;
			particle.vy = randomInterval(-10, 10) * 2;
			particle.r = randomInterval(220, 255);
			particle.g = randomInterval(190, 255);
			particle.b = 0;
			if (i % 7 == 0) {
				particle.d = 8;
				particle.vx = randomInterval(-2, 2);
				particle.vy = randomInterval(-2, 2);
				raw = _lineColors[1].substr(4).split(',');
				particle.r = parseInt(raw[0]);
				particle.g = parseInt(raw[1]);
				particle.b = parseInt(raw[2]);
			}
			if (i % 12 == 0) {
				particle.c = 1;
				particle.r = randomInterval(220, 255)
				particle.g = randomInterval(200, 255);
				particle.b = randomInterval(200, 255)
				particle.d = randomInterval(4, 12);
				particle.x += randomInterval(-8, 8);
				particle.y += randomInterval(-8, 8);
			}
			_particles.push(particle);
		}
	}

	function explodePlayer(ellapsedTime, px, py, a, particle) {
		ellapsedTime = Date.now() - _levelCompleteTime;
		px = _playerPosition[0];
		py = _playerPosition[1];
		if (px - 16 < 0) { px = 0; }
		if (py - 16 < 0) { py = 0; }
		if (px - 16 > _canvasWidth - 32) { px = _canvasWidth - 32; }
		if (py - 16 > _canvasHeight - 32) { py = _canvasHeight - 32; }

		for (var j = 0; j < _particles.length; j++) {
			particle = _particles[j];
			_preRenderCtx.ba();
			_preRenderCtx.fillStyle = "rgba(" + particle.r + ", " + particle.g + ", " + particle.b + ", " + particle.a + ")";
			if (particle.a > 0) {
				if (particle.c) {
					_preRenderCtx.a(particle.x + px, particle.y + py, particle.d, 0, Math.PI * 2, true);
					_preRenderCtx.f();
					particle.d += .7;
					particle.a -= .01;
				} else {
					_preRenderCtx.fc(particle.x + px, particle.y + py, particle.d, particle.d);
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.d -= .02;
					particle.a -= .005;
				}
			} else {
				_particles.splice(j, 1);
			}
		}
		if (ellapsedTime / 500 < 1) {
			_preRenderCtx.save();
			_preRenderCtx.globalAlpha = 1 - (ellapsedTime / 500);
			_preRenderCtx.fillStyle = '#fff';
			_preRenderCtx.fc(0, 0, _canvasWidth, _canvasHeight);
			_preRenderCtx.restore();
		}
		if (_particles.length < 56) {
			_gameOver = 0;
			_particles = [];
			showGameOverScreen();
		}
	}

	function randomInterval(f, t) {
		return Math.floor(Math.random() * (t - f + 1) + f);
	}

	function intersectRect(r1, r2) {
		return !(r2.left > r1.right ||
			r2.right < r1.left ||
			r2.top > r1.bottom ||
			r2.bottom < r1.top);
	}

	function measureFps() {
		if (Date.now() < _fps.ellapsedTime) {
			_fps.measureCounter++;
			return 0;
		} else {
			_fps.measureScore = (_fps.measureCounter / _fps.measureTime) * 1000;
			return _fps.etalon / _fps.measureScore;
		}
	}

	function playSound(url, delay) {
		if (_soundEnabled > 0) {
			try {
				setTimeout(function () {
					_soundPlayer.src = url;
					_soundPlayer.play();
				}, delay || 0);
			} catch (e) {}
		}
	}

	function checkStorage(fail, uid) {
		try {
			uid = new Date;
			(_storage = _w.localStorage).setItem(uid, uid);
			fail = _storage.getItem(uid) != uid;
		    _storage.removeItem(uid);
		    fail && (_storage = false);
		} catch(e) {}
	}

	function checkHighScore() {
		if (_storage) {
			_hi = _storage.getItem('hi');
		}
		if (_hi == null) { _hi = 0; }
	}

	function testRender(x, y) {
		for (y = 0; y < 960; y += 60) {
			for (x = 0; x < 600; x += 60) {
				_tempCanvasCtx.ba();
				_tempCanvasCtx.a(y, x, 10, 0, Math.PI * 2, true);
				_tempCanvasCtx.fill();
				_tempCanvasCtx.ca();
			}
		}
		_mainCanvasCtx.save();
		_mainCanvasCtx.globalAlpha = 0;
		_mainCanvasCtx.drawImage(_tempCanvas, 0, 0);
		_mainCanvasCtx.restore();
		_tempCanvasCtx.ce(0, 0, _canvasWidth, _canvasHeight);
	}

	function id(id) {
		return _doc.getElementById(id);
	}

})();

function sfxrParams() {
	this.setSettingsString = function setSettingsString(string) {
		var values = string.split(",");
		this.waveType = parseInt(values[0]) || 0;
		this.attackTime = parseFloat(values[1]) || 0;
		this.sustainTime = parseFloat(values[2]) || 0;
		this.sustainPunch = parseFloat(values[3]) || 0;
		this.decayTime = parseFloat(values[4]) || 0;
		this.startFrequency = parseFloat(values[5]) || 0;
		this.minFrequency = parseFloat(values[6]) || 0;
		this.slide = parseFloat(values[7]) || 0;
		this.deltaSlide = parseFloat(values[8]) || 0;
		this.vibratoDepth = parseFloat(values[9]) || 0;
		this.vibratoSpeed = parseFloat(values[10]) || 0;
		this.chA = parseFloat(values[11]) || 0;
		this.changeSpeed = parseFloat(values[12]) || 0;
		this.squareDuty = parseFloat(values[13]) || 0;
		this.dutySweep = parseFloat(values[14]) || 0;
		this.repeatSpeed = parseFloat(values[15]) || 0;
		this.phaserOffset = parseFloat(values[16]) || 0;
		this.phaserSweep = parseFloat(values[17]) || 0;
		this.lpFilterCutoff = parseFloat(values[18]) || 0;
		this.lpFilterCutoffSweep = parseFloat(values[19]) || 0;
		this.lpFilterResonance = parseFloat(values[20]) || 0;
		this.hpFilterCutoff = parseFloat(values[21]) || 0;
		this.hpFilterCutoffSweep = parseFloat(values[22]) || 0;
		this.masterVolume = parseFloat(values[23]) || 0;
	}
}

function sfxrSynth() {

	this._params = new sfxrParams();
	var _finished;
	var _masterVolume;
	var _waveType;
	var _envelopeVolume;
	var _envelopeStage;
	var _envelopeTime;
	var _eL;
	var _eL0;
	var _eL1;
	var _eL2;
	var _eLO0;
	var _eLO1;
	var _eLO2;
	var _sustainPunch;
	var _phase;
	var _pos;
	var _period;
	var _periodTemp;
	var _maxPeriod;
	var _slide;
	var _deltaSlide;
	var _minFreqency;
	var _vibratoPhase;
	var _vibratoSpeed;
	var _vibratoAmplitude;
	var _cA;
	var _changeTime;
	var _changeLimit;
	var _squareDuty;
	var _dutySweep;
	var _repeatTime;
	var _repeatLimit;
	var _phaser;
	var _phaserOffset;
	var _phDO;
	var _phaserInt;
	var _phaserPos;
	var _phaserBuffer;
	var _filters;
	var _lpFilterPos;
	var _lpFilterOldPos;
	var _lpFilterDeltaPos;
	var _lpFilterCutoff;
	var _lpFilterDeltaCutoff;
	var _lpFilterDamping;
	var _lpFilterOn;
	var _hpFilterPos;
	var _hpFilterCutoff;
	var _hpFDC;
	var _noiseBuffer;
	var _superSample;
	var _sample;
	var _sampleCount;
	var _bufferSample;

	this.reset = function reset(totalReset) {
		var p = this._params;
		_period = 100.0 / (p.startFrequency * p.startFrequency + 0.001);
		_maxPeriod = 100.0 / (p.minFrequency * p.minFrequency + 0.001);
		_slide = 1.0 - p.slide * p.slide * p.slide * 0.01;
		_deltaSlide = -p.deltaSlide * p.deltaSlide * p.deltaSlide * 0.000001;

		if (p.waveType == 0) {
			_squareDuty = 0.5 - p.squareDuty * 0.5;
			_dutySweep = -p.dutySweep * 0.00005;
		}

		if (p.chA > 0.0) {
			_cA = 1.0 - p.chA * p.chA * 0.9;
		} else {
			_cA = 1.0 + p.chA * p.chA * 10.0;
		}

		_changeTime = 0;

		if (p.changeSpeed == 1.0) {
			_changeLimit = 0;
		} else {
			_changeLimit = (1.0 - p.changeSpeed) * (1.0 - p.changeSpeed) * 20000 + 32;
		}

		if (totalReset) {
			p.paramsDirty = false;
			_masterVolume = p.masterVolume * p.masterVolume;
			_waveType = p.waveType;

			if (p.sustainTime < 0.01) {
				p.sustainTime = 0.01;
			}

			var totalTime = p.attackTime + p.sustainTime + p.decayTime;
			if (totalTime < 0.18) {
				var multiplier = 0.18 / totalTime;
				p.attackTime *= multiplier;
				p.sustainTime *= multiplier;
				p.decayTime *= multiplier;
			}

			_sustainPunch = p.sustainPunch;
			_phase = 0;
			_minFreqency = p.minFrequency;
			_filters = p.lpFilterCutoff != 1.0 || p.hpFilterCutoff != 0.0;
			_lpFilterPos = 0.0;
			_lpFilterDeltaPos = 0.0;
			_lpFilterCutoff = p.lpFilterCutoff * p.lpFilterCutoff * p.lpFilterCutoff * 0.1;
			_lpFilterDeltaCutoff = 1.0 + p.lpFilterCutoffSweep * 0.0001;
			_lpFilterDamping = 5.0 / (1.0 + p.lpFilterResonance * p.lpFilterResonance * 20.0) * (0.01 + _lpFilterCutoff);
			if (_lpFilterDamping > 0.8) {
				_lpFilterDamping = 0.8;
			}
			_lpFilterDamping = 1.0 - _lpFilterDamping;
			_lpFilterOn = p.lpFilterCutoff != 1.0;

			_hpFilterPos = 0.0;
			_hpFilterCutoff = p.hpFilterCutoff * p.hpFilterCutoff * 0.1;
			_hpFDC = 1.0 + p.hpFilterCutoffSweep * 0.0003;

			_vibratoPhase = 0.0;
			_vibratoSpeed = p.vibratoSpeed * p.vibratoSpeed * 0.01;
			_vibratoAmplitude = p.vibratoDepth * 0.5;

			_envelopeVolume = 0.0;
			_envelopeStage = 0;
			_envelopeTime = 0;
			_eL0 = p.attackTime * p.attackTime * 100000.0;
			_eL1 = p.sustainTime * p.sustainTime * 100000.0;
			_eL2 = p.decayTime * p.decayTime * 100000.0 + 10;
			_eL = _eL0;
			this._envelopeFullLength = _eL0 + _eL1 + _eL2;

			_eLO0 = 1.0 / _eL0;
			_eLO1 = 1.0 / _eL1;
			_eLO2 = 1.0 / _eL2;

			_phaser = p.phaserOffset != 0.0 || p.phaserSweep != 0.0;

			_phaserOffset = p.phaserOffset * p.phaserOffset * 1020.0;
			if (p.phaserOffset < 0.0) {
				_phaserOffset = -_phaserOffset;
			}
			_phDO = p.phaserSweep * p.phaserSweep * p.phaserSweep * 0.2;
			_phaserPos = 0;

			if (!_phaserBuffer) {
				_phaserBuffer = new Array(1024);
			}
			if (!_noiseBuffer) {
				_noiseBuffer = new Array(32);
			}

			for (var i = 0; i < 1024; i++) {
				_phaserBuffer[i] = 0.0;
			}
			for (i = 0; i < 32; i++) {
				_noiseBuffer[i] = Math.random() * 2.0 - 1.0;
			}

			_repeatTime = 0;

			if (p.repeatSpeed == 0.0) {
				_repeatLimit = 0;
			} else {
				_repeatLimit = parseInt((1.0 - p.repeatSpeed) * (1.0 - p.repeatSpeed) * 20000) + 32;
			}
		}
	}

	this.synthWave = function synthWave(buffer, length, waveData, sampleRate, bitDepth) {
		sampleRate = sampleRate || 44100;
		_finished = false;

		_sampleCount = 0;
		_bufferSample = 0.0;

		for (var i = 0; i < length; i++) {
			if (_finished) {
				return i;
			}

			if (_repeatLimit != 0) {
				if (++_repeatTime >= _repeatLimit) {
					_repeatTime = 0;
					this.reset(false);
				}
			}

			if (_changeLimit != 0) {
				if (++_changeTime >= _changeLimit) {
					_changeLimit = 0;
					_period *= _cA;
				}
			}

			_slide += _deltaSlide;
			_period *= _slide;

			if (_period > _maxPeriod) {
				_period = _maxPeriod;
				if (_minFreqency > 0.0) {
					_finished = true;
				}
			}

			_periodTemp = _period;

			if (_vibratoAmplitude > 0.0) {
				_vibratoPhase += _vibratoSpeed;
				_periodTemp = _period * (1.0 + Math.sin(_vibratoPhase) * _vibratoAmplitude);
			}

			_periodTemp = parseInt(_periodTemp);
			if (_periodTemp < 8) {
				_periodTemp = 8;
			}

			if (_waveType == 0) {
				_squareDuty += _dutySweep;
				if (_squareDuty < 0.0) {
					_squareDuty = 0.0;
				} else if (_squareDuty > 0.5) {
					_squareDuty = 0.5;
				}
			}

			if (++_envelopeTime > _eL) {
				_envelopeTime = 0;

				switch (++_envelopeStage) {
					case 1:
						_eL = _eL1;
						break;
					case 2:
						_eL = _eL2;
						break;
				}
			}

			switch (_envelopeStage) {
				case 0:
					_envelopeVolume = _envelopeTime * _eLO0;
					break;
				case 1:
					_envelopeVolume = 1.0 + (1.0 - _envelopeTime * _eLO1) * 2.0 * _sustainPunch;
					break;
				case 2:
					_envelopeVolume = 1.0 - _envelopeTime * _eLO2;
					break;
				case 3:
					_envelopeVolume = 0.0;
					_finished = true;
					break;
			}

			if (_phaser) {
				_phaserOffset += _phDO;
				_phaserInt = parseInt(_phaserOffset);
				if (_phaserInt < 0) {
					_phaserInt = -_phaserInt;
				} else if (_phaserInt > 1023) {
					_phaserInt = 1023;
				}
			}

			if (_filters && _hpFDC != 0.0) {
				_hpFilterCutoff *= _hpFDC;
				if (_hpFilterCutoff < 0.00001) {
					_hpFilterCutoff = 0.00001;
				} else if (_hpFilterCutoff > 0.1) {
					_hpFilterCutoff = 0.1;
				}
			}

			_superSample = 0.0;
			for (var j = 0; j < 8; j++) {
				_phase++;
				if (_phase >= _periodTemp) {
					_phase = _phase - _periodTemp;

					if (_waveType == 3) {
						for (var n = 0; n < 32; n++) {
							_noiseBuffer[n] = Math.random() * 2.0 - 1.0;
						}
					}
				}

				switch (_waveType) {
					case 0:
						_sample = ((_phase / _periodTemp) < _squareDuty) ? 0.5 : -0.5;
						break;
					case 1:
						_sample = 1.0 - (_phase / _periodTemp) * 2.0;
						break;
					case 2:
						_pos = _phase / _periodTemp;
						_pos = _pos > 0.5 ? (_pos - 1.0) * 6.28318531 : _pos * 6.28318531;
						_sample = _pos < 0 ? 1.27323954 * _pos + .405284735 * _pos * _pos : 1.27323954 * _pos - 0.405284735 * _pos * _pos;
						_sample = _sample < 0 ? .225 * (_sample * -_sample - _sample) + _sample : .225 * (_sample * _sample - _sample) + _sample;
						break;
					case 3:
						_sample = _noiseBuffer[Math.abs(parseInt(_phase * 32 / parseInt(_periodTemp)))];
						break;
				}

				if (_filters) {
					_lpFilterOldPos = _lpFilterPos;
					_lpFilterCutoff *= _lpFilterDeltaCutoff;
					if (_lpFilterCutoff < 0.0) {
						_lpFilterCutoff = 0.0;
					} else if (_lpFilterCutoff > 0.1) {
						_lpFilterCutoff = 0.1;
					}

					if (_lpFilterOn) {
						_lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
						_lpFilterDeltaPos *= _lpFilterDamping;
					} else {
						_lpFilterPos = _sample;
						_lpFilterDeltaPos = 0.0;
					}

					_lpFilterPos += _lpFilterDeltaPos;
					_hpFilterPos += _lpFilterPos - _lpFilterOldPos;
					_hpFilterPos *= 1.0 - _hpFilterCutoff;
					_sample = _hpFilterPos;
				}

				if (_phaser) {
					_phaserBuffer[_phaserPos & 1023] = _sample;
					_sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) & 1023];
					_phaserPos = (_phaserPos + 1) & 1023;
				}

				_superSample += _sample;
			}

			_superSample = _masterVolume * _envelopeVolume * _superSample * 0.125;

			if (_superSample > 1.0) {
				_superSample = 1.0;
			} else if (_superSample < -1.0) {
				_superSample = -1.0;
			}

			_bufferSample += _superSample;
			_sampleCount++;

			if (sampleRate == 44100 || _sampleCount == 2) {
				_bufferSample /= _sampleCount;
				_sampleCount = 0;

				buffer[i] = parseInt(32000.0 * _bufferSample);
				_bufferSample = 0.0;
			}
		}

		return length;
	}
}

sfxrSynth.prototype.getWave = function (str) {
	var header = new Uint8Array([
		0x52, 0x49, 0x46, 0x46,
		0, 0, 0, 0,
		0x57, 0x41, 0x56, 0x45,
		0x66, 0x6d, 0x74, 0x20,
		16, 0, 0, 0,
		1, 0,
		1, 0,
		0x44, 0xAC, 0, 0,
		0x88, 0x58, 0x01, 0,
		2, 0,
		16, 0,
		0x64, 0x61, 0x74, 0x61,
		0, 0, 0, 0
	]);

	this._params.setSettingsString(str);
	this.reset(true);
	this._envelopeFullLength = parseInt(this._envelopeFullLength);
	var samples = new Uint16Array(this._envelopeFullLength);
	var used = this.synthWave(samples, this._envelopeFullLength, false);
	var soundLength = used * 2;
	var dv = new Uint32Array(header.buffer);
	dv[1] = 36 + soundLength;
	dv[10] = soundLength;
	var blob = new Blob([header, samples.subarray(0, used - 1)], { "type": "audio/wav" });
	var url = window.URL || window.webkitURL;
	return url.createObjectURL(blob);
}

window['sfxrSynth'] = sfxrSynth;
sfxrSynth.prototype['getWave'] = sfxrSynth.prototype.getWave;