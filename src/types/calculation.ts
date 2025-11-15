export interface CalculationNodeType {
	_id: string;
	value: number;
	operationType: string;
	operand?: number;
	parentId: string | null;
	username: string;
	createdAt: string;
	children?: CalculationNodeType[];
}
