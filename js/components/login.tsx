import * as React from 'react';
import { findDOMNode } from 'react-dom';
import { path } from 'ramda'; 
import registeredComponents from '../constants/registeredComponents';
import ILoginProps from '../interfaces/ILoginProps';
import { getWait } from './wait';

declare var manywho: any;

interface ILoginState {
    username?: string;
    password?: string;
    usernameError?: string;
    passwordError?: string; 
    loading?: {
        message: string;
    };
    faults?: null;
}

class Login extends React.Component<ILoginProps, ILoginState> {

    constructor(props) {
        super(props);

        this.state = {
            username: props.username || '',
            password: '',
            usernameError: '',
            passwordError: '', 
            loading: null,
            faults: null,
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.onEnter = this.onEnter.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleUsernameChange(e) {
        this.setState({ username: e.target.value });
    }

    handlePasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    onEnter(e) {
        if (e.keyCode && e.keyCode === 13)
            this.onSubmit();
    }

    dismiss(e) {
        this.setState({ faults: null });
    }

    onSubmit() {
        if (
            !manywho.utils.isNullOrWhitespace(this.state.username) && 
            !manywho.utils.isNullOrWhitespace(this.state.password)
        ) {
            this.setState({ loading: { message: '' } });

            manywho.ajax.login(
                this.props.loginUrl, 
                this.state.username, 
                this.state.password, 
                null, 
                null, 
                this.props.stateId, 
                manywho.utils.extractTenantId(this.props.flowKey),
            )
            .then((response) => {
                manywho.state.setLogin(null, this.props.flowKey);
                manywho.authorization.setAuthenticationToken(response, this.props.flowKey);

                if (this.props.callback) {
                    this.props.callback.execute.apply(
                        this.props.callback.context, 
                        [this.props.callback].concat(this.props.callback.args),
                    );
                }
            })
            .fail((error) => {
                this.setState({
                    loading: null,
                    password: '',
                    faults: typeof path(['responseJSON'], error) === 'string' ? error.responseJSON :
                        manywho.utils.isNullOrWhitespace(path(['responseJSON', 'message'], error)) === false ? error.responseJSON.message : 
                        path(['responseText'], error)
                });
            });

        } else {

            if (manywho.utils.isNullOrWhitespace(this.state.username))
                this.setState({ usernameError: 'This field is required.' });

            if (manywho.utils.isNullOrWhitespace(this.state.password))
                this.setState({ passwordError: 'This field is required.' });
        }
    }

    componentDidMount() {
        if (this.refs.username) {

            const usernameInput : HTMLInputElement = findDOMNode(this.refs.username);

            usernameInput.focus();

            if (this.props.username) {
                usernameInput.setSelectionRange(0, this.props.username.length);
            }
        }
    }

    render() {
        manywho.log.info('Rendering Login');

        const Wait = getWait();

        let faults = null;
        if (this.state.faults) {
            faults = (
                <ul className="center-notifications notifications">
                    <li>
                        <div className="notification alert alert-danger">
                            <button className="close" onClick={this.dismiss}>
                                <span>{'\u00D7'}</span>
                            </button>
                            <span>{this.state.faults}</span>
                        </div>
                    </li>
                </ul>
            );
        }

        let usernameClassName = 'form-group';
        let passwordClassName = 'form-group';

        if (!manywho.utils.isNullOrWhitespace(this.state.usernameError))
            usernameClassName += ' has-error';

        if (!manywho.utils.isNullOrWhitespace(this.state.passwordError))
            passwordClassName += ' has-error';

        return (
            <div>
                <div className="modal-backdrop full-height"></div>
                <div className="modal show">
                    <div className="modal-dialog" onKeyUp={this.onEnter}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Login</h4>
                            </div>
                            <div className="modal-body">
                                <p>Directory: <strong>{this.props.directoryName}</strong></p>
                                <div className={usernameClassName}>
                                    <label>
                                        Username <span className="input-required"> *</span>
                                    </label>
                                    <input type="text" 
                                        maxLength={255} 
                                        size={60} 
                                        className="form-control" 
                                        ref="username" 
                                        value={this.state.username || ''} 
                                        onChange={this.handleUsernameChange} 
                                        id="mw-username" />
                                    <span className="help-block">
                                        {this.state.usernameError}
                                    </span>
                                </div>
                                <div className={passwordClassName}>
                                    <label>
                                        Password <span className="input-required"> *</span>
                                    </label>
                                    <input type="password" 
                                        maxLength={255} 
                                        size={60} 
                                        className="form-control" 
                                        value={this.state.password} 
                                        onChange={this.handlePasswordChange} 
                                        id="mw-password" />
                                    <span className="help-block">
                                        {this.state.passwordError}
                                    </span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-primary" onClick={this.onSubmit}>
                                    Login
                                </button>
                            </div>
                            <Wait isVisible={this.state.loading !== null} message={this.state.loading && this.state.loading.message} />
                            {faults}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

manywho.component.register(registeredComponents.LOGIN, Login, ['mw_login']);

export const getLogin = () : typeof Login => manywho.component.getByName(registeredComponents.LOGIN);

export default Login;
