/*
 * ${HEADER}
 */

// provides
goog.provide('X.loader');

// requires
goog.require('X.base');
goog.require('X.exception');
goog.require('X.object');
goog.require('goog.events.EventType');
goog.require('goog.structs.Map');

/**
 * This object loads external files in an asynchronous fashion. In addition, the
 * loading process is monitored and summarized to a total progress value.
 * 
 * @constructor
 * @extends {X.base}
 */
X.loader = function() {

  // call the standard constructor of X.base
  goog.base(this);
  
  //
  // class attributes
  
  /**
   * @inheritDoc
   * @const
   */
  this._className = 'loader';
  
  /**
   * @private
   */
  this._jobs_ = null;
  
  // goog.Timer.callOnce(function() {
  
  // this._completed = true;
  // }.bind(this), 6000);
  
};
// inherit from X.base
goog.inherits(X.loader, X.base);


X.loader.prototype.jobs_ = function() {

  if (!goog.isDefAndNotNull(this._jobs_)) {
    
    this._jobs_ = new goog.structs.Map();
    
  }
  
  return this._jobs_;
  
};


X.loader.prototype.completed = function() {

  if (!goog.isDefAndNotNull(this._jobs_)) {
    
    // there are no jobs (and they never were)
    // this is a quick 'jump out'
    return true;
    
  }
  
  // now we check if all of our jobs are completed
  return !this._jobs_.containsValue(false);
  
};

X.loader.prototype.loadTexture = function(object) {

  if (!goog.isDefAndNotNull(object.texture())) {
    
    throw new X.exception('Fatal: Internal error during texture loading.');
    
  }
  
  // setup the image object
  var image = new Image();
  var currentTextureFilename = object.texture().file();
  image.src = currentTextureFilename;
  
  // we let the object point to this image
  object.texture().setImage(image);
  
  // handler after the image was completely loaded
  goog.events.listenOnce(image, goog.events.EventType.LOAD,
      this.textureLoadCompleted.bind(this, object));
  
  // add this loading job to our jobs map
  this.jobs_().set(object.id(), false);
  
};

X.loader.prototype.textureLoadCompleted = function(object) {

  // at this point the image for the texture was loaded properly
  
  // fire the modified event and attach this object so the renderer can update
  // it properly
  var modifiedEvent = new X.renderer.ModifiedEvent();
  modifiedEvent._object = object;
  this.dispatchEvent(modifiedEvent);
  
  // mark the loading job as completed
  this.jobs_().set(object.id(), true);
  
};


// export symbols (required for advanced compilation)
goog.exportSymbol('X.loader', X.loader);