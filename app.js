const mongo = require("mongodb").MongoClient;
const client = require("socket.io").listen(8080).sockets;

//connecting to mongodb
mongo.connect("mongodb://127.0.0.1/chatApi", function (err, db) {
  if (err) {
    throw new Error("not connected");
  }
  console.log("mongodb connected");

  client.on("connect", function () {
    let chat = db.collection("chats");

    // create function to send status
    sendStatus = function (s) {
      socket.emit("status", s);
    };

    //get chats from mongo collections
    chat
      .find()
      .limit(100)
      .sort({ _id: 1 })
      .toArray(function (err, res) {
        if (err) {
          throw err;
        }
        // emit the messages
        socket.emit("output", res);
      });
    //handle input events
    socket.on("input", function (date) {
      let name = data.name;
      let message = data.message;

      // check for name and messages
      if (name === "" || message === "") {
        // send status
        sendStatus("pls enter a name and a function");
      } else {
        //insert message
        chat.insert(
          {
            name: name,
            message: message,
          },
          function () {
            client.emit("output", [data]);
            
            //send status object
            sendStatus({
                message: "message sent",
                clear: true
            })
          }
        );
      }

    });
    //handle clear
    socket.on("clear", function (data){
        // remove all chat from the collection
        chat.remove({}, function(){
            // Emit cleared
            socket.emit("cleared")
        })
    })
  });
});
