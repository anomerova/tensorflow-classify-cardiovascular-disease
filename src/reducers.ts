export default function reducers(state: any, action: any) {
    switch(action.type) {
      case 'TODO_ADD' : {
        //return applyAddTodo(state, action);
      }
      case 'TODO_TOGGLE' : {
        //return applyToggleTodo(state, action);
      }
      default : return state;
    }
}