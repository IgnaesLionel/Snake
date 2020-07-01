window.onload = () => {
    const canvasWidth = 500;
    const canvasHeight = 500;
    const blockSize = 20;
    const canvas = document.getElementById('canvas'); //selection du canvas
    const ctx = canvas.getContext('2d'); //mode 2D
    const widthInBlocks = canvasWidth/blockSize;
    const heightInBlocks = canvasHeight/blockSize;
    const centreX = canvasWidth / 2;
    const centreY = canvasHeight / 2;
    let delay;
    let snakee;
    let applee;
    let minee;
    let score;
    let timeOut;

    const init = () => {  //initialisation du canvas
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "15px solid gray";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#C0C0C0";
        launch();
    }
    const random = (min, max) => {
       return Math.floor(Math.random() * (max - min + 1) + min);
    }
    const launch = () => { //creation des elements du jeu
        snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([random(1,widthInBlocks),random(1,heightInBlocks)]);
        minee = new Mine([random(1,widthInBlocks),random(1,heightInBlocks)]);
        score = 0;
        clearTimeout(timeOut);
        delay = 120;
        refreshCanvas();
    }

    const refreshCanvas = () => {
        snakee.advance();
        if (snakee.checkCollision()){
            gameOver();
        } else {
            if (snakee.eatSomething(applee)){
                //if (snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple = true;

                do {
                    applee.setNewPosition();
                } while(applee.isOnSnake(snakee));

                if(score % 5 == 0){
                    speedUp();
                }
            }


            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            minee.draw()
            timeOut = setTimeout(refreshCanvas,delay);
         }

         if (snakee.eatSomething(minee)){
           gameOver()
         }

    }

    const speedUp = () => {
        delay /= 1.25;
    }

    const gameOver = () => {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
        ctx.restore();
    }

    const drawScore = () => {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(score.toString(), centreX, centreY);
        ctx.restore();
    }

    const drawBlock = (ctx, position) => {
        const x = position[0]*blockSize;
        const y = position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }

    class Snake {
      constructor(body, direction) {
        this.body = body;
        this.direction = direction;
        this.ateApple = false;
      }

      draw(){
                ctx.save();
                ctx.fillStyle="#3f50ff";
                for (let i=0 ; i < this.body.length ; i++){
                    drawBlock(ctx,this.body[i]);
                }
                ctx.restore();
            };

      advance(){
                const nextPosition = this.body[0].slice();
                switch(this.direction){
                    case "left":
                        nextPosition[0] -= 1;
                        break;
                    case "right":
                        nextPosition[0] += 1;
                        break;
                    case "down":
                        nextPosition[1] += 1;
                        break;
                    case "up":
                        nextPosition[1] -= 1;
                        break;
                    default:
                        throw("invalid direction");
                }
                this.body.unshift(nextPosition);
                if (!this.ateApple)
                    this.body.pop();
                else
                    this.ateApple = false;
            };

        setDirection(newDirection){
                let allowedDirections;
                switch(this.direction){
                    case "left":
                    case "right":
                        allowedDirections=["up","down"];
                        break;
                    case "down":
                    case "up":
                        allowedDirections=["left","right"];
                        break;
                   default:
                        throw("invalid direction");
                }
                if (allowedDirections.indexOf(newDirection) > -1){
                    this.direction = newDirection;
                }
            };

        checkCollision(){
                let wallCollision = false;
                let snakeCollision = false;
                const head = this.body[0];
                const rest = this.body.slice(1);
                const snakeX = head[0];
                const snakeY = head[1];
                const minX = 0;
                const minY = 0;
                const maxX = widthInBlocks - 1;
                const maxY = heightInBlocks - 1;
                const isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
                const isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;

                if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
                    wallCollision = true;

                for (let i=0 ; i<rest.length ; i++){
                    if (snakeX === rest[i][0] && snakeY === rest[i][1])
                        snakeCollision = true;

                }
                return wallCollision || snakeCollision;
            };

        eatSomething(item){
                const head = this.body[0];
                if (head[0] === item.position[0] && head[1] === item.position[1])
                    return true;
                else
                    return false;

            }

        }
    class Apple {
        constructor(position){
              this.position = position;
        }
        draw(){
          const radius = blockSize/2;
          const x = this.position[0]*blockSize + radius;
          const y = this.position[1]*blockSize + radius;
          ctx.save();
          ctx.fillStyle = "#33cc33";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI*2, true);
          ctx.strokeStyle = "red";
          ctx.lineWidth=2;
          ctx.fill();
          ctx.stroke()
          ctx.restore();
        };

        setNewPosition(){
            const newX = Math.round(Math.random()*(widthInBlocks-1));
            const newY = Math.round(Math.random()*(heightInBlocks-1));
            this.position = [newX,newY];
        };

        isOnSnake (snakeToCheck){
            let isOnSnake = false;
            for (let i=0 ; i < snakeToCheck.body.length ; i++){
                if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
      }

      class Mine {
          constructor(position){
                this.position = position;
          }
          draw(){
            const radius = blockSize/2;
            const x = this.position[0]*blockSize + radius;
            const y = this.position[1]*blockSize + radius;
            ctx.save();
            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI*2, true);
            ctx.strokeStyle = "white";
            ctx.lineWidth=2;
            ctx.fill();
            ctx.stroke()
            ctx.restore();
          };

          setNewPosition(){
              const newX = Math.round(Math.random()*(widthInBlocks-1));
              const newY = Math.round(Math.random()*(heightInBlocks-1));
              this.position = [newX,newY];
          };

          isOnSnake (snakeToCheck){
              let isOnSnake = false;
              for (let i=0 ; i < snakeToCheck.body.length ; i++){
                  if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                      isOnSnake = true;
                  }
              }
              return isOnSnake;
          };
        }

    document.onkeydown =  (e) => {
        const key = e.keyCode;
        let newDirection;
        switch(key){
            case 37:
                newDirection = "left";
                break;
            case 38:
                newDirection = "up";
                break;
            case 39:
                newDirection = "right";
                break;
            case 40:
                newDirection = "down";
                break;
            case 32:
                launch();
                return;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    };
  init();
}
