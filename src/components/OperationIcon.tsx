import { Plus, Minus, X, Divide } from "lucide-react";
import type { JSX } from "react";

export const OperationIcon = ({ op }: { op: string }) => {
	const icons: Record<string, JSX.Element> = {
		add: <Plus size={14} />,
		subtract: <Minus size={14} />,
		multiply: <X size={14} />,
		divide: <Divide size={14} />,
	};

	return icons[op] || null;
};
