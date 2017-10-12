/**
 * Not-found page.
 */

import React from 'react';
import {
  connect,
} from 'react-redux';
import * as actions from '/imports/ui/actions';

import Component from './component';

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const {
      model: {
        inspectPointSelected,
        inspectPointCoordinate,

        mapShown,
        predictionYears,
        meanVar,
        minWidth,
      },
    } = state;

    return {
      inspectPointSelected,
      inspectPointCoordinate,
      mapShown,
      predictionYears,
      meanVar,
      minWidth,
    };
  },
  // mapDispatchToProps
  (dispatch, ownProps) => ({
    selectInspectPoint: (coordinate) => {
      dispatch({
        type: actions.MODEL_INSPECT_POINT.type,
        selected: true,
        coordinate,
      });
    },
    toggleMap: () => {
      dispatch({
        type: actions.MODEL_TOGGLE_MAP.type,
      });
    },
    updateForm: (values) => {
      dispatch({
        type: actions.MODEL_UPDATE_FORM.type,
        values,
      });
    },
  }),
)(Component);
