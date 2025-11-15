import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	currentUser: any;
	token: string | null;
	login: (user: any, token: string) => void;
	logout: () => void;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [currentUser, setCurrentUser] = useState<any>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const storedToken = localStorage.getItem("auth_token");
		const storedUser = localStorage.getItem("auth_user");

		if (storedToken && storedUser) {
			setToken(storedToken);
			setCurrentUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = (user: any, authToken: string) => {
		setCurrentUser(user);
		setToken(authToken);
		localStorage.setItem("auth_token", authToken);
		localStorage.setItem("auth_user", JSON.stringify(user));
	};

	const logout = () => {
		setCurrentUser(null);
		setToken(null);
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_user");
	};

	return (
		<AuthContext.Provider
			value={{ currentUser, token, login, logout, loading }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
};
