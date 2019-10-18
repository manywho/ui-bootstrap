import * as React from 'react';
import * as tinymce from 'tinymce';
import registeredComponents from '../constants/registeredComponents';
import IComponentProps from '../interfaces/IComponentProps';
import outcome from './outcome';
import tableContainer from './table-container';
import fileUpload from './file-upload';
import '../../css/content.less';
import 'tinymce/skins/lightgray/skin.min.css';

/* eslint import/no-webpack-loader-syntax: off */
import rawTinyMceContentStyles from '!!raw-loader!tinymce/skins/lightgray/content.min.css';
import 'tinymce/themes/modern';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/contextmenu';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/link';
import 'tinymce/plugins/media';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/print';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';

declare var manywho: any;

interface IContentState {
    isImageUploadOpen: boolean;
}

class Content extends React.Component<IComponentProps, IContentState> {

    constructor(props) {
        super(props);
        this.state = {
            isImageUploadOpen: false,
        };

        this.id = `content-${this.props.id}_${manywho.utils.guid()}`;
    }

    changeInterval: Function;
    skipSetContent: boolean;
    editor: any;
    id: string;

    initializeEditor = () => {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        const customPlugins =
            manywho.settings.global('richtext.custom_plugins', this.props.flowKey, null);

        if (customPlugins) {
            Object.keys(customPlugins).forEach(name =>
                tinymce.PluginManager.add(name, customPlugins[name]),
            );
        }

        tinymce.init({
            selector: `textarea#${this.id}`,
            plugins: manywho.settings.global('richtext.plugins', this.props.flowKey, []),
            external_plugins: manywho.settings.global(
                'richtext.external_plugins',
                this.props.flowKey,
                [],
            ),
            // Multiply the width by a "best guess" font-size as the manywho width is columns
            // and tinymce width is pixels
            width: model.width * 19,
            // Do the same for the height
            height: model.height * 16,
            readonly: !model.isEditable,
            menubar: 'edit insert view format table',
            browser_spellcheck: true,
            toolbar: manywho.settings.global(
                'richtext.toolbar',
                this.props.flowKey,
                [],
            ),
            file_picker_callback: null,
            convert_urls: false,
            relative_urls: false,
            remove_script_host: false,
            importcss_append: true,
            skin: false,

            setup: (editor) => {
                this.editor = editor;

                if (!this.props.isDesignTime) {

                    if (
                        manywho.settings.global(
                            'richtext.imageUploadEnabled', this.props.flowKey, true,
                        )
                    ) {
                        editor.addButton('mwimage', {
                            title: 'Images',
                            icon: 'image',
                            onclick: () => {
                                this.setState({ isImageUploadOpen: true });
                                this.render();
                            },
                        });
                    }

                    editor.on('nodechange', this.onChange);

                    if (model.hasEvents) {
                        editor.on('blur', this.onEvent);
                    }
                }

                editor.on('init', this.onInit);
            },
        });
    }

    componentDidMount() {
        this.initializeEditor();
    }

    componentDidUpdate() {
        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};

        // If the given content is the same, we don't want to set anything
        if (state.contentValue === this.editor.getContent()) {
            return;
        }

        // Otherwise, we want to update the editor with the given content
        if (this.editor && state.contentValue) {
            this.editor.setContent(state.contentValue);
        }
    }

    componentWillUnmount() {
        if (this.editor) {
            try {
                this.editor.remove();
            } catch (ex) {
                manywho.log.error(ex);
            }
        }
    }

    /**
     * tinyMCE init
     *
     * Previously we used the importcss plugin to load custom CSS. However with a slow connection
     * the CSS assets took a long time to load delaying this init event, consequently leaving a
     * large timing window for a user to enter text and click save without the state being updated.
     * This meant data loss or erroneous 'This field is required' messages.
     *
     * As a workaround we inject the custom CSS after the editor has initialized.
     *
     * Note - we are currently ignoring the settings richtext.importcss_append and richtext.importcss_file_filter
     * options for the importcss plugin as they are not used and, by default, richtext.importcss_file_filter has the
     * same URI as richtext.content_css
     */
    onInit = (e) => {
        const iframe = this.editor.getDoc();
        iframe.body.style.fontSize = manywho.settings.global('richtext.fontsize', this.props.flowKey, '13px');

        const content_css = manywho.settings.global('richtext.content_css', this.props.flowKey, []);

        /**
         * Hacking the TinyMCE content CSS into the editor iframe
         * as since tinyMCE CSS is no longer being loaded externally
         * the importcss_append is no longer honoured
         */
        const tinyMceContentStyleTag = document.createElement('style'); // tinymce/skins/lightgray/content.min.css
        tinyMceContentStyleTag.type = 'text/css';
        tinyMceContentStyleTag.appendChild(document.createTextNode(rawTinyMceContentStyles));
        iframe.head.appendChild(tinyMceContentStyleTag);

        for (const uri of content_css) {
            const css = document.createElement("link");
            css.href = uri;
            css.rel = "stylesheet";
            css.type = "text/css";
            css.crossOrigin = "anonymous";
            iframe.head.appendChild(css);
        }


        // Ensure the new styles are applied and we update state for any text modifications made by the user
        // between presenting the <textarea> UI and initializing tinyMCE

        this.editor.fire('change');
    }

    onChange = (e) => {
        const contentValue = this.editor.getContent();
        manywho.state.setComponent(this.props.id, { contentValue }, this.props.flowKey, true);
    }

    onEvent = (e) => {
        manywho.component.handleEvent(
            this,
            manywho.model.getComponent(this.props.id, this.props.flowKey),
            this.props.flowKey,
        );
    }

    renderFileDialog = () => {

        const TableContainer : typeof tableContainer = manywho.component.getByName(registeredComponents.TABLE_CONTAINER);
        const FileUpload : typeof fileUpload = manywho.component.getByName(registeredComponents.FILE_UPLOAD);

        const tableProps: any = {
            flowKey: this.props.flowKey,
            id: this.props.id,
            selectionEnabled: true,
        };

        const uploadProps: any = {
            flowKey: this.props.flowKey,
            id: this.props.id,
            multiple: true,
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
                                <TableContainer {...tableProps} />
                            </div>
                            <div className="tab-pane" id="upload">
                                <FileUpload {...uploadProps} />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default" onClick={this.onFileCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>;
    }

    onUploadComplete = (response) => {
        const imageUri = manywho.utils.getObjectDataProperty(
            response.objectData[0].properties, 'Download Uri',
        );
        const imageName = manywho.utils.getObjectDataProperty(
            response.objectData[0].properties, 'Name',
        );

        if (imageUri) {
            tinymce.activeEditor.execCommand(
                'mceInsertContent',
                false,
                '<img src="' + imageUri.contentValue + '" alt="' +
                    imageName.contentValue + '"/>',
            );

            this.setState({
                isImageUploadOpen: false,
            });
        }
    }

    onFileCancel = (event) => {
        this.setState({
            isImageUploadOpen: false,
        });
    }

    onFileTableRowClicked = (event) => {
        const imageUri = event.currentTarget.lastChild.innerText;
        const imageName = event.currentTarget.firstChild.innerText;

        if (imageUri != null && imageUri.length > 0) {
            tinymce.activeEditor.execCommand(
                'mceInsertContent',
                false,
                '<img src="' + imageUri + '" alt="' + imageName + '"/>',
            );

            this.setState({
                isImageUploadOpen: false,
            });
        }
    }

    render() {
        const model = manywho.model.getComponent(this.props.id, this.props.flowKey);

        manywho.log.info(`Rendering Content: ${model.developerName}, ${this.props.id}`);

        const state = manywho.state.getComponent(this.props.id, this.props.flowKey) || {};
        const outcomes = manywho.model.getOutcomes(this.props.id, this.props.flowKey);

        const Outcome : typeof outcome = manywho.component.getByName(registeredComponents.OUTCOME);

        const contentValue =
            state.contentValue
            ? state.contentValue
            : model.contentValue || '';

        const openBracket = '{![';
        const closedBracket = ']}';

        const replaceSpacesInReferences = contentValue.split(openBracket).map((splitByStartString, index) => {
            // splitByStartString is all text up until the next {![
            // e.g. {![ , 'ReferencedValue]} normal text in the content' , {![
            // If this text has index:0, then this text didn't have a start {![ OR
            // If this text has no ending ]}
            if (index === 0 || splitByStartString.indexOf(closedBracket) === -1) {
                // Then this is not a valid reference, so we will leave it alone
                return splitByStartString;
            }
            const splitByEndString = splitByStartString.split(closedBracket);
            // Using regex to replace spaces with &nbsp;
            splitByEndString[0] = splitByEndString[0].replace(/ /g, '&nbsp;');
            return splitByEndString.join(closedBracket);
        }).join(openBracket);

        const props: any = {
            id: this.id,
            placeholder: model.hintValue,
            maxLength: model.maxSize,
            cols: model.width,
            rows: model.height,
            value: replaceSpacesInReferences,
            readOnly: model.isEditable === false,
            disabled: model.isEnabled === false,
            required: model.isRequired === true,
        };

        props['data-flowkey'] = this.props.flowKey;

        let className = manywho.styling.getClasses(
            this.props.parentId, this.props.id, 'input', this.props.flowKey,
        ).join(' ');

        if (model.isValid === false || state.isValid === false) {
            className += ' has-error';
        }

        if (model.isVisible === false) {
            className += ' hidden';
        }

        className += ' form-group';

        const outcomeButtons = outcomes && outcomes.map((outcome) => {
            return <Outcome id={outcome.id} flowKey={this.props.flowKey} />;
        });



        return <div className={className} id={this.props.id}>
            <label>
                {model.label}
                {
                    model.isRequired ?
                        <span className="input-required"> *</span> :
                        null
                }
            </label>
            <textarea {...props} />
            <span className="help-block">
            {
                model.validationMessage || state.validationMessage
            }
            </span>
            <span className="help-block">{model.helpInfo}</span>
            {outcomeButtons}
            {this.state.isImageUploadOpen ? this.renderFileDialog() : null}
        </div>;
    }
}

manywho.component.register(registeredComponents.CONTENT, Content);

export const getContent = () : typeof Content => manywho.component.getByName(registeredComponents.CONTENT) || Content;

export default Content;
