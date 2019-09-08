import { Box as ReakitBox } from 'reakit';

import { ListThemeConfig } from '../types';
import { useClassName, createComponent, createElement, createHook } from '../utils';
import { Box, BoxProps } from '../Box';

import * as styles from './styles';

export type LocalListProps = {
  isOrdered?: boolean;
  isHorizontal?: boolean;
  overrides?: ListThemeConfig;
};
export type ListProps = BoxProps & LocalListProps;

const useProps = createHook<ListProps>(
  (props, themeKey) => {
    const boxProps = Box.useProps(props);

    const className = useClassName({
      style: styles.List,
      styleProps: props,
      themeKey,
      prevClassName: boxProps.className
    });

    return { ...boxProps, className };
  },
  { themeKey: 'List' }
);

export const List = createComponent<ListProps>(
  props => {
    let use = props.use;
    if (!use) {
      use = props.isOrdered ? 'ol' : 'ul';
    }

    const listProps = useProps(props);

    return createElement({ children: props.children, component: ReakitBox, use, htmlProps: listProps });
  },
  {
    attach: {
      useProps
    },
    defaultProps: {
      isOrdered: false,
      isHorizontal: false
    },
    themeKey: 'List'
  }
);
