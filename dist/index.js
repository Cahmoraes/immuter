'use strict';

var a=class{constructor(e){this.next=e;}handleNext(e,t){return this.next?this.next.handle(e,t):e}};var r=class{static typeOf(e){let t=Reflect.apply(Object.prototype.toString,e,[]);return t.slice(t.indexOf(" ")+1,t.indexOf("]")).toLowerCase()}static isDate(e){return this.typeOf(e)==="date"}static isObject(e){return this.typeOf(e)==="object"}static isArray(e){return Array.isArray(e)}static isMap(e){return this.typeOf(e)==="map"}static isSet(e){return this.typeOf(e)==="set"}static isPrimitive(e){return Object(e)!==e}};var f=class extends a{handle(e,t){return r.isArray(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){return e.map(t)}};var h=class extends a{handle(e,t){return r.isDate(e)?new Date(e):this.handleNext(e,t)}};var x=class extends Error{constructor(e){super(e),this.name="CloneExceptionError";}};var u=class{static execute(e,t){try{return this.performClone(e,t)}catch(o){if(o instanceof Error)throw new x(o.message)}}static performClone(e,t){let o=this.createCloneOf(e),i=this.propertyDescriptorsOf(e);for(let l of Reflect.ownKeys(i))this.isEligibleToAssign(i,l)&&(o[l]=t(Reflect.get(o,l)));return o}static createCloneOf(e){return Object.create(this.prototypeOf(e),this.propertyDescriptorsOf(e))}static prototypeOf(e){return Object.getPrototypeOf(e)}static propertyDescriptorsOf(e){return Object.getOwnPropertyDescriptors(e)}static isEligibleToAssign(e,t){return e[String(t)]&&Reflect.has(e[String(t)],"value")}};var d=class extends a{handle(e,t){return r.isObject(e)?u.execute(e,t):this.handleNext(e,t)}};var m=class extends a{handle(e,t){return r.isMap(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){let o=new Map(e);return e.forEach((i,l)=>o.set(l,t(i))),o}};var k=class extends a{handle(e,t){return r.isSet(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){let o=new Set(e);return e.forEach(i=>o.add(t(i))),o}};var c=class{static execute(e){if(!this.recursivelyHandler){let t=new d,o=new f(t),i=new m(o),l=new k(i),O=new h(l);this.recursivelyHandler=O;}return this.recursivelyHandler.handle(e,this.execute.bind(this))}};var s=class{constructor(e){this.next=e;}handleNext(e,t){return this.next?this.next.handle(e,t):e}freeze(e){return Object.freeze(e)}};var b=class extends s{handle(e,t){return r.isArray(e)?this.freeze(this.createCloneOf(c.execute(e),t)):this.handleNext(e,t)}createCloneOf(e,t){return e.map(t)}};var C=class extends Error{constructor(){super("Cannot assign to immutable Map"),this.name="CannotAssignToImmutableMapError";}};var w=class extends s{handle(e,t){return r.isMap(e)?this.freezeMap(e):this.handleNext(e,t)}freezeMap(e){return e.set=this.throwError,e.delete=this.throwError,e.clear=this.throwError,this.freeze(e)}throwError(){throw new C}};var S=class extends s{handle(e,t){return r.isObject(e)?this.freeze(u.execute(c.execute(e),t)):this.handleNext(e,t)}};var y=class extends Error{constructor(){super("Cannot assign to immutable Set"),this.name="CannotAssignToImmutableSetError";}};var T=class extends s{handle(e,t){return r.isSet(e)?this.freezeSet(e):this.handleNext(e,t)}freezeSet(e){return e.add=this.throwError,e.delete=this.throwError,e.clear=this.throwError,this.freeze(e)}throwError(){throw new y}};var v=class extends s{handle(e,t){return r.isDate(e)?this.freeze(c.execute(e)):this.handleNext(e,t)}};var E=class{static execute(e){if(!this.recursivelyHandler){let t=new T,o=new w(t),i=new S(o),l=new b(i),O=new v(l);this.recursivelyHandler=O;}return this.recursivelyHandler.handle(e,this.execute.bind(this))}};var z=class{static execute(e,t){t(e);}};var B=class extends TypeError{constructor(e){super(`Invalid baseState type: [${e}]`),this.name="InvalidBaseStateError";}};var g={freeze:!0},p=class p{constructor(e){this.config=e;}static createImmutable(){return new p(g)}static createMutable(){return new p({freeze:!1})}static get global(){return {not:{freeze:()=>{this.instance=this.createMutable();}},freeze:()=>{this.instance=this.createImmutable();}}}static get not(){return {freeze:this.createMutable()}}static produce(e,t){return this.instance.produce(e,t)}static clone(e){return this.instance.clone(e)}clone(e){this.throwIfNotObject(e);let t=c.execute(e);return this.execute(t)}execute(e){return this.freezeIfNecessary(e)}freezeIfNecessary(e){return this.config.freeze?E.execute(e):e}produce(e,t){this.throwIfNotObject(e);let o=c.execute(e);return z.execute(o,t),this.execute(o)}throwIfNotObject(e){if(r.isPrimitive(e))throw new B(r.typeOf(e))}};p.instance=p.createImmutable();var H=p;

exports.Immuter = H;
//# sourceMappingURL=out.js.map
//# sourceMappingURL=index.js.map