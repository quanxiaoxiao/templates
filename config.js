const alias = require('./alias');
const reactTemplates = require('./configs/react');
const reactComponentTemplates = require('./configs/reactComponent');
const reactContainerTemplates = require('./configs/reactContainer');
const configTemplates = require('./configs/configs');
const reactReducerTemplates = require('./configs/reactReducer');
const reactRootReducerTemplates = require('./configs/reactRootReducer');
const reactActionTempaltes = require('./configs/reactAction');
const webpackTemplates = require('./configs/webpack');
const testTemplates = require('./configs/test');
const reactSceneTemplates = require('./configs/reactScene');
const clientTemplates = require('./configs/client');
const dockerWebTemplates = require('./configs/dockerWeb');
const serverTemplates = require('./configs/server');
const noriceTempaltes = require('./configs/norice');

module.exports = {
  ...clientTemplates,
  ...testTemplates,
  ...reactSceneTemplates,
  ...reactActionTempaltes,
  ...reactRootReducerTemplates,
  ...webpackTemplates,
  ...reactReducerTemplates,
  ...configTemplates,
  ...reactTemplates,
  ...reactComponentTemplates,
  ...reactContainerTemplates,
  ...dockerWebTemplates,
  ...serverTemplates,
  ...noriceTempaltes,
  ...alias,
};
