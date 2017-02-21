/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;

(function (manywho) {

    const footer = React.createClass({
        render: function () {
            if (this.props.children) {
                manywho.log.info('Rendering Footer');

                let className = 'mw-footer';
                className += (manywho.settings.global('isFullWidth', this.props.flowKey, false)) ? ' container-fluid' : ' container';

                return <div className={className}>{this.props.children}</div>;
            }
            return null;
        }
    });

    manywho.component.register('footer', footer);

} (manywho));
