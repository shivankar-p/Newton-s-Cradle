import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { RoundedBoxGeometry } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/geometries/RoundedBoxGeometry";
import { mergeBufferGeometries } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/utils/BufferGeometryUtils";

export class NewtonsCradle extends THREE.Group {
    constructor() {
      super();
      // base
      let baseG = new RoundedBoxGeometry(14, 1, 7, 3, 0.25).translate(0, 0.5, 0);
      let baseM = new THREE.MeshLambertMaterial({
        color: new THREE.Color(0, 0.75, 1).multiplyScalar(0.5)
      });
      let base = new THREE.Mesh(baseG, baseM);
      this.add(base);
  
      // frame
      let frameR = 0.25;
      let frameRound = 1.5;
      let frameW = 12;
      let frameH = 14;
      let frameD = 5;
      let radialSegs = 16;
      let gs = [];
      let cornerRound = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-frameRound, 0, 0),
        new THREE.Vector3(-frameRound, -frameRound, 0),
        new THREE.Vector3(0, -frameRound, 0)
      );
      let tubeG = new THREE.TubeGeometry(cornerRound, 10, frameR, radialSegs);
      let vertG = new THREE.CylinderGeometry(
        frameR,
        frameR,
        frameH - frameRound,
        radialSegs,
        1,
        true
      ).translate(0, (frameH - frameRound) * 0.5, 0);
      gs.push(
        tubeG
          .clone()
          .rotateZ(Math.PI * -0.5)
          .translate(
            -frameW * 0.5 + frameRound,
            frameH - frameRound,
            frameD * 0.5
          ),
        tubeG
          .clone()
          .rotateZ(Math.PI)
          .translate(
            frameW * 0.5 - frameRound,
            frameH - frameRound,
            frameD * 0.5
          ),
        vertG.clone().translate(-frameW * 0.5, 0, frameD * 0.5),
        vertG.clone().translate(frameW * 0.5, 0, frameD * 0.5),
        new THREE.CylinderGeometry(
          frameR,
          frameR,
          frameW - frameRound * 2,
          radialSegs,
          1,
          true
        )
          .rotateZ(Math.PI * 0.5)
          .translate(0, frameH, frameD * 0.5)
      );
  
      let g = mergeBufferGeometries(gs);
      g = mergeBufferGeometries([g.clone(), g.clone().translate(0, 0, -frameD)]);
      let tubeM = new THREE.MeshLambertMaterial();
      let frame = new THREE.Mesh(g, tubeM);
      frame.position.y = 1;
      this.add(frame);
  
      // balls
      let ballsCount = 5;
      let ballSystemGeoms = [];
      let ballRadius = 1.115;
      let stringHeight = frameH - 1.5 - 1.115;
      let stringLength = Math.sqrt(
        stringHeight * stringHeight + frameD * 0.5 * frameD * 0.5
      );
      let stringG = new THREE.CylinderGeometry(
        0.0375,
        0.0375,
        stringLength,
        8,
        1,
        true
      )
        .translate(0, stringLength * 0.5, 0)
        .rotateX(Math.PI * 0.5);
      ballSystemGeoms.push(
        new THREE.SphereGeometry(ballRadius, 36, 18).translate(
          0,
          -frameH + 1.5,
          0
        ),
        stringG
          .clone()
          .lookAt(new THREE.Vector3(0, stringHeight, frameD * 0.5))
          .translate(0, -stringHeight, 0),
        stringG
          .clone()
          .lookAt(new THREE.Vector3(0, stringHeight, frameD * -0.5))
          .translate(0, -stringHeight, 0)
      );
  
      let ballSystemGeom = mergeBufferGeometries(ballSystemGeoms);
      let ballSystemMat = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 1,
        roughness: 0.25
      });
      let ballSystem = new THREE.InstancedMesh(
        ballSystemGeom,
        ballSystemMat,
        ballsCount
      );
  
      let moveableDummies = new Array(ballsCount).fill().map((p, idx) => {
        let ballDummy = new THREE.Object3D();
        ballDummy.position.x = (-(ballsCount - 1) * 0.5 + idx) * 2.23;
        ballDummy.updateMatrix();
        ballSystem.setMatrixAt(idx, ballDummy.matrix);
        ballDummy.initPhase = Math.PI;
        ballDummy.maxAngle = THREE.MathUtils.degToRad(5);
        ballDummy.instanceIndex = idx;
        if (idx === 0 || idx === ballsCount - 1) {
          ballDummy.initPhase = 0;
          ballDummy.clampPhase = {
            min: idx === 0 ? -Math.PI : 0,
            max: idx === 0 ? 0 : Math.PI
          };
          ballDummy.maxAngle = Math.PI * 0.125;
        }
        return ballDummy;
      });
      ballSystem.position.y = frameH;
      frame.add(ballSystem);
  
      this.update = (t) => {
        moveableDummies.forEach((md) => {
          let a = Math.sin(t * Math.PI * 2) * md.maxAngle;
          if (md.clampPhase) {
            let c = md.clampPhase;
            let mn = c.min,
              mx = c.max;
            a = THREE.MathUtils.clamp(a, mn, mx);
          }
          md.rotation.z = a;
          md.updateMatrix();
          ballSystem.setMatrixAt(md.instanceIndex, md.matrix);
        });
        ballSystem.instanceMatrix.needsUpdate = true;
      };

      this.getPos = () => {
        return moveableDummies[0].rotation.z;
      };
    }
}