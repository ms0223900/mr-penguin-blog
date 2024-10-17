interface Counting {
    createdBy: string;
    amount: number;
    createdAt: number;
}

interface SharedCounterProps {
    countings: Counting[];
}

function formatCreatedAt(timestamp: number): string {
    return new Date(timestamp).toLocaleString();
}

function SharedCounter({ countings }: SharedCounterProps) {
    const totalAmount = countings.reduce((total, counting) => total + counting.amount, 0);

    return (
        <div>
            {countings.map((counting, index) => (
                <div key={index}>
                    <p>Created By: {counting.createdBy}</p>
                    <p>Amount: {counting.amount}</p>
                    <p>Created At: {formatCreatedAt(counting.createdAt)}</p>
                </div>
            ))}
            <p><strong>Total Amount: {totalAmount}</strong></p>
        </div>
    );
}

export default SharedCounter;

