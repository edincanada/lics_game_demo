Util = { } ;

( function ( )
{
  
var _getClasses = function ( pElement )
{
  var result = [ ] ;
  var htmlClass = pElement.className , classCount ;
  if ( htmlClass && htmlClass.length > 0 )
  {
    var htmlClasses = htmlClass.split( ' ' ) ;
    classCount = htmlClasses.length ;
    for ( var ii = 0 ; ii < classCount ; ii++ )
    {
      if ( htmlClasses[ ii ].length > 0 )
      {
        result.push( htmlClasses[ ii ] ) ;
      }
    }
  }

  return result ;
} ;

Util.removeClass = function ( pElement , pClass )
{
  var classes = _getClasses( pElement ) ;
  
  while (( classes.length > 0 ) && ( classes.indexOf( pClass ) > -1 ))
  {
    classes.splice( classes.indexOf( pClass ) , 1 ) ;
  }
  
  pElement.className = classes.join( ' ' ) ;
} ;


Util.clearArray = function ( pArray )
{
  while ( pArray.length > 0 )
  {
    pArray.pop() ;
  }
} ;

Util.addEventListener = function ( pElement , pListener , pEventName) { } ;
Util.removeEventListener = function ( pElement , pListener , pEventName) { } ;

if ( window.addEventListener )
{
  Util.addEventListener = function ( pElement , pListener , pEventName )
  {
    pElement.addEventListener( pEventName , pListener , false ) ;
  } ;
}
else if ( window.attachEvent )
{
  Util.addEventListener = function ( pElement , pListener , pEventName )
  {
    pElement.attachEvent( 'on' + pEventName , pListener ) ;
  } ;
}

if ( window.removeEventListener )
{
  Util.removeEventListener = function ( pElement , pListener , pEventName )
  {
    pElement.removeEventListener( pEventName , pListener ) ;
  } ;
}
else if ( window.detachEvent )
{
  Util.removeEventListener = function ( pElement , pListener , pEventName )
  {
    pElement.detachEvent( 'on' + pEventName , pListener ) ;
  } ;
}

})() ;