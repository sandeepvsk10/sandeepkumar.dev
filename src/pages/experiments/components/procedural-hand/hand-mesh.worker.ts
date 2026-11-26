import { buildHandMesh } from "./hand-mesh";

addEventListener("message", (event: MessageEvent<{ voxel: number }>) => {
  const mesh = buildHandMesh(event.data.voxel);
  postMessage(mesh, {
    transfer: [mesh.positions.buffer, mesh.normals.buffer, mesh.occlusion.buffer, mesh.flow.buffer, mesh.indices.buffer],
  });
});
