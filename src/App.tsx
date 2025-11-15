import { MainApp } from "./components/MainApp";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
	return (
		<AuthProvider>
			<MainApp />
		</AuthProvider>
	);
};

export default App;
