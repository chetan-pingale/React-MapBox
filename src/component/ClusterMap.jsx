/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import _ from 'lodash';

const CluserMap = props => (
  <Grid fluid>
    <Row>
      <Col md={3} mdOffset={1}>
        <ol className="breadcrumb">
          <li><a onClick={props.navigateToHome}>Home</a></li>
          <li className="active">Cluster Map</li>
        </ol>
      </Col>
    </Row>
    <Row>
      <Col md={3} mdOffset={1}>
        <h3>{props.headerTitle || 'Select Action'}</h3>
      </Col>
    </Row>
    <Row>
      <Col md={3} mdOffset={1}>
        <ul className="nav-list-item">
          {_.map(props.navListItems, (navItem, index) => {
              return (
                <li
                  key={index + 1}
                  className={navItem.isActive ? 'active' : 'inactive'}
                  onClick={(event) => navItem.clickHandler(event, navItem.id)}
                >
                  {navItem.navTitle}
                </li>
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

CluserMap.propTypes = {
    headerTitle: React.PropTypes.string,
    navListItems: React.PropTypes.array,
    navigateToHome: React.PropTypes.func,
    styles: React.PropTypes.object,
}
export default CluserMap;
