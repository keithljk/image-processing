<script>
export default {
    data(){
        return {
            canvas: null,
            ctx: null,
            maxGradient: 0,      //做完一階微分與中值濾波後的最大值
            isBlockUi: false,
        }
    },
    mounted(){
        this.initCanvas()
    },
    methods:{
        initCanvas(){
            this.canvas = this.$refs['myCanvas']       //將匯入圖片放置canvas畫布
            this.ctx = this.canvas.getContext("2d")       //將canvas畫布設為2D
        },
        imgChange(event) {
            const file = event.target.files[0]
            let img = new Image()
            img.src = URL.createObjectURL(file)
            const vueData = this

            img.onload = function() {
                vueData.canvas.width = img.width
                vueData.canvas.height = img.height
                vueData.ctx.drawImage(img, 0, 0, img.width, img.height);
            }
        },
        next() {
            this.msg = "transforming..."
            this.isBlockUi = true
            const vueDate = this
            setTimeout(function() {
                vueDate.unsharp();
            }, 1000);
        },
        unsharp() {
            console.log('go')
            let grayValue = this.toGray()
            let sobelValue = this.sobel(grayValue)
            let meanValue = this.meanFilter(sobelValue)
            let normalValue = this.normalization(meanValue)
            let laplacValue = this.laplace(grayValue)
            let multiplyValue = this.multiply(normalValue, laplacValue)
            this.sumOriginal(multiplyValue)
                // console.log(multiplyValue)
            console.log('done')
            this.isBlockUi = false
        },
        toGray() {
            let ary = []
            for (let i = 0; i < this.canvas.height; i++) {
                let ary1 = []
                for (let j = 0; j < this.canvas.width; j++) {
                    let value1 = this.ctx.getImageData(j - 1, i - 1, 1, 1).data[0]
                    let value2 = this.ctx.getImageData(j - 1, i - 1, 1, 1).data[1]
                    let value3 = this.ctx.getImageData(j - 1, i - 1, 1, 1).data[2]

                    let values = (value1 + value2 + value3) / 3
                    ary1.push(values)
                }
                ary.push(ary1)
            }
            return ary
        },
        sobel(inputAry) {
            let ary = []

            for (let i = 0; i < inputAry.length; i++) {
                let ary1 = []
                for (let j = 0; j < inputAry[i].length; j++) {

                    if (j == 0 || j == this.canvas.width - 1) {
                        ary1.push(0)
                    } else if (i == 0 || i == this.canvas.height - 1) {
                        ary1.push(0)
                    } else {
                        let z1 = inputAry[i - 1][j - 1]
                        let z2 = inputAry[i - 1][j]
                        let z3 = inputAry[i - 1][j + 1]
                        let z4 = inputAry[i][j - 1]
                        let z6 = inputAry[i][j + 1]
                        let z7 = inputAry[i + 1][j - 1]
                        let z8 = inputAry[i + 1][j]
                        let z9 = inputAry[i + 1][j + 1]

                        let gradient = Math.abs((z7 + 2 * z8 + z9) - (z1 + 2 * z2 + z3)) + Math.abs((z3 + 2 * z6 + z9) - (z1 + 2 * z4 + z7))
                        ary1.push(gradient)
                    }
                }
                ary.push(ary1)
            }
            return ary
        },
        meanFilter(inputAry) {
            let ary = []
            for (let i = 0; i < inputAry.length; i++) {
                let ary1 = []
                for (let j = 0; j < inputAry[i].length; j++) {

                    if (j == 0 || j == this.canvas.width - 1) {
                        ary1.push(0)
                    } else if (i == 0 || i == this.canvas.height - 1) {
                        ary1.push(0)
                    } else {
                        let z1 = inputAry[i - 1][j - 1]
                        let z2 = inputAry[i - 1][j]
                        let z3 = inputAry[i - 1][j + 1]
                        let z4 = inputAry[i][j - 1]
                        let z5 = inputAry[i][j]
                        let z6 = inputAry[i][j + 1]
                        let z7 = inputAry[i + 1][j - 1]
                        let z8 = inputAry[i + 1][j]
                        let z9 = inputAry[i + 1][j + 1]

                        let values = (z1 + z2 + z3 + z4 + z5 + z6 + z7 + z8 + z9) / 9

                        this.maxGradient = values > this.maxGradient ? values : this.maxGradient
                        ary1.push(values)
                    }
                }
                ary.push(ary1)
            }
            return ary
        },
        normalization(inputAry) {
            let ary = []
            for (let i = 0; i < inputAry.length; i++) {
                let ary1 = []
                for (let j = 0; j < inputAry[i].length; j++) {
                    let values = (inputAry[i][j]) / this.maxGradient

                    ary1.push(values)
                }
                ary.push(ary1)
            }
            return ary
        },
        laplace(inputAry) {
            let ary = []
            for (let i = 0; i < inputAry.length; i++) {
                let ary1 = []
                for (let j = 0; j < inputAry[i].length; j++) {
                    if (j == 0 || j == this.canvas.width - 1) {
                        ary1.push(0)
                    } else if (i == 0 || i == this.canvas.height - 1) {
                        ary1.push(0)
                    } else {
                        let z1 = inputAry[i - 1][j - 1]
                        let z2 = inputAry[i - 1][j]
                        let z3 = inputAry[i - 1][j + 1]
                        let z4 = inputAry[i][j - 1]
                        let z5 = inputAry[i][j]
                        let z6 = inputAry[i][j + 1]
                        let z7 = inputAry[i + 1][j - 1]
                        let z8 = inputAry[i + 1][j]
                        let z9 = inputAry[i + 1][j + 1]

                        let values = (z5 * 8 - (z1 + z2 + z3 + z4 + z6 + z7 + z8 + z9))
                        ary1.push(values)
                    }
                }
                ary.push(ary1)
            }
            return ary
        },
        multiply(level1, level2) {
            let ary = []
            for (let i = 0; i < level1.length; i++) {
                let ary1 = []
                for (let j = 0; j < level1[i].length; j++) {
                    let values = level1[i][j] * level2[i][j]

                    ary1.push(values)
                }
                ary.push(ary1)
            }
            return ary
        },
        sumOriginal(inputAry) {
            for (let i = 0; i < inputAry.length; i++) {
                for (let j = 0; j < inputAry[i].length; j++) {
                    let img = this.ctx.getImageData(j, i, 1, 1)

                    img.data[0] = img.data[0] + inputAry[i][j]
                    img.data[1] = img.data[1] + inputAry[i][j]
                    img.data[2] = img.data[2] + inputAry[i][j]

                    this.ctx.putImageData(img, j, i)
                }
            }
        }
    }
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

    .transformDiv{
        border: 5px solid #ddd;
    }
</style>