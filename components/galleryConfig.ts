export type GalleryFrameKind = "photo" | "object";

export type GalleryFrameConfig = {
  id: number;
  imageId: number | null;
  kind?: GalleryFrameKind;
  position: [number, number, number];
  rotation: [number, number, number];
  size?: [number, number];
};

export const galleryFrameConfig: GalleryFrameConfig[] = [
  // 展区 A 北墙中部，正对入口方向。
  { id: 1, imageId: 1, position: [-4.8, 2.15, -15.72], rotation: [0, 0, 0] },
  { id: 2, imageId: 2, position: [0, 2.15, -15.72], rotation: [0, 0, 0] },
  { id: 3, imageId: 3, position: [4.8, 2.15, -15.72], rotation: [0, 0, 0] },

  // 展区 B / D 北墙补位：从大厅两侧展板移出的 4 张图。
  { id: 4, imageId: 4, position: [-17.2, 2.0, -15.72], rotation: [0, 0, 0], size: [2.2, 1.75] },
  { id: 5, imageId: 5, position: [-12.8, 2.0, -15.72], rotation: [0, 0, 0], size: [2.2, 1.75] },
  { id: 6, imageId: 6, position: [12.8, 2.0, -15.72], rotation: [0, 0, 0], size: [2.2, 1.75] },
  { id: 7, imageId: 7, position: [17.2, 2.0, -15.72], rotation: [0, 0, 0], size: [2.2, 1.75] },

  // 展区 D 东墙，沿右侧外墙垂直布置。
  { id: 8, imageId: 8, position: [21.72, 1.85, -10.2], rotation: [0, -Math.PI / 2, 0], size: [2, 1.9] },
  { id: 9, imageId: 9, position: [21.72, 1.85, 4.4], rotation: [0, -Math.PI / 2, 0], size: [2, 1.9] },

  // 展区 D 南墙下方。
  { id: 10, imageId: 10, position: [14.8, 1.82, 15.05], rotation: [0, Math.PI, 0], size: [2.9, 1.55] },

  // 展区 A 中央低展台，正对入口方向。
  { id: 11, imageId: 11, position: [0, 1.78, -1.0], rotation: [0, 0, 0], size: [3, 1.45] },
  { id: 12, imageId: 12, position: [0, 1.78, 7.0], rotation: [0, 0, 0], size: [3, 1.45] },

  // 展区 B 西墙与南侧墙面。
  { id: 13, imageId: 13, position: [-21.72, 1.8, -11.6], rotation: [0, Math.PI / 2, 0], size: [2, 1.8] },
  { id: 14, imageId: 1, position: [-21.72, 1.8, -6.0], rotation: [0, Math.PI / 2, 0], size: [2, 1.8] },
  { id: 15, imageId: 2, position: [-15.5, 1.82, -1.2], rotation: [0, 0, 0], size: [3.4, 1.5] },

  // 展区 C 西墙与南侧墙面。
  { id: 16, imageId: 3, position: [-21.72, 1.8, 6.0], rotation: [0, Math.PI / 2, 0], size: [2, 1.8] },
  { id: 17, imageId: 4, position: [-21.72, 1.8, 11.4], rotation: [0, Math.PI / 2, 0], size: [2, 1.8] },
  { id: 18, imageId: 5, position: [-15.5, 1.82, 15.05], rotation: [0, Math.PI, 0], size: [3.4, 1.5] },

  // 展区 D 立体展品点位，不加载摄影图。
  { id: 19, imageId: null, kind: "object", position: [12.6, 1.45, -11.0], rotation: [0, -0.25, 0], size: [1.65, 1.65] },
  { id: 20, imageId: null, kind: "object", position: [15.6, 1.45, -2.2], rotation: [0, 0.2, 0], size: [1.65, 1.65] },
  { id: 21, imageId: null, kind: "object", position: [12.2, 1.45, 10.3], rotation: [0, -0.1, 0], size: [1.65, 1.65] },

  // 展区 A 左侧中央展板：正面空图框。
  { id: 22, imageId: null, position: [-5.62, 1.85, -2.8], rotation: [0, -Math.PI / 2, 0], size: [2.1, 1.9] },
  // 展区 A 左侧中央展板：背面空图框。
  { id: 23, imageId: null, position: [-5.18, 1.85, 2.8], rotation: [0, Math.PI / 2, 0], size: [2.1, 1.9] },
  // 展区 A 右侧中央展板：正面空图框。
  { id: 24, imageId: null, position: [5.62, 1.85, -2.8], rotation: [0, Math.PI / 2, 0], size: [2.1, 1.9] },
  // 展区 A 右侧中央展板：背面空图框。
  { id: 25, imageId: null, position: [5.18, 1.85, 2.8], rotation: [0, -Math.PI / 2, 0], size: [2.1, 1.9] },
];
