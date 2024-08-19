import { render } from "@testing-library/react";
import AccountingCalculatorMain from "@/components/AccountingApp/AccountingCalculatorMain";

describe('Accounting', function () {
    it('hi', async () => {
        await render(
            <AccountingCalculatorMain />
        )

    });
});
