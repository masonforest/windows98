import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class File extends Component {
  static propTypes = {
    editFile: PropTypes.func.isRequired,
  };

  render () {
    return <div><a onClick={this.props.editFile}>{this.props.name}</a></div>
  }
  _handleClick () {
    console.log(this.props.url)
  }
}

const mapStateToProps = (state) => ({
  files: state.files
})
export default connect((mapStateToProps), {
  editFile: () => editFile()
})(File)
