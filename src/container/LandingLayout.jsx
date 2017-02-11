/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as applicationActionCreators from '../actions/application';
import LandingLayoutComponent from '../component/LandingLayout';

class LandingLayout extends React.Component {
    constructor(props) {
        super(props);
        this.navigateToDashbord = this.navigateToDashbord.bind(this);
    }
    navigateToDashbord() {
        this.props.actions.redirectToDashboard('Dashboard');
    }
    render() {
        return (
          <LandingLayoutComponent
            navigateToDashbord={this.navigateToDashbord}
            {...this.state}
          />
        );
    }
}

LandingLayout.propTypes = {
    actions: React.PropTypes.object,
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(applicationActionCreators, dispatch),
});

export default connect(null, mapDispatchToProps)(LandingLayout);