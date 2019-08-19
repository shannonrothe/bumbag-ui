import * as React from 'react';
import _get from 'lodash/get';
import _kebabCase from 'lodash/kebabCase';

import { ThemeContext, css } from '../styled';
import { breakpoint, fontSize, palette, space, fontWeight } from './theme';

import { pickCSSProps } from './cssProps';

const colorAttributes = [
  'color',
  'backgroundColor',
  'borderBlockEndColor',
  'borderBlockStartColor',
  'borderBottomColor',
  'borderColor',
  'borderInlineEndColor',
  'borderInline-startColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'borderBottomColor',
  'caretColor',
  'columnRuleColor',
  'outlineColor',
  'textDecorationColor',
  'textEmphasisColor'
];
const spaceAttributes = [
  'margin',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'top',
  'left',
  'bottom',
  'right',
  'grid-gap',
  'grid-column-gap',
  'grid-row-gap'
];
const fontSizeAttributes = ['fontSize'];
const fontWeightAttributes = ['fontWeight'];

function getColorValue({ theme, value }) {
  const color = palette(value)({ theme });
  if (color) {
    return color;
  }
  return value;
}

function getSpaceValue({ theme, value }) {
  const spacing = space(value)({ theme });
  if (spacing) {
    return `${spacing}rem`;
  }
  return value;
}

function getFontSizeValue({ theme, value }) {
  const size = fontSize(value)({ theme });
  if (size) {
    return `${size}rem`;
  }
  return value;
}

function getFontWeightValue({ theme, value }) {
  const weight = fontWeight(value)({ theme });
  if (weight) {
    return weight;
  }
  return value;
}

export function useStyle(props) {
  const theme = React.useContext(ThemeContext);
  const cssProps = pickCSSProps(props);

  let style = { ...cssProps };
  if (style) {
    style = Object.entries(style).reduce((prevStyle, [attribute, value]) => {
      let newValue = value;
      if (typeof newValue === 'string') {
        newValue = { default: value };
      }
      const newStyle = Object.entries(newValue).reduce((prevStyle, [bp, value]) => {
        let newValue = value;
        if (colorAttributes.includes(attribute)) {
          newValue = getColorValue({ theme, value });
        }
        if (spaceAttributes.includes(attribute)) {
          newValue = getSpaceValue({ theme, value });
        }
        if (fontSizeAttributes.includes(attribute)) {
          newValue = getFontSizeValue({ theme, value });
        }
        if (fontWeightAttributes.includes(attribute)) {
          newValue = getFontWeightValue({ theme, value });
        }
        if (bp === 'default') {
          return css`
            ${prevStyle}
            ${_kebabCase(attribute)}: ${newValue};
          `;
        }
        return css`
          ${prevStyle};
          ${breakpoint(
            bp,
            css`
              ${_kebabCase(attribute)}: ${newValue};
            `
          )({ theme })};
        `;
      }, css``);
      return css`
        ${prevStyle} ${newStyle};
      `;
    }, css``);
  }

  return style;
}