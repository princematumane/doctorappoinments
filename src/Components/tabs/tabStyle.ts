import styled from 'styled-components';

export const TabsStyle = styled.div`
  padding: 15px;
    .tab-manager {
      display: flex;
      border-bottom: 1px solid #48484859;
    }
    .tab {
      border-radius: 3px;
      text-align: center;
      cursor: pointer;
      font-size: 16px;
      margin-right:10px;
      letter-spacing: 0.5px;
      transition: all 0.5s ease;
      background-color:#424348;
      color: gray;
      user-select: none;
    }
    .tab:hover {
      background-color: ${({ theme }) => theme.bodyAlt};
      font-size:18px;
      color: ${({ theme }) => theme.focusColor};
      opacity:0.9;
    }

    .selected-tab {
      background-color: #35363a;
      color: ${({ theme }) => theme.focusColor};
      border-top: 2px solid red;
    }

    .tab-content {
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

`;
