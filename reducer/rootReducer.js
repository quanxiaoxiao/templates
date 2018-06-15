import { combineReducers } from 'redux';
{{#if hasRouter}}
import { routerReducer } from 'react-router-redux';
{{#each sceneList}}
import {{name}}Reducer from '{{pathName}}';
{{/each}}
{{/if}}
{{#if scene}}
{{#each list}}
import {{reducer}}Reducer from './data/{{reducer}}/reducer';
{{/each}}
{{else}}
{{#each list}}
import {{reducer}} from './{{reducer}}/reducer';
{{/each}}
{{/if}}

export default combineReducers({
{{#if hasRouter}}
  router: routerReducer,
{{/if}}
{{#each sceneList}}
  {{name}}: {{name}}Reducer,
{{/each}}
{{#if scene}}
{{#each list}}
  {{reducer}}: {{reducer}}Reducer,
{{/each}}
{{else}}
{{#each list}}
  {{reducer}},
{{/each}}
{{/if}}
});
