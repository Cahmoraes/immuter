var a=class{constructor(e){this.next=e}handleNext(e,t){return this.next?this.next.handle(e,t):e}};var r=class{static check(e){let t=Reflect.apply(Object.prototype.toString,e,[]);return t.slice(t.indexOf(" ")+1,t.indexOf("]")).toLowerCase()}static isDate(e){return this.check(e)==="date"}static isObject(e){return this.check(e)==="object"}static isArray(e){return Array.isArray(e)}static isMap(e){return this.check(e)==="map"}static isSet(e){return this.check(e)==="set"}};var f=class extends a{handle(e,t){return r.isArray(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){return e.map(t)}};var x=class extends a{handle(e,t){return r.isDate(e)?new Date(e):this.handleNext(e,t)}};var u=class{static execute(e,t){return this.performClone(e,t)}static performClone(e,t){let o=this.createCloneOf(e),i=this.propertyDescriptorsOf(e);for(let l of Reflect.ownKeys(i))this.isEligibleToAssign(i,l)&&(o[l]=t(Reflect.get(o,l)));return o}static createCloneOf(e){return Object.create(this.prototypeOf(e),this.propertyDescriptorsOf(e))}static prototypeOf(e){return Object.getPrototypeOf(e)}static propertyDescriptorsOf(e){return Object.getOwnPropertyDescriptors(e)}static isEligibleToAssign(e,t){return e[String(t)]&&Reflect.has(e[String(t)],"value")}};var h=class extends a{handle(e,t){return r.isObject(e)?u.execute(e,t):this.handleNext(e,t)}};var d=class extends a{handle(e,t){return r.isMap(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){let o=new Map(e);return e.forEach((i,l)=>o.set(l,t(i))),o}};var k=class extends a{handle(e,t){return r.isSet(e)?this.createCloneOf(e,t):this.handleNext(e,t)}createCloneOf(e,t){let o=new Set(e);return e.forEach(i=>o.add(t(i))),o}};var s=class{static execute(e){if(!this.recursivelyHandler){let t=new h,o=new f(t),i=new d(o),l=new k(i),E=new x(l);this.recursivelyHandler=E}return this.recursivelyHandler.handle(e,this.execute.bind(this))}};var c=class{constructor(e){this.next=e}handleNext(e,t){return this.next?this.next.handle(e,t):e}freeze(e){return Object.freeze(e)}};var C=class extends c{handle(e,t){return r.isArray(e)?this.freeze(this.createCloneOf(s.execute(e),t)):this.handleNext(e,t)}createCloneOf(e,t){return e.map(t)}};var m=class extends Error{constructor(){super("Cannot assign to immutable Map"),this.name="CannotAssignToImmutableMapError"}};var b=class extends c{handle(e,t){return r.isMap(e)?this.freezeMap(e):this.handleNext(e,t)}freezeMap(e){return e.set=this.throwError,e.delete=this.throwError,e.clear=this.throwError,this.freeze(e)}throwError(){throw new m}};var S=class extends c{handle(e,t){return r.isObject(e)?this.freeze(u.execute(s.execute(e),t)):this.handleNext(e,t)}};var w=class extends Error{constructor(){super("Cannot assign to immutable Set"),this.name="CannotAssignToImmutableSetError"}};var y=class extends c{handle(e,t){return r.isSet(e)?this.freezeSet(e):this.handleNext(e,t)}freezeSet(e){return e.add=this.throwError,e.delete=this.throwError,e.clear=this.throwError,this.freeze(e)}throwError(){throw new w}};var T=class extends c{handle(e,t){return r.isDate(e)?this.freeze(s.execute(e)):this.handleNext(e,t)}};var v=class{static execute(e){if(!this.recursivelyHandler){let t=new y,o=new b(t),i=new S(o),l=new C(i),E=new T(l);this.recursivelyHandler=E}return this.recursivelyHandler.handle(e,this.execute.bind(this))}};var z=class{static execute(e,t){t(e)}};var p=class p{static get not(){return{freeze:this.freeze(!1)}}static freeze(e){return this.config.freeze=e,{clone:this.clone.bind(this),produce:this.produce.bind(this)}}static clone(e){let t=s.execute(e);return this.execute(t)}static execute(e){let t=this.freezeIfNecessary(e);return p.resetConfig(),t}static freezeIfNecessary(e){return p.config.freeze?v.execute(e):e}static resetConfig(){this.config.freeze=!0}static produce(e,t){let o=s.execute(e);return z.execute(o,t),this.execute(o)}};p.config={freeze:!0};var B=p;export{B as Immuter};
//# sourceMappingURL=index.mjs.map