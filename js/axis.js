/**
 * Dragger
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./canvas-renderer'), require('./svg-renderer'), require('./vector') );
  } else {
    // browser global
    root.Zdog.Axis = factory();
  }
}( this, function factory(CanvasRenderer, SvgRenderer, Vector) {

  function Axis( options ) {
    this.create( options || {} );
  }

  Axis.prototype.create = function( options ) {
    this.vector = new Vector({x: options.x, y: options.y, z: options.z});
    this.color = options.color
    // origin
    this.origin = new Vector();
    this.renderOrigin = new Vector();
    // set defaults & options
    //utils.extend( this, this.constructor.defaults );
    //this.setOptions( options );
  
    // transform
    // this.translate = new Vector( options.translate );
    // this.rotate = new Vector( options.rotate );
    // this.scale = new Vector( onePoint ).multiply( this.scale );

  
    if ( this.addTo ) {
      this.addTo.addChild( this );
    }
  };

  Axis.prototype.transform = function( translation, rotation) {
    this.renderOrigin.transform( translation, rotation );
  };

  Axis.prototype.renderCanvas = function(ctx) {
    var projection = {x:0, y:0};
    CanvasRenderer.move( ctx, null, projection)
    
    var projectionEnd = {x:1, y:4};
    CanvasRenderer.line( ctx, null, projectionEnd)
  };

  return Axis;

} ) );