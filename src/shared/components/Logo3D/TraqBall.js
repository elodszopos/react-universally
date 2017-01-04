/* eslint func-names: 0, no-use-before-define: 0 */
let userAgent;
let canTouch;
let prefix = '';
let cssPref = '';
let requestAnimFrame;
let cancelAnimFrame;

export default function init() {
  userAgent = navigator.userAgent.toLowerCase();
  canTouch = (/android|webos|iphone|ipad|ipod|blackberry/i).test(userAgent);

  if (/webkit/gi.test(userAgent)) {
    prefix = '-webkit-';
    cssPref = 'Webkit';
  } else if (/msie/gi.test(userAgent)) {
    prefix = '-ms-';
    cssPref = 'ms';
  } else if (/mozilla/gi.test(userAgent)) {
    prefix = '-moz-';
    cssPref = 'Moz';
  } else if (/opera/gi.test(userAgent)) {
    prefix = '-o-';
    cssPref = 'O';
  } else {
    prefix = '';
  }

  function bindEvent(target, type, callback, remove) {
      // translate events
    let evType = type || 'touchend';
    const mouseEvs = ['mousedown', 'mouseup', 'mousemove'];
    const touchEvs = ['touchstart', 'touchend', 'touchmove'];

    evType = canTouch ? evType : mouseEvs[touchEvs.indexOf(type)];

    target[`${remove || 'add'}EventListener`](evType, callback, false);
  }

  function getCoords(eventObj) {
    let xTouch;
    let yTouch;

    if (eventObj.type.indexOf('mouse') > -1) {
      xTouch = eventObj.pageX;
      yTouch = eventObj.pageY;
    } else if (eventObj.type.indexOf('touch') > -1) {
        // only do stuff if 1 single finger is used:
      if (eventObj.touches.length === 1) {
        const touch = eventObj.touches[0];

        xTouch = touch.pageX;
        yTouch = touch.pageY;
      }
    }

    return [xTouch, yTouch];
  }

  function getStyle(target, prop) {
    const style = document.defaultView.getComputedStyle(target, '');

    return style.getPropertyValue(prop);
  }

  requestAnimFrame = (function () {
    return window[`${cssPref}RequestAnimationFrame`] ||
        function (callback) {
          window.setTimeout(callback, 17);
        };
  }());

  cancelAnimFrame = (function () {
    return window[`${cssPref}CancelRequestAnimationFrame`] ||
        clearTimeout;
  }());

  function Traqball(confObj) {
    this.config = {};
    this.box = null;

    this.setup(confObj);
  }

  Traqball.prototype.disable = function () {
    if (this.box !== null) {
      bindEvent(this.box, 'touchstart', this.evHandlers[0], 'remove');
      bindEvent(document, 'touchmove', this.evHandlers[1], 'remove');
      bindEvent(document, 'touchend', this.evHandlers[2], 'remove');
    }
  };

  Traqball.prototype.activate = function () {
    if (this.box !== null) {
      bindEvent(this.box, 'touchstart', this.evHandlers[0]);
      bindEvent(document, 'touchmove', this.evHandlers[1], 'remove');
      bindEvent(document, 'touchend', this.evHandlers[2], 'remove');
    }
  };

  Traqball.prototype.setup = function (conf) {
    const _this = this;
    let radius;
    let stage;
    let axis = [];
    let mouseDownVect = [];
    let mouseMoveVect = [];
    let startMatrix = [];
    let delta = 0;
    let impulse;
    let pos;
    let w;
    let h;
    let decr;
    let angle;
    let oldAngle;
    let oldTime;
    let curTime;

    (function innerInit() {
      _this.disable();

      for (const prop in conf) { // eslint-disable-line
        _this.config[prop] = conf[prop];
      }

      stage = document.getElementById(_this.config.stage) || document.getElementsByTagname('body')[0];
      pos = findPos(stage);
      angle = _this.config.angle || 0;
      impulse = _this.config.impulse !== false;

        // Let's calculate some basic values from "stage" that are necessary for our virtual trackball
        // 1st: determine the radius of our virtual trackball:
      h = stage.offsetHeight / 2;
      w = stage.offsetWidth / 2;

        // take the shortest of both values as radius
      radius = h < w ? h : w;

        // We parse viewport. The first block-element we find will be our "victim" and made rotatable
      for (let i = 0, l = stage.childNodes.length; i < l; i++) {
        const child = stage.childNodes[i];

        if (child.nodeType === 1) {
          _this.box = child;
          break;
        }
      }

      const perspective = getStyle(stage, `${prefix}perspective`);
      const bTransform = getStyle(_this.box, `${prefix}transform`);

        // Let's define the start values. If "conf" contains angle or perspective or vector, use them.
        // If not, look for css3d transforms within the CSS.
        // If this fails, let's use some default values.

      if (_this.config.axis || _this.config.angle) {
          // Normalize the initAxis (initAxis = axis of rotation) because "box" will look distorted if normal is too long
        axis = normalize(_this.config.axis) || [1, 0, 0];
        angle = _this.config.angle || 0;
          // Last but not least we calculate a matrix from the axis and the angle.
          // This matrix will store the initial orientation in 3d-space
        startMatrix = calcMatrix(axis, angle);
      } else if (bTransform !== 'none') {
          // already css3d transforms on element?
        startMatrix = bTransform.split(',');

          // Under certain circumstances some browsers report 2d Transforms.
          // Translate them to 3d:
        if (/matrix3d/gi.test(startMatrix[0])) {
          startMatrix[0] = startMatrix[0].replace(/(matrix3d\()/g, '');
          startMatrix[15] = startMatrix[15].replace(/\)/g, '');
        } else {
          startMatrix[0] = startMatrix[0].replace(/(matrix\()/g, '');
          startMatrix[5] = startMatrix[5].replace(/\)/g, '');
          startMatrix.splice(2, 0, 0, 0);
          startMatrix.splice(6, 0, 0, 0);
          startMatrix.splice(8, 0, 0, 0, 1, 0);
          startMatrix.splice(14, 0, 0, 1);
        }
        for (let i = 0, l = startMatrix.length; i < l; i++) {
          startMatrix[i] = parseFloat(startMatrix[i]);
        }
      } else {
        axis = [0, 1, 0];
        angle = 0;
        startMatrix = calcMatrix(axis, angle);
      }

      if (_this.config.perspective) {
        stage.style[`${cssPref}Perspective`] = _this.config.perspective;
      } else if (perspective === 'none') {
        stage.style[`${cssPref}Perspective`] = '700px';
      }

      if (_this.config.perspectiveOrigin) {
        stage.style[`${cssPref}PerspectiveOrigin`] = _this.config.perspectiveOrigin;
      }

      _this.box.style[`${cssPref}Transform`] = `matrix3d(${startMatrix})`;
      bindEvent(_this.box, 'touchstart', startrotation);

      _this.evHandlers = [startrotation, rotate, finishrotation];
    }());

    function startrotation(e) {
      if (delta !== 0) {
        stopSlide();
      }
      e.preventDefault();

      mouseDownVect = calcZvector(getCoords(e));
      oldTime = curTime = new Date().getTime();
      oldAngle = angle;

      bindEvent(_this.box, 'touchstart', startrotation, 'remove');
      bindEvent(document, 'touchmove', rotate);
      bindEvent(document, 'touchend', finishrotation);
    }

    function calcSpeed() {
      const dw = angle - oldAngle;

      const dt = curTime - oldTime;

      delta = Math.abs(dw * 17 / dt);

      if (isNaN(delta)) {
        delta = 0;
      } else if (delta > 0.2) {
        delta = 0.2;
      }
    }

    function finishrotation() {
      bindEvent(document, 'touchmove', rotate, 'remove');
      bindEvent(document, 'touchend', finishrotation, 'remove');
      bindEvent(_this.box, 'touchstart', startrotation);
      calcSpeed();
      if (impulse && delta > 0) {
        requestAnimFrame(slide);
      } else if (!(isNaN(axis[0]) || isNaN(axis[1]) || isNaN(axis[2]))) {
        stopSlide();
      }
    }

    function cleanupMatrix() {
      const stopMatrix = calcMatrix(axis, angle);

      startMatrix = multiplyMatrix(startMatrix, stopMatrix);
    }

    function rotate(e) {
      const eCoords = getCoords(e);

      e.preventDefault();

      oldTime = curTime;
      oldAngle = angle;

      mouseMoveVect = calcZvector(eCoords);

      axis[0] = mouseDownVect[1] * mouseMoveVect[2] - mouseDownVect[2] * mouseMoveVect[1];
      axis[1] = mouseDownVect[2] * mouseMoveVect[0] - mouseDownVect[0] * mouseMoveVect[2];
      axis[2] = mouseDownVect[0] * mouseMoveVect[1] - mouseDownVect[1] * mouseMoveVect[0];
      axis = normalize(axis);

        // Now that we have the normal, we need the angle of the rotation.
        // Easy to find by calculating the angle between mouseDownVect and mouseMoveVect:
      angle = calcAngle(mouseDownVect, mouseMoveVect);

        // Only one thing left to do: Update the position of the box by applying a new transform:
        // 2 transforms will be applied: the current rotation 3d and the start-matrix
      _this.box.style[`${cssPref}Transform`] = `rotate3d(${axis},${angle}rad) matrix3d(${startMatrix})`;

      curTime = new Date().getTime();
    }

    function stopSlide() {
      cancelAnimFrame(slide);
      cleanupMatrix();
      oldAngle = angle = 0;
      delta = 0;
    }

    function slide() {
      angle += delta;
      decr = 0.01 * Math.sqrt(delta);
      delta = delta > 0 ? delta - decr : 0;

      _this.box.style[`${cssPref}Transform`] = `rotate3d(${axis},${angle}rad) matrix3d(${startMatrix})`;

      if (delta === 0) {
        stopSlide();
      } else {
        requestAnimFrame(slide);
      }
    }

      // Some stupid matrix-multiplication.
    function multiplyMatrix(m1, m2) {
      const matrix = [];

      matrix[0] = m1[0] * m2[0] + m1[1] * m2[4] + m1[2] * m2[8] + m1[3] * m2[12];
      matrix[1] = m1[0] * m2[1] + m1[1] * m2[5] + m1[2] * m2[9] + m1[3] * m2[13];
      matrix[2] = m1[0] * m2[2] + m1[1] * m2[6] + m1[2] * m2[10] + m1[3] * m2[14];
      matrix[3] = m1[0] * m2[3] + m1[1] * m2[7] + m1[2] * m2[11] + m1[3] * m2[15];
      matrix[4] = m1[4] * m2[0] + m1[5] * m2[4] + m1[6] * m2[8] + m1[7] * m2[12];
      matrix[5] = m1[4] * m2[1] + m1[5] * m2[5] + m1[6] * m2[9] + m1[7] * m2[13];
      matrix[6] = m1[4] * m2[2] + m1[5] * m2[6] + m1[6] * m2[10] + m1[7] * m2[14];
      matrix[7] = m1[4] * m2[3] + m1[5] * m2[7] + m1[6] * m2[11] + m1[7] * m2[15];
      matrix[8] = m1[8] * m2[0] + m1[9] * m2[4] + m1[10] * m2[8] + m1[11] * m2[12];
      matrix[9] = m1[8] * m2[1] + m1[9] * m2[5] + m1[10] * m2[9] + m1[11] * m2[13];
      matrix[10] = m1[8] * m2[2] + m1[9] * m2[6] + m1[10] * m2[10] + m1[11] * m2[14];
      matrix[11] = m1[8] * m2[3] + m1[9] * m2[7] + m1[10] * m2[11] + m1[11] * m2[15];
      matrix[12] = m1[12] * m2[0] + m1[13] * m2[4] + m1[14] * m2[8] + m1[15] * m2[12];
      matrix[13] = m1[12] * m2[1] + m1[13] * m2[5] + m1[14] * m2[9] + m1[15] * m2[13];
      matrix[14] = m1[12] * m2[2] + m1[13] * m2[6] + m1[14] * m2[10] + m1[15] * m2[14];
      matrix[15] = m1[12] * m2[3] + m1[13] * m2[7] + m1[14] * m2[11] + m1[15] * m2[15];

      return matrix;
    }

    function calcZvector(coords) {
      const x = coords[0] - pos[0];
      const y = coords[1] - pos[1];
      const vector = [(x / radius - 1), (y / radius - 1)];
      const z = 1 - vector[0] * vector[0] - vector[1] * vector[1];

      vector[2] = z > 0 ? Math.sqrt(z) : 0;

      return vector;
    }

    function normalize(vect) {
      const length = Math.sqrt(vect[0] * vect[0] + vect[1] * vect[1] + vect[2] * vect[2]);

      vect[0] /= length;
      vect[1] /= length;
      vect[2] /= length;

      return vect;
    }

    function calcAngle(vect1, vect2) {
      const numerator = vect1[0] * vect2[0] + vect1[1] * vect2[1] + vect1[2] * vect2[2];
      const denominator = Math.sqrt(vect1[0] * vect1[0] + vect1[1] * vect1[1] + vect1[2] * vect1[2]) *
            Math.sqrt(vect2[0] * vect2[0] + vect2[1] * vect2[1] + vect2[2] * vect2[2]);

      return Math.acos(numerator / denominator);
    }

    function calcMatrix(vector, angle) { // eslint-disable-line
      const x = vector[0];
      const y = vector[1];
      const z = vector[2];
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);
      const cosmin = 1 - cos;
      const matrix = [(cos + x * x * cosmin), (y * x * cosmin + z * sin), (z * x * cosmin - y * sin), 0,
          (x * y * cosmin - z * sin), (cos + y * y * cosmin), (z * y * cosmin + x * sin), 0,
          (x * z * cosmin + y * sin), (y * z * cosmin - x * sin), (cos + z * z * cosmin), 0,
        0, 0, 0, 1];

      return matrix;
    }

    function findPos(obj) { // eslint-disable-line
      let curleft = 0;
      let curtop = 0;

      if (obj.offsetParent) {
        do { // eslint-disable-line
          curleft += obj.offsetLeft;
          curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return [curleft, curtop];
      }
    }
  };

  return Traqball;
}
