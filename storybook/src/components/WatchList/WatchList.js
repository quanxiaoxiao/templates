import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Watch from './Watch';

class NextConnect extends PureComponent {
  componentWillMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.update(nextProps);
  }

  componentWillUnmount() {
    this.end();
  }

  get watchList() {
    const { watches } = this;
    return Object.keys(watches).map(key => watches[key]);
  }

  watches = {}

  update(props) {
    const { list } = props;
    this.watches = list.reduce((acc, item) => {
      const { actionName } = item;
      let watch = acc[actionName];
      if (!watch) {
        watch = new Watch({ ...item, action: props[actionName] });
        watch.changeType = 'init';
        watch.start();
        return {
          ...acc,
          [actionName]: watch,
        };
      }
      watch.effects = item.effects;
      watch.action = props[actionName];
      if (!_.isEqual(item.params, watch.params)) {
        watch.params = item.params;
        watch.changeType = 'params';
        watch.start();
      }
      return acc;
    }, this.watches);
  }

  end() {
    this.watchList.forEach(watch => watch.end());
  }

  render() {
    const { children } = this.props;
    if (children) {
      return children;
    }
    return null;
  }
}

NextConnect.propTypes = {
  list: PropTypes.array.isRequired, // eslint-disable-line
  children: PropTypes.any,
};

export default NextConnect;

