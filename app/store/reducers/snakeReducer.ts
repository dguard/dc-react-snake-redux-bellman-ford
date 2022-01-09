import createReducer from 'app/lib/createReducer';
import * as types from "app/store/actions/types";

const initialState: any = {
    startY: null,
    startX: null,
    endY: null,
    endX: null,
    path: null,
    promise: Promise.resolve()
};

export const snakeReducer = createReducer(initialState, {
    ["putCoordsAndPath"](state: any, action:any) {
        return {
            ...state,
            startY: action.startY,
            startX: action.startX,
            endY: action.endY,
            endX: action.endX,
            path: action.path,
            promise: action.promise
        }
    }
});