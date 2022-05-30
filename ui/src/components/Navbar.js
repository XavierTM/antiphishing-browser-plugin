
import { AppBar, Button } from "@mui/material";
import Component from "@xavisoft/react-component";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from '@xavisoft/app-wrapper';


function setDimensions() {

    const elem = document.getElementById('navbar');
    const width = elem.offsetWidth + 'px';
    const height = elem.offsetHeight + 'px';

    document.documentElement.style.setProperty('--navbar-height', height);
    document.documentElement.style.setProperty('--navbar-width', width);
}



class Navbar extends Component {


    componentDidMount() {
        
        window.addEventListener('resize', setDimensions);
        setDimensions();
    }


    render() {
        return <AppBar id="navbar">
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 150px'}}>

                <h2 className="center-align">ADMIN PORTAL</h2>

                <Button
                    style={{ color: 'white' }}
                    component={Link}
                    to="/"
                >
                    <LogoutIcon />
                    Logout
                </Button>
            </div>
        </AppBar>
    }
}

export default Navbar;