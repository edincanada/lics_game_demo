/*
 * gameplay.js LICS Game Demo
 * Version 0.1.1, 09/22/2014
 * Written by Ed Arvelaez
 *
 * Small showcase of an HTML+JavaScript game
 */

var GridSize = {
  Small : {
    rows : 7 ,
    columns : 6
  } ,
  
  Medium : {
    rows : 8 ,
    columns : 10 
  } ,
  
  Large : {
    rows : 10 ,
    columns : 14
  }
} ;

var StartTime = {
  Small : 60 ,
  Medium : 80 ,
  Large : 120
} ;

var GameOver = {
  TimeOut : 0 ,
  Win : 1
} ;

var GamePlay = {} ;

GamePlay.grid = [] ;
GamePlay.nameGrid = [] ;
GamePlay.table = null ;
GamePlay.names = null ;
GamePlay.positionArray = { } ;
GamePlay.faceCount = 16 ;
GamePlay.gridSize = {
  rows : GridSize.Large.rows ,
  columns : GridSize.Large.columns
} ;

GamePlay.points = 0 ;
GamePlay.pointsElement = null ;
GamePlay.pointsPerHit = 100 ;
GamePlay.multiplier = 1 ;
GamePlay.multiplierDuration = 3 ;
GamePlay.startTime = 60 ; //Changes with grid size
GamePlay.timeBonus = 100 ; //Bonus for each second of time left
GamePlay.winBonus = 1000 ; //Bonus for winning

( function ( )
{

var removeAllChildren = function ( pElement )
{
  while ( pElement.hasChildNodes())
  {
    pElement.removeChild( pElement.firstChild ) ;
  }
} ;

var randomBetween = function ( pLower , pUpper )
{
  return Math.floor(( Math.random() * pUpper) + pLower ) ;
} ;

GamePlay.names = [
  "portrait0" ,
  "portrait1" ,
  "portrait2" ,
  "portrait3" ,
  "portrait4" ,
  "portrait5" ,
  "portrait6" ,
  "portrait7" ,
  "portrait8" ,
  "portrait9" ,
  "portrait10" ,
  "portrait11" ,
  "portrait12" ,
  "portrait13" ,
  "portrait14" ,
  "portrait15" ,
  "portrait16"
] ;

//Creates a grid with cards for the game.
//The height and width must not include the empty border around the board with cards.
//Name count refers to how many kinds of cards there will be
GamePlay.generateGameGrid = function (
  pTable ,
  pGrid ,
  pNameCount ,
  pNamesGrid ,
  pPositionArray ,
  pHeight ,
  pWidth
)
{
  removeAllChildren( pTable ) ;
  Util.clearArray( pGrid ) ;
  Util.clearArray( pPositionArray ) ;
  Util.clearArray( pNamesGrid ) ;

  var namesArr , gridArr , namesToUse ;
  
  namesToUse = GamePlay.names.slice( 0 , pNameCount ) ;

  //Generate grids and table
  var actualHeight = pHeight + 2 , actualWidth = pWidth + 2 , ii , jj , row , cell ;
  for ( ii = 0 ; ii < actualHeight ; ii ++ )
  {
    namesArr = [] ;
    gridArr = [] ;
    row = pTable.insertRow(pTable.rows.length) ;
    for ( jj = 0 ; jj < actualWidth ; jj ++ )
    {
      cell = row.insertCell(row.cells.length) ;
      cell.innerHTML = '&nbsp;' ;
      cell.className = 'portrait' ;
      
      cell.row = ii ;
      cell.column = jj ;
      
      gridArr.push( 0 ) ;
      namesArr.push( '' ) ;
    }
    
    pGrid.push( gridArr ) ;
    pNamesGrid.push( namesArr ) ;
  }

  //Figure out places to fill
  var places = [] ;
  for ( ii = 1 ; ii < actualHeight - 1 ; ii ++ )
  {
    for ( jj = 1 ; jj < actualWidth - 1 ; jj ++ )
    {
      places.push({
        element : null ,
        row : ii ,
        column : jj
      }) ;
    }
  }
  
  //Create a hash for arrays of positions, sorted by name
  for ( ii = 0 ; ii < namesToUse.length ; ii ++ )
  {
    pPositionArray[ namesToUse[ ii ]] = [] ;
  }
  
  
  
  var name , random , place ;
  
  while ( places.length > 0 )
  {
    ii = 0 ;
    while (( ii < namesToUse.length ) && ( places.length > 0 ))
    {
      name = namesToUse[ ii ] ;
      
      random = randomBetween( 0 , places.length ) ;
      place = places[ random ] ;

      cell = pTable.rows[ place.row ].cells[ place.column ] ;
      cell.className += ' ' + name ;
      place.element = cell ;
      
      //pick the table element.
      //assign it to the places array

      pNamesGrid[ place.row ][ place.column ] = name ;
      pGrid[ place.row ][ place.column ] = 1 ;
      pPositionArray[ name ].push( place ) ;

      //Remove the place from the places array
      places.splice( random , 1 ) ;

      //Repeat.
      random = randomBetween( 0 , places.length ) ;
      place = places[ random ] ;

      //pick the table element.
      //assign it to the places array
      cell = pTable.rows[ place.row ].cells[ place.column ] ;
      cell.className += ' ' + name ;
      place.element = cell ;

      pNamesGrid[ place.row ][ place.column ] = name ;
      pGrid[ place.row ][ place.column ] = 1 ;
      pPositionArray[ name ].push( place ) ;

      //Remove the place from the places array
      places.splice( random , 1 ) ;
      
      ii ++ ;
    }
  }
  //create a grid with height + 1 and width + 1.
} ;

GamePlay.selectedTile = null ;

var TD_ELEMENT = 'TD' , SELECTED_CSS = 'selected' ;

var showPathEngine = new ActionEngine( 100 ) ; 

//This action takes care of the multiplier ticking.
//It must be places in a second-wise ticker engine.
var multiplierAction = new Action(
  function ( pAction )
  {
    pAction.duration = 3 ;
    pAction.hits = 0 ;
    pAction.multiplier = 1 ;
  } ,
  
  function ( pAction )
  {
    if ( pAction.multiplier > 1 )
    {
      
      if ( pAction.duration > -1 )
      {
        pAction.duration -- ;
      }
      
      if ( pAction.duration < 0 )
      {
        if ( pAction.multiplier > 1 )
        {
          pAction.multiplier -- ;
          pAction.duration = GamePlay.multiplierDuration - 1 ;
        }
      }
      
      pAction.element.innerHTML = 'x' + pAction.multiplier ;
      
      if ( pAction.multiplier > 1 )
      {
        pAction.timeElement.innerHTML = '' + pAction.duration ;
      }
      else
      {
        pAction.timeElement.innerHTML = '' ;
      }

      if ( pAction.multiplier < 2 )
      {
        pAction.element.className = 'multiplierTimesOne' ;
      }
      else if ( pAction.multiplier === 2 )
      {
        pAction.element.className = 'multiplierTimesTwo' ;
      }
      else if ( pAction.multiplier === 3 )
      {
        pAction.element.className = 'multiplierTimesThree' ;
      }
      else if ( pAction.multiplier > 3 )
      {
        pAction.element.className = 'multiplierTimesFour' ;
      }
    }
    
  } ,
  
  function ( pAction ) { } ,
  function ( pAction ) { return false ; }
) ;

multiplierAction.handleHit = function ( )
{
  if ( this.multiplier < 5 )
  {
    this.multiplier ++ ;
  }
  
  this.duration = GamePlay.multiplierDuration ;
  
} ;

var victory = function ( )
{
  var rows = GamePlay.grid.length ;
  var columns = GamePlay.grid[ 0 ].length ;
  var winFlag = true ;

  var ii = 0 , jj = 0 ;
  while (( ii < rows ) && ( winFlag ))
  {
    while (( jj < columns ) && ( winFlag ))
    {
      winFlag = ( GamePlay.grid[ ii ][ jj ] === 0 ) ;
      jj ++ ;
    }
    jj = 0 ;
    ii ++ ;
  }

  return winFlag ;
} ;

var onTileClicked = function ( pEvent )
{
  var tileTd = null ;
  var selectedTile = GamePlay.selectedTile ;

  if ( pEvent.target && ( pEvent.target.nodeName.toUpperCase() === TD_ELEMENT ) && ( pEvent.target !== selectedTile ))
  {  
    tileTd = pEvent.target ;

    if ( GamePlay.grid[ tileTd.row ][ tileTd.column ] < 1 )
    {
      //Deselect
      if ( GamePlay.selectedTile )
      {
        Util.removeClass( GamePlay.selectedTile , SELECTED_CSS ) ;
      }
      selectedTile = null ;
      GamePlay.selectedTile = null ;
    }
    else if ( selectedTile === null )
    { 
      selectedTile = tileTd ;
      GamePlay.selectedTile = tileTd ;
      GamePlay.selectedTile.className += ' ' + SELECTED_CSS ;
    }
    else
    {
      var selectedName = GamePlay.nameGrid[ selectedTile.row ][ selectedTile.column ] ;
      var tileTdName = GamePlay.nameGrid[ tileTd.row ][ tileTd.column ] ;
      
      var coordA = {
        row : selectedTile.row ,
        column : selectedTile.column
      } ;
      
      var coordB = {
        row : tileTd.row ,
        column : tileTd.column
      } ;

      if (( tileTdName === selectedName ) && ( path !== null ))
      {
        var path = PathFinder.getTwoTurnPath( GamePlay.grid , coordA , coordB ) ;
        //Success
        
        if ( path !== null )
        {
          //AS Debug:
          GamePlay.nameGrid[ selectedTile.row ][ selectedTile.column ] = '' ;
          GamePlay.nameGrid[ tileTd.row ][ tileTd.column ] = '' ;

          GamePlay.grid[ selectedTile.row ][ selectedTile.column ] = 0 ;
          GamePlay.grid[ tileTd.row ][ tileTd.column ] = 0 ;

          var showPathAction = new ShowPathAction( 4 , path , GamePlay.table ) ;
          
          GamePlay.points += ( GamePlay.pointsPerHit * multiplierAction.multiplier ) ;
          GamePlay.pointsElement.innerHTML = '' + GamePlay.points ;
          
          multiplierAction.handleHit() ;

          showPathEngine.actions.push( showPathAction ) ;
          showPathEngine.start() ;

          //Deselect
          Util.removeClass( GamePlay.selectedTile , SELECTED_CSS ) ;
          selectedTile = null ;
          GamePlay.selectedTile = null ;
          
          if ( victory())
          {
            onGameOver( GameOver.Win ) ;
          }
        }
        else
        {
          Util.removeClass( GamePlay.selectedTile , SELECTED_CSS ) ;
          selectedTile = null ;
          GamePlay.selectedTile = null ;
        }
      }
      else
      {
        //Deselect
        Util.removeClass( GamePlay.selectedTile , SELECTED_CSS ) ;
        selectedTile = null ;
        GamePlay.selectedTile = null ;
      }
    }
  }
} ;
 
var onGameOver = function ( pType )
{
  multiplierAction.state = ActionState.AbortRequested ;
  timerAction.state = ActionState.AbortRequested ;
  
  var gameScreen = document.getElementById( 'gameScreen' ) ;
  var endOfGameScreen = document.getElementById( 'endOfGameScreen' ) ;
  var titleElement = document.getElementById( 'divGameOver' ) ;
  var winInfoElement = document.getElementById( 'winInfo' ) ;
  var endPointsElement = document.getElementById( 'spanEndPoints' ) ;
  var timeLeftElement = document.getElementById( 'timeLeft' ) ;
  var timeBonusElement = document.getElementById( 'timeBonus' ) ;
  var winBonusElement = document.getElementById( 'victoryBonus' ) ;
  var totalElement = document.getElementById( 'total' ) ;
  
  gameScreen.style.display = 'none' ;
  
  var timeBonus = 0 , victoryBonus = 0 ;
  
  if ( pType === GameOver.Win )
  {
    timeBonus = timerAction.time * GamePlay.timeBonus ;
    titleElement.innerHTML = 'You finished. Well done!' ;
    winInfoElement.style.visibility = 'visible' ;
    endPointsElement.innerHTML = '' + GamePlay.points ;
    timeLeftElement.innerHTML = '' + timerAction.time ;
    timeBonusElement.innerHTML = '' + timeBonus ;
    victoryBonus = GamePlay.winBonus ;
    winBonusElement.innerHTML = '' + victoryBonus ;
  }
  else
  {
    titleElement.innerHTML = 'Game Over' ;
    winInfoElement.style.visibility = 'hidden' ;
  }

  totalElement.innerHTML = '' + ( GamePlay.points + timeBonus + victoryBonus ) ;  
  endOfGameScreen.style.display = 'block' ;

} ;
 
var clockEngine = new ActionEngine( 1000 ) ;
var timerAction = new Action(
  function ( pAction )
  {
    pAction.time = GamePlay.startTime ;
    pAction.element.innerHTML = pAction.time ;
  } ,
  
  function ( pAction )
  {
    pAction.time -- ;
    pAction.element.innerHTML = pAction.time ;
    //Update the element
  } ,
  
  function ( pAction )
  {
    onGameOver( GameOver.TimeOut ) ;
  } ,
  
  function ( pAction )
  {
    return ( pAction.time < 1 ) ;
  }
  
) ;

var tableListenerAdded = false ;
GamePlay.generateGame = function ( pGameTable , pFaceCount , pRows , pColumns )
{
  GamePlay.points = 0 ;
  GamePlay.table = pGameTable ;
  GamePlay.gridSize.rows = pRows ;
  GamePlay.gridSize.columns = pColumns ;
  GamePlay.faceCount = pFaceCount ;
  GamePlay.pointsElement = document.getElementById( 'spanPoints' ) ;
  GamePlay.pointsElement.innerHTML = '' + GamePlay.points ;
  
  var multiplierElement = document.getElementById( 'spanMultiplier' ) ;
  multiplierElement.innerHTML = 'x1' ;
  multiplierElement.className = 'multiplierTimesOne' ;
  
  var multiplierTimer = document.getElementById( 'spanMultiplierTime' ) ;
  multiplierTimer.innerHTML = '' ;
  
  GamePlay.generateGameGrid(
    GamePlay.table ,
    GamePlay.grid ,
    GamePlay.faceCount ,
    GamePlay.nameGrid ,
    GamePlay.positionArray ,
    GamePlay.gridSize.rows ,
    GamePlay.gridSize.columns
  ) ;
  
  if ( ! tableListenerAdded )
  {
    tableListenerAdded = true ;
    Util.addEventListener(
      GamePlay.table ,
      function ( pEvent )
      {
        //Here we will manage clicks.
        onTileClicked( pEvent ) ;
      } ,
      'click'
    ) ;
  }
  
  timerAction.element = document.getElementById( 'spanTime' ) ;
  multiplierAction.element = document.getElementById( 'spanMultiplier' ) ;
  multiplierAction.timeElement = document.getElementById( 'spanMultiplierTime' ) ;
  
  clockEngine.actions.push( timerAction ) ;
  clockEngine.actions.push( multiplierAction ) ;

  clockEngine.start() ;
  //Clock gets started here
  
  var playAgain = document.getElementById( 'spanAgain' ) ;
  
  Util.addEventListener(
    playAgain ,
    function ( pEvent )
    {
 
      var endOfGameScreen = document.getElementById( 'endOfGameScreen' ) ;
      var settingsScreen = document.getElementById( 'settingsScreen' ) ;
      
      endOfGameScreen.style.display = 'none' ;
      settingsScreen.style.display = 'block' ;
      
      timerAction.state = ActionState.Ready ;
      multiplierAction.state = ActionState.Ready ;
      
    } ,
    'click'
  ) ;
} ;

})() ;
