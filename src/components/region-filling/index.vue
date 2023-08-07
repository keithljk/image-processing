<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      canvas2: null,
      ctx2: null,
      canvas3: null,
      ctx3: null,
      canvas4: null,
      ctx4: null,
      isBlockUi: false,
    };
  },
  mounted() {
    this.initCanvas();
    this.imgChange();
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs["myCanvas"]; //將匯入圖片放置canvas畫布
      this.ctx = this.canvas.getContext("2d"); //將canvas畫布設為2D
      this.canvas2 = this.$refs["myCanvas2"];
      this.ctx2 = this.canvas2.getContext("2d");
      this.canvas3 = this.$refs["myCanvas3"];
      this.ctx3 = this.canvas3.getContext("2d");
      this.canvas4 = this.$refs["myCanvas4"];
      this.ctx4 = this.canvas4.getContext("2d");
    },
    imgChange(event) {
      let img = new Image();

      if (event) {
        const file = event.target.files[0];
        img.src = URL.createObjectURL(file);
      } else {
        const defaultImg = document.getElementById("defaultImg");
        img.src = defaultImg.src;
      }

      const vueData = this;

      img.onload = function () {
        vueData.canvas.width = img.width;
        vueData.canvas.height = img.height;
        vueData.canvas2.width = img.width;
        vueData.canvas2.height = img.height;
        vueData.canvas3.width = img.width;
        vueData.canvas3.height = img.height;
        vueData.canvas4.width = img.width;
        vueData.canvas4.height = img.height;
        vueData.ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    },
    next() {
      this.msg = "transforming...";
      this.isBlockUi = true;
      const vueDate = this;

      setTimeout(function () {
        vueDate.negative();
      }, 1000);
    },
    negative() {
      console.log("go");
      let imgData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      //*****************轉負片順便二值化********************
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i] > 128 ? 255 : 0;
        imgData.data[i + 1] = 255 - imgData.data[i + 1] > 128 ? 255 : 0;
        imgData.data[i + 2] = 255 - imgData.data[i + 2] > 128 ? 255 : 0;
        imgData.data[i + 3] = 255;
      }
      this.ctx2.putImageData(imgData, 0, 0);
      //*****************ctx3白紙化********************
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255;
        imgData.data[i + 1] = 255;
        imgData.data[i + 2] = 255;
        imgData.data[i + 3] = 255;
      }
      this.ctx3.putImageData(imgData, 0, 0);

      this.Dilation(40, 50);
      this.Dilation(146, 40);
      this.Dilation(240, 58);
      this.Dilation(48, 130);
      this.Dilation(108, 102);
      this.Dilation(200, 156);
      this.Dilation(75, 243);
      this.Dilation(171, 257);
      this.Dilation(271, 262);
      this.ORgate();
    },
    Dilation(pointX, pointY) {
      //*****************Dilation********************
      for (let j = pointY; j < this.canvas2.height; j++) {
        let element = this.ctx2.getImageData(pointX, j, 3, 3);

        if (
          element.data[(2 - 1) * 4] == 255 ||
          element.data[(4 - 1) * 4] == 255 ||
          element.data[(5 - 1) * 4] == 255 ||
          element.data[(6 - 1) * 4] == 255 ||
          element.data[(8 - 1) * 4] == 255
        ) {
          for (let i = pointX; i < this.canvas2.width; i++) {
            let element = this.ctx2.getImageData(i, j, 3, 3);

            if (
              element.data[(2 - 1) * 4] == 255 ||
              element.data[(4 - 1) * 4] == 255 ||
              element.data[(5 - 1) * 4] == 255 ||
              element.data[(6 - 1) * 4] == 255 ||
              element.data[(8 - 1) * 4] == 255
            ) {
              let imgData = this.ctx2.getImageData(i + 1, j + 1, 1, 1);
              imgData.data[0] = 0;
              imgData.data[1] = 0;
              imgData.data[2] = 0;
              imgData.data[3] = 255;

              this.ctx3.putImageData(imgData, i + 1, j + 1);
            } else {
              break;
            }
          }
          for (let i = pointX; i > 0; i--) {
            let element = this.ctx2.getImageData(i, j, 3, 3);

            if (
              element.data[(2 - 1) * 4] == 255 ||
              element.data[(4 - 1) * 4] == 255 ||
              element.data[(5 - 1) * 4] == 255 ||
              element.data[(6 - 1) * 4] == 255 ||
              element.data[(8 - 1) * 4] == 255
            ) {
              let imgData = this.ctx2.getImageData(i + 1, j + 1, 1, 1);
              imgData.data[0] = 0;
              imgData.data[1] = 0;
              imgData.data[2] = 0;
              imgData.data[3] = 255;

              this.ctx3.putImageData(imgData, i + 1, j + 1);
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
      for (let j = pointY; j > 0; j--) {
        let element = this.ctx2.getImageData(pointX, j, 3, 3);

        if (
          element.data[(2 - 1) * 4] == 255 ||
          element.data[(4 - 1) * 4] == 255 ||
          element.data[(5 - 1) * 4] == 255 ||
          element.data[(6 - 1) * 4] == 255 ||
          element.data[(8 - 1) * 4] == 255
        ) {
          for (let i = pointX; i < this.canvas2.width; i++) {
            let element = this.ctx2.getImageData(i, j, 3, 3);

            if (
              element.data[(2 - 1) * 4] == 255 ||
              element.data[(4 - 1) * 4] == 255 ||
              element.data[(5 - 1) * 4] == 255 ||
              element.data[(6 - 1) * 4] == 255 ||
              element.data[(8 - 1) * 4] == 255
            ) {
              let imgData = this.ctx2.getImageData(i + 1, j + 1, 1, 1);
              imgData.data[0] = 0;
              imgData.data[1] = 0;
              imgData.data[2] = 0;
              imgData.data[3] = 255;

              this.ctx3.putImageData(imgData, i + 1, j + 1);
            } else {
              break;
            }
          }
          for (let i = pointX; i > 0; i--) {
            let element = this.ctx2.getImageData(i, j, 3, 3);

            if (
              element.data[(2 - 1) * 4] == 255 ||
              element.data[(4 - 1) * 4] == 255 ||
              element.data[(5 - 1) * 4] == 255 ||
              element.data[(6 - 1) * 4] == 255 ||
              element.data[(8 - 1) * 4] == 255
            ) {
              let imgData = this.ctx2.getImageData(i + 1, j + 1, 1, 1);
              imgData.data[0] = 0;
              imgData.data[1] = 0;
              imgData.data[2] = 0;
              imgData.data[3] = 255;

              this.ctx3.putImageData(imgData, i + 1, j + 1);
            } else {
              break;
            }
          }
        } else {
          break;
        }
      }
    },
    ORgate() {
      let imgData2 = this.ctx2.getImageData(
        0,
        0,
        this.canvas2.width,
        this.canvas2.height
      );
      let imgData3 = this.ctx3.getImageData(
        0,
        0,
        this.canvas3.width,
        this.canvas3.height
      );

      for (let i = 0; i < imgData2.data.length; i += 4) {
        if (imgData2.data[i] == 0 || imgData3.data[i] == 0) {
          imgData2.data[i] = 0;
          imgData2.data[i + 1] = 0;
          imgData2.data[i + 2] = 0;
        } else {
          imgData2.data[i] = 255;
          imgData2.data[i + 1] = 255;
          imgData2.data[i + 2] = 255;
        }
      }

      this.ctx4.putImageData(imgData2, 0, 0);
      this.renegative();
    },
    renegative() {
      let imgData = this.ctx4.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      //*****************轉負片順便二值化********************
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i] > 128 ? 255 : 0;
        imgData.data[i + 1] = 255 - imgData.data[i + 1] > 128 ? 255 : 0;
        imgData.data[i + 2] = 255 - imgData.data[i + 2] > 128 ? 255 : 0;
      }
      this.ctx4.putImageData(imgData, 0, 0);
      this.isBlockUi = false;
    },
  },
};
</script>
<template src="./templete.html"></template>

<style>
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
