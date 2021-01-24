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

function Hypothetical({ data }) {
  const categories = getCategories(data["finance per category"]);
  const [category, setCategory] = useState(categories[0]);
  const [page, setPage] = useState(1);
  const financePerCategory = getProjectionsBy(data["finance per category"]);
  const originalData = data["original data"];

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
      <h2>Expense & Income Analysis</h2>
      <Spacer y={2} />
      <Select
        placeholder="Choose category"
        onChange={setCategory}
        initialValue={category}
      >
        {categories.map((category) => (
          <Select.Option value={category}>{category}</Select.Option>
        ))}
      </Select>
      <Spacer y={2} />
      <AreaChart
        width={1000}
        height={400}
        data={financePerCategory[category]}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
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
          dataKey="amount"
          stroke="#000"
          fill="url(#splitColor)"
        />
      </AreaChart>
      <Spacer y={3} />
      <h3>Expenses</h3>
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

export default Hypothetical;
