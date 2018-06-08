import React from 'react';
import PropTypes from 'prop-types';

const justifyMap = {
  left: 'flex-start',
  right: 'flex-end',
  center: 'center',
  between: 'space-between',
};

const Layout = ({
  children,
  style,
  justify,
  gap,
  verticalCenter,
  inline,
  ...other
}) => {
  const defaultStyle = {
    display: inline ? 'inline-flex' : 'flex',
    justifyContent: justifyMap[justify],
  };
  return (
    <div
      style={{ ...defaultStyle, ...style }}
      {...other}
    >
      {
        React.Children.toArray(children)
          .filter(child => !!child)
          .map((child, idx) => {
            const {
              style: childStyle = {},
              width,
              gap: childGap,
            } = child.props;
            const itemStyle = {};
            if (typeof width !== 'undefined') {
              if (typeof width === 'number' && width < 0) {
                itemStyle.width = `calc(100% - ${Math.abs(width)}px)`;
              } else {
                itemStyle.width = width;
              }
            } else if (!justify) {
              itemStyle.flex = '1 1';
            }
            if (idx !== 0) {
              itemStyle.marginLeft = typeof childGap !== 'undefined' ? childGap : gap;
            }
            if (verticalCenter) {
              itemStyle.alignSelf = 'center';
            }
            return React.cloneElement(child, {
              style: {
                ...itemStyle,
                ...childStyle,
              },
            });
          })
      }
    </div>
  );
};

Layout.defaultProps = {
  gap: 0,
  inline: false,
  verticalCenter: false,
  style: {},
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  gap: PropTypes.number,
  justify: PropTypes.oneOf(['left', 'right', 'center', 'between']),
  style: PropTypes.object,
  inline: PropTypes.bool,
  verticalCenter: PropTypes.bool,
};

export default Layout;
