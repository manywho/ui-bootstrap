declare var manywho;

manywho.theming = (function (manywho) {

    const themes = [
        'cerulean',
        'cosmo',
        'cyborg',
        'darkly',
        'flatly',
        'journal',
        'lumen',
        'paper',
        'readable',
        'sandstone',
        'simplex',
        'slate',
        'spacelab',
        'superhero',
        'united',
        'yeti',
        'sf1',
    ];

    function loadTheme(url) {
        const link = document.getElementById('theme');
        const img = document.createElement('img');

        if (link) {
            link.setAttribute('href', url);

            img.onerror = () => { manywho.log.info('Finished loading theme: ' + url); };
            img.src = url;
        } else {
            manywho.log.error(
                `Failed loading theme ${url}. A <link> element with id "theme" could not be found`,
            );
        }
    }

    return {
        apply(name) {
            if (themes !== null && name && themes.indexOf(name) !== -1) {
                manywho.log.info('Switching theme to: ' + name);
                loadTheme(manywho.cdnUrl + manywho.settings.theme('url') + '/mw-' + name + '.css');
            } else {
                manywho.log.error(name + ' theme cannot be found');
            }
        },

        custom(url) {
            manywho.log.info('Switching to custom theme: ' + url);
            loadTheme(url);
        },
    };

})(manywho);
