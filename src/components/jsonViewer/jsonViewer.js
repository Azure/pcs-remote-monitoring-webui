// Copyright (c) Microsoft. All rights reserved.

import React from 'react';

import './jsonViewer.css';

class JsonViewer extends React.Component {
  onCopy = e => {
    window.getSelection().removeAllRanges();
    const range = document.createRange();
    this.refs.content.focus();
    range.selectNode(this.refs.content);
    window.getSelection().addRange(range);
    document.execCommand('copy');
  };

  render() {
    return (
      <div className="jsonViewerTile">
        <pre ref="content" className="jsonViewerContent">
          {JSON.stringify(this.props.data, null, '  ')}
        </pre>
        {this.props.showButton &&
          <button
            className="btn btn-default jsonViewerButton"
            onClick={this.onCopy}
          >
            Copy
          </button>}
      </div>
    );
  }
}

export default JsonViewer;
