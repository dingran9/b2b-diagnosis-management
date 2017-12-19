<template>
  <canvas ref="canvas">
    <p>抱歉，您的浏览器不支持canvas</p>
  </canvas>

</template>
<script>
  export default {
    components: {},
    data() {
      return {}
    },
    mounted() {
      let circle = this.circle;
      if (circle.width) {
        this.generatingCircle();
      }
    },
    props: {
      circle: {}
    },
    methods: {
      //画圆
      generatingCircle() {
        var circleConfig = this.circle,
          totalnum = circleConfig.score,
          width = circleConfig.width,
          totalScore = circleConfig.totalScore,
          canvas = this.$refs.canvas,
          ctx = canvas.getContext("2d"),
          percent = totalnum, // 最终百分比
          circleX = width / 2, // 中心x坐标
          circleY = width / 2, // 中心y坐标
          radius = (width - 10) / 2, // 圆环半径
          lineWidth = 8, // 圆形线条的宽度
          fontSize = 14; // 字体大小
        canvas.width = canvas.height = width;

        // 画圆
        function circle(cx, cy, r) {
          ctx.beginPath();
          ctx.moveTo(cx + r, cy);
          ctx.lineWidth = lineWidth;
          ctx.strokeStyle = '#d3f2e5';
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.closePath();
          ctx.stroke();
        }

        // 画弧线
        function sector(cx, cy, r, startAngle, endAngle, anti) {
          ctx.beginPath();
          ctx.lineWidth = lineWidth;
          // 渐变色 - 可自定义
          let linGrad = ctx.createLinearGradient(
            circleX, circleY - radius - lineWidth, circleX, circleY + radius + lineWidth
          );
          linGrad.addColorStop(0.0, '#1fd094');
          linGrad.addColorStop(0.25, '#1fd094');
          linGrad.addColorStop(0.5, '#1fd094');
          linGrad.addColorStop(0.75, '#1fd094');
          linGrad.addColorStop(1.0, '#1fd094');
          ctx.strokeStyle = linGrad;

          // 圆弧两端的样式
          ctx.lineCap = 'round';
          // 圆弧
          ctx.arc(
            cx, cy, r,
            startAngle * (Math.PI / 180.0) - (Math.PI / 2),
            endAngle * (Math.PI / 180.0) - (Math.PI / 2),
            anti
          );
          ctx.stroke();
        }

        // 刷新
        let process = 0.0; // 进度
        let circleLoading = window.setInterval(function () {
          loading();
        }, 1);

        function loading() {
          console.log(process)
          if (process == percent) {
            clearInterval(circleLoading);
          } else if (process > percent) {
            process = percent;
            return;
          }

          // 清除canvas内容
          ctx.clearRect(0, 0, circleX * 2, circleY * 2);
          ctx.font = fontSize + 'px April';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#609ffd';
          ctx.fillText((+parseFloat(process).toFixed(2)) + '分', circleX, circleY);
          // 圆形
          circle(circleX, circleY, radius);
          // 圆弧
          sector(circleX, circleY, radius, 0, process / totalScore * 360);
          // 控制结束时动画的速度
          if (process / percent > 0.90) {
            process += 0.30;
          } else if (process / percent > 0.80) {
            process += 0.55;
          } else if (process / percent > 0.70) {
            process += 0.75;
          } else {
            process += 1.0;
          }
        }


      },
    },
    watch: {
      circle() {
        this.generatingCircle();
      }
    },
    computed: {},
    filters: {}

  }
</script>
<style lang="scss" scoped>
</style>
