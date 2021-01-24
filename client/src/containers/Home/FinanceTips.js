import "./Home.css";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import {
  Collapse,
  Link,
  Text,
  Spacer,
  Table,
  Pagination,
} from "@geist-ui/react";
import NumberEasing from "react-number-easing";

import { getColorForPercentage } from "../../helpers";
import { useState } from "react";

function FinanceTips() {
  return (
    <>
      <Text h3 type="warning">
        &nbsp;Recommendations based off your score
      </Text>
      <Spacer />
      <Collapse.Group>
        <Collapse title="Track Trends in your Cash Flows">
          <Text>
            The first step that you should take is to analyze the information
            that describes where your money goes and is coming from. You can get
            a snapshot of this data by clicking through Fin-Wrapped. You would
            think the information already exists in your bank statement, but
            plots and visualizations help you identify hidden trends that could
            make or break the profitability of your business. Missing these
            trends could be responsible for huge fluctuations in cash that lead
            to low robustness in times of crisis. To avoid this risk and
            stabilize your financial health, use the data to inform your
            spending decisions.
          </Text>
        </Collapse>
        <Collapse title="Avoid Growing your Expenses">
          <Text>
            One of the factors that influence financial scores is the growth
            rate of your spending. Accounts with slower growth in outflows over
            time are highly favored over ones that grow expenses quickly. Avoid
            incurring expenses in a way that will dramatically increase your
            recent growth on average. Plus, each additional expense larger than
            what was expected by your growth rate will directly increase the
            most recent month’s growth rate, which has a direct impact on your
            Financial Score. Let your existing expenses grow naturally and only
            add new expenditures when they’re paired with a comparable new
            income. However, growth in expenses is natural, and as long your
            incomes grow in a similar way or more you’ll remain financially
            healthy.
          </Text>
        </Collapse>
        <Collapse title="Invest Cash and Drive Income">
          <Text>
            While having a lot of cash on hand will keep your business robust
            during extreme or catastrophic conditions, having too much cash may
            indicate you’re not investing enough in your business. It is best to
            carry enough cash to keep the business afloat for at least a few
            months and invest the rest in ways that will boost your income and
            cut long term expenses. We recommend trying either to grow your
            strongest income streams, or focus on boosting the categories that
            may be lagging.
          </Text>
        </Collapse>
      </Collapse.Group>
    </>
  );
}

export default FinanceTips;
