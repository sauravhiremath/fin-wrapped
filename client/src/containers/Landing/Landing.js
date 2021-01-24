import "./Landing.css";
import { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Row,
  Image,
  Spacer,
  Text,
  Display,
  Page,
  Card,
  Col,
} from "@geist-ui/react";
import { useCookies } from "react-cookie";
import Splash from "../../assets/splash.svg";
import UploadFile from "./UploadFile";
import { Grid } from "@geist-ui/react-icons";

function Landing() {
  const [redirect, setRedirect] = useState(null);
  const [cookies, setCookie] = useCookies(["finWrapped"]);
  const [scenario, setScenario] = useState(null);

  const handleSubmit = (data) => {
    console.log(data);
    const dataJwt = { data: data };
    setCookie("finWrapped", dataJwt, { path: "/" });
    setScenario("pizza");

    setRedirect("/home");
  };

  if (redirect || cookies.finWrapped || scenario) {
    return <Redirect to="/home" />;
  }

  return (
    <div className="landing">
      <Page size="large" dotBackdrop>
        <Page.Header></Page.Header>
        <Page.Content>
          <Row span={6} justify="center">
            <Text h1 size="6vw">
              Fin
            </Text>
            <Text h1 size="6vw" type="warning">
              Wrapped
            </Text>
          </Row>
          <Text h3>Is your business truly crisis-proof?</Text>
          <Display width="30vw">
            <Image src={Splash} />
          </Display>
          <Spacer y={3} />
          <Text h5 type="secondary">
            Grow your business with monthly reports
          </Text>
          <Text h5 type="secondary">
            Crisis handling estimates and predictions
          </Text>
          <Spacer y={1.5} />
          <UploadFile handleSubmit={handleSubmit} />
          <Spacer y={1.5} />
          <h3>History (choose one)</h3>
          <Row justify="center" gap={0.8} style={{ marginBottom: "15px" }}>
            <Col span={4}>
              <Card hoverable type="cyan" onClick={(e) => setScenario("hair")}>
                <p>Hair Dresser Scenario</p>
              </Card>
            </Col>
            <Col span={4}>
              <Card hoverable type="cyan" onClick={(e) => setScenario("pizza")}>
                <p>Pizza Delivery Scenario</p>
              </Card>
            </Col>
          </Row>
        </Page.Content>
        <Page.Footer>
          © https://github.com/sauravhiremath/hex-cambridge-2021
        </Page.Footer>
      </Page>
    </div>
  );
}

export default Landing;
