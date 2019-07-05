import React from "react";
import { title, rootPath } from "../data";
import { Link } from "react-router-dom";
import newTabProps from "utils/newTabProps";
// Components
import Title from "components/Title";
import Card from "components/Card";
import SubTitle from "components/SubTitle";
import { ButtonLight } from "components/Button";

const SDK_GUIDE_LINK =
  "https://github.com/dappnode/DAppNodeSDK/wiki/DAppNode-SDK-tutorial";

const subRoutes = [
  {
    title: "Publish DAppNode Packages",
    subtitle: `To an Aragon's APM registry`,
    route: "publish"
  }
  // {
  //   title: "Explore repos",
  //   subtitle: `Of Aragon's APM registries`,
  //   route: "explore"
  // }
];

function SdkHome() {
  return (
    <>
      <Title title={title} />
      <SubTitle>What is the SDK?</SubTitle>
      <Card>
        <p>
          The DAppNode Software Development Kit (dappnodesdk) is a tool to make
          as simple as possible the creation of new dappnode packages. It helps
          to initialize and publish an Aragon Package Manager Repo in the
          ethereum mainnet.
        </p>
        <p>
          We have deployed a public APM (Aragon Package Manager) registry in
          which anyone can create their own APM repository:{" "}
          <a href="https://etherscan.io/address/public.dappnode.eth">
            public.dappnode.eth
          </a>
        </p>
        <div
          className="alert alert-secondary"
          role="alert"
          style={{ backgroundColor: "#f1f1f3" }}
        >
          The <strong>dappnodesdk</strong> is a <strong>CLI tool</strong>. This
          section provides only additional complimentary functionality
        </div>
        <p>
          The dappnodesdk can be installed locally with npm. Then you can
          initialize a DAppNode Package, build it's docker image and publish it on the Aragon
          Package Manager (APM) on the ethereum mainnet
        </p>

        <a
          className="btn btn-outline-secondary float-right"
          href={SDK_GUIDE_LINK}
          {...newTabProps}
        >
          Full Guide
        </a>
      </Card>

      <SubTitle>What can the SDK do?</SubTitle>
      {subRoutes.map(({ title, subtitle, route }) => (
        <Card key={title} className="sdk-link">
          <div>
            <h5 className="card-title">{title}</h5>
            <div style={{ opacity: "0.5" }}>{subtitle}</div>
          </div>
          <Link to={rootPath + "/" + route}>
            <ButtonLight>{route}</ButtonLight>
          </Link>
        </Card>
      ))}
    </>
  );
}

export default SdkHome;
