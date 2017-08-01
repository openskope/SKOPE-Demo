import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import React from 'react';
import { Button } from 'muicss/react';

export default class HomePage extends React.Component {
  render() {
    return (
      <div className="page--home">
        <div className="row_1">
          <div className="box">
            <div className="box_body">
              Find and download paleoenvironmental data!
              <a href={FlowRouter.url('/search')}>
              <Button color="primary">Search</Button>
              </a>
            </div>
          </div>
          <div className="box">
            <div className="box_body">
              Compare and compute paleoenvironmental reconstructions!
              <a href={FlowRouter.url('/workspace')}>
                <Button color="primary">Workspace</Button>
              </a>
            </div>
          </div>
          <div className="box">
            <div className="box_body">
              Contribute your paleoenvironmental model!
              <a href={FlowRouter.url('/model')}>
                <button>Model</button>
              </a>
            </div>
          </div>
        </div>

        <div className="row_2">
          <p>
            <b>Welcome to SKOPE: Synthesizing Knowledge of Past Environments!</b>
          </p>
          <p>
            SKOPE allows you to discover, examine, and download paleoenvironmental data:
          </p>
        </div>

        <div className="row_3">
          <div className="box">
            <div className="box_body">
              Some Data
            </div>
          </div>
          <div className="box">
            <div className="box_body">
              Some Data
            </div>
          </div>
          <div className="box">
            <div className="box_body">
              Some Data
            </div>
          </div>
          <div className="box">
            <div className="box_body">
              Some Data
            </div>
          </div>
        </div>
      </div>
    );
  }
}
