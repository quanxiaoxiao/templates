import { connect } from 'react-redux';
{{#if fetchPolling}}
import FetchPolling from 'components/FetchPolling';
{{else}}
import {{name}} from '../../components/{{name}}';
{{/if}}

const mapStateToProps = () => ({
});

const mapDispatchToProps = {};

{{#if fetchPolling}}
export default connect(mapStateToProps, mapDispatchToProps)(FetchPolling);
{{else}}
export default connect(mapStateToProps, mapDispatchToProps)({{name}});
{{/if}}
