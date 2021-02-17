import React, { Component } from 'react';
import { ModalContatiner } from './modalStyle';
import {Button} from '../dashboard/button';

interface Props {
    id:string,
    title: string
    onChange: (open:boolean) => void,
    style?: any,
    mainContainerStyle?: any,
    isOpen: boolean,
    modalClass?: string,
    modalSize?: string
}
interface State {
    fadeType: any
}
export default class Modal extends React.Component<Props,State> {
    state: State = { fadeType: null };

    background = React.createRef();

    componentDidMount() {
        window.addEventListener('keydown', this.onEscKeyDown, false);
        setTimeout(() => this.setState({ fadeType: 'in' }), 0);
    }

    componentDidUpdate(prevProps:any, prevState:any) {
        if (!this.props.isOpen && prevProps.isOpen) {
            this.setState({ fadeType: 'out' });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.onEscKeyDown, false);
    }
    onEscKeyDown = (e: any) => {
        if (e.key !== 'Escape') return;
        this.setState({ fadeType: 'out' });
        this.props.onChange(false);
    };

    handleClick = (e:any) => {
        e.preventDefault();
        this.setState({ fadeType: 'out' });
        this.props.onChange(false);
    };

    render() {
        // console.log('component modal',this.props.isOpen);
        return(
            <>
                {(this.props.isOpen) && <ModalContatiner style={this.props.mainContainerStyle}  id={this.props.id} className={`wrapper ${'size-' + this.props.modalSize} fade-${this.state.fadeType} ${this.props.modalClass}`}>
                    <div className='box-dialog' style={this.props.style}>
                        <div className='box-header'>
                            <h4 className='box-title'>{this.props.title}</h4>
                            <Button onClick={this.handleClick} className='close'>
                                ×
                            </Button>
                        </div>
                        <div className='box-content'>{this.props.children}</div>
                    </div>
                    <div
                        className={`background`}
                        onMouseDown={this.handleClick}
                    />
                </ModalContatiner> }
            </>
        );
    }
}

