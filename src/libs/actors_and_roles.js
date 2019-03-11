/* eslint-env browser */
import {
  defineRoutine,
  eventChain,
  fireEvent,
  RoleSet,
  waitWhenTypeExhausted,
  setActionOnAddElement,
} from 'drama-core';

defineRoutine({
  interpretTarget: e => e.node,
  defaultPropagation: { stopBubbling: true },
});

function appendPx(n) {
  return `${n}px`;
}

const classNamesMap = new Map();

export class Actor {
  constructor(node, position, { scaleF, zIndex } = {}) {
    if (typeof node === 'string') {
      this.node = document.createElement(node);
    } else {
      this.node = node;
    }
    this.position = { scaleF: scaleF || 1 };
    this.linked = new Set();
    this.state = {};
    this.setPosition(position);
    if (zIndex) {
      this.setZIndex(zIndex);
    }
  }

  setPosition(position) {
    if (position) {
      for (const prop of Actor.positionPropsNames) {
        const style = position[prop];
        if (typeof style === 'number' || style === null) {
          this.position[prop] = style;
          // prettier-ignore
          this.node.style[prop] = style && appendPx(style * this.position.scaleF);
        }
      }
    }
    return this;
  }

  refreshScaleF(newScale) {
    for (const actor of [this].concat([...this.linked])) {
      actor.position.scaleF = newScale;
      actor.setPosition(actor.position);
    }
    return this;
  }

  setZIndex(zIndex) {
    this.node.style['z-index'] = zIndex;
    return this;
  }

  linkActor(actor, link = true) {
    if (!(actor instanceof Actor)) {
      throw new Error('Parameter should be an instance of GameActor class');
    }
    const { linked } = this;
    if (link && !linked.has(actor)) {
      actor.refreshScaleF(this.position.scaleF);
      linked.add(actor);
    } else if (!link && linked.has(actor)) {
      linked.delete(actor);
    }
    return this;
  }

  remove() {
    this.node.remove();
    return this;
  }

  getAppendedAsChild(whereToAppend) {
    if (whereToAppend instanceof Actor) {
      whereToAppend.node.appendChild(this.node);
    } else if (whereToAppend instanceof RoleSet) {
      [...whereToAppend][0].node.appendChild(this.node);
    } else {
      throw new Error('@@...');
    }
    return this;
  }

  attachClassName(className) {
    const { node } = this;
    const prevClassName = classNamesMap.get(this);
    if (prevClassName) {
      node.classList.remove(prevClassName);
    }
    node.classList.add(className);
    classNamesMap.set(this, className);
    return this;
  }
}
Actor.positionPropsNames = ['left', 'top', 'width', 'height', 'bottom', 'right'];

const registeredRoleClasses = new Map();

export class RoleClass {
  constructor(type) {
    if (typeof type === 'string') {
      const getClass = registeredRoleClasses.get(type);
      if (getClass) {
        return getClass;
      }
      registeredRoleClasses.set(type, this);
    }
    this.type = type;
  }

  registerAction(roleSet, { action }) {
    const roleClass = this;
    const { type } = this;
    let active = false;
    let toTerminate = false;
    return new class Role {
      constructor() {
        Object.assign(this, {
          roleSet,
          type,
          action: action.bind(this),
          roleClass,
        });
      }

      start() {
        if (!active) {
          toTerminate = false;
          // eslint-disable-next-line
          const { roleSet, type, action } = this;
          eventChain({
            roleSet,
            type,
            action,
            checkIfTerminate: () => toTerminate,
          });
          active = true;
        }
        return this;
      }

      fire(event) {
        this.roleClass.fire(this.roleSet, event);
        return this;
      }

      fireAndWaitWhenExhausted(event) {
        return this.roleClass.fireAndWaitWhenExhausted(this.roleSet, event);
      }

      stop() {
        toTerminate = true;
        this.fire();
        active = false;
        return this;
      }
    }();
  }

  fire(target, event) {
    fireEvent(target, this.type, event);
    return this;
  }

  fireAndWaitWhenExhausted(target, event) {
    fireEvent(target, this.type, event);
    return waitWhenTypeExhausted(this.type);
  }
}

export function registerActionOfType(type, roleSet, { action }) {
  if (!(typeof type === 'string')) {
    throw new Error('@@@...');
  }
  return new RoleClass(type).registerAction(roleSet, { action });
}

const initializerClass = new RoleClass(Symbol('@@ActorSet/initializerClass'));
const cleanerClass = new RoleClass(Symbol('@@ActorSet/cleanerClass'));

export class ActorsSet extends RoleSet {
  constructor(args) {
    super(args);
    this._cleaner = this.getCleaner();
    this._cleaner.start();
  }

  getInitializer(initialize) {
    if (initialize || !this._initializer) {
      if (this._initializer) {
        this._initializer.stop();
      }
      if (initialize) {
        this._initializer = initializerClass.registerAction(this, {
          action: ({ roleSet }) => {
            if (roleSet.size === 0) {
              initialize.call(this);
            }
          },
        });
      } else {
        this._initializer = initializerClass.registerAction(this, {
          action: () => null,
        });
      }
    }
    this._initializer.start();
    return this._initializer;
  }

  getCleaner() {
    return (
      this._cleaner
      || cleanerClass.registerAction(this, {
        action: () => {
          [...this].forEach((e) => {
            if (!(e instanceof RoleSet)) {
              if (e.node) {
                e.node.remove();
              }
              this.deleteElement(e);
            }
          });
        },
      })
    );
  }

  onAddActorEvent(action) {
    setActionOnAddElement(this, action.bind(this));
    return this;
  }
}

const startType = Symbol('@@RolesManipulator/startType');
const stopType = Symbol('@@RolesManipulator/stopType');

export class RolesManipulator extends RoleSet {
  constructor(roles) {
    super(roles);
    eventChain({
      roleSet: this,
      type: startType,
      action: () => {
        [...this].forEach(role => role.start());
      },
    });
    eventChain({
      roleSet: this,
      type: stopType,
      action: ({ target: role }) => role.stop(),
    });
  }

  start() {
    fireEvent(this, startType);
    return this;
  }

  stop() {
    fireEvent(this, stopType);
    return this;
  }
}

export const debugSymbols = {};
