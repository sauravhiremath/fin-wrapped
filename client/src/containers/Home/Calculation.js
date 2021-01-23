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
import { FastForward, Anchor, Code, CheckInCircle } from "@geist-ui/react-icons";
import {
  Tabs,
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

function Calculation() {
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
          The Evil Rabbit Jumped over the Fence.
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
