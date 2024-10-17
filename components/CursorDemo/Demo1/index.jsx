import Counter from "./Counter";
import AdvancedCounter from "./AdvancedCounter";

const CursorDemo1 = () => {
    return (
        <div>
            <h1>Cursor Demo 1</h1>
            <div className="h-8" />
            <hr />
            <h2>Counter</h2>
            <Counter />
        </div>
    );
};

export const CursorDemo2 = () => {
    return (
        <div>
            <h1>Cursor Demo 2</h1>
            <hr />
            <h2>Advanced Counter</h2>
            <AdvancedCounter />
        </div>
    );
};

export default CursorDemo1;