import React, { useEffect, useState } from 'react';


const Index: React.FC = (props) => {
    const [val, setVal] = useState('');
    useEffect(() => {
        console.log('hi')
    }, [])

    // 月利率 * 尚未償還本金
    const gracePeriodLoan = 0; // TODO
    // (1+0.018 / 12)^360*(0.018/12) / ((1+0.018/12)^360-1)* (648 * 10000)

    return (
        <div style={{
            minHeight: 860,
            maxWidth: 720,
            margin: 'auto'
        }}>
            <h1>Side Projects</h1>
            <div>
                <div>
                    <label>
                        Loans:
                        <input
                            placeholder={"months"}
                            value={val}
                            onChange={e => {
                                setVal(e.target.value)
                            }}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Loans:
                        <input
                            placeholder={"months"}
                            value={val}
                            onChange={e => {
                                setVal(e.target.value)
                            }}
                        />
                    </label>
                </div>
                <div style={{
                    padding: '1rem 0'
                }}>
                    <hr />
                </div>
                <p>寬限期貸款: NTD ${gracePeriodLoan}</p>

            </div>
        </div>
    );
};

export default Index;
