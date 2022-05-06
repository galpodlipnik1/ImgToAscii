const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const btn = document.getElementById('btn');
const selectedImage = document.getElementById('selectedImage');
const inputSlider = document.getElementById('resolution');
const inputLabel = document.getElementById('resolutionLabel');
inputSlider.addEventListener('change', () => {
    handleSliderChange();
});

btn.addEventListener('click', () => {
    //download the image
    const link = document.createElement('a');
    link.download = 'image.png';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();

});

selectedImage.addEventListener('change', () => {
    const file = selectedImage.files[0];
    // convert file to base64 string
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        // set image to canvas
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            inputSlider.value = 1;
            image1.src = image.src;
        }
    }
});

const image1 = new Image();
image1.src = './images/patrick.jpg';

class Cell {
    constructor(x, y, symbol, color) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.color = color;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillText(this.symbol, this.x, this.y);
    }
}


class AsciiEffect {
    #imageCellArray = [];
    #pixels = [];
    #ctx;
    #width;
    #height;
    constructor(ctx, width, height) {
        this.#ctx = ctx;
        this.#width = width;
        this.#height = height;
        this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
        this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
    }
    #convertToSymbol = (g) => {
        if(g > 250) return '@';
        else if(g > 240) return '*';
        else if(g > 220) return '+';
        else if(g > 200) return '#';
        else if(g > 180) return '&';
        else if(g > 160) return '%';
        else if(g > 140) return '_';
        else if(g > 120) return ':';
        else if(g > 100) return '$';
        else if(g > 80) return '/';
        else if(g > 60) return '-';
        else if(g > 40) return 'X';
        else if(g > 20) return 'W';
        else return '';
    }
    #scanImage = (cellSize) => {
        this.#imageCellArray = [];
        for (let y = 0; y < this.#pixels.height; y += cellSize) {
            for(let x = 0; x < this.#pixels.width; x += cellSize) {
                const posX = x * 4;
                const posY = y * 4;
                const pos = (posY * this.#pixels.width) + posX;

                if(this.#pixels.data[pos + 3] > 128) {
                    const red = this.#pixels.data[pos];
                    const green = this.#pixels.data[pos + 1];
                    const blue = this.#pixels.data[pos + 2];
                    const avgColorValue = (red + green + blue) / 3;
                    const color = "rgb(" + red + ", " + green + ", " + blue + ")";
                    const symbol = this.#convertToSymbol(avgColorValue);
                    if((red + green + blue) > 200){
                        this.#imageCellArray.push(new Cell(x, y, symbol, color));
                        //this.#imageCellArray.push(new Cell(x, y, symbol, color)); WITH DARK COLOR
                    }
                }
            }
        }
    }
    #drawAscii(){
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        for(let i = 0; i < this.#imageCellArray.length; i++){
            this.#imageCellArray[i].draw(this.#ctx);
        }
    }
    draw(cellSize){
        this.#scanImage(cellSize);
        this.#drawAscii();
    }
}
let effect;

const handleSliderChange = () => {
    if( inputSlider.value == 1){
        inputLabel.innerHTML = 'Original image';
        ctx.drawImage(image1, 0, 0, image1.width, image1.height);
    }
    else {
        inputLabel.innerHTML = `Resolution: ${inputSlider.value}`;
        ctx.font = parseInt(inputSlider.value) * 2 + 'px Verdana';
        effect.draw(parseInt(inputSlider.value));
    }
};

image1.onload = () => {
    canvas.width = image1.width;
    canvas.height = image1.height;
    
    effect = new AsciiEffect(ctx, image1.width, image1.height);
    handleSliderChange();
}