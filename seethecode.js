
(function ( )
{

var sourceCodeWindow = null ;
var sltSeeTheCode = null ;
var seeTheCode = function ( )
{
  Util.addEventListener(
      sltSeeTheCode ,
      function ( )
      {
        var selectedIndex = sltSeeTheCode.selectedIndex ;

        if ( selectedIndex > 0 )
        {
          if ( sourceCodeWindow == null || sourceCodeWindow.location == null )
          {
            sourceCodeWindow =
              window.open(
              sltSeeTheCode.options[ selectedIndex ].value ,
              'SourceCode'
            ) ;
          }
          else
          {
            sourceCodeWindow.location.href =
              sltSeeTheCode.options[ selectedIndex ].value ;

            sourceCodeWindow.focus() ;
          }
        }
      } ,
      'change'
    ) ;
  
  } ;
  
Util.addEventListener(
  window ,
  function ( )
  {
    sltSeeTheCode = document.getElementById( 'sltSeeTheCode' ) ;
    seeTheCode() ;
  } ,
  'load'
) ;
  
  })() ;