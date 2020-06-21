/*
 * pathfinger.js LICS Game Demo
 * Version 0.1.1, 09/22/2014
 * Written by Ed Arvelaez
 *
 * Small showcase of an HTML+JavaScript game
 */

var PathFinder = {} ;

( function ( )
{

//Reverses a horizonal path, adds the next position to it, and removes the first 
var reverseHorizontal = function ( pArray )
{
  var lastIndex = pArray.length - 1 ;
  if ( lastIndex > -1 )
  {
    pArray.push({ row : pArray[ lastIndex ].row , column : pArray[ lastIndex ].column + 1 }) ;
    pArray.splice( 0 , 1 ) ;
    pArray.reverse() ;
  }
} ;

//Reverses a vertical path, adds the next position to it, and removes the first 
var reverseVertical = function ( pArray )
{
  var lastIndex = pArray.length - 1 ;
  if ( lastIndex > -1 )
  {
    pArray.push({ row : pArray[ lastIndex ].row + 1 , column : pArray[ lastIndex ].column }) ;
    pArray.splice( 0 , 1 ) ;
    pArray.reverse() ; 
  }
} ;

//Returns an L shaped path from coordA to coordB or null if it does not exist.
//The path returned beings at coord A and does not contain coordB.
//Note: Undefined behavoir when coords A and B are the same or neighbours.
var getLPath = function ( pGrid , pCoordA , pCoordB )
{
  var horizontalStart , verticalStart , horizontalEnd , verticalEnd ,
      upperHorizontalOpen = true , lowerHorizontalOpen = true ,
      leftVerticalOpen = true , rightVerticalOpen = true ,
      upperHorizontalPath = [] , lowerHorizontalPath = [] ,
      leftVerticalPath = [] , rightVerticalPath = []  ,
      aIsHigher = false , aIsLeftMost = false ;
  
  //Return reference  
  var retArr = null ;
  
  verticalStart = pCoordB.row ;
  verticalEnd = pCoordA.row ;
  
  horizontalStart = pCoordB.column ;
  horizontalEnd = pCoordA.column ;
  
  if ( pCoordB.row > pCoordA.row )
  {
    verticalStart = pCoordA.row ;
    verticalEnd = pCoordB.row ;
    aIsHigher = true ;
  }
  
  if ( pCoordB.column > pCoordA.column )
  {
    horizontalStart = pCoordA.column ;
    horizontalEnd = pCoordB.column ;
    aIsLeftMost = true ;
  }

  var coordAValue = pGrid[ pCoordA.row ][ pCoordA.column ] ;
  var coordBValue = pGrid[ pCoordB.row ][ pCoordB.column ] ;

  pGrid[ pCoordA.row ][ pCoordA.column ] = 0 ;
  pGrid[ pCoordB.row ][ pCoordB.column ] = 0 ;


  //Check if the horizontal paths are open
  var ii ;
  ii = horizontalStart ;
  while (( ii < horizontalEnd + 1 ) && ( upperHorizontalOpen || lowerHorizontalOpen ))
  {
    upperHorizontalPath.push({ row : verticalStart , column : ii }) ;
    lowerHorizontalPath.push({ row : verticalEnd , column : ii }) ;
    
    if ( pGrid[ verticalStart ][ ii ] > 0 )
    {
      upperHorizontalOpen = false ;
    }
    
    if ( pGrid[ verticalEnd ][ ii ] > 0 )
    {
      lowerHorizontalOpen = false ;
    }
    
    ii ++ ;
  }
  
  if ( upperHorizontalOpen || lowerHorizontalOpen )
  {
    //Remove the positions of the horizontal paths
    //They will overlap the vertical path otherwise.
    upperHorizontalPath.pop() ;
    lowerHorizontalPath.pop() ;
    
    
    //Check the vertical paths
    ii = verticalStart ;
    while (( ii < verticalEnd + 1 ) && ( leftVerticalOpen || rightVerticalOpen ))
    {
      leftVerticalPath.push({ row : ii , column : horizontalStart }) ;
      rightVerticalPath.push({ row : ii , column : horizontalEnd }) ;
      
      if ( pGrid[ ii ][ horizontalStart ] > 0 )
      {
        leftVerticalOpen = false ;
      }
      
      if ( pGrid[ ii ][ horizontalEnd ] > 0 )
      {
        rightVerticalOpen = false ;
      }
      
      ii ++ ;
    }
  }
  
  if ( leftVerticalOpen || rightVerticalOpen )
  {
    leftVerticalPath.pop() ;
    rightVerticalPath.pop() ;
  }
  
  pGrid[ pCoordA.row ][ pCoordA.column ] = coordAValue ;
  pGrid[ pCoordB.row ][ pCoordB.column ] = coordBValue ;
  
  if ( aIsHigher && aIsLeftMost )
  {
    //upperHorizontal + rightVertical
    // OR
    //leftVertical + lowerHorizontal
    if ( upperHorizontalOpen && rightVerticalOpen )
    {
      retArr = [] ;

      Array.prototype.push.apply( retArr , upperHorizontalPath ) ;
      Array.prototype.push.apply( retArr , rightVerticalPath ) ;
    }
    else if ( leftVerticalOpen && lowerHorizontalOpen )
    {
      retArr = [] ;
      Array.prototype.push.apply( retArr , leftVerticalPath ) ;
      Array.prototype.push.apply( retArr , lowerHorizontalPath ) ;
    }
  }
  else if ( !aIsHigher && aIsLeftMost )
  {
    //rev leftVertical + upperHOrizontal
    // OR
    //lowerHorizontal + rev rightVertical
    
    if ( leftVerticalOpen && upperHorizontalOpen )
    {
      retArr = [] ;
      reverseVertical( leftVerticalPath ) ;
      Array.prototype.push.apply( retArr , leftVerticalPath ) ;
      Array.prototype.push.apply( retArr , upperHorizontalPath ) ;
    }
    else if ( lowerHorizontalOpen && rightVerticalOpen )
    {
      retArr = [] ;
      Array.prototype.push.apply( retArr , lowerHorizontalPath ) ;
      reverseVertical( rightVerticalPath ) ;
      Array.prototype.push.apply( retArr , rightVerticalPath ) ;
    }
  }
  else if ( aIsHigher && !aIsLeftMost )
  {
    //rev upperHorizontal + leftVertical
    // OR
    //rightVertical + rev lowerHorizontal
    if ( upperHorizontalOpen && leftVerticalOpen )
    {
      retArr = [] ;
      reverseHorizontal( upperHorizontalPath ) ;
      Array.prototype.push.apply( retArr , upperHorizontalPath ) ;
      Array.prototype.push.apply( retArr , leftVerticalPath ) ;
    }
    else if ( rightVerticalOpen && lowerHorizontalOpen )
    {
      retArr = [] ;
      Array.prototype.push.apply( retArr , rightVerticalPath ) ;
      reverseHorizontal( lowerHorizontalPath ) ;
      Array.prototype.push.apply( retArr , lowerHorizontalPath ) ;
    }
  }
  else
  {
    //revLowerHorizontal + rev leftVertical
    // OR
    //rev rightVertical + rev upperHorizontal
    if ( lowerHorizontalOpen && leftVerticalOpen )
    {
      retArr = [] ;
      reverseHorizontal( lowerHorizontalPath ) ;
      Array.prototype.push.apply( retArr , lowerHorizontalPath ) ;
      reverseVertical( leftVerticalPath ) ;
      Array.prototype.push.apply( retArr , leftVerticalPath ) ;
    }
    else if ( rightVerticalOpen && upperHorizontalOpen )
    {
      retArr = [] ;
      reverseVertical( rightVerticalPath ) ;
      Array.prototype.push.apply( retArr , rightVerticalPath ) ;
      reverseHorizontal( upperHorizontalPath ) ;
      Array.prototype.push.apply( retArr , upperHorizontalPath ) ;
    }
  }
  
  return retArr ;

} ;

//Check if coords A and B can be connected by a two turn path.
//A two turn path can be defined as a straight path and an L-shaped path connected.
PathFinder.getTwoTurnPath = function ( pGrid , pCoordA , pCoordB )
{
  var path = [] , lPath = [] , solved = false , trivial = false , ii = 0 ;
  var gridHeight = pGrid.length , gridWidth = pGrid[ 0 ].length ;
  var pathNode = null ;
  
  //if one beside eachother
  if (( pCoordA.column === pCoordB.column ) && (( pCoordA.row === pCoordB.row + 1 ) || ( pCoordA.row === pCoordB.row - 1 )))
  {
    solved = true ;
    trivial = true ;
    path.push({
      row : pCoordA.row ,
      column : pCoordA.column
    }) ;

    path.push({
      row : pCoordB.row ,
      column : pCoordB.column
    }) ;
  }
  else if (( pCoordA.row === pCoordB.row ) && (( pCoordA.column === pCoordB.column + 1 ) || ( pCoordA.column === pCoordB.column - 1 )))
  {
    solved = true ;
    trivial = true ;
    path.push({
      row : pCoordA.row ,
      column : pCoordA.column
    }) ;

    path.push({
      row : pCoordB.row ,
      column : pCoordB.column
    }) ;
  }
  else
  {
    //check for an L between them

    lPath = getLPath( pGrid , pCoordA , pCoordB ) ;
    if ( lPath !== null )
    {
      
      solved = true ;
      trivial = true ;

      Array.prototype.push.apply( path , lPath ) ;
      path.push({
        row : pCoordB.row ,
        column : pCoordB.column
      }) ;
    }
  }

  //try to your left,
  ii = pCoordA.column - 1 ;
  while (( ii > -1 ) && ( pGrid[ pCoordA.row ][ ii ] < 1 ) && ( ! solved ))
  {
    pathNode = { row : pCoordA.row , column : ii } ;
    path.push( pathNode ) ;
    lPath = getLPath( pGrid , pathNode , pCoordB ) ;

    if ( lPath !== null )
    {
      solved = true ;
    }

    ii -- ;
  }
  
  if ( ! solved )
  {
    path = [] ;
  }

  //try to your right
  ii = pCoordA.column + 1 ;
  while (( ii < gridWidth ) && ( pGrid[ pCoordA.row ][ ii ] < 1 ) && ( ! solved ))
  {
    pathNode = { row : pCoordA.row , column : ii } ;
    path.push( pathNode ) ;
    lPath = getLPath( pGrid , pathNode , pCoordB ) ;

    if ( lPath !== null )
    {
      solved = true ;
    }

    ii ++ ;
  }
  
  if ( ! solved )
  {
    path = [] ;
  }
  
  //try up
  ii = pCoordA.row - 1 ;
  while (( ii > -1 ) && ( pGrid[ ii ][ pCoordA.column ] < 1 ) && ( ! solved ))
  {
    pathNode = { row : ii , column : pCoordA.column } ;
    path.push( pathNode ) ;
    lPath = getLPath( pGrid , pathNode , pCoordB ) ;

    if ( lPath !== null )
    {
      solved = true ;
    }

    ii -- ;
  }
  
  if ( ! solved )
  {
    path = [] ;
  }
  
  //try down
  ii = pCoordA.row + 1 ;
  while (( ii < gridHeight ) && ( pGrid[ ii ][ pCoordA.column ] < 1 ) && ( ! solved ))
  {
    pathNode = { row : ii , column : pCoordA.column } ;
    path.push( pathNode ) ;
    lPath = getLPath( pGrid , pathNode , pCoordB ) ;

    if ( lPath !== null )
    {
      solved = true ;
    }

    ii ++ ;
  }
  
  
  if ( solved )
  {
    if ( ! trivial )
    {
      path.pop() ;
      Array.prototype.push.apply( path , lPath ) ;
      
      path.unshift({
        row : pCoordA.row ,
        column : pCoordA.column
      }) ;
      
      path.push({
        row : pCoordB.row ,
        column : pCoordB.column
      }) ;
    }
  }
  else
  {
    path = null ;
  }
  
  return path ;
} ;
  
})() ;
