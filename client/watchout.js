// start slingin' some d3 here


(function(){

  var gameOption, gameStats, axes, gameBoard, Player, createEnemies, render;

  gameOption = {
    height : 400,
    width : 800,
    enemies : 10,
    padding : 20,
    enemySize : 50
  };

  gameStats = {
    score : 0,
    bestScore : 0,
    numCollisions : 0
  };

  axes = {
    x : d3.scale.linear().domain([0,100]).range([0,gameOption.width]),
    y : d3.scale.linear().domain([0,100]).range([0,gameOption.height])
  };

  gameBoard = d3.select('.gameBoardContainer')
              .append('svg:svg')
              .attr('width', gameOption.width)
              .attr('height', gameOption.height);








Player = function(){
    this.fill = '#ff6600';
    this.x = 0;
    this.y = 0;
    this.r = 20;
  };

  Player.prototype.render = function(location){
    this.playerGraphic = location.append('svg:circle')
                        .attr('fill',this.fill)
                        .attr('r', this.r)
    this.move(gameOption.width/2, gameOption.height/2);
    this.setUpDragging();
    return this;
  };


  Player.prototype.setX = function(x){
    var minX = gameOption.padding;
    var maxX = gameOption.width - gameOption.padding;

    if(x <= minX){
      x = minX;
    }
    if(x >= maxX){
      x = maxX;
    }
    return this.x = x;
  };

  Player.prototype.setY = function(y){
    var minY = gameOption.padding;
    var maxY = gameOption.height - gameOption.padding;
    if(y <= minY){
      y = minY;
    }
    if(y >= maxY){
      y = maxY;
    }
    return this.y = y;
  };


  Player.prototype.setUpDragging = function(){
    var drag, dragMove, _this = this
    dragMove = function(){
      _this.move(d3.event.dx, d3.event.dy);
    };
    drag = d3.behavior.drag().on('drag', dragMove)
    _this.playerGraphic.call(drag)
  };

  Player.prototype.move = function(dx,dy){
    this.setX(dx+this.x);
    this.setY(dy+this.y);
    this.playerGraphic.attr('transform', 'translate(' + this.x + ',' + this.y + ')')
  };









  var updateCollisions = function(){
    gameStats.numCollisions++;
    d3.select('.collisions span').text(gameStats.numCollisions.toString());
  };


  var updateScore = function(){
    d3.select('.current span').text(gameStats.score.toString())
  };

  var updateBestScore = function(){
    gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore)
    d3.select('.high span').text(gameStats.bestScore.toString())
  };




  createEnemies = function(){
    return [0,1,2,3,4,5,6].map(function(item){
      return {
        id : item,
        x : Math.random()*100,
        y : Math.random()*100,
      };
    });
  };


  update = function(enemyData){
    var collidedEnemies = {};
    var checkCollision, enemies, onCollision, tweenWithCollisionDetection;
    enemies = gameBoard.selectAll('circle.enemy')
    .data(enemyData, function(d){
      return d.id;
    });
    enemies.enter()
    .append('svg:circle')
    .attr('class', 'enemy')
    .attr('cx', function(enemy){
      return axes.x(enemy.x);
    })
    .attr('cy', function(enemy){
      return axes.y(enemy.y);
    })
    .attr('r', 0);

    enemies.classed('collision',false)
    d3.select('.container').classed('shaker', false)


    enemies.exit().remove();

    checkCollision = function(enemy, collidedCallback){

        var radiusSum, separation, xDiff, yDiff;

        radiusSum = parseFloat(enemy.attr('r')) + player.r;
        xDiff = parseFloat(enemy.attr('cx')) - player.x;
        yDiff = parseFloat(enemy.attr('cy')) - player.y;

        separation = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
        if(separation < radiusSum){
          collidedCallback(enemy);
          collidedEnemies[enemy.datum().id] = true;
        }
    };

    onCollision = function(enemy){
      updateBestScore();
      gameStats.score = 0;
      updateBestScore();
      enemy.classed('collision', true)
      d3.select('.container').classed('shaker', true)
      if(!collidedEnemies[enemy.datum().id]){
        updateCollisions();
      }
    };

    tweenWithCollisionDetection = function(endData){
      var enemy = d3.select(this);
      var startPos = {
        x: parseFloat(enemy.attr('cx')),
        y: parseFloat(enemy.attr('cy'))
      };

      var endPos = {
        x: axes.x(endData.x),
        y: axes.y(endData.y)
      };

      return function(t) {
        checkCollision(enemy, onCollision);
        var enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        enemy.attr('cx', enemyNextPos.x)
             .attr('cy', enemyNextPos.y);
      };
    }

    enemies.transition().duration(500).attr('r', gameOption.enemySize)
           .transition().duration(2000)
           .tween('custom', tweenWithCollisionDetection);
  };

  var play = function() {
    var gameTurn = function() {
      update(createEnemies());
    };
    var increaseScore = function() {
      gameStats.score += 1;
      updateScore();
    };
    gameTurn();
    setInterval(gameTurn, 2000);
    setInterval(increaseScore, 50);

  };


  var player = new Player().render(gameBoard);
  play();


}).call(this)
