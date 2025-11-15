import { useEffect, useState } from "react";
import { Loader2, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { CalculationNode } from "./CalculationNode";
import { AuthModal } from "./AuthModal";
import { NewCalculationForm } from "./NewCalculationForm";
import { API_BASE } from "../api";
import type { CalculationNodeType } from "../types/calculation";

export const MainApp = () => {
	const { currentUser, logout, loading: authLoading } = useAuth();
	const [showAuth, setShowAuth] = useState(false);
	const [calculations, setCalculations] = useState<CalculationNodeType[]>([]);
	const [showNewCalculation, setShowNewCalculation] = useState(false);
	const [fetchingCalculations, setFetchingCalculations] = useState(true);

	const fetchCalculations = async () => {
		try {
			const response = await fetch(`${API_BASE}/calculations/`);
			if (response.ok) {
				setCalculations(await response.json());
			}
		} catch (err) {
			console.error("Error fetching calculations:", err);
		} finally {
			setFetchingCalculations(false);
		}
	};

	useEffect(() => {
		if (!authLoading) fetchCalculations();
	}, [authLoading]);

	const handleSuccess = () => {
		setShowNewCalculation(false);
		fetchCalculations();
	};

	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 size={32} className="animate-spin" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white border-b sticky top-0 z-10">
				<div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
					<h1 className="text-xl font-light">Number Discussions</h1>
					<div className="flex items-center gap-3">
						{currentUser ? (
							<>
								{!showNewCalculation && (
									<button
										onClick={() =>
											setShowNewCalculation(true)
										}
										className="px-4 py-2 bg-gray-800 text-white rounded text-sm cursor-pointer"
									>
										New Discussion
									</button>
								)}

								<div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
									<User size={16} />
									<span className="text-sm">
										{currentUser.username}
									</span>
								</div>

								<button
									onClick={logout}
									className="p-2 cursor-pointer"
									title="Logout"
								>
									<LogOut size={18} />
								</button>
							</>
						) : (
							<button
								onClick={() => setShowAuth(true)}
								className="px-4 py-2 bg-gray-800 text-white rounded text-sm cursor-pointer"
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-6">
				{showNewCalculation && (
					<NewCalculationForm onSuccess={handleSuccess} />
				)}

				<AuthModal show={showAuth} onClose={() => setShowAuth(false)} />

				{fetchingCalculations ? (
					<div className="flex justify-center py-12">
						<Loader2 size={32} className="animate-spin" />
					</div>
				) : calculations.length > 0 ? (
					<div className="space-y-6">
						{calculations.map((c) => (
							<CalculationNode
								key={c._id}
								node={c}
								onRespond={fetchCalculations}
							/>
						))}
					</div>
				) : (
					<p className="text-center py-12 text-gray-500">
						No discussions yet.{" "}
						{currentUser ? "Start one!" : "Sign in to start one!"}
					</p>
				)}
			</main>
		</div>
	);
};
