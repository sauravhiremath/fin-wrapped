import "./Home.css";
import { useCookies } from "react-cookie";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Redirect } from "react-router-dom";
import {
  Row,
  Breadcrumbs,
  Spacer,
  Text,
  Button,
  Page,
  Col,
  Card,
  Grid,
  Image,
  Link,
} from "@geist-ui/react";
import NumberEasing from "react-number-easing";
import { useState } from "react";
import Calculation from "./Calculation";
import mockData from "../../data.json";
import { getColorForPercentage } from "../../helpers";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function Home() {
  const [cookies] = useCookies(["finWrapped"]);
  const [pieIndex, setPieIndex] = useState(0);
  const [incomeIndex, setIncomeIndex] = useState(0);
  const [data, setData] = useState(mockData);

  if (!cookies.finWrapped) {
    return <Redirect to="/" />;
  }

  return (
    <Page size="large" dotBackdrop>
      <Page.Header></Page.Header>
      <Page.Content>
        <Grid.Container gap={2} justify="center">
          <Grid xs={24}>
            <h1>Monthly Report</h1>
          </Grid>
          <Grid xs={12}>
            <Card shadow>
              <Card.Content>
                <h1
                  style={{
                    color: getColorForPercentage(
                      data["financial health"] / 100
                    ),
                  }}
                >
                  <NumberEasing
                    value={data["financial health"]}
                    speed={3000}
                    decimals={1}
                    ease="cubicOut"
                  />
                  %
                </h1>
                <h3>Financial Score</h3>
              </Card.Content>
              <Card.Footer>
                <Link
                  block
                  target="_blank"
                  href="https://github.com/geist-org/react"
                >
                  View calculation
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card shadow>
              <Card.Content>
                <h1
                  style={{
                    color: getColorForPercentage(
                      data["robustness score"] / 100
                    ),
                  }}
                >
                  <NumberEasing
                    value={data["robustness score"]}
                    speed={3000}
                    decimals={1}
                    ease="cubicOut"
                  />
                  %
                </h1>
                <h3>Robustness Score</h3>
              </Card.Content>
              <Card.Footer>
                <Link
                  block
                  target="_blank"
                  href="https://github.com/geist-org/react"
                >
                  View calculation
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card shadow>
              <Card.Content style={{ justifyContent: "center" }}>
                <PieChart width={500} height={400}>
                  <Pie
                    activeIndex={pieIndex}
                    activeShape={renderActiveShape}
                    data={data["expense data"]}
                    cx={250}
                    cy={200}
                    innerRadius={100}
                    outerRadius={120}
                    fill="#ffa500"
                    dataKey="value"
                    onMouseMove={({ name }) =>
                      setPieIndex(
                        data["expense data"].findIndex((x) => x.name === name)
                      )
                    }
                  >
                    {data["expense data"].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <h3>Expenditure</h3>
              </Card.Content>
              <Card.Footer>
                <Link
                  block
                  target="_blank"
                  href="https://github.com/geist-org/react"
                >
                  View calculation
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
          <Grid xs={12}>
            <Card shadow>
              <Card.Content>
                <PieChart width={500} height={400}>
                  <Pie
                    activeIndex={incomeIndex}
                    activeShape={renderActiveShape}
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data["income data"]}
                    cx={220}
                    cy={200}
                    outerRadius={100}
                    fill="#ffa500"
                    onMouseMove={({ name }) =>
                      setIncomeIndex(
                        data["income data"].findIndex((x) => x.name === name)
                      )
                    }
                  >
                    {data["income data"].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
                <h3>Income Simplified</h3>
              </Card.Content>
              <Card.Footer>
                <Link
                  block
                  target="_blank"
                  href="https://github.com/geist-org/react"
                >
                  View calculation
                </Link>
              </Card.Footer>
            </Card>
          </Grid>
          <Spacer y={3} />
          <Grid xs={24}>
            <h1>Prediction + Analysis</h1>
          </Grid>
          <Grid xs={24}>
            <Calculation data={data} />
          </Grid>
        </Grid.Container>
      </Page.Content>
    </Page>
  );
}

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`$${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Share ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default Home;
