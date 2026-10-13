// Shared code for the interactive widgets of lecture 1.
// Classic script (not an ES module) so that it also loads when opening the
// slides from file://. Three.js is passed in as an argument by each widget.

// ---------------------------------------------------------------------------
// Minimal Lie group math on plain arrays. Matrices are arrays of rows.
// Poses are {R: 3x3, t: [3]}, tangent vectors xi = [v1, v2, v3, w1, w2, w3].
// ---------------------------------------------------------------------------
const Lie = (() => {
  const add = (a, b) => a.map((x, i) => x + b[i]);
  const sub = (a, b) => a.map((x, i) => x - b[i]);
  const scale = (a, s) => a.map((x) => x * s);
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => Math.hypot(...a);

  const I = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const mul = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
  const mulv = (A, v) => A.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
  const T = (A) => [0, 1, 2].map((i) => A.map((r) => r[i]));
  const madd = (A, B) => A.map((r, i) => r.map((x, j) => x + B[i][j]));
  const msub = (A, B) => A.map((r, i) => r.map((x, j) => x - B[i][j]));
  const mscale = (A, s) => A.map((r) => r.map((x) => x * s));
  const det = (A) =>
    A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
    A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
    A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

  const hat = (w) => [[0, -w[2], w[1]], [w[2], 0, -w[0]], [-w[1], w[0], 0]];

  // Rodrigues: exp(hat(w)) = I + sin(th)/th W + (1 - cos(th))/th^2 W^2
  function expSO3(w) {
    const th = norm(w);
    const W = hat(w);
    const W2 = mul(W, W);
    const a = th < 1e-6 ? 1 - (th * th) / 6 : Math.sin(th) / th;
    const b = th < 1e-6 ? 0.5 - (th * th) / 24 : (1 - Math.cos(th)) / (th * th);
    return madd(madd(I(), mscale(W, a)), mscale(W2, b));
  }

  // Left Jacobian of SO(3): J = I + (1 - cos th)/th^2 W + (th - sin th)/th^3 W^2
  function leftJ(w) {
    const th = norm(w);
    const W = hat(w);
    const W2 = mul(W, W);
    const a = th < 1e-6 ? 0.5 - (th * th) / 24 : (1 - Math.cos(th)) / (th * th);
    const b = th < 1e-6 ? 1 / 6 - (th * th) / 120 : (th - Math.sin(th)) / (th * th * th);
    return madd(madd(I(), mscale(W, a)), mscale(W2, b));
  }

  const expSE3 = (xi) => ({ R: expSO3(xi.slice(3)), t: mulv(leftJ(xi.slice(3)), xi.slice(0, 3)) });
  const identity = () => ({ R: I(), t: [0, 0, 0] });
  const compose = (a, b) => ({ R: mul(a.R, b.R), t: add(mulv(a.R, b.t), a.t) });
  const inverse = (a) => {
    const RT = T(a.R);
    return { R: RT, t: scale(mulv(RT, a.t), -1) };
  };
  const act = (a, p) => add(mulv(a.R, p), a.t);

  return {
    add, sub, scale, dot, cross, norm, I, mul, mulv, T, madd, msub, mscale, det, hat,
    expSO3, leftJ, expSE3, identity, compose, inverse, act,
  };
})();

// ---------------------------------------------------------------------------
// Pretty printing
// ---------------------------------------------------------------------------
const Fmt = {
  num(x, d = 2) {
    const s = (Math.abs(x) < 0.5 * 10 ** -d ? 0 : x).toFixed(d);
    return (s.startsWith('-') ? s : ' ' + s);
  },
  mat(A, d = 2) {
    return A.map((r) => '│' + r.map((x) => Fmt.num(x, d)).join(' ') + ' │').join('\n');
  },
  pose(P, d = 2) {
    const rows = P.R.map((r, i) => [...r, P.t[i]]);
    rows.push([0, 0, 0, 1]);
    return Fmt.mat(rows, d);
  },
  vec(v, d = 2) {
    return '(' + v.map((x) => Fmt.num(x, d).trim()).join(', ') + ')';
  },
};

// ---------------------------------------------------------------------------
// Three.js helpers
// ---------------------------------------------------------------------------
const Viz = {
  // Scene with Z-up world, orbit controls, labels and a resize handler.
  setup(THREE, OrbitControls, CSS2DRenderer, container, { eye = [6, -7, 5], target = [0, 0, 0] } = {}) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xfbfbf9);
    container.appendChild(renderer.domElement);

    const labels = new CSS2DRenderer();
    labels.domElement.style.position = 'absolute';
    labels.domElement.style.top = '0';
    labels.domElement.style.pointerEvents = 'none';
    container.appendChild(labels.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);
    camera.up.set(0, 0, 1);
    camera.position.set(...eye);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...target);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(4, -6, 10);
    scene.add(sun);

    const grid = new THREE.GridHelper(12, 12, 0xcfccc4, 0xe4e1da);
    grid.rotation.x = Math.PI / 2;
    grid.position.z = -0.001;
    scene.add(grid);

    function resize() {
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      labels.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    new ResizeObserver(resize).observe(container);
    resize();

    function render() {
      controls.update();
      renderer.render(scene, camera);
      labels.render(scene, camera);
    }
    return { renderer, scene, camera, controls, render };
  },

  label(THREE, CSS2DObject, text, color, pos = [0, 0, 0]) {
    const div = document.createElement('div');
    div.className = 'label3d';
    div.textContent = text;
    div.style.color = color;
    const obj = new CSS2DObject(div);
    obj.position.set(...pos);
    return obj;
  },

  arrow(THREE, from, dir, len, color, headLen = 0.18, headWidth = 0.1) {
    const d = new THREE.Vector3(...dir);
    const a = new THREE.ArrowHelper(d.clone().normalize(), new THREE.Vector3(...from), Math.max(len, 1e-3), color, Math.min(headLen, 0.5 * len + 1e-3), headWidth);
    return a;
  },

  setArrow(THREE, a, from, vec) {
    const v = new THREE.Vector3(...vec);
    const len = v.length();
    a.position.set(...from);
    if (len < 1e-6) { a.visible = false; return; }
    a.visible = true;
    a.setDirection(v.clone().normalize());
    a.setLength(len, Math.min(0.2, 0.4 * len), Math.min(0.11, 0.25 * len));
  },

  // RGB coordinate triad
  triad(THREE, len = 1, opacity = 1) {
    const g = new THREE.Group();
    const cols = [0xe53935, 0x43a047, 0x1e88e5];
    const dirs = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    dirs.forEach((d, i) => {
      const a = Viz.arrow(THREE, [0, 0, 0], d, len, cols[i], 0.16, 0.09);
      a.line.material.transparent = a.cone.material.transparent = opacity < 1;
      a.line.material.opacity = a.cone.material.opacity = opacity;
      g.add(a);
    });
    return g;
  },

  // A small pinhole camera (looking along +z, x right, y down as in computer vision)
  cameraModel(THREE, color, opacity = 1) {
    const g = new THREE.Group();
    const transparent = opacity < 1;
    const mat = new THREE.MeshStandardMaterial({ color, transparent, opacity, roughness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.35), mat);
    body.position.z = -0.12;
    g.add(body);
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.18, 20), new THREE.MeshStandardMaterial({ color: 0x333333, transparent, opacity }));
    lens.rotation.x = Math.PI / 2;
    lens.position.z = 0.12;
    g.add(lens);
    // Frustum
    const f = 0.75, w = 0.45, h = 0.32;
    const c = [[-w, -h, f], [w, -h, f], [w, h, f], [-w, h, f]];
    const pts = [];
    c.forEach((p) => pts.push(0, 0, 0, ...p));
    for (let i = 0; i < 4; i++) pts.push(...c[i], ...c[(i + 1) % 4]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, transparent, opacity })));
    // "up" marker (towards -y) so that the orientation is never ambiguous
    const tri = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 3), mat);
    tri.position.set(0, -0.3, f);
    tri.rotation.x = Math.PI;
    g.add(tri);
    g.add(Viz.triad(THREE, 0.55, opacity));
    return g;
  },

  setPose(THREE, obj, P) {
    const m = new THREE.Matrix4();
    const R = P.R, t = P.t;
    m.set(R[0][0], R[0][1], R[0][2], t[0], R[1][0], R[1][1], R[1][2], t[1], R[2][0], R[2][1], R[2][2], t[2], 0, 0, 0, 1);
    obj.matrixAutoUpdate = false;
    obj.matrix.copy(m);
    obj.matrixWorldNeedsUpdate = true;
  },

  polyline(THREE, color, maxPoints = 512, { dashed = false, opacity = 1, linewidth = 1 } = {}) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(maxPoints * 3), 3));
    geo.setDrawRange(0, 0);
    const mat = dashed
      ? new THREE.LineDashedMaterial({ color, dashSize: 0.12, gapSize: 0.08, transparent: opacity < 1, opacity })
      : new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity, linewidth });
    const line = new THREE.Line(geo, mat);
    line.frustumCulled = false;
    line.setPoints = (points) => {
      const arr = geo.attributes.position.array;
      const n = Math.min(points.length, maxPoints);
      for (let i = 0; i < n; i++) arr.set(points[i], 3 * i);
      geo.attributes.position.needsUpdate = true;
      geo.setDrawRange(0, n);
      if (dashed) line.computeLineDistances();
    };
    return line;
  },

  dot(THREE, color, r = 0.07) {
    return new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), new THREE.MeshStandardMaterial({ color }));
  },
};

// Play/pause + timeline controller shared by the widgets.
function makePlayer({ playBtn, slider, readout, duration, onChange, loop = true, speed = 1, fmt = (t) => 't = ' + t.toFixed(2) }) {
  let t = 0, playing = true, last = null, dur = duration;
  const api = {
    get t() { return t; },
    set duration(d) { dur = d; slider.max = d; api.seek(Math.min(t, d)); },
    get duration() { return dur; },
    speed,
    seek(v) { t = v; slider.value = v; readout && (readout.textContent = fmt(t)); onChange(t); },
    play() { playing = true; playBtn.textContent = '❚❚ Pause'; },
    pause() { playing = false; playBtn.textContent = '▶ Play'; },
    toggle() { playing ? api.pause() : api.play(); },
    tick(now) {
      if (last === null) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!playing) return;
      let nt = t + dt * api.speed;
      if (nt > dur + 0.6) nt = loop ? 0 : dur; // short pause at the end before looping
      api.seek(nt > dur ? dur : nt);
      if (nt > dur) t = nt; // keep counting during the end pause
    },
  };
  slider.min = 0; slider.max = dur; slider.step = 0.001;
  slider.addEventListener('input', () => { api.pause(); api.seek(parseFloat(slider.value)); });
  playBtn.addEventListener('click', () => api.toggle());
  api.play();
  return api;
}
