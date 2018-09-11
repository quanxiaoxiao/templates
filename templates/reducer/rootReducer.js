import { combineReducers } from 'redux';
{{#each list}}
import {{importName}} from '{{importPath}}';
{{/each}}

export default combineReducers({
{{#each list}}
  {{reduerLine}},
{{/each}}
});
