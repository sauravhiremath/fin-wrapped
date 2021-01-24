import "./Home.css";
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
  const robustnessScore = data["robustness score"];
  const projectionsData = data["projections"];
  const originalData = data["original data"];
  const [month, setMonth] = useState(1);

  const gradientOffset = () => {
    console.log(projectionsData[month][`${month + 1}`]);
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
      There is quite some scope for improvement. See statistics below!
      <Spacer y={2} />
      <h3>
        Burnout Rate
        <Spacer />
        <Select placeholder="Choose month" onChange={setMonth} initialValue="0">
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
    </Card>
  );
}

export default RobustnessScore;
