import update from 'react-addons-update'
import Github from 'github-api'

export const FETCH_FILES = 'FETCH_FILES'
export const SET_ACTIVE_FILE = 'SET_ACTIVE_FILE'
export const SET_ACTIVE_CONTENT = 'SET_ACTIVE_CONTENT'
export const SAVE = 'SAVE'

export function fetchFiles (): Action {
  return (dispatch) => fetch('https://api.github.com/repos/masonforest/windows98/contents/?ref=gh-pages')
    .then((res) => res.json())
    .then((json) => dispatch({
      type: FETCH_FILES,
      files: json
    }))
}

export function editFile (file): Action {
  return (dispatch) => {
    dispatch({type: SET_ACTIVE_FILE, file: file})
    fetch(file.url)
    .then((res) => res.json())
    .then((json) => dispatch({
      type: SET_ACTIVE_CONTENT,
      content: atob(json.content)
    }))
  }
}

export function setActiveContent (content): Action {
  return {
    type: SET_ACTIVE_CONTENT,
    content: content
  }
}

export function save (file): Action {
  return (dispatch, getState) => {
    let github = new Github({
      token: localStorage.accessToken,
      auth: "oauth"
    });

    let repo = github.getRepo('masonforest', 'windows98');

    repo.write(
      'gh-pages',
       getState().files.activeFile.path,
       getState().files.activeFile.content,
       'Windows 98 - Update',
       {}
      )
  }
}

export const actions = {
  fetchFiles
}

const ACTION_HANDLERS = {
  [FETCH_FILES]: (state: files, action: {payload: files}): files =>
    update(state, {files: {$push: action.files}}),
  [SET_ACTIVE_FILE]: (state: files, action: {payload: files}): files =>
    update(state, {activeFile: {$set: action.file}}),
  [SET_ACTIVE_CONTENT]: (state: files, action: {payload: files}): files =>
    update(state, {activeFile: {content: {$set: action.content}}})
}
const initialState = {files: [], activeFile: {content: null}}
export default function filesReducer (state: files = initialState, action: Action): files {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
