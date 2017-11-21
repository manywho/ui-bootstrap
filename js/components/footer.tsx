import IComponentProps from '../interfaces/IComponentProps';
import '../../css/footer.less';
import * as React from 'react';

declare var manywho: any;

/* tslint:disable-next-line:variable-name */
const Footer: React.SFC<IComponentProps> = ({ children, flowKey }) => {

    if (children) {
        manywho.log.info('Rendering Footer');

        let className = 'mw-footer';
        className +=
            manywho.settings.global('isFullWidth', flowKey, false) ?
                ' container-fluid' :
                ' container';

        return <div className={className}>{children}</div>;
    }

    return null;
};

manywho.component.register('footer', Footer);

export default Footer;
