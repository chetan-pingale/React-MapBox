/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import { push } from 'react-router-redux';
import Constants from '../constants';

export const requestHeaderChange = title => dispatch => {
    dispatch({ type: Constants.UPDATE_HEADER_TITLE, payload: { title } });
};

export const redirectToDashboard = title => dispatch => {
    dispatch(requestHeaderChange(title));
    dispatch(push('/dashboard'));
}


