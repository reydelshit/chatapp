 $(document).ready(() => {  
    var socket = io(); 
    var new_user = prompt('What is your name?'); 
    
    class Chatroom{
        constructor(new_user){
            this.new_user = new_user;   
        }

        room(){
            // io.emit will message all socket clients 
            // this will emit to server
            socket.emit('got_a_new_user', {new_user: this.new_user}); 
            // Listening to the server
            socket.on('user_joined', (new_user) => {
                console.log('New user from server:',new_user);
                let user_joining = document.createElement('p');
                let status = document.createElement('span'); 
                status.style.color = 'black';
                status.textContent = ' joined the group';
                user_joining.style.color = 'green'; 
                user_joining.textContent = '['+new_user.new_user+']'; 
                user_joining.appendChild(status);
                document.querySelector('.msg_box').appendChild(user_joining);
            });
        }
        messages(user){    
            console.log(user);
            let user_msg = document.createElement('p');
            user_msg.style.color = 'black';
            user_msg.textContent = user.message;
            console.log(user_msg); 

            document.querySelector('.msg_box').appendChild(user_msg); 
            document.querySelector('textarea').value = '';  
        }
        send(){  
            $('form').submit(function(){
                // there are three arguments that we are passing into $.post function
                //     1. the url we want to go to: '/quotes/create'
                //     2. what we want to send to this url: $(this).serialize()
                //            $(this) is the form and by calling .serialize() function on the form it will 
                //            send post data to the url with the names in the inputs as keys
                //     3. the function we want to run when we get a response:
                //            function(res) { $('#quotes').html(res) }
                $.post('/process',$(this).serialize(), (result) => {   
                    socket.emit('new_message', result);   
                }, 'json');
                // We have to return false for it to be a single page application. Without it,
                // jQuery's submit function will refresh the page, which defeats the point of AJAX.
                // The form below still contains 'action' and 'method' attributes, but they are ignored.
                return false;
            });
        }
    }
 
    const room = new Chatroom(new_user); 
    room.room(); 
    room.send();
    socket.on('msg_from_server', (messages) => {
        room.messages(messages);
    })
});


