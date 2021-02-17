import React, { Component } from 'react';

interface Props {
    activeTab: number,
    handleTab: (tabNumber : number) => void,
    tabs: any[],
}
interface State {
    activeTab: number,
    tabs: any[],
}
export class TabManager extends React.Component<Props, State> {
    state: State = {
        activeTab: 1,
        tabs:[]
    }

    render() {
        const { activeTab, handleTab, tabs } = this.props;
        return (
            <div className='tab-manager'>
                {tabs.map(({ label, value }) => (
                    <div style={{padding:'5px'}} key={value+label}
                         className={`tab ${value === activeTab ? 'selected-tab' : ''}`}
                         onClick={() => { handleTab(value); }}
                    >
                        {label}
                    </div>
                ))}
            </div>
        );
    }
}
