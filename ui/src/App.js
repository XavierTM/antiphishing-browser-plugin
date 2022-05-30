
import './App.css';
import AppWrapper, { Route } from '@xavisoft/app-wrapper';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';




function setDimensions() {


	const width = window.innerWidth + 'px';
	const height = window.innerHeight + 'px';

	document.documentElement.style.setProperty('--window-height', height);
	document.documentElement.style.setProperty('--window-width', width);
}

window.addEventListener('resize', setDimensions);
setDimensions();

function App() {
	return <AppWrapper>

		<Navbar />

		<Route path="/" component={Login} />
		<Route path="/dashboard" component={Dashboard} />
	</AppWrapper>
}

export default App;
