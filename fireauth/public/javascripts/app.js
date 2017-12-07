angular.module('comment', [])
.controller('MainCtrl', [
  '$scope',
  '$http',
  function($scope, $http){
    $scope.teams = [{name:"BYU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0, 
image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/BYU_Cougars_logo.svg/1200px-BYU_Cougars_logo.svg.png"},
      {name:"BSU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0, 
image:"https://brandstandards.boisestate.edu/wp-content/uploads/2012/10/PrmLogo_on_wht_RGB.png"},
      {name:"LSU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0, 
image:"http://beerpulse.com/wp-content/uploads/2016/05/LSU-Tigers-logo.jpg"},
      {name:"USC",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0, 
image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/USC_Trojans_logo.svg/2000px-USC_Trojans_logo.svg.png"},
      {name:"UofU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Utah_Utes_-_U_logo.svg/1121px-Utah_Utes_-_U_logo.svg.png"},

      {name:"FSU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://www.underconsideration.com/brandnew/archives/fsu_seminoles_logo_detail.png"},
      {name:"OU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/OU-Logo.svg/2000px-OU-Logo.svg.png"},
      {name:"MSU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://cabs.msu.edu/toolkit/images/helmet/gif/Spartan-helmet-Green-150-pxls.gif"},
      {name:"ASU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://seeklogo.com/images/A/arizona-state-sun-devils-logo-8EEDD4C50D-seeklogo.com.png"},

      {name:"USU",score:1000,ratings:[],homewins:0,homelosses:0,awaywins:0,awaylosses:0,wins:0,losses:0,
image:"https://pbs.twimg.com/media/C_ENYFXUMAAl499.jpg"}]
    $scope.games = []
    $scope.test = 'Hello world!';
    $scope.number = 5;


teamScore = function($scope, name) {
  result = 0;
  $scope.teams.forEach(function(team) {
    if(team.name == name){
      result = team.score;
    }
  });
  return result;
};

teamExists = function(name) {
  exists = false;
  $scope.teams.forEach(function(team) {
    if(team.name == name){
      exists = true;
    }
  });
  if(exists){
    return true;
  }
  else {
    console.log(name + " is not one of the teams");
    return false;
  }
}

gameRating = function(score1, score2, rating2) {
  if(score1 < score2){
    r = score1 / (score2 - 1);
  }
  else {
    r = score2 / (score1 - 1);
  }
  endscore = 125 + (475 * ((Math.sin(Math.min(1,(1-r)/.5) * 0.4 * Math.PI))/(Math.sin(0.4 * Math.PI))))
  if(score1 < score2){
    return rating2 - endscore;
  }
  else {
    return rating2 + endscore;
  }
};

removeRecord = function($scope) {
  $scope.teams.forEach(function(team) {
    team.wins = 0;
    team.losses = 0;
    team.homewins = 0;
    team.homelosses = 0;
    team.awaywins = 0;
    team.awaylosses = 0;
  });
}
  
getScores = function($scope){
  removeRecord($scope);
  $scope.games.forEach(function(game) {
    $scope.teams.forEach(function(team) {
      if(team.name == game.team1){
        team.ratings.push(gameRating(game.score1, game.score2, teamScore($scope, game.team2)));
        if(game.score1 < game.score2) {
          team.homelosses++;
          team.losses++;
        }
        else {
          team.homewins++;
          team.wins++;
        }
      }
      if(team.name == game.team2){
        team.ratings.push(gameRating(game.score2, game.score1, teamScore($scope, game.team1)));
        if(game.score1 < game.score2) {
          team.awaywins++;
          team.wins++;
        }
        else {
          team.awaylosses++;
          team.losses++;
        }
      }
    });
  });
};

averageScores = function($scope) {
  $scope.teams.forEach(function(team) {
    score = 0;
    number = 0;
    team.ratings.forEach(function(rating) {
      score += rating;
      number++;
    });
    if(number == 0) {
      team.score = 1000;
    }
    else {
      team.score = score / number;
    }
    team.rating = []
  }); 
};

nextRank = function($scope) {
  $scope.rank++;
}

getGames = function() {
  //$http.delete('/games').success(function(data) {
    //console.log(data);
    //console.log("THIS SHOULD NOT PRINT");
  //});
  $http.get('/games').success(function(data) {
    $scope.games = [];
    for(i = 0; i < data.length; i++){
      $scope.games.push(data[i]);
    }
    iterations($scope, 20);
  });
}

$scope.addGame = function() {
  if($scope.Home == $scope.Away || $scope.Homescore == $scope.Awayscore 
|| !teamExists($scope.Home) || !teamExists($scope.Away) || $scope.Homescore == 1 
|| $scope.Awayscore == 1 || $scope.Homescore < 0 || $scope.Awayscore < 0) {
    $scope.Home = "";
    $scope.Away = "";
    $scope.Homescore = 0;
    $scope.Awayscore = 0;
    return;
  }
  console.log("Adding Game");
  game = {team1:$scope.Home,team2:$scope.Away,score1:$scope.Homescore,score2:$scope.Awayscore}
  $http.post('/games', game).success(function(data) {
    getGames();
  });
  iterations($scope, 20);
  $scope.Home = "";
  $scope.Away = "";
  $scope.Homescore = 0;
  $scope.Awayscore = 0;
}

iterations = function($scope, number) {
  $scope.teams.forEach(function(team) {
    team.score=1000;
    team.ratings=[];
  });
  for(i= 0; i < number; i++) {
    getScores($scope);
    averageScores($scope);
  }
  $scope.teams.forEach(function(team) {
    team.score = Math.round(team.score);
  });
  $scope.rank = 0;
};

getGames();

}]);