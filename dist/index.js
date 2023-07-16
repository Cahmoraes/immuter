"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Immuter: () => Immuter
});
module.exports = __toCommonJS(src_exports);

// src/immuter/clone-handlers/clone-handler.ts
var CloneHandler = class {
  constructor(aHandler) {
    this.next = aHandler;
  }
  handleNext(aType, cloneRecursively) {
    if (this.next) {
      return this.next.handle(aType, cloneRecursively);
    }
    return aType;
  }
};

// src/immuter/shared/type-check.ts
var TypeCheck = class {
  static check(aType) {
    const typeString = Reflect.apply(Object.prototype.toString, aType, []);
    return typeString.slice(typeString.indexOf(" ") + 1, typeString.indexOf("]")).toLowerCase();
  }
  static isDate(aType) {
    return this.check(aType) === "date";
  }
  static isObject(aType) {
    return this.check(aType) === "object";
  }
  static isArray(aType) {
    return Array.isArray(aType);
  }
  static isMap(aType) {
    return this.check(aType) === "map";
  }
  static isSet(aType) {
    return this.check(aType) === "set";
  }
};

// src/immuter/clone-handlers/array-clone-handler.ts
var ArrayCloneHandler = class extends CloneHandler {
  handle(aType, cloneRecursively) {
    if (TypeCheck.isArray(aType)) {
      return this.createCloneOf(aType, cloneRecursively);
    }
    return this.handleNext(aType, cloneRecursively);
  }
  createCloneOf(aType, cloneRecursively) {
    return aType.map(cloneRecursively);
  }
};

// src/immuter/clone-handlers/date-clone-handler.ts
var DateCloneHandler = class extends CloneHandler {
  handle(aType, cloneRecursively) {
    if (TypeCheck.isDate(aType)) {
      return new Date(aType);
    }
    return this.handleNext(aType, cloneRecursively);
  }
};

// src/immuter/shared/clone-recursively.ts
var CloneRecursively = class {
  static execute(aBaseStateCloned, strategyRecursively) {
    return this.performClone(aBaseStateCloned, strategyRecursively);
  }
  static performClone(aBaseStateCloned, aStrategyRecursively) {
    const objectToClone = this.createCloneOf(aBaseStateCloned);
    const descriptors = this.propertyDescriptorsOf(aBaseStateCloned);
    for (const descriptor of Reflect.ownKeys(descriptors)) {
      if (this.isEligibleToAssign(descriptors, descriptor)) {
        objectToClone[descriptor] = aStrategyRecursively(
          Reflect.get(objectToClone, descriptor)
        );
      }
    }
    return objectToClone;
  }
  static createCloneOf(aBaseState) {
    return Object.create(
      this.prototypeOf(aBaseState),
      this.propertyDescriptorsOf(aBaseState)
    );
  }
  static prototypeOf(aBaseState) {
    return Object.getPrototypeOf(aBaseState);
  }
  static propertyDescriptorsOf(aBaseState) {
    return Object.getOwnPropertyDescriptors(aBaseState);
  }
  static isEligibleToAssign(descriptors, descriptor) {
    return descriptors[String(descriptor)] && Reflect.has(descriptors[String(descriptor)], "value");
  }
};

// src/immuter/clone-handlers/object-clone-handler.ts
var ObjectCloneHandler = class extends CloneHandler {
  handle(aType, cloneServiceExecute) {
    if (TypeCheck.isObject(aType)) {
      return CloneRecursively.execute(aType, cloneServiceExecute);
    }
    return this.handleNext(aType, cloneServiceExecute);
  }
};

// src/immuter/clone-handlers/map-clone-handler.ts
var MapCloneHandler = class extends CloneHandler {
  handle(aType, cloneServiceExecute) {
    if (TypeCheck.isMap(aType)) {
      return this.createCloneOf(aType, cloneServiceExecute);
    }
    return this.handleNext(aType, cloneServiceExecute);
  }
  createCloneOf(aMap, cloneServiceExecute) {
    const newMap = new Map(aMap);
    aMap.forEach((value, key) => newMap.set(key, cloneServiceExecute(value)));
    return newMap;
  }
};

// src/immuter/clone-handlers/set-clone-handler.ts
var SetCloneHandler = class extends CloneHandler {
  handle(aType, cloneServiceExecute) {
    if (TypeCheck.isSet(aType)) {
      return this.createCloneOf(aType, cloneServiceExecute);
    }
    return this.handleNext(aType, cloneServiceExecute);
  }
  createCloneOf(aSet, cloneServiceExecute) {
    const newSet = new Set(aSet);
    aSet.forEach((value) => newSet.add(cloneServiceExecute(value)));
    return newSet;
  }
};

// src/immuter/services/clone-service.ts
var CloneService = class {
  static execute(aBaseState) {
    if (!this.recursivelyHandler) {
      const objectCloneHandler = new ObjectCloneHandler();
      const arrayCloneHandler = new ArrayCloneHandler(objectCloneHandler);
      const mapCloneHandler = new MapCloneHandler(arrayCloneHandler);
      const setCloneHandler = new SetCloneHandler(mapCloneHandler);
      const dateCloneHandler = new DateCloneHandler(setCloneHandler);
      this.recursivelyHandler = dateCloneHandler;
    }
    return this.recursivelyHandler.handle(
      aBaseState,
      this.execute.bind(this)
    );
  }
};

// src/immuter/freeze-handlers/freeze-handler.ts
var FreezeHandler = class {
  constructor(aHandler) {
    this.next = aHandler;
  }
  handleNext(aType, cloneRecursively) {
    if (this.next) {
      return this.next.handle(aType, cloneRecursively);
    }
    return aType;
  }
  freeze(aType) {
    return Object.freeze(aType);
  }
};

// src/immuter/freeze-handlers/array-freeze-handler.ts
var ArrayFreezeHandler = class extends FreezeHandler {
  handle(aType, freezeServiceExecute) {
    if (TypeCheck.isArray(aType)) {
      return this.freeze(
        this.createCloneOf(CloneService.execute(aType), freezeServiceExecute)
      );
    }
    return this.handleNext(aType, freezeServiceExecute);
  }
  createCloneOf(aType, freezeRecursively) {
    return aType.map(freezeRecursively);
  }
};

// src/immuter/shared/errors/cannot-assign-to-immutable-map-error.ts
var CannotAssignToImmutableMapError = class extends Error {
  constructor() {
    super("Cannot assign to immutable Map");
    this.name = "CannotAssignToImmutableMapError";
  }
};

// src/immuter/freeze-handlers/map-freeze-handler.ts
var MapFreezeHandler = class extends FreezeHandler {
  handle(aType, freezeServiceExecute) {
    if (TypeCheck.isMap(aType)) {
      return this.freezeMap(aType);
    }
    return this.handleNext(aType, freezeServiceExecute);
  }
  freezeMap(aMap) {
    aMap.set = this.throwError;
    aMap.delete = this.throwError;
    aMap.clear = this.throwError;
    return this.freeze(aMap);
  }
  throwError() {
    throw new CannotAssignToImmutableMapError();
  }
};

// src/immuter/freeze-handlers/object-freeze-handler.ts
var ObjectFreezeHandler = class extends FreezeHandler {
  handle(aType, freezeServiceExecute) {
    if (TypeCheck.isObject(aType)) {
      return this.freeze(
        CloneRecursively.execute(
          CloneService.execute(aType),
          freezeServiceExecute
        )
      );
    }
    return this.handleNext(aType, freezeServiceExecute);
  }
};

// src/immuter/shared/errors/cannot-assign-to-immutable-set-error.ts
var CannotAssignToImmutableSetError = class extends Error {
  constructor() {
    super("Cannot assign to immutable Set");
    this.name = "CannotAssignToImmutableSetError";
  }
};

// src/immuter/freeze-handlers/set-freeze-handler.ts
var SetFreezeHandler = class extends FreezeHandler {
  handle(aType, freezeServiceExecute) {
    if (TypeCheck.isSet(aType)) {
      return this.freezeSet(aType);
    }
    return this.handleNext(aType, freezeServiceExecute);
  }
  freezeSet(aSet) {
    aSet.add = this.throwError;
    aSet.delete = this.throwError;
    aSet.clear = this.throwError;
    return this.freeze(aSet);
  }
  throwError() {
    throw new CannotAssignToImmutableSetError();
  }
};

// src/immuter/freeze-handlers/date-clone-handler.ts
var DateFreezeHandler = class extends FreezeHandler {
  handle(aType, freezeServiceExecute) {
    if (TypeCheck.isDate(aType)) {
      return this.freeze(CloneService.execute(aType));
    }
    return this.handleNext(aType, freezeServiceExecute);
  }
};

// src/immuter/services/freeze-service.ts
var FreezeService = class {
  static execute(aBaseState) {
    if (!this.recursivelyHandler) {
      const setFreezeHandler = new SetFreezeHandler();
      const mapFreezeHandler = new MapFreezeHandler(setFreezeHandler);
      const objectFreezeHandler = new ObjectFreezeHandler(mapFreezeHandler);
      const arrayFreezeHandler = new ArrayFreezeHandler(objectFreezeHandler);
      const dateFreezeHandler = new DateFreezeHandler(arrayFreezeHandler);
      this.recursivelyHandler = dateFreezeHandler;
    }
    return this.recursivelyHandler.handle(
      aBaseState,
      this.execute.bind(this)
    );
  }
};

// src/immuter/services/produce-service.ts
var ProduceService = class {
  static execute(draftState, producer) {
    producer(draftState);
  }
};

// src/immuter/index.ts
var _Immuter = class _Immuter {
  static get freeze() {
    this.config.freeze = false;
    return {
      produce: this.produce,
      clone: this.clone
    };
  }
  static get not() {
    return {
      freeze: this.freeze
    };
  }
  static clone(aBaseState) {
    const draftState = CloneService.execute(aBaseState);
    const result = _Immuter.config.freeze ? FreezeService.execute(draftState) : draftState;
    _Immuter.resetConfig();
    return result;
  }
  static produce(aBaseState, produce) {
    const draftState = CloneService.execute(aBaseState);
    ProduceService.execute(draftState, produce);
    const result = _Immuter.config.freeze ? FreezeService.execute(draftState) : draftState;
    _Immuter.resetConfig();
    return result;
  }
  static resetConfig() {
    this.config.freeze = true;
  }
};
_Immuter.config = {
  freeze: true
};
var Immuter = _Immuter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Immuter
});
