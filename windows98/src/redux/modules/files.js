import update from 'react-addons-update';

export const FETCH_FILES = 'FETCH_FILES'

export function fetchFiles (): Action {
  return (dispatch) => fetch('https://api.github.com/repos/masonforest/windows98/contents/?ref=gh-pages')
    .then(res => res.json())
    .then(json => dispatch({
        type: FETCH_FILES,
        files: json
  }));
}

export const actions = {
  fetchFiles
}

const ACTION_HANDLERS = {
  [FETCH_FILES]: (state: files, action: {payload: files}): files => update(state, {$push: action.files})
}

const initialState = []
export default function filesReducer (state: files = initialState, action: Action): files {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
