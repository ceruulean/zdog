/**
 * Axis
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

var TAU = utils.TAU;

var Axis = Anchor.subclass({
  stroke: 1,
  color: 'hsl(0, 100%, 50%)',
  visible: true,
  t:1,
  front:{x:1}
});

Axis.prototype.create = function( options ) {
  Anchor.prototype.create.call( this, options );
  // front
  this.front = new Vector( options.front || this.front );
  this.renderFront = new Vector( this.front );
  this.renderNormal = new Vector();

  switch (options.color) {
    case 'x':
      this.color = 'hsl(0, 100%, 50%)'
      break;
    case 'y':
      this.color = 'hsl(120, 100%, 50%)'
      break
    case 'z':
      this.color = 'hsl(240, 100%, 50%)'
      break
  }

  this.setCommands()
  this.updatePathCommands();

};

Axis.prototype.setCommands = function(){
  this._T = this.t
    //renderOrigin is the object's "world' position
  this.path = [
    {x:this.renderOrigin.x,y:this.renderOrigin.y,z:this.renderOrigin.z}, // start at 1st point
    this.parametrize( this.renderOrigin, this.renderFront, this.t),
  ];
}

// ----- update ----- //

Axis.prototype.reset = function() {
  this.renderOrigin.set( this.origin );
  this.renderFront.set( this.front );
  this.pathCommands.forEach(function(c){
    c.reset();
  })
};

Axis.prototype.update = function() {
  // update self
  this.reset();
  // update children
  // this.children.forEach( function( child ) {
  //   child.update();
  // } );
  if (this._T != this.t){ // t has been changed
    this.setCommands();
  }
  this.transform( this.translate, this.rotate );
};

Axis.prototype.transform = function( translation, rotation, scale ) {
  // calculate render points backface visibility & cone/hemisphere shapes
  this.renderOrigin.transform( translation, rotation, scale );
  this.renderFront.transform( translation, rotation, scale );
  this.renderNormal.set( this.renderOrigin ).subtract( this.renderFront );
  // transform points
  this.pathCommands.forEach(function(c){
    c.transform( translation, rotation, scale)
  })
  // transform children
  // this.children.forEach( function( child ) {
  //   child.transform( translation, rotation, scale );
  // } );
};


Axis.prototype.updatePathCommands = function() {
  var start = new PathCommand( 'move', [this.path[0]], null );
  this.pathCommands = [start, new PathCommand( 'line', [this.path[1]], start.endRenderPoint )]
};

// ----- render ----- //

Axis.prototype.render = function( ctx, renderer ) {
  if ( !this.visible ) { return; }
  this.renderPath( ctx, renderer )
};

Axis.prototype.renderPath = function( ctx, renderer ) {
  var elem = this.getRenderElement( ctx, renderer );
  var isClosed = true
  var color = this.color;
  renderer.renderPath( ctx, elem, this.pathCommands, isClosed );
  renderer.stroke( ctx, elem, true, color, this.stroke );
  renderer.end( ctx, elem );
};

Axis.prototype.getRenderElement = function( ctx, renderer ) {
  if ( !renderer.isSvg ) {
    return;
  }
  if ( !this.svgElement ) {
    // create svgElement
    this.svgElement = document.createElementNS( svgURI, 'path' );
    this.svgElement.setAttribute( 'stroke-linecap', 'round' );
    this.svgElement.setAttribute( 'stroke-linejoin', 'round' );
  }
  return this.svgElement;
};

Axis.prototype.getPoints = function(){
  return [this.pathCommands[0].renderPoints[0],  this.pathCommands[1].renderPoints[0]]
}

Axis.prototype.parametrize = function(u, v, t) {
  //r = u + tv
  var V = new Vector(v).multiply(t)
  return V.add(u)
}

  return Axis;

} ) );