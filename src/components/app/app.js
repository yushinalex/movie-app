import React, { Component } from 'react';

export default class App extends Component {
  state = {
    label: 'lol',
  };

  render() {
    return (
      <div>
        <p>{this.state.label}</p>
      </div>
    );
  }
}
