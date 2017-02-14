/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { Grid, Row, Col, Nav, NavItem } from 'react-bootstrap';
import _ from 'lodash';


/*<li className="inactive" onClick={props.handleDrawLine}>Draw Line</li>
 <li className="inactive" onClick={props.handleDrawPolygon}>Draw Polygon</li>
 <li className="active" onClick={props.handleAddPointsClick}>Draw Point</li>
 <li className="inactive" onClick={props.handleAddPopup}>Draw Popup</li>
 */
const Dashboard = props => (
  <Grid fluid>
    <Row>
      <Col md={3} mdOffset={1}>
        <h3>{props.headerTitle || 'Line'}</h3>
      </Col>
    </Row>
    <Row>
      <Col md={3} mdOffset={1}>
        <ul className="nav-list-item">
          {_.map(props.navListItems , (navItem, index) => {
            return (
              <li key={index} className={navItem.isActive ? 'active' : 'inactive'} onClick={navItem.clickHandler}> {navItem.navTitle} </li>
            );
          })}
        </ul>
      </Col>
    </Row>
    <Row>
      <div id="map" style={props.styles.map} />
    </Row>
  </Grid>
);

Dashboard.propTypes = {
    headerTitle: React.PropTypes.string,
    navListItems: React.PropTypes.array,
    styles: React.PropTypes.object,
}
export default Dashboard;
