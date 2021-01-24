import "./Home.css";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useState } from "react";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Note, Card, Spacer, Table, Pagination, Select } from "@geist-ui/react";
import NumberEasing from "react-number-easing";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getColorForPercentage } from "../../helpers";
import FinanceTips from "./FinanceTips";

function FinancialScore({ data }) {
  const categories = getCategories(data["finance per category"]);
  const [category, setCategory] = useState(categories[0]);
  const financePerCategory = getProjectionsBy(data["finance per category"]);
  const financialScore = data["projections"][0][`1`].filter(
    (ele) => ele.name === "Financial Health"
  )[0].value;
  console.log(financePerCategory);

  const gradientOffset = () => {
    const data = financePerCategory[category];
    const dataMax = Math.max(...data.map((i) => i.amount));
    const dataMin = Math.min(...data.map((i) => i.amount));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <Card type="lite">
      <h2>
        Financial Health
        <h1
          style={{
            color: getColorForPercentage(financialScore / 100),
          }}
        >
          <NumberEasing
            value={financialScore}
            speed={3000}
            decimals={1}
            ease="cubicOut"
          />
          %
        </h1>
      </h2>
      <Spacer y={2} />
      <FinanceTips />
      <Spacer y={3} />
      <Note
        label="HOW IS financial health CALCULATED?"
        className="financial-note"
        id={"financial-note"}
      >
        <Spacer />
        The Financial Score scales directly with excess growth in incomes when
        compared with growth in expenses. This means that even if your bank
        account doesn’t look great, you can be financially healthy in the long
        run as long as your incomes are growing faster than your expenses. To
        improve your score, try to develop a trend of growing incomes and
        regularly cutting costs.
        <Spacer />
        Here’s the formula. When you’re reading it,{" "}
        <InlineMath>{"r_i"}</InlineMath> is the growth rate of incomes and{" "}
        <InlineMath>{"r_e"}</InlineMath> is the growth rate of expenses.
        <Spacer />
        <BlockMath>{`100\\cdot \\frac{1}{1 + e^{-1.5\\cdot(r_i - r_e)}}`}</BlockMath>
      </Note>
      <Spacer y={1} />
      <Note
        label="HOW IS robustness CALCULATED?"
        className="robustness-note"
        id={"robustness-note"}
      >
        <Spacer />
        The Financial Score scales directly with excess growth in incomes when
        compared with growth in expenses. This means that even if your bank
        account doesn’t look great, you can be financially healthy in the long
        run as long as your incomes are growing faster than your expenses. To
        improve your score, try to develop a trend of growing incomes and
        regularly cutting costs.
        <Spacer />
        Here’s the formula, <InlineMath>{"m"}</InlineMath> is your survivability{" "}
        , which measures how many times over your account could cover last
        month’s expenses.
        <Spacer />
        <BlockMath>{`100(1 - e^{-m/5})`}</BlockMath>
      </Note>
    </Card>
  );
}

const getProjectionsBy = (projections) => {
  const result = {};
  projections.forEach((item) => {
    const category = Object.keys(item)[0];
    if (result[category] !== undefined) {
      result[category].push(item[category]);
    } else {
      result[category] = item[category];
    }
  });
  console.log(result);
  return result;
};

const getCategories = (projections) => {
  const result = [];
  projections.forEach((item) => {
    const category = Object.keys(item)[0];
    result.push(category);
  });

  return result;
};

export default FinancialScore;
