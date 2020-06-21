/*
 * actionengine.js LICS Game Demo
 * Version 0.1.1, 09/22/2014
 * Written by Ed Arvelaez
 *
 * Small showcase of an HTML+JavaScript game
 */

ActionState = {
  Ready : 0 ,
  Running : 1 ,
  PauseRequested : 2 ,
  Paused : 3 ,
  AbortRequested : 4 ,
  Aborted : 5 ,
  Finished : 6
} ;

var ActionEngine = null , Action = null , ShowPathAction = null ;

( function ( )
{
  
ActionEngine = function ( pInterval )
{
  this.actions = [] ;
  this.finishedActionIndices = [] ;
  this.timeoutId = null ;
  this.interval = pInterval ;


  this.start = function ( )
  {
    if ( this.timeoutId === null )
    {
      this.run() ;
    }
  } ;

  this.stop = function ( )
  {
    if ( this.timeoutId !== null )
    {
      window.clearTimeout( this.timeoutId ) ;
    }
  } ;

  
  this.run = function ( )
  {
    var startTime = ( new Date()).getTime() ,
        actionCount = this.actions.length , ii , currentAction ;

    for ( ii = 0 ; ii < actionCount ; ii ++ )
    {
      currentAction = this.actions[ ii ] ;

      if ( currentAction.state === ActionState.Ready )
      {
        currentAction.initialize() ;
        currentAction.state = ActionState.Running ;
      }

      if ( currentAction.state === ActionState.PauseRequested )
      {
        currentAction.state = ActionState.Paused ;
      }
      else if ( currentAction.state === ActionState.Running )
      {
        currentAction.step() ;
      }

      if ( currentAction.state === ActionState.AbortRequested )
      {
        currentAction.state = ActionState.Aborted ;
        this.finishedActionIndices.push( ii ) ;
      }
      else if ( currentAction.done())
      {
        currentAction.state = ActionState.Finished ;
        currentAction.finalize() ;
        this.finishedActionIndices.push( ii ) ;
      }
    }

    var actionFinishedIndex ;
    while ( this.finishedActionIndices.length > 0 )
    {
      actionFinishedIndex = this.finishedActionIndices.pop() ;
      this.actions.splice( actionFinishedIndex , 1 ) ;
    }

    var elapsedTime ;
    if ( this.actions.length > 0 )
    {
      elapsedTime = ( new Date()).getTime() - startTime ;

      if ( elapsedTime >= this.interval )
      {
        this.timeoutId = window.setTimeout(
          (function ( pEngine )
          {
            return function ( )
            {
              pEngine.run() ;
            } ;
          })( this ) ,
          this.interval - elapsedTime
        ) ;
      }
      else
      {
        this.timeoutId = window.setTimeout(
          (function ( pEngine )
          {
            return function ( )
            {
              pEngine.run() ;
            } ;
          })( this ) ,
          this.interval
        ) ;
      }
    }
    else
    {
      this.timeoutId = null ;
    }
  } ;
} ;

var _handlerCreator = function ( pThis , pHandler )
{
  return function ( )
  {
    return pHandler( pThis ) ;
  } ;
} ;

Action = function (

  pInitialize ,
  pStep ,
  pFinalize ,
  pDone
)
{
  this.state = ActionState.Ready ;
  
  this.initialize = pInitialize ? _handlerCreator( this , pInitialize ) : function ( ) { } ;
  this.step = pStep ? _handlerCreator( this , pStep ) : function ( ) { } ;
  this.finalize = pFinalize ? _handlerCreator( this , pFinalize ) : function ( ) { } ;
  this.done = pDone ? _handlerCreator( this , pDone ) : function ( ) { return true ; } ;
} ;

ShowPathAction = function ( pTime , pPath , pTable )
{
  this.base = Action ;
  
  this.base(
    function ( pAction )
    {
      pAction.counter = pTime ;
      pAction.path = pPath ;
      pAction.table = pTable ;
      pAction.colored = false ;
    } ,
    
    function ( pAction )
    {
      var ii ;
      
      if (( pAction.counter > 0 ) && ( ! pAction.colored ))
      {
        for ( ii = 0 ; ii < pAction.path.length ; ii ++ )
        {
          pAction.table.rows[ pAction.path[ ii ].row ].cells[ pAction.path[ ii ].column ].className = 'path' ; 
        }
      }
      
      pAction.colored = true ;
      pAction.counter -- ;
    } ,
    function ( pAction ) 
    {
      var ii ;

      for ( ii = 0 ; ii < pAction.path.length ; ii ++ )
      {
        pAction.table.rows[ pAction.path[ ii ].row ].cells[ pAction.path[ ii ].column ].className = 'portrait' ; 
      }
      
      pAction.counter = pTime ;
    } ,
    
    function ( pAction )
    {
      return ( pAction.counter < 1 ) ;
    }
  ) ;
} ;
  
  
})() ;
