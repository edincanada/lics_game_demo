/*
 * settingsscreen.js LICS Game Demo
 * Version 0.1.1, 09/22/2014
 * Written by Ed Arvelaez
 *
 * Small showcase of an HTML+JavaScript game
 */

( function ( )
{

var startButton , sizes , faces , settingsScreen , gameScreen , gameTable ;

var generateGame = function ( )
{
  var sizeOptions = sizes.options , faceOptions = faces.options ,
      selectedSize = sizeOptions[ sizes.selectedIndex ].value.toUpperCase() ,
      selectedFaceCount = parseInt( faceOptions[ faces.selectedIndex ].value ) ,
      gridSize ;

  if ( selectedSize === 'SMALL' )
  {
    gridSize = GridSize.Small ;
    GamePlay.startTime = StartTime.Small + 1 ;
  }
  else if ( selectedSize === 'MEDIUM' )
  {
    gridSize = GridSize.Medium ;
    GamePlay.startTime = StartTime.Medium + 1 ;
  }
  else
  {
    gridSize = GridSize.Large ;
    GamePlay.startTime = StartTime.Large + 1 ;
  }

  GamePlay.generateGame( gameTable , selectedFaceCount , gridSize.rows , gridSize.columns ) ;

  settingsScreen.style.display = 'none' ;
  gameScreen.style.display = 'block' ;
} ;

Util.addEventListener(
  window ,
  function ( )
  {
    startButton = document.getElementById( 'spanStart' ) ;
    sizes = document.getElementById( 'sltSize' ) ;
    faces = document.getElementById( 'sltFaces' ) ;
    settingsScreen = document.getElementById( 'settingsScreen' ) ;
    gameScreen = document.getElementById( 'gameScreen' ) ;
    gameTable = document.getElementById( 'tblBoard' ) ;
    
    Util.addEventListener( startButton , generateGame , 'click' ) ;
  } ,
  'load'
) ;
})() ;
