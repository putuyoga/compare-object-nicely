
import { isObject, isString, isInteger, isBoolean } from 'lodash';

const log = console.log;

const styles = {
  orange: 'background: #f39c12; color: #ffffff',
  red: 'background: #c0392b; color: #ffffff',
  green: 'background: #16a085; color: #ffffff',
  transparent: 'background: transparent;',
  gray: 'background: #8395a7; color: #ffffff'
};

const getParentEqualityStyle = isEqual => (
  isEqual ? styles.green : styles.orange
);

const getEqualityStyle = isEqual => (
  isEqual ? styles.green : styles.red
);

const isValueEasyToCompare = (value) => (
  isBoolean(value)
  || isString(value)
  || isInteger(value)
);

const canDeepCheck = (prev, current) => (
  isObject(prev)
  && isObject(current)
  && prev !== current
);

const createPadding = (isParentLastNode) => (
  isParentLastNode.map(
    value => (value ? '  ' : '│ ')
  ).join('')
);

const prettyPrint = (
  prev,
  current,
  hideEqualValues,
  ignoredFields,
  isParentLastNode
) => (key, index, array) => {
  const isValueEqual = prev[key] === current[key];

  // we want ignore certain props, so skip it
  const isIgnored = ignoredFields.includes(key)
    || (isValueEqual && hideEqualValues);
  if (isIgnored) return;

  const isLastNode = index === array.length - 1;
  const branchSymbol = isLastNode ? '└─' : '├─';

  const easyCompare = isValueEasyToCompare(current[key]);
  const infoContent = easyCompare
    ? `%c = %c ${prev[key]} %c ➞ %c ${current[key]} `
    : '';
  const additionalStyle = easyCompare
    ? [styles.transparent, styles.gray, styles.transparent, styles.gray]
    : [];

  const outputContent = `${branchSymbol}%c ${key} ${infoContent}`;
  const padding = isParentLastNode.length > 0
    ? createPadding(isParentLastNode)
    : '';
  const equalityStyle = getEqualityStyle(isValueEqual);
  log(padding.concat(outputContent), equalityStyle, ...additionalStyle);

  if (canDeepCheck(prev[key], current[key])) {
    const prettify = prettyPrint(
      prev[key],
      current[key],
      hideEqualValues,
      ignoredFields,
      [...isParentLastNode, isLastNode]
    );
    Object.keys(current[key]).forEach(prettify);
  }
};

/**
 * Used to compare property of each object
 * usually used on props or state compare
 * @param {Object} prevObject first object to be compared
 * @param {Object} currentObject second object to be compared
 * @param {boolean} hideEqualValues only display different value field
 */
const compareObjectNicely = (
  prevObject,
  currentObject,
  hideEqualValues = false,
  ignoredProps = []
) => {
  const isEqual = prevObject === currentObject;
  const headerContent = isEqual ? '%c object is same' : '%c object is not same';
  log(headerContent, getParentEqualityStyle(isEqual));

  const prettify = prettyPrint(
    prevObject,
    currentObject,
    hideEqualValues,
    ignoredProps,
    []
  );

  Object.keys(currentObject).forEach(prettify);
};

export default compareObjectNicely;
