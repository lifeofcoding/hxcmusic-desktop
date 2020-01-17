import React from 'react';

const {remote} = window.require('electron');
const path = window.require('path');
const fsx = window.require('fs-extra');

export default () => {
  const dataFile = path.resolve(remote.app.getAppPath(), 'src/data/hello-world.json');
  const data = fsx.readJSONSync(dataFile);
  return (
    <div className="card w-50">
      <div className="card-header">Loaded from local file:</div>
      <div className="card-body">
        <small>
          <pre className="m-0">{JSON.stringify(data, null, 2)}</pre>
        </small>
      </div>
    </div>
  );
};
