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
        <Collapse title="Make Corrections to Your Credit Report">
          <Text>
            The first step that you should take is to analyze the information
            that is being reported by all three of the major consumer credit
            reporting agencies, Experian, Equifax, and TransUnion. You can get a
            free copy of your credit report through{" "}
            <Link
              href="https://www.annualcreditreport.com/index.action"
              icon
              color
            >
              AnnualCreditReport.com.
            </Link>
            You would think the information they’re reporting about you is
            correct, but errors are common. These errors could be partially
            responsible for your lower credit rating. To correct errors on your
            credit report you should contact the companies reporting bad data,
            then dispute the items on your credit report with each credit bureau
            that is reporting the inaccurate information.
          </Text>
        </Collapse>
        <Collapse title="Avoid Opening Too Many New Accounts">
          <Text>
            One of the factors that influence credit scores is the age of your
            accounts. Accounts that have been established for many years are
            viewed as more favorable than newer accounts. Avoid opening too many
            new accounts as this can dramatically lower the overall age of your
            open accounts. Plus, with each new application a “hard inquiry” is
            noted on your credit report which can also bring down your credit
            score. Let your existing accounts age naturally to see a slow
            improvement in your credit rating over time. Only open an account or
            two as needed and use those accounts to build up your credit by
            continuously making your payments on time. Conversely, opening a new
            account can have a positive impact on your credit by reducing your
            <Link
              href="https://www.thebalance.com/what-is-a-good-credit-utilization-ratio-960548"
              icon
              color
            >
              credit utilization ratio
            </Link>
            . However, you can also do this by simply asking for a credit limit
            increase on your existing accounts rather than opening new ones.
          </Text>
        </Collapse>
        <Collapse title="Reduce Your Credit Card Balances">
          <Text>
            Credit reporting agencies also analyze the balances on your credit
            cards and other{" "}
            <Link
              href="https://www.lendingtree.com/glossary/revolving-debt/"
              icon
              color
            >
              revolving debt
            </Link>
            . If you carry balances that are close to the limit, this will
            significantly hurt your credit score. It is best to carry as little
            revolving debt as possible from one month to the next. If you must
            carry a balance, make a strong effort to reduce the balances so that
            are using less than thirty percent of your available credit at any
            given time.
          </Text>
        </Collapse>
      </Collapse.Group>
    </>
  );
}

export default FinanceTips;
