/**
 * Created by Chetan.Pingale on 10-02-2017.
 */
import _ from 'lodash';
import Constants from '../constants';

const initialState = {
    headerTitle: '',
};

const application = (state = initialState, action) => {
    switch (action.type) {
        case Constants.UPDATE_HEADER_TITLE: {
            let header = _.cloneDeep(state.headerTitle);
            header = action.payload.title;
            return {
                ...state,
                headerTitle: header,
            };
        }
        default:
            return state;
    }
}
export default application;
