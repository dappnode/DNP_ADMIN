import React from "react";
import newTabProps from "utils/newTabProps";
export default class PackageDetails extends React.Component {
  render() {
    // function getLinksArray(manifest) {
    //   let homepage = manifest ? manifest.homepage || {} : {};
    //   if (typeof homepage === typeof "String") homepage = { homepage };
    //   else if (typeof homepage !== typeof {}) homepage = {};
    //   return Object.keys(homepage).map(e => ({
    //     name: e,
    //     link: homepage[e]
    //   }));
    // }

    // let manifest = dnp.manifest || {};
    // const links = getLinksArray(manifest).map((e, i) => (
    //   <a key={i} href={e.link}>
    //     {e.name}{" "}
    //   </a>
    // ));

    const dnp = this.props.dnp || {};

    // In the manifest, homepage = {userui: "http://some.link"}
    const linksObj = (dnp.manifest || {}).homepage || {};
    let links;
    if (typeof linksObj === "object") {
      links = Object.keys(linksObj).map(name => ({
        name,
        url: linksObj[name]
      }));
    } else if (typeof linksObj === "string") {
      links = [
        {
          name: "homepage",
          url: linksObj
        }
      ];
    } else {
      links = [];
    }

    // PORTS
    // dnp.ports = [{IP: "0.0.0.0", PrivatePort: 30304, PublicPort: 32770, Type: "tcp"}, ...]
    // dnp.portsToClose = [{number: 32771, type: "TCP"}, ...]
    if (dnp.ports && !Array.isArray(dnp.ports)) {
      console.error("dnp.ports must be an array ", dnp.ports);
      dnp.ports = [];
    }
    if (dnp.portsToClose && !Array.isArray(dnp.portsToClose)) {
      console.error("dnp.portsToClose must be an array ", dnp.portsToClose);
      dnp.portsToClose = [];
    }
    const ports = (dnp.ports || []).map(portObj => {
      const locked = Boolean(
        (dnp.portsToClose || []).find(
          _portObj => String(_portObj.number) === String(portObj.PublicPort)
        )
      );
      return { ...portObj, locked };
    });

    // VOLUMES
    // dnp.volumes = [
    //   { type: "bind",
    //     path: "/etc/hostname" },
    //   { type: "volume",
    //     name: "dncore_ethchaindnpdappnodeeth_data",
    //     path: "/var/lib/docker/volumes/dncore_ethchaindnpdappnodeeth_data/_data",
    //     links: "1",
    //     size: "45.13GB"}
    // ]
    if (dnp.volumes && !Array.isArray(dnp.volumes)) {
      console.error("dnp.volumes must be an array ", dnp.volumes);
      dnp.volumes = [];
    }
    const volumes = (dnp.volumes || [])
      // Order volumes before bind mounts
      .sort(v1 => (v1.type === "volume" ? -1 : 1))
      // Display style:
      // - dncore_vpndnpdappnodeeth_data: 866B
      // - /etc/hostname: - (bind)
      .map(volume => ({
        name: volume.name || volume.path || "unknown",
        size: volume.size || (volume.type === "bind" ? "(bind)" : "unknown")
      }));

    return (
      <div className="mb-4">
        <div className="section-subtitle">Stats</div>
        <div className="card mb-4">
          <div className="card-body">
            <div>
              <strong>Description: </strong>
              {(dnp.manifest || {}).description || "No description"}
            </div>
            <div>
              <strong>Version: </strong>
              {dnp.version + " " + (dnp.origin || "")}
            </div>
            <div>
              <strong>Use link: </strong>
              {dnp.name ? (
                <a href={"http://my." + dnp.name}>{"my." + dnp.name}</a>
              ) : null}
            </div>
            <div>
              <strong>Volumes: </strong>
              {!(dnp.volumes || []).length ? (
                <span>no volumes</span>
              ) : (
                <ul>
                  {volumes.map(({ name, size }) => (
                    <li key={name}>
                      <span style={{ opacity: 0.5 }}>{name}:</span> {size}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <strong>Links: </strong>
              {!(links || []).length ? (
                <span>no links</span>
              ) : (
                <ul>
                  {(links || []).map(({ name, url }) => (
                    <li key={name}>
                      <span style={{ opacity: 0.5 }}>{name || "unnamed"}:</span>{" "}
                      <a href={url} {...newTabProps}>
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <strong>Ports: </strong>
              {!(ports || []).length ? (
                <span>no ports</span>
              ) : (
                <ul>
                  {(ports || []).map((port, i) => (
                    <li key={i}>
                      {port.PrivatePort} -> {port.PublicPort}{" "}
                      {port.Type ? port.Type.toUpperCase() : port.Type}{" "}
                      {port.locked ? (
                        <span style={{ opacity: 0.5 }}>(locked)</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
