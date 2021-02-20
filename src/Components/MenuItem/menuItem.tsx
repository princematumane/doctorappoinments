import * as React from 'react';
import styled, { css } from 'styled-components'
import { Link, Redirect } from 'react-router-dom';




const MenuItem = styled.button`
    color: ${({ theme }) => theme.text};
    width: auto;
    border: none;
    border-radius: 5px;
    margin-bottom: 2px;
    background: ${({ theme }) => theme.body};
    box-sizing: border-box;
    display: flex;
    flex: 1;
    flex-direction: row;
    transition: all 0.1s linear;
    border: 2px solid ${({ theme }) => theme.body};
    font-weight: bold;

    :focus {
        outline: 0;
        border: 2px solid ${({ theme }) => theme.focusColor};
    }

    :active {
        background: ${({ theme }) => theme.focusColor};
        color: ${({ theme }) => theme.bodyAlt};
    }

    :hover {
        background: ${({ theme }) => theme.bodyAlt};
        color: ${({ theme }) => theme.focusColor};
    }

    div.icon {
        margin-top: 4px;
        margin-right: 8px;
        background: ${({ theme }) => theme.bodyAltLighter};
        height: 36px;
        width: 36px;
        border-radius:18px;
        padding: 10px;
        line-height: 10px;
    }

    div.text {
        flex: 1;
        padding: 10px 5px;
        text-align: left;
    }

    div.children {
        flex: 0;
        padding: 5px;
    }

    cursor:pointer;
`;

// tslint:disable-next-line: no-empty-interface
interface Props {
    onClick?: (e?: any) => any;
    title: string;
    icon: string;
    href?: string;
    to?: string;

}

// tslint:disable-next-line: no-empty-interface
interface State { link: boolean }



export class MenuItemObject extends React.Component<Props, State> {
    state = { link: false }

    render() {
        if (this.state.link && this.props.to) {
            return <Redirect to={this.props.to} />
        }
        return <MenuItem onClick={(e) => {

            if (this.props.to) {
                this.setState({ link: true }, () => {
                    if (this.props.onClick) this.props.onClick(e);
                });
                return;
            }

            if (this.props.href) window.location.replace(this.props.href);
            if (this.props.onClick) this.props.onClick(e);

        }} >
            <div className='icon'><i className={this.props.icon} /></div>
            <div className='text'>{this.props.title}</div>
            <div className='children'>{this.props.children}</div>
        </MenuItem>
    }

}
