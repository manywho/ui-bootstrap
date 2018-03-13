import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import '../../css/footer.less';

declare var manywho: any;

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

    return <noscript/>;
};

manywho.component.register(registeredComponents.FOOTER, Footer);

export const getFooter = () : typeof Footer => manywho.component.getByName(registeredComponents.FOOTER) || Footer;

export default Footer;
