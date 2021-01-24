import "./Home.css";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Note, Card, Spacer, Table, Pagination, Select } from "@geist-ui/react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import NumberEasing from "react-number-easing";

import { getColorForPercentage } from "../../helpers";
import { useState } from "react";
import FinanceTips from "./FinanceTips";

function RobustnessScore({ data }) {
  const [month, setMonth] = useState(0);
  const projectionsData = data["projections"];
  const robustnessScore = projectionsData[month][`${month + 1}`].filter(
    (ele) => ele.name === "Robustness Score"
  )[0].value;

  const gradientOffset = () => {
    const data = projectionsData[month][`${month + 1}`].slice(0, -2);
    const dataMax = Math.max(...data.map((i) => i.value));
    const dataMin = Math.min(...data.map((i) => i.value));

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
        Robustness Score
        <h1
          style={{
            color: getColorForPercentage(robustnessScore / 100),
          }}
        >
          <NumberEasing
            value={robustnessScore}
            speed={3000}
            decimals={1}
            ease="cubicOut"
          />
          %
        </h1>
      </h2>
      There is quite some scope for improvement. See statistics below!
      <Spacer y={2} />
      <h3>
        Burnout Rate
        <Spacer />
        <Select
          placeholder="Choose month"
          onChange={(v) => setMonth(parseInt(v))}
          initialValue="0"
        >
          <Select.Option value="0">Current month</Select.Option>
          <Select.Option value="1">Next Month</Select.Option>
          <Select.Option value="2">March</Select.Option>
          <Select.Option value="3">April</Select.Option>
          <Select.Option value="4">May</Select.Option>
          <Select.Option value="5">June</Select.Option>
        </Select>
      </h3>
      <Spacer y={2} />
      <AreaChart
        width={1000}
        height={400}
        data={projectionsData[month][`${month + 1}`].slice(0, -2)}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <defs>
          <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset={off} stopColor="green" stopOpacity={1} />
            <stop offset={off} stopColor="red" stopOpacity={1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          stroke="#000"
          fill="url(#splitColor)"
        />
      </AreaChart>
      <Spacer />
      <Spacer y={3} />
      <FinanceTips />
      <Spacer y={3} />
      <Note label="HOW IS IT CALCULATED?">
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

const getCategories = (projections) => {
  const result = [];
  projections.forEach((item) => {
    const category = Object.keys(item)[0];
    result.push(category);
  });

  return result;
};

export default RobustnessScore;
