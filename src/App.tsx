import React, { useState, useEffect } from "react";
import {
  ZapparCamera,
  InstantTracker,
  ZapparCanvas,
  BrowserCompatibility,
} from "@zappar/zappar-react-three-fiber";

function App() {
  const [placementMode, setPlacementMode] = useState(true);

  // 获取所有可用的摄像头设备
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        console.log("所有可用的摄像头：");
        cameras.forEach((camera, index) => {
          console.log(`${index + 1}. 设备ID: ${camera.deviceId}`);
          console.log(`   标签: ${camera.label || "未知摄像头"}`);
          console.log(`   分组ID: ${camera.groupId}`);
          console.log("---");
        });

        // 也可以获取详细的摄像头能力
        for (const camera of cameras) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: camera.deviceId },
            });
            const track = stream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();
            console.log(`摄像头 "${camera.label}" 的能力:`, capabilities);
            stream.getTracks().forEach((track) => track.stop());
          } catch (error) {
            console.log(`无法访问摄像头 "${camera.label}":`, error);
          }
        }
      } catch (error) {
        console.error("获取摄像头设备失败:", error);
      }
    };

    getCameras();
  }, []);

  return (
    <>
      <BrowserCompatibility />
      <ZapparCanvas>
        <ZapparCamera />
        <InstantTracker
          placementMode={placementMode}
          placementCameraOffset={[0, 0, -5]}
        >
          <mesh>
            <boxBufferGeometry />
            <meshStandardMaterial color="hotpink" />
          </mesh>
        </InstantTracker>
        <directionalLight position={[2.5, 8, 5]} intensity={1.5} />
      </ZapparCanvas>
      <div
        id="zappar-button"
        role="button"
        onKeyPress={() => {
          setPlacementMode((currentPlacementMode) => !currentPlacementMode);
        }}
        tabIndex={0}
        onClick={() => {
          setPlacementMode((currentPlacementMode) => !currentPlacementMode);
        }}
      >
        Tap here to
        {placementMode ? " place " : " pick up "}
        the object
      </div>
    </>
  );
}

export default App;
