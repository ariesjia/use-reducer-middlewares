import * as React from 'react'
import {storiesOf} from '@storybook/react'
import {action} from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

storiesOf('home', module)
    .add('home', () => (
        <div className="section container">
          <h1 className="title">use-reducer-middlewares</h1>
          <h2 className="subtitle">enhance React Hooks API useReducer to apply middlewares</h2>
          <div className="content">
          </div>
          <div className="content">
            <h3 className="strong">Install</h3>
            <blockquote>
              npm install use-reducer-middlewares
            </blockquote>
          </div>
          <div className="content">
            <h3 className="strong">Use</h3>
            <blockquote>
              <p>import useForm from 'use-reducer-middlewares'</p>
              <p>
                const [state, dispatch] = useMiddleWares(reducer, initialState)([
                  thunkMiddleware
                ]);
              </p>
            </blockquote>
          </div>
          <div className="content">
            <h3 className="strong">Demos</h3>
            <ol type="1">
              <li>
                base use
                <button onClick={linkTo('demo', 'thunk test')}>Demo</button>
              </li>
            </ol>
          </div>

        </div>
    ))
