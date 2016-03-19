import React, { Component } from 'react'

export default class File extends Component {
 render() { 
  return <div><a onClick={this._handleClick.bind(this)}>{this.props.name}</a></div>;
 }
 _handleClick() {
  console.log(this.props.url);
 }
}
