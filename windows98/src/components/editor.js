import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { save, setActiveContent } from '../redux/modules/files'

class Editor extends Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    setActiveContent: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired
  };

  contentValueLink () {
    return {
      value: this.props.file.content,
      requestChange: this.props.setActiveContent
    }
  }

  save () {
    this.props.save(this)
  }

  render () {
    return (
      <div>
        <textarea style={{width: '500px', height: '200px'}} valueLink={this.contentValueLink()} />
        <br />
        <button onClick={this.props.save}>Save</button>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  file: state.files.activeFile
})
export default connect((mapStateToProps), {
  setActiveContent: setActiveContent,
  save: save
})(Editor)
