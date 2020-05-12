# Redux 개요

> 리덕스는 자바스크립트를 위한 상태 관리 프레임워크

## 리덕스 사용 이점

- 컴포넌트 코드로부터 상태 관리 코드 분리 가능
- 서버 렌더링 시 데이터 전달 간편
- 로컬 스토리지에 데이터를 저장하고 불러오는 코드를 쉽게 작성 가능
- 같은 상탯값을 다수의 컴포넌트에서 필요로 할 때 좋음
- 부모 컴포넌트에서 깊은 곳에 있는 자식 컴포넌트에 상탯값을 전달할 때 좋음
- 알림창과 같은 전역 컴포넌트의 상탯값을 관리할 때 좋음
- 페이지가 전환되어도 데이터는 살아 있어야 할 때 좋음

## 리덕스 3 원칙

> 리덕스 공식 문서에서 제시하는 리덕스 사용 세 가지 원칙

1. 전체 상탯값을 하나의 객체에 저장
2. 상탯값은 불변 객체
3. 상탯값은 순수 함수에 의해서만 변경되어야 함

### ① 전체 상탯값을 하나의 객체에 저장

- 전체 상탯값이 하나의 객체로 관리되므로 활용도가 높아짐 
- 리덕스를 사용하면 하나의 객체를 직렬화해서 서버와 클라이언트가 프로그램의 전체 상태를 주고 받을 수 있음
- 최근의 상탯값을 버리지 않고 저장해 두면 실행 취소(undo)와 다시 실행(redo) 기능을 쉽게 구현 가능

*※ 특별히 로직이 복잡하지 않은 페이지에서는 컴포넌트의 상탯값을 활용하는 게 생산성을 더 높일 수 있으며, 시간 여행과 같은 기능을 구현하는 게 아니라면 필요한 곳에서만 리덕스를 사용해도 됨*

### ② 상탯값을 불변 객체로 관리

> 상탯값은 오직 액션 객체에 의해서만 변경되어야 함

```javascript
// 액션 객체
const incrementAction = {
    type: "INCREMENT",
    amount: 123,
}
// 상탯값 저장소로 액션 객체 전달
store.dispatch(incrementAction);
```

- 액션 객체에는 type 속성값이 반드시 존재해야 함
  type 속성값으로 액션 객체 구분
- type 을 제외한 나머지는 상탯값을 수정하기 위해 사용되는 정보
- 액션 객체와 함께 dispatch 메서드를 호출하면 상탯값이 변경됨
- 상탯값 수정이라는 목적만 놓고 보면 불변 객체를 사용하는 것이 불리해 보이지만, 이전 상탯값과 이후 상탯값을 비교해서 변경 여부를 파악할 때는 불변 객체가 훨씬 유리함
- 상탯값 변경을 빠르게 확인할 수 있으면 메모이제이션과 같은 기능을 활용하기 좋고, 리액트의 렌더링 성능을 올리는 데도 유리함

### ③ 오직 순수 함수에 의해서만 상탯값을 변경해야 함: 리듀서

> 리덕스에서 상탯값을 변경하는 함수를 리듀서(reducer)라고 함

#### Reducer 리듀서

```javascript
// 리듀서 기본 구조
(state, action) => nextState
```

- 리듀서는 이전 상탯값과 액션 객체를 입력 받아서 새로운 상탯값을 만드는 순수 함수
- 순수 함수는 부수 효과(side effect)를 발생시키지 않아야 하며,
  같은 인수에 대해 항상 같은 값을 반환해야 함
  ex) 랜덤/시간 함수를 이용하면 순수함수가 아님
- 부수 효과란 전역 변수의 값을 수정하거나 API 요청을 보내는 등 함수 외부의 상태를 변경시키는 것을 말함
- 순수 함수는 테스트 코드를 작성하기 쉬움

# 리덕스 주요 개념

![reduxFlow (1)](C:\Users\patha\Desktop\필기\img\reduxFlow (1).png)

## 액션 Action

> 액션은 type 속성을 갖는 자바스크립트 객체

- 액션 객체를 dispatch 메서드에 넣어서 호출하면 리덕스는 상탯값을 변경하기 위해 위 그림의 과정을 수행
- 액션 객체에는 type 속성 외에도 원하는 속성을 얼마든지 넣을 수 있음

```javascript
// 액션 생성자 함수
function addTodo({ title, priority }) {
    return { type: 'todo/ADD', title, priority };
}
function removeTodo({ id }) {
    return { type: 'todo/REMOVE', id };
}

// dispatch 메서드 호출
store.dispatch(addTodo({ title: '영화 보기', priority: 'high'}));
store.dispatch(removeTodo({ id: 123 }));
```

- 각 액션은 고유한 type 속성값을 사용해야 함
- type 이름 충돌을 피하기 위해 'todo/' 와 같은 접두사를 붙이는 방법이 많이 사용됨
- 액션 객체를 dispatch 메서드에 직접 전달하는 방법보다는 생성자 함수를 사용하는 방법이 좋음
  → 액션 객체의 구조를 변경할 때 생성자 함수만 수정하면 됨
- type 속성값은 리듀서에서 액션 객체를 구분할 때도 사용되기 때문에 상수 변수로 만드는 게 좋음

```javascript
// 액션 타입을 상수 변수로 관리
export const ADD = 'todo/ADD';
export const REMOVE = 'todo/REMOVE';

// 생성자 함수도 같은 파일에서 관리하며 외부로 노출
export function addTodo({ title, priority }) {
    return { type: ADD, title, priority };
}
export function removeTodo({ id }) {
    return { type: REMOVE, id };
}
```

- 액션 생성자 함수에서는 부수 효과를 발생시켜도 괜찮음
- 예를 들어 addTodo 함수에서 새로운 할일을 서버에 저장하기 위해 API 호출을 할 수 있음

## 미들웨어 Middleware

> 미들웨어는 리듀서가 액션을 처리하기 전에 실행되는 함수

- 디버깅 목적으로 상탯값 변경 시 로그를 출력하거나, 리듀서에서 발생한 예외를 서버로 전송하는 등의 목적으로 활용 가능
- 미들웨어를 설정하지 않았다면 액션은 바로 리듀서로 보내짐

### 미들웨어 기본 구조

```javascript
const myMiddleware = store => next => action => next(action);

// 화살표 함수를 사용하지 않은 코드
const myMiddleware = function(store) {
    return function(next) {
        return function (action) {
            return next(action);
        }
    }
}
```

- 함수 세 개가 중첩된 구조
- 미들웨어는 스토어와 액션 객체를 기반으로 필요한 작업 수행
-  next 함수를 호출하면 다른 미들웨어 함수가 호출되면서 최종적으로 리듀서 함수 호출

### 미들웨어 설정하기

```javascript
import { createStore, applyMiddleware } from 'redux';

const middleware1 = store => next => action => {
    console.log('middleware1 start');
    const result = next(action);
    console.log('middleware1 end');
    return result;
}

const middleware2 = store => next => action => {
    console.log('middleware2 start');
    const result = next(action);
    console.log('middleware2 end');
    return result;
}

// 아무일도 하지 않는 리듀서
const myReducer = (state, action) => {
    console.log('myReducer');
    return state;
}

const store = createStore(myReducer, applyMiddleware(middleware1, middleware2));
store.dispatch({ type: 'someAction' });

/*
로그 출력 순서
middleware1 start
middleware2 start
myReducer
middleware2 end
middleware1 end
*/
```

- 같은 기능을 하는 간단한 미들웨어 정의
- applyMiddleware 함수로 미들웨어가 입력된 스토어 생성
- middleware1 에서 호출한 next 함수는 middleware2 함수를 실행
- middleware2 에서 호출한 next 함수는 스토어가 원래 갖고 있던 dispatch 메서드 호출
- 최종적으로 스토어의 dispatch 메서드는 리듀서를 호출
- 각 미들웨어에서 리듀서 호출 전후에 필요한 작업 정의 가능

### 미들웨어 활용 예

#### 로그 출력 미들웨어

> next 함수를 호출하면 리듀서가 호출되기 때문에 next 함수 전후로 로그 출력

```javascript
const printlog = store => next => action => {
    console.log(`prev state = ${store.getState()}`);
    const result = next(action);
    console.log(`prev state = ${store.getState()}`);
    return result;
}
```

#### 로컬 스토리지에 값을 저장하는 미들웨어

> 'SET_NAME' 액션이 발생할 때마다 로컬 스토리지에 값을 저장

```javascript
const saveToLocalStorage = store => next => action => {
    if (action.type === 'SET_NAME'){
        localStorage.setItem('name', action.name);
    }
    return next(action);
}
```

## 리듀서

> 액션이 발생했을 때 새로운 상탯값을 만드는 함수

### 리듀서 기본 구조

```javascript
(state, action) => nextState;
```

### 리듀서 함수 작성 예

> 할 일 목록 데이터를 처리하는 리듀서 함수

```javascript
function reducer(state = INITIAL_STATE, action) {
    switch(action.type){
       // ...
        case REMOVE_ALL:
            return {
                ...state,
                todos: [],
            };
        case REMOVE:
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.id),
            };
        default:
            return state;
    }
}

const INITIAL_STATE = { todos: [] };
```

- 리덕스는 스토어 생성 시 상탯값이 없는 상태로 리듀서를 호출함으로 매개변수의 기본값을 사용해서 초기 상탯값 정의
- 각 액견 타입별로 case 문을 만들어서 처리
- 상탯값은 불변 객체로 관리해야함으로 수정할 때마다 새로운 객체 생성,
  ...(전개 연산자)를 사용하면 상탯값을 불변 객체로 관리 가능
- default: 처리할 액션이 없다면 상탯값을 변경하지 않음

### immer 패키지

> 불변 객체 관리를 목적으로 하는 패키지
> 깊은 곳에 있는 값을 수정할 때는 전개 연산자를 사용해도 가독성이 떨어지기 때문에 사용

#### immer를 이용한 리듀서 작성

```javascript
import produce from 'immer';

function reducer(state = INITIAL_STATE, action) {
    return produce(state, draft => {
        switch (action.type) {
            case ADD:
                draft.push(action.todo);
                break;
            case REMOVE_ALL:
                draft.todos = [];
                break;
            case REMOVE:
                draft.todos = draft.todos.filter(todo => todo.id !== action.id);
                break;
            default:
                break;
        }
    })
}

const INITIAL_STATE = { todos: [] };
```

- switch문 전체를 produce 함수로 감쌈
- produce 함수의 첫 번째 매개변수는 변경하고자 하는 객체
- 두 번째 매개변수는 첫 번째 매개변수로 입력된 객체를 수정하는 함수
  draft 매개변수를 state 객체라고 생각하면 됨
- immer를 사용했기 때문에 push와 같이 배열을 직접 변경하는 메서드도 사용 가능
- draft.todos 를 수정해도 state 객체의 값은 변경되지 않음
  draft 객체를 수정하면 produce 함수가 새로운 객체를 반환해 줌

### 리듀서 작성 시 주의할 점

1. 데이터 참조
   데이터를 참조할 때 객체의 레퍼런스를 참조하는 경우,  해당 객체가 수정되면 더 이상 같은 데이터를 참조할 수 없게 될 수 있기 때문에 객체의 레퍼런스보다는 ID 값으로 데이터를 참조하는 것이 좋음
   *→ ID 값으로 참조하면 객체의 데이터가 변경되어도 별문제 없이 데이터를 가리킬 수 있음*
2. 순수 함수
   리듀서는 순수 함수로 작성해야 함
   랜덤 함수를 이용해서 다음 상탯값을 만들거나, API를 호출해서는 안 됨
   *→ API 호출은 액션 생성자 함수나 미들웨어에서 하면 됨*

### createReducer 함수로 리듀서 작성

> switch 문보다 간결하게 리듀서 함수를 작성할 수 있는 함수
> 리덕스에서 제공하는 함수는 아니지만 리덕스 생태계에서 많이 쓰임

#### createReducer 함수

```javascript
import produce from 'immer';

function createReducer(initialState, handlerMap) {
    return function(state = initialState, action) {
        return produce(state, draft => {
            const handler = handlerMap[action.type];
            if(handler) {
                handler(draft, action);
            }
        })
    }
}
```

- createReducer 함수는 reducer 함수를 반환
- 리듀서 함수 전체를 immer의 produce로 감쌈
- 등록된 액션 처리 함수가 있다면 실행

#### createReducer 함수로 작성한 리듀서 함수

```javascript
const reducer = createReducer(INITAIL_STATE, {
    [ADD]: (state, action) => state.todos.push(action.todo),
    [REMOVE_ALL]: state => (state.todos = []),
    [ROMOVE]: (state, action) => 
    	(state.todos = state.todos.filter(todo => todo.id !== action.id)),
})
```

- createReducer 함수의 첫 번째 인자로 초기 상탯값 입력
- createReducer 함수의 두 번째 인자는 액션 처리 함수를 담고 있는 객체
- switch문으로 작성한 것보다 코드가 간결해짐

## 스토어

> 스토어는 리덕스의 상탯값을 갖는 객체
> 액션의 발생은 스토어의 dispatch 메서드로 시작됨

- 리덕스의 첫 번째 원칙은 전체 상탯값을 하나의 스토어에 저장하는 것
- 기술적으로는 여러 개의 스토어를 만들어서 사용해도 문제가 되지 않음
  → 그러나 특별한 이유가 없다면 하나만 만드는 것이 좋음
- 데이터의 종류에 따라 구분하기 위한 용도라면 combineReducer 함수를 이용

### subscribe 메서드 사용 예제

> 외부에서 상탯값 변경 여부를 알기 위해 store의 subscribe 메서드를 이용해서 스토어에 이벤트 처리 함수 등록

```javascript
const INITIAL_STATE = { value: 0 };
const reducer = createReducer(INITAIL_STATE, {
    INCREMENT: state => (state.value += 1),
});
const store = createStore(reducer);

let prevState;
store.subscribe(() => {
    const state = store.getState();
    if (state === prevState) {
        console.log('상탯값 같음')
    } else {
        console.log('상탯값 변경됨')
    }
    prevState = state;
})

store.dispatch({ type: 'INCREMENT' });
store.dispatch({ type: 'OTHER_ACTION' });
store.dispatch({ type: 'INCREMENT' });
```

- subscribe 메서드를 이용해서 이베트 처리 함수 등록
- 스토어에 등록된 함수는 액션이 처리될 때마다 호출
- 상탯값이 불변 객체이므로 간단한 비교로 변경 여부 확인 가능
- 'INCREMENT' 액션이 발생하면 '상탯값 변경됨' 로그 출력
- 등록되지 않은 액션 발생 시 '상탯값 같음' 출력

# 데이터 종류별로 상탯값 나누기

> 프로그램 안에서 사용되는 데이터 양이 많아지면 모든 액션을 하나의 파일에 작성하거나 하나의 리듀서 함수로 작성할 수 없음
> 리덕스에서 제공하는 combineReducer 함수를 이용하면 리듀서 함수를 여러 개로 분리 할 수 있음

## 실습 프로젝트 생성

> CRA 기반 프로젝트 생성

```bash
$ npx create-react-app redux-test

# src폴더 밑에서 index.js 파일을 제외한 모든 파일 삭제
# index.js 파일의 내용도 지우고 다음 두 개의 패키지 설치

$ npm i redux immer
```

## 구현 기능

### ① 타임 라인

> 사용자에게 보여 줄 여러 개의 게시물을 관리

1. 각 게시물 데이터를 배열로 관리
2. 게시물의 CRUD가 가능해야 함
3. 무한 스크롤 기능이 필요하기 때문에 페이지 번호도 관리해야 함

### ② 친구 목록

1. 친구 목록 데이터도 배열로 관리
2. 친구 데이터 CRUD가 가능해야 함

## createReducer 함수 작성

> src 폴더 밑에 common 폴더 생성 후 그 안에 createReducer.js 파일 작성

```javascript
import produce from "immer";

export default function createReducer(initialState, handlerMap) {
  return function (state = initialState, action) {
    return produce(state, (draft) => {
      const handler = handlerMap[action.type];
      if (handler) {
        handler(draft, action);
      }
    });
  };
}
```

## 친구 목록을 위한 리덕스 코드 작성

> src 폴더 밑에 friend 촐더 생성 후 그 안에 state.js 파일 작성

```javascript
import createReducer from "../common/createReducer";

// 액션 타입을 상수 변수로 정의
const ADD = "friend/ADD";
const REMOVE = "friend/REMOVE";
const EDIT = "friend/EDIT";

// 액션 생성자 함수 정의, 외부에서 사용해야 함으로 export 사용
export const addFriend = (friend) => ({ type: ADD, friend });
export const removeFriend = (friend) => ({ type: REMOVE, friend });
export const editFriend = (friend) => ({ type: EDIT, friend });

// 초기 상탯값
const INITIAL_STATE = { friends: [] };

// 친구 데이터 CUD 리듀서
const reducer = createReducer(INITIAL_STATE, {
  [ADD]: (state, action) => state.friends.push(action.friend),
  [REMOVE]: (state, action) =>
    (state.friends = state.friends.filter(
      (friend) => friend.id !== action.friend.id
    )),
  [EDIT]: (state, action) => {
    const index = state.friends.findIndex(
      (friend) => friend.id === action.friend.id
    );
    if (index >= 0) {
      state.friends[index] = action.friend;
    }
  },
});

export default reducer;
```

- createReducer 함수에서 immer 패키지를 사용했으므로 리듀서 함수에서 간편하게 상탯값 수정 가능

## 덕스(ducks) 패턴

> 액션 타입, 액션 생성자 함수, 리듀서 함수를 각각의 파일로 만들지 않고 하나의 파일에서 관리하는 패턴
> → 대부분의 경우 덕스 패턴으로 리덕스 코드를 작성하는 것이 효율적

### 덕스 패턴 규칙

1. 연관된 액션 타입, 액션 생성자 함수, 리듀서 함수를 하나의 파일로 작성
2. 리듀서 함수는 export default 키워드로 내보냄
3. 액션 생성자 함수는 export 키워드로 내보냄
4. 액션 타입은 접두사와 액션 이름을 조합해서 작명

*※ 특정 파일의 코드가 많아지면 굳이 하나의 파일을 고집할 필요는 없음*

## 타임라인을 위한 리덕스 코드 작성

> src 폴더 밑에 timeline 폴더를 만든 뒤 state.js 파일 작성

```javascript
import createReducer from "../common/createReducer";

// 액션 타입 상수 변수
const ADD = "timeline/ADD";
const REMOVE = "timeline/REMOVE";
const EDIT = "timeline/EDIT";
const INCREASE_NEXT_PAGE = "timeline/INCREASE_NEXT_PAGE";

// 액션 생성자 함수
export const addTimeline = (timeline) => ({ type: ADD, timeline });
export const removeTimeline = (timeline) => ({ type: REMOVE, timeline });
export const editTimeline = (timeline) => ({ type: EDIT, timeline });
export const increaseNextPage = () => ({ type: INCREASE_NEXT_PAGE });

// 초기 상탯값
const INITIAL_STATE = { timelines: [], nextPage: 0 };

// 리듀서
const reducer = createReducer(INITIAL_STATE, {
  [ADD]: (state, action) => state.timelines.push(action.timeline),
  [REMOVE]: (state, action) =>
    (state.timelines = state.timelines.filter(
      (timeline) => timeline.id !== action.timeline.id
    )),
  [EDIT]: (state, action) => {
    const index = state.timelines.findIndex(
      (timeline) => timeline.id === action.timeline.id
    );
    if (index >= 0) {
      state.timelines[index] = action.timeline;
    }
  },
  [INCREASE_NEXT_PAGE]: (state, action) => (state.nextPage += 1),
});

export default reducer;
```

- INCREASE_NEXT_PAGE: 타임라인의 끝에 도달했을 때 서버에 요청할 페이지 번호를 관리하는 액션 타입
- 페이지 번호를 제외하고는 친구 목록 코드와 동일

*※ friend, timeline 폴더 밑에 각각의 기능 구현을 위한 파일 추가 가능*
*각 기능에서 사용되는 리액트 컴포넌트 파일도 해당 폴더 밑에서 작성하면 됨*

## 여러 리듀서 합치기

> 리덕스에서 제공하는 combineReducers 함수를 이용하면 어러 개의 리듀서를 하나로 합칠 수 있음
>
> src/index.js 파일에 다음 코드 입력

```javascript
import { createStore, combineReducers } from "redux";

import timelineReducer, {
  addTimeline,
  removeTimeline,
  editTimeline,
  increaseNextPage,
} from "./timeline/state";

import friendReducer, {
  addFriend,
  removeFriend,
  editFriend,
} from "./friend/state";

const reducer = combineReducers({
  timeline: timelineReducer,
  friend: friendReducer,
});

const store = createStore(reducer);
store.subscribe(() => {
  const state = store.getState();
  console.log(state);
});

store.dispatch(addTimeline({ id: 1, desc: "코딩은 즐거워" }));
store.dispatch(addTimeline({ id: 2, desc: "리덕스 좋아" }));
store.dispatch(increaseNextPage());
store.dispatch(editTimeline({ id: 2, desc: "리덕스 너무 좋아" }));
store.dispatch(removeTimeline({ id: 1, desc: "코딩은 즐거워" }));

store.dispatch(addFriend({ id: 1, name: "아이유" }));
store.dispatch(addFriend({ id: 2, name: "손나은" }));
store.dispatch(editFriend({ id: 2, name: "수지" }));
store.dispatch(removeFriend({ id: 1, name: "아이유" }));

// 최종 상탯값
const state = {
    timeline: {
        timelines: [{ id: 2, desc: '리덕스 너무 좋아' }],
        nextPage: 1,
    },
    friend: {
        friends: [{ id: 2, name: "수지"}],
    }
}
```

- 친구 목록과 타임라인 모듈에서 액션 생성자 함수와 리듀서 함수를 가져옴
- combineReducers 함수를 이용해서 두 개의 리듀서를 하나로 합침
  상탯값에는 각각 timeline, friend 라는 이름으로 데이터가 저장됨
- 합친 reducer로 스토어 생성
- subscribe 메서드를 이용해서 액션 처리가 끝날 때마다 상탯값을 로그로 출력
- 타임라인과 친구 목록을 테스트하기 위해 액션 생성
- npm start 명령어 입력 후 브라우저에서 로그 확인

## 공통 기능 분리하기

> 위에서 작성한 타임라인과 친구 목록 코드에는 중복된 코드가 많음

- 배열과 관련된 액션 타입과 액션 생성자 함수
- 초기 상탯값을 빈 배열로 정의
- 배열의 데이터를 추가, 삭제, 수정하는 리듀서 코드

*※ 중복되는 코드를 별도의 파일로 분리해서 관리 가능*

### 중복 로직 파일 작성

> common 폴더 밑에 createItemsLogic.js 파일 생성 후 아래 코드 입력

```javascript
import createReducer from "./createReducer";

export default function createItemsLogic(name) {
  // 액션 타입
  const ADD = `${name}/ADD`;
  const REMOVE = `${name}/REMOVE`;
  const EDIT = `${name}/EDIT`;

  // 액션 생성자 함수
  const add = (item) => ({ type: ADD, item });
  const remove = (item) => ({ type: REMOVE, item });
  const edit = (item) => ({ type: EDIT, item });

  // 리듀서
  const reducer = createReducer(
    // 초기 상탯값으로 빈 배열 입력
    { [name]: [] },
    {
      [ADD]: (state, action) => state[name].push(action.item),
      [REMOVE]: (state, action) => {
        const index = state[name].findIndex(
          (item) => item.id === action.item.id
        );
        state[name].splice(index, 1);
      },
      [EDIT]: (state, action) => {
        const index = state[name].findIndex(
          (item) => item.id === action.item.id
        );
        if (index >= 0) {
          state[name][index] = action.item;
        }
      },
    }
  );
    
  return { add, remove, edit, reducer };
}
```

- 관리하고자 하는 데이터 종류의 이름을 매개변수로 받음
- 입력받은 이름을 이용해서 액션 타입 생성
- 액션 생성자 하수와 리듀서 함수를 내보냄

## 기존 코드 리팩터링하기

### friend/state.js

> 친구 목록 상탯값 관련 코드 수정

```javascript
import createItemsLogic from "../common/createItemsLogic";

const { add, remove, edit, reducer } = createItemsLogic("friends");

export const addFriend = add;
export const removeFriend = remove;
export const editFriend = edit;
export default reducer;
```

- 공통 로직 생성자 함수를 가져옴
- friends 라는 이름으로 공통 로직 생성
- 액션 생성자 함수를 원하는 이름으로 바꿔서 내보냄
- 리듀서 함수를 그대로 내보냄

### mergeReducers 함수 만들기

> 리덕스에서 제공하는 combineReducers 함수를 이용하면 상탯값의 깊이가 불필요하게 깊어지기 때문에 상탯값의 깊이가 깊어지지 않으면서 리듀서를 하나로 합치는 함수 작성

```javascript
// combineReducers 사용례
import { combineReducers } from 'redux';
// ...
export default combineReducers({
    common: reducer,
    timelines: timelinesReducer,
})

// combineReducers 함수를 사용한 상탯값 구조
const state = {
    timeline: {
        common: {
            nextPage: 0,
        }
//...
```

- 각 리듀서마다 새로운 이름을 부여하면서 객체의 깊이가 깊어짐
- state의 timeline에 불필요하게 common이라는 이름의 객체가 추가됨

#### mergeReducers 함수

> common 폴더 밑에 mergeReducers.js 파일 생성 후 아래 코드 입력

```javascript
export default function mergeReducers(reducers) {
  // 리듀서 반환
  return function (state, action) {
    // 초기 상탯값 계산
    if (!state) {
      return reducers.reduce(
        (acc, reducer) => ({ ...acc, ...reducer(state, action) }),
        {}
      );
    } else {
      // 초기화 단계가 아닌 경우
      let nextState = state;
      for (const reducer of reducers) {
        nextState = reducer(nextState, action);
      }
      return nextState;
    }
  };
}
```

- mergeReducers 함수는 리듀서를 반환
- 초기 상탯값을 계산할 때는 모든 리듀서 함수의 결괏값을 합침
- 초기화 단계가 아니라면 입력된 모든 리듀서를 호출해서 다음 상탯값 반환



### timeline/state.js

> 타임라인 상태값 관련 코드 수정

```javascript
import createReducer from "../common/createReducer";
import createItemsLogic from "../common/createItemsLogic";
import mergeReducers from "../common/mergeReducers";

// 공통 로직
const { add, remove, edit, reducer: timelineReducer } = createItemsLogic(
  "timelines"
);

const INCREASE_NEXT_PAGE = "timeline/INCREASE_NEXT_PAGE";

export const addTimeline = add;
export const removeTimeline = remove;
export const editTimeline = edit;
export const increaseNextPage = () => ({ type: "INCREASE_NEXT_PAGE" });

const INITIAL_STATE = { nextPage: 0 };
const reducer = createReducer(INITIAL_STATE, {
  [INCREASE_NEXT_PAGE]: (state, action) => (state.nextPage += 1),
});

const reducers = [reducer, timelineReducer];
export default mergeReducers(reducers);
```

- timelines 라는 이름으로 공통 로직 생성
- nextPage 상태 관련 코드들은 공통 로직에 포함되지 않았기 때문에 각각 따로 정의
- mergeReducers 함수를 사용해서 공통 로직의 리듀서 함수와 직접 작성한 리듀서 함수를 합침

# 리액트 상탯값 리덕스로 관리하기

> 리덕스는 리액트뿐만 아니라 자바스크립트를 사용하는 모든 곳에서 사용 가능하지만 리액트와 궁합이 잘 맞음

- 리액트 컴포넌트의 상탯값과 마찬가지로 리덕스의 상탯값도 불변 객체임
- 상탯값이 불변 객체이면 값의 변경 여부를 빠르게 확인 가능
  → 리액트 성능 향상의 한 가지 요인
- 리액트에서 리덕스를 사용할 때는 react-redux 패키지가 많이 사용됨

## react-redux 패키지 없이 직접 구현하기

> 앞에서 작성한 친구 목록/타임라인 코드를 기반으로 작성

### 스토어 분리하기

> 스토어 객체를 원하는 곳에서 가져다 쓸 수 있도록 별도의 파일로 분리
> common 폴더 밑에 store.js 파일 생성 후 아래 코드 입력

```javascript
import { createStore, combindeReducers, combineReducers } from "redux";
import timelineReducer from "../timeline/state";
import friendReducer from "../friend/state";

const reducer = combineReducers({
  timeline: timelineReducer,
  friend: friendReducer,
});

const store = createStore(reducer);
export default store;
```

- timeline 리듀서와 friend 리듀서를 합쳐서 스토어를 만든 뒤 외부에서 사용할 수 있도록 내보냄

### 타임라인 프레젠테이션 컴포넌트 작성

> 프레젠테이션 컴포넌트란 UI 효과를 위한 상탯값을 제외하고는 상탯값을 갖지 않는 컴포넌트를 말함
>
> timeline 폴더 밑에 component 폴더 생성 후 TimelineList.js 파일 작성

```javascript
import React from "react";

function TimelineList({ timelines }) {
  return (
    <ul>
      {timelines.map((timeline) => (
        <li key={timeline.id}>{timeline.desc}</li>
      ))}
    </ul>
  );
}

export default TimelineList;
```

- 타임라인 배열을 받아서 화면에 그리는 프레젠테이션 컴포넌트

### 타임라인 컨테이너 컴포넌트 작성

> 상탯값과 비즈니스 로직을 갖는 컴포넌트를 컨테이너 컴포넌트라고 함
>
> timeline 폴더 밑에 container 폴더 생성 후 TimelineMain.js 파일 작성

```javascript
import React, { Component } from "react";
import store from "../../common/store";
import { getNextTimeline } from "../../common/mockData";
import { addTimeline } from "../state";
import TimelineList from "../component/TimelineList";

class TimelineMain extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmout() {
    this.unsubscribe();
  }

  onAdd = () => {
    const timeline = getNextTimeline();
    store.dispatch(addTimeline(timeline));
  };

  render() {
    console.log("TimelineMain render");
    const timelines = store.getState().timeline.timelines;
    return (
      <div>
        <button onClick={this.onAdd}>타임라인 추가</button>
        <TimelineList timelines={timelines} />
      </div>
    );
  }
}

export default TimelineMain;
```

- 스토어 객체를 가져옴
- getNextTimeline 함수를 이용해서 필요할 때마다 타임라인 데이터를 가져오도록 할 예정
- timeline/state.js 에서  데이터 추가를 위한 액션 생성자 함수를 가져옴
- 액션이 처리될 때마다 화면을 다시 그리기 위해 subscribe 메서드 사용
- 컴포넌트 인스턴스의 forceUpdate 메서드를 호출하면 해당 컴포넌트를 무조건 렌더링함
- 컴포넌트가 언마운트될 때 subscribe 메서드에 등록한 이벤트 처리 함수를 해제
- 타임라인 추가 버튼을 누르면 타임라인을 추가하는 액션 발생

### 친구 목록 프레젠테이션 컴포넌트 작성

> friend 폴더 밑에  component 폴더 생성 후 FriendList.js 파일 작성

```javascript
import React from "react";

export default function FriendList({ friends }) {
  return (
    <ul>
      {friends.map((friend) => (
        <li key={friend.id}>{friend.name}</li>
      ))}
    </ul>
  );
}
```

- 친구 목록 배열을 받아서 화면에 그리는 프레젠테이션 컴포넌트

### 친구 목록 컨테이너 컴포넌트 작성

> container 폴더 생성 후 FriendMain.js 파일 작성

```javascript
import React, { Component } from "react";
import store from "../../common/store";
import { getNextFriend } from "../../common/mockData";
import { addFriend } from "../state";
import FriendList from "../component/FriendList";

export default class FriendMain extends Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onAdd = () => {
    const friend = getNextFriend();
    store.dispatch(addFriend(friend));
  };

  render() {
    console.log("FriendMain render");
    const friends = store.getState().friend.friends;
    return (
      <div>
        <button onClick={this.onAdd}>친구 추가</button>
        <FriendList friends={friends} />
      </div>
    );
  }
}
```

- 타임라인 컨테이너와 동일한 구조로 작성

### 더미 데이터 생성

> 서버 역할을 대체할 더미 데이터 파일과 데이터를 가져오는 함수 작성
>
> common 폴더 밑에 mockData.js 파일 생성 후 getNextFriend, getNextTimeline 함수 구현

```javascript
const friends = [
  { name: "쯔위", age: 15 },
  { name: "수지", age: 20 },
  { name: "아이유", age: 25 },
  { name: "손나은", age: 30 },
];

const timelines = [
  { desc: "점심이 맛있었다", likes: 0 },
  { desc: "나는 멋지다", likes: 10 },
  { desc: "호텔에 놀러 갔다", likes: 20 },
  { desc: "비싼 핸드폰을 샀다", likes: 30 },
];

function makeDataGenerator(items) {
  let itemIndex = 0;
  return function getNextData() {
    const item = items[itemIndex % items.length];
    itemIndex += 1;
    return { ...item, id: itemIndex };
  };
}

export const getNextFriend = makeDataGenerator(friends);
export const getNextTimeline = makeDataGenerator(timelines);
```

- 친구 목록과 타임라인 데이터를 생성할 때 사용할 기본 데이터 작성
- 친구 목록과 타임라인 데이터를 생성하는 로직이 같기 때문에 makeDataGenerator 함수 하나로 작성
- getNextData 함수는 items, itemIndex 변수를 기억하는 클로저이며 중복되지 않는 id 값을 넣어서 반환

### index.js 수정

> 지금까지 작성한 컴포넌트를 렌더링하기 위해 src/index.js 파일 수정

```javascript
import React from "react";
import ReactDOM from "react-dom";
import TimelineMain from "./timeline/container/TimelineMain";
import FriendMain from "./friend/container/FriendMain";

ReactDOM.render(
  <div>
    <FriendMain />
    <TimelineMain />
  </div>,
  document.getElementById("root")
);
```

- `npm start` 명령어로 프로젝트 실행 후 렌더링된 버튼을 클릭하면 데이터가 리덕스의 상탯값에 추가됨
- 화면은 정상적으로 렌더링되지만 타임라인 추가 버튼을 누를 때도 FriendMain 컴포넌트의 render 메서드가 호출됨
- 각각의 render 메서드는 그에 맞는 데이터가 변경될 때만 호출되도록 하는 것이 좋음

### FriendMain 개선하기

> 불필요하게 render 메서드가 호출되지 않도록 friend/container/FriendMain.js 코드 개선

```javascript
// ...
class FriendMain extends PureComponent { // PureComponent 상속
  // state 정의
  state = {
    // 리덕스 상탯값으로부터 초기 상탯값을 가져옴
    friends: store.getState().friend.friends,
  };

  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      // setState 메서드 사용
      this.setState({ friends: store.getState().friend.friends })
    );
  }
// ...
```

- 상탯값이 변경되는 경우에만 render 메서드가 호출되도록 PureComponent 상속
- state로 컴포넌트 상태값 정의
- componentDidMount 함수 내부에서 forceUpdate 메서드를 setState 메서드로 변경
  → setState 메서드를 호출하면 shouldComponentUpdate 생명 주기 메서드가 호출되고, 상탯값이 변경되지 않으면 render 메서드가 호출되지 않음
- 이제 타임라인 추가 버튼을 눌러도 FriendMain 컴포넌트의 render 메서드는 호출되지 않음

## react-redux 패키지 사용하기

> 위에서 작성한 코드를 기반으로 react-redux 패키지 사용

### 설치

```bash
$ npm i react-redux
```

### Provider 컴포넌트 사용

> Provider 컴포넌트는 react-redux에서 제공하는 컴포넌트로,
> Provider 컴포넌트 하위에 있는 컴포넌트는 리덕스의 상탯값이 변경되면 자동으로 렌더 함수가 호출되도록 할 수 있음
>
> index.js 파일을 다음과 같이 수정

```javascript
// ...
import store from "./common/store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <div>
      <FriendMain />
      <TimelineMain />
    </div>
  </Provider>,
  document.getElementById("root")
);

```

- 스토어 객체를 Provider 컴포넌트의 속성값으로 전달
- Provider 컴포넌트는 전달받은 스토어 객체의 subscribe 메서드를 호출해서 액션 처리가 끝날 때마다 알림을 받음
- 그 다음 컨텍스트 API를 사용해서 리덕스의 상탯값을 하위 컴포넌트로 전달

### FriendMain 컴포넌트 리팩터링

> FriendMain 컴포넌트가 react-redux를 사용하도록 FreindMain.js 파일을 다음과 같이 수정

```javascript
// ...
import { connect } from "react-redux";

class FriendMain extends Component {
  onAdd = () => {
    const friend = getNextFriend();
    
    // mapDispatchToProps 함수로부터 전달받은
    // addFriend 함수를 호출해서 리덕스의 상탯값 변경
    this.props.addFriend(friend);
  };

  render() {
    console.log("FriendMain render");
     
    // mapStateToProps 함수로 전달받은 friends 데이터 사용
    const { friends } = this.props;
    return (
      <div>
        <button onClick={this.onAdd}>친구 추가</button>
        <FriendList friends={friends} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { friends: state.friend.friends };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addFriend: (friend) => {
      dispatch(addFriend(friend));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FriendMain);
```

- connect: 컴포넌트가 리덕스 상탯값 변경에 반응하기 위해서는 react-redux에서 제공하는 connect 함수를 사용해야 함
  → connect 함수 호출 시 고차 컴포넌트가 생성되고 해당 컴포넌트에 직접 만든 컴포넌트를 전달(여기서는 FriendMain)
- mapStateToProps: 리덕스 상탯값을 기반으로 컴포넌트에서 사용할 데이터를 속성값으로 전달
- mapDispatchToProps: 리덕스의 상탯값을 변경하는 함수를 컴포넌트의 속성값으로 전달
- 프로젝트 실행 후 타임라인 버튼을 클릭해도 FriendMain 컴포넌트의 render 메서드는 호출되지 않음
  → connect 함수로 생성한 고차 컴포넌트는 입력된 컴포넌트로 전달하는 속성값에 변화가 없다면 입력된 컴포넌트를 다시 렌더링하지 않음

### mapDispatchToProps 함수 없이 액션 생성자 함수 전달

> mapDispatchToProps 함수를 단순히 액션 생성자 함수와 dispatch 메서드를 연결하는 목적으로 사용한다면 다음과 같이 간편하게 작성 가능

```javascript
import * as actions from '../state';
// ...
export default connect(mapStateToProps, actions)(FriendMain);

// mapDispatchToProps 함수로 액션 함수를 전달하는 예
const mapDispatchToProps = dispatch => {
    return {
        addFriend: friend => {
            dispatch(addFriend(friend));
        },
        removeFriend: friend => {
            dispatch(removeFriend(friend));
        },
        editFriend: friend => {
            dispatch(editFriend(friend));
        },
    };
};
```

- 모든 액션 생성자 함수를 actions 객체로 가져옴
- export default 키워드를 이용해서 내보낸 리듀서 함수가 default라는 이름으로 같이 넘어오지만 큰 문제는 되지 않음
- connect 함수의 두 번째 인자로 객체를 전달하면 그 객체를 액션 생성자 함수를 모아 놓은 객체로 인식
- 매개변수의 개수가 많아도 잘 동작하며, 단순하게 dispatch 함수를 연결하는 경우에는 액션 생성자 함수를 모아 놓은 객체를 전달하는 게 편함

# Reselect 패키지로 선택자 함수 만들기

> reselect 패키지는 원본 데이터를 다양한 형태로 가공해서 사용할 수 있도록 도와줌
> 특히 리덕스의 데이터를 리액트 컴포넌트에서 필요한 데이터로 가공하는 용도로 많이 사용

## 구현 기능

1. 친구 목록에 연령 제한 옵션과 개수 제한 옵션 추가
2. 연령 제한을 적용한 친구 목록과 연령/개수 제한을 모두 적용한 친구 목록을 보여줌

## reselect 패키지 없이 구현해 보기

### 옵션 선택 컴포넌트 작성

> 옵션을 선택할 수 있는 기능을 가진 컴포넌트 작성
> friend/component 폴더 밑에 NumberSelect.js 파일 작성

```javascript
import React, { Component } from "react";

class NumberSelect extends Component {
  onChange = (e) => {
    const value = Number(e.currentTarget.value);

    // 사용자가 옵션을 선택하면 이를 부모 컴포넌트에 알림
    this.props.onChange(value);
  };
  render() {
    const { value, options, postfix } = this.props;
    return (
      <div>
        <select onChange={this.onChange} value={value}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {postfix}
      </div>
    );
  }
}

export default NumberSelect;
```

- 부모 컴포넌트가 알려 준 옵션 목록을 화면에 출력
- 주어진 속성값으로 화면을 그리기만 함으로 프레젠테이션 컴포넌트로 작성

### 상수 관리 파일 작성

> 연령 제한과 개수 제한의 최댓값을 관리하는 파일
> friend 폴더 밑에 common.js 파일 작성

```javascript
export const MAX_AGE_LIMIT = 30;
export const MAX_SHOW_LIMIT = 8;
```

- friend 폴더 밑에 있는 여러 파일에서 공통으로 사용되는 상숫값 관리

### 친구 목록 릭덕스 코드 리팩터링

> 연령 제한과 개수 제한 정보를 관리하기 위해 friend/state.js 파일 수정

```javascript
import createReducer from "../common/createReducer";
import createItemsLogic from "../common/createItemsLogic";
import mergeReducers from "../common/mergeReducers";
import { MAX_AGE_LIMIT, MAX_SHOW_LIMIT } from "./common";

const { add, remove, edit, reducer: friendsReducer } = createItemsLogic(
  "friends"
);

const SET_AGE_LIMIT = "friend/SET_AGE_LIMIT";
const SET_SHOW_LIMIT = "friend/SET_SHOW_LIMIT";

export const addFriend = add;
export const removeFriend = remove;
export const editFriend = edit;

export const setAgeLimit = (ageLimit) => ({ type: SET_AGE_LIMIT, ageLimit });
export const setShowLimit = (showLimit) => ({
  type: SET_SHOW_LIMIT,
  showLimit,
});

const INITIAL_STATE = { ageLimit: MAX_AGE_LIMIT, showLimit: MAX_SHOW_LIMIT };

const reducer = createReducer(INITIAL_STATE, {
  [SET_AGE_LIMIT]: (state, action) => (state.ageLimit = action.ageLimit),
  [SET_SHOW_LIMIT]: (state, action) => (state.showLimit = action.showLimit),
});

const reducers = [reducer, friendsReducer];
export default mergeReducers(reducers);
```

- 연령/개수 제한 정보를 처리하는 액션 타입, 액션 생성자 함수, 리듀서 함수 작성
- 초기 상탯값으로 연령/개수 최댓값 입력
- 친구 목록을 처리하는 리듀서 함수와 하나로 합침

### FriendMain 컴포넌트 리팩터링

> FriendMain.js 파일 수정

```javascript
import React, { Component } from "react";
import { getNextFriend } from "../../common/mockData";
import FriendList from "../component/FriendList";
import { connect } from "react-redux";
import * as actions from "../state";
import NumberSelect from "../component/NumberSelect";
import { MAX_AGE_LIMIT, MAX_SHOW_LIMIT } from "../common";

class FriendMain extends Component {
  onAdd = () => {
    const friend = getNextFriend();
    this.props.addFriend(friend);
  };

  render() {
    console.log("FriendMain render");
    const {
      friendsWithAgeLimit,
      friendsWithAgeShowLimit,
      ageLimit,
      showLimit,
      setAgeLimit,
      setShowLimit,
    } = this.props;
    return (
      <div>
        <button onClick={this.onAdd}>친구 추가</button>
		
		// 연령 제한 옵션
        <NumberSelect
          onChange={setAgeLimit}
          value={ageLimit}
          options={ageLimitOptions}
          postfix="세 이하만 보기"
        />
        <FriendList friends={friendsWithAgeLimit} />
            
        // 개수 제한 옵션
        <NumberSelect
          onChange={setShowLimit}
          value={showLimit}
          options={showLimitOptions}
          postfix="명 이하만 보기(연령 제한 적용)"
        />
        <FriendList friends={friendsWithAgeShowLimit} />
      </div>
    );
  }
}

// 연령 & 개수 제한 옵션
const ageLimitOptions = [15, 20, 25, MAX_AGE_LIMIT];
const showLimitOptions = [2, 4, 6, MAX_SHOW_LIMIT];

const mapStateToProps = (state) => {
  const friends = state.friend.friends;
  const ageLimit = state.friend.ageLimit;
  const showLimit = state.friend.showLimit;
   
  // 연령 제한이 적용된 친구 목록
  const friendsWithAgeLimit = friends.filter(
    (friend) => friend.age <= ageLimit
  );
    
  // 연령 & 개수 제한이 적용된 친구 목록
  const friendsWithAgeShowLimit = friendsWithAgeLimit.slice(0, showLimit);
  return {
    // 컴포넌트의 속성값으로 전달
    friendsWithAgeLimit,
    friendsWithAgeShowLimit,
    ageLimit,
    showLimit,
  };
};

// 액션 생성자 함수 전체를 actions 객체로 전달
export default connect(mapStateToProps, actions)(FriendMain);
```

- 연령 제한 옵션 선택 시 setAgeLimit 함수가 호출되고, 리덕스 상탯값 변경
- 개수 제한 옵션 선택 시 setShowLimit 함수 호출, 리덕스 상탯값 변경
- *mapStateToProps 함수 내부에서 리덕스에 저장된 원본 데이터를 화면에 보여 줄 데이터로 가공*
- *※ 문제점: 친구 목록이 변경되지 않았을 때도 데이터를 가공하는 연산이 수행되며, 이는 데이터양이 증가할수록 불필요한 연산도 증가하게 되는 원인이 됨*

## reselect 패키지 사용하기

> 지금까지 작성한 코드를 reselect 패키지를 사용하는 코드로 리팩터링

### 개요

- reselect 패키지를 사용할 때는 선택자(selector) 함수를 작성해야 함
- reselect 패키지는 메모이제이션 기능이 있기 때문에 연산에 사용되는 데이터가 변경된 경우에만 연산을 수행
- 데이터가 변경되지 않았다면 이전 결괏값을 재사용
- 데이터 가공 코드를 컴포넌트 파일에서 분리함으로써 컴포넌트 파일에서는 UI 코드에 집중할 수 있게 됨

### 설치

```bash
$ npm i reselect
```

### 친구 목록 데이터의 선택자 함수 만들기

> 리덕스의 데이터를 컴포넌트에 원하는 방식으로 전달하기 위해 데이터를 가공하는 함수를 **선택자**라고 할 수 있음

1. 상탯값 처리 파일들을 한곳에 모으기 위해 friend 폴더 밑에 state 폴더 생성
2. friend/state.js 파일을 friend/state/index.js 경로로 이동
3. friend/state 폴더 밑에 선택자 함수를 작성할 selector.js 파일 작성

```javascript
import { createSelector } from "reselect";

const getFriends = (state) => state.friend.friends;
export const getAgeLimit = (state) => state.friend.ageLimit;
export const getShowLimit = (state) => state.friend.showLimit;

// 연령 제한이 적용된 친구 목록을 반환하는 선택자 함수
export const getFriendsWithAgeLimit = createSelector(
    
  // friends, ageLimit이 변경될 때만 연산 수행
  [getFriends, getAgeLimit],
  (friends, ageLimit) => friends.filter((friend) => friend.age <= ageLimit)
);

export const getFriendsWithAgeShowLimit = createSelector(
    
  // friends, ageLimit, showLimit이 변경될 때만 연산 수행
  [getFriendsWithAgeLimit, getShowLimit],
  (friendsWithAgeLimit, showLimit) => friendsWithAgeLimit.slice(0, showLimit)
);
```

- crreateSelector 함수를 이용해서 선택자 함수 생성
- createSelector 로 만든 선택자 함수로 전달되는 인수는 첫 번째 매개변수인 배열 내부의 각 함수들에게 인수로 전달됨
- getFriends, getAgeLimit, getShowLimit 함수들은 상탯값에 있는 데이터를 단순히 전달하는 역할을 하며, 이 함수들도 선택자 함수임
- 아래 두 함수의 첫 번째 인자로 입력된 배열 요소들의 각 반환값은 두 번째 인자로 입력된 함수의 매개변수로 순서에 맞게 전달됨
- getFriendsWithAgeShowLimit 함수는 getFriendsWithAgeLimit 함수 이용

### 선택자 함수 사용하기

> FriendMain.js 파일의 mapStateToProps 함수 수정

```javascript
// ...
import {
  getAgeLimit,
  getShowLimit,
  getFriendsWithAgeLimit,
  getFriendsWithAgeShowLimit,
} from "../state/selector";

// ...
const mapStateToProps = (state) => {
  return {
    ageLimit: getAgeLimit(state),
    showLimit: getShowLimit(state),
    friendsWithAgeLimit: getFriendsWithAgeLimit(state),
    friendsWithAgeShowLimit: getFriendsWithAgeShowLimit(state),
  };
};
// ...
```

- 이전보다 코드가 간결해짐
- 선택자 함수는 다른 컴포넌트에서도 쉽게 가져다 쓸 수 있음

## reselect에서 컴포넌트의 속성값 이용하기

> 선택자 함수는 상탯값 외에도 속성값을 입력받을 수 있음
> 속성값을 이용하면 컴포넌트의 각 인스턴스에 특화된 값 반환 가능

### 속성값 넘겨주기

> index.js 파일 수정

```javascript
// ...
ReactDOM.render(
  <Provider store={store}>
    <div>
      <FriendMain ageLimit={30} />
      <FriendMain ageLimit={15} />
    </div>
  </Provider>,
  document.getElementById("root")
);
```

- 연령 제한 정보를 속성값으로 전달
- FriendMain 컴포넌트의 인스턴스는 두 개가 됨

### 속성값을 선택자 함수로 전달하기

> FriendMain.js 파일 수정

```javascript
// ...
class FriendMain extends Component {
  // ...
  render() {
    const { friendsWithAgeLimit } = this.props;
    return (
      <div>
        <button onClick={this.onAdd}>친구 추가</button>
        <FriendList friends={friendsWithAgeLimit} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    friendsWithAgeLimit: getFriendsWithAgeLimit(state, props),
  };
};

export default connect(mapStateToProps, actions)(FriendMain);
```

- render 메서드는 필요한 코드만 남김
- mapStateToProps 함수는 두 번째 매개변수로 컴포넌트의 속성값을 받을 수 있음
- 선택자 함수의 인수로 상탯값과 속성값을 모두 전달

### 선택자 함수 수정하기

> seletor.js 파일의 getAgeLimit 함수 수정

```javascript
// ...
export const getAgeLimit = (state, props) => props.ageLimit;
// ...
```

- 연령 제한 정보를 속성값으로부터 가져옴
- getFriendsWithAgeLimit으로 전달된 인수는 해당 함수의 첫 번째 매개변수인 배열 요소들에 각각 전달되기 때문에 getAgeLimit 함수의 매개변수를 수정함으로써 연령 제한값을 수정할 수 있음
- 코드를 실행하면 의도한 대로 동작하는 것을 확인 가능

### 문제점

- reselct에서 제공하는 메모이제이션 기능이 동작하지 않음
- 두 개의 FriendMain 컴포넌트 인스턴스가 서로 다른 연령 제한 속성값을 갖기 때문
- 두 인스턴스는 같은 선택자 함수를 다른 속성값으로 호출하기 때문에,
  각 인스턴스 입장에서는 친구 목록과 연령 제한 정보가 변경되지 않더라도 선택자 함수의 입장에서 연령 제한 정보가 변경됨
- 즉, 선택자 함수는 이전의 결괏값을 재사용하지 못하고 매번 반복해서 연산을 수행함

*※ getFriendsWithAgeLimit 함수에 콘솔 로그를 추가하고, TimelineMain 컴포넌트를 렌더링한 후 '타임라인 추가'버튼을 눌러보면 친구 목록/연령 제한이 변경되지 않았음에도 콘솔 로그가 출력되는 것을 확인할 수 있음*

## 컴포넌트 인스턴스별로 독립된 메모이제이션 적용하기

> 컴포넌트 인스턴스별로 독립된 메모이제이션 기능을 제공하기 위해서는 선택자 함수도 여러 인스턴스로 만들어져야 함

### 선택자 함수 수정하기

> selector.js 파일 수정

```javascript
// ...
export const makeGetFriendsWithAgeLimit = () => {
  return createSelector([getFriends, getAgeLimit], (friends, ageLimit) =>
    friends.filter((friend) => friend.age <= ageLimit)
  );
};
```

-  기존 getFriendsWithAgeLimit, getFriendsWithAgeShowLimit 함수는 삭제
- 선택자 함수를 생성하는 함수 정의
- 각 컴포넌트 인스턴스가 makeGetFriendsWithAgeLimit 함수를 호출하면 자신만의 선택자 함수를 가질 수 있음

### 선택자 함수 호출 컴포넌트 수정하기

> FriendMain.js 파일 수정

```javascript
// ...
import { makeGetFriendsWithAgeLimit } from "../state/selector";

// ...
const makeMapStateToProps = () => {
  const getFriendsWithAgeLimit = makeGetFriendsWithAgeLimit();
  const mapStateToProps = (state, props) => {
    return {
      friendsWithAgeLimit: getFriendsWithAgeLimit(state, props),
    };
  };
  return mapStateToProps;
};

export default connect(makeMapStateToProps, actions)(FriendMain);

```

- mapStateToProps를 생성하는 makeMapStateToProps 함수 정의
- connect 함수의 첫 번째 매개변수로 전달된 함수가 새로운 함수를 반환하면, react-redux는 각 컴포넌트의 인스턴스별로 독립적인 mapStateToProps 함수의 인스턴스를 만들어서 사용
- mapStateToProps 함수가 생성될 때마다 getFriendsWithAgeLimit 선택자 함수도 생성됨
- 생성된 mapStateToProps 함수는 바로 위에서 생성된 선택자 함수를 기억하는 클로저가 됨
- 결과적으로 각 컴포넌트 인스턴스는 각자의 getFriendsWithAgeLimit 함수를 확보하는 셈

*※ makeGetFriendsWithAgeLimit 함수에 콘솔 로그를 추가한 뒤 '타임 라인 추가' 버튼을 클릭해보면 이제 해당 함수가 호출되지 않는 것을 확인할 수 있음*