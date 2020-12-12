/**
 * Dragger
 */

( function( root, factory ) {
  // module definition
  if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory( require('./boilerplate'), require('./anchor'), require('./path-command'), require('./vector') );
  } else {
    // browser global
    var Zdog = root.Zdog;
    Zdog.Axis = factory(Zdog, Zdog.Anchor, Zdog.PathCommand, Zdog.Vector);
  }
}( this, function factory(utils, Anchor, PathCommand, Vector) {

var command

var Axis = Anchor.subclass({
  stroke: 1,
  color: x,
  visible: true,
  t:1,
  front:{x:1}
});

Axis.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  delete this.scale
  // front
  this.front = new Vector( options.front || this.front );
  this.renderFront = new Vector( this.front );
  this.renderNormal = new Vector();

  switch (options.color) {
    case 'x':
      this.color = 'hsl(0, 100%, 50%)'
    case 'y':
      this.color = 'hsl(120, 100%, 50%)'
      break
    case 'z':
      this.color = 'hsl(240, 100%, 50%)'
      break
  }

  this.setCommand()
};

Axis.prototype.setCommand = function(){
    //renderOrigin is the object's "world' position
  var o = {x:this.renderOrigin.x,y:this.renderOrigin.y,z:this.renderOrigin.z}
  var r = this.parametrize( this.renderOrigin, this.renderFront, this.t);
  command = new PathCommand( 'line', [o, r]);
}

// ----- update ----- //

Axis.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  command.reset();
};

Axis.prototype.update = function() {
  // update self
  this.reset();
  // update children
  // this.children.forEach( function( child ) {
  //   child.update();
  // } );
  this.transform( this.translate, this.rotate );
};

Axis.prototype.transform = function( translation, rotation ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  command.transform( translation, rotation)
  // transform children
  // this.children.forEach( function( child ) {
  //   child.transform( translation, rotation, scale );
  // } );
};

// ----- render ----- //

Axis.prototype.render = function( ctx, renderer ) {
  if ( !this.visible ) { return; }
  var elem = this.getRenderElement( ctx, renderer );
  var isClosed = false
  var color = this.color;

  /*this.path2d =*/ renderer.renderPath( ctx, elem, [result], isClosed );
  renderer.stroke( ctx, elem, true, color, this.stroke /*, this.path2d*/);
  //renderer.fill( ctx, elem, this.fill, color, this.path2d);
  renderer.end( ctx, elem );
};

// Axis.prototype.renderGraphCanvas = function( ctx ) {
// };

Axis.prototype.parametrize = function(u, v, t) {
  //r = u + tv
  var V = new Vector(v).multiply(t)
  return V.add(u)
}

  return Axis;

} ) );