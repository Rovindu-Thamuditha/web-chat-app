console.log("Hello");
(function(){
    
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join-screen #join-user").addEventListener("click",function(){
        console.log("Joined");
        let username = app.querySelector(".join-screen #username").value;
        if(username.length == 0){
            swal("Error!", "You must enter a username before join a chatroom!", "error");
            return;
        };
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    });

    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){
        let message = app.querySelector("#message").value;
        if (message.length == 0){
            swal("Error!", "You must enter the message before you send.", "error");
            return;
        };
        renderMessage("outgoing", {
            username: uname,
            text: message
        });
        socket.emit("chat", {
            username: uname,
            text: message
        });
        app.querySelector("#message").value = "";
    });

    app.querySelector("#exit-channel").addEventListener("click", function(){
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function(update){
        renderMessage("update", update);
    });

    socket.on("chat", function(message){
        renderMessage("incoming", message);
    });

    function renderMessage(type, message){
        let messageContainer = app.querySelector(".messages");
        if(type == "outgoing"){
            let el = document.createElement("div");
            el.setAttribute("class", "message outgoing-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
                `;
            messageContainer.appendChild(el);
        }else if(type == "incoming"){
            let el = document.createElement("div");
            el.setAttribute("class", "message incoming-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
                `;
            messageContainer.appendChild(el);
        }else if(type == "update"){
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        //  Scroll the chat upward
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;

    };

})();