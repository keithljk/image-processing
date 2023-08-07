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
        vueData.ctx.drawImage(img, 0, 0, img.width, img.height);
      };
    },
    next() {
      this.msg = "transforming...";
      this.isBlockUi = true;
      const vueDate = this;

      setTimeout(function () {
        vueDate.Erosion();
      }, 1000);
    },
    Erosion() {
      console.log("go");
      let imgData = this.ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      //*****************二值化********************
      for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = imgData.data[i] > 128 ? 255 : 0;
        imgData.data[i + 1] = imgData.data[i + 1] > 128 ? 255 : 0;
        imgData.data[i + 2] = imgData.data[i + 2] > 128 ? 255 : 0;
        imgData.data[i + 3] = 255;
      }
      this.ctx.putImageData(imgData, 0, 0);
      //*****************Erosion********************
      for (let i = 0; i < this.canvas.height; i++) {
        for (let j = 0; j < this.canvas.width; j++) {
          let element = this.ctx.getImageData(j, i, 5, 5);

          if (element.data.includes(0)) {
            let img = this.ctx.getImageData(j + 1, i + 1, 1, 1);
            img.data[0] = 0;
            img.data[1] = 0;
            img.data[2] = 0;
            this.ctx2.putImageData(img, j + 1, i + 1);
          } else {
            let img = this.ctx.getImageData(j + 1, i + 1, 1, 1);
            img.data[0] = 255;
            img.data[1] = 255;
            img.data[2] = 255;
            this.ctx2.putImageData(img, j + 1, i + 1);
          }
        }
      }
      this.minus();
    },
    minus() {
      for (let i = 0; i < this.canvas.height; i++) {
        for (let j = 0; j < this.canvas.width; j++) {
          let img = this.ctx.getImageData(j, i, 1, 1);
          let data = img.data[0] - this.ctx2.getImageData(j, i, 1, 1).data[0];

          img.data[0] = data;
          img.data[1] = data;
          img.data[2] = data;
          this.ctx3.putImageData(img, j, i);
        }
      }
      console.log("done");
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
