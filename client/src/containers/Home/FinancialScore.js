import "./Home.css";
import { useState } from "react";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Note, Card, Spacer, Table, Pagination } from "@geist-ui/react";
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
  const financialScore = data["financial health"];
  const originalData = data["original data"];
  const projectionsData = getProjectionsBy(data["projections"]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("Sales");

  const gradientOffset = () => {
    const data = projectionsData[type];
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
          color: getColorForPercentage(financialScore / 100),
        }}
      >
        <NumberEasing
          value={financialScore}
          speed={3000}
          decimals={1}
          ease="cubicOut"
        />
      </h1>
      You seem to be doing good, but you can still improve!
      <Spacer y={2} />
      <h3>Expenses</h3>
      <Spacer />
      <AreaChart
        width={1000}
        height={400}
        data={projectionsData[type]}
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
      <Table data={originalData.slice(page, page + 5)}>
        <Table.Column prop="Category" label="Category" />
        <Table.Column prop="Amount" label="Amount" />
        <Table.Column prop="Date" label="Date" />
      </Table>
      <Spacer />
      <Pagination
        count={parseInt(originalData.length / 5)}
        initialPage={page}
        limit={5}
        onChange={(v) => setPage(v)}
      />
      <Spacer y={3} />
      <FinanceTips />
    </Card>
  );
}

const getProjectionsBy = (projections) => {
  const result = {};
  projections.forEach((item, index) => {
    const month = index + 1;
    item[`${month}`].forEach((ele) => {
      if (result[ele.name] !== undefined) {
        result[ele.name].push({ name: month, value: ele.value });
      } else {
        result[ele.name] = [{ name: month, value: ele.value }];
      }
    });
  });
  console.log(result);
  return result;
};

export default FinancialScore;
