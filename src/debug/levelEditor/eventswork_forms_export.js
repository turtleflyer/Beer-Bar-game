import EventsWork from 'drama-core';

const {
  RoleSet,
  defineRoutine,
  managePropagation,
  stopBubbling,
  stopPropagatingNested,
  setActionOnAddElement,
  fireEvent,
  eventChain,
  waitWhenTypeExhausted,
} = new EventsWork();

defineRoutine({
  interpretTarget: e => e.form,
  defaultPropagation: { stopBubbling: true },
});

export {
  RoleSet,
  defineRoutine,
  managePropagation,
  stopBubbling,
  stopPropagatingNested,
  setActionOnAddElement,
  fireEvent,
  eventChain,
  waitWhenTypeExhausted,
};
