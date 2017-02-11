/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { Row, Col, Grid } from 'react-bootstrap';

const LandingLayoutComponent = props => (
  <Grid fluid>
    <Row>
      <Col mdOffset={4} md={4}>
        <h4>Landing Layout Page</h4>
      </Col>
    </Row>
    <Row>
      <Col mdOffset={4} md={4}>
        <ul className="list-items">
          <li onClick={props.navigateToDashbord}>
            <h4>Navigate To Dashboard </h4>
          </li>
        </ul>
      </Col>
    </Row>
  </Grid>
);

LandingLayoutComponent.propTypes = {
    navigateToDashbord: React.PropTypes.func,
};

export default LandingLayoutComponent;
