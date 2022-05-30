
import Page from "./Page";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { css } from '@emotion/css';
import { errorToast } from "../toast";


const formStyle = css({
    width: 400,
    '& .form-control': {
        margin: '10px auto'
    }
})


class Login extends Page {


    state = {
        values: {
            username: '',
            password: ''
        }
    }


    submit = () => {

        const { username, password } = this.state.values;

        if (!username)
            return errorToast('Username is required.')

        if (!password)
            return errorToast('Password is required.')

        if (username !== 'admin' || password !== 'nophishing2022')
            return errorToast('Invalid credentials.');
        
        window.App.redirect('/dashboard');
        
    }

    _render() {

        return <div
            style={{
                height: 'calc(var(--window-height) - var(--navbar-height))'
            }}
            className="vh-align"
        >
            <div className={formStyle}>

                <TextField
                    label="Username"
                    value={this.state.values.username}
                    onChange={this.onChangeHandlerGenerator('username')}
                    fullWidth
                    className="form-control"
                />

                <TextField
                    label="Password"
                    value={this.state.values.password}
                    onChange={this.onChangeHandlerGenerator('password')}
                    fullWidth
                    className="form-control"
                    type="password"
                />


                <Button
                    fullWidth
                    onClick={this.submit}
                    variant="contained"
                    size="large"
                    className="form-control"
                >LOGIN</Button>
            </div>
        </div>
    }
}


export default Login;