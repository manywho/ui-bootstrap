import 'script-loader!./lib/010-pollyfills.js';

// Polyfill for Promises in IE - Can be removed when when support for IE is dropped
import 'promise-polyfill/src/polyfill';

import './createClassPatch.ts';

// Lib CSS
import "../css/lib/react-selectize.css";

// Themes
import "../css/mw-bootstrap.less";

// Services
import './services/theming.ts';

// Components
import './components/image.tsx';
import './components/chart-bar.tsx';
import './components/chart-base.tsx';
import './components/chart-container.tsx';
import './components/chart-doughnut.tsx';
import './components/chart-line.tsx';
import './components/chart-pie.tsx';
import './components/chart-polar.tsx';
import './components/chart.tsx';
import './components/container.tsx';
import './components/content.tsx';
import './components/debug.tsx';
import './components/error-fallback.tsx';
import './components/feed-input.tsx';
import './components/feed.tsx';
import './components/file-upload.tsx';
import './components/flip.tsx';
import './components/footer.tsx';
import './components/group.tsx';
import './components/hidden.tsx';
import './components/history.tsx';
import './components/horizontal.tsx';
import './components/iframe.tsx';
import './components/inline.tsx';
import './components/input-boolean.tsx';
import './components/input-datetime.tsx';
import './components/input-number.tsx';
import './components/input.tsx';
import './components/items-container.tsx';
import './components/items-header.tsx';
import './components/list.tsx';
import './components/login.tsx';
import './components/main.tsx';
import './components/mixins.ts';
import './components/modal-container.tsx';
import './components/modal.tsx';
import './components/navigation.tsx';
import './components/notifications.tsx';
import './components/not-found.tsx';
import './components/outcome.tsx';
import './components/outcomes.tsx';
import './components/pagination.tsx';
import './components/presentation.tsx';
import './components/radio.tsx';
import './components/returnToParent.tsx';
import './components/select.tsx';
import './components/status.tsx';
import './components/table-container.tsx';
import './components/table-input-datetime.tsx';
import './components/table-input.tsx';
import './components/table-large.tsx';
import './components/table-small.tsx';
import './components/textarea.tsx';
import './components/tiles.tsx';
import './components/toggle.tsx';
import './components/tour.tsx';
import './components/vertical.tsx';
import './components/voting.tsx';
import './components/wait.tsx';
