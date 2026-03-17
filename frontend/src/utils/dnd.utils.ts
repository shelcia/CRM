/* eslint-disable @typescript-eslint/no-explicit-any */

function compose(...fns: any[]) {
  return (arg: any) => fns.reduce((acc, fn) => fn(acc), arg);
}

function partialRight(fn: (...args: any[]) => any, ...args: any[]) {
  return (...leftArgs: any[]) => fn(...leftArgs, ...args);
}

function addInArrayAtPosition<T>(array: T[], element: T, position: number): T[] {
  const arrayCopy = [...array];
  arrayCopy.splice(position, 0, element);
  return arrayCopy;
}

function removeFromArrayAtPosition<T>(array: T[], position: number): T[] {
  return array.reduce<T[]>(
    (acc, value, idx) => (idx === position ? acc : [...acc, value]),
    []
  );
}

function changeElementOfPositionInArray<T>(array: T[], from: number, to: number): T[] {
  const removeFromArrayAtPositionFrom = partialRight(removeFromArrayAtPosition, from);
  const addInArrayAtPositionTo = partialRight(addInArrayAtPosition, array[from], to);
  return compose(removeFromArrayAtPositionFrom, addInArrayAtPositionTo)(array) as T[];
}

function identity(value: any) {
  return value;
}

function when(value: any, predicate: (v: any) => any = identity) {
  return function callback(callback: (v: any) => void) {
    if (predicate(value)) return callback(value);
  };
}

interface ReplaceOptions<T> {
  when: (element: T) => boolean;
  for: (element: T) => T;
}

function replaceElementOfArray<T>(array: T[]) {
  return function (options: ReplaceOptions<T>): T[] {
    return array.map((element) =>
      options.when(element) ? options.for(element) : element
    );
  };
}

function pickPropOut(object: Record<string, any>, prop: string): Record<string, any> {
  return Object.keys(object).reduce((obj, key) => {
    return key === prop ? obj : { ...obj, [key]: object[key] };
  }, {});
}

export {
  addInArrayAtPosition,
  removeFromArrayAtPosition,
  changeElementOfPositionInArray,
  when,
  replaceElementOfArray,
  partialRight,
  pickPropOut,
};
