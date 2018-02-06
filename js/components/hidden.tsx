import * as React from 'react';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';

const Hidden: React.SFC<IComponentProps> = ({ id }) => {

    manywho.log.info('Rendering Hidden: ' + id);
    return <noscript />;
};

manywho.component.register(registeredComponents.HIDDEN, Hidden);

export const getHidden = () : typeof Hidden => manywho.component.getByName(registeredComponents.HIDDEN);

export default Hidden;
