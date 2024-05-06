<template>
  <div id="left-container"></div>
  <div id="right-container">
    <div id="echarts-container" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import World from './world/world.js';

export default {
  data() {
    return {
      world: null,
      SLAMData: null, // 添加 SLAM 数据属性
      animationFrameID: null, // 保存 requestAnimationFrame 的返回值
      echartsInstance: null, // 添加 ECharts 实例属性
      data: [],
    };
  },
  mounted() {
    // 初始化 ECharts 实例
    this.initECharts();

    const worker = new Worker(new URL('./webworker/dataWorker.js', import.meta.url));
    const container = document.getElementById('left-container');
    this.world = new World(container);
    worker.addEventListener('message', (event) => {
      const data = event.data;
      switch (data.type) {
        case 'SLAM':
          this.updateSLAMData(data.data); // 更新 SLAM 数据
          break;
      }
    });
    worker.postMessage({ type: 'initWebSocket' });


    // 启动渲染循环
    this.startRenderLoop();
  },
  methods: {
    updateSLAMData(SLAM) {
      this.SLAMData = SLAM; // 更新 SLAM 数据
    },
    initECharts() {
      // 假设主题名称是 "vintage"

      this.echartsInstance = echarts.init(document.getElementById("echarts-container"));
      this.echartsInstance.setOption({
        tooltip: {},
        xAxis: {
          type: 'value',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          min: 1000,
          max: 2100,
          interval: 100,
          splitLine: {
            show: false,
          }
        },
        series: [
          {
            type: 'line',
          }
        ],

      });
    },
    updateEChartsData(SLAM) {
      // 更新 ECharts 折线图的数据
      const xAxisData = SLAM.num;
      const seriesData = SLAM.keyPointsSize;
      this.data.push([xAxisData, seriesData]);
      this.echartsInstance.setOption({
        dataset: {
          source: this.data
        },
      });
    },
    startRenderLoop() {
      const renderLoop = () => {
        if (this.SLAMData) {
          this.handleSLAM(this.SLAMData); // 渲染 SLAM 数据
        }
        // 在每一帧渲染前执行
        if (this.SLAMData && this.SLAMData.keyPointsSize) {
          this.updateEChartsData(this.SLAMData); // 更新 ECharts 数据
        }
        // 请求下一帧
        this.animationFrameID = requestAnimationFrame(renderLoop);
      };

      // 启动渲染循环
      this.animationFrameID = requestAnimationFrame(renderLoop);
    },
    stopRenderLoop() {
      // 停止渲染循环
      cancelAnimationFrame(this.animationFrameID);
    },
    handleSLAM(SLAM) {
      // 在这里可以访问 this.world 对象
      if (this.world) {
        this.world.render(SLAM);
      }
    }
  },
  beforeDestroy() {
    // 组件销毁时停止渲染循环
    this.stopRenderLoop();
  }
}
</script>

<style>
#left-container {
  float: left;
  /* 左浮动 */
  background-color: rgb(0, 0, 0);
  width: 50%;
  /* 占据页面宽度的一半 */
  height: 100vh;
  /* 占据整个屏幕的高度 */
}

#right-container {
  float: right;
  /* 右浮动 */
  width: 50%;
  /* 占据页面宽度的一半 */
  /*background-color: rgb(0, 0, 0);*/
  height: 30vh;
  /* 占据整个屏幕的高度 */
}
</style>