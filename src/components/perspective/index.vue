<script>
// import * as math from 'mathjs'
const math = require("mathjs");
export default {
  data() {
    return {
      canvas: null,
      canvas2: null,
      canvas0: null,
      ctx: null,
      ctx2: null,
      ctx0: null,
      width: 0, //變形後的寬
      height: 0, //變形後的高
      x1: 0, //左上點的X方向值
      x2: 0, //右上點的X方向值
      x3: 0, //右下點的X方向值
      x4: 0, //左下點的X方向值
      y1: 0, //左上點的Y方向值
      y2: 0, //右上點的Y方向值
      y3: 0, //右下點的Y方向值
      y4: 0, //左下點的Y方向值
      point: [],
      isBlockUi: false,
    };
  },
  mounted() {
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs["myCanvas"]; //將匯入圖片放置canvas畫布
      this.canvas2 = this.$refs["myCanvas2"]; //將變形後圖片放置canvas畫布
      this.canvas0 = this.$refs["myCanvas0"]; //防止點選的點其像素影響原圖
      this.ctx = this.canvas.getContext("2d"); //將canvas畫布設為2D
      this.ctx2 = this.canvas2.getContext("2d");
      this.ctx0 = this.canvas0.getContext("2d");
    },
    imgChange(event) {
      const file = event.target.files[0];
      let img = new Image();
      img.src = URL.createObjectURL(file);
      const vueData = this;

      img.onload = function () {
        vueData.canvas.width = img.width;
        vueData.canvas.height = img.height;
        vueData.canvas2.width = img.width;
        vueData.canvas2.height = img.height;
        vueData.canvas0.width = img.width;
        vueData.canvas0.height = img.height;
        vueData.ctx.drawImage(img, 0, 0, img.width, img.height);
        vueData.ctx.drawImage(img, 0, 0, img.width, img.height);
        vueData.ctx0.drawImage(img, 0, 0, img.width, img.height);
      };
    },
    pick(event) {
      //*****************防止選取超過4個點*************************
      if (this.point.length == 4) {
        const vueDate = this;
        vueDate.msg = "已經選滿4個點了";
        vueDate.isBlockUi = true;
        setTimeout(function () {
          vueDate.isBlockUi = false;
        }, 2000);
      }
      //*****************抓取點選的XY座標值，並放入point陣列*************************
      let x = event.offsetX;
      let y = event.offsetY;
      let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
      let ary = [x, y, distance];

      if (this.point.length < 4) {
        this.point.push(ary);
      }
      //*****************呼叫function*************************
      this.drawPoint();
    },
    drawPoint() {
      //*****************於canvas畫布繪製選擇點*************************
      const vueData = this;
      this.point.map((p) => {
        vueData.ctx.fillStyle = "#fff";
        vueData.ctx.beginPath();
        vueData.ctx.arc(p[0], p[1], 3, 0, Math.PI * 2, true);
        vueData.ctx.stroke();
        vueData.ctx.fill();
      });
    },
    reset() {
      let imgData = this.ctx0.getImageData(
        0,
        0,
        this.canvas0.width,
        this.canvas0.height
      );
      this.ctx.putImageData(imgData, 0, 0);
      this.point.splice(0, this.point.length);
    },
    next() {
      if (!this.checkPoints()) {
        return;
      }

      this.msg = "transforming...";
      this.isBlockUi = true;

      const vueDate = this;
      setTimeout(function () {
        vueDate.transform();
      }, 1000);
    },
    checkPoints() {
      if (this.point.length < 4) {
        const vueDate = this;
        vueDate.msg = "請先選擇四個轉換點...";
        vueDate.isBlockUi = true;
        setTimeout(function () {
          vueDate.isBlockUi = false;
        }, 2000);
        return false;
      }
      return true;
    },
    sortPoint() {
      this.point.sort((x, y) => x[2] - y[2]);

      if (this.point[1][1] > this.point[2][1]) {
        this.x2 = this.point[2][0];
        this.y2 = this.point[2][1];
        this.x4 = this.point[1][0];
        this.y4 = this.point[1][1];
      } else {
        this.x2 = this.point[1][0];
        this.y2 = this.point[1][1];
        this.x4 = this.point[2][0];
        this.y4 = this.point[2][1];
      }

      this.x1 = this.point[0][0];
      this.y1 = this.point[0][1];
      this.x3 = this.point[3][0];
      this.y3 = this.point[3][1];
    },
    distance() {
      let side12 = Math.sqrt(
        Math.pow(Math.abs(this.x1 - this.x2), 2) +
          Math.pow(Math.abs(this.y1 - this.y2), 2)
      );
      let side23 = Math.sqrt(
        Math.pow(Math.abs(this.x2 - this.x3), 2) +
          Math.pow(Math.abs(this.y2 - this.y3), 2)
      );
      let side34 = Math.sqrt(
        Math.pow(Math.abs(this.x3 - this.x4), 2) +
          Math.pow(Math.abs(this.y3 - this.y4), 2)
      );
      let side41 = Math.sqrt(
        Math.pow(Math.abs(this.x4 - this.x1), 2) +
          Math.pow(Math.abs(this.y4 - this.y1), 2)
      );

      this.width = side12 > side34 ? side12 : side34;
      this.height = side23 > side41 ? side23 : side41;
    },
    bilinear(x, y) {
      let imgData = this.ctx0.getImageData(x, y, 1, 1);
      let Q1x = parseInt(x);
      let Q2x = parseInt(x) + 1;
      let Q1y = parseInt(y);
      let Q2y = parseInt(y) + 1;

      let Q11 = this.ctx0.getImageData(Q1x, Q1y, 1, 1);
      let Q12 = this.ctx0.getImageData(Q1x, Q2y, 1, 1);
      let Q21 = this.ctx0.getImageData(Q2x, Q1y, 1, 1);
      let Q22 = this.ctx0.getImageData(Q2x, Q2y, 1, 1);

      let f1R = (Q2x - x) * Q11.data[0] + (x - Q1x) * Q21.data[0];
      let f1G = (Q2x - x) * Q11.data[1] + (x - Q1x) * Q21.data[1];
      let f1B = (Q2x - x) * Q11.data[2] + (x - Q1x) * Q21.data[2];

      let f2R = (Q2x - x) * Q12.data[0] + (x - Q1x) * Q22.data[0];
      let f2G = (Q2x - x) * Q12.data[1] + (x - Q1x) * Q22.data[1];
      let f2B = (Q2x - x) * Q12.data[2] + (x - Q1x) * Q22.data[2];

      imgData.data[0] = (Q2y - y) * f1R + (y - Q1y) * f2R;
      imgData.data[1] = (Q2y - y) * f1G + (y - Q1y) * f2G;
      imgData.data[2] = (Q2y - y) * f1B + (y - Q1y) * f2B;
      imgData.data[3] = 255;

      return imgData;
    },
    transform() {
      this.sortPoint();
      this.distance();
      const Matrix_A = [
        [0, 0, 0, 1, 0, 0, 0, 0],
        [this.width, 0, 0, 1, 0, 0, 0, 0],
        [this.width, this.height, this.width * this.height, 1, 0, 0, 0, 0],
        [0, this.height, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, this.width, 0, 0, 1],
        [0, 0, 0, 0, this.width, this.height, this.width * this.height, 1],
        [0, 0, 0, 0, 0, this.height, 0, 1],
      ];
      const Matrix_B = [
        this.x1,
        this.x2,
        this.x3,
        this.x4,
        this.y1,
        this.y2,
        this.y3,
        this.y4,
      ];
      const Matrix_X = math.lusolve(Matrix_A, Matrix_B);

      let a = Matrix_X[0][0];
      let b = Matrix_X[1][0];
      let c = Matrix_X[2][0];
      let d = Matrix_X[3][0];
      let e = Matrix_X[4][0];
      let f = Matrix_X[5][0];
      let g = Matrix_X[6][0];
      let h = Matrix_X[7][0];

      for (let i = 0; i < this.height; i++) {
        for (let j = 0; j < this.width; j++) {
          //j才是X
          var x = a * j + b * i + c * i * j + d;
          var y = e * j + f * i + g * i * j + h;
          var imgData = this.bilinear(x, y);

          this.ctx2.putImageData(imgData, j, i);
        }
      }

      this.isBlockUi = false;
    },
  },
};
</script>

<template src="./templete.html"></template>

<style scoped>
.contentDiv {
  display: flex;
  justify-content: center;
  margin: 15px 0;
  flex-wrap: wrap;
}

#controlDiv {
  height: 100px;
}

button {
  width: 150px;
  margin: 0 10px;
}
.transformDiv {
  border: 5px solid #ddd;
}
</style>
