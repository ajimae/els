config = {
  _id: "spike",
  members: [
    { _id: 1, host: "127.0.0.1:27017"},
    { _id: 2, host: "127.0.0.1:27018"},
    { _id: 3, host: "127.0.0.1:27019"},
  ]
};

resizeBy.initiate(config);
resizeBy.status()