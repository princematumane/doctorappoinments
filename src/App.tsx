
import * as React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Link, NavLink, Switch } from "react-router-dom";
import { Navbar } from "./Components/Navbar";
import { GlobalStyles, themeList } from "./themes";
import { ThemeProvider } from 'styled-components';
import { hot } from 'react-hot-loader/root'
import { Home } from "./Components/pages/home";
import { Login } from "./Components/pages/login";
import { Register } from "./Components/pages/register";
import { api } from "./api/api";

interface Props { }
interface State {

}

class App extends React.Component<Props, State> {
    state: State = {

    }


    constructor(props: any) {
        super(props)
        api.loadUserInfo();
    }

    componentDidMount() {
        console.log(window.location.pathname);
        console.log(document.title);
    }
    loadData = async (key: string) => {
        document.title = key;
    }
    render() {

            return (
                <div>
                    <ThemeProvider theme={themeList[0]}>
                        <GlobalStyles />
                        <BrowserRouter>
                            <Navbar/>
                            <Switch>
                                <Route exact path='/' component={Login}>
                                </Route>
                                <Route exact path='/home' component={Home}/>
                                <Route exact path='/login' component={Login}/>
                                <Route exact path='/register' component={Register}/>
                                <Route>
                                    Error 404 Not found
                                </Route>
                            </Switch>
                        </BrowserRouter>
                    </ThemeProvider>
                </div>
            )
        }

}
export default hot(App)
