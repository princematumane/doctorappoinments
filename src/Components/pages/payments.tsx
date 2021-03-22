
import * as React from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import styled from 'styled-components';
import { api } from '../../api/api';
import { StartCards } from '../Cards/start';
const Maincontainter = styled.div`
height: 100%;
position:fixed;
width: 100%;
    .center{
        position: absolute;
        top: 100px;
        left: 150px;
        width: 80%;
        height: 80%;
        background: ${({ theme }) => theme.bodyAltLighter};
        border-radius: ${({ theme }) => theme.radius};
    }
    .searchSection{
        padding:30px;
        background: ${({ theme }) => theme.bodyAltLighter};
    }
    .searchSection span{
        padding-right:10px;
    }
    .filterSection{
        marginLeft:5px;
        display:inline-flex;
        padding:5px;
    }
    .membersListing{
        padding:20px;
        width:100%;
    }
`;
interface State {
    appId: string
}
export default class Payments extends React.Component {
    state: State = {
        appId: ''
    }
    componentDidMount() {
        document.title = 'Payments ';
        const url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);
        this.setState({ appId: id });
        console.log('xxx in manage paymenta', id);
    }
    render() {
        return (
            <Maincontainter>
                <div className="center">
                    <StartCards appId={this.state.appId} />
                </div>
            </Maincontainter>
        );
    }
}