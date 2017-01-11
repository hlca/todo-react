import { createStore, combineReducers } from 'redux';
import React from 'react';
import ReactDOM from 'react-dom';
import deepFreeze from 'deep-freeze';
import expect from 'expect';
// import '../styles/index.scss';

import { todos } from './reducers/todos';
import { visibilityFilter } from './reducers/visibility';

const { Component } = React;

const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let maxId = 0;

const FilterLink = ({visibilityFilter, currentVisibilityFilter, children}) => {
  if(visibilityFilter === currentVisibilityFilter){
    return <strong>{children}</strong>
  }
  return <a
    href="#"
    onClick = {
      e => {
        e.preventDefault();

        store.dispatch({
          type: 'SET_VISIBILITY_FILTER',
          payload: {visibilityFilter}
        })
      }
    }
  >{children}</a>
}

const getVisibleTodos = (todos, visibilityFilter) =>{
  if(visibilityFilter === 'SHOW_ALL') {
    return todos;
  }
  if(visibilityFilter === 'SHOW_COMPLETED') {
    return todos.filter(t => t.completed);
  }
  if(visibilityFilter === 'SHOW_ACTIVE' ){
    return todos.filter(t => !t.completed);
  }
}

class TodosApp extends Component {
  render() {
    let {todos, visibilityFilter} = this.props;
    let visibleTodos = getVisibleTodos(todos, visibilityFilter);
    
    return (
      <div>
        <input type="text" ref={ node => this.input = node } />
        <button
          onClick={
            () => { 
              store.dispatch({
                type: 'ADD_TODO',
                payload: {
                  id: maxId++,
                  text: this.input.value
                }
              });

              this.input.value = "";
            }
          }
        >Agregar Todo</button>

        <ul>
          {
            visibleTodos.map(
              todo => <li 
                key={ todo.id }
                style = {
                  {
                    textDecoration: todo.completed ? 'line-through' : 'none'
                  }
                }
                onClick = {
                  () => {
                    store.dispatch({
                      type: 'TOGGLE_TODO',
                      payload: {
                        id: todo.id
                      }
                    })
                  }
                }
              >{ todo.text }</li>
            )
          }
        </ul>
        <FilterLink visibilityFilter="SHOW_ALL"
          currentVisibilityFilter={visibilityFilter}>All</FilterLink>
        {' '}
        <FilterLink visibilityFilter="SHOW_COMPLETED"
          currentVisibilityFilter={visibilityFilter}>Completed</FilterLink>
        {' '}
        <FilterLink visibilityFilter="SHOW_ACTIVE"
          currentVisibilityFilter={visibilityFilter}>Active</FilterLink>
      </div>
    );
  }
}


const render = () => {
  ReactDOM.render(
    // <TodosApp todos={ store.getState().todos } visibilityFilter={ store.getState().visibilityFilter }/>,
    <TodosApp { ...store.getState() }/>,
    document.getElementById('root')
  );
};

render();
store.subscribe(render);