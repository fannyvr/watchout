// start slingin' some d3 here


(function(){

  var gameOption, gameStats, axes, gameBoard, Player;

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

var gameUpdateScore = function(){
  d3.select('.current').text(gameStats.score.toString())
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






























})
