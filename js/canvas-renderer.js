/**
 * CanvasRenderer
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory();
  } else {
    // browser global
    root.Zdog.CanvasRenderer = factory();
  }
}( this, function factory() {

var CanvasRenderer = { isCanvas: true };

CanvasRenderer.begin = function( ctx ) {
  ctx.beginPath();
};

CanvasRenderer.move = function( ctx, elem, point, Path2D ) {
  Path2D.moveTo( point.x, point.y );
};

CanvasRenderer.line = function( ctx, elem, point, Path2D ) {
  Path2D.lineTo( point.x, point.y );
};

CanvasRenderer.bezier = function( ctx, elem, cp0, cp1, end, Path2D ) {
  Path2D.bezierCurveTo( cp0.x, cp0.y, cp1.x, cp1.y, end.x, end.y );
};

CanvasRenderer.closePath = function( ctx, Path2D ) {
  Path2D.closePath();
};

CanvasRenderer.setPath = function() {};

CanvasRenderer.renderPath = function( ctx, elem, pathCommands, isClosed ) {
  this.begin( ctx, elem );
  var newPath = new Path2D(); 
  pathCommands.forEach( function( command ) {
    command.render( ctx, elem, CanvasRenderer, newPath);
  } );
  if ( isClosed ) {
    this.closePath( ctx, newPath);
  }

  return newPath
};

CanvasRenderer.stroke = function( ctx, elem, isStroke, color, lineWidth, Path2D ) {
  if ( !isStroke ) {
    return;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke(Path2D);
};

CanvasRenderer.fill = function( ctx, elem, isFill, color, Path2D) {
  if ( !isFill ) {
    return;
  }
  ctx.fillStyle = color;
  ctx.fill(Path2D);
};

CanvasRenderer.end = function() {};

return CanvasRenderer;

} ) );
