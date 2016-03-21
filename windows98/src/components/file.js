import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { editFile } from '../redux/modules/files'

class File extends Component {
  static propTypes = {
    editFile: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired
  };

  constructor () {
    super()
    this._onClick = this._onClick.bind(this)
  }

  render () {
    return <div><a onClick={this._onClick}>{this.props.file.name}</a></div>
  }
  _onClick () {
    this.props.editFile(this.props.file)
  }
}

const mapStateToProps = (state) => ({
  activeFile: state.files.activeFile
})
export default connect((mapStateToProps), {
  editFile: (file) => editFile(file)
})(File)
