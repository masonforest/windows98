/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchFiles } from '../../redux/modules/files'
import File from '../../components/file'
import DuckImage from './Duck.jpg'
import classes from './HomeView.scss'

// We can use Flow (http://flowtype.org/) to type our component's props
// and state. For convenience we've included both regular propTypes and
// Flow types, but if you want to try just using Flow you'll want to
// disable the eslint rule `react/prop-types`.
// NOTE: You can run `npm run flow:check` to check for any errors in your
// code, or `npm i -g flow-bin` to have access to the binary globally.
// Sorry Windows users :(.
type Props = {
  counter: number,
  doubleAsync: Function,
  increment: Function
};

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends React.Component<void, Props, void> {
  static propTypes = {
    files: PropTypes.array.isRequired,
    fetchFiles: PropTypes.func.isRequired,
  };

  constructor (props) {
    super(props)
    this.props.fetchFiles()
  }

  render () {
    return (
      <div className='container'>
      {this.props.files.map((file) =>
        <File key={file.url} name={file.name} url={file.url} />
      )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  files: state.files
})
export default connect((mapStateToProps), {
  fetchFiles: () => fetchFiles()
})(HomeView)
