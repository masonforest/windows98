import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import files from './modules/files'

export default combineReducers({
  files,
  router
})
