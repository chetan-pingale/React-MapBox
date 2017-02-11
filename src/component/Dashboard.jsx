/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';

const Dashboard = props => (
  <Grid fluid>
    <Row>
      <Col md={5} mdOffset={2}>
        <h3>{props.headerTitle || 'Dashboard Page'}</h3>
      </Col>
    </Row>
    <Row>
      <Col md={5} mdOffset={2}>
        Actions
        <ul>
          <li className="custom-link" onClick={props.handleDrawLine}>Draw Line</li>
          <li className="custom-link" onClick={props.handleDrawPolygon}>Draw Polygon</li>
          <li className="custom-link" onClick={props.handleAddPointsClick}>Draw Point</li>
          <li className="custom-link" onClick={props.handleAddPopup}>Draw Popup</li>
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
    styles: React.PropTypes.object,
    handleAddPopup: React.PropTypes.func,
    handleDrawLine: React.PropTypes.func,
    handleDrawPolygon: React.PropTypes.func,
    handleAddPointsClick: React.PropTypes.func,
}
export default Dashboard;
