import "./Home.css";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Tabs, Card } from "@geist-ui/react";
import FinancialScore from "./FinancialScore";

function Calculation({ data }) {
  return (
    <Card>
      <Tabs initialValue="0">
        <Tabs.Item
          label={
            <>
              <FastForward /> Financial Score
            </>
          }
          value="0"
        >
          <FinancialScore data={data} />
        </Tabs.Item>
        <Tabs.Item
          label={
            <>
              <Anchor /> Robustness Score
            </>
          }
          value="1"
        >
          The Fence Jumped over The Evil Rabbit.
        </Tabs.Item>
        <Tabs.Item
          label={
            <>
              <Code /> Expenditure
            </>
          }
          value="2"
        >
          The Evil Rabbit Jumped over the Fence.
        </Tabs.Item>
        <Tabs.Item
          label={
            <>
              <CheckInCircle /> Income
            </>
          }
          value="3"
        >
          The Fence Jumped over The Evil Rabbit.
        </Tabs.Item>
      </Tabs>
    </Card>
  );
}

export default Calculation;
