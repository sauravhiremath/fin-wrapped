import "./Landing.css";
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { Row, Image, Spacer, Text, Display, Page } from "@geist-ui/react";
import { useCookies } from "react-cookie";
import Splash from "../../assets/splash.svg";
import UploadFile from "./UploadFile";

function Landing() {
  const [redirect, setRedirect] = useState(null);
  const [cookies, setCookie] = useCookies(["finWrapped"]);

  const handleSubmit = (data) => {
    console.log(data);
    const dataJwt = { data: data };
    setCookie("finWrapped", dataJwt, { path: "/" });

    setRedirect("/home");
  };

  if (redirect || cookies.finWrapped) {
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
        </Page.Content>
        <Page.Footer>
          © https://github.com/sauravhiremath/hex-cambridge-2021
        </Page.Footer>
      </Page>
    </div>
  );
}

export default Landing;
