import { useState } from "react";
import { Loader2 } from "lucide-react";
import { OperationIcon } from "./OperationIcon";
import { useAuth } from "../context/AuthContext";
import type { CalculationNodeType } from "../types/calculation";
import { API_BASE } from "../api";
import { timeAgo } from "../utils/timeago";

export const CalculationNode = ({
	node,
	onRespond,
}: {
	node: CalculationNodeType;
	onRespond: () => void;
}) => {
	const { currentUser, token } = useAuth();
	const [showReply, setShowReply] = useState(false);
	const [operation, setOperation] = useState("add");
	const [operand, setOperand] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async () => {
		if (!operand || !currentUser || !token) return;

		setLoading(true);
		try {
			const response = await fetch(`${API_BASE}/calculations/operation`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					parentId: node._id,
					operationType: operation,
					operand: parseFloat(operand),
				}),
			});

			if (response.ok) {
				setShowReply(false);
				setOperand("");
				onRespond();
			} else {
				const err = await response.json();
				alert(err.message || "Failed to add operation");
			}
		} catch (e) {
			alert("Failed to add operation");
		} finally {
			setLoading(false);
		}
	};

	const isRoot = node.operationType === "start";

	return (
		<div className="mb-3">
			<div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-gray-300 transition-colors">
				{isRoot ? (
					<div className="flex items-center justify-between">
						<div>
							<span className="text-3xl font-light text-gray-800">
								{node.value}
							</span>
							<div className="text-xs text-gray-500 mt-1">
								<span className="font-medium">
									{node.username}
								</span>{" "}
								· {timeAgo(node.createdAt)}
							</div>
						</div>
						{currentUser && (
							<button
								onClick={() => setShowReply(!showReply)}
								className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
							>
								Respond
							</button>
						)}
					</div>
				) : (
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-1 text-gray-600">
								<OperationIcon op={node.operationType} />
								<span className="text-sm">{node.operand}</span>
							</div>
							<span className="text-gray-400">=</span>
							<span className="text-2xl font-light text-gray-800">
								{node.value}
							</span>
							<div className="text-xs text-gray-500 ml-2">
								<span className="font-medium">
									{node.username}
								</span>{" "}
								· {timeAgo(node.createdAt)}
							</div>
						</div>
						{currentUser && (
							<button
								onClick={() => setShowReply(!showReply)}
								className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
							>
								Respond
							</button>
						)}
					</div>
				)}

				{showReply && (
					<div className="mt-3 pt-3 border-t border-gray-100">
						<div className="flex items-center gap-2">
							<select
								value={operation}
								onChange={(e) => setOperation(e.target.value)}
								className="px-2 py-1 border rounded text-sm"
							>
								<option value="add">+</option>
								<option value="subtract">−</option>
								<option value="multiply">×</option>
								<option value="divide">÷</option>
							</select>

							<input
								type="number"
								value={operand}
								onChange={(e) => setOperand(e.target.value)}
								placeholder="number"
								className="flex-1 px-3 py-1 border rounded text-sm"
							/>

							<button
								onClick={handleSubmit}
								className="px-4 py-1 bg-gray-800 text-white rounded text-sm flex items-center gap-1"
								disabled={loading}
							>
								{loading && (
									<Loader2
										size={14}
										className="animate-spin"
									/>
								)}
								Add
							</button>

							<button
								onClick={() => setShowReply(false)}
								className="px-3 py-1 text-gray-600 text-sm"
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>

			{node.children?.length ? (
				<div className="ml-6 mt-2 pl-4 border-l-2 border-gray-100">
					{node.children.map((child) => (
						<CalculationNode
							key={child._id}
							node={child}
							onRespond={onRespond}
						/>
					))}
				</div>
			) : null}
		</div>
	);
};
