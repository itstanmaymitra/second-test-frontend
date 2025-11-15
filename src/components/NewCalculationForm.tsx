import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../api";

export const NewCalculationForm = ({
	onSuccess,
}: {
	onSuccess: () => void;
}) => {
	const { token } = useAuth();
	const [startValue, setStartValue] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!startValue || !token) return;

		setLoading(true);

		try {
			const response = await fetch(`${API_BASE}/calculations/start`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ value: parseFloat(startValue) }),
			});

			if (response.ok) {
				setStartValue("");
				onSuccess();
			} else {
				const err = await response.json();
				alert(err.message || "Failed to create calculation");
			}
		} catch (err) {
			alert("Failed to create calculation");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mb-6 p-4 bg-white border rounded-lg">
			<h2 className="text-sm font-medium mb-3">Start New Discussion</h2>
			<div className="flex items-center gap-2">
				<input
					type="number"
					value={startValue}
					onChange={(e) => setStartValue(e.target.value)}
					placeholder="Enter starting number"
					onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
					className="flex-1 px-3 py-2 border rounded"
				/>

				<button
					onClick={handleSubmit}
					className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-1"
				>
					{loading && <Loader2 size={14} className="animate-spin" />}
					Publish
				</button>
			</div>
		</div>
	);
};
