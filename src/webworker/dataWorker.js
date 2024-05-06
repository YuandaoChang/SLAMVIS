function webSocket() {
  const SLAM = {
    cameraPose: {},
    keyFrame: [],
    covisibilityGraph: [],
    spanningTree: [],
    loops: [],
    mapPoints: [],
    referMapPoints: [],
    keyPointsSize: 0,
    num:0,
  };
  const websocket = new WebSocket("ws://0.0.0.0:9002");

  websocket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  websocket.onmessage = (event) => {
    var blob = event.data; // 接收到的 WebSocket 消息，假设是一个 Blob

    var fileReader = new FileReader();

    fileReader.onload = function () {
      // 当读取完成时，data 包含 Blob 数据
      var data = fileReader.result;
      // 创建一个 DataView 对象以便读取 Blob 数据
      var dataView = new DataView(data);
      // 获取第一个字节（字符标志）
      var dataTypeFlag = String.fromCharCode(dataView.getUint8(0));
      switch (dataTypeFlag) {
        case 'A':
          console.log("receive begin")
          const matrixDataA = new Float64Array(dataView.buffer, 8, 16);
          cameraPose = matrixDataA;
          SLAM.cameraPose = matrixDataA;

          break;
        case 'B':
          const matrixArrayStartB = 8;
          const matrixArrayLengthB = (data.byteLength - matrixArrayStartB) / (4 * 4 * Float32Array.BYTES_PER_ELEMENT);
          const matrixArrayB = new Float32Array(dataView.buffer, matrixArrayStartB, matrixArrayLengthB * 4 * 4);

          for (let i = 0; i < matrixArrayLengthB; i++) {
            const matrixStartB = i * 16;
            const matrixDataB = matrixArrayB.subarray(matrixStartB, matrixStartB + 16);
            SLAM.keyFrame.push(matrixDataB);
          }

          break;
        case 'C':
          const matrixArrayStartC = 8;
          const matrixArrayLengthC = (data.byteLength - matrixArrayStartC) / (3 * 2 * Float32Array.BYTES_PER_ELEMENT);
          const matrixArrayC = new Float32Array(dataView.buffer, matrixArrayStartC, matrixArrayLengthC * 3 * 2);

          for (let i = 0; i < matrixArrayLengthC; i++) {
            const matrixStartC = i * 6;
            const matrixDataC = matrixArrayC.subarray(matrixStartC, matrixStartC + 6);
            SLAM.covisibilityGraph.push(matrixDataC);
          }

          break;
        case 'D':
          const matrixArrayStartD = 8;
          const matrixArrayLengthD = (data.byteLength - matrixArrayStartD) / (3 * 2 * Float32Array.BYTES_PER_ELEMENT);
          // 创建 Float32Array 以容纳矩阵数组
          const matrixArrayD = new Float32Array(dataView.buffer, matrixArrayStartD, matrixArrayLengthD * 3 * 2);

          // 将矩阵数组切割成一个个矩阵

          for (let i = 0; i < matrixArrayLengthD; i++) {
            const matrixStartD = i * 6;
            const matrixDataD = matrixArrayD.subarray(matrixStartD, matrixStartD + 6);
            SLAM.spanningTree.push(matrixDataD)
          }
          // 现在 keyFrame 数组包含了所有的4x4矩阵

          break;
        case 'E':
          const matrixArrayStartE = 8;
          const matrixArrayLengthE = (data.byteLength - matrixArrayStartE) / (3 * 2 * Float32Array.BYTES_PER_ELEMENT);
          // 创建 Float32Array 以容纳矩阵数组
          const matrixArrayE = new Float32Array(dataView.buffer, matrixArrayStartE, matrixArrayLengthE * 3 * 2);

          // 将矩阵数组切割成一个个矩阵

          for (let i = 0; i < matrixArrayLengthE; i++) {
            const matrixStartE = i * 6;
            const matrixDataE = matrixArrayE.subarray(matrixStartE, matrixStartE + 6);
            SLAM.loops.push(matrixDataE)
          }

          // 现在 keyFrame 数组包含了所有的4x4矩阵


          break;
        case 'F':
          const matrixArrayStartF = 8;
          const matrixArrayLengthF = (data.byteLength - matrixArrayStartF) / (3 * Float32Array.BYTES_PER_ELEMENT);
          // 创建 Float32Array 以容纳矩阵数组
          const matrixArrayF = new Float32Array(dataView.buffer, matrixArrayStartF, matrixArrayLengthF * 3);

          // 将矩阵数组切割成一个个矩阵

          for (let i = 0; i < matrixArrayLengthF; i++) {
            const matrixStartF = i * 3;
            const matrixDataF = matrixArrayF.subarray(matrixStartF, matrixStartF + 3);
            SLAM.mapPoints.push(matrixDataF);
          }
          // 现在 keyFrame 数组包含了所有的4x4矩阵

          break;
        case 'G':
          const matrixArrayStartG = 8;
          const matrixArrayLengthG = (data.byteLength - matrixArrayStartG) / (3 * Float32Array.BYTES_PER_ELEMENT);
          // 创建 Float32Array 以容纳矩阵数组
          const matrixArrayG = new Float32Array(dataView.buffer, matrixArrayStartG, matrixArrayLengthG * 3);
          // 将矩阵数组切割成一个个矩阵
          for (let i = 0; i < matrixArrayLengthG; i++) {
            const matrixStartG = i * 3;
            const matrixDataG = matrixArrayG.subarray(matrixStartG, matrixStartG + 3);
            SLAM.referMapPoints.push(matrixDataG)
          }
          break;

        case 'K':
          const keyPointsSizeStart = 8;
          const keyPointsSize = dataView.getInt32(keyPointsSizeStart, true); // 读取整数值
          SLAM.keyPointsSize = keyPointsSize;
          console.log("keypointsize", keyPointsSize);
          break;

        case 'Z':
          console.log("receive end", SLAM);
          console.log("num",SLAM.num)
          self.postMessage({ type: 'SLAM', data: SLAM });
          // 在需要置空的时候，例如某个条件满足时
          SLAM.cameraPose = {};
          SLAM.keyFrame.length = 0;
          SLAM.covisibilityGraph.length = 0;
          SLAM.spanningTree.length = 0;
          SLAM.loops.length = 0;
          SLAM.mapPoints.length = 0;
          SLAM.referMapPoints.length = 0;
          SLAM.keyPointsSize = 0;
          SLAM.num++;
          break;
        default:
          console.log("error")
          break;
      }

    };

    // 读取 Blob 数据
    fileReader.readAsArrayBuffer(blob);
  };

  websocket.onclose = () => {
    console.log("WebSocket connection closed");
  };
  websocket.onerror = (error) => {
    console.log(error)
  }
}

self.addEventListener('message', (event) => {
  const data = event.data;

  if (data.type === 'initWebSocket') {
    webSocket();
  }
});