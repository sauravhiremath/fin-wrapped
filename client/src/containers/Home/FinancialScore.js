import "./Home.css";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Note, Card, Spacer, Table, Pagination } from "@geist-ui/react";
import NumberEasing from "react-number-easing";

import { getColorForPercentage } from "../../helpers";
import { useState } from "react";
import FinanceTips from "./FinanceTips";

function FinancialScore({ data }) {
  const financialScore = data["financial health"];
  const originalData = data["original data"];
  const [page, setPage] = useState(1);

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

export default FinancialScore;
