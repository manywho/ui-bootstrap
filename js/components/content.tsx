/// <reference path="../../typings/index.d.ts" />

declare var manywho: any;
declare var tinymce: any;

(function (manywho, window) {

    class Content extends React.Component<any, any> {

        static isLoadingTinyMce: boolean = false;
        static loadTinyMce(callback) {
            Content.isLoadingTinyMce = true;

            const script = document.createElement('script');
            script.src = manywho.settings.global('richtext.url');

            script.onload = () => {
                Content.isLoadingTinyMce = false;
                callback.apply();
            };

            window.document.body.appendChild(script);
        }

        constructor(props) {
            super(props);
            this.state = {
                isImageUploadOpen: false
            };

            this.id = `content-${this.props.id}_${manywho.utils.guid()}`;
        }

        changeInterval: Function;
        skipSetContent: boolean;
        editor: any;
        id: string;

        initializeEditor = () => {
            const self = this;
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            const customPlugins = manywho.settings.global('richtext.custom_plugins', this.props.flowKey, null);
            if (customPlugins)
                Object.keys(customPlugins).forEach(name => tinymce.PluginManager.add(name, customPlugins[name]));

            tinymce.init({
                selector: `textarea#${this.id}`,
                plugins: manywho.settings.global('richtext.plugins', this.props.flowKey, []),
                external_plugins: manywho.settings.global('richtext.external_plugins', this.props.flowKey, []),
                width: model.width * 19, // Multiply the width by a "best guess" font-size as the manywho width is columns and tinymce width is pixels
                height: model.height * 16, // Do the same for the height
                readonly: !model.isEditable,
                menubar: 'edit insert view format table',
                browser_spellcheck: true,
                toolbar: manywho.settings.global('richtext.toolbar', this.props.flowKey, []),
                content_css: manywho.settings.global('richtext.content_css', this.props.flowKey, []),
                importcss_append: manywho.settings.global('richtext.importcss_append', this.props.flowKey, false),
                importcss_file_filter: manywho.settings.global('richtext.importcss_file_filter', this.props.flowKey, null),
                moxiemanager_title: manywho.settings.global('richtext.moxiemanager_title', this.props.flowKey, null),
                moxiemanager_fullscreen: manywho.settings.global('richtext.moxiemanager_fullscreen', this.props.flowKey, null),

                setup: function(editor) {
                    self.editor = editor;

                    if (!self.props.isDesignTime) {

                        if (manywho.settings.global('richtext.imageUploadEnabled', self.props.flowKey, true))
                            editor.addButton('mwimage', {
                                title: 'Images',
                                icon: 'image',
                                onclick: function () {
                                    self.setState({
                                        isImageUploadOpen: true
                                    });
                                    self.render();
                                }
                            });

                        editor.on('change', self.onChange);

                        if (model.hasEvents)
                            editor.on('blur', self.onEvent);
                    }

                    editor.on('init', function () {
                        this.getDoc().body.style.fontSize = manywho.settings.global('richtext.fontsize', self.props.flowKey, '13px');
                    });
                }
            });
        }

        componentDidMount = () => {
            if (!(window as any).tinymce)
                if (!Content.isLoadingTinyMce)
                    Content.loadTinyMce(() => this.initializeEditor());
                else {
                    let loaderInterval = setInterval(() => {
                        if ((window as any).tinymce) {
                            this.initializeEditor();
                            clearInterval(loaderInterval);
                        }
                    }, 50);
                }
            else
                this.initializeEditor();
        }

        componentWillUnmount = () => {
            if (this.editor) {
                try {
                    this.editor.remove();
                }
                catch (ex) {
                    manywho.log.error(ex);
                }
            }
        }

        onChange = (e) => {
            const contentValue = this.editor.getContent();
            manywho.state.setComponent(this.props.id, { contentValue }, this.props.flowKey, true);
            this.forceUpdate();
        }

        onEvent = (e) => {
            manywho.component.handleEvent(this, manywho.model.getComponent(this.props.id, this.props.flowKey), this.props.flowKey);
        }

        renderFileDialog = () => {
            const tableProps: any = {
                flowKey: this.props.flowKey,
                id: this.props.id,
                selectionEnabled: true
            };

            const uploadProps: any = {
                flowKey: this.props.flowKey,
                id: this.props.id,
                multiple: true
            };

            if (!this.props.isDesignTime) {
                tableProps.onRowClicked = this.onFileTableRowClicked;
                uploadProps.uploadComplete = this.onUploadComplete;
            }

            return <div className="modal show">
                <div className="modal-dialog full-screen">
                    <div className="modal-content full-screen">
                        <div className="modal-body">
                            <ul className="nav nav-tabs">
                                <li className="active">
                                    <a href="#files" data-toggle="tab">File List</a>
                                </li>
                                <li>
                                    <a href="#files" data-toggle="tab">Direct Upload</a>   
                                </li>
                            </ul>
                            <div className="tab-content">
                                <div className="tab-pane active" id="files">
                                    {React.createElement(manywho.component.getByName('table'), tableProps)}
                                </div>
                                <div className="tab-pane" id="upload">
                                    {React.createElement(manywho.component.getByName('file-upload'), uploadProps)}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-default" onClick={this.onFileCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>;
        }

        onUploadComplete = (response) => {
            const imageUri = manywho.utils.getObjectDataProperty(response.objectData[0].properties, 'Download Uri');
            const imageName = manywho.utils.getObjectDataProperty(response.objectData[0].properties, 'Name');

            if (imageUri) {
                tinymce.activeEditor.execCommand('mceInsertContent', false, '<img src="' + imageUri.contentValue + '" alt="' + imageName.contentValue + '"/>');

                this.setState({
                    isImageUploadOpen: false
                });
            }
        }

        onFileCancel = (event) => {
            this.setState({
                isImageUploadOpen: false
            });
        }

        onFileTableRowClicked = (event) => {
            const imageUri = event.currentTarget.lastChild.innerText;
            const imageName = event.currentTarget.firstChild.innerText;

            if (imageUri != null && imageUri.length > 0) {
                tinymce.activeEditor.execCommand('mceInsertContent', false, '<img src="' + imageUri + '" alt="' + imageName + '"/>');

                this.setState({
                    isImageUploadOpen: false
                });
            }
        }

        render() {
            const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

            manywho.log.info(`Rendering Content: ${model.developerName}, ${this.props.id}`);

            const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
            const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

            const contentValue = state && state.contentValue !== undefined ? state.contentValue : model.contentValue;

            const props: any = {
                id: this.id,
                placeholder: model.hintValue,
                maxLength: model.maxSize,
                cols: model.width,
                rows: model.height,
                value: contentValue,
                readOnly: model.isEditable === false,
                disabled: model.isEnabled === false,
                required: model.isRequired === true,
            };

            props['data-flowkey'] = this.props.flowKey;

            if (!this.props.isDesignTime)
                props.defaultValue = contentValue;

            let className = manywho.styling.getClasses(this.props.parentId, this.props.id, 'input', this.props.flowKey).join(' ');

            if (model.isValid === false || state.isValid === false)
                className += ' has-error';

            if (model.isVisible === false)
                className += ' hidden';

            className += ' form-group';

            const outcomeButtons = outcomes && outcomes.map(outcome => React.createElement(manywho.component.getByName('outcome'), { id: outcome.id, flowKey: this.props.flowKey }));

            return <div className={className} id={this.props.id}>
                <label>{model.label}{model.isRequired ? <span className="input-required"> *</span> : null}</label>
                <textarea {...props} />
                <span className="help-block">{model.validationMessage || state.validationMessage}</span>
                <span className="help-block">{model.helpInfo}</span>
                {outcomeButtons}
                {this.state.isImageUploadOpen ? this.renderFileDialog() : null}
            </div>;
        }
    }

    manywho.component.register('content', Content);

}(manywho, window));
