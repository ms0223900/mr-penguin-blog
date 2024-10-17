import PropTypes from 'prop-types'; // Import PropTypes

function SharedCounter({ countings }) {

    return (
        <div>
            {countings.map((counting, index) => (
                <div key={index}>
                    <p>Created By: {counting.createdBy}</p>
                    <p>Amount: {counting.amount}</p>
                    <p>Created At: {new Date(counting.createdAt).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
}

SharedCounter.propTypes = {
    countings: PropTypes.arrayOf(
        PropTypes.shape({
            createdBy: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            createdAt: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default SharedCounter;

