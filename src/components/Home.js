import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Table, Button } from 'reactstrap';

class Home extends Component {
  render () {
    return (
      <div>
        <div>
          <h2>Ethereum 全明星技術座談會</h2>
          <p>
            Taipei Ethereum Meetup 社群邀起到了 Ethereum 區塊鏈生態系中擔任不同角色的開發者與研究人員來台展開兩場座談會，其中內容包括了擴展性方案 Sharding client 以及當下的開發與研究進度座談。
              </p>
          <p>
            本活動為免費活動，但將透過 Ethereum 智能合約收取 Ether 押金，當天出席活動後將會退還押金。
              </p>
          <h3>Agenda</h3>
          <p>本活動將於 2018/3/21 週三晚間舉辦，活動大綱如下：</p>
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Topic</th>
                <th>Guests</th>
                <th>Host</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>19:00 - 19:30</td>
                <td>Networking</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>19:30 - 20:10</td>
                <td>Panel 1: Sharding Clients</td>
                <td>TBD</td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
              <tr>
                <td>20:10 - 20:25</td>
                <td>Break</td>
                <td>-</td>
                <td>-</td>
              </tr>
              <tr>
                <td>20:25 - 21:05</td>
                <td>Panel 2: Ethereum Research Work</td>
                <td>TBD</td>
                <td><a href="https://twitter.com/karl_dot_tech" target="_blank" rel="noopener noreferrer">Karl Floersch</a></td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="text-center">
          <Button tag={Link} to="/register" color="primary" size="lg">報名</Button>
        </div>
      </div>
    );
  }
}

export default Home;
