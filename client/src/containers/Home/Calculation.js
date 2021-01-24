import "./Home.css";
import {
  FastForward,
  Anchor,
  Code,
  CheckInCircle,
} from "@geist-ui/react-icons";
import { Tabs, Card } from "@geist-ui/react";
import FinancialScore from "./FinancialScore";
import RobustnessScore from "./RobustnessScore";
import Expenditure from "./Expenditure";

function Calculation({ data }) {
  return (
    <Card>
      <Tabs initialValue="0">
        <Tabs.Item
          label={
            <>
              <FastForward /> Projections
            </>
          }
          value="0"
        >
          <RobustnessScore data={data} />
          <FinancialScore data={data} />
        </Tabs.Item>
        <Tabs.Item
          label={
            <>
              <Code /> Expenditure and Income
            </>
          }
          value="2"
        >
          <Expenditure data={data} />
        </Tabs.Item>
      </Tabs>
    </Card>
  );
}

export default Calculation;
