import { combineReducers } from 'redux';
{{#if scene}}
{{#each list}}
import {{reducer}}Reducer from './data/{{reducer}}/reducer';
{{/each}}
{{else}}
{{#each list}}
import {{reducer}} from './{{reducer}}';
{{/each}}
{{/if}}

export default combineReducers({
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
