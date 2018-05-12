import React from 'react'
import { MdDashboard, MdDevices, MdSettingsApplications,
    MdAddBox, MdCreateNewFolder, MdFolder,
  MdSync } from 'react-icons/lib/md'
  
export default class SyncStatus extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle mr-lg-2" id="alertsDropdown" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <MdSync/> Sync Status
          <span class="d-lg-none">Alerts
            <span class="badge badge-pill badge-warning">6 New</span>
          </span>
          <span class="indicator text-warning d-none d-lg-block">
            <MdSync/>
          </span>
        </a>
        <div class="dropdown-menu" aria-labelledby="alertsDropdown">
          <h6 class="dropdown-header">Sync status:</h6>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">
            <span class="text-success">
              <strong>
                <MdSync/>Status Update</strong>
            </span>
            <span class="small float-right text-muted">11:21 AM</span>
            <div class="dropdown-message small">This is an automated server response message. All systems are online.</div>
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">
            <span class="text-danger">
              <strong>
                <span class="fa fa-long-arrow-down fa-fw">fa-long-arrow-down</span>Status Update</strong>
            </span>
            <span class="small float-right text-muted">11:21 AM</span>
            <div class="dropdown-message small">This is an automated server response message. All systems are online.</div>
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#">
            <span class="text-success">
              <strong>
                <i class="fa fa-long-arrow-up fa-fw"></i>Status Update</strong>
            </span>
            <span class="small float-right text-muted">11:21 AM</span>
            <div class="dropdown-message small">This is an automated server response message. All systems are online.</div>
          </a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item small" href="#">View all alerts</a>
        </div>
      </li>
    )
  }
}
