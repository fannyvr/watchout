// start slingin' some d3 here


(function(){

  var gameOption, gameStats, axes, gameBoard, Player, createEnemies, render;

  gameOption = {
    height : 800,
    width : 1000,
    enemies : 10,
    padding : 20,
    minX : gameOption.padding,
    maxX : gameOption.width - gameOption.padding,
    minY : ameOption.padding,
    maxY : gameOption.height - gameOption.padding
  };

  gameStats   {
    score : 0,
    bestScore : 0
  };

  axes = {
    x : d3.scale.linear().domain([0,100]).range([0,gameOption.width]),
    y : d3.scale.linear().domain([0,100]).range([0,gameOption.height])
  };

  gameBoard = d3.select('.container')
              .append('svg:svg')
              .attr('width', gameOption.width)
              .attr('height', gameOption.height);

var gameUpdateScore = function(){
  return d3.select('.current').text(gameStats.score.toString())
};

var updateBestScore = function(){
  gameStats.bestScore = Math.max(gameStats.score, gameStats.bestScore)
  d3.select('.high').text(gameStats.bestScore.toString())
};

Player = function(){
  this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z';
  this.fill = '#ff6600';
  this.x = gameOption.width/2;
  this.y = gameOption.height/2;
  this.angle = 0;
  this.r = 5;
};

Player.prototype.render = function(to){
  this.el = to.append('svg:path')
                      .attr('d',this.path())
                      .attr('fill',this.fill);
  this.setUpDragging()
  return this;
};

Player.prototype.getX = function(){
  return this.x;
};

Player.prototype.getY = function(){
  return this.y;
};

Player.prototype.setX = function(x){
  if(x <= gameOption.minX){
    x = gameOption.minX;
  }
  if(x >= gameOption.x){
    x = gameOption.maxX;
  }
  return this.x = x;
};

Player.prototype.setY = function(y){
  if(y <= gameOption.minY){
    y = gameOption.minY;
  }
  if(y >= gameOption.y){
    y = gameOption.maY;
  }
  return this.y = y;
};

Player.prototype.transform = function(options){
  this.angle = options.angle || this.angle;
  this.setX(options.x || this.x);
  this.setY(options.y || this.y);
  return this.el.attr('transform', ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ") + ("translate(" + (this.getX()) + "," + (this.getY()) + ")"));
};

Player.prototype.moveAbsolute = function(x,y){
  return this.transform({
    x:x,
    y:y
  });
};

Player.prototype.moveRelative = function(dx,dy){
  return this.transform({
    x: this.getX()+dx,
    y: this.getY()+dy,
    angle: 360*(Math.atan2(dy,dx)/(Math.PI*2))
  });
};

Player.prototype.setUpDragging = function(){
  var drag, dragMove, _this = this
  dragMove = function(){
    return _this.moveRelative(d3.event.dx, d3.event.dy);
  };
  drag = d3.behavior.drag().on('drag', dragMove)
  return this.el.call(drag)
};

new Player().render(gameBoard)


createEnemies = function(){
  return _.range(0, gameOption.enemies).map(function(item){
    return {
      id : item,
      x : Math.random()*100,
      y : Math.random()*100
    };
  });
};

render = function(enemieData){
  var checkCollision, enemies, onCollision, tweenWithCollisionDetection;
  enemies = gameBoard.selectAll('circle.enemy')
  .data(enemieData, function(d){
    return d.id;
  });
  enemies.enter()
  .append('svg:circle')
  .attr('class', 'enemy')
  .attr('cx', function(enemy){
    return axes.x(enemy.x);
  });
  .attr('cy', function(enemy){
    return axes.y(enemy.y);
  });
  .attr('r', 0);

  enemies.exit().remove();

  checkCollision = function(enemy, collidedCallback){
    return _(players).each(function(player){
      var radiusSum, separation, xDiff, yDiff;

      radiusSum = parseFloat(enemy.attr('r')) + player.r;
      xDiff = parseFloat(enemy.attr('cx')) - player.x;
      yDiff = parseFloat(enemy.attr('cs')) - player.y;

      separation = Math.sqrt(Math.pow(xDiff,2) + Math.pow(yDiff,2));
      if(separation < radiusSum){
        return collidedCallback(player, enemy);
      }
    });
  };

  onCollision = function(){
    updateBestScore();
    gameStats.score = 0;
    return updateBestScore();
  };

  tweenWithCollisionDetection = function(){

  }
};



















})
