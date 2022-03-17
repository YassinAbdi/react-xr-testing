import React, { Suspense, useEffect, useRef } from "react";
import {
  Environment,
  OrbitControls,
  useHelper,
  Stats
} from "@react-three/drei";
import { VRCanvas, useXR } from "@react-three/xr";
import {
  SpotLightHelper,
  PointLightHelper,
  DoubleSide,
  NoToneMapping
} from "three";
import { useFrame, addEffect } from "@react-three/fiber";
import { Globals } from "@react-spring/shared";

import Grid from "./components/Grid";
import Model from "./components/Model";
// import Title from "./components/Title";

import "wipe.css";
import "./styles.css";

let nextFrame = undefined;

const XR = () => {
  const { player, isPresenting } = useXR();

  useEffect(() => {
    if (isPresenting) {
      player.position.z += 1;
    } else {
      player.position.x = 0;
      player.position.y = 0;
      player.position.z = 0;
    }
  }, [player, isPresenting]);

  return null;
};

addEffect(() => {
  if (nextFrame) nextFrame();
  return true;
});

Globals.assign({
  requestAnimationFrame: (cb) => (nextFrame = cb)
});

const Scene = () => {
  const box = useRef();
  const floor = useRef();

  return (
    <>
      <mesh ref={box} position-y={0.51}>
        <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
        <meshStandardMaterial
          attach="material"
          metalness={0.3}
          roughness={0.9}
          color="#101010"
        />
      </mesh>
      <mesh ref={floor} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry attach="geometry" args={[10, 10]} />
        <meshStandardMaterial
          attach="material"
          color="#000"
          metalness={0.7}
          roughness={0.5}
        />
      </mesh>
    </>
  );
};

const Lights = () => {
  const spotLight1 = useRef();

  // useHelper(spotLight1, SpotLightHelper, "magenta");

  return (
    <>
      <ambientLight intensity={0.2} />
      <spotLight
        ref={spotLight1}
        position={[0, 3, 0]}
        color="magenta"
        intensity={0.23}
      />
    </>
  );
};

console.log("todo: lose enviroment, add lights");

const WebGL = () => {
  return (
    <VRCanvas
      dpr={[1, 2]}
      gl={{
        // toneMapping: NoToneMapping,
        antialias: true,
        alpha: false
      }}
    >
      <fog attach="fog" args={["#000", 2, 5]} />
      <Suspense fallback={"loading"}>
        <Scene />
        <Model />
        <Grid />
        <Lights />
        <Environment preset="city" />
        <OrbitControls
          maxDistance={3}
          minDistance={2}
          maxPolarAngle={Math.PI * 0.25}
          minPolarAngle={Math.PI * 0.25}
          autoRotate
        />
      </Suspense>
      {/* <axesHelper args={[20, 20, 20]} /> */}
      <XR />
      <Stats />
    </VRCanvas>
  );
};

export default function App() {
  return (
    <div className="App">
      {/* <Title /> */}
      <WebGL />
    </div>
  );
}
