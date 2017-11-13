(function (manywho) {

    /* tslint:disable-next-line:variable-name */
    const Hidden: React.SFC<IComponentProps> = ({ id }) => {

        manywho.log.info('Rendering Hidden: ' + id);
        return null;
    };

    manywho.component.register('hidden', Hidden);

}(manywho));
