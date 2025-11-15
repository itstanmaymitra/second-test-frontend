import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../api";

export const AuthModal = ({
	show,
	onClose,
}: {
	show: boolean;
	onClose: () => void;
}) => {
	const { login } = useAuth();
	const [isLogin, setIsLogin] = useState(true);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);

	const resetForm = () => {
		setUsername("");
		setPassword("");
		setName("");
	};

	if (!show) return null;

	const handleAuth = async () => {
		if (!username || !password) return;
		if (!isLogin && !name) return;

		setLoading(true);

		try {
			const endpoint = isLogin ? "/auth/login" : "/auth/register";

			const response = await fetch(`${API_BASE}${endpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(
					isLogin
						? { username, password }
						: { name, username, password }
				),
			});

			const data = await response.json();

			console.log(data);

			if (response.ok) {
				if (isLogin) {
					login(data.user, data.access_token);
					onClose();
				} else {
					alert("Registration successful! Now log in.");
					setIsLogin(true);
				}
			} else {
				alert(data.message || "Authentication failed");
			}
		} catch (err) {
			alert("Authentication failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
			<div className="bg-white p-6 rounded-lg w-full max-w-sm">
				<h2 className="text-lg font-medium mb-4">
					{isLogin ? "Sign In" : "Create Account"}
				</h2>

				<div className="space-y-3">
					{!isLogin && (
						<input
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Full Name"
							className="w-full px-3 py-2 border rounded"
						/>
					)}

					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						className="w-full px-3 py-2 border rounded"
					/>

					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Password"
						onKeyPress={(e) => e.key === "Enter" && handleAuth()}
						className="w-full px-3 py-2 border rounded"
					/>

					<button
						onClick={handleAuth}
						className="w-full py-2 bg-gray-800 text-white rounded flex items-center justify-center gap-2 cursor-pointer"
					>
						{loading && (
							<Loader2 size={16} className="animate-spin" />
						)}
						{isLogin ? "Sign In" : "Sign Up"}
					</button>

					<button
						onClick={() => {
							setIsLogin(!isLogin);
							resetForm();
						}}
						className="w-full text-sm text-gray-600 cursor-pointer"
					>
						{isLogin
							? "Need an account? Sign up"
							: "Already have an account? Sign in"}
					</button>

					<button
						onClick={() => {
							resetForm();
							onClose();
						}}
						className="w-full text-sm text-gray-500 cursor-pointer"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
