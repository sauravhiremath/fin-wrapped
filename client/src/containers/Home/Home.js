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

function Home() {
  const [cookies] = useCookies(["finWrapped"]);
  const [pieIndex, setPieIndex] = useState(0);

  if (!cookies.finWrapped) {
    return <Redirect to="/" />;
  }

  const data = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const radarData = [
    {
      income: "Active source",
      A: 120,
      B: 110,
      fullMark: 150,
    },
    {
      income: "Bonuses",
      A: 98,
      B: 130,
      fullMark: 150,
    },
    {
      income: "Stocks",
      A: 86,
      B: 130,
      fullMark: 150,
    },
    {
      income: "Side money",
      A: 99,
      B: 100,
      fullMark: 150,
    },
    {
      income: "Gifts",
      A: 85,
      B: 90,
      fullMark: 150,
    },
    {
      income: "Others",
      A: 65,
      B: 85,
      fullMark: 150,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

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
                <h1 style={{ color: getColorForPercentage(0.9) }}>
                  <NumberEasing
                    value={90}
                    speed={3000}
                    decimals={0}
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
                <h1 style={{ color: getColorForPercentage(0.3) }}>
                  <NumberEasing
                    value={30}
                    speed={3000}
                    decimals={0}
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
                <PieChart width={400} height={400}>
                  <Pie
                    activeIndex={pieIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx={200}
                    cy={200}
                    innerRadius={90}
                    outerRadius={100}
                    fill="#ffa500"
                    dataKey="value"
                    onMouseMove={({ name }) =>
                      setPieIndex(data.findIndex((x) => x.name === name))
                    }
                  >
                    {data.map((entry, index) => (
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
                <RadarChart
                  cx={200}
                  cy={200}
                  outerRadius={100}
                  width={400}
                  height={400}
                  data={radarData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="income" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Saurav"
                    dataKey="A"
                    stroke="#ffa500"
                    fill="#ffa500"
                    fillOpacity={0.6}
                  />
                </RadarChart>
                <h3>Income Radar</h3>
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
            <Calculation />
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
      >{`PV ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

var percentColors = [
  { pct: 0.0, color: { r: 0xff, g: 0x00, b: 0 } },
  { pct: 0.5, color: { r: 0xff, g: 0xff, b: 0 } },
  { pct: 1.0, color: { r: 0x00, g: 0xff, b: 0 } },
];

var getColorForPercentage = function (pct) {
  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;
  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };
  return "rgb(" + [color.r, color.g, color.b].join(",") + ")";
  // or output as hex if preferred
};

export default Home;
