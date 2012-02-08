
a5.Package('a5.cl.interaction')
	
	.Import('a5.cl.core.Utils')
	.Extends('a5.cl.CLAddon')
	.Class('Interaction', function(cls, im, Interaction){
		
		var regEventObj = {
			mousemove:[],
			keydown:{},
			keyup:{}
		};
		
		cls.Interaction = function(){
			cls.superclass(cls);
			im.Utils.addEventListener(document, 'mousemove', eMouseMoveHandler);
			im.Utils.addEventListener(document, 'keydown', eKeyDownHandler);
			im.Utils.addEventListener(document, 'keyup', eKeyUpHandler);
		}
		
		/**
		 * 
		 */
		cls.registerForKeyDown = function(type, listener, exclusive){ return cls.registerForEvent('keydown', listener, type, exclusive) };
		
		/**
		 * 
		 */
		cls.registerForKeyUp = function(type, listener, exclusive){ return cls.registerForEvent('keyup', listener, type, exclusive) };
		
		/**
		 * 
		 */
		cls.registerForMouseMove = function(listener, exclusive){ return cls.registerForEvent('mousemove', listener, null, exclusive) };
		
		
		cls.initializePlugin = function(){
			
		}
		
		cls.registerForEvent = function(evt, listener, type, exclusive){
			var listenerObj = {
				listener: listener,
				exclusive: exclusive || false
			};
			if (evt === 'mousemove') {
				var typeArr = evtObj.mousemove;
				if (typeArr.length === 1 && typeArr[0].exclusive === true) {
					cls.throwError('Cannot add event listener for "' + evt + '", existing listener is set exclusive.');
					return;
				}
				if (exclusive)
					typeArr.splice(0, typeArr.length);
				typeArr.push(listenerObj);
			} else {
				var evtObj = regEventObj[evt], 
					typeArr = evtObj[type];
				if (typeArr === undefined) 
					typeArr = evtObj[type] = [];
				if (typeArr.length === 1 && typeArr[0].exclusive === true) {
					cls.throwError('Cannot add event listener for "' + evt + '", existing listener is set exclusive.');
					return;
				}
				if (exclusive)
					typeArr.splice(0, typeArr.length);
				typeArr.push(listenerObj);
			}
			var removeIndex = typeArr.length-1;
			return {
				remove:function(){ 
					if(removeIndex < typeArr.length)
						typeArr.splice(removeIndex, 1);
					this.remove = function(){
						cls.throwError('Cannot call remove twice on same event handler.')
					} 
				}
			}
		}
		
		var eMouseMoveHandler = function(e){
			e = e || window.e;
			for (var i = 0, l = regEventObj.mousemove.length; i < l; i++)
				if(regEventObj.mousemove[i].listener(e) === false)
					break;
		}
		
		var eKeyDownHandler = function(e){
			e = e || window.e;
			processEvent('keydown', e.keyCode, e);
		}
		
		var eKeyUpHandler = function(e){
			e = e || window.e;
			processEvent('keyup', e.keyCode, e);
		}	
		
		var processEvent = function(evt, type, eventObj){
			var typeArr = regEventObj[evt][type];
			if(typeArr)
				for (var i = 0, l = typeArr.length; i < l; i++)
					if(typeArr[i].listener(eventObj) === false)
						break;
		}
})